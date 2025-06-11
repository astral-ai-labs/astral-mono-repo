/* ==========================================================================*/
// toggle-audience.tsx — Audience toggle switch component                      
/* ==========================================================================*/
// Purpose: Interactive switch for toggling between builders and enterprise    
// Sections: Imports, Animation Variants, Props Interface, Component, Exports                      

"use client";

// External Packages ---
import { motion, useReducedMotion } from "motion/react";

// UI Components ---
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

/**
 * Refined animation variants for the audience toggle with accessibility support
 */
const animations = {
  // Container with glass morphism effect
  container: {
    initial: {
      opacity: 0,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      scale: 1,
    },
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },

  // Tab trigger hover/tap interactions
  trigger: {
    whileHover: {
      scale: 1.02,
    },
    whileTap: {
      scale: 0.98,
    },
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },

  // Reduced motion variants
  reducedMotion: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0 },
    },
    trigger: {
      whileHover: {},
      whileTap: {},
      transition: { duration: 0 },
    },
  },
};

/* ==========================================================================*/
// Props Interface                                                              
/* ==========================================================================*/

interface ToggleAudienceProps {
  currentAudience: "builders" | "enterprise";
  setCurrentAudience: (audience: "builders" | "enterprise") => void;
}

/* ==========================================================================*/
// Toggle Audience Component                                                    
/* ==========================================================================*/

/**
 * ToggleAudience
 * 
 * Apple-inspired segmented control built on shadcn tabs with Motion React animations.
 * Features smooth transitions and accessibility support.
 */
function ToggleAudience({ currentAudience, setCurrentAudience }: ToggleAudienceProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Select animation variants based on motion preference
  const containerVariants = shouldReduceMotion ? animations.reducedMotion.container : animations.container;
  const triggerVariants = shouldReduceMotion ? animations.reducedMotion.trigger : animations.trigger;

  const handleValueChange = (value: string) => {
    setCurrentAudience(value as "builders" | "enterprise");
  };

  return (
    <motion.div 
      className="flex items-start"
      {...containerVariants}
    >
      <Tabs 
        value={currentAudience} 
        onValueChange={handleValueChange}
        className="w-auto"
      >
        <TabsList className="
          relative p-0 lg:px-2
          bg-white/5 backdrop-blur-sm 
          border border-white/10 
          rounded-full
          hover:bg-white/8 hover:border-white/20
          transition-all duration-300 ease-out
        ">
          <motion.div
            className="absolute inset-y-1 rounded-full bg-white shadow-sm"
            initial={false}
            animate={{
              x: currentAudience === "builders" ? 4 : "calc(100% - 4px)",
              width: "50%"
            }}
            transition={
              shouldReduceMotion 
                ? { duration: 0 }
                : { 
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                  }
            }
            style={{ left: 0 }}
          />
          
          <TabsTrigger 
            value="builders"
            asChild
          >
            <motion.button
              className={cn(
                "relative z-20 px-5 py-2 min-w-[110px]",
                "text-sm font-medium rounded-full",
                "data-[state=active]:!text-black data-[state=active]:!bg-transparent",
                "data-[state=inactive]:text-white/70 data-[state=inactive]:bg-transparent",
                "hover:data-[state=inactive]:text-white/90",
                "transition-colors duration-200 ease-out",
                "focus:outline-none", "!border-none"
              )}
              {...triggerVariants}
            >
              For Builders
            </motion.button>
          </TabsTrigger>
          
          <TabsTrigger 
            value="enterprise"
            asChild
          >
            <motion.button
              className={cn(
                "relative z-20 px-5 py-2 min-w-[110px]",
                "text-sm font-medium rounded-full",
                "data-[state=active]:!text-black data-[state=active]:!bg-transparent",
                "data-[state=inactive]:text-white/70 data-[state=inactive]:bg-transparent",
                "hover:data-[state=inactive]:text-white/90",
                "transition-colors duration-200 ease-out",
                "focus:outline-none", "border-none"
              )}
              {...triggerVariants}
            >
              For Companies
            </motion.button>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </motion.div>
  );
}

/* ==========================================================================*/
// Public Component Exports                                                    
/* ==========================================================================*/

export { ToggleAudience }; 