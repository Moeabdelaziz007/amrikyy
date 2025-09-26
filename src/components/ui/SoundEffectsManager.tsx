import React, { useState, useEffect } from 'react';

interface SoundEffect {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  volume: number;
}

const soundEffects: SoundEffect[] = [
  {
    id: 'click',
    name: 'Click Sound',
    description: 'Play sound when clicking buttons and icons',
    icon: '🖱️',
    enabled: false,
    volume: 0.5
  },
  {
    id: 'hover',
    name: 'Hover Sound',
    description: 'Play sound when hovering over interactive elements',
    icon: '✨',
    enabled: false,
    volume: 0.3
  },
  {
    id: 'notification',
    name: 'Notification Sound',
    description: 'Play sound for notifications and alerts',
    icon: '🔔',
    enabled: true,
    volume: 0.7
  },
  {
    id: 'success',
    name: 'Success Sound',
    description: 'Play sound for successful actions',
    icon: '✅',
    enabled: true,
    volume: 0.6
  },
  {
    id: 'error',
    name: 'Error Sound',
    description: 'Play sound for errors and warnings',
    icon: '❌',
    enabled: true,
    volume: 0.8
  },
  {
    id: 'app-open',
    name: 'App Open Sound',
    description: 'Play sound when opening applications',
    icon: '🚀',
    enabled: false,
    volume: 0.4
  },
  {
    id: 'app-close',
    name: 'App Close Sound',
    description: 'Play sound when closing applications',
    icon: '🔒',
    enabled: false,
    volume: 0.4
  },
  {
    id: 'theme-change',
    name: 'Theme Change Sound',
    description: 'Play sound when changing themes',
    icon: '🎨',
    enabled: false,
    volume: 0.5
  }
];

// Web Audio API Sound Generator
class SoundGenerator {
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 0.5;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private createChord(frequencies: number[], duration: number, volume: number = 0.1) {
    frequencies.forEach(freq => {
      this.createTone(freq, duration, 'sine', volume / frequencies.length);
    });
  }

  private createNoise(duration: number, volume: number = 0.1) {
    if (!this.audioContext) return;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * volume * this.masterVolume;
    }
    
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    gainNode.gain.setValueAtTime(volume * this.masterVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    source.start();
  }

  playClick() {
    this.createTone(800, 0.1, 'square', 0.1);
  }

  playHover() {
    this.createTone(600, 0.05, 'sine', 0.05);
  }

  playNotification() {
    this.createChord([523, 659, 784], 0.3, 0.15); // C5, E5, G5
  }

  playSuccess() {
    this.createChord([523, 659, 784, 1047], 0.4, 0.12); // C5, E5, G5, C6
  }

  playError() {
    this.createTone(200, 0.5, 'sawtooth', 0.2);
  }

  playAppOpen() {
    const frequencies = [523, 659, 784, 1047, 1319]; // Ascending chord
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.createTone(freq, 0.1, 'sine', 0.08), index * 50);
    });
  }

  playAppClose() {
    const frequencies = [1319, 1047, 784, 659, 523]; // Descending chord
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.createTone(freq, 0.1, 'sine', 0.08), index * 50);
    });
  }

  playThemeChange() {
    this.createChord([392, 494, 587, 698], 0.6, 0.1); // G4, B4, D5, F5
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
}

