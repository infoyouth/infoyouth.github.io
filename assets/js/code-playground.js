/**
 * OneCompiler Code Playground Integration
 * Handles code population for embedded OneCompiler iframes
 * Version: 2.0 - Compatible with GitHub Pages
 */

(function() {
  'use strict';

  console.log('[Playground] Script loaded');

  /**
   * Decode HTML entities from the data-code attribute
   */
  function decodeHTMLEntities(text) {
    var textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  /**
   * Populate a single playground iframe
   */
  function populatePlayground(iframe, index) {
    var encodedCode = iframe.getAttribute('data-code');
    var language = iframe.getAttribute('data-language');
    
    if (!encodedCode || !language) {
      console.warn('[Playground ' + index + '] Missing code or language attribute');
      return false;
    }
    
    var code = decodeHTMLEntities(encodedCode);
    console.log('[Playground ' + index + '] Decoded ' + encodedCode.length + ' → ' + code.length + ' chars');
    
    try {
      iframe.contentWindow.postMessage({
        eventType: 'populateCode',
        language: language,
        files: [{
          name: 'main.' + language,
          content: code
        }]
      }, '*');
      
      console.log('[Playground ' + index + '] ✓ Code sent to OneCompiler (' + language + ')');
      return true;
    } catch (error) {
      console.error('[Playground ' + index + '] ✗ Failed to send code:', error);
      return false;
    }
  }

  /**
   * Initialize all playgrounds on the page
   */
  function initializeAllPlaygrounds() {
    var iframes = document.querySelectorAll('.onecompiler-iframe');
    
    if (iframes.length === 0) {
      console.log('[Playground] No playgrounds found on this page');
      return;
    }

    console.log('[Playground] Found ' + iframes.length + ' playground(s), initializing...');
    
    var successCount = 0;
    iframes.forEach(function(iframe, index) {
      // Stagger the population to avoid overwhelming OneCompiler
      var delay = 1500 + (index * 400);
      
      setTimeout(function() {
        if (populatePlayground(iframe, index)) {
          successCount++;
        }
      }, delay);
    });
    
    // Log summary after all attempts
    setTimeout(function() {
      console.log('[Playground] Initialization complete: ' + successCount + '/' + iframes.length + ' successful');
    }, 1500 + (iframes.length * 400) + 500);
  }

  /**
   * Initialize playgrounds when a details element is expanded
   */
  window.initializePlaygroundOnExpand = function(summaryElement) {
    var details = summaryElement.parentElement;
    if (details.getAttribute('data-playground-ready') === 'true') {
      return; // Already initialized
    }
    
    console.log('[Playground] Expanding playground, initializing...');
    details.setAttribute('data-playground-ready', 'true');
    
    var iframe = details.querySelector('.onecompiler-iframe');
    if (iframe) {
      setTimeout(function() {
        populatePlayground(iframe, 'expanded');
      }, 800);
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('[Playground] DOM ready, initializing...');
      setTimeout(initializeAllPlaygrounds, 500);
    });
  } else {
    console.log('[Playground] DOM already ready, initializing...');
    setTimeout(initializeAllPlaygrounds, 500);
  }

  // Backup initialization on window load
  window.addEventListener('load', function() {
    console.log('[Playground] Window loaded, running backup initialization...');
    setTimeout(initializeAllPlaygrounds, 1000);
  });

  console.log('[Playground] Event listeners registered');

})();
