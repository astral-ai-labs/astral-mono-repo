/* ==========================================================================*/
// BillingHistoryViewer.tsx — Billing history table with invoice display
/* ==========================================================================*/
// Purpose: Displays billing history in a formatted table with invoice details and actions
// Sections: Imports, Types, Animation Variants, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// External Packages -----
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { History } from "lucide-react";

// Local Modules ---
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface BillingHistoryItem {
  id: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
}

interface BillingHistoryViewerProps {
  billingHistory?: BillingHistoryItem[];
}

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

/**
 * Modular animation variants for billing history display elements
 */
const animations = {
  // Container with header animation
  container: {
    initial: { opacity: 0, transformPerspective: 1000 },
    animate: { 
      opacity: 1, 
      transformPerspective: 1000,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    },
  },

  // Header section
  header: {
    initial: { opacity: 0, y: -10, z: 15, rotateX: -2 },
    animate: { opacity: 1, y: 0, z: 0, rotateX: 0 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },

  // Table container entrance
  tableContainer: {
    initial: { opacity: 0, y: 15, z: 20, rotateX: -3 },
    animate: { opacity: 1, y: 0, z: 0, rotateX: 0 },
    transition: { type: "spring", stiffness: 350, damping: 25, delay: 0.1 },
  },

  // Table row staggered entrance
  tableRow: {
    initial: { opacity: 0, y: 10, z: 15, rotateX: -2 },
    animate: { opacity: 1, y: 0, z: 0, rotateX: 0 },
    exit: { opacity: 0, y: -10, z: -15, rotateX: 2 },
    transition: { type: "spring", stiffness: 350, damping: 25 },
    whileHover: { 
      y: -2, 
      z: 5, 
      transition: { duration: 0.2, ease: "easeOut" } 
    },
  },

  // Status badge animation
  statusBadge: {
    initial: { opacity: 0, scale: 0.9, z: 10 },
    animate: { opacity: 1, scale: 1, z: 0 },
    transition: { type: "spring", stiffness: 500, damping: 25 },
  },

  // Empty state animation
  emptyState: {
    initial: { opacity: 0, scale: 0.95, y: 20, z: 30, rotateX: -5 },
    animate: { opacity: 1, scale: 1, y: 0, z: 0, rotateX: 0 },
    transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.2 },
  },

  // Empty state icon
  emptyIcon: {
    initial: { opacity: 0, scale: 0.8, rotate: -10 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { type: "spring", stiffness: 400, damping: 20, delay: 0.3 },
  },

  // Reduced motion variants (accessibility)
  reducedMotion: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    header: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    tableContainer: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2, delay: 0.1 },
    },
    tableRow: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.15 },
      whileHover: {},
    },
    statusBadge: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.1 },
    },
    emptyState: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 },
    },
    emptyIcon: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
  },
};

/* ==========================================================================*/
// Helper Functions
/* ==========================================================================*/

/**
 * formatCurrency
 * 
 * Formats a numeric amount as currency string
 * 
 * @param amount - The numeric amount to format
 * @param currency - The currency code (defaults to USD)
 * @returns Formatted currency string
 */
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

/**
 * getStatusBadgeVariant
 * 
 * Returns appropriate badge variant based on invoice status
 * 
 * @param status - The invoice status
 * @returns Badge variant string
 */
function getStatusBadgeVariant(status: string): "secondary" | "outline" {
  return status.toLowerCase() === 'paid' ? 'secondary' : 'outline';
}

/**
 * getStatusBadgeClasses
 * 
 * Returns status-specific CSS classes for badge styling
 * 
 * @param status - The invoice status
 * @returns CSS class string
 */
function getStatusBadgeClasses(status: string): string {
  const baseClasses = "text-xs px-2.5 py-0.5 font-mono";
  
  if (status.toLowerCase() === 'paid') {
    return `${baseClasses} bg-green-500/20 hover:bg-green-500/20 text-green-400 border-green-700/30`;
  }
  
  return baseClasses;
}

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * BillingHistoryViewer
 * 
 * Displays billing history in a formatted table with invoice details
 * Shows empty state when no billing history is available
 * 
 * @param billingHistory - Array of billing history items to display
 */
function BillingHistoryViewer({ billingHistory = [] }: BillingHistoryViewerProps) {
  const shouldReduceMotion = useReducedMotion();

  // Select animation variants based on motion preference
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

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
          <h2 className="text-2xl font-medium">Billing history</h2>
          <p className="text-muted-foreground">View your past and current invoices.</p>
          
          {/* Main Content --- */}
          <div className="mt-6">
            {billingHistory.length > 0 ? (
              <motion.div 
                className="border border-border rounded-lg overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
                {...selectedAnimations.tableContainer}
              >
                {/* Table Info Header --- */}
                <div className="px-6 py-4 text-sm text-muted-foreground bg-muted/30">
                  <p>Showing invoices within the past 12 months</p>
                </div>

                {/* Invoice Table --- */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-background">
                        <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">
                          INVOICE
                        </th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">
                          STATUS
                        </th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">
                          AMOUNT
                        </th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">
                          CREATED
                        </th>
                        <th className="text-right py-3 px-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {billingHistory.map((invoice, index) => (
                          <motion.tr
                            key={invoice.id}
                            style={{ transformStyle: "preserve-3d" }}
                            {...selectedAnimations.tableRow}
                            transition={{
                              ...selectedAnimations.tableRow.transition,
                              delay: index * 0.05,
                            }}
                            className="border-b border-border"
                          >
                            <td className="py-4 px-6 font-mono text-sm">
                              {invoice.id}
                            </td>
                            <td className="py-4 px-6">
                              <motion.div {...selectedAnimations.statusBadge}>
                                <Badge 
                                  variant={getStatusBadgeVariant(invoice.status)}
                                  className={getStatusBadgeClasses(invoice.status)}
                                >
                                  {invoice.status}
                                </Badge>
                              </motion.div>
                            </td>
                            <td className="py-4 px-6 font-mono text-sm">
                              {formatCurrency(invoice.amount, invoice.currency)}
                            </td>
                            <td className="py-4 px-6 text-sm">
                              {invoice.createdAt}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <Button variant="link" className="h-8 text-sm text-white font-mono">
                                View
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              // Empty State ---
              <motion.div 
                className="border border-border rounded-lg p-12 flex flex-col items-center justify-center text-center"
                style={{ transformStyle: "preserve-3d" }}
                {...selectedAnimations.emptyState}
              >
                <motion.div 
                  className="p-4 rounded-full bg-muted mb-4"
                  {...selectedAnimations.emptyIcon}
                >
                  <History className="h-6 w-6 text-muted-foreground" />
                </motion.div>
                <h3 className="text-lg font-medium">No billing history</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-2">
                  Your billing history will appear here once you&apos;ve made your first payment or recharged your credits.
                </p>
              </motion.div>
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

export { BillingHistoryViewer }; 