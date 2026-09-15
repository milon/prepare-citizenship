import { isStandaloneDisplay } from './persist-storage';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) {
    return true;
  }
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

export function installApp() {
  return {
    promptEvent: null as BeforeInstallPromptEvent | null,
    installed: false,
    ios: false,
    showHow: false,
    visible: false,
    canInstall: false,

    refresh() {
      this.canInstall = this.promptEvent !== null;
      this.visible = !this.installed && (this.ios || this.canInstall);
    },

    init() {
      this.installed = isStandaloneDisplay();
      this.ios = isIosDevice() && !this.installed;
      this.refresh();
      window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        this.promptEvent = event as BeforeInstallPromptEvent;
        this.refresh();
      });
      window.addEventListener('appinstalled', () => {
        this.installed = true;
        this.promptEvent = null;
        this.refresh();
      });
    },

    async install() {
      if (!this.promptEvent) {
        return;
      }
      await this.promptEvent.prompt();
      const choice = await this.promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        this.installed = true;
      }
      this.promptEvent = null;
      this.refresh();
    },
  };
}
