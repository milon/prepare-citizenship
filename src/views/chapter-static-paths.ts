import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const chapters = await getCollection('chapters');
  return chapters.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

