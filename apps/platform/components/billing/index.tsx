/* ==========================================================================*/
// BillingTabsContainer.client.tsx — Context-driven billing interface with tabbed navigation
/* ==========================================================================*/
// Purpose: Renders tabbed billing interface using context-based routing
// Sections: Imports, Types, Data, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React, { useMemo } from "react";

// External Packages -----
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

// Local Modules ---
import { BillingOverview } from "./billing-overview";
import { PaymentMethodsManager } from "./billing-methods";
import { BillingNavigation } from "./billing-navigation";
import { BillingHistoryViewer } from "./billing-history";

// Local Hooks ---
import { useActiveTab, useTabNavigation } from "../../hooks/useTabRouting";

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface BillingTabsContainerProps {
  creditBalance: number;
  autoRechargeMessage: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  isDefault?: boolean;
}

interface BillingHistoryItem {
  id: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
}

interface TabConfig {
  value: string;
  label: string;
  content: React.ReactNode;
}

/* ==========================================================================*/
// Mock Data
/* ==========================================================================*/

const EXAMPLE_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "1",
    brand: "Visa",
    last4: "1234",
    exp_month: 1,
    exp_year: 2025,
    isDefault: true,
  },
  {
    id: "2",
    brand: "Mastercard",
    last4: "5678",
    exp_month: 12,
    exp_year: 2026,
  },
  {
    id: "3",
    brand: "American Express",
    last4: "9012",
    exp_month: 3,
    exp_year: 2027,
  },
  {
    id: "4",
    brand: "Discover",
    last4: "3456",
    exp_month: 4,
    exp_year: 2028,
  },
  {
    id: "5",
    brand: "JCB",
    last4: "7890",
    exp_month: 5,
    exp_year: 2029,
  },
];

const EXAMPLE_BILLING_HISTORY: BillingHistoryItem[] = [
  {
    id: "BEED223E-0001",
    status: "Paid",
    amount: 10.81,
    currency: "USD",
    createdAt: "Mar 26, 2025, 8:21 PM",
  },
  {
    id: "BEED223E-0002",
    status: "Paid",
    amount: 25.0,
    currency: "USD",
    createdAt: "Feb 15, 2025, 3:45 PM",
  },
  {
    id: "BEED223E-0003",
    status: "Processing",
    amount: 15.5,
    currency: "USD",
    createdAt: "Jan 05, 2025, 11:30 AM",
  },
];

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * BillingTabsContainer
 *
 * Main billing interface with context-driven tabbed navigation.
 * All routing is handled automatically via context - no prop drilling needed!
 *
 * @param creditBalance - Current credit balance amount
 * @param autoRechargeMessage - Message about auto-recharge status
 */
function BillingTabsContainer({ creditBalance, autoRechargeMessage }: BillingTabsContainerProps) {
  // ✅ Get routing state from context - no prop drilling!
  const activeTab = useActiveTab();
  const setActiveTab = useTabNavigation();

  // ✅ Memoized tabs configuration - no routing concerns here!
  const tabs = useMemo(() => {
    const tabConfigs: TabConfig[] = [
      {
        value: "overview",
        label: "Overview",
        content: (
          <div className="p-6">
            <BillingOverview creditBalance={creditBalance} autoRechargeMessage={autoRechargeMessage} />
          </div>
        ),
      },
      {
        value: "payment-methods",
        label: "Payment methods",
        content: (
          <div className="p-6">
            <PaymentMethodsManager paymentMethods={EXAMPLE_PAYMENT_METHODS} />
          </div>
        ),
      },
      {
        value: "billing-history",
        label: "Billing history",
        content: (
          <div className="p-6">
            <BillingHistoryViewer billingHistory={EXAMPLE_BILLING_HISTORY} />
          </div>
        ),
      },
    ];
    return tabConfigs;
  }, [creditBalance, autoRechargeMessage]);

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="w-full h-full gap-0 overflow-hidden"
    >
      {/* Tab Navigation Header --- */}
      <div className="w-full border-b border-border">
        <TabsList className="rounded-none justify-start p-0 bg-transparent w-fit min-h-10 !text-xs">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="billing-tab-trigger"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Tab Content Area --- */}
      <div className="w-full h-full overflow-hidden">
        {tabs.map((tab) => (
          <TabsContent 
            key={tab.value} 
            value={tab.value} 
            className="mt-0 h-full overflow-y-scroll"
          >
            {tab.content}
            <BillingNavigation />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export default BillingTabsContainer;
