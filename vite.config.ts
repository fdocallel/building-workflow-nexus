
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
      '/api/slack-webhook': {
        target: 'https://dstbwvjvuwoqgjuwtlsx.supabase.co/functions/v1/slack-webhook',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/slack-webhook/, ''),
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdGJ3dmp2dXdvcWdqdXd0bHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MjUxNTcsImV4cCI6MjA2NTIwMTE1N30.bzP-xPkpiakbglJlJYM5fwgUu0D02ZlJ-0OKG64imP8'
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
