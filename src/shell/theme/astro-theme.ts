export const astroTheme = {
  colors: {
    background: '#0a0f1e',
    surface: '#1a1f2e',
    primary: '#00f6ff',
    accent: '#ff00f4',
    text: '#f0f0f0',
    textSecondary: '#a0a0a0',
    glassBg: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    success: '#00ff88',
    warning: '#ffb347',
    error: '#ff4757',
  },
  gradients: {
    background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1f2e 100%)',
    primary: 'linear-gradient(135deg, #00f6ff 0%, #00b8cc 100%)',
    accent: 'linear-gradient(135deg, #ff00f4 0%, #cc00c4 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  },
  shadows: {
    glow: '0 0 20px var(--primary)',
    glowAccent: '0 0 20px var(--accent)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  fonts: {
    primary: "'Inter', 'Poppins', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  animations: {
    duration: '0.3s',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
