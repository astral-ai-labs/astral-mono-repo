/* ==========================================================================*/
// billing-recharge.tsx — Auto recharge configuration modal
/* ==========================================================================*/
// Purpose: Configures automatic credit recharge settings with threshold and amount options
// Sections: Imports, Constants, Types, Animation Variants, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { useState } from "react";

// External Packages -----
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";

// Local Modules ---
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";

// Constants ---
import { billingConstants } from "@/constants";



/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface ThresholdOption {
  value: string;
  label: string;
  isPopular?: boolean;
}

interface TopUpOption {
  value: string;
  label: string;
  isPopular?: boolean;
}

/* ==========================================================================*/
// Configuration Data
/* ==========================================================================*/

const thresholdOptions: ThresholdOption[] = [
  { value: "25", label: "$25" },
  { value: "50", label: "$50" },
  { value: "100", label: "$100", isPopular: true },
  { value: "custom", label: billingConstants.enableRecharge.custom },
];

const topUpOptions: TopUpOption[] = [
  { value: "100", label: "$100" },
  { value: "150", label: "$150" },
  { value: "200", label: "$200", isPopular: true },
  { value: "custom", label: billingConstants.enableRecharge.custom },
];

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

/**
 * Modular animation variants for auto recharge dialog elements
 */
const animations = {
  // Dialog trigger button animation
  triggerButton: {
    whileHover: { scale: 1.03, z: 10, rotateX: -1 },
    whileTap: { scale: 0.97, z: -5 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },

  // Dialog content entrance
  dialogContent: {
    initial: { opacity: 0, scale: 0.95, z: 30, rotateX: -3 },
    animate: { opacity: 1, scale: 1, z: 0, rotateX: 0 },
    exit: { opacity: 0, scale: 0.95, z: -30, rotateX: 3 },
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },

  // Custom input field slide-in
  customInput: {
    initial: { opacity: 0, height: 0, z: 15, rotateX: -2 },
    animate: { opacity: 1, height: "auto", z: 0, rotateX: 0 },
    exit: { opacity: 0, height: 0, z: -15, rotateX: 2 },
    transition: { duration: 0.2, ease: "easeInOut" },
  },

  // Form sections stagger
  formSection: {
    initial: { opacity: 0, y: 10, z: 20 },
    animate: { opacity: 1, y: 0, z: 0 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },

  // Option buttons container
  optionsContainer: {
    initial: { transformPerspective: 1000 },
    animate: { 
      transformPerspective: 1000,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    },
  },

  // Individual option button
  optionButton: {
    initial: { opacity: 0, scale: 0.95, z: 10, rotateX: -2 },
    animate: { opacity: 1, scale: 1, z: 0, rotateX: 0 },
    whileHover: { scale: 1.02, z: 5, rotateX: -1 },
    whileTap: { scale: 0.98, z: -2 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },

  // Reduced motion variants (accessibility)
  reducedMotion: {
    triggerButton: {
      whileHover: {},
      whileTap: {},
      transition: {},
    },
    dialogContent: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    },
    customInput: {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: "auto" },
      exit: { opacity: 0, height: 0 },
      transition: { duration: 0.15 },
    },
    formSection: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    optionsContainer: {
      initial: {},
      animate: {},
    },
    optionButton: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      whileHover: {},
      whileTap: {},
      transition: { duration: 0.1 },
    },
  },
};

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * BillingRecharge
 * 
 * Modal dialog for configuring automatic credit recharge settings
 * Features threshold selection, top-up amounts, and monthly limits
 */
