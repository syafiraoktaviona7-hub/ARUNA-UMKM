import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    // Frontend memanggil /api, Vite meneruskannya ke backend CodeIgniter
    proxy: {
      "/api": { target: "http://localhost:8080", changeOrigin: true },
    },
    // Folder backend ada di repo yang sama, tidak perlu dipantau Vite
    watch: { ignored: ["**/backend/**", "**/database/**"] },
  },
});
