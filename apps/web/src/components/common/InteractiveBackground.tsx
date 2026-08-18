import React, { useEffect, useRef } from 'react';
import { useAppConfig } from '../../context/AppConfigContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const { themeMode } = useAppConfig();
  const isDark = themeMode === 'dark';

  useEffect(() => {
    // ── 1. MOUSE SPOTLIGHT GLOW ──────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ── 2. CANVAS PARTICLE & DATA PIPELINE NETWORK ────────────────────────────
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color palette based on UniFlow Brand Identity (Aka Red & Solar Gold)
    const brandColors = isDark
      ? ['#ed1c24', '#FCC20F', '#60A5FA', '#34D399', '#F43F5E']
      : ['#ed1c24', '#D97706', '#2563EB', '#059669', '#DC2626'];

    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 2.2 + 1.2,
        color: brandColors[Math.floor(Math.random() * brandColors.length)],
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    const maxDistance = 135;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw node particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = isDark ? p.alpha * 0.85 : p.alpha * 0.6;
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.shadowColor = p.color;
        ctx.fill();

        // Connect nearby nodes with subtle pipeline stream lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * (isDark ? 0.18 : 0.12);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* ── 1. AMBIENT GLOWING ORBS ────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(237, 28, 36, 0.14) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(237, 28, 36, 0.08) 0%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'brandGradientFlow 12s ease infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(252, 194, 15, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(252, 194, 15, 0.06) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* ── 2. MOUSE CURSOR SPOTLIGHT FOLLOWER ──────────────────────────────── */}
      <div
        ref={spotlightRef}
        style={{
          position: 'absolute',
          top: '-200px',
          left: '-200px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(237, 28, 36, 0.12) 0%, rgba(252, 194, 15, 0.04) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(237, 28, 36, 0.06) 0%, rgba(252, 194, 15, 0.03) 40%, transparent 70%)',
          filter: 'blur(50px)',
          willChange: 'transform',
          transition: 'transform 0.12s ease-out',
        }}
      />

      {/* ── 3. INTERACTIVE PARTICLE CANVAS ──────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
export default InteractiveBackground;
