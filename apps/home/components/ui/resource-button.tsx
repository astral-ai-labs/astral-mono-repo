/* ==========================================================================*/
// resource-button.tsx — Interactive button for resource actions
/* ==========================================================================*/
// Purpose: Reusable button component with motion animations for resource pages
// Sections: Imports, Types, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React Core ----
"use client";
import React from "react";

// External Packages ----
import { motion, useReducedMotion } from "motion/react";

/* ==========================================================================*/
// Types
/* ==========================================================================*/

interface ResourceButtonProps {
  text: string;
  className?: string;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * ResourceButton
 * 
 * Interactive button with motion animations that copies current URL to clipboard.
 * 
 * @param text - Button text to display
 * @param className - Optional additional CSS classes
 */
function ResourceButton({ text, className = "" }: ResourceButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  // Motion animation props - conditionally applied based on user preference
  const hoverAnimationProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.1, ease: "easeInOut" },
      };

  /**
   * handleCopyLink
   * 
   * Copies the current page URL to clipboard.
   */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Could add toast notification here in the future
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <motion.button
      {...hoverAnimationProps}
      onClick={handleCopyLink}
      className={`text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${className}`}
    >
      {text}
    </motion.button>
  );
}

/* ==========================================================================*/
// Public API Exports
/* ==========================================================================*/

export { ResourceButton }; 