import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type PrimaryButtonProps = ComponentProps<typeof Button>;

export default function PrimaryButton({ className, children, ...props }: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        "isolate bg-[#A9081C] text-white rounded-none px-6 py-2  transition-all duration-300 cursor-pointer relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:right-0 after:-z-10 after:h-full after:bg-[#BA3949] after:w-0  after:content-[''] hover:after:w-[75%] after:transition-all after:duration-300 after:ease-in-out after:origin-center after:skew-x-45 overflow-hidden hover:bg-[#A9081C]",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
