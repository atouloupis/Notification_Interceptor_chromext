document.addEventListener('DOMContentLoaded', function() {
  function displayNotifications() {
    chrome.storage.local.get({notifications: []}, function(result) {
      const notificationsDiv = document.getElementById('notifications');
      notificationsDiv.innerHTML = '';
      
      result.notifications.reverse().forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification';
        notificationElement.innerHTML = `
          <strong>Titre:</strong> ${notification.title}<br>
          <strong>Source:</strong> ${notification.sourceUrl}<br>
          <strong>Date:</strong> ${new Date(notification.timestamp).toLocaleString()}<br>
          <strong>Contenu:</strong><br>
          <pre>${JSON.stringify(notification.options, null, 2)}</pre>
        `;
        notificationsDiv.appendChild(notificationElement);
      });
    });
  }
  
  displayNotifications();
  
  document.getElementById('clearNotifications').addEventListener('click', function() {
    chrome.storage.local.set({notifications: []}, function() {
      displayNotifications();
    });
  });
});