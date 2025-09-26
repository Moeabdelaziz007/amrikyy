import { motion } from 'framer-motion';
import { ParticleSystem, MatrixParticles, StarField } from './ParticleSystem';

export interface WallpaperTheme {
  id: string;
  name: string;
  type: 'gradient' | 'animated' | 'particle';
  colors: string[];
  animation?: {
    duration: number;
    direction: 'horizontal' | 'vertical' | 'radial' | 'diagonal';
  };
  particles?: {
    count: number;
    speed: number;
    size: number;
  };
}

const WALLPAPER_THEMES: WallpaperTheme[] = [
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    type: 'animated',
    colors: ['#0f0f23', '#1a1a2e', '#16213e', '#0f3460', '#533483'],
    animation: { duration: 20, direction: 'radial' },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    type: 'animated',
    colors: ['#0a0a0a', '#1a0033', '#330066', '#6600cc', '#00ff88'],
    animation: { duration: 15, direction: 'diagonal' },
  },
  {
    id: 'sunset',
    name: 'Digital Sunset',
    type: 'animated',
    colors: ['#ff6b6b', '#ffa726', '#ffcc02', '#4ecdc4', '#45b7d1'],
    animation: { duration: 25, direction: 'horizontal' },
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    type: 'animated',
    colors: ['#001122', '#003366', '#0066aa', '#0099ff', '#00ccff'],
    animation: { duration: 30, direction: 'vertical' },
  },
  {
    id: 'matrix',
    name: 'Matrix Code',
    type: 'particle',
    colors: ['#000000', '#001100', '#003300', '#00ff00'],
    particles: { count: 50, speed: 2, size: 2 },
  },
  {
    id: 'galaxy',
    name: 'Galaxy Spiral',
    type: 'animated',
    colors: ['#000000', '#1a0033', '#330066', '#6600cc', '#9900ff'],
    animation: { duration: 40, direction: 'radial' },
  },
];

interface WallpaperManagerProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  className?: string;
}

export const WallpaperManager: React.FC<WallpaperManagerProps> = ({
  currentTheme,
  onThemeChange: _onThemeChange,
  className = '',
}) => {
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const theme =
    WALLPAPER_THEMES.find(t => t.id === currentTheme) || WALLPAPER_THEMES[0];

  // Update time of day based on actual time
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      setTimeOfDay(hour >= 6 && hour < 18 ? 'day' : 'night');
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Track mouse movement for interactive effects
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderGradientBackground = () => {
    const baseColors = theme.colors;
    const adjustedColors =
      timeOfDay === 'night'
        ? baseColors.map(color => color + '80') // Add transparency for night
        : baseColors;

    if (theme.type === 'animated' && theme.animation) {
      const { direction, duration } = theme.animation;

      let gradientDirection = '';
      switch (direction) {
        case 'horizontal':
          gradientDirection = 'to right';
          break;
        case 'vertical':
          gradientDirection = 'to bottom';
          break;
        case 'diagonal':
          gradientDirection = '135deg';
          break;
        case 'radial':
          gradientDirection = 'circle at center';
          break;
      }

      return (
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `linear-gradient(${gradientDirection}, ${adjustedColors.join(', ')})`,
              `linear-gradient(${gradientDirection}, ${[...adjustedColors].reverse().join(', ')})`,
              `linear-gradient(${gradientDirection}, ${adjustedColors.join(', ')})`,
            ],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      );
    }

    return (
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${adjustedColors.join(', ')})`,
        }}
      />
    );
  };

  const renderParticleEffect = () => {
    if (theme.type !== 'particle' || !theme.particles) return null;

    const { count } = theme.particles;

    // Special particle effects for specific themes
    if (theme.id === 'matrix') {
      return <MatrixParticles className="opacity-30" />;
    }

    if (theme.id === 'galaxy') {
      return <StarField className="opacity-40" />;
    }

    // Default particle system
    return (
      <ParticleSystem
        theme={theme.id}
        colors={theme.colors}
        particleCount={count}
        className="opacity-60"
      />
    );
  };

  const renderInteractiveOverlay = () => {
    return (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(255,255,255,0.1) 0%, 
            rgba(255,255,255,0.05) 30%, 
            transparent 70%)`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  };

  return (
    <div className={`absolute inset-0 ${className}`}>
      {renderGradientBackground()}
      {renderParticleEffect()}
      {renderInteractiveOverlay()}

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export { WALLPAPER_THEMES };
