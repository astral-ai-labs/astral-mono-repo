/* ==========================================================================*/
// billing-navigation.tsx — Context-driven billing section navigation component
/* ==========================================================================*/
// Purpose: Renders navigation options for billing section with context-based routing
// Sections: Imports, Animation Variants, Types, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// External Packages -----
import { motion, useReducedMotion } from "motion/react";
import { CreditCard, History } from "lucide-react";

// Local Modules ---
import { BillingOption } from "./billing-option";
import { useTabNavigation } from "../../hooks/useTabRouting";

// Constants -----
import { billingConstants } from "@/constants";

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

/**
 * Modular animation variants for billing navigation elements
 */
const animations = {
  // Main container entrance
  mainContainer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  // Header section animation
  headerSection: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.05 },
  },

  // Navigation option cards with stagger
  optionCard: (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
      delay,
    },
  }),

  // Reduced motion variants (accessibility)
  reducedMotion: {
    mainContainer: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    headerSection: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    optionCard: () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    }),
  },
};

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * BillingNavigation
 *
 * Navigation component for billing section with context-driven routing.
 * Features payment methods and billing history navigation options.
 * No props needed - routing is handled via context!
 */
function BillingNavigation() {
  const shouldReduceMotion = useReducedMotion();
  
  // ✅ Get navigation function from context - no prop drilling!
  const setActiveTab = useTabNavigation();

  // Select animation variants based on motion preference
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  return (
    <motion.div className="mx-auto w-full max-w-4xl pb-12" {...selectedAnimations.mainContainer}>
      {/* Header Section --- */}
      <motion.div className="pt-6 gap-4 flex items-center" {...selectedAnimations.headerSection}>
        <h4 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{billingConstants.navigation.availableOptions}</h4>
        <div className="h-[0.5px] bg-muted-foreground/20 flex-grow" />
      </motion.div>

      {/* Navigation Options Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 p-5">
        <motion.div key="payment-methods" {...selectedAnimations.optionCard(0.1)}>
          <BillingOption icon={<CreditCard className="h-5 w-5 text-muted-foreground" />} title="Payment methods" description="Add or change payment method" tabValue="payment-methods" onSelectTab={setActiveTab} />
        </motion.div>

        <motion.div key="billing-history" {...selectedAnimations.optionCard(0.3)}>
          <BillingOption icon={<History className="h-5 w-5 text-muted-foreground" />} title="Billing history" description="View your past and current invoices" tabValue="billing-history" onSelectTab={setActiveTab} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { BillingNavigation };
