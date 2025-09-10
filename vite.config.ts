import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // ★ Reactプラグインをインポートします

export default defineConfig(({ command }) => {
    const env = loadEnv(command, '.', '');
    return {
      plugins: [react()],
      base: command === 'build' ? "/Moneylabel/" : "/",
      
      // 以下は元の設定です
      define: {
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
