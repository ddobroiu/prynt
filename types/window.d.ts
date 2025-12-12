// TypeScript definitions for TikTok Pixel and other window objects

interface TikTokPixelEventData {
  content_id?: string;
  content_type?: string;
  content_name?: string;
  value?: number;
  currency?: string;
  quantity?: number;
  description?: string;
  [key: string]: any;
}

interface TikTokPixel {
  page: () => void;
  track: (event: string, data?: TikTokPixelEventData) => void;
  identify: (data: Record<string, any>) => void;
  instances: (pixelId: string) => TikTokPixel;
  debug: (enable: boolean) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
  once: (event: string, callback: (...args: any[]) => void) => void;
  ready: (callback: () => void) => void;
  alias: (userId: string) => void;
  group: (groupId: string) => void;
  enableCookie: () => void;
  disableCookie: () => void;
  holdConsent: () => void;
  revokeConsent: () => void;
  grantConsent: () => void;
  load: (pixelId: string, options?: Record<string, any>) => void;
  _i: Record<string, any[]>;
  _t: Record<string, number>;
  _o: Record<string, Record<string, any>>;
  methods: string[];
  setAndDefer: (target: any, method: string) => void;
  instance: (pixelId: string) => any;
  push: (args: any[]) => void;
}

declare global {
  interface Window {
    ttq?: TikTokPixel;
    TiktokAnalyticsObject?: string;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export {};
