import { registerSW } from 'virtual:pwa-register';

const CHECK_MS = 30 * 60 * 1000;

registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) {
      return;
    }

    const check = () => {
      if (document.visibilityState !== 'visible') {
        return;
      }
      if (!navigator.onLine) {
        return;
      }
      void registration.update();
    };

    setInterval(check, CHECK_MS);
    window.addEventListener('online', check);
    document.addEventListener('visibilitychange', check);
  },
});

