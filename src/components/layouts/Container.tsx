import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "mx-auto w-full px-2 md:px-5 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[calc(100%-12rem)] 2xl:max-w-[1320px]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
