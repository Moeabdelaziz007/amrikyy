import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  theme: string;
  colors: string[];
  particleCount?: number;
  className?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  theme,
  colors,
  particleCount = 30,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles based on theme
    const initializeParticles = () => {
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        const particle: Particle = {
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: Math.random() * 300 + 200,
        };
        particlesRef.current.push(particle);
      }
    };

    initializeParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Update opacity based on life
        const lifeRatio = particle.life / particle.maxLife;
        particle.opacity = Math.sin(lifeRatio * Math.PI) * 0.5 + 0.2;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Reset particle if it's lived too long
        if (particle.life > particle.maxLife) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = 0;
          particle.color = colors[Math.floor(Math.random() * colors.length)];
        }
      });

      // Draw connections between nearby particles
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = ((100 - distance) / 100) * 0.1;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme, colors, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

// Specialized particle systems for different themes
export const MatrixParticles: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const [matrixChars, setMatrixChars] = React.useState<string[]>([]);

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    const chars =
      '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    setMatrixChars(chars.split(''));
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-400 font-mono text-sm opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        >
          {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
        </motion.div>
      ))}
    </div>
  );
};

export const StarField: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 3 + 1,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
