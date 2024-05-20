import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
function loadEnv() {
  const myEnv = dotenv.config();
  dotenvExpand.expand(myEnv);
}
loadEnv();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
})
