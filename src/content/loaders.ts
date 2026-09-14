import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function loadJsonArray(
  relativeDir: string,
): Promise<{ id: string; [key: string]: unknown }[]> {
  const dir = join(process.cwd(), relativeDir);
  const files = (await readdir(dir)).filter((name) => name.endsWith('.json')).sort();
  const entries: { id: string; [key: string]: unknown }[] = [];

  for (const fileName of files) {
    const raw = await readFile(join(dir, fileName), 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error(`${relativeDir}/${fileName} must be a JSON array`);
    }

    for (const [index, item] of parsed.entries()) {
      if (item === null || typeof item !== 'object' || Array.isArray(item)) {
        throw new Error(`${fileName}[${index}] must be an object`);
      }
      const record = item as Record<string, unknown>;
      if (typeof record.id !== 'string' || record.id.length === 0) {
        throw new Error(`${fileName}[${index}] must have a string id`);
      }
      entries.push({ ...record, id: record.id });
    }
  }

  return entries;
}

export function jsonArrayLoader(relativeDir: string) {
  return async () => loadJsonArray(relativeDir);
}
