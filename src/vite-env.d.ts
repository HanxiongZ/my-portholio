/// <reference types="vite/client" />

// Figma asset imports — resolved by vite.config.ts aliases
declare module "figma:asset/*.png" {
  const src: string;
  export default src;
}
declare module "figma:asset/*.jpg" {
  const src: string;
  export default src;
}
declare module "figma:asset/*.jpeg" {
  const src: string;
  export default src;
}
declare module "figma:asset/*.svg" {
  const src: string;
  export default src;
}
declare module "figma:asset/*.gif" {
  const src: string;
  export default src;
}
