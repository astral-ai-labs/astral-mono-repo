/* ==========================================================================*/
// audience-toggle.tsx — Audience toggle button component
/* ==========================================================================*/
// Purpose: Interactive button for toggling between builders and enterprise
// Sections: Imports, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// External Packages ---
import { motion, useReducedMotion } from "motion/react";

// UI Components ---
import { TextMorph } from "@workspace/ui/components/text-morph";

// Local Components ---
import { useAudience } from "../providers/audience-provider";

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * AudienceToggle
 *
 * Interactive button that morphs between "For Builders" and "For Companies".
 * Features hover animations and integrates with audience context.
 */
function AudienceToggle() {
  const { currentAudience, setCurrentAudience } = useAudience();
  const shouldReduceMotion = useReducedMotion();
  
  const text = currentAudience === 'builders' ? 'For Builders' : 'For Companies';

  // Hover animation props - conditionally applied
  const hoverAnimationProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { scale: 1.015 },
        whileTap: { scale: 0.985 },
        transition: { duration: 0.1, ease: "easeInOut" },
      };

  const handleToggle = () => {
    setCurrentAudience(currentAudience === 'builders' ? 'enterprise' : 'builders');
  };

  // Conditional styling based on audience
  const baseClasses = 'relative rounded-full px-6 py-1 text-sm/6 font-semibold cursor-pointer';
  const audienceClasses = currentAudience === 'builders' 
    ? 'text-zinc-600 ring-1 ring-zinc-900/10 hover:ring-zinc-900/20 dark:text-zinc-400 dark:ring-1 dark:ring-zinc-100/20 dark:hover:ring-zinc-100/20'
    : 'text-white bg-zinc-900 ring-1 ring-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:ring-zinc-100 dark:hover:bg-zinc-200';

  return (
    <motion.button
      onClick={handleToggle}
      className={`${baseClasses} ${audienceClasses}`}
      {...hoverAnimationProps}
    >
      <TextMorph>{text}</TextMorph>
    </motion.button>
  );
}

/* ==========================================================================*/
// Exports
/* ==========================================================================*/

export { AudienceToggle }; 