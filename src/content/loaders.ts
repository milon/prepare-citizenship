import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Loader } from 'astro/loaders';

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

export function jsonArrayLoader(relativeDir: string): Loader {
  const dir = join(process.cwd(), relativeDir);

  return {
    name: 'json-array-loader',
    load: async ({ store, parseData, generateDigest, watcher, logger }) => {
      async function sync() {
        store.clear();
        const entries = await loadJsonArray(relativeDir);
        for (const entry of entries) {
          const data = await parseData({ id: entry.id, data: entry });
          store.set({
            id: entry.id,
            data,
            digest: generateDigest(data),
          });
        }
      }

      await sync();
      watcher?.add(dir);
      watcher?.on('change', async (changedPath) => {
        if (changedPath.startsWith(dir) && changedPath.endsWith('.json')) {
          logger.info(`Reloading ${relativeDir}`);
          await sync();
        }
      });
    },
  };
}
