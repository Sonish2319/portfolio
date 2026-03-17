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
    padding: 32px 28px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
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
    border-color: rgba(123,140,222,0.25);
  }

  .stat-box:hover::before {
    height: 100%;
  }

  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
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
  { num: "1+", label: "Years Experience" },
  { num: "2+", label: "Projects Delivered" },
  { num: "3+", label: "Languages Known" },
  { num: "∞",  label: "Lines of Code" },
];

export default function About() {
  const gridRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{style}</style>
      <section className="about" id="about">

        {/* Section label */}
        <p
          className="uppercase tracking-[0.25em] text-[10px] mb-5 flex items-center gap-2"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#ffffff" }}
        >
          <span style={{ color: "#4A5580" }}>01</span>
          About Me
        </p>

        {/* Title */}
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

          {/* Text */}
          <div className="about-text">
            <p>
              I&apos;m a <strong>Full-Stack Developer</strong> based in Kathmandu, Nepal,
              specializing in building high-performance government and enterprise web applications.
            </p>
            <p>
              With a strong foundation in <strong>React, Next.js, and Django</strong>, I bring
              complex systems to life — from document management portals to teacher licensing
              platforms used by thousands.
            </p>
            <p>
              Currently exploring <strong>Docker &amp; Kubernetes</strong> to deepen my
              knowledge of modern deployment and infrastructure.
            </p>
          </div>

          {/* Stats */}
          <div className="about-stats">
            {stats.map((s) => (
              <div key={s.label} className="stat-box">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}