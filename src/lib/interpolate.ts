import type { CurrentFactKey, CurrentFacts } from '../content/schema';
import { CURRENT_FACT_KEYS } from '../content/schema';

export function interpolateCurrent(text: string, current: CurrentFacts): string {
  return text.replace(/\{\{(\w+)\}\}/g, (token, key: string) => {
    if ((CURRENT_FACT_KEYS as readonly string[]).includes(key)) {
      return current[key as CurrentFactKey];
    }
    return token;
  });
}
