import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SplitText } from "@/components/fx/SplitText";

interface Props {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "start" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "start", className }: Props) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <div className={cn("mb-4 flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="h-px w-8 bg-gold/60" />
        <span className="text-xs font-medium tracking-wide text-gold">{eyebrow}</span>
      </div>
      {typeof title === "string" ? (
        <SplitText
          as="h2"
          onView
          text={title}
          className="text-3xl font-semibold leading-tight text-foreground md:text-[2.6rem] md:leading-[1.2]"
        />
      ) : (
        <h2 className="text-3xl font-semibold leading-tight text-foreground md:text-[2.6rem] md:leading-[1.2]">
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-4 text-base leading-8 text-muted-foreground">{description}</p>
      )}
    </Reveal>
  );
}
