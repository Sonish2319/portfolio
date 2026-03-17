"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import RippleImage from "@/components/ui/RippleImage";
export default function Hero() {
  const [stars, setStars] = useState([]);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const generated = Array.from({ length: 30 }, () => ({
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }));
    setStars(generated);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ padding: "0 48px" }}
    >
      {/* Top-left L-bracket */}
      <div className="absolute top-[120px] left-12 w-[60px] h-[60px] border-t-2 border-l-2 border-[#7B8CDE] opacity-40" />

      {/* Bottom-right L-bracket */}
      <div className="absolute bottom-20 right-12 w-[60px] h-[60px] border-b-2 border-r-2 border-[#4A5580] opacity-30" />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.length > 0 &&
          stars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: star.width,
                height: star.height,
                top: star.top,
                left: star.left,
                opacity: star.opacity,
                animation: `twinkle ${star.duration}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
      </div>

      {/* ── Desktop: Left profile image ── */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center z-10 pt-20 opacity-0"
        style={{ animation: "fadeUp 1s 0.6s forwards" }}
      >
        <div className="relative">
          <div
            className="absolute rounded-full border border-dashed border-[#7B8CDE] opacity-20"
            style={{
              width: "calc(100% + 32px)",
              height: "calc(100% + 32px)",
              top: "-16px",
              left: "-16px",
              animation: "spin 12s linear infinite",
            }}
          />
          <div
            className="absolute rounded-full border border-dashed border-[#4A5580] opacity-15"
            style={{
              width: "calc(100% + 64px)",
              height: "calc(100% + 64px)",
              top: "-32px",
              left: "-32px",
              animation: "spin 20s linear infinite reverse",
            }}
          />
          <div
            className="absolute rounded-full border-2 border-transparent opacity-70"
            style={{
              width: "calc(100% + 32px)",
              height: "calc(100% + 32px)",
              top: "-16px",
              left: "-16px",
              borderTopColor: "#7B8CDE",
              borderRightColor: "#A78BFA",
              animation: "spin 8s linear infinite",
            }}
          />
          <div
            className="absolute rounded-full opacity-20"
            style={{
              width: "calc(100% + 80px)",
              height: "calc(100% + 80px)",
              top: "-40px",
              left: "-40px",
              background:
                "radial-gradient(circle, rgba(123,140,222,0.4) 0%, rgba(167,139,250,0.2) 50%, transparent 70%)",
            }}
          />

<div
  className="relative rounded-full overflow-hidden border-2 border-[#7B8CDE]/30 group liquid-container"
  style={{ width: 340, height: 340 }}
>
  <div className="absolute inset-0 bg-[#0d0e1a]" />

<RippleImage />

  <div
    className="absolute inset-0 rounded-full"
    style={{
      background:
        "radial-gradient(circle, transparent 50%, rgba(8,9,24,0.7) 100%)",
    }}
  />
</div>


          <div
            className="absolute -bottom-4 -right-8 flex items-center gap-2 bg-[#0d0e1a] border border-[#7B8CDE]/25 backdrop-blur-sm"
            style={{ padding: "10px 20px" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
            <span
              className="text-[#c8cef5] uppercase tracking-widest text-[9px]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Available
            </span>
          </div>

          <div
            className="absolute -top-4 -left-8 bg-[#0d0e1a] border border-[#7B8CDE]/15 backdrop-blur-sm"
            style={{ padding: "10px 20px" }}
          >
            <span
              className="text-[#7B8CDE] uppercase tracking-widest text-[9px]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              1+ Years
            </span>
          </div>
        </div>
      </div>

      {/* ── Right / Mobile: text content ── */}
      <div className="hero-text-col flex-1 flex flex-col justify-center z-10">

        {/* Mobile profile image */}
        <div
          className="mobile-image-wrap flex lg:hidden justify-center opacity-0"
          style={{ animation: "fadeUp 1s 0.4s forwards" }}
        >
          <div className="relative">
            <div
              className="absolute rounded-full border border-dashed border-[#7B8CDE] opacity-20"
              style={{
                width: "calc(100% + 24px)",
                height: "calc(100% + 24px)",
                top: "-12px",
                left: "-12px",
                animation: "spin 12s linear infinite",
              }}
            />
            <div
              className="absolute rounded-full border-2 border-transparent opacity-70"
              style={{
                width: "calc(100% + 24px)",
                height: "calc(100% + 24px)",
                top: "-12px",
                left: "-12px",
                borderTopColor: "#7B8CDE",
                borderRightColor: "#A78BFA",
                animation: "spin 8s linear infinite",
              }}
            />
            <div
              className="relative rounded-full overflow-hidden border-2 border-[#7B8CDE]/30"
              style={{ width: 180, height: 180 }}
            >
              <div className="absolute inset-0 bg-[#0d0e1a]" />
              <Image
                src="/screenshot (5).png"
                alt="Sonish Upadhyaya"
                fill
                style={{
                  objectFit: "cover",
                  filter: "brightness(0.88) saturate(0.85) hue-rotate(5deg)",
                }}
                priority
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, transparent 50%, rgba(8,9,24,0.7) 100%)",
                }}
              />
            </div>

            <div
              className="absolute -bottom-3 -right-6 flex items-center gap-2 bg-[#0d0e1a] border border-[#7B8CDE]/25 backdrop-blur-sm"
              style={{ padding: "6px 12px" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              <span
                className="text-[#c8cef5] uppercase tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8 }}
              >
                Available
              </span>
            </div>

            <div
              className="absolute -top-3 -left-6 bg-[#0d0e1a] border border-[#7B8CDE]/15 backdrop-blur-sm"
              style={{ padding: "6px 12px" }}
            >
              <span
                className="text-[#7B8CDE] uppercase tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8 }}
              >
                1+ Years
              </span>
            </div>
          </div>
        </div>

        {/* Eyebrow */}
        <div
          className="flex items-center gap-3 opacity-0"
          style={{ animation: "fadeUp 0.8s 0.3s forwards" }}
        >
          <span className="block w-8 h-px bg-[#7B8CDE]" />
          <span
            className="text-[#7B8CDE] uppercase tracking-[0.2em] text-[11px]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Full-Stack Developer
          </span>
        </div>

        {/* Heading */}
        <h1
          className="leading-[0.92] tracking-[-0.02em] opacity-0 text-[#f0ede8] relative"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(44px, 9vw, 130px)",
            fontWeight: 900,
            animation: "fadeUp 0.9s 0.5s forwards",
            marginTop: 24,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className={`transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}>
            I am
            <br />
            <em style={{ fontStyle: "italic", color: "#A78BFA" }}>Sonish</em>
            <br />
            <span
              style={{
                WebkitTextStroke: "1px rgba(123,140,222,0.3)",
                color: "transparent",
              }}
            >
              Upadhyaya
            </span>
          </div>
          <div className={`transition-opacity duration-300 absolute top-0 left-0 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            Da
            <br />
            tte
            <br />
            bayo
          </div>
        </h1>

        {/* Description */}
        <p
          className="max-w-[540px] leading-[1.8] font-light text-[#6b7280] text-sm opacity-0"
          style={{
            marginTop: 32,
            animation: "fadeUp 0.9s 0.7s forwards",
          }}
        >
          I build immersive web experiences with Next.js and Django
        </p>

        {/* CTA */}
        <div
          className="flex items-center gap-4 opacity-0"
          style={{
            marginTop: 32,
            animation: "fadeUp 0.9s 0.9s forwards",
          }}
        >
          
            <a href="/cv/sonishreport.pdf"
            download="sonishreport.pdf"
            className="group relative overflow-hidden"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 40px",
              border: "1px solid rgba(123,140,222,0.2)",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              background: "transparent",
              cursor: "pointer",
              animation: "borderBlink 2s ease-in-out infinite",
              textDecoration: "none",
            }}
          >
            <span className="absolute inset-0 bg-[#7B8CDE] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-[#0d0e1a] transition-colors duration-300">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1v7M3 6l3 3 3-3M1 10h10"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download CV
            </span>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes borderBlink {
          0%, 100% { border-color: rgba(123,140,222,0.2); box-shadow: none; }
          50%       { border-color: rgba(123,140,222,0.8); box-shadow: 0 0 14px rgba(123,140,222,0.35); }
        }

        /* ── Desktop ── */
        .hero-text-col {
          padding-bottom: 0px;
          padding-top: 0px;
        }
        .mobile-image-wrap {
          display: none;
          margin-bottom: 48px;
        }

        /* ── Tablet ── */
        @media (max-width: 1024px) {
          #home { padding: 0 24px !important; }
        }

        /* ── Mobile ── */
        @media (max-width: 1023px) {
          #home {
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0 24px !important;
            min-height: 100svh;
          }

          .hero-text-col {
            width: 100%;
            padding-top: 100px;
            padding-bottom: 60px;
            align-items: center;
            text-align: center;
          }

          .mobile-image-wrap {
            display: flex !important;
          }

          /* center the eyebrow line */
          .hero-text-col > div:first-child {
            justify-content: center;
          }

          /* center description */
          .hero-text-col p {
            margin-left: auto;
            margin-right: auto;
            text-align: center;
          }

          /* center CTA */
          .hero-text-col > div:last-child {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          #home { padding: 0 16px !important; }

          .hero-text-col {
            padding-top: 90px;
            padding-bottom: 48px;
          }
        }

/* container */
.liquid-container {
  position: relative;
}

/* base image */
.liquid-img {
  transition: 
    opacity 1.2s cubic-bezier(.22,.61,.36,1),
    transform 1.2s cubic-bezier(.22,.61,.36,1),
    filter 1.2s ease,
    clip-path 1.2s cubic-bezier(.22,.61,.36,1);
}

/* default image */
.liquid-img-front {
  opacity: 1;
  transform: scale(1);
  clip-path: circle(75% at 50% 50%);
}

/* hover image */
.liquid-img-back {
  opacity: 0;
  transform: scale(1.15);
  filter: blur(8px);
  clip-path: circle(0% at 50% 50%);
}

/* hover state */
.liquid-container:hover .liquid-img-front {
  opacity: 0;
  transform: scale(1.15);
  filter: blur(8px);
  clip-path: circle(0% at 50% 50%);
}

.liquid-container:hover .liquid-img-back {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
  clip-path: circle(75% at 50% 50%);
}
      `}</style>
    </section>
  );
}