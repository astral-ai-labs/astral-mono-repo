/* ==========================================================================*/
// providers.tsx — Application providers wrapper component
/* ==========================================================================*/
// Purpose: Wraps the application with necessary providers for theming and analytics
// Sections: Imports, Providers Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { ReactNode, useEffect } from "react";

// External Packages ----
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Tailwind Observer ----
import { Observer } from "tailwindcss-intersect";

// Audience Provider ----
import { AudienceProvider } from "./audience-provider";

/* ==========================================================================*/
// Providers Component
/* ==========================================================================*/
/**
 * Providers component for the application
 *
 * @param children - React children to render within the providers
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    Observer.start();
  }, []);

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme>
      {/* Start of Audience Provider -------------------------------------------- */}
      <AudienceProvider>{children}</AudienceProvider>
      {/* End of Audience Provider ---------------------------------------------- */}

      {/* Analytics ------------------------------------------------------------ */}
      <Analytics />

      {/* Speed Insights ------------------------------------------------------- */}
      <SpeedInsights />
    </NextThemesProvider>
  );
}
