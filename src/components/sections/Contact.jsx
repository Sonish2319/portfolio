"use client";
import { useEffect, useRef, useState } from "react";

const MENU_OPTIONS = [
  { key: "1", label: "About",   anchor: "about"   },
  { key: "2", label: "Skills",  anchor: "skills"  },
  { key: "3", label: "Journey", anchor: "journey" },
  { key: "4", label: "Contact", anchor: "contact" },
];

const RESPONSES = {
  "1": [
    "Loading about.exe...",
    "",
    "  Name    : Sonish Upadhyaya",
    "  Role    : Full-Stack Developer",
    "  Stack   : Next.js · Django · Laravel",
    "  Status  : Open to opportunities",
    "",
    "  I craft immersive web experiences that",
    "  live at the intersection of design & code.",
    "",
  ],
  "2": [
    "Loading skills.exe...",
    "",
    "  React.js  ████████████░░  92%",
    "  Next.js   ██████████░░░░  75%",
    "  Django    ███████████░░░  88%",
    "  Laravel   ██████████░░░░  82%",
    "  MySQL     █████████░░░░░  70%",
    "",
  ],
  "3": [
    "Loading journey.exe...",
    "",
    "  2024 → Present  Full-Stack Developer",
    "  2022 → 2024     Backend Developer",
    "  2021 → 2025     BSc. CSIT",
    "",
    "  1+ years of professional experience",
    "  building production-grade applications.",
    "",
  ],
  "4": [
    "Loading contact.exe...",
    "",
    "  Email   : sonish.com",
    "  GitHub  : github.com/sonish",
    "  LinkedIn: linkedin.com/sonish",
    "",
    "  Currently available for freelance",
    "  and full-time opportunities.",
    "",
  ],
};

const COMMANDS = {
  '--getHelp': {
    description: 'Display list of available commands',
    execute: () => [
      'Available commands:',
      '',
      '  --getHelp    Display this help message',
      '  --clear      Clear the terminal',
      '  --about      Show about information',
      '  --skills     Show skills information',
      '  --journey    Show journey information',
      '  --contact    Show contact information',
      '  --menu       Show menu options',
      '',
      'Type a command and press Enter.',
    ],
  },
  '--clear': {
    description: 'Clear the terminal',
    execute: () => [],
    special: 'clear',
  },
  '--about': {
    description: 'Show about information',
    execute: () => RESPONSES['1'],
    navigate: 'about',
  },
  '--skills': {
    description: 'Show skills information',
    execute: () => RESPONSES['2'],
    navigate: 'skills',
  },
  '--journey': {
    description: 'Show journey information',
    execute: () => RESPONSES['3'],
    navigate: 'journey',
  },
  '--contact': {
    description: 'Show contact information',
    execute: () => RESPONSES['4'],
    navigate: 'contact',
  },
  '--menu': {
    description: 'Show menu options',
    execute: () => [
      'Menu options:',
      '',
      '  [1]  About Me  -- Who I am & what drives me',
      '  [2]  Skills    -- Technologies I work with',
      '  [3]  Journey   -- My experience & education',
      '  [4]  Contact   -- Let\'s build something together',
      '',
      'Use --about, --skills, --journey, --contact to explore.',
    ],
  },
};

const BOOT_LINES = [
  "Microsoft Windows [Version 10.0.22621.4317]",
  "(c) Microsoft Corporation. All rights reserved.",
  "",
  "C:\\Users\\Visitor> whoami",
  "  -> Guest exploring Sonish's portfolio",
  "",
  "C:\\Users\\Visitor> portfolio --menu",
  "",
  "  +------------------------------------------+",
  "  |   SONISH.UPADHYAYA  v1.0.0               |",
  "  |   Full-Stack Developer Portfolio          |",
  "  +------------------------------------------+",
  "",
  "  Type --getHelp for available commands.",
  "",
];

