import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  input: {
    portada: resolve(process.cwd(), 'index.html'),
    login: resolve(process.cwd(), 'login.html'),
  },
});