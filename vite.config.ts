import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget =
    env.VITE_API_URL || "http://localhost:18000";

  return {
    plugins: [react(), tailwindcss(), mkcert()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      // https: true,
      allowedHosts: ["rustred-ivey-miasmatical.ngrok-free.dev"],
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
