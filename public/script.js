/**
 * Amrikyy - Digital ID Card Generator
 * Main functionality for the ID card generation and interaction
 */

// DOM Elements
let currentStep = 1;
let userData = {};
let cardData = null;
let aiTools = [];

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize loading screen
  initLoading();
  
  // Initialize navigation
  initNavigation();
  
  // Initialize form steps
  initFormSteps();
  
  // Initialize chatbot
  initChatbot();
  
  // Initialize image upload
  initImageUpload();
  
  // Initialize form submission
  initFormSubmission();
  
  // Initialize share functionality
  initShareFunctionality();

 codex/add-aos-library-and-animations
  // Initialize AOS animations if library is loaded
  if (typeof AOS !== 'undefined') {
    AOS.init();
  }

 codex/implement-light-theme-with-toggle
  // Initialize theme and toggle button
  initTheme();

 codex/add-star-based-rating-widget-to-tool-cards
  // Initialize rating widgets
  initRatingWidgets();

  initAITools();
 main
 main
 main
  
  // Hero section CTA buttons
  const aiToolHeroBtn = document.getElementById('aiToolHeroBtn');
  const downloadCvHeroBtn = document.getElementById('downloadCvHeroBtn');
  const aiToolBtn = document.getElementById('aiToolBtn');
  const cvBtn = document.getElementById('cvBtn');

  // Scroll to AI Tool section from hero
  if (aiToolHeroBtn) {
    aiToolHeroBtn.addEventListener('click', () => {
      const idGeneratorSection = document.getElementById('idGeneratorSection');
      if (idGeneratorSection) {
        idGeneratorSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Scroll to AI Tool section from header
  if (aiToolBtn) {
    aiToolBtn.addEventListener('click', () => {
      const idGeneratorSection = document.getElementById('idGeneratorSection');
      if (idGeneratorSection) {
        idGeneratorSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Download CV from hero or header
  if (downloadCvHeroBtn) {
    downloadCvHeroBtn.addEventListener('click', () => {
      window.open('Mohamed_H_Abdelaziz_CV.pdf', '_blank');
    });
  }
  if (cvBtn) {
    cvBtn.addEventListener('click', () => {
      window.open('Mohamed_H_Abdelaziz_CV.pdf', '_blank');
    });
  }
});

/**
 * Initialize loading screen animation and progress
 */
function initLoading() {
  const loader = document.getElementById('loader-container');
  const app = document.getElementById('app');
  const progressBar = document.getElementById('progressBar');
  const progressPercentage = document.getElementById('progressPercentage');
  const statusMessage = document.getElementById('statusMessage');
  
  // Generate particles for loader
  generateParticles('loader-particles', 30);
  
  // Generate particles for hero section
  generateParticles('hero-particles', 20);
  
  const statusMessages = {
    ar: [
      'جاري تحميل الموارد...',
      'تهيئة الواجهة...',
      'تحميل البيانات...',
      'إعداد التجربة التفاعلية...',
      'اكتمال التحميل...'
    ],
    en: [
      'Loading resources...',
      'Initializing interface...',
      'Loading data...',
      'Setting up interactive experience...',
      'Loading complete...'
    ]
  };
  
  const currentLang = document.documentElement.lang || 'ar';
  const messages = statusMessages[currentLang] || statusMessages.ar;
  
  let progress = 0;
  const interval = setInterval(() => {
    if (progress >= 100) {
      clearInterval(interval);
      
      // Hide loader and show app after a short delay
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.classList.add('hidden');
          app.classList.remove('hidden');
        }, 500);
      }, 500);
      
      return;
    }
    
    progress += Math.random() * 10;
    progress = Math.min(progress, 100);
    
    progressBar.style.width = `${progress}%`;
    progressPercentage.textContent = `${Math.round(progress)}%`;
    
    // Update status message based on progress
    const messageIndex = Math.min(Math.floor(progress / 25), messages.length - 1);
    statusMessage.textContent = messages[messageIndex];
    
  }, 300);
}

/**
 * Generate random particles for visual effects
 * @param {string} containerId - ID of the container element
 * @param {number} count - Number of particles to generate
 */
function generateParticles(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Clear existing particles
  container.innerHTML = '';
  
  // Create new random particles
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random positioning
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 10 + Math.random() * 20;
    
    particle.style.top = `${top}%`;
    particle.style.left = `${left}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    container.appendChild(particle);
  }
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const langToggle = document.getElementById('langToggle');
  const createIdBtn = document.getElementById('createIdBtn');
  const learnMoreBtn = document.getElementById('learnMoreBtn');
  
  // Toggle mobile navigation
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Animate hamburger icon
      const lines = navToggle.querySelectorAll('.line');
      navToggle.classList.toggle('active');
      
      if (navToggle.classList.contains('active')) {
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      }
    });
  }
  
  // Language toggle
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const currentLang = document.documentElement.lang;
      const newLang = currentLang === 'ar' ? 'en' : 'ar';
      
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      
      langToggle.textContent = newLang === 'ar' ? 'EN' : 'AR';
      
      // Update all translatable elements
      updateTranslations(newLang);
    });
  }
  
  // Create ID button
  if (createIdBtn) {
    createIdBtn.addEventListener('click', () => {
      const idGeneratorSection = document.getElementById('idGeneratorSection');
      if (idGeneratorSection) {
        idGeneratorSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Learn more button
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      // Implement learn more functionality
      // For example, show a modal or scroll to about section
    });
  }
  
  // Set current year in footer
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Update translations based on selected language
 * @param {string} lang - Selected language code
 */
function updateTranslations(lang) {
  // This function would use the translations from translations.js
  // For now, we'll just implement a placeholder
  const translatableElements = document.querySelectorAll('[data-translate]');
  
  translatableElements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (typeof translations !== 'undefined' && translations && translations[key] && translations[key][lang]) {
      element.textContent = translations[key][lang];
    }
  });
}

/**
 * Initialize form steps navigation
 */
function initFormSteps() {
  const formSteps = document.querySelectorAll('.form-step');
  const nextButtons = document.querySelectorAll('.next-btn');
  const backButtons = document.querySelectorAll('.back-btn');
  
  // Next button functionality
  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentStepElement = button.closest('.form-step');
      const currentStepNumber = parseInt(currentStepElement.getAttribute('data-step'));
      const nextStepNumber = parseInt(button.getAttribute('data-next'));
      
      // Validate current step
      if (validateStep(currentStepNumber)) {
        // Hide current step
        currentStepElement.classList.remove('active');
        
        // Show next step
        const nextStepElement = document.querySelector(`.form-step[data-step="${nextStepNumber}"]`);
        if (nextStepElement) {
          nextStepElement.classList.add('active');
          currentStep = nextStepNumber;
        }
      }
    });
  });
  
  // Back button functionality
  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentStepElement = button.closest('.form-step');
      const prevStepNumber = parseInt(button.getAttribute('data-back'));
      
      // Hide current step
      currentStepElement.classList.remove('active');
      
      // Show previous step
      const prevStepElement = document.querySelector(`.form-step[data-step="${prevStepNumber}"]`);
      if (prevStepElement) {
        prevStepElement.classList.add('active');
        currentStep = prevStepNumber;
      }
    });
  });
  
  // Mood selector functionality
  const moodOptions = document.querySelectorAll('.mood-option');
  const moodInput = document.getElementById('mood');
  
  moodOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from all options
      moodOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Add selected class to clicked option
      option.classList.add('selected');
      
      // Update hidden input value
      if (moodInput) {
        moodInput.value = option.getAttribute('data-mood');
      }
    });
  });
}

/**
 * Validate form step
 * @param {number} stepNumber - Current step number
 * @returns {boolean} - Whether the step is valid
 */
function validateStep(stepNumber) {
  const stepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
  if (!stepElement) return true;
  
  const requiredInputs = stepElement.querySelectorAll('input[required], textarea[required], select[required]');
  let isValid = true;
  
  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      showInputError(input, 'This field is required');
    } else {
      clearInputError(input);
    }
  });
  
  return isValid;
}

/**
 * Show input error message
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
function showInputError(input, message) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  // Remove any existing error message
  clearInputError(input);
  
  // Add error class to input
  input.classList.add('error');
  
  // Create error message element
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  
  // Add error message after input
  formGroup.appendChild(errorElement);
}

/**
 * Clear input error message
 * @param {HTMLElement} input - Input element
 */
function clearInputError(input) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  // Remove error class from input
  input.classList.remove('error');
  
  // Remove any existing error message
  const errorElement = formGroup.querySelector('.error-message');
  if (errorElement) {
    formGroup.removeChild(errorElement);
  }
}

/**
 * Initialize chatbot functionality
 */
function initChatbot() {
  // Create chatbot bubble
  const chatbotBubble = document.createElement('div');
  chatbotBubble.className = 'chatbot-bubble';
  chatbotBubble.innerHTML = `
    <div class="chatbot-icon">
      <i class="fas fa-robot"></i>
    </div>
    <div class="chatbot-tooltip">Chat with Amrikyy AI</div>
  `;
  
  // Add chatbot bubble to body
  document.body.appendChild(chatbotBubble);
  
  // Add click event to chatbot bubble
  chatbotBubble.addEventListener('click', () => {
    toggleChatbot();
  });
  
  // Create chatbot container
  const chatbotContainer = document.createElement('div');
  chatbotContainer.className = 'chatbot-container hidden';
  chatbotContainer.innerHTML = `
    <div class="chatbot-header">
      <div class="chatbot-title">
        <img src="assets/amrikyy-logo.png" alt="Amrikyy Logo" class="chatbot-logo">
        <span>Amrikyy AI Assistant</span>
      </div>
      <button class="chatbot-close">&times;</button>
    </div>
    <div class="chatbot-messages">
      <div class="message bot-message">
        <div class="message-content">
          <p>👋 Hello! I'm your Amrikyy AI assistant. How can I help you today?</p>
        </div>
        <div class="message-time">Just now</div>
      </div>
    </div>
    <div class="chatbot-input">
      <input type="text" placeholder="Type your message..." id="chatbotInput">
      <button class="chatbot-send">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  `;
  
  // Add chatbot container to body
  document.body.appendChild(chatbotContainer);
  
  // Add click event to close button
  const closeButton = chatbotContainer.querySelector('.chatbot-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      toggleChatbot();
    });
  }
  
  // Add send message functionality
  const chatbotInput = document.getElementById('chatbotInput');
  const sendButton = chatbotContainer.querySelector('.chatbot-send');
  
  if (chatbotInput && sendButton) {
    // Send message on button click
    sendButton.addEventListener('click', () => {
      sendChatbotMessage();
    });
    
    // Send message on Enter key
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatbotMessage();
      }
    });
  }
  
  /**
   * Toggle chatbot visibility
   */
  function toggleChatbot() {
    chatbotContainer.classList.toggle('hidden');
    
    // If chatbot is visible, focus on input
    if (!chatbotContainer.classList.contains('hidden')) {
      chatbotInput.focus();
    }
  }
  
  /**
   * Send message to chatbot
   */
  function sendChatbotMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    
    // Clear input
    chatbotInput.value = '';
    
    // Add user message to chat
    addChatMessage(message, 'user');
    
    // Send message to backend
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: message })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.response) {
          addChatMessage(data.response, 'bot');
        } else {
          addChatMessage('Sorry, something went wrong.', 'bot');
        }
      })
      .catch(() => {
        addChatMessage('Error contacting server.', 'bot');
      });
  }
  
  /**
   * Add message to chat
   * @param {string} message - Message text
   * @param {string} sender - Message sender ('user' or 'bot')
   */
  function addChatMessage(message, sender) {
    const messagesContainer = chatbotContainer.querySelector('.chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageElement.innerHTML = `
      <div class="message-content">
        <p>${message}</p>
      </div>
      <div class="message-time">${currentTime}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

/**
 * Initialize image upload functionality
 */
function initImageUpload() {
  const avatarUpload = document.getElementById('avatarUpload');
  const avatarPreview = document.getElementById('avatarPreview');
  
  if (avatarUpload && avatarPreview) {
    avatarUpload.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          avatarPreview.style.backgroundImage = `url('${e.target.result}')`;
          
          // Store the image data in userData
          userData.avatarImage = e.target.result;
        };
        
        reader.readAsDataURL(file);
      }
    });
  }
}

