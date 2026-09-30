'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { getPathByScreen, getScreenBySlug } from './funnel-routes';

// One transition owner: CSS and answer updates must not restart the page entrance.
export function useFunnelMotion(screen: number, setScreen: (screen: number) => void) {
  const shellRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const animationRef = useRef<Animation | null>(null);
  const directionRef = useRef(1);
  const [busy, setBusy] = useState(false);
  const [fullMotion, setFullMotion] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFullMotion(true);
    setReady(true);
  }, []);

  const toggleMotion = () => {
    if (busyRef.current) return;
    const next = !fullMotion;
    try { localStorage.setItem('destrava-motion', next ? 'full' : 'reduced'); } catch {}
    setFullMotion(next);
  };

  useLayoutEffect(() => {
    if (!ready) return;
    animationRef.current?.cancel();
    const main = shellRef.current?.querySelector('main');
    if (!main) return;
    busyRef.current = true;
    setBusy(true);
    main.style.willChange = 'transform, opacity';
    const animation = main.animate([
      { opacity: 0, transform: `translateX(${fullMotion ? 70 * directionRef.current : 0}px)` },
      { opacity: 1, transform: 'translateX(0)' },
    ], { duration: fullMotion ? 420 : 120, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'both' });
    animationRef.current = animation;
    animation.finished.then(() => {
      if (animationRef.current !== animation) return;
      animation.cancel();
      animationRef.current = null;
      main.style.willChange = '';
      busyRef.current = false;
      setBusy(false);
    }).catch(() => {
      busyRef.current = false;
      setBusy(false);
    });
    return () => {
      animation.cancel();
      main.style.willChange = '';
      busyRef.current = false;
      setBusy(false);
      if (animationRef.current === animation) animationRef.current = null;
    };
  }, [screen, fullMotion, ready]);

  const go = useCallback((next: number, feedbackDelay = 0) => {
    const target = Math.max(0, Math.min(38, next));
    if (target === screen || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    const direction = target > screen ? 1 : -1;
    directionRef.current = direction;
    const main = shellRef.current?.querySelector('main');
    const finish = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const nextPath = getPathByScreen(target);
      if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
        window.history.pushState({ screen: target }, '', nextPath);
      }
      busyRef.current = false;
      setBusy(false);
      // Commit the next frame immediately, not in a deferred React render lane.
      flushSync(() => setScreen(target));
    };
    if (!main) { finish(); return; }
    main.style.willChange = 'transform, opacity';
    const animation = main.animate([
      { opacity: 1, transform: 'translateX(0)' },
      { opacity: 0, transform: `translateX(${fullMotion ? -32 * direction : 0}px)` },
    ], { duration: fullMotion ? 140 : 90, delay: Math.min(feedbackDelay, 80), easing: 'ease-in', fill: 'both' });
    animationRef.current = animation;
    animation.finished.then(() => {
      if (animationRef.current === animation) finish();
    }).catch(() => {
      finish();
    });
  }, [screen, fullMotion, setScreen]);

  useEffect(() => {
    const onPopState = () => {
      const targetScreen = getScreenBySlug(window.location.pathname);
      setScreen(targetScreen);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [setScreen]);

  useEffect(() => () => { animationRef.current?.cancel(); }, []);
  return { shellRef, busyRef, busy, fullMotion, toggleMotion, go };
}
