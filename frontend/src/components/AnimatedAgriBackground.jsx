import React, { useEffect, useRef } from 'react';

/**
 * AnimatedAgriBackground
 * High-performance 60fps HTML5 Canvas background with 4 selectable visual modes:
 * - 'particles': Floating Golden Fireflies & Agri Pollen
 * - 'waves': Terraced Agricultural Topography & River Waves
 * - 'aurora': Luminous Bio-Mesh Aurora (Emerald, Mint, Champagne Gold)
 * - 'constellation': Interconnected Cooperative PACS DPI Network
 */
export default function AnimatedAgriBackground({ mode = 'waves' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for gentle interaction
    let mouse = { x: width / 2, y: height / 2, active: false };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ==========================================
    // MODE 1: PARTICLES (Golden Fireflies & Pollen)
    // ==========================================
    const particleCount = Math.min(width < 768 ? 35 : 65, 80);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1.2,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2, // Drifting upwards like spores
      hue: Math.random() > 0.4 ? 155 : 42, // Emerald green (155) or Harvest Gold (42)
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      angle: Math.random() * Math.PI * 2
    }));

    // ==========================================
    // MODE 2: WAVES (Agricultural Terraced Topography)
    // ==========================================
    let waveStep = 0;

    // ==========================================
    // MODE 3: AURORA (Fluid Bioluminescent Mesh)
    // ==========================================
    const orbs = [
      { x: width * 0.2, y: height * 0.25, r: 340, color: 'rgba(16, 185, 129, 0.16)', vx: 0.4, vy: 0.3 }, // Emerald
      { x: width * 0.8, y: height * 0.35, r: 400, color: 'rgba(52, 211, 153, 0.13)', vx: -0.3, vy: 0.4 }, // Mint
      { x: width * 0.4, y: height * 0.75, r: 380, color: 'rgba(245, 158, 11, 0.12)', vx: 0.3, vy: -0.3 }, // Harvest Gold
      { x: width * 0.7, y: height * 0.8, r: 350, color: 'rgba(13, 148, 136, 0.14)', vx: -0.4, vy: -0.2 }  // Teal
    ];

    // ==========================================
    // MODE 4: CONSTELLATION (DPI Cooperative Network)
    // ==========================================
    const nodeCount = Math.min(width < 768 ? 25 : 45, 55);
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2.5 + 1.5,
      isHub: Math.random() < 0.15 // PACS Hub node with golden beacon
    }));

    // ------------------------------------------
    // MAIN RENDER LOOP
    // ------------------------------------------
    let t = 0;

    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      if (mode === 'particles') {
        // Render Organic Golden Fireflies & Spores
        particles.forEach((p) => {
          p.x += p.speedX + Math.sin(t + p.angle) * 0.3;
          p.y += p.speedY;
          p.angle += p.pulseSpeed;

          // Wrap edges
          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.angle));
          
          // Outer soft glow
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
          if (p.hue === 155) {
            grad.addColorStop(0, `rgba(16, 185, 129, ${currentAlpha})`);
            grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          } else {
            grad.addColorStop(0, `rgba(245, 158, 11, ${currentAlpha * 1.1})`);
            grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          }
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Core bright spark
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = p.hue === 155 ? `rgba(209, 250, 229, ${currentAlpha * 1.3})` : `rgba(254, 243, 199, ${currentAlpha * 1.3})`;
          ctx.fill();
        });

      } else if (mode === 'waves') {
        // Render Terraced Agri Topography & River Contours (Locked in)
        waveStep += 0.007;
        const waveCount = 6;
        const mouseFactor = mouse.active ? (mouse.y / height - 0.5) * 20 : 0;

        for (let i = 0; i < waveCount; i++) {
          ctx.beginPath();
          const baseY = height * 0.35 + i * (height * 0.12) + mouseFactor * (i * 0.15);
          ctx.moveTo(0, baseY);

          for (let x = 0; x <= width; x += 12) {
            const freq1 = 0.0018 + i * 0.0004;
            const freq2 = 0.0035 + i * 0.0003;
            const amp1 = 28 + i * 16;
            const amp2 = 12 + i * 6;
            
            // Compound harmonic wave for natural topography contours
            const waveY = Math.sin(x * freq1 + waveStep * (1 + i * 0.25) + i * 1.2) * amp1 +
                          Math.cos(x * freq2 - waveStep * 0.8 + i) * amp2;
            
            ctx.lineTo(x, baseY + waveY);
          }

          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();

          const grad = ctx.createLinearGradient(0, baseY - 60, 0, height);
          if (i % 2 === 0) {
            grad.addColorStop(0, `rgba(16, 185, 129, ${0.07 + i * 0.012})`); // Lush Emerald
            grad.addColorStop(0.5, `rgba(5, 150, 105, ${0.03 + i * 0.008})`);
            grad.addColorStop(1, 'rgba(4, 120, 87, 0.01)');
          } else {
            grad.addColorStop(0, `rgba(245, 158, 11, ${0.05 + i * 0.01})`); // Harvest Gold accent
            grad.addColorStop(0.5, `rgba(13, 148, 136, ${0.03 + i * 0.008})`); // Royal Teal
            grad.addColorStop(1, 'rgba(6, 78, 59, 0.01)');
          }

          ctx.fillStyle = grad;
          ctx.fill();

          // Luminous contour ridge stroke
          ctx.lineWidth = 1.3;
          ctx.strokeStyle = i % 2 === 0 
            ? `rgba(52, 211, 153, ${0.18 + i * 0.04})` 
            : `rgba(251, 191, 36, ${0.15 + i * 0.03})`;
          ctx.stroke();
        }

      } else if (mode === 'constellation') {
        // Render Cooperative DPI Network (102,000 PACS Societies)
        nodes.forEach((node, idx) => {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          // Connecting lines between nearby PACS nodes
          for (let j = idx + 1; j < nodes.length; j++) {
            const other = nodes[j];
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              const alpha = (1 - dist / 130) * 0.22;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = (node.isHub || other.isHub)
                ? `rgba(245, 158, 11, ${alpha * 1.3})`
                : `rgba(16, 185, 129, ${alpha})`;
              ctx.lineWidth = (node.isHub || other.isHub) ? 1.2 : 0.8;
              ctx.stroke();
            }
          }

          // Node body
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.isHub ? node.size * 1.6 : node.size, 0, Math.PI * 2);
          ctx.fillStyle = node.isHub ? 'rgba(245, 158, 11, 0.7)' : 'rgba(16, 185, 129, 0.6)';
          ctx.fill();

          if (node.isHub) {
            // Beacon pulse
            ctx.beginPath();
            ctx.arc(node.x, node.y, (node.size * 3) + Math.sin(t * 3) * 4, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

      } else {
        // DEFAULT: AURORA (Fluid Bio-Mesh Emerald Aurora)
        orbs.forEach((orb, i) => {
          orb.x += orb.vx + Math.sin(t * 0.5 + i) * 0.4;
          orb.y += orb.vy + Math.cos(t * 0.5 + i) * 0.4;

          if (orb.x < -orb.r) orb.x = width + orb.r;
          if (orb.x > width + orb.r) orb.x = -orb.r;
          if (orb.y < -orb.r) orb.y = height + orb.r;
          if (orb.y > height + orb.r) orb.y = -orb.r;

          const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
          grad.addColorStop(0, orb.color);
          grad.addColorStop(0.7, orb.color.replace(/[\d\.]+\)$/, '0.04)'));
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        opacity: 0.95,
        mixBlendMode: 'multiply'
      }}
      aria-hidden="true"
    />
  );
}
