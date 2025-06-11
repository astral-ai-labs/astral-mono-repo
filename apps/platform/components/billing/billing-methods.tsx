/* ==========================================================================*/
// PaymentMethodsManager.tsx — Payment method management interface
/* ==========================================================================*/
// Purpose: Manages payment methods with CRUD operations and default selection
// Sections: Imports, Types, Animation Variants, Components, Main Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { useState, useRef } from "react";

// External Packages -----
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { CreditCard, CheckIcon, InfoIcon } from "lucide-react";

// Local Modules ---
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import BillingAddPaymentMethod from "./billing-add-payment-method";

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  isDefault?: boolean;
}

interface PaymentMethodsManagerProps {
  paymentMethods?: PaymentMethod[];
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onDelete: (id: string, action?: string) => void;
  onSetDefault: (id: string) => void;
  isDefault: boolean;
  isOnlyCard: boolean;
}

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

/**
 * Modular animation variants for payment method cards and UI elements
 */
const animations = {
  // Payment method card entrance with 3D depth
  paymentCard: {
    initial: {
      opacity: 0,
      scale: 0.9,
      y: 10,
      z: 20,
      rotateX: -5,
      transformPerspective: 1000,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      z: 0,
      rotateX: 0,
      transformPerspective: 1000,
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 10,
      z: -20,
      rotateX: 5,
      transformPerspective: 1000,
    },
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
    },
  },

  // Shake animation for error states
  cardShake: {
    x: [0, -5, 5, -5, 5, -3, 3, -2, 2, 0],
    transition: {
      duration: 0.5,
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
      type: "keyframes"
    }
  },

  // Default badge animation
  defaultBadge: {
    initial: { opacity: 0, scale: 0.8, z: 10, rotateX: -3 },
    animate: { opacity: 1, scale: 1, z: 0, rotateX: 0 },
    exit: { opacity: 0, scale: 0.8, z: -10, rotateX: 3 },
    transition: { type: "spring", stiffness: 500, damping: 25 },
  },

  // Error/confirmation message animations
  notification: {
    initial: { opacity: 0, y: -10, z: 15, rotateX: -2 },
    animate: { opacity: 1, y: 0, z: 0, rotateX: 0 },
    exit: { opacity: 0, y: -10, z: -15, rotateX: 2 },
    transition: { duration: 0.2 },
  },

  // Container with staggered children
  container: {
    initial: {
      transformPerspective: 1000,
    },
    animate: {
      transformPerspective: 1000,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  },

  // Header section
  header: {
    initial: { opacity: 0, y: -5, z: 10 },
    animate: { opacity: 1, y: 0, z: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // Reduced motion variants (accessibility)
  reducedMotion: {
    paymentCard: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    },
    cardShake: {
      transition: { duration: 0.1 }
    },
    defaultBadge: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
    },
    notification: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
    },
    container: {
      initial: {},
      animate: {},
    },
    header: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
  },
};

/* ==========================================================================*/
// PaymentMethodCard Component
/* ==========================================================================*/

/**
 * PaymentMethodCard
 * 
 * Individual payment method card with delete and set default functionality
 */
