/**
 * OneCompiler Code Playground Integration
 * Handles code population for embedded OneCompiler iframes
 */

(function() {
  'use strict';

  /**
   * Decode HTML entities from the data-code attribute
   * This handles &quot;, &amp;, &lt;, &gt;, etc.
   */
  function decodeHTMLEntities(text) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  /**
   * Initialize all code playgrounds on the page
   */
  function initializePlaygrounds() {
    const playgroundIframes = document.querySelectorAll('.onecompiler-iframe');
    
    if (playgroundIframes.length === 0) {
      return; // No playgrounds on this page
    }

    console.log(`Found ${playgroundIframes.length} code playground(s)`);
    
    playgroundIframes.forEach(function(iframe, index) {
      const encodedCode = iframe.getAttribute('data-code');
      const language = iframe.getAttribute('data-language');
      
      if (!encodedCode || !language) {
        console.warn(`Playground ${index} missing code or language attribute`);
        return;
      }
      
      // Decode HTML entities from the code
      const code = decodeHTMLEntities(encodedCode);
      
      console.log(`Playground ${index}: Decoded ${encodedCode.length} chars to ${code.length} chars`);
      
      // Wait for iframe to be fully loaded, then populate code
      // Stagger the messages to avoid race conditions
      const delay = 1000 + (index * 300);
      
      setTimeout(function() {
        try {
          iframe.contentWindow.postMessage({
            eventType: 'populateCode',
            language: language,
            files: [{
              name: 'main.' + language,
              content: code
            }]
          }, '*');
          
          console.log(`Populated playground ${index} (${language})`);
        } catch (error) {
          console.error(`Failed to populate playground ${index}:`, error);
        }
      }, delay);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePlaygrounds);
  } else {
    // DOM is already ready
    initializePlaygrounds();
  }

  // Re-initialize when window fully loads (backup)
  window.addEventListener('load', function() {
    setTimeout(initializePlaygrounds, 500);
  });

})();
