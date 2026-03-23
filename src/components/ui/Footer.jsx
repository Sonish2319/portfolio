"use client"
export default function Footer() {
  const socials = [
    { name: "GitHub", url: "https://github.com/Sonish2319" },
    { name: "LinkedIn", url: "https://linkedin.com/in/sonish-upadhyaya646" },
    { name: "Email", url: "mailto:sonish2319@gmail.com" },
  ];

  return (
    <footer
      style={{
        padding: "32px 48px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
          color: "#707070",
          textTransform: "uppercase",
        }}
      >
        © {new Date().getFullYear()} Sonish Upadhyaya — Kathmandu, Nepal
      </p>

      <div style={{ display: "flex", gap: 24 }}>
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target={s.name === "Email" ? undefined : "_blank"}
            rel={s.name === "Email" ? undefined : "noopener noreferrer"}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#707070",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#F6821F")}
            onMouseLeave={e => (e.currentTarget.style.color = "#707070")}
          >
            {s.name}
          </a>
        ))}
      </div>
    </footer>
  );
}