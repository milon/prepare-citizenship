// @ts-check
import { defineConfig } from 'astro/config';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: 'https://milon.github.io',
  base: isGitHubPagesBuild && repositoryName ? `/${repositoryName}` : '/',
  output: 'static',
});
