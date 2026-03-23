"use client";
import { useEffect, useRef, useState } from "react";
import {
  SiLaravel, SiDjango, SiNextdotjs, SiMysql,
  SiRedis, SiDocker, SiNginx, SiMongodb, SiCelery,
  SiTailwindcss, SiGithubactions, SiLinux, SiPhp,
} from "react-icons/si";
import { TbBrandNodejs } from "react-icons/tb";
import { MdSecurity } from "react-icons/md";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const categories = [
  {
    id: "frontend",
    label: "Frontend",
    accent: "#38BDF8",
    skills: [
      { icon: SiNextdotjs,   name: "Next.js", pct: 85, color: "#e2e8ff" },
      { icon: SiTailwindcss, name: "Tailwind CSS", pct: 78, color: "#38BDF8" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    accent: "#FF2D20",
    skills: [
      { icon: SiDjango,      name: "Django / DRF", pct: 90, color: "#44B78B" },
      { icon: SiLaravel,     name: "Laravel",      pct: 88, color: "#FF2D20" },
      // { icon: SiPhp,         name: "PHP 8.2",      pct: 80, color: "#8892BF" },
      { icon: TbBrandNodejs, name: "Node.js",      pct: 68, color: "#84CC16" },
    ],
  },
  {
    id: "db",
    label: "Database & Caching",
    accent: "#FF4438",
    skills: [
      { icon: SiMysql,   name: "MySQL",pct: 88, color: "#4479A1" },
      { icon: SiMongodb, name: "MongoDB", pct: 65, color: "#47A248" },
      { icon: SiRedis,   name: "Redis",   pct: 82, color: "#FF4438" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Infra",
    accent: "#2496ED",
    skills: [
      { icon: SiDocker,        name: "Docker", pct: 78, color: "#2496ED" },
      { icon: SiNginx,         name: "Nginx",          pct: 76, color: "#009900" },
      { icon: SiGithubactions, name: "GitHub Actions", pct: 70, color: "#2088FF" },
      { icon: SiLinux,         name: "Linux Admin",    pct: 75, color: "#FCC624" },
    ],
  },
  {
    id: "special",
    label: "Specialisations",
    accent: "#A9CC54",
    skills: [
      { icon: SiCelery,   name: "Celery / Queues", pct: 80, color: "#A9CC54" },
      { icon: MdSecurity, name: "Security / VAPT", pct: 78, color: "#F43F5E" },
    ],
  },
];

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.sk-section {
  padding: 60px 48px 80px;
  font-family: 'Syne', sans-serif;
  position: relative;
}

.sk-canvas {
  position: relative;
  width: 100%;
  margin-top: 52px;
}

/* ── Zig-zag: each cluster alternates alignment ── */
.sk-cluster {
  display: flex;
  flex-direction: column;
  width: 62%;
  margin-bottom: 44px;
}
.sk-cluster:last-child { margin-bottom: 0; }

/* LEFT — default */
.sk-cluster[data-pos="left"]   { align-self: flex-start; margin-left: 0; }
/* RIGHT */
.sk-cluster[data-pos="right"]  { align-self: flex-end;   margin-right: 0; width: 65%; }
/* CENTRE */
.sk-cluster[data-pos="centre"] { align-self: center;     width: 56%; }

/* make canvas a flex column */
.sk-canvas { display: flex; flex-direction: column; }

/* ── cluster header ── */
.sk-cluster-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.sk-cluster-head h3 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--acc);
  margin: 0;
  white-space: nowrap;
}
.sk-cluster-head .sk-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--acc), transparent);
  opacity: 0.22;
}

/* ── card row ── */
.sk-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* ── card ── */
.sk-card {
  position: relative;
  border-radius: 14px;
  background: #080910;
  border: 1px solid rgba(123,140,222,0.1);
  padding: 20px 16px 16px;
  cursor: default;
  transform-style: preserve-3d;
  will-change: transform;
  overflow: hidden;
  flex: 0 0 148px;

  /* entrance */
  opacity: 0;
  translate: 0 22px;
  transition:
    opacity 0.55s ease,
    translate 0.55s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}
.sk-card.visible {
  opacity: 1;
  translate: 0 0;
}

/* spotlight */
.sk-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 30%),
    rgba(123,140,222,0.15) 0%,
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  border-radius: inherit;
}
.sk-card:hover::before { opacity: 1; }

.sk-card:hover {
  border-color: rgba(123,140,222,0.30);
  box-shadow:
    0 0 0 1px rgba(123,140,222,0.12),
    0 10px 40px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.04);
}

