"use client";
import { useEffect, useRef } from "react";

const style = `
  .about {
    padding: 20px 48px;
    background: none;
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    margin-top: 10px;
  }

  @media (max-width: 768px) {
    .about-grid {
      grid-template-columns: 1fr;
      gap: 48px;
    }
  }

  .about-text p {
    font-size: 16px;
    line-height: 1.9;
    color: #4A5580;
    font-weight: 300;
    margin-bottom: 20px;
  }

  .about-text p strong {
    color: #c8cef5;
    font-weight: 500;
  }

  .about-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
  }

  .stat-box {
    background: #0d0e1a;
    border: 1px solid rgba(123,140,222,0.08);
    padding: 28px 24px 24px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s;
    transform-style: preserve-3d;
    cursor: default;
    min-height: 130px;
  }

  .stat-box::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px;
    height: 0;
    background: #7B8CDE;
    transition: height 0.4s;
  }

  .stat-box:hover {
    border-color: rgba(123,140,222,0.3);
    transform: translateY(-5px) rotateX(5deg) rotateY(-4deg) scale(1.02);
    box-shadow: 8px 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(123,140,222,0.15);
  }

  .stat-box:hover::before {
    height: 100%;
  }

  .stat-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    pointer-events: none;
  }

  .stat-content {
    position: relative;
    z-index: 2;
  }

  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 900;
    color: #7B8CDE;
    line-height: 1;
    margin-bottom: 8px;
  }

  .stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #4A5580;
  }
`;

const stats = [
  { num: "1+",   label: "Years Experience", scene: "clock"  },
  { num: "5+",   label: "Projects Delivered", scene: "boxes" },
  { num: "100K+", label: "Users Served",      scene: "dots"  },
  { num: "60+",  label: "Subdomains",         scene: "grid"  },
];

/* ── Canvas draw functions ── */

