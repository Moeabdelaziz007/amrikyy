"""
Unit tests for security module
"""

import pytest
from unittest.mock import Mock, patch
from datetime import datetime, timedelta

from auraos.core.security import (
    SecurityConfig,
    PasswordValidator,
    TokenManager,
    InputSanitizer,
    RateLimiter,
    SecurityHeaders,
    get_security_config,
    hash_password,
    verify_password,
    generate_secure_token,
    generate_file_hash
)

class TestSecurityConfig:
    """Test SecurityConfig class"""
    
    def test_security_config_creation(self):
        """Test creating security configuration"""
        config = SecurityConfig(
            secret_key="test_secret_key_that_is_long_enough",
            algorithm="HS256",
            access_token_expire_minutes=30
        )
        
        assert config.secret_key == "test_secret_key_that_is_long_enough"
        assert config.algorithm == "HS256"
        assert config.access_token_expire_minutes == 30
    
    def test_secret_key_validation(self):
        """Test secret key validation"""
        with pytest.raises(ValueError, match="Secret key must be at least 32 characters long"):
            SecurityConfig(secret_key="short")
    
    def test_cors_origins_parsing(self):
        """Test CORS origins parsing"""
        config = SecurityConfig(
            secret_key="test_secret_key_that_is_long_enough",
            cors_origins="http://localhost:3000,https://example.com"
        )
        
        assert config.cors_origins == ["http://localhost:3000", "https://example.com"]

class TestPasswordValidator:
    """Test PasswordValidator class"""
    
    def test_password_validation_strong(self):
        """Test strong password validation"""
        config = SecurityConfig(secret_key="test_secret_key_that_is_long_enough")
        validator = PasswordValidator(config)
        
        result = validator.validate_password("StrongPass123!")
        
        assert result["valid"] is True
        assert len(result["errors"]) == 0
        assert result["strength"] == "strong"
    
    def test_password_validation_weak(self):
        """Test weak password validation"""
        config = SecurityConfig(secret_key="test_secret_key_that_is_long_enough")
        validator = PasswordValidator(config)
        
        result = validator.validate_password("weak")
        
        assert result["valid"] is False
        assert len(result["errors"]) > 0
        assert result["strength"] == "weak"
    
    def test_password_validation_medium(self):
        """Test medium password validation"""
        config = SecurityConfig(secret_key="test_secret_key_that_is_long_enough")
        validator = PasswordValidator(config)
        
        result = validator.validate_password("MediumPass123")
        
        assert result["valid"] is True
        assert result["strength"] == "medium"

class TestTokenManager:
    """Test TokenManager class"""
    
    def test_create_access_token(self):
        """Test creating access token"""
        config = SecurityConfig(secret_key="test_secret_key_that_is_long_enough")
        manager = TokenManager(config)
        
        data = {"user_id": "test_user", "role": "user"}
        token = manager.create_access_token(data)
        
        assert token is not None
        assert isinstance(token, str)
    
    def test_verify_token_valid(self):
        """Test verifying valid token"""
        config = SecurityConfig(secret_key="test_secret_key_that_is_long_enough")
        manager = TokenManager(config)
        
        data = {"user_id": "test_user", "role": "user"}
        token = manager.create_access_token(data)
        
        payload = manager.verify_token(token)
        
        assert payload is not None
        assert payload["user_id"] == "test_user"
        assert payload["role"] == "user"
    
    def test_verify_token_invalid(self):
        """Test verifying invalid token"""
        config = SecurityConfig(secret_key="test_secret_key_that_is_long_enough")
        manager = TokenManager(config)
        
        payload = manager.verify_token("invalid_token")
        
        assert payload is None

class TestInputSanitizer:
    """Test InputSanitizer class"""
    
    def test_sanitize_string(self):
        """Test string sanitization"""
        # Test null byte removal
        result = InputSanitizer.sanitize_string("test\x00string")
        assert result == "teststring"
        
        # Test whitespace trimming
        result = InputSanitizer.sanitize_string("  test  ")
        assert result == "test"
        
        # Test length limiting
        long_string = "a" * 10001
        result = InputSanitizer.sanitize_string(long_string)
        assert len(result) == 10000
    
    def test_sanitize_filename(self):
        """Test filename sanitization"""
        # Test path traversal removal
        result = InputSanitizer.sanitize_filename("../../../etc/passwd")
        assert result == "passwd"
        
        # Test dangerous character replacement
        result = InputSanitizer.sanitize_filename("file<>:\"|?*.txt")
        assert result == "file_______.txt"
        
        # Test length limiting
        long_filename = "a" * 300 + ".txt"
        result = InputSanitizer.sanitize_filename(long_filename)
        assert len(result) <= 255
    
    def test_sanitize_sql_input(self):
        """Test SQL input sanitization"""
        # Test SQL injection pattern removal
        result = InputSanitizer.sanitize_sql_input("'; DROP TABLE users; --")
        assert "DROP TABLE" not in result
        assert "users" not in result

