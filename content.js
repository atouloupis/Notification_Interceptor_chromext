// content.js
function injectScript(file) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', chrome.runtime.getURL(file));
  (document.head || document.documentElement).appendChild(script);
  script.onload = function() {
    script.remove();
  };
}

// Injecter notre script
injectScript('page-script.js');

// Écouter les messages de la page
window.addEventListener('message', function(event) {
  // Vérifier que le message vient de la même fenêtre
  if (event.source !== window) return;
  
  // Vérifier que c'est bien notre type de message
  if (event.data.type === '__notification_intercepted__') {
    try {
      // Envoyer au background script
      chrome.runtime.sendMessage({
        type: 'notificationIntercepted',
        data: event.data.data
      });
    } catch (e) {
      console.error('Erreur lors de l\'envoi au background:', e);
    }
  }
}, false);