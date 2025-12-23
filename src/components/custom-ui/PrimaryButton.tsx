import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type PrimaryButtonProps = Omit<ComponentProps<typeof Button>, "variant"> & {
  variant?: "default" | "gradient";
};

export default function PrimaryButton({
  className,
  children,
  variant = "default",
  ...props
}: PrimaryButtonProps) {
  const baseStyles =
    "isolate text-white rounded-none px-6 py-2 transition-all duration-300 cursor-pointer relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:right-0 after:-z-10 after:h-full after:w-0 after:content-[''] hover:after:w-[75%] after:transition-all after:duration-300 after:ease-in-out after:origin-center after:skew-x-45 overflow-hidden";

  const variantStyles = {
    default: "bg-[#3871C1] after:bg-[#4c7fc7] hover:bg-[#3871C1]",
    gradient:
      "bg-gradient-to-b from-[#7ED957] to-[#3871C1] after:bg-[#5cbf45] hover:from-[#7ED957] hover:to-[#3871C1]",
  };

  return (
    <Button
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Button>
  );
}
