import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n";

/**
 * Root page redirects to default locale
 * This ensures users always have a locale in the URL
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
