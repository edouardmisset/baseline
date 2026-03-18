/// <reference types="vite-plus/client" />

declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}
