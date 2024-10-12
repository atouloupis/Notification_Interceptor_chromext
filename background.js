chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'notificationIntercepted') {
    chrome.storage.local.get({notifications: []}, function(result) {
      let notifications = result.notifications;
      notifications.push({
        ...message.data,
        sourceUrl: sender.tab ? sender.tab.url : 'Unknown'
      });
      
      // Garder seulement les 100 dernières notifications
      if (notifications.length > 100) {
        notifications = notifications.slice(-100);
      }
      
      chrome.storage.local.set({notifications}, function() {
        console.log('Notification enregistrée:', message.data);
      });
	  // Envoyer à l'API
      sendToAPI(notifications[0]);
    });
  }
  return true;
});


async function sendToAPI(notificationData) {
  try {
    // Préparer les données pour l'API
    const apiData = {
      body: JSON.stringify({
        title: notificationData.title,
        options: notificationData.options,
        sourceUrl: notificationData.sourceUrl,
        timestamp: notificationData.timestamp
      })
    };

    // Appel à l'API
    const response = await fetch('https://yourapi.com/endpoint/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData)	
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Réponse API:', responseData);
  } catch (error) {
    console.error('Erreur lors de l\'envoi à l\'API:', error);
  }
}