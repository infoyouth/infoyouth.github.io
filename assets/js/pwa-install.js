// PWA Install Prompt Handler
// Handles "Add to Home Screen" functionality
// 
// TRACKING EVENTS (viewable in Google Analytics & Microsoft Clarity):
// 1. pwa_prompt_shown - User is eligible to install (prompt available)
// 2. pwa_install_button_clicked - User clicked the install button
// 3. pwa_install_accepted - User accepted the installation
// 4. pwa_install_dismissed - User dismissed the installation prompt
// 5. pwa_installed - App successfully installed (most important metric!)
//
// To view in Google Analytics:
// - Go to: Reports > Engagement > Events
// - Look for events starting with "pwa_"
//
// To view in Microsoft Clarity:
// - Go to: Recordings > filter by custom events "pwa_installed"

let deferredPrompt;
let installButton;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Create install button
  createInstallButton();
  
  // Register service worker
  registerServiceWorker();
  
  // Diagnostic: Check manifest availability and CORS
  checkManifestAvailability();
});

// Register Service Worker
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      // Check if we're on HTTPS or localhost
      const isSecureContext = window.isSecureContext || 
                              window.location.hostname === 'localhost' || 
                              window.location.hostname === '127.0.0.1';
      
      if (!isSecureContext) {
        console.warn('⚠️  PWA requires HTTPS! Service Worker will not register.');
        console.log('💡 Deploy to GitHub Pages for HTTPS support.');
        return;
      }
      
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ ServiceWorker registered:', registration.scope);
      
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
      console.error('❌ ServiceWorker registration failed:', error);
    }
  } else {
    console.warn('⚠️  Service Worker not supported in this browser');
  }
}

// Create Install Button
function createInstallButton() {
  // Create floating install button
  const button = document.createElement('button');
  button.id = 'pwa-install-btn';
  button.className = 'pwa-install-button';
  
  // Detect iOS
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  if (isIOS && isSafari) {
    // iOS Safari: Show manual instructions
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
      <span>Install App</span>
    `;
    button.style.display = 'flex';
    button.addEventListener('click', showIOSInstructions);
  } else {
    // Android/Chrome: Standard install
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
  }
  
  document.body.appendChild(button);
  installButton = button;
}

// Show iOS installation instructions
function showIOSInstructions() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  `;
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 16px; padding: 24px; max-width: 400px; text-align: center;">
      <h3 style="margin: 0 0 16px; font-size: 1.5rem; color: #333;">Install Youth Innovations</h3>
      <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
        To install this app on your iPhone/iPad:
      </p>
      <ol style="text-align: left; color: #444; line-height: 1.8; margin: 0 0 20px; padding-left: 24px;">
        <li>Tap the <strong>Share</strong> button 
          <svg style="display: inline; vertical-align: middle;" width="16" height="20" viewBox="0 0 16 20" fill="#007AFF">
            <path d="M8 0l4 4h-3v8H7V4H4l4-4zm8 16v2a2 2 0 01-2 2H2a2 2 0 01-2-2v-2h2v2h12v-2h2z"/>
          </svg>
          at the bottom of the screen
        </li>
        <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
        <li>Tap <strong>"Add"</strong> in the top right corner</li>
      </ol>
      <button onclick="this.closest('div').parentElement.remove()" style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 24px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
      ">Got it!</button>
    </div>
  `;
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  document.body.appendChild(modal);
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
  
  // Track that prompt was shown (user is eligible to install)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'pwa_prompt_shown', {
      event_category: 'engagement',
      event_label: 'PWA Install Prompt Shown'
    });
  }
});

// Install App
async function installApp() {
  if (!deferredPrompt) {
    return;
  }
  
  // Track install button click
  if (typeof gtag !== 'undefined') {
    gtag('event', 'pwa_install_button_clicked', {
      event_category: 'engagement',
      event_label: 'PWA Install Button Clicked'
    });
  }
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for user response
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response: ${outcome}`);
  
  // Track user's choice
  if (typeof gtag !== 'undefined') {
    gtag('event', `pwa_install_${outcome}`, {
      event_category: 'engagement',
      event_label: `PWA Install ${outcome === 'accepted' ? 'Accepted' : 'Dismissed'}`,
      event_value: outcome === 'accepted' ? 1 : 0
    });
  }
  
  // Track with Clarity
  if (typeof clarity !== 'undefined') {
    clarity('event', `pwa_install_${outcome}`);
  }
  
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
  
  // Gather installation metadata
  const installData = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || 'direct'
  };
  
  // Track with Google Analytics (if available)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'pwa_installed', {
      event_category: 'engagement',
      event_label: 'PWA Installation',
      event_value: 1,
      user_agent: installData.userAgent,
      platform: installData.platform,
      language: installData.language
    });
  }
  
  // Track with Microsoft Clarity (if available)
  if (typeof clarity !== 'undefined') {
    clarity('event', 'pwa_installed', {
      platform: installData.platform,
      timestamp: installData.timestamp
    });
  }
  
  // Log to console for debugging (visible in browser console)
  console.table(installData);
  
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

// Diagnostic helper: fetch manifest and report status
async function checkManifestAvailability() {
  try {
    const resp = await fetch('/manifest.json', { cache: 'no-store' });
    if (!resp.ok) {
      console.warn('Manifest fetch responded with status:', resp.status);
      return;
    }
    const json = await resp.json();
    console.log('Manifest loaded, start_url=', json.start_url, 'icons=', json.icons && json.icons.map(i=>i.src));
  } catch (err) {
    console.error('Failed to fetch manifest (CORS or network):', err);
  }
}
