import { motion, AnimatePresence } from "framer-motion";

interface Props {
  connected: boolean;
}

export function ConnectionStatus({ connected }: Props) {
  return (
    <>
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            connected ? "bg-primary" : "bg-destructive animate-pulse"
          }`}
        />
        <span className="font-mono-game text-xs text-muted-foreground">
          {connected ? "CONNECTED" : "RECONNECTING..."}
        </span>
      </div>
      <AnimatePresence>
        {!connected && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-destructive/90 py-2 text-center font-mono-game text-sm text-destructive-foreground"
          >
            Connection lost — attempting to reconnect...
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