/**
 * Initialize form submission
 */
function initFormSubmission() {
  const idCardForm = document.getElementById('idCardForm');
  const resultSection = document.getElementById('resultSection');
  const digitalIdCard = document.getElementById('digitalIdCard');
  const resetBtn = document.getElementById('resetBtn');
  
  if (idCardForm) {
    idCardForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(idCardForm);
      userData = {};
      
      // Convert FormData to object
      for (const [key, value] of formData.entries()) {
        userData[key] = value;
      }
      
      // Add avatar image if available
      if (userData.avatarImage) {
        userData.avatar = userData.avatarImage;
      }
      
      // Show loading state
      showLoadingOverlay('Generating your digital ID...');
      
      try {
        // Prepare data for API
        const apiPayload = userData; // Use userData directly
        
        // In a real implementation, this would call the backend API
        // For demo purposes, we'll simulate the API call
        cardData = await simulateApiCall(apiPayload);

        // Generate and display the ID card
        generateIdCard({ ...cardData, ...userData });
        
        // Hide generator section and show result section
        document.getElementById('idGeneratorSection').classList.add('hidden');
        resultSection.classList.remove('hidden');
        
        // Scroll to result section
        resultSection.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error generating ID card:', error);
        alert('An error occurred while generating your ID card. Please try again.');
      } finally {
        // Hide loading overlay
        hideLoadingOverlay();
      }
    });
  }
  
  // Reset button functionality
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Reset form
      if (idCardForm) {
        idCardForm.reset();
      }
      
      // Reset avatar preview
      if (document.getElementById('avatarPreview')) {
        document.getElementById('avatarPreview').style.backgroundImage = 'url("avatar.jpg")';
      }
      
      // Hide result section and show generator section
      resultSection.classList.add('hidden');
      document.getElementById('idGeneratorSection').classList.remove('hidden');
      
      // Scroll to generator section
      document.getElementById('idGeneratorSection').scrollIntoView({ behavior: 'smooth' });
      
      // Reset current step
      currentStep = 1;
      const formSteps = document.querySelectorAll('.form-step');
      formSteps.forEach(step => {
        step.classList.remove('active');
      });
      document.querySelector('.form-step[data-step="1"]').classList.add('active');
    });
  }
}

