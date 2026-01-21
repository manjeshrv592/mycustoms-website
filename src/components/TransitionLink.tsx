"use client";

import { Link } from "next-view-transitions";
import { useNavigation } from "@/context/NavigationContext";

interface TransitionLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

/**
 * Custom Link component that triggers View Transitions with direction tracking
 * Used for navigation between pages with sliding animations
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
        <Link href={href} className={className} onClick={handleClick}>
            {children}
        </Link>
    );
}
