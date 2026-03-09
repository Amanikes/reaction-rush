import { motion, AnimatePresence } from "framer-motion";
import type { ReactionFeedback as FeedbackType } from "@/types/game";

interface Props {
  feedback: FeedbackType | null;
}

export function ReactionFeedbackDisplay({ feedback }: Props) {
  return (
    <AnimatePresence mode="wait">
      {feedback && (
        <motion.div
          key={feedback.timeMs}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className="text-center"
        >
          <p className="font-mono-game text-4xl font-bold text-primary text-glow">
            {(feedback.timeMs / 1000).toFixed(3)}s
          </p>
          <p className="mt-2 text-xl">
            <span className="mr-2 text-2xl">{feedback.emoji}</span>
            <span className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              {feedback.label}
            </span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function getReactionRating(timeMs: number): FeedbackType {
  if (timeMs < 250) return { timeMs, rating: "lightning", emoji: "⚡", label: "Lightning" };
  if (timeMs < 400) return { timeMs, rating: "fast", emoji: "🚀", label: "Fast" };
  return { timeMs, rating: "good", emoji: "👍", label: "Good" };
}
