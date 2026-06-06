"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  type?: "words" | "chars" | "lines";
  once?: boolean;
}

export default function AnimatedText({
  text, className = "", style, delay = 0, type = "words", once = true,
}: Props) {
  const ref      = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView   = useInView(ref, { once, margin: "-10%" });

  useEffect(() => {
    if (inView) controls.start("visible");
    else if (!once) controls.start("hidden");
  }, [inView, controls, once]);

  const tokens = type === "chars" ? text.split("") : text.split(" ");

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} style={style}>
      <motion.div
        initial="hidden"
        animate={controls}
        className="flex flex-wrap"
        style={{ gap: type === "chars" ? "0" : "0.28em" }}
      >
        {tokens.map((token, i) => (
          <motion.span
            key={i}
            variants={{
              hidden:  { y: "110%", opacity: 0, rotateX: -40 },
              visible: {
                y: 0, opacity: 1, rotateX: 0,
                transition: {
                  duration: 0.7,
                  delay: delay + i * (type === "chars" ? 0.03 : 0.07),
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            className="inline-block"
            style={{ transformOrigin: "bottom center" }}
          >
            {token === " " ? "\u00A0" : token}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
