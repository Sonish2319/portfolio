"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    document.addEventListener("mousemove", onMove);

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left = mx + "px";
        dotRef.current.style.top = my + "px";
      }

      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top = ry + "px";
      }

      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);

    const onEnter = () => {
      if (dotRef.current)
        dotRef.current.style.transform = "translate(-50%,-50%) scale(2)";
      if (ringRef.current)
        ringRef.current.style.transform = "translate(-50%,-50%) scale(1.5)";
    };

    const onLeave = () => {
      if (dotRef.current)
        dotRef.current.style.transform = "translate(-50%,-50%) scale(1)";
      if (ringRef.current)
        ringRef.current.style.transform = "translate(-50%,-50%) scale(1)";
    };

    const interactives = document.querySelectorAll("a, button, [data-cursor]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);

      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: 10,
          height: 10,
          background: "#F6821F",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.2s",
        }}
      />

      <div
        ref={ringRef}
        style={{
          position: "fixed",
          width: 36,
          height: 36,
          border: "1px solid rgba(246,130,31,0.5)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.25s",
        }}
      />
    </>
  );
}