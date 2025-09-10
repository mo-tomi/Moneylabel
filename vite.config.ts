import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // ★ Reactプラグインをインポートします

export default defineConfig(({ command }) => {
    const env = loadEnv(command, '.', '');
    return {
      plugins: [react()],
      base: command === 'build' ? "/" : "/",
      
      // 以下は元の設定です
      define: {
        'process.env.DEEPSEEK_KEY': JSON.stringify(env.DEEPSEEK_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
