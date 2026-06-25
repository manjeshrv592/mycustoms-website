/**
 * Studio root layout.
 *
 * Sanity Studio is a separate root layout (the public site provides its own
 * under [lang]). The Studio UI is English, so the document language is "en".
 * It excludes the website's Header and Navigation.
 */

import "../globals.css";
import { fontVariables } from "@/lib/fonts";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fontVariables} antialiased`}>{children}</body>
    </html>
  );
}
