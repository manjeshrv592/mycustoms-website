import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type PrimaryTextareaProps = ComponentProps<typeof Textarea>;

export default function PrimaryTextarea({
  className,
  ...props
}: PrimaryTextareaProps) {
  return (
    <Textarea
      className={cn(
        "bg-transparent rounded-lg border-0 border-b border-white resize-none",
        className
      )}
      {...props}
    />
  );
}
