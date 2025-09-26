import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  //  resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src'),
  //   },
  // },
  server: {
    host: "0.0.0.0",
    historyApiFallback: true, // 👈 esto asegura que todas las rutas vayan a index.html

    port: 5174,
    watch: {
      usePolling: true,
      interval: 100,
    },
    strictPort: true,
  },
});
