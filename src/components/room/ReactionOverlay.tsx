import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Reaction {
  id: string;
  emoji: string;
  timestamp: number;
}

interface ReactionOverlayProps {
  reactions: Reaction[];
  onRemoveReaction: (id: string) => void;
}

export function ReactionOverlay({
  reactions,
  onRemoveReaction,
}: ReactionOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 select-none">
      <AnimatePresence>
        {reactions.map((r) => (
          <FloatingEmoji
            key={r.id}
            reaction={r}
            onComplete={() => onRemoveReaction(r.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function FloatingEmoji({
  reaction,
  onComplete,
}: {
  reaction: Reaction;
  onComplete: () => void;
}) {
  // Generate random horizontal placement offset
  const randomX = useStateSeed(reaction.id) * 60 - 30; // -30px to +30px offset

  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: "100%", x: `calc(50% + ${randomX}px)` }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1, 0.8],
        y: "20%",
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="absolute bottom-24 left-1/2 -translate-x-1/2 text-4xl"
    >
      {reaction.emoji}
    </motion.div>
  );
}

// Simple deterministic helper to generate random numbers from string seeds
function useStateSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(Math.sin(hash));
}
export default ReactionOverlay;
