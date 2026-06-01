/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_WS_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
// Объявляем, что любые .css файлы — это модули
declare module '*.css' {
    const content: Record<string, string>;
    export default content;
}