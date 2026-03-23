"use client";
import { FaLaptopCode, FaPaintBrush, FaDatabase, FaServer } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdWork } from "react-icons/md";
import { useEffect, useRef } from "react";

const style = `
  .journey-wrap {
    padding: 20px 48px;
    background: none;
    position: relative;
  }

  /* ── Desktop timeline line (center) ── */
  .timeline-line {
    position: absolute;
    left: 50%;
    top: 200px;
    bottom: 80px;
    width: 1px;
    background: rgba(123,140,222,0.15);
    transform: translateX(-50%);
  }

  .timeline-line-fill {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    background: linear-gradient(to bottom, #7B8CDE, rgba(123,140,222,0.2));
    transition: height 0.6s ease;
  }

  .journey-steps {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 72px;
  }

  /* ── Desktop: alternating left/right ── */
  .journey-step {
    display: grid;
    grid-template-columns: 1fr 64px 1fr;
    align-items: start;
    gap: 0;
    padding: 48px 0;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .journey-step.v { opacity: 1; transform: translateY(0); }

  .step-left  { padding-right: 48px; text-align: right; }
  .step-right { padding-left: 48px;  text-align: left;  }
  .step-empty { opacity: 0; pointer-events: none; }

  .step-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  .step-dot {
    width: 44px; height: 44px;
    border-radius: 50%;
    border: 2px solid rgba(123,140,222,0.3);
    background: #0d0e1a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: border-color 0.3s, background 0.3s, transform 0.3s;
    flex-shrink: 0;
    color: #7B8CDE;
  }

  .journey-step.v .step-dot { border-color: #7B8CDE; }

  .journey-step:hover .step-dot {
    background: #7B8CDE;
    color: #0d0e1a;
    transform: scale(1.15);
  }

  .step-card {
    background: #0d0e1a;
    border: 1px solid rgba(123,140,222,0.08);
    border-top: 2px solid #7B8CDE;
    padding: 28px 32px;
    transition: border-color 0.3s, transform 0.3s, background 0.3s;
    position: relative;
  }

  .step-card:hover {
    border-color: rgba(123,140,222,0.3);
    background: #111225;
    transform: translateY(-3px);
  }

  .step-year {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7B8CDE;
    margin-bottom: 10px;
  }

  .step-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: #c8cef5;
    line-height: 1.25;
    margin-bottom: 12px;
  }

  .step-body {
    font-size: 13px;
    line-height: 1.85;
    color: #4A5580;
    font-weight: 300;
    margin-bottom: 16px;
  }

  .step-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: flex-end;
  }

  .step-right .step-tags { justify-content: flex-start; }

  .step-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: #7B8CDE;
    background: rgba(123,140,222,0.08);
    border: 1px solid rgba(123,140,222,0.2);
    padding: 4px 10px;
  }

  .step-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
    justify-content: flex-end;
  }

  .step-right .step-skills { justify-content: flex-start; }

  .step-skill {
    font-size: 11px;
    color: #4A5580;
    background: rgba(123,140,222,0.04);
    border: 1px solid rgba(123,140,222,0.1);
    padding: 5px 12px;
    transition: color 0.2s, border-color 0.2s;
  }

  .step-card:hover .step-skill {
    color: #c8cef5;
    border-color: rgba(123,140,222,0.25);
  }

  .current-label {
    position: absolute;
    top: -1px; right: -1px;
    background: #7B8CDE;
    color: #0d0e1a;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 4px 10px;
  }

  /* ────────────────────────────────────────
     MOBILE  ≤ 768px
     Single column, left-side vertical line
  ──────────────────────────────────────── */
  @media (max-width: 768px) {
    .journey-wrap {
      padding: 80px 20px 80px 20px;
    }

    /* Hide center timeline line, show left-side line */
    .timeline-line {
      left: 20px;
      top: 220px;
      bottom: 60px;
      transform: none;
    }

    .journey-steps {
      margin-top: 48px;
      padding-left: 44px;
    }

    /* Override grid → single column */
    .journey-step {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 16px;
      padding: 24px 0;
      position: relative;
    }

    /* Hide the empty placeholder columns */
    .step-empty { display: none; }

    /* Both sides look the same on mobile */
    .step-left,
    .step-right {
      padding: 0;
      text-align: left;
      flex: 1;
    }

    .step-tags        { justify-content: flex-start !important; }
    .step-skills      { justify-content: flex-start !important; }

    /* Dot sits on the left line */
    .step-center {
      position: absolute;
      left: -44px;
      top: 28px;
    }

    .step-dot {
      width: 36px;
      height: 36px;
      font-size: 15px;
    }

    .step-card {
      padding: 20px 20px;
    }

    .step-title { font-size: 17px; }
    .step-body  { font-size: 12px; }
  }

  @media (max-width: 480px) {
    .journey-wrap   { padding: 60px 16px 60px 16px; }
    .journey-steps  { padding-left: 40px; }
    .timeline-line  { left: 16px; }
    .step-center    { left: -40px; }
    .step-card      { padding: 16px; }
  }
`;

