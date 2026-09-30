'use client';

export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
  landing_page?: string;
  captured_at?: string;
}

const STORAGE_KEY = 'destrava_attribution';

export function captureUtmParams(): AttributionData {
  if (typeof window === 'undefined') return {};

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const hasParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'fbclid',
      'gclid',
    ].some((key) => searchParams.has(key));

    const existingStr = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    const existing: AttributionData = existingStr ? JSON.parse(existingStr) : {};

    if (hasParams || !existing.landing_page) {
      const data: AttributionData = {
        ...existing,
        utm_source: searchParams.get('utm_source') || existing.utm_source || undefined,
        utm_medium: searchParams.get('utm_medium') || existing.utm_medium || undefined,
        utm_campaign: searchParams.get('utm_campaign') || existing.utm_campaign || undefined,
        utm_content: searchParams.get('utm_content') || existing.utm_content || undefined,
        utm_term: searchParams.get('utm_term') || existing.utm_term || undefined,
        fbclid: searchParams.get('fbclid') || existing.fbclid || undefined,
        gclid: searchParams.get('gclid') || existing.gclid || undefined,
        referrer: document.referrer || existing.referrer || undefined,
        landing_page: window.location.pathname + window.location.search,
        captured_at: existing.captured_at || new Date().toISOString(),
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }

    return existing;
  } catch {
    return {};
  }
}

export function getAttributionData(): AttributionData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
