function text(en, fr) {
  return fr ? { en, fr } : { en };
}

export function build(chapter, source, rows) {
  return rows.map((row) => {
    if (row.t === 'tf') {
      return {
        id: row.id,
        chapter,
        region: row.region ?? null,
        type: 'true_false',
        difficulty: row.difficulty ?? 'core',
        prompt: text(row.p, row.pf),
        options: [
          { id: 'true', en: 'True', fr: 'Vrai' },
          { id: 'false', en: 'False', fr: 'Faux' },
        ],
        correctOptionId: row.a,
        explanation: text(row.e, row.ef),
        source,
        ...(row.k ? { currentFactKey: row.k } : {}),
      };
    }

    const letters = ['a', 'b', 'c', 'd'];
    if (!row.o || row.o.length !== 4) {
      throw new Error(`${row.id} must have 4 options`);
    }
    if (row.of && row.of.length !== 4) {
      throw new Error(`${row.id} French options must have 4 entries`);
    }

    return {
      id: row.id,
      chapter,
      region: row.region ?? null,
      type: 'mcq',
      difficulty: row.difficulty ?? 'core',
      prompt: text(row.p, row.pf),
      options: row.o.map((en, i) => ({
        id: letters[i],
        ...text(en, row.of?.[i]),
      })),
      correctOptionId: row.a,
      explanation: text(row.e, row.ef),
      source,
      ...(row.k ? { currentFactKey: row.k } : {}),
    };
  });
}
