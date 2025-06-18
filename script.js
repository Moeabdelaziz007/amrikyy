/**
 * Amrikyy - Digital ID Card Generator
 * Core client-side functionality
 */

let currentStep = 1;
let userData = {};
let cardData = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initNavigation();
  initTheme();
  initRatingWidgets();
  initAITools();
  initFormSteps();
  initChatbot();
  initImageUpload();
  initFormSubmission();
  initShareFunctionality();

  const aiToolHeroBtn = document.getElementById('aiToolHeroBtn');
  const downloadCvHeroBtn = document.getElementById('downloadCvHeroBtn');
  const aiToolBtn = document.getElementById('aiToolBtn');
  const cvBtn = document.getElementById('cvBtn');

  if (aiToolHeroBtn) {
    aiToolHeroBtn.addEventListener('click', () => {
      const section = document.getElementById('idGeneratorSection');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (aiToolBtn) {
    aiToolBtn.addEventListener('click', () => {
      const section = document.getElementById('idGeneratorSection');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }

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

  if (typeof AOS !== 'undefined') {
    AOS.init();
  }
});

function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const langToggle = document.getElementById('langToggle');
  const createIdBtn = document.getElementById('createIdBtn');
  const learnMoreBtn = document.getElementById('learnMoreBtn');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
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

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const currentLang = document.documentElement.lang;
      const newLang = currentLang === 'ar' ? 'en' : 'ar';
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      langToggle.textContent = newLang === 'ar' ? 'EN' : 'AR';
      updateTranslations(newLang);
    });
  }

  if (createIdBtn) {
    createIdBtn.addEventListener('click', () => {
      const section = document.getElementById('idGeneratorSection');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      // Placeholder for future feature
    });
  }

  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
}

function updateTranslations(lang) {
  const translatableElements = document.querySelectorAll('[data-translate]');
  translatableElements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (typeof translations !== 'undefined' && translations[key] && translations[key][lang]) {
      element.textContent = translations[key][lang];
    }
  });
}

function initFormSteps() {
  const formSteps = document.querySelectorAll('.form-step');
  const nextButtons = document.querySelectorAll('.next-btn');
  const backButtons = document.querySelectorAll('.back-btn');

  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentStepElement = button.closest('.form-step');
      const currentStepNumber = parseInt(currentStepElement.getAttribute('data-step'));
      const nextStepNumber = parseInt(button.getAttribute('data-next'));
      if (validateStep(currentStepNumber)) {
        currentStepElement.classList.remove('active');
        const nextStepElement = document.querySelector(`.form-step[data-step="${nextStepNumber}"]`);
        if (nextStepElement) {
          nextStepElement.classList.add('active');
          currentStep = nextStepNumber;
        }
      }
    });
  });

  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentStepElement = button.closest('.form-step');
      const prevStepNumber = parseInt(button.getAttribute('data-back'));
      currentStepElement.classList.remove('active');
      const prevStepElement = document.querySelector(`.form-step[data-step="${prevStepNumber}"]`);
      if (prevStepElement) {
        prevStepElement.classList.add('active');
        currentStep = prevStepNumber;
      }
    });
  });

  const moodOptions = document.querySelectorAll('.mood-option');
  const moodInput = document.getElementById('mood');
  moodOptions.forEach(option => {
    option.addEventListener('click', () => {
      moodOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      if (moodInput) moodInput.value = option.getAttribute('data-mood');
    });
  });
}

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

function showInputError(input, message) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  clearInputError(input);
  input.classList.add('error');
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  formGroup.appendChild(errorElement);
}

function clearInputError(input) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  input.classList.remove('error');
  const errorElement = formGroup.querySelector('.error-message');
  if (errorElement) formGroup.removeChild(errorElement);
}

