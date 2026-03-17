"use client";
import { useEffect, useRef } from "react";
import { SiLaravel, SiReact, SiDjango, SiNextdotjs, SiMysql } from "react-icons/si";

const style = `
  .skills {
    padding: 20px 48px;
    background: none;
  }

  .skills-track {
    display: flex;
    gap: 0;
    border: 1px solid rgba(123,140,222,0.1);
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .skills-track {
      flex-direction: column;
    }
    .skill-item {
      border-right: none !important;
      border-bottom: 1px solid rgba(123,140,222,0.1);
    }
    .skill-item:last-child {
      border-bottom: none;
    }
  }

  .skill-item {
    flex: 1;
    padding: 32px 24px;
    border-right: 1px solid rgba(123,140,222,0.1);
    position: relative;
    cursor: default;
    transition: background 0.3s;
  }

  .skill-item:last-child {
    border-right: none;
  }

  .skill-item:hover {
    background: #0d0e1a;
  }

  .skill-item:hover .skill-icon {
    color: #7B8CDE;
  }

  .skill-icon {
    font-size: 22px;
    color: #4A5580;
    margin-bottom: 16px;
    transition: color 0.3s;
  }

  .skill-name {
    font-size: 14px;
    font-weight: 500;
    color: #c8cef5;
    margin-bottom: 6px;
  }

  .skill-level {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #4A5580;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .skill-bar {
    margin-top: 18px;
    height: 2px;
    background: rgba(123,140,222,0.1);
    position: relative;
    overflow: hidden;
  }

  .skill-bar-fill {
    height: 100%;
    background: #7B8CDE;
    width: 0;
    transition: width 1.2s ease;
  }

  .skill-bar-fill.animate {
    width: var(--w);
  }
`;

const skills = [
  { icon: SiReact,     name: "React.js", level: "Expert",    pct: 92 },
  { icon: SiNextdotjs, name: "Next.js",  level: "Advanced",  pct: 75 },
  { icon: SiDjango,    name: "Django",   level: "Expert",    pct: 88 },
  { icon: SiLaravel,   name: "Laravel",  level: "Advanced",  pct: 82 },
  { icon: SiMysql,     name: "MySQL",    level: "Proficient", pct: 70 },
];

export default function Skills() {
  const trackRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            const bars = e.target.querySelectorAll(".skill-bar-fill");
            bars.forEach((bar) => bar.classList.add("animate"));
          }
        });
      },
      { threshold: 0.12 }
    );

    if (trackRef.current) observer.observe(trackRef.current);
    if (titleRef.current) observer.observe(titleRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{style}</style>

      <section className="skills" id="skills">
        <div className="section-label" data-num="02">
          Tech Stack
        </div>

        <h2 ref={titleRef} className="section-title reveal">
          What I work
          <br />
          with.
        </h2>

        <div ref={trackRef} className="skills-track reveal">
          {skills.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="skill-item">
                <div className="skill-icon">
                  <Icon size={28} />
                </div>
                <div className="skill-name">{s.name}</div>
                <div className="skill-level">{s.level}</div>
                <div className="skill-bar">
                  <div
                    className="skill-bar-fill"
                    style={{ "--w": `${s.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}