import { loadProgress, saveProgress } from './progress';

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const nav = window.navigator as Navigator & { standalone?: boolean };
  if (nav.standalone) {
    return true;
  }
  return window.matchMedia('(display-mode: standalone)').matches;
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) {
    return false;
  }
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export async function maybeRequestPersistentStorage(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }
  const loaded = loadProgress();
  if (!loaded.storageAvailable || loaded.progress.settings.persistAsked) {
    return;
  }
  if (!isStandaloneDisplay()) {
    return;
  }
  await requestPersistentStorage();
  loaded.progress.settings.persistAsked = true;
  saveProgress(loaded.progress);
}

export function watchForInstallAndPersist(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.addEventListener('appinstalled', () => {
    void maybeRequestPersistentStorage();
  });
  void maybeRequestPersistentStorage();
}
