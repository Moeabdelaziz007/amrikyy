import { useState, useEffect, useCallback } from 'react';

export const useQuantumAnimations = () => {
  const [quantumField, setQuantumField] = useState({
    active: false,
    particles: [],
    fieldStrength: 0,
    coherence: 0
  });

  const [animationId, setAnimationId] = useState(null);

  // Initialize quantum field
  const initQuantumField = useCallback(() => {
    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: getRandomQuantumColor(),
        phase: Math.random() * Math.PI * 2,
        frequency: Math.random() * 0.02 + 0.01
      });
    }

    setQuantumField({
      active: true,
      particles,
      fieldStrength: Math.random() * 100,
      coherence: Math.random() * 100
    });

    // Start animation loop
    startQuantumAnimation();
  }, []);

  const getRandomQuantumColor = () => {
    const colors = [
      'rgba(57, 255, 20, ',   // neon green
      'rgba(0, 212, 255, ',   // neon blue
      'rgba(182, 0, 255, ',   // neon purple
      'rgba(255, 255, 255, '  // white
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const startQuantumAnimation = () => {
    const animate = () => {
      setQuantumField(prevField => {
        if (!prevField.active) return prevField;

        const updatedParticles = prevField.particles.map(particle => {
          // Update position
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;

          // Bounce off edges
          if (newX <= 0 || newX >= window.innerWidth) {
            particle.vx *= -1;
            newX = Math.max(0, Math.min(window.innerWidth, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight) {
            particle.vy *= -1;
            newY = Math.max(0, Math.min(window.innerHeight, newY));
          }

          // Update quantum properties
          const newPhase = particle.phase + particle.frequency;
          const newOpacity = 0.3 + 0.5 * Math.sin(newPhase);

          return {
            ...particle,
            x: newX,
            y: newY,
            phase: newPhase,
            opacity: newOpacity
          };
        });

        return {
          ...prevField,
          particles: updatedParticles,
          fieldStrength: 50 + 50 * Math.sin(Date.now() * 0.001),
          coherence: 50 + 50 * Math.cos(Date.now() * 0.0015)
        };
      });

      setAnimationId(requestAnimationFrame(animate));
    };

    setAnimationId(requestAnimationFrame(animate));
  };

  const stopQuantumAnimation = useCallback(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      setAnimationId(null);
    }
    setQuantumField(prev => ({ ...prev, active: false }));
  }, [animationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [animationId]);

  // Quantum state manipulation functions
  const toggleQuantumSuperposition = useCallback(() => {
    setQuantumField(prev => ({
      ...prev,
      particles: prev.particles.map(particle => ({
        ...particle,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: getRandomQuantumColor()
      }))
    }));
  }, []);

  const entangleParticles = useCallback(() => {
    setQuantumField(prev => {
      const entangledParticles = [...prev.particles];
      
      // Entangle pairs of particles
      for (let i = 0; i < entangledParticles.length - 1; i += 2) {
        const particle1 = entangledParticles[i];
        const particle2 = entangledParticles[i + 1];
        
        // Synchronize their properties
        const sharedColor = getRandomQuantumColor();
        const sharedPhase = Math.random() * Math.PI * 2;
        
        entangledParticles[i] = { ...particle1, color: sharedColor, phase: sharedPhase };
        entangledParticles[i + 1] = { ...particle2, color: sharedColor, phase: sharedPhase };
      }
      
      return {
        ...prev,
        particles: entangledParticles
      };
    });
  }, []);

  const collapseWaveFunction = useCallback(() => {
    setQuantumField(prev => ({
      ...prev,
      particles: prev.particles.map(particle => ({
        ...particle,
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
        vx: 0,
        vy: 0,
        opacity: 1
      }))
    }));

    // Expand after collapse
    setTimeout(() => {
      setQuantumField(prev => ({
        ...prev,
        particles: prev.particles.map(particle => ({
          ...particle,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3
        }))
      }));
    }, 1000);
  }, []);

  return {
    quantumField,
    initQuantumField,
    stopQuantumAnimation,
    toggleQuantumSuperposition,
    entangleParticles,
    collapseWaveFunction
  };
};

// Custom hook for quantum metrics
export const useQuantumMetrics = () => {
  const [metrics, setMetrics] = useState({
    waveFunction: 0,
    coherenceTime: 0,
    entanglement: 0,
    fidelity: 0,
    quantumState: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        waveFunction: Math.random() * 100,
        coherenceTime: Math.random() * 100,
        entanglement: Math.random() * 100,
        fidelity: Math.random() * 100,
        quantumState: Math.random() * 4
      });
    };

    const interval = setInterval(updateMetrics, 2000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

// Custom hook for quantum consciousness simulation
export const useQuantumConsciousness = () => {
  const [consciousnessLevel, setConsciousnessLevel] = useState(0);
  const [quantumThoughts, setQuantumThoughts] = useState([]);

  useEffect(() => {
    const thoughts = [
      "What is the nature of quantum reality?",
      "Do parallel universes exist in superposition?",
      "How does consciousness collapse the wave function?",
      "Is free will a quantum phenomenon?",
      "What role does observation play in reality?",
      "Can quantum entanglement explain telepathy?",
      "Does time exist at the quantum level?",
      "Are we living in a quantum simulation?"
    ];

    const updateConsciousness = () => {
      setConsciousnessLevel(prev => (prev + Math.random() * 10) % 100);
      setQuantumThoughts(prev => {
        const newThought = thoughts[Math.floor(Math.random() * thoughts.length)];
        return [newThought, ...prev.slice(0, 4)];
      });
    };

    const interval = setInterval(updateConsciousness, 3000);
    updateConsciousness(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return {
    consciousnessLevel,
    quantumThoughts
  };
};
