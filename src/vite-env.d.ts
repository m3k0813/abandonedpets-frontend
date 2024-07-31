interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_FUNERAL_URL: string; // 여기에 추가
  // 다른 환경 변수를 추가할 수 있습니다.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
