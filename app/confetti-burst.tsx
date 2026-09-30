'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export function ConfettiBurst({ anchor, reduced }: { anchor: RefObject<HTMLDivElement | null>; reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || reduced) { setFinished(true); return; }
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
    const rect = anchor.current?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : width / 2;
    const originY = rect ? rect.top + rect.height * .45 : height * .4;
    const colors = ['#ffb52e', '#f45b68', '#55c5b5', '#7f6ce0', '#2991de'];
    const particles = Array.from({ length: 64 }, (_, i) => {
      const angle = Math.PI + Math.random() * Math.PI;
      const speed = 170 + Math.random() * 220;
      return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 4, spin: (Math.random() - .5) * 18,
        angle: Math.random() * Math.PI, color: colors[i % colors.length] };
    });
    let frame = 0;
    let started: number | undefined;
    const draw = (now: number) => {
      started ??= now;
      const elapsed = now - started;
      const t = elapsed / 1000;
      context.clearRect(0, 0, width, height);
      if (elapsed >= 1450) { setFinished(true); return; }
      for (const p of particles) {
        context.save();
        context.globalAlpha = Math.max(0, Math.min(1, (1450 - elapsed) / 500));
        context.translate(originX + p.vx * t, originY + p.vy * t + 290 * t * t);
        context.rotate(p.angle + p.spin * t);
        context.scale(1, .35 + Math.abs(Math.cos(p.spin * t)) * .65);
        context.fillStyle = p.color;
        context.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        context.restore();
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    // Also remove the layer if the tab is backgrounded and frame delivery stops.
    const timeout = window.setTimeout(() => setFinished(true), 1800);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(timeout); context.clearRect(0, 0, width, height); };
  }, [anchor, reduced]);

  return finished ? null : <canvas ref={canvasRef} className="celebration-burst" aria-hidden="true" />;
}
