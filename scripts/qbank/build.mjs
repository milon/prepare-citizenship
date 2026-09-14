export function build(chapter, source, rows) {
  return rows.map((row) => {
    if (row.t === 'tf') {
      return {
        id: row.id,
        chapter,
        region: row.region ?? null,
        type: 'true_false',
        difficulty: row.difficulty ?? 'core',
        prompt: { en: row.p },
        options: [
          { id: 'true', en: 'True' },
          { id: 'false', en: 'False' },
        ],
        correctOptionId: row.a,
        explanation: { en: row.e },
        source,
        ...(row.k ? { currentFactKey: row.k } : {}),
      };
    }

    const letters = ['a', 'b', 'c', 'd'];
    if (!row.o || row.o.length !== 4) {
      throw new Error(`${row.id} must have 4 options`);
    }

    return {
      id: row.id,
      chapter,
      region: row.region ?? null,
      type: 'mcq',
      difficulty: row.difficulty ?? 'core',
      prompt: { en: row.p },
      options: row.o.map((en, i) => ({ id: letters[i], en })),
      correctOptionId: row.a,
      explanation: { en: row.e },
      source,
      ...(row.k ? { currentFactKey: row.k } : {}),
    };
  });
}
