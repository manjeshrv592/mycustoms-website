import Image from "next/image";

interface ResourcesLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared layout for all resources pages
 * Contains the background image and gradients that should persist across navigation
 */
export default function ResourcesLayout({ children }: ResourcesLayoutProps) {
  return (
    <section className="h-screen relative pt-[10vh] pb-2 md:py-[12vh]">
      <Image
        src="/images/resources-bg.jpg"
        alt="Resources background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.8)_0%,rgba(0,0,0,.8)_100%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3871C1_0%,#000000_20%)] opacity-50"></div>
      <div className="relative z-20 h-full">{children}</div>
    </section>
  );
}
