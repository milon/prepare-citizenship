import { registerSW } from 'virtual:pwa-register';

const CHECK_MS = 30 * 60 * 1000;

/* Dev must not reuse a production/preview service worker — it serves stale JS and
makes local speech/UI fixes look like they "do nothing" after hard refresh. */
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      void registration.unregister();
    }
  });
} else {
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

      /* A downloaded update waits rather than reloading mid-mock, and it keeps
      waiting for as long as this tab lives. Hand over while the page is on its way
      out so the next page load is the new build. A page heading for the back/forward
      cache can come back mid-exam, so leave that one alone. */
      window.addEventListener('pagehide', (event) => {
        if (event.persisted) {
          return;
        }
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      });
    },
  });
}

