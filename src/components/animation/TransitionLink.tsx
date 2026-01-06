"use client";

import { Link as ViewTransitionsLink } from "next-view-transitions";
import { useNavigation } from "@/context/NavigationContext";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Custom Link that sets navigation direction before transitioning
 * Used with View Transitions API for directional animations
 */
export default function TransitionLink({
  href,
  children,
  className,
}: TransitionLinkProps) {
  const { setNavigationDirection } = useNavigation();

  const handleClick = () => {
    setNavigationDirection(href);
  };

  return (
    <ViewTransitionsLink
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </ViewTransitionsLink>
  );
}
