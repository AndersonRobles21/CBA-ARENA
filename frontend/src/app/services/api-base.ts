const DEFAULT_API_BASE = '/api';

export const API_BASE = (() => {
  if (typeof window !== 'undefined') {
    const fromWindow = (window as Window & { __API_BASE__?: string }).__API_BASE__;
    if (fromWindow) {
      return fromWindow;
    }
  }

  if (typeof process !== 'undefined' && process.env?.['API_BASE']) {
    return process.env['API_BASE'];
  }

  return DEFAULT_API_BASE;
})();