function PaymentMethodCard({ 
  method, 
  onDelete, 
  onSetDefault, 
  isDefault, 
  isOnlyCard 
}: PaymentMethodCardProps) {
  const [isShaking, setIsShaking] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Select animation variants based on motion preference
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  const handleDeleteClick = () => {
    if (isDefault) {
      if (isOnlyCard) {
        // Show confirmation dialog for deleting the only card
        onDelete(method.id, 'confirm-delete');
      } else {
        // Cannot delete default card when multiple cards exist
        setIsShaking(true);
        onDelete(method.id, 'show-error');
        
        setTimeout(() => {
          setIsShaking(false);
        }, 500);
      }
    } else {
      // Regular delete for non-default cards
      onDelete(method.id, 'delete');
    }
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      layoutId={`card-${method.id}`}
      style={{ transformStyle: "preserve-3d" }}
      {...selectedAnimations.paymentCard}
      animate={isShaking 
        ? { ...selectedAnimations.paymentCard.animate, ...selectedAnimations.cardShake }
        : selectedAnimations.paymentCard.animate
      }
      className={`group border border-border tiny-scrollbar rounded-lg pt-2.5 pb-1 px-4 flex flex-col relative ${isDefault ? "min-w-[300px]" : "min-w-[250px]"}`}
    >
      {/* Card Header Info --- */}
      <div className="flex justify-between items-start w-full">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-md border border-border bg-background/80">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium font-mono">•••• {method.last4}</p>
            <p className="text-[12px] pt-0.5 tracking-wide text-muted-foreground text-nowrap">
              Expires {method.exp_month}/{method.exp_year}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {isDefault && (
            <motion.div 
              style={{ transformStyle: "preserve-3d" }}
              {...selectedAnimations.defaultBadge}
            >
              <Badge variant="outline" className="text-[11px] px-2 py-0 h-5 gap-1 font-mono tracking-tighter">
                <CheckIcon className="h-3 w-3 text-green-500" />
                Default
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Actions --- */}
      <div className="flex justify-start mt-2 ml-1 relative">
        <div style={{ width: !isDefault ? "auto" : "0px", overflow: "hidden", transition: "width 0.3s ease-in-out" }}>
          {!isDefault && (
            <Button 
              onClick={() => onSetDefault(method.id)} 
              variant="link" 
              size="sm" 
              className="p-0 text-xs opacity-60 hover:opacity-100 transition-opacity mr-4"
            >
              Set default
            </Button>
          )}
        </div>
        
        <Button 
          onClick={handleDeleteClick} 
          variant="link" 
          size="sm" 
          className={`p-0 text-xs opacity-60 hover:opacity-100 transition-opacity text-red-500 hover:text-red-500 ${isDefault && !isOnlyCard ? 'cursor-not-allowed opacity-40 hover:opacity-40' : ''}`}
          style={{ 
            position: "relative",
            transition: "transform 0.3s ease-in-out", 
            transform: isDefault ? "translateX(0)" : "translateX(0)" 
          }}
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
}

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * PaymentMethodsManager
 * 
 * Main component for managing payment methods with CRUD operations
 * 
 * @param paymentMethods - Array of payment method objects
 */
function PaymentMethodsManager({ paymentMethods = [] }: PaymentMethodsManagerProps) {
  const [methods, setMethods] = useState(paymentMethods);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("You cannot delete your default payment method.");
  const shouldReduceMotion = useReducedMotion();

  // Select animation variants based on motion preference
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  const handleDelete = (id: string, action = 'delete') => {
    if (action === 'show-error') {
      setErrorMessage("You cannot delete your default payment method until you set another one as default.");
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
      return;
    }
    
    if (action === 'confirm-delete') {
      setCardToDelete(id);
      setShowConfirmation(true);
      return;
    }
    
    if (action === 'delete') {
      console.log(`Deleting payment method with id: ${id}`);
      // In a real app, you would call an API to delete the method
      // For demo purposes, we'll just remove it from the local state
      setMethods((prev) => prev.filter((method) => method.id !== id));
    }
  };

  const confirmDelete = () => {
    if (cardToDelete) {
      console.log(`Confirming deletion of payment method with id: ${cardToDelete}`);
      // Add a small delay before removal for exit animation to complete
      setShowConfirmation(false);
      setTimeout(() => {
        setMethods((prev) => prev.filter((method) => method.id !== cardToDelete));
        setCardToDelete(null);
      }, 300);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setTimeout(() => {
      setCardToDelete(null);
    }, 300);
  };

  const handleSetDefault = (id: string) => {
    console.log(`Setting payment method with id: ${id} as default`);
    // Update local state to mark the selected card as default and unmark others
    setMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const isOnlyOneCard = methods.length === 1;

  return (
    <motion.div 
      className="p-6 space-y-6"
      style={{ transformStyle: "preserve-3d" }}
      {...selectedAnimations.container}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="flex flex-col space-y-4"
          {...selectedAnimations.header}
        >
          {/* Header Section --- */}
          <h2 className="text-2xl font-medium">Payment methods</h2>
          <p className="text-muted-foreground">Add or manage your payment methods.</p>

          {/* Main Content --- */}
          <div className="mt-6 space-y-4">
            {methods.length > 0 ? (
              <>
                {/* Payment Methods Grid --- */}
                <div className="flex overflow-x-auto invisible-scrollbar gap-4 pb-2">
                  <AnimatePresence>
                    {methods.map((method) => (
                      <PaymentMethodCard 
                        key={method.id} 
                        method={method} 
                        onDelete={handleDelete} 
                        onSetDefault={handleSetDefault} 
                        isDefault={!!method.isDefault}
                        isOnlyCard={isOnlyOneCard}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                
                {/* Error and Confirmation Messages --- */}
                <AnimatePresence>
                  {showErrorMessage && (
                    <motion.div 
                      style={{ transformStyle: "preserve-3d" }}
                      {...selectedAnimations.notification}
                      className="flex items-center gap-2 text-xs text-red-500 mt-2"
                    >
                      <InfoIcon className="h-3.5 w-3.5" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                  
                  {showConfirmation && (
                    <motion.div 
                      style={{ transformStyle: "preserve-3d" }}
                      {...selectedAnimations.notification}
                      className="flex flex-col gap-2 text-xs mt-2 p-3 border border-border rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <InfoIcon className="h-3.5 w-3.5 text-red-500" />
                        <span className="text-red-800">
                          Deleting your default payment method will require you to input a new one to add credits in the future.
                        </span>
                      </div>
                      <div className="flex gap-3 mt-1">
                        <Button 
                          onClick={confirmDelete} 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-5 text-xs text-red-700 hover:text-red-900"
                        >
                          Yes, continue
                        </Button>
                        <Button 
                          onClick={cancelDelete} 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-5 text-xs text-muted-foreground hover:text-muted-foreground"
                        >
                          Nevermind
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Add Payment Method Button --- */}
                <div className="flex justify-start mt-6">
                  <BillingAddPaymentMethod 
                    addPaymentMethodButton="Add payment method"
                    onPaymentMethodAdded={() => {
                      console.log('Payment method added successfully');
                      // In a real app, you would refresh the payment methods list here
                    }}
                  />
                </div>
              </>
            ) : (
              // Empty State ---
              <div className="border border-border rounded-lg p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-md border border-border bg-background/80">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">No payment methods</p>
                    <p className="text-sm text-muted-foreground">
                      Add a payment method to enable automatic recharges
                    </p>
                  </div>
                </div>
                <BillingAddPaymentMethod 
                  addPaymentMethodButton="Add payment method"
                  onPaymentMethodAdded={() => {
                    console.log('Payment method added successfully');
                    // In a real app, you would refresh the payment methods list here
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { PaymentMethodsManager };
