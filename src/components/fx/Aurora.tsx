import { cn } from "@/lib/utils";
import { InViewPause } from "./InViewPause";

/** Two slowly drifting light fields (sapphire + gold) and fine grain. Pauses off-screen. */
export function Aurora({
  className,
  intensity = "soft",
}: {
  className?: string;
  intensity?: "normal" | "soft";
}) {
  const soft = intensity === "soft";
  return (
    <InViewPause className={className}>
      <div
        className={cn(
          "aurora-blob animate-aurora-a -top-40 right-[5%] h-[34rem] w-[34rem] bg-primary",
          soft ? "opacity-[0.10]" : "opacity-[0.18]",
        )}
      />
      <div
        className={cn(
          "aurora-blob animate-aurora-b top-[25%] -left-40 h-[28rem] w-[28rem] bg-gold",
          soft ? "opacity-[0.05]" : "opacity-[0.09]",
        )}
      />
      <div className="bg-noise absolute inset-0" />
    </InViewPause>
  );
}