/**
 * Simulate API call to generate ID card
 * @param {Object} payload - API payload
 * @returns {Promise<Object>} - Card data
 */
async function simulateApiCall(payload) {
  // In a real implementation, this would be an actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API response
      resolve({
        nickname: "TECH VOYAGER",
        title: "Digital Explorer",
        id_number: "AX-2025-78943",
        clearance_level: "QUANTUM",
        analysis: "A visionary innovator with exceptional problem-solving skills. Your unique blend of creativity and technical insight makes you a natural pioneer in digital frontiers.",
        ai_message: "Challenge: Share your unique perspective on emerging tech with 3 people this week to expand your network of fellow explorers.",
        skills: ["AI Development", "System Architecture", "Creative Problem Solving", "Digital Innovation"],
        color_theme: "quantum_blue",
        color_hex: "#00d4ff",
        expiry_date: "2026-06-01T00:00:00Z",
        security_features: ["Biometric Verification", "Quantum Encryption"],
        qr_data: "https://amrikyy.com/verify/AX-2025-78943",
      });
    }, 1000);
  });
}

/**
 * Generate ID card HTML
 * @param {Object} data - Card data
 */
function generateIdCard(data) {
  const digitalIdCard = document.getElementById('digitalIdCard');
  if (!digitalIdCard) return;
  
  // Example: Using data to generate the ID card HTML
  const avatarSrc = data.avatar || 'avatar.jpg'; // Use avatar.jpg as fallback
  const userName = data.full_name || 'User'; // Use form name or fallback

  digitalIdCard.innerHTML = `
    <div class="card" style="background-color: ${data.color_hex || '#00d4ff'};">
      <div class="card-header">
        <div class="card-header-display">
          <div class="card-avatar-container">
            <div class="avatar-ring"></div>
            <div class="avatar-ring"></div>
            <img class="card-avatar-display" src="${avatarSrc}" alt="${userName} Avatar">
          </div>
          <h2 class="card-nickname-display" data-text="${data.nickname || ''}">${data.nickname || ''}</h2>
          <p class="card-title-display">${data.title || ''}</p>
        </div>
      </div>
      
      <div class="card-body">
        <div class="card-details-container">
          <p class="card-analysis-display">${data.analysis || ''}</p>
          <p class="card-ai-message-display">${data.ai_message || ''}</p>
        </div>
        
        <div class="card-qr-link-display">
          <div class="card-qr-code-container">
            <div class="qr-corner qr-corner-tl"></div>
            <div class="qr-corner qr-corner-tr"></div>
            <div class="qr-corner qr-corner-bl"></div>
            <div class="qr-corner qr-corner-br"></div>
            <div class="qr-scanner-line"></div>
            <div class="card-qr-code" id="cardQrCode"></div>
          </div>
          <a href="#" class="card-link-display">View & Share Your Card</a>
        </div>
      </div>
    </div>

    <!-- Logo watermark -->
    <img class="logo-watermark" src="amrikyy_neon_logo.webp" alt="Amrikyy Logo">
  `;

  // Generate QR code using qrcodejs if available
  const qrTarget = document.getElementById('cardQrCode');
  if (qrTarget && typeof QRCode !== 'undefined') {
    qrTarget.innerHTML = '';
    new QRCode(qrTarget, {
      text: data.qr_data || '',
      width: 120,
      height: 120,
      correctLevel: QRCode.CorrectLevel.H,
    });
  }
}