class TestRateLimiter:
    """Test RateLimiter class"""
    
    @pytest.mark.asyncio
    async def test_rate_limiter_allowed(self):
        """Test rate limiter allowing requests"""
        mock_redis = Mock()
        mock_redis.incr = AsyncMock(return_value=1)
        mock_redis.expire = AsyncMock(return_value=True)
        
        limiter = RateLimiter(mock_redis)
        
        result = await limiter.is_allowed("test_key", 10, 60)
        
        assert result is True
        mock_redis.incr.assert_called_once_with("test_key")
        mock_redis.expire.assert_called_once_with("test_key", 60)
    
    @pytest.mark.asyncio
    async def test_rate_limiter_blocked(self):
        """Test rate limiter blocking requests"""
        mock_redis = Mock()
        mock_redis.incr = AsyncMock(return_value=11)
        mock_redis.expire = AsyncMock(return_value=True)
        
        limiter = RateLimiter(mock_redis)
        
        result = await limiter.is_allowed("test_key", 10, 60)
        
        assert result is False
    
    @pytest.mark.asyncio
    async def test_get_remaining(self):
        """Test getting remaining requests"""
        mock_redis = Mock()
        mock_redis.get = AsyncMock(return_value="5")
        
        limiter = RateLimiter(mock_redis)
        
        result = await limiter.get_remaining("test_key", 10)
        
        assert result == 5

class TestSecurityHeaders:
    """Test SecurityHeaders class"""
    
    def test_get_security_headers(self):
        """Test getting security headers"""
        headers = SecurityHeaders.get_security_headers()
        
        assert "X-Frame-Options" in headers
        assert "X-Content-Type-Options" in headers
        assert "X-XSS-Protection" in headers
        assert "Strict-Transport-Security" in headers
        assert headers["X-Frame-Options"] == "DENY"
        assert headers["X-Content-Type-Options"] == "nosniff"

class TestUtilityFunctions:
    """Test utility functions"""
    
    def test_hash_password(self):
        """Test password hashing"""
        password = "test_password"
        hashed = hash_password(password)
        
        assert hashed != password
        assert len(hashed) > 0
        assert hashed.startswith("$2b$")
    
    def test_verify_password(self):
        """Test password verification"""
        password = "test_password"
        hashed = hash_password(password)
        
        assert verify_password(password, hashed) is True
        assert verify_password("wrong_password", hashed) is False
    
    def test_generate_secure_token(self):
        """Test secure token generation"""
        token = generate_secure_token(32)
        
        assert len(token) > 0
        assert isinstance(token, str)
        
        # Test uniqueness
        token2 = generate_secure_token(32)
        assert token != token2
    
    @patch('auraos.core.security.Path')
    def test_generate_file_hash(self, mock_path):
        """Test file hash generation"""
        mock_file = Mock()
        mock_file.read.return_value = b"test content"
        mock_path.return_value.__enter__.return_value = mock_file
        
        hash_value = generate_file_hash("test.txt")
        
        assert hash_value is not None
        assert len(hash_value) == 64  # SHA256 hex length

@patch.dict('os.environ', {
    'SECRET_KEY': 'test_secret_key_that_is_long_enough',
    'JWT_ALGORITHM': 'HS256',
    'JWT_ACCESS_TOKEN_EXPIRE_MINUTES': '30',
    'ALLOWED_HOSTS': 'localhost,127.0.0.1',
    'CORS_ORIGINS': 'http://localhost:3000'
})
def test_get_security_config():
    """Test getting security configuration from environment"""
    config = get_security_config()
    
    assert config.secret_key == 'test_secret_key_that_is_long_enough'
    assert config.algorithm == 'HS256'
    assert config.access_token_expire_minutes == 30
    assert config.allowed_hosts == ['localhost', '127.0.0.1']
    assert config.cors_origins == ['http://localhost:3000']
