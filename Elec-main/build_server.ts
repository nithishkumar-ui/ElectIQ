import { build } from 'esbuild';

build({
  entryPoints: ['server.ts'],
  bundle: true,
  outfile: 'dist/server.cjs',
  platform: 'node',
  format: 'cjs',
  external: [
    'express', 'better-sqlite3', 'drizzle-orm', '@google/genai', 'bcryptjs', 'jsonwebtoken', 
    'fsevents', 'chokidar'
  ]
}).catch(() => process.exit(1));