/**
 * Initialize share functionality
 */
function initShareFunctionality() {
  const shareBtn = document.getElementById('shareBtn');
  const shareModal = document.getElementById('shareModal');
  const closeShareModal = document.getElementById('closeShareModal');
  const shareOptions = document.querySelectorAll('.share-option');
  const shareLink = document.getElementById('shareLink');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  
  // Share button functionality
  if (shareBtn && shareModal) {
    shareBtn.addEventListener('click', () => {
      // Set share link
      if (shareLink) {
        shareLink.value = window.location.href;
      }
      
      // Show modal
      shareModal.classList.add('active');
    });
  }
  
  // Close modal functionality
  if (closeShareModal && shareModal) {
    closeShareModal.addEventListener('click', () => {
      shareModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) {
        shareModal.classList.remove('active');
      }
    });
  }
  
  // Share options functionality
  if (shareOptions) {
    shareOptions.forEach(option => {
      option.addEventListener('click', () => {
        const platform = option.getAttribute('data-platform');
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Check out my digital ID card created with Amrikyy!');
        
        let shareUrl = '';
        
        switch (platform) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
          case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        }
        
        if (shareUrl) {
          window.open(shareUrl, '_blank');
        }
      });
    });
  }
  
  // Copy link functionality
  if (copyLinkBtn && shareLink) {
    copyLinkBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareLink.value);
        } else {
          // Fallback for older browsers
          shareLink.select();
          document.execCommand('copy');
        }

        // Show copied message
        const originalText = copyLinkBtn.textContent;
        copyLinkBtn.textContent = 'Copied!';

        setTimeout(() => {
          copyLinkBtn.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  }
  
  // Download button functionality
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const digitalIdCard = document.getElementById('digitalIdCard');
      
      if (digitalIdCard && typeof html2canvas === 'function') {
        // Show loading state
        showLoadingOverlay('Preparing download...');
        
        html2canvas(digitalIdCard).then(canvas => {
          // Create download link
          const link = document.createElement('a');
          link.download = 'amrikyy-digital-id.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          
          // Hide loading overlay
          hideLoadingOverlay();
        }).catch(error => {
          console.error('Error generating image:', error);
          alert('An error occurred while generating the image. Please try again.');
          
          // Hide loading overlay
          hideLoadingOverlay();
        });
      } else {
        alert('Download functionality is not available. Please try again later.');
      }
    });
  }
}

