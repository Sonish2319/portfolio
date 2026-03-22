"use client";
import { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  "Last login: Today on ttys000",
  "sonish@portfolio ~ %",
  "Full-Stack Developer | Kathmandu, Nepal",
  "Type 'help' to get started.",
  "",
];

/* ---------------- COMMAND REGISTRY ---------------- */

const COMMANDS = {
  help: {
    description: "List available commands",
    execute: ({ registry }) => [
      "Available commands:",
      "",
      ...Object.entries(registry).map(
        ([cmd, meta]) => `  ${cmd.padEnd(12)} ${meta.description}`
      ),
      "",
    ],
  },

  clear: {
    description: "Clear terminal",
    special: "clear",
  },

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
      "hands-on experience building scalable web",
      "applications using Django, Laravel & Next.js.",
      "",
      "Skilled in RESTful APIs, JWT/RBAC auth,",
      "Redis caching, async job queues, and",
      "multi-tenant architectures.",
      "",
      "Currently working on government-scale",
      "platforms serving 100K+ users.",
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
      "─── DevOps & Infra ─────────────────────",
      "Docker        █████████░░░░░  70%",
      "Nginx         █████████░░░░░  70%",
      "CI/CD         ████████░░░░░░  65%",
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
      "1. Lekhapadi — Blogging Platform",
      "   EJS, Node.js, SQLite",
      "   github.com/Sonish2319/Lekhapadi",
      "",
      "2. Space Game — Asteroid Avoidance",
      "   Python / Pygame",
      "   github.com/Sonish2319/space-game",
      "",
      "3. React Projects — Collection",
      "   Form builder, Tic-tac-toe,",
      "   CRUD Todo, Weather App",
      "   github.com/Sonish2319/React-Projects",
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
      "Tip: type 'mailme' to send me a message",
      "Tip: type 'open github' to visit my profile",
      "",
    ],
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
        return [
          "Usage: open <target>",
          "Available: github, linkedin, tsc, narc, om",
          "",
        ];
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
      return [
        now.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }),
        "",
      ];
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

/* ---------------- PARSER ---------------- */

