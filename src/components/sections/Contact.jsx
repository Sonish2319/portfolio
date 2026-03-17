"use client";
import { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  "Last login: Today on ttys000",
  "visitor@portfolio ~ %",
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
        ([cmd, meta]) => `  ${cmd.padEnd(10)} ${meta.description}`
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
      "Sonish Upadhyaya",
      "Full-Stack Developer",
      "",
      "I build immersive web experiences",
      "with modern technologies.",
    ],
  },

  skills: {
    description: "Tech stack",
    execute: () => [
      "React.js   ████████████░░",
      "Next.js    ██████████░░░░",
      "Django     ███████████░░░",
      "Laravel    ██████████░░░░",
      "",
    ],
  },

  echo: {
    description: "Print text",
    execute: ({ args }) => [args.join(" ") || ""],
  },

  mailme: {
  description: "Compose an email",
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
          updated[updated.length - 1].text =
            text.slice(0, charIndex + 1);
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
    console.log("Sending request to API...", data);

    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    console.log("API response:", result);

    if (!result.success) {
      throw new Error(result.error || "Failed");
    }

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

  // Always print input line
  setLines((prev) => [
    ...prev,
    { text: `visitor@portfolio ~ % ${trimmed}`, type: "input" },
  ]);

  setResponding(true);

  /* ---------------- MAIL MODE ---------------- */
  if (mode === "mail") {
    // Step 0 → Email
    if (mailStep === 0) {
      setMailData((prev) => ({ ...prev, from: trimmed }));
      setMailStep(1);

      return typeOutput(["Subject:"], () => setResponding(false));
    }

    // Step 1 → Subject
    if (mailStep === 1) {
      setMailData((prev) => ({ ...prev, subject: trimmed }));
      setMailStep(2);

      return typeOutput(["Message:"], () => setResponding(false));
    }

    // Step 2 → Message
    if (mailStep === 2) {
      setMailData((prev) => ({ ...prev, message: trimmed }));
      setMailStep(3);

      return typeOutput(
        ["Type 'send' to send or 'cancel' to abort"],
        () => setResponding(false)
      );
    }

    // Step 3 → Send / Cancel
    if (mailStep === 3) {
if (trimmed.toLowerCase() === "send") {
  (async () => {
    try {
      await sendEmail(mailData);

      typeOutput(
        ["Sending message...", "Message sent successfully 😎", ""],
        () => {
          setResponding(false);

          // ✅ reset AFTER success
          setMode("normal");
          setMailStep(0);
          setMailData({ from: "", subject: "", message: "" });
        }
      );
    } catch (err) {
      typeOutput(
        ["Failed to send email 😞", ""],
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

        return typeOutput(
          ["Email cancelled.", ""],
          () => setResponding(false)
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
      [`zsh: command not found: ${commandName}`, ""],
      () => setResponding(false)
    );
  }

  // CLEAR
  if (command.special === "clear") {
    setTimeout(() => {
      setLines([]);
      setResponding(false);
    }, 100);
    return;
  }

  // MAIL COMMAND TRIGGER
  if (command.action === "mail") {
    setMode("mail");
    setMailStep(0);

    return typeOutput(["Your email:"], () => setResponding(false));
  }

  // NORMAL COMMAND EXECUTION
  const output = command.execute
    ? command.execute({ args, registry: COMMANDS })
    : [];

  typeOutput(output, () => {
    setResponding(false);
  });
};

  /* ---------------- KEY HANDLER ---------------- */
const handleKeyDown = (e) => {
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
        }

        input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-family: inherit;
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

      <div className="terminal" onClick={() => inputRef.current?.focus()}>
        {/* macOS bar */}
        <div className="titlebar">
          <div className="dot" style={{ background: "#ff5f57" }} />
          <div className="dot" style={{ background: "#febc2e" }} />
          <div className="dot" style={{ background: "#28c840" }} />
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
          <span className="prompt">visitor@portfolio ~ %</span>
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