export const SoundEffectsManager: React.FC = () => {
  const [effects, setEffects] = useState<SoundEffect[]>(soundEffects);
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [isEnabled, setIsEnabled] = useState(true);
  const [soundGenerator] = useState(new SoundGenerator());

  useEffect(() => {
    soundGenerator.setMasterVolume(masterVolume);
  }, [masterVolume, soundGenerator]);

  const updateEffect = (id: string, updates: Partial<SoundEffect>) => {
    setEffects(prev => prev.map(effect => 
      effect.id === id ? { ...effect, ...updates } : effect
    ));
  };

  const playTestSound = (effectId: string) => {
    if (!isEnabled) return;
    
    const effect = effects.find(e => e.id === effectId);
    if (!effect || !effect.enabled) return;

    switch (effectId) {
      case 'click':
        soundGenerator.playClick();
        break;
      case 'hover':
        soundGenerator.playHover();
        break;
      case 'notification':
        soundGenerator.playNotification();
        break;
      case 'success':
        soundGenerator.playSuccess();
        break;
      case 'error':
        soundGenerator.playError();
        break;
      case 'app-open':
        soundGenerator.playAppOpen();
        break;
      case 'app-close':
        soundGenerator.playAppClose();
        break;
      case 'theme-change':
        soundGenerator.playThemeChange();
        break;
    }
  };

  // Global sound effect functions
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('btn-enhanced') || target.classList.contains('app-icon')) {
        const clickEffect = effects.find(e => e.id === 'click');
        if (clickEffect?.enabled && isEnabled) {
          soundGenerator.playClick();
        }
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('btn-enhanced') || target.classList.contains('app-icon')) {
        const hoverEffect = effects.find(e => e.id === 'hover');
        if (hoverEffect?.enabled && isEnabled) {
          soundGenerator.playHover();
        }
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [effects, isEnabled, soundGenerator]);

  return (
    <div className="sound-effects-manager">
      <div className="sound-header">
        <h2>🔊 Sound Effects Manager</h2>
        <p>Customize audio feedback for your Amrikyy AIOS experience</p>
      </div>

      <div className="sound-controls">
        <div className="master-controls">
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
              />
              Enable Sound Effects
            </label>
          </div>
          
          <div className="control-group">
            <label>Master Volume: {Math.round(masterVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="effects-list">
        {effects.map(effect => (
          <div key={effect.id} className="effect-item">
            <div className="effect-info">
              <div className="effect-icon">{effect.icon}</div>
              <div className="effect-details">
                <h4>{effect.name}</h4>
                <p>{effect.description}</p>
              </div>
            </div>
            
            <div className="effect-controls">
              <div className="control-group">
                <label>
                  <input
                    type="checkbox"
                    checked={effect.enabled}
                    onChange={(e) => updateEffect(effect.id, { enabled: e.target.checked })}
                  />
                  Enable
                </label>
              </div>
              
              <div className="control-group">
                <label>Volume: {Math.round(effect.volume * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={effect.volume}
                  onChange={(e) => updateEffect(effect.id, { volume: parseFloat(e.target.value) })}
                />
              </div>
              
              <button
                className="test-sound-btn"
                onClick={() => playTestSound(effect.id)}
                disabled={!isEnabled || !effect.enabled}
              >
                🔊 Test
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="sound-visualizer">
        <h3>🎵 Audio Visualizer</h3>
        <div className="visualizer-container">
          <div className="sound-visualizer">
            <div className="sound-bar"></div>
            <div className="sound-bar"></div>
            <div className="sound-bar"></div>
            <div className="sound-bar"></div>
            <div className="sound-bar"></div>
          </div>
        </div>
      </div>

      <div className="sound-presets">
        <h3>🎛️ Sound Presets</h3>
        <div className="presets-grid">
          <button className="preset-btn" onClick={() => {
            setEffects(prev => prev.map(effect => ({ ...effect, enabled: true, volume: 0.5 })));
            setMasterVolume(0.5);
          }}>
            🔊 Full Experience
          </button>
          <button className="preset-btn" onClick={() => {
            setEffects(prev => prev.map(effect => ({ 
              ...effect, 
              enabled: ['notification', 'success', 'error'].includes(effect.id),
              volume: 0.6 
            })));
            setMasterVolume(0.6);
          }}>
            🔔 Notifications Only
          </button>
          <button className="preset-btn" onClick={() => {
            setEffects(prev => prev.map(effect => ({ ...effect, enabled: false })));
            setMasterVolume(0);
          }}>
            🔇 Silent Mode
          </button>
        </div>
      </div>
    </div>
  );
};
