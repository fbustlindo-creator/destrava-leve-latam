'use client';

import { getAttributionData } from './utm-tracker';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function pushDataLayer(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  const attribution = getAttributionData();

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    ...attribution,
    ...params,
  };

  window.dataLayer.push(payload);

  if (process.env.NODE_ENV !== 'production' || window.location.search.includes('debug=true')) {
    console.log(`%c[DataLayer] ${event}`, 'background: #2563eb; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;', payload);
  }
}

export function trackVirtualPageView(screenIndex: number, slug: string, title?: string) {
  const pagePath = slug ? `/${slug}` : '/';
  const pageTitle = title || `Destrava Leve - Etapa ${screenIndex + 1}`;

  pushDataLayer('virtual_pageview', {
    page_path: pagePath,
    page_title: pageTitle,
    funnel_step: screenIndex + 1,
    funnel_slug: slug || 'inicio',
  });

  // Se o GTM tiver carregado a tag do Meta Pixel ou Clarity, aciona as instâncias nativas:
  if (typeof window.fbq === 'function') {
    try {
      window.fbq('track', 'PageView', {
        page_path: pagePath,
        funnel_step: screenIndex + 1,
      });
    } catch {}
  }

  if (typeof window.clarity === 'function') {
    try {
      window.clarity('set', 'funnel_step', slug || `step_${screenIndex + 1}`);
    } catch {}
  }
}

export function trackQuizStart(age?: string) {
  pushDataLayer('quiz_start', {
    age_bracket: age,
  });

  if (typeof window.fbq === 'function') {
    try {
      window.fbq('trackCustom', 'QuizStart', { age_bracket: age });
    } catch {}
  }
}

export function trackQuizAnswer(questionId: string, answer: string | string[], screenIndex: number) {
  pushDataLayer('quiz_answer', {
    question_id: questionId,
    answer_value: answer,
    step_number: screenIndex + 1,
  });
}

export function trackMechanismView() {
  pushDataLayer('mechanism_view', {
    content_name: 'Mecanismo G1 Bem-Estar',
  });
}

export function trackResultView(score: number, restrictionLevel: string) {
  pushDataLayer('result_view', {
    fascial_score: score,
    restriction_level: restrictionLevel,
  });

  if (typeof window.fbq === 'function') {
    try {
      window.fbq('trackCustom', 'QuizResult', {
        score,
        restriction_level: restrictionLevel,
      });
    } catch {}
  }

  if (typeof window.clarity === 'function') {
    try {
      window.clarity('set', 'fascial_score', String(score));
    } catch {}
  }
}

export function trackLeadCapture(email: string, name?: string) {
  pushDataLayer('lead_capture', {
    lead_email: email,
    lead_name: name || undefined,
  });

  if (typeof window.fbq === 'function') {
    try {
      window.fbq('track', 'Lead', {
        content_name: 'Lead Destrava Leve',
      });
    } catch {}
  }

  if (typeof window.clarity === 'function') {
    try {
      window.clarity('identify', email);
    } catch {}
  }
}

export function trackWheelWon(discount: string) {
  pushDataLayer('discount_won', {
    discount_amount: discount,
  });

  if (typeof window.fbq === 'function') {
    try {
      window.fbq('trackCustom', 'DiscountWon', {
        discount,
      });
    } catch {}
  }
}

export function trackViewContentOffer(price = 37.0) {
  pushDataLayer('view_item', {
    content_name: 'Destrava Leve 28D',
    currency: 'BRL',
    value: price,
  });

  if (typeof window.fbq === 'function') {
    try {
      window.fbq('track', 'ViewContent', {
        content_name: 'Destrava Leve 28D',
        content_type: 'product',
        currency: 'BRL',
        value: price,
      });
    } catch {}
  }
}

export function trackInitiateCheckout(price = 37.0) {
  pushDataLayer('initiate_checkout', {
    content_name: 'Destrava Leve 28D',
    currency: 'BRL',
    value: price,
  });

  if (typeof window.fbq === 'function') {
    try {
      window.fbq('track', 'InitiateCheckout', {
        content_name: 'Destrava Leve 28D',
        content_type: 'product',
        currency: 'BRL',
        value: price,
      });
    } catch {}
  }
}
