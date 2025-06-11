/* ==========================================================================*/
// BillingAddPaymentMethod.tsx — Add payment method dialog
/* ==========================================================================*/
// Purpose: Modal dialog for adding new payment methods to account
// Sections: Imports, Animation Variants, Types, Constants, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { useState } from "react";

// External Packages -----
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { CreditCard, PlusIcon } from "lucide-react";

// Local Modules ---
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { DefaultDialog } from "@workspace/ui/components/default-dialog";
import { cn } from "@workspace/ui/lib/utils";

// Constants ---
import { billingConstants } from "@/constants"

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

/**
 * Modular animation variants for add payment method dialog elements
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

  // Input field animations
  inputField: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },

  // Form container
  formContainer: {
    initial: { transformPerspective: 1000 },
    animate: { 
      transformPerspective: 1000,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    },
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
    inputField: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.1 },
    },
    formContainer: {
      initial: {},
      animate: {},
    },
  },
};

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface BillingAddPaymentMethodProps {
  addPaymentMethodButton: string;
  onPaymentMethodAdded?: () => void;
}

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * BillingAddPaymentMethod
 * 
 * Modal dialog for adding new payment methods to account
 * Features card details form with validation and security
 * 
 * @param addPaymentMethodButton - Text for the trigger button
 * @param onPaymentMethodAdded - Callback when payment method is successfully added
 */
function BillingAddPaymentMethod({ addPaymentMethodButton, onPaymentMethodAdded }: BillingAddPaymentMethodProps) {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryMonth, setExpiryMonth] = useState<string>("");
  const [expiryYear, setExpiryYear] = useState<string>("");
  const [cvc, setCvc] = useState<string>("");
  const [cardholderName, setCardholderName] = useState<string>("");
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Select animation variants based on motion preference
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces
    const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    if (value.length <= 19) { // 16 digits + 3 spaces
      setCardNumber(value);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  const handleSubmit = () => {
    // Here you would typically call an API to add the payment method
    console.log('Adding payment method:', {
      cardNumber,
      expiryMonth,
      expiryYear,
      cvc,
      cardholderName
    });
    
    setOpen(false);
    onPaymentMethodAdded?.();
    
    // Reset form
    setCardNumber("");
    setExpiryMonth("");
    setExpiryYear("");
    setCvc("");
    setCardholderName("");
  };

  const triggerElement = (
    <>
      <PlusIcon className="h-4 w-4" />
      {addPaymentMethodButton}
    </>
  );

  const dialogContent = (
    <motion.div {...selectedAnimations.dialogContent}>
      <DialogHeader>
        <DialogTitle className="text-2xl">
          {billingConstants.addPaymentMethod.dialogTitle}
        </DialogTitle>
        <DialogDescription>
          {billingConstants.addPaymentMethod.dialogDescription}
        </DialogDescription>
      </DialogHeader>

      {/* Form Content --- */}
      <div className="space-y-8 py-6">
        <motion.div {...selectedAnimations.formContainer}>
          {/* Card Number Section --- */}
          <motion.div className="space-y-3" {...selectedAnimations.formSection}>
            <Label htmlFor="card-number" className="text-base font-medium">
              {billingConstants.addPaymentMethod.cardNumber}
            </Label>
            <motion.div className="relative" {...selectedAnimations.inputField}>
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="card-number"
                type="text"
                placeholder="1234 5678 9012 3456"
                className="pl-10 h-12"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
              />
            </motion.div>
          </motion.div>

          {/* Expiry and CVC Section --- */}
          <motion.div className="space-y-3 pt-4" {...selectedAnimations.formSection}>
            <div className="grid grid-cols-3 gap-4">
              <motion.div className="space-y-2" {...selectedAnimations.inputField}>
                <Label htmlFor="expiry-month" className="text-sm font-medium">
                  {billingConstants.addPaymentMethod.expiryMonth}
                </Label>
                <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div className="space-y-2" {...selectedAnimations.inputField}>
                <Label htmlFor="expiry-year" className="text-sm font-medium">
                  {billingConstants.addPaymentMethod.expiryYear}
                </Label>
                <Select value={expiryYear} onValueChange={setExpiryYear}>
                  <SelectTrigger className="h-auto">
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString().slice(-2);
                      return (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div className="space-y-2" {...selectedAnimations.inputField}>
                <Label htmlFor="cvc" className="text-sm font-medium">
                  {billingConstants.addPaymentMethod.cvc}
                </Label>
                <Input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  className="h-auto py-2 focus-visible:ring-0"
                  value={cvc}
                  onChange={handleCvcChange}
                  maxLength={4}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Cardholder Name Section --- */}
          <motion.div className="space-y-3 pt-4" {...selectedAnimations.formSection}>
            <Label htmlFor="cardholder-name" className="text-base font-medium">
              {billingConstants.addPaymentMethod.cardholderName}
            </Label>
            <motion.div {...selectedAnimations.inputField}>
              <Input
                id="cardholder-name"
                type="text"
                placeholder="John Doe"
                className="h-12"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
              />
            </motion.div>
            <p className="text-xs text-muted-foreground pt-1">
              {billingConstants.addPaymentMethod.cardholderNameHelper}
            </p>
          </motion.div>
        </motion.div>
      </div>

      <DialogFooter className="flex justify-between sm:justify-end pt-6">
        <Button 
          variant="outline" 
          onClick={() => setOpen(false)}
          className={cn(
            "bg-platform-button/50 border-platform-button-border text-muted-foreground h-11 px-6",
            "hover:bg-platform-button/70 hover:text-foreground hover:border-platform-button-border",
            "focus:ring-2 focus:ring-ring/20 transition-all duration-200"
          )}
        >
          {billingConstants.addPaymentMethod.cancelButton}
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!cardNumber || !expiryMonth || !expiryYear || !cvc || !cardholderName}
          className={cn(
            "bg-foreground text-background shadow-sm border border-transparent h-11 px-6",
            "hover:bg-foreground/90 hover:shadow-md",
            "focus:ring-2 focus:ring-foreground/20 transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground"
          )}
        >
          {billingConstants.addPaymentMethod.addButton}
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
      triggerClassName="h-7 text-xs border-border/70 bg-background/50 text-muted-foreground"
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

export default BillingAddPaymentMethod; 