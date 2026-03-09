interface Props {
  current: number;
  total: number;
}

export function RoundIndicator({ current, total }: Props) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2.5 w-10 rounded-full transition-all duration-500 ${
            i < current
              ? "bg-primary game-glow"
              : i === current
              ? "bg-primary/50 animate-pulse"
              : "bg-secondary"
          }`}
        />
      ))}
      <span className="font-mono-game text-sm text-muted-foreground ml-2">
        {current} / {total}
      </span>
    </div>
  );
}
