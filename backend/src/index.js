import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './app.js';

config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });
const { BACKEND_PORT } = process.env;

const app = createApp();

app.listen(BACKEND_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${BACKEND_PORT}`);
});