const steps = [
  {
    side: "left",
    year: "2021 — 2022",
    icon: <FaLaptopCode />,
    title: "The Beginning",
    body: "Started my CS degree at Asian College of Higher Studies and dove into fundamentals — building early projects with Node.js, EJS, and SQLite. Shipped Lekhapadi, a collaborative blogging platform, as my first real team project.",
    tags: ["Node.js", "EJS", "SQLite"],
    skills: ["HTML5", "CSS3", "JavaScript", "Node.js", "Git"],
  },
  {
    side: "right",
    year: "2022 — 2024",
    icon: <FaPaintBrush />,
    title: "Frontend & First Frameworks",
    body: "Expanded into React and built a suite of projects — a dynamic form builder, tic-tac-toe, a to-do CRUD app, and a real-time weather app. Also explored Python with a Pygame space game, sharpening problem-solving fundamentals.",
    tags: ["React", "Tailwind CSS", "Python"],
    skills: ["React", "Tailwind CSS", "Pygame", "REST APIs", "Responsive Design"],
  },
  {
    side: "left",
    year: "2024 — 2025",
    icon: <IoMdSettings />,
    title: "Backend Foundations",
    body: "Went deep on backend architecture — mastering Laravel, Django, and RESTful API design. Learned Redis caching, queue systems, JWT auth, RBAC, and multi-tenancy patterns while building production-grade systems.",
    tags: ["Django", "Laravel", "Redis", "MySQL"],
    skills: ["Laravel", "Django", "PostgreSQL", "Redis", "JWT", "Docker"],
  },
  {
    side: "right",
    year: "Feb 2025 — May 2025",
    icon: <MdWork />,
    title: "Intern Full-Stack Developer",
    body: "Joined Endeavor Nepal and built OM Network — a full-stack web app using Laravel 12 and React 19. Applied the Controller–Service–Repository pattern, implemented CSRF-protected APIs, and integrated a real-time AI chatbot via external API.",
    tags: ["Laravel 12", "React 19", "MySQL"],
    skills: ["Laravel", "React", "RESTful APIs", "CSRF", "CMS", "CSR Pattern"],
  },
  {
    side: "left",
    year: "Jun 2025 — Present",
    badge: "Current",
    icon: <FaServer />,
    title: "Associate Full-Stack Developer",
    body: "Promoted to Associate Developer, now leading backend architecture for two government projects — TSC (Teacher Service Council, 100K+ users) and NARC (60+ subdomains). Working with Next.js, Django, and Laravel at scale, with Celery, Redis, Nginx, and CI/CD pipelines.",
    tags: ["Next.js", "Django", "Government Scale"],
    skills: ["Next.js", "Django REST", "Celery", "Redis", "RBAC", "CI/CD", "Nginx"],
  },
];

export default function Journey() {
  const stepsRef = useRef([]);
  const lineRef  = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("v");
        });
      },
      { threshold: 0.15 }
    );

    stepsRef.current.forEach((el) => el && observer.observe(el));
    if (titleRef.current) observer.observe(titleRef.current);

    const handleScroll = () => {
      if (!lineRef.current) return;
      const rect = lineRef.current.parentElement.getBoundingClientRect();
      const visible = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / (rect.height + window.innerHeight))
      );
      const fill = lineRef.current.querySelector(".timeline-line-fill");
      if (fill) fill.style.height = `${visible * 100}%`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <style>{style}</style>

      <section className="journey-wrap" id="journey">
        <div className="section-label" data-num="03">My Journey</div>

        <h2 className="section-title" ref={titleRef}>
          From pixels <br />
          to <em style={{ fontStyle: "italic", color: "#A78BFA" }}>production.</em>
        </h2>

        <div className="timeline-line" ref={lineRef}>
          <div className="timeline-line-fill" style={{ height: "0%" }} />
        </div>

        <div className="journey-steps">
          {steps.map((step, i) => (
            <div
              key={i}
              className="journey-step"
              ref={(el) => (stepsRef.current[i] = el)}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {/* Left slot */}
              <div className={step.side === "left" ? "step-left" : "step-empty"}>
                {step.side === "left" && (
                  <div className="step-card">
                    <div className="step-year">{step.year}</div>
                    <div className="step-title">{step.title}</div>
                    <p className="step-body">{step.body}</p>
                    <div className="step-tags">
                      {step.tags.map((t) => <span key={t} className="step-tag">{t}</span>)}
                    </div>
                    <div className="step-skills">
                      {step.skills.map((s) => <span key={s} className="step-skill">{s}</span>)}
                    </div>
                  </div>
                )}
              </div>

              {/* Center dot */}
              <div className="step-center">
                <div className="step-dot">{step.icon}</div>
              </div>

              {/* Right slot */}
              <div className={step.side === "right" ? "step-right" : "step-empty"}>
                {step.side === "right" && (
                  <div className="step-card">
                    {step.badge && <div className="current-label">{step.badge}</div>}
                    <div className="step-year">{step.year}</div>
                    <div className="step-title">{step.title}</div>
                    <p className="step-body">{step.body}</p>
                    <div className="step-tags">
                      {step.tags.map((t) => <span key={t} className="step-tag">{t}</span>)}
                    </div>
                    <div className="step-skills">
                      {step.skills.map((s) => <span key={s} className="step-skill">{s}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}