function drawClock(ctx, w, h, t) {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.38;
  ctx.strokeStyle = "#7B8CDE";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const inner = i % 3 === 0 ? r - 10 : r - 6;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    ctx.lineTo(cx + Math.cos(a) * r,     cy + Math.sin(a) * r);
    ctx.stroke();
  }
  const hAngle = ((t * 0.0001) % 1) * Math.PI * 2 - Math.PI / 2;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(hAngle) * r * 0.5, cy + Math.sin(hAngle) * r * 0.5);
  ctx.stroke();
  const mAngle = ((t * 0.001) % 1) * Math.PI * 2 - Math.PI / 2;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(mAngle) * r * 0.72, cy + Math.sin(mAngle) * r * 0.72);
  ctx.stroke();
  ctx.fillStyle = "#7B8CDE";
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawBoxes(ctx, w, h, t) {
  ctx.clearRect(0, 0, w, h);
  const cols = 3, rows = 2;
  const bw = w * 0.22, bh = h * 0.28;
  const gx = (w - cols * bw) / (cols + 1);
  const gy = (h - rows * bh) / (rows + 1);
  ctx.strokeStyle = "#7B8CDE";
  ctx.lineWidth = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const px = gx + c * (bw + gx);
      const py = gy + r * (bh + gy);
      const phase = ((t * 0.0008 + i * 0.3) % 1);
      ctx.globalAlpha = 0.3 + Math.abs(Math.sin(phase * Math.PI)) * 0.7;
      // front face
      ctx.strokeRect(px, py, bw, bh);
      // isometric top face
      ctx.beginPath();
      ctx.moveTo(px,        py);
      ctx.lineTo(px + bw * 0.5, py - bh * 0.28);
      ctx.lineTo(px + bw + bw * 0.5, py - bh * 0.28);
      ctx.lineTo(px + bw,   py);
      ctx.closePath();
      ctx.stroke();
      // right side face
      ctx.beginPath();
      ctx.moveTo(px + bw, py);
      ctx.lineTo(px + bw + bw * 0.5, py - bh * 0.28);
      ctx.lineTo(px + bw + bw * 0.5, py + bh - bh * 0.28);
      ctx.lineTo(px + bw, py + bh);
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

function drawDots(ctx, w, h, t) {
  ctx.clearRect(0, 0, w, h);
  const cols = 12, rows = 10;
  const pw = w / cols, ph = h / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = pw * col + pw / 2;
      const y = ph * row + ph / 2;
      const wave = Math.sin(t * 0.002 + col * 0.4 + row * 0.5);
      const r = 1.5 + wave * 1;
      const alpha = 0.2 + (wave + 1) * 0.35;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#7B8CDE";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawGrid(ctx, w, h, t) {
  ctx.clearRect(0, 0, w, h);
  const cols = 8, rows = 6;
  const cw = w / cols, ch = h / rows;
  ctx.strokeStyle = "#7B8CDE";
  ctx.lineWidth = 0.8;
  for (let c = 0; c <= cols; c++) {
    const wave = Math.sin(t * 0.001 + c * 0.5) * 4;
    ctx.globalAlpha = 0.2 + Math.abs(Math.sin(t * 0.001 + c * 0.3)) * 0.4;
    ctx.beginPath();
    ctx.moveTo(c * cw, 0 + wave);
    ctx.lineTo(c * cw, h + wave);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    const wave = Math.sin(t * 0.001 + r * 0.7) * 4;
    ctx.globalAlpha = 0.2 + Math.abs(Math.sin(t * 0.001 + r * 0.3)) * 0.4;
    ctx.beginPath();
    ctx.moveTo(0 + wave, r * ch);
    ctx.lineTo(w + wave, r * ch);
    ctx.stroke();
  }
  for (let c = 0; c <= cols; c++) {
    for (let r = 0; r <= rows; r++) {
      const phase = (t * 0.0005 + c * 0.18 + r * 0.22) % 1;
      if (phase < 0.15) {
        ctx.globalAlpha = (0.15 - phase) / 0.15;
        ctx.fillStyle = "#7B8CDE";
        ctx.beginPath();
        ctx.arc(c * cw, r * ch, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;
}

const drawFns = { clock: drawClock, boxes: drawBoxes, dots: drawDots, grid: drawGrid };

function StatCard({ num, label, scene }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const draw = drawFns[scene];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let running = true;
    const loop = (t) => {
      if (!running) return;
      draw(ctx, canvas.offsetWidth, canvas.offsetHeight, t);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [scene]);

  return (
    <div className="stat-box">
      <canvas ref={canvasRef} className="stat-canvas" />
      <div className="stat-content">
        <div className="stat-num">{num}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export default function About() {
  const gridRef  = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    if (gridRef.current)  observer.observe(gridRef.current);
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{style}</style>
      <section className="about" id="about">

        <p
          className="uppercase tracking-[0.25em] text-[10px] mb-5 flex items-center gap-2"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#ffffff" }}
        >
          <span style={{ color: "#4A5580" }}>01</span>
          About Me
        </p>

        <h2
          ref={titleRef}
          className="reveal leading-[1.05] tracking-[-0.02em] mb-16 opacity-0 translate-y-5 transition-all duration-700"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
            color: "#f0ede8",
          }}
        >
          Building the web,
        </h2>

        <div ref={gridRef} className="about-grid reveal">

          <div className="about-text">
            <p>
              I&apos;m a <strong>Full-Stack Developer with a backend focus</strong>, based in
              Kathmandu, Nepal — currently working at Endeavor Nepal building scalable
              government and enterprise web applications.
            </p>
            <p>
              I specialize in <strong>Django, Laravel, and Next.js</strong>, designing
              RESTful APIs, implementing secure authentication with RBAC &amp; JWT, and
              architecting decoupled systems that hold up under real-world load — including
              platforms serving <strong>100K+ users</strong> and multi-tenant setups
              across 60+ subdomains.
            </p>
            <p>
              Outside of work, I&apos;m deepening my expertise in{" "}
              <strong>AI/LLM engineering</strong> — exploring MCP, RAG, and local LLM integrations,
              alongside <strong>DevOps &amp; Kubernetes</strong> to own the full deployment lifecycle.
            </p>
          </div>

          <div className="about-stats">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}