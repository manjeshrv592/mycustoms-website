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
        "bg-transparent rounded-lg border-0 border-b border-white resize-none min-h-0 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
}
