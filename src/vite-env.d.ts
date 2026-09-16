/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDFLARE_R2_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
