/* ==========================================================================*/
// layout.tsx — Root layout for the home application
/* ==========================================================================*/
// Purpose: Defines the root layout structure with fonts and providers
// Sections: Imports, Fonts, Metadata, Layout Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { Metadata } from "next";

// External Packages ----
import { Geist, Geist_Mono, Manrope } from "next/font/google";

// Local Files ----
import "./styles.css";
import { AstralMetadata } from "@workspace/ui/constants/metadata";
import { Providers } from "@/components/providers";

// Platform Components ---
import { PlatformNavbar } from "@/components/header";
import { HeaderCollapseProvider } from "@/hooks/useHeaderCollapse";

/* ==========================================================================*/
// Fonts
/* ==========================================================================*/
const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontManrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

/* ==========================================================================*/
// Metadata
/* ==========================================================================*/
export const metadata: Metadata = AstralMetadata;

/* ==========================================================================*/
// Layout Component
/* ==========================================================================*/
/**
 * Root layout component for the application
 *
 * @param children - React children to render within the layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} ${fontManrope.variable} antialiased h-screen fixed inset-0`}>
        <Providers>
          <HeaderCollapseProvider>
            <div className="h-full flex flex-col">
              <PlatformNavbar />
              <div className="flex-1 overflow-hidden">
                {children}
              </div>
            </div>
          </HeaderCollapseProvider>
        </Providers>
      </body>
    </html>
  );
}
