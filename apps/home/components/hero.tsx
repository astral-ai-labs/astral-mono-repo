/* ==========================================================================*/
// hero.tsx — Hero section component with animated text and CTAs
/* ==========================================================================*/
// Purpose: Main hero section with animated text effects and call-to-action buttons
// Sections: Imports, Animation Variants, Props, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React, { useState, useEffect } from "react";
import Link from "next/link";

// External Packages ---
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

// UI Components ---

// Local Components ---
import { TextEffect } from "@workspace/ui/components/text-effect";
import { AudienceToggle } from "./ui/audience-toggle";
import { useAudience } from "./providers/audience-provider";

// Local Constants ---
import { heroConstants } from "@/constants";

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

const ENTRY_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

const FLIP_VARIANTS = {
  initial: {
    rotateX: 45,
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    rotateX: 0,
    opacity: 1,
    scale: 1,
  },
  exit: {
    rotateX: -45,
    opacity: 0,
    scale: 0.95,
  },
};

const ARROW_HOVER_VARIANTS = {
  initial: { x: 0 },
  hover: { x: 2 }
};

const ANIMATION_TRANSITIONS = {
  toggle: {
    duration: 0.5,
    delay: 0.3,
    ease: "easeOut",
  },
  primaryCta: {
    duration: 0.5,
    delay: 0.5,
    ease: "easeOut",
  },
  secondaryCta: {
    duration: 0.5,
    delay: 0.6,
    ease: "easeOut",
  },
  flip: {
    duration: 0.6,
    ease: [0.4, 0.0, 0.2, 1],
  },
};

const TEXT_EFFECT_CONFIG = {
  title: {
    preset: "fade-in-blur" as const,
    speedReveal: 4,
    segmentTransition: { duration: 0.5, ease: "easeOut" },
  },
  subtitle: {
    preset: "fade" as const,
    delay: 0.85,
    speedReveal: 1.7,
    speedSegment: 0.2,
    segmentTransition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface HeroProps {
  className?: string;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * Hero
 *
 * Main hero section with animated text effects and call-to-action buttons.
 * Features fade-in animations and blur effects for enhanced visual appeal.
 * Now includes audience toggle for switching between builder and enterprise views.
 */
function Hero({ className }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const { constants, currentAudience } = useAudience();
  
  // Track which audiences have been animated
  const [animatedAudiences, setAnimatedAudiences] = useState<Set<string>>(new Set());
  
  // When audience changes, check if we should animate
  useEffect(() => {
    setAnimatedAudiences(prev => new Set(prev).add(currentAudience));
  }, [currentAudience]);
  
  // Determine if this audience should animate (first time seeing it)
  const shouldAnimate = !animatedAudiences.has(currentAudience);
  
  // Use unique keys only when we want animation, otherwise use content-based keys
  const titleKey = shouldAnimate ? `title-animate-${currentAudience}` : `title-${constants.cta.title}`;
  const subtitleKey = shouldAnimate ? `subtitle-animate-${currentAudience}` : `subtitle-${constants.cta.subtitle}`;

  // Hover animation props for secondary button
  const hoverAnimationProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { scale: 1.035 },
        whileTap: { scale: 0.95 },
        transition: { duration: 0.1, ease: "easeInOut" },
      };

  return (
    <div className={`relative bg-white dark:bg-zinc-900 ${className || ""}`}>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-full lg:max-w-4xl xl:max-w-5xl py-50 sm:py-40">
          {/* Audience Toggle --- */}
          <div className="mb-8 flex justify-center">
            <motion.div
              variants={ENTRY_VARIANTS}
              initial="hidden"
              animate="visible"
              transition={ANIMATION_TRANSITIONS.toggle}
            >
              <AudienceToggle />
            </motion.div>
          </div>

          {/* Main Content --- */}
          <div className="text-center">
            <TextEffect 
              className="text-[40px] text-balance sm:text-5xl md:text-7xl xl:text-[84px] tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight sm:leading-tight" 
              preset={TEXT_EFFECT_CONFIG.title.preset} 
              as="h1" 
              per="char" 
              speedReveal={TEXT_EFFECT_CONFIG.title.speedReveal} 
              segmentTransition={TEXT_EFFECT_CONFIG.title.segmentTransition}
              key={titleKey}
            >
              {constants.cta.title}
            </TextEffect>

            <TextEffect 
              className="mt-6 sm:mt-8 text-pretty text-base sm:text-lg md:text-xl text-zinc-500 dark:text-zinc-300 leading-relaxed px-4 sm:px-0" 
              preset={TEXT_EFFECT_CONFIG.subtitle.preset} 
              as="p" 
              per="char" 
              delay={TEXT_EFFECT_CONFIG.subtitle.delay} 
              speedReveal={TEXT_EFFECT_CONFIG.subtitle.speedReveal} 
              segmentTransition={TEXT_EFFECT_CONFIG.subtitle.segmentTransition}
              key={subtitleKey}
            >
              {constants.cta.subtitle}
            </TextEffect>

            {/* Call to Action Buttons --- */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {/* <motion.a 
                href={constants.cta.primary.href} 
                className="rounded-md bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-700" 
                variants={ENTRY_VARIANTS} 
                initial="hidden" 
                animate="visible" 
                transition={ANIMATION_TRANSITIONS.primaryCta}
              >
                <motion.span
                  key={`primary-${currentAudience}`}
                  variants={FLIP_VARIANTS}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={ANIMATION_TRANSITIONS.flip}
                  style={{ transformOrigin: "50% 50%" }}
                >
                  {constants.cta.primary.text}
                </motion.span>
              </motion.a> */}
              <motion.a 
                href={constants.cta.secondary.href} 
                className="inline-flex items-center gap-1 text-sm/6 font-semibold text-zinc-900 dark:text-zinc-200" 
                variants={ENTRY_VARIANTS} 
                initial="hidden" 
                animate="visible" 
                transition={ANIMATION_TRANSITIONS.secondaryCta}
                {...hoverAnimationProps}
                whileHover="hover"
              >
                <motion.span
                  key={`secondary-${currentAudience}`}
                  variants={FLIP_VARIANTS}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={ANIMATION_TRANSITIONS.flip}
                  style={{ transformOrigin: "50% 50%" }}
                >
                  {constants.cta.secondary.text}
                </motion.span>
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
                  <ArrowRight className="h-4 w-4 ml-2" />
                </motion.div>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================*/
// Exports
/* ==========================================================================*/

export { Hero };
