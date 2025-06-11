/* ==========================================================================*/
// OrganizationBillingOption.tsx — Interactive billing option selector
/* ==========================================================================*/
// Purpose: Renders an interactive option card with hover animations and selection
// Sections: Imports, Animation Variants, Types, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { useState } from "react";

// External Packages -----
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

/**
 * Modular animation variants for billing option interactions
 */
const animations = {
  // Option container hover animation
  optionContainer: {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },

  // Icon container animation states
  iconContainerHovered: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  iconContainerDefault: {
    scale: 1,
    transition: { duration: 0.2 },
  },

  // Arrow entrance animation states
  arrowVisible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  arrowHidden: {
    opacity: 0,
    x: -10,
    scale: 0.9,
    transition: { duration: 0.2, ease: "easeInOut" },
  },

  // Reduced motion variants (accessibility)
  reducedMotion: {
    optionContainer: {
      whileHover: {},
      whileTap: {},
      transition: {},
    },
    iconContainerHovered: {
      transition: { duration: 0.1 },
    },
    iconContainerDefault: {
      transition: { duration: 0.1 },
    },
    arrowVisible: {
      opacity: 1,
      transition: { duration: 0.1 },
    },
    arrowHidden: {
      opacity: 0,
      transition: { duration: 0.1 },
    },
  },
};

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface BillingOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tabValue: string;
  onSelectTab: (tab: string) => void;
}

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * OrganizationBillingOption
 * 
 * Interactive billing option card with hover animations and selection functionality
 * 
 * @param icon - React icon component to display
 * @param title - Option title text
 * @param description - Option description text
 * @param tabValue - Value to pass when option is selected
 * @param onSelectTab - Callback function when option is clicked
 */
function BillingOption({ 
  icon, 
  title, 
  description, 
  tabValue, 
  onSelectTab 
}: BillingOptionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Select animation variants based on motion preference
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  const handleClick = () => {
    onSelectTab(tabValue);
  };

  return (
    <motion.div 
      className="flex items-center gap-3 py-2 rounded-lg cursor-pointer" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      {...selectedAnimations.optionContainer}
    >
      {/* Icon Container --- */}
      <motion.div
        className={`p-3 rounded-md border transition-colors duration-200 ${
          isHovered 
            ? "border-primary" 
            : "border-platform-accent-900"
        }`}
        animate={isHovered 
          ? selectedAnimations.iconContainerHovered 
          : selectedAnimations.iconContainerDefault
        }
      >
        {icon}
      </motion.div>

      {/* Content Container --- */}
      <div className="flex flex-col gap-0.5 pl-1 relative flex-1">
        <div className="flex items-center">
          <motion.h3
            className={`font-medium transition-colors duration-200 ${
              isHovered ? "text-primary" : ""
            }`}
          >
            {title}
          </motion.h3>
          
          {/* Arrow Icon --- */}
          <motion.div
            className="ml-2"
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={isHovered 
              ? selectedAnimations.arrowVisible 
              : selectedAnimations.arrowHidden
            }
          >
            <ArrowRight className="h-3.5 w-3.5 text-gray-900 dark:text-gray-100" />
          </motion.div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 truncate">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { BillingOption }; 