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
      "/api/chat": {
        target: "http://localhost:5678",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api\/chat/, "/webhook/4c0e5d95-ca09-49b7-8e80-5f9cdd9415af/chat");
          console.log(`[Vite Proxy] ${path} → ${newPath}`);
          return newPath;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('[Vite Proxy] Error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('[Vite Proxy] Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('[Vite Proxy] Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