function initChatbot() {
  const chatbotBubble = document.createElement('div');
  chatbotBubble.className = 'chatbot-bubble';
  chatbotBubble.innerHTML = `
    <div class="chatbot-icon"><i class="fas fa-robot"></i></div>
    <div class="chatbot-tooltip">Chat with Amrikyy AI</div>`;
  document.body.appendChild(chatbotBubble);

  chatbotBubble.addEventListener('click', () => toggleChatbot());

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
        <div class="message-content"><p>👋 Hello! I'm your Amrikyy AI assistant. How can I help you today?</p></div>
        <div class="message-time">Just now</div>
      </div>
    </div>
    <div class="chatbot-input">
      <input type="text" placeholder="Type your message..." id="chatbotInput">
      <button class="chatbot-send"><i class="fas fa-paper-plane"></i></button>
    </div>`;
  document.body.appendChild(chatbotContainer);

  const closeButton = chatbotContainer.querySelector('.chatbot-close');
  if (closeButton) closeButton.addEventListener('click', toggleChatbot);

  const chatbotInput = document.getElementById('chatbotInput');
  const sendButton = chatbotContainer.querySelector('.chatbot-send');
  if (chatbotInput && sendButton) {
    sendButton.addEventListener('click', sendChatbotMessage);
    chatbotInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendChatbotMessage();
    });
  }

  function toggleChatbot() {
    chatbotContainer.classList.toggle('hidden');
    if (!chatbotContainer.classList.contains('hidden')) chatbotInput.focus();
  }

  function sendChatbotMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    chatbotInput.value = '';
    addChatMessage(message, 'user');
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: message })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.response) addChatMessage(data.response, 'bot');
        else addChatMessage('Sorry, something went wrong.', 'bot');
      })
      .catch(() => addChatMessage('Error contacting server.', 'bot'));
  }

  function addChatMessage(message, sender) {
    const messagesContainer = chatbotContainer.querySelector('.chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageElement.innerHTML = `<div class="message-content"><p>${message}</p></div><div class="message-time">${currentTime}</div>`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function initImageUpload() {
  const avatarUpload = document.getElementById('avatarUpload');
  const avatarPreview = document.getElementById('avatarPreview');
  if (avatarUpload && avatarPreview) {
    avatarUpload.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          avatarPreview.style.backgroundImage = `url('${e.target.result}')`;
          userData.avatarImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

function initFormSubmission() {
  const idCardForm = document.getElementById('idCardForm');
  const resultSection = document.getElementById('resultSection');
  const resetBtn = document.getElementById('resetBtn');

  if (idCardForm) {
    idCardForm.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(idCardForm);
      userData = {};
      for (const [key, value] of formData.entries()) {
        userData[key] = value;
      }
      if (userData.avatarImage) userData.avatar = userData.avatarImage;
      showLoadingOverlay('Generating your digital ID...');
      try {
        const apiPayload = userData;
        cardData = await simulateApiCall(apiPayload);
        generateIdCard({ ...cardData, ...userData });
        document.getElementById('idGeneratorSection').classList.add('hidden');
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error generating ID card:', error);
        alert('An error occurred while generating your ID card. Please try again.');
      } finally {
        hideLoadingOverlay();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (idCardForm) idCardForm.reset();
      const preview = document.getElementById('avatarPreview');
      if (preview) preview.style.backgroundImage = 'url("avatar.jpg")';
      resultSection.classList.add('hidden');
      document.getElementById('idGeneratorSection').classList.remove('hidden');
      document.getElementById('idGeneratorSection').scrollIntoView({ behavior: 'smooth' });
      currentStep = 1;
      document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
      document.querySelector('.form-step[data-step="1"]').classList.add('active');
    });
  }
}

async function simulateApiCall(payload) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        nickname: 'TECH VOYAGER',
        title: 'Digital Explorer',
        id_number: 'AX-2025-78943',
        clearance_level: 'QUANTUM',
        analysis: 'A visionary innovator with exceptional problem-solving skills. Your unique blend of creativity and technical insight makes you a natural pioneer in digital frontiers.',
        ai_message: 'Challenge: Share your unique perspective on emerging tech with 3 people this week to expand your network of fellow explorers.',
        skills: ['AI Development', 'System Architecture', 'Creative Problem Solving', 'Digital Innovation'],
        color_theme: 'quantum_blue',
        color_hex: '#00d4ff',
        expiry_date: '2026-06-01T00:00:00Z',
        security_features: ['Biometric Verification', 'Quantum Encryption'],
        qr_data: 'https://amrikyy.com/verify/AX-2025-78943',
      });
    }, 1000);
  });
}

function generateIdCard(data) {
  const digitalIdCard = document.getElementById('digitalIdCard');
  if (!digitalIdCard) return;
  const avatarSrc = data.avatar || 'avatar.jpg';
  const userName = data.full_name || 'User';
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
    <img class="logo-watermark" src="amrikyy_neon_logo.webp" alt="Amrikyy Logo">`;

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

function initShareFunctionality() {
  const shareBtn = document.getElementById('shareBtn');
  const shareModal = document.getElementById('shareModal');
  const closeShareModal = document.getElementById('closeShareModal');
  const shareOptions = document.querySelectorAll('.share-option');
  const shareLink = document.getElementById('shareLink');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  if (shareBtn && shareModal) {
    shareBtn.addEventListener('click', () => {
      if (shareLink) shareLink.value = window.location.href;
      shareModal.classList.add('active');
    });
  }

  if (closeShareModal && shareModal) {
    closeShareModal.addEventListener('click', () => shareModal.classList.remove('active'));
    shareModal.addEventListener('click', e => {
      if (e.target === shareModal) shareModal.classList.remove('active');
    });
  }

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
        if (shareUrl) window.open(shareUrl, '_blank');
      });
    });
  }

  if (copyLinkBtn && shareLink) {
    copyLinkBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareLink.value);
        } else {
          shareLink.select();
          document.execCommand('copy');
        }
        const originalText = copyLinkBtn.textContent;
        copyLinkBtn.textContent = 'Copied!';
        setTimeout(() => { copyLinkBtn.textContent = originalText; }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const digitalIdCard = document.getElementById('digitalIdCard');
      if (digitalIdCard && typeof html2canvas === 'function') {
        showLoadingOverlay('Preparing download...');
        html2canvas(digitalIdCard).then(canvas => {
          const link = document.createElement('a');
          link.download = 'amrikyy-digital-id.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          hideLoadingOverlay();
        }).catch(error => {
          console.error('Error generating image:', error);
          alert('An error occurred while generating the image. Please try again.');
          hideLoadingOverlay();
        });
      } else {
        alert('Download functionality is not available. Please try again later.');
      }
    });
  }
}

function showLoadingOverlay(message = 'Loading...') {
  let loadingOverlay = document.getElementById('loadingOverlay');
  if (!loadingOverlay) {
    loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `<div class="loading-spinner"></div><div class="loading-message" id="loadingMessage">${message}</div>`;
    document.body.appendChild(loadingOverlay);
  } else {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) loadingMessage.textContent = message;
    loadingOverlay.classList.remove('hidden');
  }
}

function hideLoadingOverlay() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) loadingOverlay.classList.add('hidden');
}
