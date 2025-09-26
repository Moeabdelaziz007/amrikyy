#!/bin/bash

echo "🔒 Setting up SSL Certificates for AuraOS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    print_warning "Certbot is not installed. Installing..."
    
    # Detect OS and install certbot
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y certbot python3-certbot-nginx
        elif command -v yum &> /dev/null; then
            sudo yum install -y certbot python3-certbot-nginx
        else
            print_error "Unsupported Linux distribution. Please install certbot manually."
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install certbot
        else
            print_error "Homebrew is required for macOS. Please install Homebrew first."
            exit 1
        fi
    else
        print_error "Unsupported OS. Please install certbot manually."
        exit 1
    fi
fi

# Create SSL directory structure
print_status "Creating SSL directory structure..."
mkdir -p ssl/{live,archive,renewal}
mkdir -p ssl/letsencrypt

# Function to generate self-signed certificates (for development)
generate_self_signed() {
    print_info "Generating self-signed certificates for development..."
    
    # Generate private key
    openssl genrsa -out ssl/auraos.key 2048
    
    # Generate certificate signing request
    openssl req -new -key ssl/auraos.key -out ssl/auraos.csr -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"
    
    # Generate self-signed certificate
    openssl x509 -req -days 365 -in ssl/auraos.csr -signkey ssl/auraos.key -out ssl/auraos.crt
    
    # Create combined certificate for nginx
    cat ssl/auraos.crt ssl/auraos.key > ssl/auraos.pem
    
    print_status "✅ Self-signed certificates generated"
    print_warning "⚠️  These are for development only. Use Let's Encrypt for production."
}

# Function to setup Let's Encrypt certificates
setup_letsencrypt() {
    local domain=$1
    
    if [ -z "$domain" ]; then
        print_error "Domain is required for Let's Encrypt setup"
        print_info "Usage: $0 letsencrypt yourdomain.com"
        exit 1
    fi
    
    print_info "Setting up Let's Encrypt certificates for domain: $domain"
    
    # Stop nginx if running
    sudo systemctl stop nginx 2>/dev/null || true
    
    # Obtain certificate
    sudo certbot certonly --standalone -d $domain --non-interactive --agree-tos --email admin@$domain
    
    # Create symlinks for easier management
    sudo ln -sf /etc/letsencrypt/live/$domain/fullchain.pem ssl/auraos.crt
    sudo ln -sf /etc/letsencrypt/live/$domain/privkey.pem ssl/auraos.key
    sudo ln -sf /etc/letsencrypt/live/$domain/fullchain.pem ssl/auraos.pem
    
    # Set proper permissions
    sudo chmod 600 ssl/auraos.key
    sudo chmod 644 ssl/auraos.crt
    
    print_status "✅ Let's Encrypt certificates obtained and configured"
    
    # Setup auto-renewal
    setup_auto_renewal $domain
}

# Function to setup auto-renewal
setup_auto_renewal() {
    local domain=$1
    
    print_info "Setting up automatic certificate renewal..."
    
    # Create renewal script
    cat > ssl/renew.sh << EOF
#!/bin/bash
echo "Renewing SSL certificates for $domain..."
sudo certbot renew --quiet
sudo systemctl reload nginx
echo "SSL certificates renewed successfully"
EOF
    
    chmod +x ssl/renew.sh
    
    # Add cron job for auto-renewal (runs twice daily)
    (crontab -l 2>/dev/null; echo "0 12,0 * * * $(pwd)/ssl/renew.sh") | crontab -
    
    print_status "✅ Auto-renewal configured"
}

# Function to create SSL-enabled nginx configuration
create_ssl_nginx_config() {
    local domain=$1
    
    print_info "Creating SSL-enabled nginx configuration..."
    
    cat > nginx-ssl.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    upstream auraos_backend {
        server auraos-backend:3002;
    }
    
    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }
    
    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name _;
        
        # SSL certificates
        ssl_certificate /app/ssl/auraos.crt;
        ssl_certificate_key /app/ssl/auraos.key;
        
        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://auraos_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
            proxy_timeout 30s;
        }
        
        # Health check
        location /health {
            proxy_pass http://auraos_backend;
            proxy_set_header Host $host;
            access_log off;
        }
        
        # Metrics (restricted)
        location /metrics {
            allow 127.0.0.1;
            allow 10.0.0.0/8;
            deny all;
            proxy_pass http://auraos_backend;
            proxy_set_header Host $host;
        }
        
        # Default location
        location / {
            proxy_pass http://auraos_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
        }
    }
}
EOF
    
    print_status "✅ SSL-enabled nginx configuration created"
}

# Main script logic
case "$1" in
    "self-signed")
        generate_self_signed
        create_ssl_nginx_config
        ;;
    "letsencrypt")
        setup_letsencrypt $2
        create_ssl_nginx_config $2
        ;;
    "renew")
        ssl/renew.sh
        ;;
    *)
        echo "Usage: $0 {self-signed|letsencrypt <domain>|renew}"
        echo ""
        echo "Options:"
        echo "  self-signed     Generate self-signed certificates for development"
        echo "  letsencrypt     Obtain Let's Encrypt certificates for production"
        echo "  renew          Renew existing certificates"
        echo ""
        echo "Examples:"
        echo "  $0 self-signed"
        echo "  $0 letsencrypt yourdomain.com"
        echo "  $0 renew"
        exit 1
        ;;
esac

print_status "🎉 SSL setup completed!"
print_info "Next steps:"
print_info "1. Update your docker-compose.production.yml to use nginx-ssl.conf"
print_info "2. Restart your services: docker-compose -f docker-compose.production.yml restart"
print_info "3. Test SSL: curl -k https://localhost"
