"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const BOOT_LINES = [
  "Last login: Today on ttys000",
  "sonish@portfolio ~ %",
  "Full-Stack Developer | Kathmandu, Nepal",
  "Type 'help' to get started.",
  "",
];

/* ─── COMMANDS ──────────────────────────────────────────────────────────── */

const COMMANDS = {
  help: {
    description: "List available commands",
    execute: ({ registry }) => [
      "Available commands:",
      "",
      ...Object.entries(registry).map(
        ([cmd, meta]) => `  ${cmd.padEnd(14)} ${meta.description}`
      ),
      "",
    ],
  },

  clear: { description: "Clear terminal", special: "clear" },

  about: {
    description: "About me",
    execute: () => [
      "┌─────────────────────────────────────────┐",
      "│           Sonish Upadhyaya              │",
      "│       Associate Full-Stack Developer    │",
      "│         Endeavor Nepal Pvt. Ltd.        │",
      "│           Kathmandu, Nepal              │",
      "└─────────────────────────────────────────┘",
      "",
      "Backend-focused Full-Stack Developer with",
      "production experience building and securing",
      "government platforms serving 100K+ users.",
      "",
      "Skilled in PHP/Laravel, Python/Django, REST",
      "APIs, advanced auth/RBAC, multi-tenancy, and",
      "practical AI/LLM engineering (MCP, RAG).",
      "",
      "Currently working on government-scale",
      "platforms and deploying via Docker & K8s.",
      "",
    ],
  },

  whoami: {
    description: "Who am I?",
    execute: () => [
      "sonish — full-stack dev, backend enthusiast,",
      "government project contributor, and occasional",
      "space game developer.",
      "",
    ],
  },

  skills: {
    description: "Tech stack",
    execute: () => [
      "─── Frontend ───────────────────────────",
      "Next.js       ████████████░░  90%",
      "React.js      ███████████░░░  85%",
      "Tailwind CSS  ██████████░░░░  78%",
      "",
      "─── Backend ────────────────────────────",
      "Laravel       ████████████░░  90%",
      "Django        ███████████░░░  85%",
      "REST APIs     █████████████░  95%",
      "",
      "─── Database & Cache ───────────────────",
      "MySQL         ████████████░░  90%",
      "Redis         ██████████░░░░  78%",
      "MongoDB       ████████░░░░░░  60%",
      "",
      "─── AI & DevOps ────────────────────────",
      "LLM / MCP     ███████████░░░  85%",
      "Docker / K8s  ██████████░░░░  75%",
      "CI/CD         █████████░░░░░  70%",
      "",
    ],
  },

  experience: {
    description: "Work experience",
    execute: () => [
      "─── Endeavor Nepal Pvt. Ltd. ───────────────",
      "",
      "Associate Full-Stack Developer",
      "Jun 2025 – Present",
      "",
      "  [TSC] Teacher Service Council (Gov't)",
      "  Next.js + Django + MySQL",
      "  https://license.tsc.gov.np",
      "  → Headless CMS, 100K+ user API",
      "  → JWT auth, RBAC, Celery + Redis",
      "  → RMIS integration, SMS webhooks",
      "",
      "  [NARC] National Agricultural Research Council",
      "  Laravel 11.9 + PHP 8.2 + MySQL",
      "  https://narc.gov.np",
      "  → Multi-tenant: 60+ subdomains",
      "  → Redis caching + Horizon queues",
      "",
      "  [E-Pension] Government Project",
      "  Laravel 12 + Livewire + Redis",
      "  → Hierarchy-based RBAC, PIS API integration",
      "",
      "  [NAS-API] Centralized Storage Service",
      "  Laravel 12 + Filament + NAS",
      "  → Multi-tenant auth, chunked uploads",
      "",
      "─────────────────────────────────────────────",
      "",
      "Intern Full-Stack Developer",
      "Feb 2025 – May 2025",
      "",
      "  [OM Network] Web Application",
      "  Laravel 12 + React 19 + MySQL",
      "  https://om.conceptualframe.com",
      "  → Monolithic full-stack app",
      "  → Controller-Service-Repository pattern",
      "  → AI chatbot integration via external API",
      "",
    ],
  },

  projects: {
    description: "Personal projects",
    execute: () => [
      "─── Projects ───────────────────────────────",
      "",
      "1. Local LLM Chatbot with Custom MCP Server",
      "   Laravel 12, Django, Ollama, Qwen",
      "   → End-to-end tool calling & RAG",
      "",
      "2. RAG Document Q&A Pipeline",
      "   Python, LangChain, ChromaDB, Gemini",
      "   → Custom top-k similarity search",
      "",
      "3. CI/CD Pipeline with Docker & Kubernetes",
      "   GitHub Actions, Next.js, K8s",
      "   → Zero-downtime rolling updates",
      "",
      "Tip: type 'open github' to visit my profile",
      "",
    ],
  },

  education: {
    description: "Education",
    execute: () => [
      "─── Education ──────────────────────────────",
      "",
      "B.Sc. Computer Science & Information Tech.",
      "Asian College of Higher Studies",
      "Kathmandu, Nepal",
      "Apr 2021 – Oct 2025",
      "",
    ],
  },

  contact: {
    description: "Contact info",
    execute: () => [
      "─── Contact ────────────────────────────────",
      "",
      "  Email    sonish2319@gmail.com",
      "  Phone    +977 9863397130",
      "  GitHub   github.com/Sonish2319",
      "  LinkedIn linkedin.com/in/sonish-upadhyaya646",
      "",
      "Tip: type 'contactme' to reach out interactively",
      "Tip: type 'mailme' to compose an email",
      "",
    ],
  },

  /* ── NEW: contactme ─────────────────────────────────────────────── */
  contactme: {
    description: "Reach out to me interactively",
    special: "contactme",
  },

  open: {
    description: "Open a link  (open github | linkedin | tsc | narc | om)",
    execute: ({ args }) => {
      const target = args[0]?.toLowerCase();
      const urls = {
        github: "https://github.com/Sonish2319",
        linkedin: "https://linkedin.com/in/sonish-upadhyaya646",
        tsc: "https://license.tsc.gov.np",
        narc: "https://narc.gov.np",
        om: "https://om.conceptualframe.com",
      };
      if (!target || !urls[target]) {
        return ["Usage: open <target>", "Available: github, linkedin, tsc, narc, om", ""];
      }
      const url = urls[target];
      setTimeout(() => window.open(url, "_blank"), 300);
      return [`Opening ${url} ...`, ""];
    },
  },

  date: {
    description: "Current date and time",
    execute: () => {
      const now = new Date();
      return [now.toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }), ""];
    },
  },

  echo: {
    description: "Print text",
    execute: ({ args }) => [args.join(" ") || ""],
  },

  mailme: {
    description: "Compose an email to me",
    action: "mail",
  },
};

