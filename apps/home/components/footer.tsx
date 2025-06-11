/* ==========================================================================*/
// footer.tsx — Application footer component
/* ==========================================================================*/
// Purpose: Renders footer with copyright and contact links
// Sections: Imports, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---------------------------------------------------------------
import React from "react";

// Next.js core -------------------------------------------------------------
import Link from "next/link";
import Image from "next/image";

// External Packages --------------------------------------------------------
import { Mail } from "lucide-react";

// Local Modules ------------------------------------------------------------
import { footer } from "@/constants";
import { Button } from "@workspace/ui/components/button";

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * Footer
 *
 * Renders application footer with copyright and contact information.
 * Includes mail and LinkedIn links with responsive layout.
 */
function Footer() {
  return (
    <footer className="w-full bg-inherit pb-6 sm:pb-8">
      <div className="w-full px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{footer.copyright}</p>

        <div className="flex items-center gap-3">
          <Button variant="link" size="sm" className="h-8 hover:opacity-80 transition-opacity duration-200">
            <Link href="/contact-us" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{footer.contact}</span>
            </Link>
          </Button>
          <button className="p-2 focus:outline-none hover:opacity-80 transition-opacity duration-200">
            <Link href="https://www.linkedin.com/company/buildwithastral/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground">
              <Image 
                src="/linkedin-svg.svg" 
                alt={footer.linkedin}
                width={24}
                height={24}
                className="h-6 w-6 text-muted-foreground"
              />
              <span className="sr-only">{footer.linkedin}</span>
            </Link>
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { Footer };
export default Footer;