function BillingRecharge() {
  const [open, setOpen] = useState(false);
  const [thresholdAmount, setThresholdAmount] = useState("100");
  const [topUpAmount, setTopUpAmount] = useState("200");
  const [limitAmount, setLimitAmount] = useState("");
  const [customThreshold, setCustomThreshold] = useState("");
  const [customTopUp, setCustomTopUp] = useState("");
  const [showCustomThreshold, setShowCustomThreshold] = useState(false);
  const [showCustomTopUp, setShowCustomTopUp] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Select animation variants based on motion preference
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  const handleThresholdChange = (value: string) => {
    if (value === "custom") {
      setShowCustomThreshold(true);
      setThresholdAmount(customThreshold || "");
    } else {
      setShowCustomThreshold(false);
      setThresholdAmount(value);
    }
  };

  const handleTopUpChange = (value: string) => {
    if (value === "custom") {
      setShowCustomTopUp(true);
      setTopUpAmount(customTopUp || "");
    } else {
      setShowCustomTopUp(false);
      setTopUpAmount(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          className="w-fit"
          style={{ transformStyle: "preserve-3d" }}
          {...selectedAnimations.triggerButton}
        >
          <Button
            size="sm"
            className="mt-1 bg-white hover:bg-white text-black h-7 text-xs gap-1.5 border-none"
          >
            <Plus className="h-3 w-3" />
            {billingConstants.enableRecharge.enableAutoRechargeButton}
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <motion.div
          style={{ transformStyle: "preserve-3d" }}
          {...selectedAnimations.dialogContent}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {billingConstants.enableRecharge.autoRechargeSettings}
            </DialogTitle>
            <DialogDescription>
              {billingConstants.enableRecharge.autoRechargeInfo}
            </DialogDescription>
          </DialogHeader>

          {/* Form Content --- */}
          <div className="space-y-6 py-4">
            {/* Threshold Section --- */}
            <motion.div 
              className="space-y-4"
              {...selectedAnimations.formSection}
            >
              <Label className="text-base font-medium">
                {billingConstants.enableRecharge.whenBalanceGoesBelow}
              </Label>

              <motion.div {...selectedAnimations.optionsContainer}>
                <RadioGroup
                  value={showCustomThreshold ? "custom" : thresholdAmount}
                  onValueChange={handleThresholdChange}
                  className="grid grid-cols-4 gap-2"
                >
                  {thresholdOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      style={{ transformStyle: "preserve-3d" }}
                      {...selectedAnimations.optionButton}
                    >
                      <Label
                        htmlFor={`threshold-${option.value}`}
                        className={`flex h-12 cursor-pointer items-center justify-center rounded-md border border-input px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          (!showCustomThreshold && thresholdAmount === option.value) ||
                          (showCustomThreshold && option.value === "custom")
                            ? "bg-accent text-accent-foreground"
                            : ""
                        } relative`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`threshold-${option.value}`}
                          className="sr-only"
                        />
                        {option.label}
                        {option.isPopular && (
                          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-green-600 text-white text-[9px] font-medium rounded-sm">
                            {billingConstants.enableRecharge.popular}
                          </span>
                        )}
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </motion.div>

              <AnimatePresence>
                {showCustomThreshold && (
                  <motion.div
                    style={{ transformStyle: "preserve-3d" }}
                    {...selectedAnimations.customInput}
                    className="space-y-1"
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="custom-threshold"
                        type="number"
                        placeholder="Enter custom amount"
                        className="pl-7"
                        value={customThreshold}
                        onChange={(e) => {
                          setCustomThreshold(e.target.value);
                          if (showCustomThreshold) setThresholdAmount(e.target.value);
                        }}
                        onFocus={() => handleThresholdChange("custom")}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {billingConstants.enableRecharge.enterAmountBetween}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Top-up Section --- */}
            <motion.div 
              className="space-y-4"
              {...selectedAnimations.formSection}
            >
              <Label className="text-base font-medium">
                {billingConstants.enableRecharge.bringBalanceBackTo}
              </Label>

              <motion.div {...selectedAnimations.optionsContainer}>
                <RadioGroup
                  value={showCustomTopUp ? "custom" : topUpAmount}
                  onValueChange={handleTopUpChange}
                  className="grid grid-cols-4 gap-2"
                >
                  {topUpOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      style={{ transformStyle: "preserve-3d" }}
                      {...selectedAnimations.optionButton}
                    >
                      <Label
                        htmlFor={`topup-${option.value}`}
                        className={`flex h-12 cursor-pointer items-center justify-center rounded-md border border-input px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          (!showCustomTopUp && topUpAmount === option.value) ||
                          (showCustomTopUp && option.value === "custom")
                            ? "bg-accent text-accent-foreground"
                            : ""
                        } relative`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`topup-${option.value}`}
                          className="sr-only"
                        />
                        {option.label}
                        {option.isPopular && (
                          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-green-600 text-white text-[9px] font-medium rounded-sm">
                            {billingConstants.enableRecharge.popular}
                          </span>
                        )}
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </motion.div>

              <AnimatePresence>
                {showCustomTopUp && (
                  <motion.div
                    style={{ transformStyle: "preserve-3d" }}
                    {...selectedAnimations.customInput}
                    className="space-y-1"
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="custom-topup"
                        type="number"
                        placeholder="Enter custom amount"
                        className="pl-7"
                        value={customTopUp}
                        onChange={(e) => {
                          setCustomTopUp(e.target.value);
                          if (showCustomTopUp) setTopUpAmount(e.target.value);
                        }}
                        onFocus={() => handleTopUpChange("custom")}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {billingConstants.enableRecharge.enterAmountBetween10}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Limit Section --- */}
            <motion.div 
              className="space-y-2"
              {...selectedAnimations.formSection}
            >
              <Label className="text-base font-medium">
                {billingConstants.enableRecharge.limitAmount}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="limit-amount"
                  type="number"
                  placeholder="Enter limit"
                  className="pl-7"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {billingConstants.enableRecharge.enterAmountNoLimit}
              </p>
            </motion.div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {billingConstants.enableRecharge.cancelButton}
            </Button>
            <Button>{billingConstants.enableRecharge.saveButton}</Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export default BillingRecharge;
