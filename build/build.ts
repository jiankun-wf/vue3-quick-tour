import { build } from 'vite';
import {fileURLToPath} from 'url';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const buildALl = async () => {
  await build({ configFile: resolve(__dirname, 'vite.cjs.ts') });
  await build({ configFile: resolve(__dirname, 'vite.es.ts') });
  await build({ configFile: resolve(__dirname, 'vite.umd.ts') });
};

void buildALl();
