import { Orbitron, Poppins } from "next/font/google";
import localFont from "next/font/local";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
  preload: false,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  preload: false,
});

const aptos = localFont({
  src: [
    {
      path: "../../public/fonts/Aptos.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Aptos-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Aptos-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-aptos",
  preload: false,
});

const grift = localFont({
  src: [
    {
      path: "../../public/fonts/grift-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/grift-bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/grift-light.ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-grift",
  preload: false,
});

/**
 * Combined font CSS-variable classes applied to <body>.
 * Shared across the site ([lang]) and Studio root layouts.
 */
export const fontVariables = `${aptos.variable} ${orbitron.variable} ${poppins.variable} ${grift.variable}`;
