/* ==========================================================================*/
// faq.tsx — FAQ section component
/* ==========================================================================*/
// Purpose: Displays frequently asked questions with accordion interface and animations
// Sections: Imports, Types, Animation Variants, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---------------------------------------------------------------
import React, { useRef } from "react";

// External Packages --------------------------------------------------------
import { motion, useInView, useReducedMotion } from "motion/react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

// Local Modules ------------------------------------------------------------
import { useAudience } from "@/components/providers/audience-provider";

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface FAQItem {
  question: string;
  answer: string;
}

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

/**
 * Animation variants for FAQ component
 * Includes subtle entrance animations and accordion interactions
 */
const animations = {
  container: {
    initial: { transformPerspective: 1000 },
    animate: { 
      transformPerspective: 1000,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    },
  },

  label: {
    initial: { opacity: 0, y: 15, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  heading: {
    initial: { opacity: 0, y: 25, scale: 1.02 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.05 },
  },

  subtitle: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 },
  },

  faqItem: (index: number, isInView: boolean) => ({
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { 
      opacity: isInView ? 1 : 0, 
      y: isInView ? 0 : 20, 
      scale: isInView ? 1 : 0.98 
    },
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94], 
      delay: 0.2 + index * 0.08 
    },
  }),

  accordionTrigger: {
    whileHover: { scale: 1.005, transition: { duration: 0.2, ease: "easeOut" } },
  },

  // Reduced motion variants
  reducedMotion: {
    container: { initial: {}, animate: {} },
    label: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    heading: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2, delay: 0.05 },
    },
    subtitle: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2, delay: 0.1 },
    },
    faqItem: (index: number, isInView: boolean) => ({
      initial: { opacity: 0 },
      animate: { opacity: isInView ? 1 : 0 },
      transition: { duration: 0.2, delay: 0.1 + index * 0.03 },
    }),
    accordionTrigger: { whileHover: {} },
  },
};

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * FAQ
 *
 * Displays frequently asked questions in accordion format with subtle animations.
 * Content changes based on current audience (builders vs enterprise).
 */
function FAQ() {
  const { currentAudience, constants } = useAudience();
  const shouldReduceMotion = useReducedMotion();

  // Refs for scroll animations
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const accordionRef = useRef(null);

  // useInView hooks for scroll-triggered animations
  const labelInView = useInView(labelRef, { once: true, amount: 0.5 });
  const headingInView = useInView(headingRef, { once: true, amount: 0.5 });
  const subtitleInView = useInView(subtitleRef, { once: true, amount: 0.5 });
  const accordionInView = useInView(accordionRef, { once: true, amount: 0.3 });

  // Select animation variants based on motion preference
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden mx-auto section-spacing">
      <motion.div
        key={currentAudience}
        className="relative py-16 flex justify-center mx-auto max-w-7xl w-full"
        style={{ transformStyle: "preserve-3d" }}
        {...selectedAnimations.container}
      >
        <div className="max-w-3xl w-full px-6">
          {/* Start of Header Section --- */}
          <div className="text-center mb-12">
            <div ref={labelRef} className="flex justify-center mb-6">
              <motion.div 
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-primary-foreground rounded-full bg-primary border border-primary/30"
                initial={selectedAnimations.label.initial}
                animate={labelInView ? selectedAnimations.label.animate : selectedAnimations.label.initial}
                transition={selectedAnimations.label.transition}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="text-[13px] leading-none">Support</span>
              </motion.div>
            </div>

            <motion.h2
              ref={headingRef}
              className="text-[32px] md:text-[42px] font-sans tracking-tight leading-tight text-white mb-3"
              initial={selectedAnimations.heading.initial}
              animate={headingInView ? selectedAnimations.heading.animate : selectedAnimations.heading.initial}
              transition={selectedAnimations.heading.transition}
            >
              {constants.faq.title}
            </motion.h2>

            <motion.p
              ref={subtitleRef}
              className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed"
              initial={selectedAnimations.subtitle.initial}
              animate={subtitleInView ? selectedAnimations.subtitle.animate : selectedAnimations.subtitle.initial}
              transition={selectedAnimations.subtitle.transition}
            >
              {constants.faq.subtitle}
            </motion.p>
          </div>
          {/* End of Header Section ---- */}

          {/* Start of FAQ Accordion --- */}
          <div ref={accordionRef}>
            <Accordion 
              type="single" 
              className="mt-8" 
              defaultValue="question-0" 
              collapsible
            >
              {constants.faq.items.map((item: FAQItem, index: number) => {
                const itemAnimations = shouldReduceMotion 
                  ? selectedAnimations.faqItem(index, accordionInView) 
                  : selectedAnimations.faqItem(index, accordionInView);

                return (
                  <motion.div key={item.question} {...itemAnimations}>
                    <AccordionItem 
                      value={`question-${index}`}
                      className={`border-0 ${index > 0 ? 'border-t border-border/20' : ''}`}
                    >
                      <motion.div {...selectedAnimations.accordionTrigger}>
                        <AccordionTrigger className="text-left text-base md:text-lg font-medium text-foreground hover:text-foreground/90 transition-colors py-6 hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                      </motion.div>
                      
                      <AccordionContent className="text-muted-foreground leading-relaxed text-sm md:text-base pb-6 pt-0">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                );
              })}
            </Accordion>
          </div>
          {/* End of FAQ Accordion ---- */}
        </div>
      </motion.div>
    </section>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { FAQ };
export default FAQ;