/* ─── CONTACT-ME FLOW ────────────────────────────────────────────────────── */
// Steps: 0 = show menu, 1 = waiting for choice, 2 = done
const CONTACTME_MENU = [
  "╔══════════════════════════════════════════╗",
  "║      How would you like to reach me?     ║",
  "╠══════════════════════════════════════════╣",
  "║  1  email      → sonish2319@gmail.com    ║",
  "║  2  phone      → +977 9863397130         ║",
  "║  3  linkedin   → Open LinkedIn profile   ║",
  "╚══════════════════════════════════════════╝",
  "",
  "Type a number or option name (e.g. '1' or 'email'):",
  "",
];

const CONTACTME_RESPONSES = {
  email: [
    "┌────────────────────────────────────┐",
    "│  📧  sonish2319@gmail.com          │",
    "└────────────────────────────────────┘",
    "",
    "Click to compose: mailto:sonish2319@gmail.com",
    "Or type 'mailme' to use the built-in composer.",
    "",
  ],
  phone: [
    "┌────────────────────────────────────┐",
    "│  📞  +977 9863397130               │",
    "└────────────────────────────────────┘",
    "",
    "Available on WhatsApp & Viber.",
    "",
  ],
  linkedin: [
    "Opening LinkedIn profile...",
    "→ linkedin.com/in/sonish-upadhyaya646",
    "",
  ],
};

const resolveContactChoice = (input) => {
  const v = input.trim().toLowerCase();
  if (v === "1" || v === "email") return "email";
  if (v === "2" || v === "phone") return "phone";
  if (v === "3" || v === "linkedin") return "linkedin";
  return null;
};

