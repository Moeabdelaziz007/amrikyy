import React, { useEffect, useRef } from 'react';

const Animated3DBackground = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef();
  const particlesRef = useRef([]);
  const connectionsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.z = Math.random() * 1000;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = Math.random() * 0.5 + 0.1;
        this.vz = Math.random() * 2 + 0.5;
        this.size = Math.random() * 3 + 1;
        this.hue = Math.random() * 60 + 200; // Blue-cyan range
        this.opacity = Math.random() * 0.8 + 0.2;
        this.life = 1;
        this.decay = Math.random() * 0.005 + 0.001;
      }

      update() {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;
        this.z -= this.vz;

        // 3D effect
        const scale = 1000 / (1000 + this.z);
        this.screenX = this.x * scale + canvas.width / 2;
        this.screenY = this.y * scale + canvas.height / 2;
        this.screenSize = this.size * scale;

        // Life decay
        this.life -= this.decay;

        // Reset if out of bounds or dead
        if (this.screenY > canvas.height + 50 || this.z <= 0 || this.life <= 0) {
          this.reset();
        }

        // Mouse interaction
        const dx = mouseRef.current.x - this.screenX;
        const dy = mouseRef.current.y - this.screenY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.vx += (dx / distance) * force * 0.01;
          this.vy += (dy / distance) * force * 0.01;
        }
      }

      draw(ctx) {
        if (this.z > 900) return;

        ctx.save();
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
          this.screenX, this.screenY, 0,
          this.screenX, this.screenY, this.screenSize * 2
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, ${this.opacity * this.life})`);
        gradient.addColorStop(0.4, `hsla(${this.hue}, 70%, 50%, ${this.opacity * this.life * 0.5})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 60%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.screenX, this.screenY, this.screenSize * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.fillStyle = `hsla(${this.hue}, 90%, 70%, ${this.opacity * this.life})`;
        ctx.beginPath();
        ctx.arc(this.screenX, this.screenY, this.screenSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Neural network connections
    class Connection {
      constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.opacity = 0;
      }

      update() {
        const dx = this.p1.screenX - this.p2.screenX;
        const dy = this.p1.screenY - this.p2.screenY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          this.opacity = Math.min(0.3, (150 - distance) / 150 * 0.3);
        } else {
          this.opacity = 0;
        }
      }

      draw(ctx) {
        if (this.opacity <= 0) return;

        ctx.save();
        ctx.strokeStyle = `rgba(0, 200, 255, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.p1.screenX, this.p1.screenY);
        ctx.lineTo(this.p2.screenX, this.p2.screenY);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Initialize particles
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    // Create connections
    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        connectionsRef.current.push(new Connection(particlesRef.current[i], particlesRef.current[j]));
      }
    }

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 5, 16, 0.1)');
      gradient.addColorStop(0.5, 'rgba(10, 15, 28, 0.1)');
      gradient.addColorStop(1, 'rgba(20, 26, 46, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw connections
      connectionsRef.current.forEach(connection => {
        connection.update();
        connection.draw(ctx);
      });

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      // Add floating geometric shapes
      const time = Date.now() * 0.001;
      
      // Floating hexagons
      for (let i = 0; i < 3; i++) {
        const x = Math.sin(time + i * 2) * 100 + canvas.width / 2;
        const y = Math.cos(time * 0.7 + i * 1.5) * 50 + canvas.height / 2;
        const size = 20 + Math.sin(time + i) * 5;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time + i);
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 + Math.sin(time + i) * 0.1})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let j = 0; j < 6; j++) {
          const angle = (j / 6) * Math.PI * 2;
          const px = Math.cos(angle) * size;
          const py = Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="animated-3d-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default Animated3DBackground;
