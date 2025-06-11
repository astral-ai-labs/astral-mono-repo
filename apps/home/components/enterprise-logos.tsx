/* ==========================================================================*/
// enterprise-logos.tsx — Enterprise showcase with logos and metrics for investors
/* ==========================================================================*/
// Purpose: Displays enterprise clients and key metrics with animations for fundraising context
// Sections: Imports, Animation Variants, Constants, Components, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { useRef, useEffect, useState } from "react";

// External Packages ---
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";

// UI Components ---
import { AnimatedNumber } from "@workspace/ui/components/animated-number";

// Local Components ---
import { OneMind } from "./logos/onemind";

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

const SECTION_VARIANTS = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const LOGO_VARIANTS = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    filter: "blur(4px)",
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
};

const HOVER_VARIANTS = {
  initial: { 
    opacity: 0.8 
  },
  hover: { 
    opacity: 0.4,
    transition: { duration: 0.3 }
  },
};

const OVERLAY_VARIANTS = {
  initial: { 
    backdropFilter: "blur(0px)" 
  },
  hover: { 
    backdropFilter: "blur(2px)",
    transition: { duration: 0.2 }
  },
};

const TEXT_VARIANTS = {
  initial: { 
    y: 10, 
    scale: 0.95, 
    opacity: 0 
  },
  hover: { 
    y: 0, 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
};

/* ==========================================================================*/
// Constants
/* ==========================================================================*/

const CLIENTS = [
  { name: "OneMind", icon: OneMind },
  { name: "OneMind", icon: OneMind },
  { name: "OneMind", icon: OneMind },
];

const IN_VIEW_OPTIONS = {
  amount: 0.3,
  once: true,
} as const;

/* ==========================================================================*/
// Individual Logo Component
/* ==========================================================================*/

function ClientLogo({ client, index }: { client: typeof CLIENTS[0], index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, IN_VIEW_OPTIONS);

  return (
    <motion.div 
      ref={ref}
      className="group relative h-32"
      // variants={LOGO_VARIANTS}
      // initial="hidden"
      // animate={isInView ? "visible" : "hidden"}
      // transition={{ delay: index * 0.1 }}
    >
      <motion.div 
        className="absolute inset-0 flex items-center justify-center rounded-sm bg-zinc-50 dark:bg-zinc-900 p-2 text-center transition-all duration-200" 
        // variants={HOVER_VARIANTS}
      >
        <client.icon className="h-auto w-20 text-zinc-900 dark:text-white" />
      </motion.div>
    </motion.div>
  );
}

/* ==========================================================================*/
// Animated Metric Component
/* ==========================================================================*/

function AnimatedMetric({ value, label, delay = 0 }: { value: number, label: string, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, IN_VIEW_OPTIONS);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  return (
    <motion.span 
      ref={ref}
      className="inline-block font-semibold text-zinc-900 dark:text-zinc-100"
      variants={SECTION_VARIANTS}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <AnimatedNumber
        value={animatedValue}
        springOptions={{ bounce: 0, duration: 2000 }}
      />
      {label}
    </motion.span>
  );
}

/* ==========================================================================*/
// Section Header Component
/* ==========================================================================*/

function SectionHeader() {
  const ref = useRef(null);
  const isInView = useInView(ref, IN_VIEW_OPTIONS);

  return (
    <motion.div 
      ref={ref}
      className="mb-16"
      variants={SECTION_VARIANTS}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column - Text Content */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-6">
            Trusted by Industry Leaders
          </div>
          <h2 className="text-4xl text-balance sm:text-5xl md:text-6xl tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">
            Powering the Future of Enterprise
          </h2>
          <p className="text-pretty text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0 mb-4">
            Join <AnimatedMetric value={350} label="+" delay={800} /> forward-thinking companies who trust us to deliver 
            exceptional results. We've generated over <AnimatedMetric value={2.4} label="M" delay={1200} /> in annual revenue 
            for our clients while driving their digital transformation.
          </p>
        </div>

        {/* Right Column - Client Logos */}
        <div className="flex justify-center lg:justify-end">
          <motion.a 
            className="group relative grid grid-cols-2 gap-4 sm:grid-cols-3" 
            href="#" 
            whileHover="hover" 
            initial="initial"
          >
            {CLIENTS.map((client, index) => (
              <ClientLogo key={index} client={client} index={index} />
            ))}
            
            {/* Overlay with backdrop blur */}
            <motion.div 
              className="absolute inset-0 rounded-lg"
              variants={OVERLAY_VARIANTS}
            />
            
            {/* Case study CTA */}
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="inline-flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-200 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700"
                variants={TEXT_VARIANTS}
              >
                <span>View case studies</span>
                <ArrowRight className="ml-2" size={16} />
              </motion.div>
            </motion.div>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * LogoCloud10
 *
 * Enterprise showcase section featuring client logos and key business metrics.
 * Designed for investor presentations and fundraising contexts.
 */
export function LogoCloud10() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header with Two-Column Layout */}
        <SectionHeader />
      </div>
    </div>
  );
}