/**
 * Show loading overlay
 * @param {string} message - Loading message
 */
function showLoadingOverlay(message = 'Loading...') {
  // Create loading overlay if it doesn't exist
  let loadingOverlay = document.getElementById('loadingOverlay');
  
  if (!loadingOverlay) {
    loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-message" id="loadingMessage">${message}</div>
    `;
    
    document.body.appendChild(loadingOverlay);
  } else {
    // Update message if overlay exists
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
      loadingMessage.textContent = message;
    }
    
    // Show overlay
    loadingOverlay.classList.remove('hidden');
  }
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay() {
  const loadingOverlay = document.getElementById('loadingOverlay');

  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
  }
}

/**
 codex/implement-light-theme-with-toggle
 * Initialize theme based on saved preference and set up toggle
 */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    updateToggleIcon(toggleBtn);
    toggleBtn.addEventListener('click', toggleTheme);
  }
}

/**
 * Toggle between light and dark themes with smooth transitions
 */
function toggleTheme() {
  document.body.classList.add('theme-transition');
  const isLight = document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    updateToggleIcon(toggleBtn);
  }

  setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 500);
}

/**
 * Update toggle button icon based on current theme
 * @param {HTMLElement} btn
 */
function updateToggleIcon(btn) {
  if (document.body.classList.contains('light-theme')) {
    btn.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    btn.innerHTML = '<i class="fas fa-sun"></i>';
  }
=======
 codex/add-star-based-rating-widget-to-tool-cards
 * Initialize rating widgets and handle persistence
 */
function initRatingWidgets() {
  const widgets = document.querySelectorAll('.rating-widget');
  if (!widgets.length) return;

  let ratingsStore = {};
  try {
    ratingsStore = JSON.parse(localStorage.getItem('toolRatings')) || {};
  } catch (e) {
    ratingsStore = {};
  }

  widgets.forEach(widget => {
    const toolId = widget.getAttribute('data-tool-id');
    const stars = widget.querySelectorAll('.star');
    const commentInput = widget.querySelector('.rating-comment');
    const submitBtn = widget.querySelector('.rating-submit');
    const averageDisplay = widget.querySelector('.rating-average span');
    let selected = 0;

    updateAverage();

    stars.forEach(star => {
      const value = parseInt(star.dataset.value, 10);
      star.addEventListener('mouseenter', () => highlight(value));
      star.addEventListener('mouseleave', () => highlight(selected));
      star.addEventListener('click', () => {
        selected = value;
        highlight(selected);
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (!selected) return alert('Please select a rating first');
        const comment = commentInput ? commentInput.value.trim() : '';
        if (!ratingsStore[toolId]) ratingsStore[toolId] = { ratings: [] };
        ratingsStore[toolId].ratings.push({ stars: selected, comment });
        localStorage.setItem('toolRatings', JSON.stringify(ratingsStore));
        if (commentInput) commentInput.value = '';
        selected = 0;
        highlight(selected);
        updateAverage();
      });
    }

    function highlight(rating) {
      stars.forEach(s => {
        const val = parseInt(s.dataset.value, 10);
        if (val <= rating) {
          s.classList.add('fa-solid', 'active');
          s.classList.remove('fa-regular');
        } else {
          s.classList.remove('fa-solid', 'active');
          s.classList.add('fa-regular');
        }
      });
    }

    function updateAverage() {
      if (ratingsStore[toolId] && ratingsStore[toolId].ratings.length) {
        const arr = ratingsStore[toolId].ratings;
        const avg = arr.reduce((a, r) => a + r.stars, 0) / arr.length;
        averageDisplay.textContent = avg.toFixed(1);
      } else {
        averageDisplay.textContent = '0';
      }
    }
=======
 * Load AI tools from JSON and initialize search filtering
 */
function initAITools() {
  const searchInput = document.getElementById('toolSearch');
  const cardsContainer = document.getElementById('toolCards');

  if (!searchInput || !cardsContainer) return;

  fetch('aiTools.json')
    .then(res => res.json())
    .then(data => {
      aiTools = data;
      renderToolCards(aiTools);
    })
    .catch(err => console.error('Error loading aiTools.json', err));

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = aiTools.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query)))
    );
    renderToolCards(filtered);
  });
}

/**
 * Render AI tool cards
 * @param {Array} tools - array of tool objects
 */
function renderToolCards(tools) {
  const cardsContainer = document.getElementById('toolCards');
  if (!cardsContainer) return;

  cardsContainer.innerHTML = '';
  tools.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <a href="${tool.link}" target="_blank">Visit</a>
    `;
    cardsContainer.appendChild(card);
 main
  });
 main
}
