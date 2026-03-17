"use client";
import { useEffect, useState } from "react";

const links = ["About", "Skills", "Journey", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "28px 48px",
          backdropFilter: scrolled ? "blur(1px)" : "none",
          borderBottom: "none",
          transition: "all 0.3s",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.15em",
            color: "#A78BFA",
            textTransform: "uppercase",
            textDecoration: "none",
            zIndex: 110,
          }}
        >
          Sonish<span style={{ color: "#707070" }}>.</span>Upadhyaya
        </a>

        {/* Desktop Links */}
        <ul
          style={{
            display: "flex",
            gap: 40,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="desktop-links"
        >
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#b4b0b0",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ede8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#707070")}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Hire Me */}
        <button
          className="desktop-hire"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#0e0e0e",
            background: "#A78BFA",
            border: "none",
            padding: "10px 22px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#9270f0";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#A78BFA";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Hire Me
        </button>

        {/* Hamburger Menu (Mobile Only) */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 24,
            height: 18,
            background: "none",
            border: "none",
            cursor: "pointer",
            zIndex: 110,
          }}
        >
          <span
            style={{
              display: "block",
              height: 2,
              background: "#f0ede8",
              borderRadius: 1,
              transition: "all 0.3s",
              transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              height: 2,
              background: "#f0ede8",
              borderRadius: 1,
              opacity: menuOpen ? 0 : 1,
              transition: "all 0.3s",
            }}
          />
          <span
            style={{
              display: "block",
              height: 2,
              background: "#f0ede8",
              borderRadius: 1,
              transition: "all 0.3s",
              transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "#080918",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          transition: "opacity 0.35s, transform 0.35s",
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(-16px)",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {links.map((link, i) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 8vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#f0ede8",
              textDecoration: "none",
              transition: "color 0.2s, transform 0.3s",
              transitionDelay: menuOpen ? `${i * 0.07}s` : "0s",
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              opacity: menuOpen ? 1 : 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#A78BFA")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#f0ede8")}
          >
            {link}
          </a>
        ))}

        <button
          onClick={() => setMenuOpen(false)}
          style={{
            marginTop: 16,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#0e0e0e",
            background: "#A78BFA",
            border: "none",
            padding: "14px 36px",
            cursor: "pointer",
            transition: "opacity 0.3s",
            transitionDelay: menuOpen ? `${links.length * 0.07}s` : "0s",
            opacity: menuOpen ? 1 : 0,
          }}
        >
          Hire Me
        </button>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .desktop-hire  { display: none !important; }
          .hamburger     { display: flex !important; }
          nav { padding: 22px 24px !important; }
        }
      `}</style>
    </>
  );
}