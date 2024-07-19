import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '0.0.0.0', // 추가: 모든 호스트 인터페이스에서 접근 가능하도록 설정
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
});

