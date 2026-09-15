/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAS_API_URL?: string;
  readonly VITE_CLOUDFLARE_R2_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
