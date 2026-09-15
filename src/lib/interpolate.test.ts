import { describe, expect, it } from 'vitest';
import current from '../content/current.json';
import { interpolateCurrent } from './interpolate';
import type { CurrentFacts } from '../content/schema';

const facts = current as CurrentFacts;

describe('interpolateCurrent regional facts', () => {
  it('fills Ontario sitting officials', () => {
    const text =
      '{{premier}} / {{crownRepresentative}} / {{oppositionLeader}} / {{governingParty}}';
    expect(interpolateCurrent(text, facts, { region: 'on', locale: 'en' })).toBe(
      'Doug Ford / Edith Dumont / Marit Stiles / Progressive Conservative Party',
    );
  });

  it('fills consensus territory opposition in French', () => {
    const text = '{{oppositionLeader}} — {{governingParty}}';
    expect(interpolateCurrent(text, facts, { region: 'nt', locale: 'fr' })).toBe(
      'Aucun (gouvernement de consensus) — Gouvernement de consensus',
    );
  });

  it('leaves regional tokens alone without a region', () => {
    expect(interpolateCurrent('{{premier}}', facts)).toBe('{{premier}}');
  });
});
