"use client";
/* ==========================================================================*/
// navbar.tsx — Builders Navbar
/* ==========================================================================*/
// Purpose: Top-level navigation for builders pages. Handles auth state
// Sections: Imports, Animation Variants, Components, Helpers, Exports
/* ==========================================================================*/

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---------------------------------------------------------------
import { usePathname } from "next/navigation";

// Next.js core -------------------------------------------------------------
import Image from "next/image";
import Link from "next/link";

// External packages --------------------------------------------------------
import { ArrowRight, Menu } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

// Constants ---------------------------------------------------------------
import { builderConstants, enterpriseConstants } from "@/constants";

// Local Components --------------------------------------------------------
import { AstralFull } from "./logos/astral-full";
import { AstralIcon } from "./logos/astral-icon";

// Motion Primitives ---------------------------------------------------------

// shadcn/ui ----------------------------------------------------------------
import { Button } from "@workspace/ui/components/button";
import { ModeToggle } from "./ui/theme-toggle";
import { Separator } from "@workspace/ui/components/separator";

/* ==========================================================================*/
// Large Screen Navbar Component
/* ==========================================================================*/

/**
 * LargeScreenNavbar
 *
 * Full-featured navbar component for larger screens.
 * Shows navigation links and auth actions with subtle hover animations.
 */
function LargeScreenNavbar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const TABS = builderConstants.navbar.navigation;

  // Hover animation props - conditionally applied
  const hoverAnimationProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { scale: 1.035 },
        whileTap: { scale: 0.95 },
        transition: { duration: 0.1, ease: "easeInOut" },
      };

  const logoHoverAnimationProps = shouldReduceMotion
      ? {}
      : {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: { duration: 0.1, ease: "easeInOut" },
        };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between px-5 py-3 lg:px-6 lg:py-5">
        <div className="flex flex-1">
          <motion.div {...logoHoverAnimationProps}>
            <Link href="/" className="relative rounded-sm px-2 py-1 lg:px-0 lg:py-0 flex items-center hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hover:bg-transparent lg:dark:hover:bg-transparent transition-colors">
              <span className="sr-only">Astral</span>

              {/* Full Logo - Large screens and up */}
              <AstralFull className="hidden lg:block h-[16px] xl:h-[17px] w-auto" />

              {/* Icon Only - Medium screens and below */}
              <AstralIcon className="lg:hidden h-5 w-auto" />
            </Link>
          </motion.div>
        </div>
        <div className="flex gap-x-8 md:gap-x-12">
          {TABS.map((tab) => (
            <motion.div key={tab.name} {...hoverAnimationProps}>
              <Link href={tab.href} className="text-[13.5px] md:text-sm font-medium text-zinc-900 dark:text-zinc-200" target={tab.external ? "_blank" : undefined} rel={tab.external ? "noopener noreferrer" : undefined}>
                {tab.name}
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-1 justify-end">
          <div className="flex items-center gap-4">
            <ModeToggle />
            {/* <div className="hidden lg:block h-4 w-px bg-zinc-200 dark:bg-zinc-800" /> */}

            {/* <motion.div 
              className="hidden lg:block"
              {...hoverAnimationProps}
              whileHover="hover"
              initial="initial"
            >
              <Link 
                href={builderConstants.navbar.auth.login.href} 
                className="inline-flex items-center gap-1.5 text-[13px] lg:text-sm font-medium text-zinc-900 dark:text-zinc-200"
              >
                {builderConstants.navbar.auth.login.text}
                <motion.div
                  variants={{
                    initial: { x: 0 },
                    hover: { x: shouldReduceMotion ? 0 : 2 }
                  }}
                  transition={{ 
                    duration: 0.1, 
                    ease: "easeOut" 
                  }}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.div>
              </Link>
            </motion.div> */}
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ==========================================================================*/
// Main Navbar Component
/* ==========================================================================*/

/**
 * MainNavbar
 *
 * Main navigation component for the application.
 * Handles responsive behavior between small and large screens.
 */
function MainNavbar() {
  return (
    <>
      <LargeScreenNavbar />
    </>
  );
}

/* ==========================================================================*/
// Exports
/* ==========================================================================*/
export default MainNavbar;
