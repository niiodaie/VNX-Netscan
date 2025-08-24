/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GITHUB_CLIENT_ID: string;
  readonly VITE_DISCORD_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}