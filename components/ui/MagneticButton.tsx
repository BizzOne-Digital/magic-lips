"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export default function MagneticButton({
  children, className = "", onClick, strength = 0.35,
}: Props) {
  const ref  = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el   = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    setPos({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const onMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
}
