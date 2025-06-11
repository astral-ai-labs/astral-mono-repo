"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "motion/react";

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * ModeToggle
 *
 * Day-to-night themed toggle with celestial transition animations.
 * Sun sets while moon rises, creating a natural day/night cycle effect.
 */
export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  
  // Ensure component is mounted on client to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Animation variants based on reduced motion preference
  const sunVariants = shouldReduceMotion
    ? {
        // Reduced motion: simple opacity
        day: { opacity: 1 },
        night: { opacity: 0 }
      }
    : {
        // Full motion: sun setting animation
        day: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotate: 0,
          transition: { duration: 0.3, ease: "easeInOut" }
        },
        night: { 
          opacity: 0, 
          y: 8, 
          scale: 0.8,
          rotate: 45,
          transition: { duration: 0.3, ease: "easeInOut" }
        }
      };

  const moonVariants = shouldReduceMotion
    ? {
        // Reduced motion: simple opacity
        day: { opacity: 0 },
        night: { opacity: 1 }
      }
    : {
        // Full motion: moon rising animation
        day: { 
          opacity: 0, 
          y: -8, 
          scale: 0.7,
          rotate: -30,
          transition: { duration: 0.3, ease: "easeInOut" }
        },
        night: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotate: 0,
          transition: { duration: 0.3, ease: "easeInOut" }
        }
      };

  // Container animation props - stronger hover effect
  const containerAnimationProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 }
      };

  // Use resolvedTheme to get actual theme (light/dark) even when theme is "system"
  const isDark = resolvedTheme === "dark";

  // Render static version during SSR/hydration to prevent mismatch
  // Don't show anything until we have the resolved theme
  if (!mounted || resolvedTheme === undefined) {
    return (
      <div
        className="relative flex h-4.5 w-4.5 cursor-pointer items-center justify-center opacity-0"
        role="button"
        tabIndex={0}
        aria-label="Toggle theme"
        title="Toggle between day and night"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle between day and night theme</span>
      </div>
    );
  }

  return (
    <motion.div
      onClick={toggleTheme}
      className="relative flex h-4.5 w-4.5 cursor-pointer items-center justify-center focus-visible:outline-none"
      {...containerAnimationProps}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label="Toggle theme"
      title="Toggle between day and night"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleTheme();
        }
      }}
      suppressHydrationWarning
    >
      {/* Sun Icon - Sets during night */}
      <motion.div
        className="absolute"
        variants={sunVariants}
        animate={isDark ? "night" : "day"}
        initial={false}
        suppressHydrationWarning
      >
        <Sun className={`h-4 w-4 transition-colors duration-200 ${
          isHovered || isDark ? 'text-amber-500' : ''
        }`} />
      </motion.div>

      {/* Moon Icon - Rises during night */}
      <motion.div
        className="absolute"
        variants={moonVariants}
        animate={isDark ? "night" : "day"}
        initial={false}
        suppressHydrationWarning
      >
        <Moon className={`h-4 w-4 transition-colors duration-200 ${
          isHovered || isDark ? 'text-slate-300' : ''
        }`} />
      </motion.div>

      <span className="sr-only">Toggle between day and night theme</span>
    </motion.div>
  );
}

/* ==========================================================================*/
// Exports
/* ==========================================================================*/

