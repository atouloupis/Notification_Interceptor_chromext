// page-script.js
const originalNotification = window.Notification;

const notificationHandler = {
  construct(target, args) {
    const [title, options] = args;
    
    // Envoyer les données via postMessage
    window.postMessage({
      type: '__notification_intercepted__',
      data: {
        title,
        options,
        timestamp: new Date().toISOString()
      }
    }, '*');
    
    return Reflect.construct(originalNotification, args);
  },
  
  get(target, prop) {
    if (prop === 'requestPermission') {
      return function() {
        return originalNotification.requestPermission().then(permission => {
          console.log('Permission demandée:', permission);
          return permission;
        });
      };
    }
    return Reflect.get(target, prop);
  }
};

const ProxiedNotification = new Proxy(originalNotification, notificationHandler);

Object.defineProperty(window, 'Notification', {
  value: ProxiedNotification,
  writable: false,
  configurable: false
});