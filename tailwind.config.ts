// @ts-ignore
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './client/index.html',
    './client/src/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx,html}',
    './*.html',
  ],
  safelist: [
    // Text gradient utilities
    'bg-clip-text',
    'text-transparent',
    // Backdrop blur utilities for glassmorphism
    'backdrop-blur-sm',
    'backdrop-blur',
    'backdrop-blur-md',
    'backdrop-blur-lg',
    // Neon shadow presets
    'shadow-glow-sm',
    'shadow-glow-md',
    'shadow-glow-lg',
    'shadow-glow-green-md',
    'shadow-glow-blue-md',
    'shadow-glow-purple-md',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--border-radius-lg)',
        md: 'var(--border-radius-md)',
        sm: 'var(--border-radius-sm)',
        xl: 'var(--border-radius-xl)',
      },
      colors: {
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',

        // Neon Color Palette
        neon: {
          green: 'var(--neon-green)',
          blue: 'var(--cyber-blue)',
          purple: 'var(--vivid-purple)',
          pink: 'var(--neon-pink)',
          yellow: 'var(--electric-yellow)',
          orange: 'var(--cyber-orange)',
        },

        // Status Colors
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          error: 'var(--status-error)',
          info: 'var(--status-info)',
        },

        // Glass Colors
        glass: {
          primary: 'var(--glass-bg-primary)',
          secondary: 'var(--glass-bg-secondary)',
          tertiary: 'var(--glass-bg-tertiary)',
          border: 'var(--glass-border-primary)',
          'border-secondary': 'var(--glass-border-secondary)',
        },

        // Legacy colors for compatibility
        card: {
          DEFAULT: 'var(--glass-bg-primary)',
          foreground: 'var(--text-primary)',
        },
        popover: {
          DEFAULT: 'var(--glass-bg-secondary)',
          foreground: 'var(--text-primary)',
        },
        primary: {
          DEFAULT: 'var(--neon-green)',
          foreground: 'var(--bg-primary)',
        },
        secondary: {
          DEFAULT: 'var(--cyber-blue)',
          foreground: 'var(--bg-primary)',
        },
        muted: {
          DEFAULT: 'var(--bg-secondary)',
          foreground: 'var(--text-secondary)',
        },
        accent: {
          DEFAULT: 'var(--vivid-purple)',
          foreground: 'var(--bg-primary)',
        },
        destructive: {
          DEFAULT: 'var(--status-error)',
          foreground: 'var(--bg-primary)',
        },
        border: 'var(--glass-border-primary)',
        input: 'var(--glass-bg-secondary)',
        ring: 'var(--neon-green)',

        // Professional Designer Colors (legacy)
        cyber: {
          cyan: '#00d9ff',
          pink: '#ff6b9d',
          purple: '#9d4edd',
          green: '#00ff88',
          orange: '#ffb347',
          red: '#ff4757',
          navy: '#0f172a',
          slate: '#1e293b',
          lightSlate: '#334155',
        },
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],

        // Cyberpunk Fonts
        cyberpunk: ['Orbitron', 'system-ui', 'sans-serif'],
        futuristic: ['Oxanium', 'system-ui', 'sans-serif'],
        tech: ['Audiowide', 'system-ui', 'sans-serif'],
        modern: ['Rajdhani', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
        fadeIn: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideIn: {
          from: {
            transform: 'translateX(-10px)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'neon-pulse': {
          '0%, 100%': {
            boxShadow: 'var(--neon-glow-sm)',
          },
          '50%': {
            boxShadow: 'var(--neon-glow-lg)',
          },
        },
        'neon-flicker': {
          '0%, 100%': {
            opacity: '1',
            textShadow:
              '0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary)), 0 0 15px hsl(var(--primary))',
          },
          '50%': {
            opacity: '0.8',
            textShadow:
              '0 0 2px hsl(var(--primary)), 0 0 5px hsl(var(--primary)), 0 0 8px hsl(var(--primary))',
          },
        },
        'cyber-pulse': {
          '0%, 100%': {
            filter: 'brightness(1) saturate(1)',
          },
          '50%': {
            filter: 'brightness(1.2) saturate(1.5)',
          },
        },
        'cyber-scan': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '50%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
        },
        'matrix-rain': {
          '0%': {
            transform: 'translateY(-100vh)',
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '90%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(100vh)',
            opacity: '0',
          },
        },
        'hologram-flicker': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '25%': {
            opacity: '0.8',
            transform: 'scale(1.02)',
          },
          '50%': {
            opacity: '0.9',
            transform: 'scale(0.98)',
          },
          '75%': {
            opacity: '0.85',
            transform: 'scale(1.01)',
          },
        },
        'holographic-shift': {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
        'neon-glow': {
          '0%, 100%': {
            boxShadow: 'var(--neon-glow-sm)',
          },
          '50%': {
            boxShadow: 'var(--neon-glow-lg)',
          },
        },
        'cyber-border': {
          '0%, 100%': {
            borderColor: 'hsl(var(--primary))',
          },
          '50%': {
            borderColor: 'hsl(var(--accent))',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        pulse: 'pulse 2s infinite',
        fadeIn: 'fadeIn 0.3s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 2s ease-in-out infinite alternate',
        'cyber-pulse': 'cyber-pulse 3s ease-in-out infinite',
        'cyber-scan': 'cyber-scan 3s linear infinite',
        'matrix-rain': 'matrix-rain 4s linear infinite',
        'hologram-flicker': 'hologram-flicker 0.5s ease-in-out infinite',
        'holographic-shift': 'holographic-shift 3s ease-in-out infinite',
        'neon-glow': 'neon-glow 2s ease-in-out infinite',
        'cyber-border': 'cyber-border 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      boxShadow: {
        '2xs': 'var(--shadow-2xs)',
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',

        // Neon Glows
        'glow-sm': 'var(--glow-sm)',
        'glow-md': 'var(--glow-md)',
        'glow-lg': 'var(--glow-lg)',
        'glow-xl': 'var(--glow-xl)',
        'glow-green-sm': 'var(--glow-green-sm)',
        'glow-green-md': 'var(--glow-green-md)',
        'glow-green-lg': 'var(--glow-green-lg)',
        'glow-blue-sm': 'var(--glow-blue-sm)',
        'glow-blue-md': 'var(--glow-blue-md)',
        'glow-blue-lg': 'var(--glow-blue-lg)',
        'glow-purple-sm': 'var(--glow-purple-sm)',
        'glow-purple-md': 'var(--glow-purple-md)',
        'glow-purple-lg': 'var(--glow-purple-lg)',
      },

      backdropBlur: {
        'glass-sm': 'var(--blur-sm)',
        'glass-md': 'var(--blur-md)',
        'glass-lg': 'var(--blur-lg)',
      },

      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-bg-primary': 'var(--gradient-bg-primary)',
        'gradient-bg-secondary': 'var(--gradient-bg-secondary)',
        'gradient-background': 'var(--gradient-background)',
        'gradient-glass': 'var(--gradient-glass)',
        'cyber-grid': `
          linear-gradient(var(--grid-color) 1px, transparent 1px),
          linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
        `,
      },

      backgroundSize: {
        grid: 'var(--grid-size) var(--grid-size)',
      },
    },
  },
  plugins: [
    // @ts-ignore
    require('tailwindcss-animate'),
    // @ts-ignore
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
