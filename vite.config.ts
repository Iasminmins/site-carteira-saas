import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Toda requisição que começar com "/api" será encaminhada para http://localhost:5000
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        // O rewrite aqui mantém o caminho "/api" intacto, mas você pode ajustar se preferir redirecionar para outro subcaminho no backend.
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
