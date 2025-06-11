/* ==========================================================================*/
// BillingOverview.tsx — Billing overview content section
/* ==========================================================================*/
// Purpose: Displays credit balance overview with add money and auto recharge options
// Sections: Imports, Animation Variants, Constants, Types, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React from "react";

// External Packages -----
import { motion, useReducedMotion } from "motion/react";
import { InfoIcon } from "lucide-react";

// Local Modules ---
import BillingAddMoney from "./billing-add-money";
import BillingRecharge from "./billing-recharge";
import { useTabNavigation } from "../../hooks/useTabRouting";

// Workspace UI Components ---
import { Button } from "@workspace/ui/components/button";

// Constants ---
import { billingConstants } from "@/constants"

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

/**
 * Modular animation variants for billing overview elements
 */
const animations = {
  // Main container entrance
  mainContainer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },

  // Content container with stagger
  contentContainer: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      delay: 0.05,
    },
  },

  // Section title animation
  sectionTitle: {
    initial: { opacity: 0, x: -5 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.1 },
  },

  // Credit balance container
  balanceContainer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.2 },
  },

  // Credit balance amount
  balanceAmount: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
      delay: 0.25,
    },
  },

  // Add money button
  addMoneyButton: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.4 },
  },

  // Info panel
  infoPanel: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      delay: 0.3,
    },
  },

  // Info panel title
  infoPanelTitle: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.35 },
  },

  // Info panel description
  infoPanelDescription: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.4 },
  },

  // Enable recharge button
  enableRechargeButton: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.45 },
  },

  // Reduced motion variants (accessibility)
  reducedMotion: {
    mainContainer: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    contentContainer: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    sectionTitle: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    balanceContainer: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    balanceAmount: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    addMoneyButton: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    infoPanel: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    infoPanelTitle: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    infoPanelDescription: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    enableRechargeButton: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
  },
};

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface BillingOverviewProps {
  creditBalance: number;
  autoRechargeMessage: string;
}

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * BillingOverview
 * 
 * Displays billing overview with credit balance, add money dialog, and auto recharge options
 * Features animated sections and responsive layout with info panel
 * 
 * @param creditBalance - Current credit balance amount
 * @param autoRechargeMessage - Message about auto recharge status
 */
function BillingOverview({ 
  creditBalance, 
  autoRechargeMessage
}: BillingOverviewProps) {
  const shouldReduceMotion = useReducedMotion();

  // Select animation variants based on motion preference
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  return (
    <motion.div 
      className="space-y-4 max-w-4xl mx-auto"
      {...selectedAnimations.mainContainer}
    >
      <div className="flex p-5 bg-transparent !font-mono">
        {/* Main Content Section --- */}
        <motion.div
          className="flex flex-col justify-center space-x-16 space-y-4 mx-auto"
          {...selectedAnimations.contentContainer}
        >
          <motion.h2 
            className="font-medium w-fit"
            {...selectedAnimations.sectionTitle}
          >
            {billingConstants.overview.sectionTitle}
          </motion.h2>

          <motion.div 
            className="space-y-2"
            {...selectedAnimations.balanceContainer}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {billingConstants.overview.creditBalance}
              </span>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <motion.h3
              className="text-4xl font-medium"
              {...selectedAnimations.balanceAmount}
            >
              ${creditBalance.toFixed(2)}
            </motion.h3>
          </motion.div>

          <motion.div 
            className="flex pt-0.5"
            {...selectedAnimations.addMoneyButton}
          >
            <BillingAddMoney 
              addCreditBalanceButton={billingConstants.overview.addCreditBalanceButton}
            />
          </motion.div>


        </motion.div>

        {/* Info Panel Section --- */}
        <motion.div
          className="flex-1 pl-6 border border-border/60 rounded-sm px-12 py-6"
          {...selectedAnimations.infoPanel}
        >
          <div className="flex items-start gap-3">
            <div className="p-1 mt-0.5">
              <InfoIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <motion.h3 
                className="font-medium tracking-tighter"
                {...selectedAnimations.infoPanelTitle}
              >
                {billingConstants.overview.autoRechargeMessage}
              </motion.h3>
              <motion.p 
                className="text-[11px] md:text-[13px] tracking-tight text-muted-foreground"
                {...selectedAnimations.infoPanelDescription}
              >
                {autoRechargeMessage}
              </motion.p>

              <motion.div {...selectedAnimations.enableRechargeButton}>
                <BillingRecharge />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * DemoNavigationButton
 * 
 * Simple demo component showing how easy navigation is with context
 */
function DemoNavigationButton() {
  const setActiveTab = useTabNavigation();
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => setActiveTab("payment-methods")}
      className="text-xs"
    >
      → Go to Payment Methods
    </Button>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { BillingOverview };