export default function Contact() {
  const sectionRef  = useRef(null);
  const terminalRef = useRef(null);
  const inputRef    = useRef(null);

  const [lines, setLines]           = useState([]);
  const [input, setInput]           = useState("");
  const [booted, setBooted]         = useState(false);
  const [responding, setResponding] = useState(false);
  const [history, setHistory]       = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  /* Boot sequence */
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT_LINES.length) {
        const line = BOOT_LINES[i];
        setLines((prev) => [...prev, { text: line, type: "system" }]);
        i++;
      } else {
        clearInterval(iv);
        setBooted(true);
      }
    }, 50);
    return () => clearInterval(iv);
  }, []);

  /* Auto-scroll */
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  /* Reveal observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const runCommand = (val) => {
    const trimmed = val.trim();
    if (!trimmed || responding || !booted) return;

    setLines((prev) => [
      ...prev,
      { text: `C:\\Users\\Visitor> ${trimmed}`, type: "input" },
    ]);
    setResponding(true);

    const command = COMMANDS[trimmed];

    if (command) {
      if (command.special === 'clear') {
        setTimeout(() => {
          setLines([]);
          setResponding(false);
        }, 200);
        return;
      }

      const response = command.execute();
      let i = 0;
      const iv = setInterval(() => {
        if (i < response.length) {
          setLines((prev) => [...prev, { text: response[i], type: "output" }]);
          i++;
        } else {
          clearInterval(iv);
          setTimeout(() => {
            setLines((prev) => [
              ...prev,
              { text: "", type: "system" },
              { text: "  Type --getHelp for more commands.", type: "system" },
              { text: "", type: "system" },
            ]);
            setResponding(false);
            // if (command.navigate) {
            //   document.getElementById(command.navigate)?.scrollIntoView({ behavior: "smooth" });
            // }
          }, 200);
        }
      }, 55);
    } else {
      setTimeout(() => {
        setLines((prev) => [
          ...prev,
          { text: `  '${trimmed}' is not recognized as an internal or external command.`, type: "error" },
          { text: "  Type --getHelp for available commands.", type: "error" },
          { text: "", type: "system" },
        ]);
        setResponding(false);
      }, 150);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = input;
      if (val.trim()) {
        setHistory((prev) => [...prev, val]);
        setHistoryIndex(-1);
      }
      setInput("");
      runCommand(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < history.length) {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        } else {
          setHistoryIndex(-1);
          setInput("");
        }
      }
    }
  };

  const handlePillClick = (key) => {
    if (responding || !booted) return;
    const commandMap = {
      "1": "--about",
      "2": "--skills",
      "3": "--journey",
      "4": "--contact",
    };
    const cmd = commandMap[key];
    if (cmd) runCommand(cmd);
  };

  return (
    <>
      <style>{`
        .contact-section {
          padding: 20px 48px;
          background: none;
          text-align: center;
        }

        .contact-big-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 7vw, 96px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.03em;
          color: #c8cef5;
          margin-bottom: 32px;
        }

        .contact-big-title em {
          color: #A78BFA;
          font-style: italic;
        }

        .contact-sub {
          font-size: 14px;
          color: #4A5580;
          margin-bottom: 40px;
          font-weight: 300;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.8;
        }

        .option-pills {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }

        .option-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4A5580;
          background: none;
          border: 1px solid rgba(123,140,222,0.15);
          padding: 7px 18px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }

        .option-pill:hover {
          color: #c8cef5;
          border-color: rgba(123,140,222,0.5);
          background: rgba(123,140,222,0.06);
        }

        .terminal-wrap {
          max-width: 760px;
          margin: 0 auto 64px;
          text-align: left;
          border: 1px solid rgba(123,140,222,0.18);
          background: #0a0b18;
          box-shadow: 0 0 60px rgba(123,140,222,0.07);
        }

        .terminal-titlebar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #13152a;
          border-bottom: 1px solid rgba(123,140,222,0.12);
          user-select: none;
        }

        .terminal-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
        }

        .terminal-title {
          margin-left: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #4A5580;
          letter-spacing: 0.08em;
        }

        .terminal-body {
          padding: 20px 24px;
          height: 380px;
          overflow-y: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          line-height: 1.75;
          scrollbar-width: thin;
          scrollbar-color: rgba(123,140,222,0.2) transparent;
        }

        .terminal-body::-webkit-scrollbar { width: 4px; }
        .terminal-body::-webkit-scrollbar-thumb {
          background: rgba(123,140,222,0.2);
          border-radius: 2px;
        }

        .line-system { color: #6b7280; }
        .line-input  { color: #A78BFA; }
        .line-output { color: #c8cef5; }
        .line-error  { color: #f87171; }

        .terminal-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-top: 1px solid rgba(123,140,222,0.1);
          background: #080916;
          cursor: text;
        }

        .terminal-prompt {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          color: #A78BFA;
          white-space: nowrap;
          flex-shrink: 0;
          user-select: none;
        }

        .terminal-input-field {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          color: #f0ede8;
          caret-color: #A78BFA;
          padding: 0;
          margin: 0;
          width: 100%;
        }

        .terminal-input-field::placeholder {
          color: #2a2d4a;
        }

        .terminal-input-field:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .cursor-blink {
          display: inline-block;
          width: 7px;
          height: 14px;
          background: #A78BFA;
          margin-left: 2px;
          vertical-align: middle;
          animation: blink 1s step-end infinite;
        }

        .contact-divider {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(123,140,222,0.2), transparent);
          margin: 32px auto 0;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        @media (max-width: 768px) {
          .contact-section { padding: 80px 20px; }
          .terminal-body { height: 300px; font-size: 11px; padding: 14px 16px; }
          .terminal-input-row { padding: 10px 16px; }
          .terminal-prompt { font-size: 11px; }
          .terminal-input-field { font-size: 11px; }
        }
      `}</style>

      <section className="contact-section" id="contact" ref={sectionRef}>
        <div
          className="section-label reveal"
          data-num="04"
          style={{ justifyContent: "center" }}
        >
          Let&apos;s Connect
        </div>

        <h2 className="contact-big-title reveal">
          Know More<br />
          About <em>Me.</em>
        </h2>

        <p className="contact-sub reveal">
          Type a command in the terminal below to explore my portfolio.
        </p>

        {/* Quick-pick pills */}
        <div className="option-pills reveal">
          {MENU_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className="option-pill"
              onClick={() => handlePillClick(opt.key)}
            >
              [{opt.key}] {opt.label}
            </button>
          ))}
        </div>

        {/* Terminal */}
        <div
          className="terminal-wrap reveal"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div className="terminal-titlebar">
            <span className="terminal-dot" style={{ background: "#ff5f57" }} />
            <span className="terminal-dot" style={{ background: "#febc2e" }} />
            <span className="terminal-dot" style={{ background: "#28c840" }} />
            <span className="terminal-title">Command Prompt — portfolio.exe</span>
          </div>

          {/* Output body */}
          <div className="terminal-body" ref={terminalRef}>
            {lines.map((line, i) => (
              <div key={i} className={`line-${line.type}`}>
                {line.text || "\u00A0"}
              </div>
            ))}
            {booted && !responding && (
              <span className="cursor-blink" />
            )}
          </div>

          {/* Input row */}
          <div className="terminal-input-row">
            <span className="terminal-prompt">C:\Users\Visitor&gt;</span>
            <input
              ref={inputRef}
              className="terminal-input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={booted ? "type --getHelp for commands" : "booting..."}
              disabled={!booted || responding}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="contact-divider" />
      </section>
    </>
  );
}