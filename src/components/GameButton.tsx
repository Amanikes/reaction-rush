import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { ButtonColor } from "@/types/game";

interface GameButtonProps {
  id: number;
  color: ButtonColor;
  disabled: boolean;
  onClick: (id: number) => void;
}

export function GameButton({ id, color, disabled, onClick }: GameButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; key: number }[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || color !== "green") return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipples((r) => [...r, { x, y, key: Date.now() }]);
      setTimeout(() => setRipples((r) => r.slice(1)), 600);

      onClick(id);
    },
    [id, color, disabled, onClick]
  );

  const isGreen = color === "green";

  return (
    <motion.button
      className={`game-button-base ${isGreen ? "game-button-green" : "game-button-red"} ${
        isGreen && !disabled ? "animate-pulse-green cursor-pointer" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={handleClick}
      whileTap={isGreen && !disabled ? { scale: 0.92 } : undefined}
      animate={isGreen ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 0.6, repeat: isGreen ? Infinity : 0, repeatType: "reverse" }}
      disabled={disabled}
      aria-label={`Button ${id + 1} - ${color}`}
    >
      <span className="relative z-10 font-display text-foreground/90 select-none">
        {id + 1}
      </span>
      {ripples.map((r) => (
        <span
          key={r.key}
          className="ripple-effect"
          style={{ left: r.x, top: r.y, width: 20, height: 20, marginLeft: -10, marginTop: -10 }}
        />
      ))}
    </motion.button>
  );
}
