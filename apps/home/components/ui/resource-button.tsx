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
import React, { useState, useRef } from "react";

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
 * Shows a smooth flip animation to "Copied!" state with check icon.
 * 
 * @param text - Button text to display
 * @param className - Optional additional CSS classes
 */
function ResourceButton({ text, className = "" }: ResourceButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check for reduced motion preference
  let shouldReduceMotion = false;
  try {
    shouldReduceMotion = useReducedMotion() || false;
  } catch {
    shouldReduceMotion = false;
  }

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
   * Copies the current page URL to clipboard and shows success animation.
   */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Show copied state
      setIsCopied(true);
      
      // Reset after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.button
      {...hoverAnimationProps}
      onClick={handleCopyLink}
      className={`text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center ${className}`}
    >
      <motion.span
        key={isCopied ? "copied" : "default"}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: 90, opacity: 0 }}
        transition={{ 
          duration: shouldReduceMotion ? 0 : 0.3, 
          ease: "easeInOut" 
        }}
        style={{ 
          display: "inline-block",
          transformStyle: "preserve-3d"
        }}
      >
        {isCopied ? (
          <span className="flex items-center gap-1">
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            Copied!
          </span>
        ) : (
          text
        )}
      </motion.span>
    </motion.button>
  );
}

/* ==========================================================================*/
// Public API Exports
/* ==========================================================================*/

export { ResourceButton }; 