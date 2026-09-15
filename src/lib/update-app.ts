type UpdateState = 'idle' | 'checking' | 'current' | 'ready' | 'offline' | 'error' | 'none';

const MESSAGE_KEYS: Record<UpdateState, string> = {
  idle: '',
  checking: '',
  current: 'settings.updateCurrent',
  ready: 'settings.updateReady',
  offline: 'settings.updateOffline',
  error: 'settings.updateError',
  none: 'settings.updateNone',
};

/* update() resolves before the browser reports the new worker, so watch the
registration for a moment instead of reading it once. */
const POLL_MS = 250;
const POLL_TRIES = 24;

type I18nStore = {
  t(key: string, vars?: Record<string, string | number>): string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function findNewWorker(registration: ServiceWorkerRegistration) {
  for (let attempt = 0; attempt < POLL_TRIES; attempt += 1) {
    const worker = registration.installing ?? registration.waiting;
    if (worker) {
      return worker;
    }
    await sleep(POLL_MS);
  }
  return null;
}

/* The worker parks itself in "waiting" so nobody loses a mock exam to a surprise
reload. This is the one place the reload is asked for, so let it through: the
worker takes over on activation and pwa.ts reloads the page. */
function activate(worker: ServiceWorker) {
  const skipWaiting = () => worker.postMessage({ type: 'SKIP_WAITING' });
  if (worker.state === 'installed') {
    skipWaiting();
  }
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      skipWaiting();
    }
  });
}

export function updateApp() {
  return {
    state: 'idle' as UpdateState,

    tx(key: string, vars?: Record<string, string | number>) {
      const store = (this as unknown as { $store: { i18n: I18nStore } }).$store.i18n;
      return store.t(key, vars);
    },

    buttonLabel() {
      return this.tx(this.state === 'checking' ? 'settings.checking' : 'settings.checkUpdate');
    },

    message() {
      const key = MESSAGE_KEYS[this.state];
      return key ? this.tx(key) : '';
    },

    async check() {
      if (this.state === 'checking') {
        return;
      }
      if (!('serviceWorker' in navigator)) {
        this.state = 'none';
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        this.state = 'none';
        return;
      }
      if (!navigator.onLine) {
        this.state = 'offline';
        return;
      }

      this.state = 'checking';
      try {
        await registration.update();
      } catch {
        this.state = 'error';
        return;
      }

      const worker = await findNewWorker(registration);
      if (!worker) {
        this.state = 'current';
        return;
      }
      this.state = 'ready';
      activate(worker);
    },

    reload() {
      window.location.reload();
    },
  };
}
