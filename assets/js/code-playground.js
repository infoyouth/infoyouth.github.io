/**
 * OneCompiler Code Playground Integration
 * Handles code population for embedded OneCompiler iframes
 * Version: 3.0 - Debug version
 */

(function() {
  'use strict';

  console.log('[Playground] Script loaded - Version 3.0 Debug');

  /**
   * Decode HTML entities from the data-code attribute
   */
  function decodeHTMLEntities(text) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  /**
   * Listen for messages from OneCompiler iframes
   */
  window.addEventListener('message', function(event) {
    // Only log messages from onecompiler.com
    if (event.origin.includes('onecompiler.com')) {
      console.log('[Playground] Message from OneCompiler:', event.data);
    }
  });

  /**
   * Initialize all code playgrounds on the page
   */
  function initializePlaygrounds() {
    const playgroundIframes = document.querySelectorAll('.onecompiler-iframe');
    
    if (playgroundIframes.length === 0) {
      console.log('[Playground] No playgrounds found on this page');
      return;
    }

    console.log(`[Playground] Found ${playgroundIframes.length} playground(s)`);
    
    playgroundIframes.forEach(function(iframe, index) {
      const encodedCode = iframe.getAttribute('data-code');
      const language = iframe.getAttribute('data-language');
      
      if (!encodedCode || !language) {
        console.warn(`[Playground ${index}] Missing code or language attribute`);
        return;
      }
      
      // Decode HTML entities from the code
      const code = decodeHTMLEntities(encodedCode);
      
      console.log(`[Playground ${index}] Language: ${language}`);
      console.log(`[Playground ${index}] Encoded: ${encodedCode.length} chars`);
      console.log(`[Playground ${index}] Decoded: ${code.length} chars`);
      console.log(`[Playground ${index}] First 100 chars:`, code.substring(0, 100));
      
      // Function to send code to iframe
      function sendCodeToIframe() {
        try {
          const message = {
            eventType: 'populateCode',
            language: language,
            files: [{
              name: 'main.' + language,
              content: code
            }]
          };
          
          console.log(`[Playground ${index}] Sending postMessage to iframe`);
          iframe.contentWindow.postMessage(message, '*');
          console.log(`[Playground ${index}] ✓ PostMessage sent successfully`);
        } catch (error) {
          console.error(`[Playground ${index}] ✗ PostMessage failed:`, error);
        }
      }
      
      // Wait for iframe to load, then send code
      iframe.addEventListener('load', function() {
        console.log(`[Playground ${index}] Iframe loaded, waiting 1 second before sending code...`);
        // Give OneCompiler a moment to initialize after load
        setTimeout(sendCodeToIframe, 1000);
      });
      
      // Backup: If iframe is already loaded (cached), send immediately
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        console.log(`[Playground ${index}] Iframe already loaded (cached)`);
        setTimeout(sendCodeToIframe, 1500);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    console.log('[Playground] Waiting for DOM...');
    document.addEventListener('DOMContentLoaded', function() {
      console.log('[Playground] DOM ready, initializing...');
      initializePlaygrounds();
    });
  } else {
    console.log('[Playground] DOM already ready, initializing...');
    initializePlaygrounds();
  }

})();
