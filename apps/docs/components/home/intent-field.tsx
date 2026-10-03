'use client';

import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; vx: number; vy: number; phase: number; lane: number };

/**
 * The hero's signature visual, drawn on canvas: edits (particles) stream toward a checkpoint
 * orb and are absorbed into it. Every few seconds a crash scatters the stream, then it
 * reassembles, which is the recovery Resumora performs. It pauses when off screen or in a
 * hidden tab, and draws a single still frame under reduced motion.
 */
export function IntentField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let t = 0;
    const particles: Particle[] = [];
    const COUNT = 130;

    const accent = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-fd-primary').trim() ||
      'oklch(0.6 0.1 185)';

    const orb = () => ({ x: width * 0.74, y: height * 0.46, r: Math.min(width, height) * 0.075 });

    const spawn = (p?: Particle): Particle => {
      const lane = Math.random();
      const next = p ?? ({} as Particle);
      next.x = -20 - Math.random() * width * 0.4;
      next.y = height * (0.15 + lane * 0.7);
      next.vx = 1.1 + Math.random() * 1.2;
      next.vy = 0;
      next.phase = Math.random() * Math.PI * 2;
      next.lane = lane;
      return next;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!particles.length) {
        for (let i = 0; i < COUNT; i++) {
          const p = spawn();
          p.x = Math.random() * width * 0.7;
          particles.push(p);
        }
      }
    };

    const draw = () => {
      const color = accent();
      const o = orb();
      // A crash every 9 seconds: 0.8s of scatter, then the stream reforms.
      const cycle = t % 540;
      const crashing = cycle > 470 && cycle < 518;
      const absorbedPulse = 0.5 + 0.5 * Math.sin(t * 0.05);

      ctx.clearRect(0, 0, width, height);

      // Checkpoint orb: a solid core whose glow is the accent itself (a canvas gradient to
      // "transparent" would fade through grey).
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = o.r * 2.4;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r * (0.55 + absorbedPulse * 0.06), 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r * (1.15 + absorbedPulse * 0.12), 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;

      for (const p of particles) {
        if (!reduce) {
          if (crashing) {
            // Scatter: push away from the stream.
            p.vy += (Math.random() - 0.5) * 1.6;
            p.vx *= 0.9;
          } else {
            // Steer toward the orb along a gentle wave.
            const dx = o.x - p.x;
            const dy = o.y - p.y + Math.sin(p.phase + t * 0.03) * 18 * (1 - p.x / width);
            const dist = Math.hypot(dx, dy) || 1;
            p.vx += (dx / dist) * 0.06;
            p.vy += (dy / dist) * 0.06;
            p.vx = Math.min(Math.max(p.vx * 0.985, 0.4), 3.2);
            p.vy *= 0.94;
          }
          p.x += p.vx;
          p.y += p.vy;
          if (
            Math.hypot(o.x - p.x, o.y - p.y) < o.r * 0.6 ||
            p.x > width + 30 ||
            p.y < -40 ||
            p.y > height + 40
          ) {
            spawn(p);
          }
        }
        const d = Math.hypot(o.x - p.x, o.y - p.y);
        const near = Math.max(0, 1 - d / (width * 0.6));
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3 + near * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.35 + near * 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (crashing) {
        const flash = 1 - Math.abs(cycle - 494) / 24;
        ctx.fillStyle = `rgba(245, 158, 11, ${0.06 * flash})`;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const loop = () => {
      if (visible && !document.hidden) {
        t += 1;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(canvas);

    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