/* ─── PARTICLES ──────────────────────────────────────────────────────────── */
function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let w, h;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 55;
    const dots = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // connections
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(167,139,250,${(1 - dist / 110) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // dots
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${d.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        borderRadius: "inherit",
      }}
    />
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
const parseCommand = (input) => {
  const tokens = input.trim().split(" ");
  return { commandName: tokens[0], args: tokens.slice(1) };
};

export default function Contact() {
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [responding, setResponding] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // mail flow
  const [mode, setMode] = useState("normal"); // "normal" | "mail" | "contactme"
  const [mailData, setMailData] = useState({ from: "", subject: "", message: "" });
  const [mailStep, setMailStep] = useState(0);

  // 3D tilt
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  /* ── Boot sequence ── */
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, { text: BOOT_LINES[i], type: "system" }]);
        i++;
      } else {
        clearInterval(iv);
        setBooted(true);
      }
    }, 60);
    return () => clearInterval(iv);
  }, []);

  /* ── Auto scroll ── */
  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  /* ── Listen for Hire Me event from Navbar ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.detail === "contactme") {
        // small delay so page scroll settles
        setTimeout(() => {
          inputRef.current?.focus();
          runCommand("contactme");
        }, 200);
      }
    };
    window.addEventListener("terminal:run", handler);
    return () => window.removeEventListener("terminal:run", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  /* ── 3D tilt ── */
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 6, y: dx * 6 });
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  /* ── Type animation ── */
  const typeOutput = useCallback((output, callback) => {
    let lineIndex = 0;
    const typeLine = () => {
      if (lineIndex >= output.length) { callback?.(); return; }
      let charIndex = 0;
      const text = output[lineIndex];
      setLines((prev) => [...prev, { text: "", type: "output" }]);
      const ci = setInterval(() => {
        setLines((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], text: text.slice(0, charIndex + 1) };
          return updated;
        });
        charIndex++;
        if (charIndex >= text.length) {
          clearInterval(ci);
          lineIndex++;
          setTimeout(typeLine, 30);
        }
      }, 12);
    };
    typeLine();
  }, []);

  const sendEmail = async (data) => {
    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Failed");
    return result;
  };

  /* ── Run command ── */
  const runCommand = useCallback((value) => {
    const trimmed = value.trim();
    if (!trimmed || responding || !booted) return;

    setLines((prev) => [...prev, { text: `sonish@portfolio ~ % ${trimmed}`, type: "input" }]);
    setResponding(true);

    /* ─ MAIL MODE ─ */
    if (mode === "mail") {
      if (mailStep === 0) {
        setMailData((prev) => ({ ...prev, from: trimmed }));
        setMailStep(1);
        return typeOutput(["Subject:"], () => setResponding(false));
      }
      if (mailStep === 1) {
        setMailData((prev) => ({ ...prev, subject: trimmed }));
        setMailStep(2);
        return typeOutput(["Message:"], () => setResponding(false));
      }
      if (mailStep === 2) {
        setMailData((prev) => ({ ...prev, message: trimmed }));
        setMailStep(3);
        return typeOutput(["Type 'send' to send or 'cancel' to abort"], () => setResponding(false));
      }
      if (mailStep === 3) {
        if (trimmed.toLowerCase() === "send") {
          (async () => {
            try {
              await sendEmail(mailData);
              typeOutput(["Sending message...", "✓ Message sent successfully!", ""], () => {
                setResponding(false);
                setMode("normal");
                setMailStep(0);
                setMailData({ from: "", subject: "", message: "" });
              });
            } catch {
              typeOutput(["✗ Failed to send email.", ""], () => setResponding(false));
            }
          })();
          return;
        }
        if (trimmed.toLowerCase() === "cancel") {
          setMode("normal");
          setMailStep(0);
          setMailData({ from: "", subject: "", message: "" });
          return typeOutput(["Email cancelled.", ""], () => setResponding(false));
        }
        return typeOutput(["Type 'send' or 'cancel'"], () => setResponding(false));
      }
    }

    /* ─ CONTACTME MODE ─ */
    if (mode === "contactme") {
      const choice = resolveContactChoice(trimmed);
      if (!choice) {
        return typeOutput(
          ["Invalid option. Type 1, 2, or 3 (or: email / phone / linkedin)", ""],
          () => setResponding(false)
        );
      }

      const output = CONTACTME_RESPONSES[choice];

      if (choice === "linkedin") {
        setTimeout(() => window.open("https://linkedin.com/in/sonish-upadhyaya646", "_blank"), 400);
      }

      setMode("normal");
      return typeOutput(output, () => setResponding(false));
    }

    /* ─ NORMAL MODE ─ */
    const { commandName, args } = parseCommand(trimmed);
    const command = COMMANDS[commandName];

    if (!command) {
      return typeOutput(
        [`zsh: command not found: ${commandName}`, "Try 'help' for a list of commands.", ""],
        () => setResponding(false)
      );
    }

    if (command.special === "clear") {
      setTimeout(() => { setLines([]); setResponding(false); }, 100);
      return;
    }

    if (command.special === "contactme") {
      setMode("contactme");
      return typeOutput(CONTACTME_MENU, () => setResponding(false));
    }

    if (command.action === "mail") {
      setMode("mail");
      setMailStep(0);
      return typeOutput(["Your email:"], () => setResponding(false));
    }

    const output = command.execute ? command.execute({ args, registry: COMMANDS }) : [];
    typeOutput(output, () => setResponding(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, mailStep, mailData, responding, booted, typeOutput]);

  /* ── Key handler ── */
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (mode !== "normal") return;
      const typed = input.trim();
      if (!typed) return;
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(typed));
      if (matches.length === 1) { setInput(matches[0]); return; }
      if (matches.length > 1) {
        let prefix = matches[0];
        for (const m of matches) while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
        setInput(prefix);
        setLines((prev) => [
          ...prev,
          { text: `sonish@portfolio ~ % ${typed}`, type: "input" },
          { text: matches.join("   "), type: "system" },
          { text: "", type: "output" },
        ]);
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (!responding && input.trim()) { setHistory((p) => [...p, input]); setHistoryIndex(-1); }
      runCommand(input);
      setInput("");
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) {
        const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(idx);
        setInput(history[idx]);
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const idx = historyIndex + 1;
        if (idx < history.length) { setHistoryIndex(idx); setInput(history[idx]); }
        else { setHistoryIndex(-1); setInput(""); }
      }
    }
  };

  /* ── Prompt label based on mode ── */
  const promptLabel = mode === "contactme"
    ? "sonish@portfolio [contactme] %"
    : mode === "mail"
    ? "sonish@portfolio [mail] %"
    : "sonish@portfolio ~ %";

  const promptColor = mode === "contactme" ? "#f59e0b" : mode === "mail" ? "#34d399" : "#34d399";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

        .terminal-wrapper {
          perspective: 1200px;
          perspective-origin: 50% 50%;
        }

        .terminal-card {
          max-width: 860px;
          margin: 60px auto;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(11, 13, 24, 0.92);
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(167,139,250,0.15),
            0 24px 80px rgba(0,0,0,0.7),
            0 0 60px rgba(167,139,250,0.06);
          transform-style: preserve-3d;
          transition: transform 0.12s ease, box-shadow 0.3s ease;
          position: relative;
          will-change: transform;
        }

        .terminal-card.hovered {
          box-shadow:
            0 0 0 1px rgba(167,139,250,0.35),
            0 30px 100px rgba(0,0,0,0.8),
            0 0 80px rgba(167,139,250,0.12);
        }

        .terminal-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          border-radius: inherit;
          transition: opacity 0.3s;
        }

        .titlebar {
          display: flex;
          align-items: center;
          padding: 11px 16px;
          background: rgba(20,22,36,0.95);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
          z-index: 2;
        }

        .titlebar-label {
          margin-left: 10px;
          font-size: 11.5px;
          color: rgba(255,255,255,0.28);
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.04em;
        }

        .dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 7px; cursor: default; }
        .dot:hover { filter: brightness(1.25); }

        .body {
          height: 440px;
          overflow-y: auto;
          padding: 18px 20px 12px;
          font-family: 'JetBrains Mono', 'Menlo', monospace;
          font-size: 12.5px;
          line-height: 1.7;
          color: #e5e7eb;
          position: relative;
          z-index: 2;
          scrollbar-width: thin;
          scrollbar-color: rgba(167,139,250,0.2) transparent;
        }

        .body::-webkit-scrollbar { width: 4px; }
        .body::-webkit-scrollbar-track { background: transparent; }
        .body::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.25); border-radius: 4px; }

        .line-system { color: #6b7280; }
        .line-input  { color: #a78bfa; font-weight: 500; }
        .line-output { color: #e2e8f0; }
        .line-output:has-text-box { background: rgba(167,139,250,0.04); }

        .input-row {
          display: flex;
          align-items: center;
          padding: 12px 20px 14px;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-family: 'JetBrains Mono', monospace;
          position: relative;
          z-index: 2;
          background: rgba(10,12,22,0.6);
        }

        .prompt {
          margin-right: 8px;
          white-space: nowrap;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.3s;
        }

        .term-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #f0ede8;
          font-family: inherit;
          font-size: 12.5px;
          caret-color: #a78bfa;
        }

        .cursor {
          display: inline-block;
          width: 7px;
          height: 14px;
          background: #a78bfa;
          margin-left: 1px;
          border-radius: 1px;
          animation: blink 1.1s step-end infinite;
          vertical-align: text-bottom;
        }

        @keyframes blink { 50% { opacity: 0; } }

        /* scan-line overlay */
        .scanlines {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          border-radius: inherit;
          opacity: 0.6;
        }

        /* contact-me highlight */
        .line-output.contactme-highlight {
          color: #fbbf24;
          font-weight: 600;
        }

        /* mode badge animation */
        @keyframes modePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .mode-badge {
          animation: modePulse 2s ease-in-out infinite;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 100px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-left: 10px;
          vertical-align: middle;
        }

        /* glitch effect on boot */
        @keyframes glitch {
          0%   { clip-path: inset(0 0 98% 0); transform: translate(-2px,0); }
          20%  { clip-path: inset(30% 0 50% 0); transform: translate(2px,0); }
          40%  { clip-path: inset(60% 0 20% 0); transform: translate(-1px,0); }
          60%  { clip-path: inset(80% 0 5% 0);  transform: translate(1px,0); }
          80%  { clip-path: inset(10% 0 80% 0); transform: translate(0,0); }
          100% { clip-path: inset(0 0 0 0);     transform: translate(0,0); }
        }

        /* fade-in line */
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .line-animate {
          animation: fadeInLine 0.18s ease forwards;
        }

        @media (max-width: 900px) {
          .terminal-card { margin: 30px 16px; }
        }
      `}</style>

      <section id="contact">

        <p
          className="uppercase tracking-[0.25em] text-[10px] mb-5 flex items-center gap-2"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#ffffff" }}
        >
          <span style={{ color: "#4A5580" }}>04</span>
          Contact
        </p>
        
        <div className="terminal-wrapper">
          <div
            ref={cardRef}
            className={`terminal-card ${isHovered ? "hovered" : ""}`}
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.008 : 1})`,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={() => inputRef.current?.focus()}
            onMouseDown={(e) => {
              if (e.target !== inputRef.current) e.preventDefault();
              inputRef.current?.focus();
            }}
          >
            {/* Particle canvas */}
            <Particles />

            {/* Radial glow that follows cursor */}
            <div
              className="terminal-glow"
              style={{
                background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(167,139,250,0.07) 0%, transparent 65%)`,
                opacity: isHovered ? 1 : 0,
              }}
            />

            {/* Scanlines */}
            <div className="scanlines" />

            {/* Title bar */}
            <div className="titlebar">
              <div className="dot" style={{ background: "#ff5f57" }} title="Close" />
              <div className="dot" style={{ background: "#febc2e" }} title="Minimize" />
              <div className="dot" style={{ background: "#28c840" }} title="Maximize" />
              <span className="titlebar-label">sonish@portfolio — zsh</span>
              {mode === "contactme" && (
                <span className="mode-badge" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>
                  contactme
                </span>
              )}
              {mode === "mail" && (
                <span className="mode-badge" style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}>
                  mail
                </span>
              )}
            </div>

            {/* Body */}
            <div className="body" ref={terminalRef}>
              {lines.map((line, i) => (
                <div key={i} className={`line-animate line-${line.type}`}>
                  {line.text || "\u00A0"}
                </div>
              ))}
              {booted && !responding && <span className="cursor" />}
            </div>

            {/* Input row */}
            <div className="input-row">
              <span className="prompt" style={{ color: promptColor }}>
                {promptLabel}
              </span>
              <input
                ref={inputRef}
                className="term-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!booted || responding}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}