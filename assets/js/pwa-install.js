// PWA Install Prompt Handler
// Handles "Add to Home Screen" functionality

let deferredPrompt;
let installButton;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Create install button
  createInstallButton();
  
  // Register service worker
  registerServiceWorker();
});

// Register Service Worker
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registered:', registration.scope);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available, show update notification
            showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  }
}

// Create Install Button
function createInstallButton() {
  // Create floating install button
  const button = document.createElement('button');
  button.id = 'pwa-install-btn';
  button.className = 'pwa-install-button';
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    <span>Install App</span>
  `;
  button.style.display = 'none';
  button.addEventListener('click', installApp);
  
  document.body.appendChild(button);
  installButton = button;
}

// Listen for install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  
  // Save the event for later use
  deferredPrompt = e;
  
  // Show install button
  if (installButton) {
    installButton.style.display = 'flex';
  }
  
  console.log('PWA install prompt ready');
});

// Install App
async function installApp() {
  if (!deferredPrompt) {
    return;
  }
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for user response
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response: ${outcome}`);
  
  // Hide install button
  if (installButton) {
    installButton.style.display = 'none';
  }
  
  // Clear the deferred prompt
  deferredPrompt = null;
}

// Track installation
window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully!');
  
  // Track with analytics (if available)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'pwa_installed', {
      event_category: 'engagement',
      event_label: 'PWA Installation'
    });
  }
  
  // Hide install button
  if (installButton) {
    installButton.style.display = 'none';
  }
});

// Show update notification
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'pwa-update-notification';
  notification.innerHTML = `
    <div class="pwa-update-content">
      <span>🎉 New content available!</span>
      <button onclick="window.location.reload()">Refresh</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    notification.remove();
  }, 10000);
}

// Check if running as PWA
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Add PWA-specific styles
if (isPWA()) {
  document.body.classList.add('pwa-mode');
  console.log('Running as PWA');
}
