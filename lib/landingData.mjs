// Small ESM shim used by next.config when importing the TypeScript module is not possible.
// This returns an empty catalog so rewrites are a no-op. The full TypeScript
// `lib/landingData.ts` remains the source of truth for the app runtime.
export const LANDING_CATALOG = {};
export function listAllLandingRoutes() {
  return [];
}
export function getLandingInfo() {
  return undefined;
}
