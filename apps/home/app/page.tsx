/* ==========================================================================*/
// page.tsx — Home page with hero section
/* ==========================================================================*/
// Purpose: Main landing page with hero section and additional components
// Sections: Imports, Component, Exports
/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// External Packages ---
import { Button } from "@workspace/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Local Components ---
import { Hero } from "@/components/hero";

import { LogoCloud10 } from "@/components/enterprise-logos";
/* ==========================================================================*/
// Home Page Component
/* ==========================================================================*/

/**
 * Page
 *
 * Main home page with hero section and supporting components.
 */
export default function Page() {
  return (
    <div className="w-full fixed top-0 left-0">
      <Hero />
      {/* <LogoCloud10 /> */}
      {/* Additional sections can be added here */}
    </div>
  );
}
