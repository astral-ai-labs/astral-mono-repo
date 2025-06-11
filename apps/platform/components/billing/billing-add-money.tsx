/* ==========================================================================*/
// OrganizationBillingAddMoney.tsx — Credit balance top-up dialog
/* ==========================================================================*/
// Purpose: Modal dialog for adding funds to account credit balance
// Sections: Imports, Animation Variants, Types, Constants, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { useState } from "react";

// External Packages -----
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { CreditCard, Plus, PlusIcon } from "lucide-react";

// Local Modules ---
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { DefaultDialog } from "@workspace/ui/components/default-dialog";
import { cn } from "@workspace/ui/lib/utils";

// Constants ---
import { billingConstants } from "@/constants"

// Local Components ---
import { useTabNavigation } from "../../hooks/useTabRouting";

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

/**
 * Modular animation variants for add money dialog elements
 */
const animations = {
  // Dialog trigger button animation
  triggerButton: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },

  // Dialog content entrance
  dialogContent: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },

  // Form sections stagger
  formSection: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },

  // Custom input field slide-in
  customInput: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.2, ease: "easeInOut" },
  },

  // Amount options container
  optionsContainer: {
    initial: { transformPerspective: 1000 },
    animate: { 
      transformPerspective: 1000,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    },
  },

  // Individual option button
  optionButton: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
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
    formSection: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    customInput: {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: "auto" },
      exit: { opacity: 0, height: 0 },
      transition: { duration: 0.15 },
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
// Types and Interfaces
/* ==========================================================================*/

interface BillingAddMoneyProps {
  addCreditBalanceButton: string;
}

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * BillingAddMoney
 * 
 * Modal dialog for adding funds to account credit balance with context-based routing
 * Features preset amounts, custom amount input, and payment method selection
 * 
 * @param addCreditBalanceButton - Text for the trigger button
 */
function BillingAddMoney({ addCreditBalanceButton }: BillingAddMoneyProps) {
  const [amount, setAmount] = useState<string>("10");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  // ✅ Get navigation function from context - no prop drilling!
  const setActiveTab = useTabNavigation();

  // Select animation variants based on motion preference
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  const handleAmountChange = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
      setAmount(customAmount || "");
    } else {
      setIsCustom(false);
      setAmount(value);
      setCustomAmount("");
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (isCustom) {
      setAmount(value);
    }
  };

  const handleAddPaymentMethod = () => {
    setOpen(false);
    // ✅ Simple navigation using context!
    setActiveTab("payment-methods");
  };

  const triggerElement = (
    <>
      <PlusIcon className="h-4 w-4" />
      {addCreditBalanceButton}
    </>
  );

  const dialogContent = (
    <motion.div {...selectedAnimations.dialogContent}>
      <DialogHeader>
        <DialogTitle className="text-2xl">
          {billingConstants.addMoney.dialogTitle}
        </DialogTitle>
        <DialogDescription>
          {billingConstants.addMoney.dialogDescription}
        </DialogDescription>
      </DialogHeader>

      {/* Form Content --- */}
      <div className="space-y-6 py-4">
        {/* Amount Selection Section --- */}
        <motion.div className="space-y-4" {...selectedAnimations.formSection}>
          <Label htmlFor="amount" className="text-base font-medium">
            {billingConstants.addMoney.amountToAdd}
          </Label>

          <motion.div {...selectedAnimations.optionsContainer}>
            <RadioGroup 
              value={isCustom ? "custom" : amount} 
              onValueChange={handleAmountChange} 
              className="grid grid-cols-4 gap-2"
            >
              {["10", "25", "50", "100"].map((value) => (
                <motion.div key={value} {...selectedAnimations.optionButton}>
                  <Label 
                    htmlFor={`amount-${value}`} 
                    className={`flex h-12 cursor-pointer items-center justify-center rounded-md border border-input px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${!isCustom && amount === value ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    <RadioGroupItem value={value} id={`amount-${value}`} className="sr-only" />
                    ${value}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </motion.div>

          {/* Custom Amount Input --- */}
          <div className="space-y-2">
            <Label htmlFor="custom-amount" className="text-sm font-medium">
              {billingConstants.addMoney.customAmount}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input 
                id="custom-amount" 
                type="number" 
                placeholder={billingConstants.addMoney.enterCustomAmount}
                className="pl-7" 
                value={customAmount} 
                onChange={handleCustomAmountChange} 
                onFocus={() => handleAmountChange("custom")} 
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {billingConstants.addMoney.amountBetween}
            </p>
          </div>
        </motion.div>

        {/* Payment Method Section --- */}
        <motion.div className="space-y-2" {...selectedAnimations.formSection}>
          <div className="flex items-center justify-between">
            <Label htmlFor="payment-method" className="text-base font-medium">
              {billingConstants.addMoney.paymentMethod}
            </Label>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-primary"
              onClick={handleAddPaymentMethod}
            >
              <Plus className="mr-1 h-3 w-3" />
              {billingConstants.addMoney.addPaymentMethod}
            </Button>
          </div>
          <Select defaultValue="card1">
            <SelectTrigger className="w-full">
              <SelectValue placeholder={billingConstants.addMoney.selectPaymentMethod} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>•••• 5584</span>
                </div>
              </SelectItem>
              <SelectItem value="card2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>•••• 1234</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      <DialogFooter className="flex justify-between sm:justify-end">
        <Button 
          variant="outline" 
          onClick={() => setOpen(false)}
          className={cn(
            "bg-platform-button/50 border-platform-button-border text-muted-foreground",
            "hover:bg-platform-button/70 hover:text-foreground hover:border-platform-button-border",
            "focus:ring-2 focus:ring-ring/20 transition-all duration-200"
          )}
        >
          {billingConstants.addMoney.cancelButton}
        </Button>
        <Button 
          type="submit"
          className={cn(
            "bg-foreground text-background shadow-sm border border-transparent",
            "hover:bg-foreground/90 hover:shadow-md",
            "focus:ring-2 focus:ring-foreground/20 transition-all duration-200"
          )}
        >
          {billingConstants.addMoney.continueButton}
        </Button>
      </DialogFooter>
    </motion.div>
  );

  return (
    <DefaultDialog 
      open={open} 
      onOpenChange={setOpen}
      trigger={triggerElement}
      buttonTrigger={true}
      triggerClassName="-ml-1 text-xs"
      dialogClassName="sm:max-w-md"
      TriggerWrapper={motion.div}
      triggerWrapperProps={selectedAnimations.triggerButton}
    >
      {dialogContent}
    </DefaultDialog>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export default BillingAddMoney;
