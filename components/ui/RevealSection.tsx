"use client";
import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

interface Props {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  stagger?: boolean;
}

const getVariants = (dir: Direction): Variants => {
  const map: Record<Direction, Variants> = {
    up:    { hidden: { y: 60,   opacity: 0 }, visible: { y: 0,   opacity: 1 } },
    down:  { hidden: { y: -60,  opacity: 0 }, visible: { y: 0,   opacity: 1 } },
    left:  { hidden: { x: 80,   opacity: 0 }, visible: { x: 0,   opacity: 1 } },
    right: { hidden: { x: -80,  opacity: 0 }, visible: { x: 0,   opacity: 1 } },
    scale: { hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 } },
    none:  { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  };
  return map[dir];
};

export default function RevealSection({
  children, className = "", direction = "up", delay = 0, duration = 0.8, once = true,
}: Props) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-8%" });

  return (
    <motion.div
      ref={ref}
      variants={getVariants(direction)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
