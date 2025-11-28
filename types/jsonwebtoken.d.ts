declare module 'jsonwebtoken' {
  export function sign(payload: unknown, secret: string, options?: Record<string, unknown>): string;
  export function verify(token: string, secret: string, options?: Record<string, unknown>): unknown;
  export function decode(token: string, options?: Record<string, unknown>): unknown;
  const _default: unknown;
  export default _default;
}
