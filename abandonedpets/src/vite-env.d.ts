interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  // 다른 환경 변수를 추가할 수 있습니다.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
