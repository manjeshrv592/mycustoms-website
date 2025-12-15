import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type PrimaryInputProps = ComponentProps<typeof Input>;

export default function PrimaryInput({
  className,
  ...props
}: PrimaryInputProps) {
  return (
    <Input
      className={cn(
        "bg-transparent rounded-lg border-0 border-b border-white",
        className
      )}
      {...props}
    />
  );
}