/* corner pip */
.sk-card::after {
  content: '';
  position: absolute;
  top: 11px; right: 11px;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--acc, #7B8CDE);
  opacity: 0.22;
  transition: opacity 0.3s, transform 0.3s;
}
.sk-card:hover::after { opacity: 1; transform: scale(1.4); }

/* icon */
.sk-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(123,140,222,0.07);
  border: 1px solid rgba(123,140,222,0.12);
  margin-bottom: 13px;
  color: #4A5580;
  transition:
    color 0.3s,
    background 0.3s,
    transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  position: relative; z-index: 1;
}
.sk-card:hover .sk-icon {
  color: var(--icolor, #8fa0f0);
  background: rgba(123,140,222,0.14);
  transform: translateY(-5px) scale(1.1) rotateZ(-4deg);
}

.sk-name {
  font-size: 12.5px;
  font-weight: 600;
  color: #c8cef5;
  margin-bottom: 3px;
  position: relative; z-index: 1;
}
.sk-level {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #4A5580;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 13px;
  position: relative; z-index: 1;
}

/* bar */
.sk-bar {
  height: 2px;
  background: rgba(123,140,222,0.1);
  border-radius: 2px;
  overflow: hidden;
  position: relative; z-index: 1;
}
.sk-bar-fill {
  height: 100%;
  border-radius: 2px;
  width: 0;
  transition: width 1.4s cubic-bezier(0.16,1,0.3,1);
  position: relative;
}
.sk-bar-fill.animate { width: var(--w); }
.sk-bar-fill::after {
  content: '';
  position: absolute;
  right: 0; top: 50%;
  transform: translateY(-50%);
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--tip);
  box-shadow: 0 0 7px 1px var(--tip);
  opacity: 0;
  transition: opacity 0.3s 1.2s;
}
.sk-bar-fill.animate::after { opacity: 1; }

/* ── responsive ── */
@media (max-width: 768px) {
  .sk-cluster,
  .sk-cluster[data-pos="left"],
  .sk-cluster[data-pos="right"],
  .sk-cluster[data-pos="centre"] {
    width: 100% !important;
    align-self: stretch !important;
  }
  .sk-card { flex: 0 0 calc(50% - 6px); }
  .sk-section { padding: 40px 20px 60px; }
}
`;

/* ─────────────────────────────────────────────
   SKILL CARD
───────────────────────────────────────────── */
function SkillCard({ icon: Icon, name, level, pct, color, accent, delay }) {
  const ref = useRef(null);
  const bar = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          ref.current?.classList.add("visible");
          bar.current?.classList.add("animate");
        }, delay);
        obs.disconnect();
      }
    }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    ref.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width  * 100).toFixed(1)}%`);
    ref.current.style.setProperty("--my", `${((e.clientY - r.top)  / r.height * 100).toFixed(1)}%`);
    setTilt({ rx: -y * 14, ry: x * 14 });
  };

  return (
    <div
      ref={ref}
      className="sk-card"
      style={{
        "--acc":    accent,
        "--icolor": color,
        transitionDelay: `${delay}ms`,
        transform: `perspective(550px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
      }}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
    >
      <div className="sk-icon"><Icon size={20} /></div>
      <div className="sk-name">{name}</div>
      <div className="sk-level">{level}</div>
      <div className="sk-bar">
        <div
          ref={bar}
          className="sk-bar-fill"
          style={{
            "--w":   `${pct}%`,
            "--tip": color,
            background: `linear-gradient(90deg, rgba(123,140,222,0.45), ${color})`,
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CLUSTER
───────────────────────────────────────────── */
const positions = ["left", "right", "left", "right", "centre"];

function Cluster({ cat, pos, baseDelay }) {
  return (
    <div
      className="sk-cluster"
      data-pos={pos}
      style={{ "--acc": cat.accent }}
    >
      <div className="sk-cluster-head">
        <h3>{cat.label}</h3>
        <div className="sk-line" />
      </div>
      <div className="sk-cards">
        {cat.skills.map((s, i) => (
          <SkillCard
            key={s.name}
            {...s}
            accent={cat.accent}
            delay={baseDelay + i * 75}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE SECTION
───────────────────────────────────────────── */
export default function Skills() {
  const titleRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) e.target.classList.add("visible"); },
      { threshold: 0.1 }
    );
    if (titleRef.current) obs.observe(titleRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{css}</style>
      <section className="sk-section" id="skills">
        <div className="section-label" data-num="02">Tech Stack</div>
        <h2 ref={titleRef} className="section-title reveal">
          What I work<br />with.
        </h2>

        <div className="sk-canvas">
          {categories.map((cat, i) => (
            <Cluster
              key={cat.id}
              cat={cat}
              pos={positions[i]}
              baseDelay={i * 55}
            />
          ))}
        </div>
      </section>
    </>
  );
}