const parseCommand = (input) => {
  const tokens = input.trim().split(" ");
  return {
    commandName: tokens[0],
    args: tokens.slice(1),
  };
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

  const [mode, setMode] = useState("normal");
  const [mailData, setMailData] = useState({
    from: "",
    subject: "",
    message: "",
  });
  const [mailStep, setMailStep] = useState(0);
  const [tabMatches, setTabMatches] = useState([]);

  /* ---------------- ALWAYS FOCUS INPUT ---------------- */
  useEffect(() => {
    const onBlur = () => {
      setTimeout(() => inputRef.current?.focus(), 0);
    };
    const inputEl = inputRef.current;
    inputEl?.addEventListener("blur", onBlur);
    inputEl?.focus();
    return () => inputEl?.removeEventListener("blur", onBlur);
  }, [booted]);

  /* ---------------- BOOT ---------------- */
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

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  /* ---------------- TYPE ANIMATION ---------------- */
  const typeOutput = (output, callback) => {
    let lineIndex = 0;

    const typeLine = () => {
      if (lineIndex >= output.length) {
        callback?.();
        return;
      }

      let charIndex = 0;
      const text = output[lineIndex];

      setLines((prev) => [...prev, { text: "", type: "output" }]);

      const charInterval = setInterval(() => {
        setLines((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = text.slice(0, charIndex + 1);
          return updated;
        });

        charIndex++;

        if (charIndex >= text.length) {
          clearInterval(charInterval);
          lineIndex++;
          setTimeout(typeLine, 40);
        }
      }, 15);
    };

    typeLine();
  };

  const sendEmail = async (data) => {
    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Failed");
      return result;
    } catch (err) {
      console.error("SEND EMAIL ERROR:", err);
      throw err;
    }
  };

  /* ---------------- RUN COMMAND ---------------- */
  const runCommand = (value) => {
    const trimmed = value.trim();
    if (!trimmed || responding || !booted) return;

    setLines((prev) => [
      ...prev,
      { text: `sonish@portfolio ~ % ${trimmed}`, type: "input" },
    ]);

    setResponding(true);

    /* ---------------- MAIL MODE ---------------- */
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
        return typeOutput(
          ["Type 'send' to send or 'cancel' to abort"],
          () => setResponding(false)
        );
      }

      if (mailStep === 3) {
        if (trimmed.toLowerCase() === "send") {
          (async () => {
            try {
              await sendEmail(mailData);
              typeOutput(
                ["Sending message...", "Message sent successfully!", ""],
                () => {
                  setResponding(false);
                  setMode("normal");
                  setMailStep(0);
                  setMailData({ from: "", subject: "", message: "" });
                }
              );
            } catch (err) {
              typeOutput(
                ["Failed to send email.", ""],
                () => setResponding(false)
              );
            }
          })();
          return;
        }

        if (trimmed.toLowerCase() === "cancel") {
          setMode("normal");
          setMailStep(0);
          setMailData({ from: "", subject: "", message: "" });
          return typeOutput(["Email cancelled.", ""], () =>
            setResponding(false)
          );
        }

        return typeOutput(
          ["Type 'send' or 'cancel'"],
          () => setResponding(false)
        );
      }
    }

    /* ---------------- NORMAL MODE ---------------- */

    const { commandName, args } = parseCommand(trimmed);
    const command = COMMANDS[commandName];

    if (!command) {
      return typeOutput(
        [`zsh: command not found: ${commandName}`, `Try 'help' for a list of commands.`, ""],
        () => setResponding(false)
      );
    }

    if (command.special === "clear") {
      setTimeout(() => {
        setLines([]);
        setResponding(false);
      }, 100);
      return;
    }

    if (command.action === "mail") {
      setMode("mail");
      setMailStep(0);
      return typeOutput(["Your email:"], () => setResponding(false));
    }

    const output = command.execute
      ? command.execute({ args, registry: COMMANDS })
      : [];

    typeOutput(output, () => {
      setResponding(false);
    });
  };

  /* ---------------- KEY HANDLER ---------------- */
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (mode !== "normal") return;

      const typed = input.trim();
      if (!typed) return;

      const allCommands = Object.keys(COMMANDS);
      const matches = allCommands.filter((cmd) => cmd.startsWith(typed));

      if (matches.length === 0) {
        // no match — do nothing
        return;
      }

      if (matches.length === 1) {
        // exact single match — complete it
        setInput(matches[0]);
        setTabMatches([]);
        return;
      }

      // find longest common prefix among matches
      let prefix = matches[0];
      for (const m of matches) {
        while (!m.startsWith(prefix)) {
          prefix = prefix.slice(0, -1);
        }
      }
      setInput(prefix);

      // show matches as a hint line (don't run a command)
      setLines((prev) => [
        ...prev,
        { text: `sonish@portfolio ~ % ${typed}`, type: "input" },
        { text: matches.join("   "), type: "system" },
        { text: "", type: "output" },
      ]);
      setTabMatches(matches);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (!responding && input.trim()) {
        setHistory((prev) => [...prev, input]);
        setHistoryIndex(-1);
      }

      runCommand(input);
      setInput("");
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) {
        const idx =
          historyIndex === -1
            ? history.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(idx);
        setInput(history[idx]);
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const idx = historyIndex + 1;
        if (idx < history.length) {
          setHistoryIndex(idx);
          setInput(history[idx]);
        } else {
          setHistoryIndex(-1);
          setInput("");
        }
      }
    }
  };

  return (
    <>
      <style>{`
        .terminal {
          max-width: 820px;
          margin: 60px auto;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(15, 17, 28, 0.9);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 80px rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .titlebar {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          background: rgba(30,30,40,0.8);
        }

        .titlebar-label {
          margin-left: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          font-family: Menlo, monospace;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 8px;
        }

        .body {
          height: 420px;
          overflow-y: auto;
          padding: 16px;
          font-family: Menlo, Monaco, monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #e5e7eb;
        }

        .line-system { color: #9ca3af; }
        .line-input  { color: #a78bfa; }
        .line-output { color: #e5e7eb; }

        .input-row {
          display: flex;
          padding: 12px 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-family: Menlo, monospace;
        }

        .prompt {
          color: #34d399;
          margin-right: 6px;
          white-space: nowrap;
        }

        input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-family: inherit;
          font-size: 13px;
        }

        .cursor {
          display: inline-block;
          width: 6px;
          height: 14px;
          background: #fff;
          margin-left: 2px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>

      <div className="terminal" onClick={() => inputRef.current?.focus()} onMouseDown={(e) => { if (e.target !== inputRef.current) e.preventDefault(); inputRef.current?.focus(); }}>
        {/* macOS bar */}
        <div className="titlebar">
          <div className="dot" style={{ background: "#ff5f57" }} />
          <div className="dot" style={{ background: "#febc2e" }} />
          <div className="dot" style={{ background: "#28c840" }} />
          <span className="titlebar-label">sonish@portfolio — zsh</span>
        </div>

        {/* body */}
        <div className="body" ref={terminalRef}>
          {lines.map((line, i) => (
            <div key={i} className={`line-${line.type}`}>
              {line.text || "\u00A0"}
            </div>
          ))}
          {booted && !responding && <span className="cursor" />}
        </div>

        {/* input */}
        <div className="input-row">
          <span className="prompt">sonish@portfolio ~ %</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!booted || responding}
            autoFocus
          />
        </div>
      </div>
    </>
  );
}