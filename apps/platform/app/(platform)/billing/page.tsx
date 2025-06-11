/* ==========================================================================*/
// page.tsx — Billing page component with context-driven tab routing
/* ==========================================================================*/
// Purpose: Renders the main billing page content with tab routing provider
// Sections: Imports, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React from "react";

// Local Components ---
import { TabPageLayout } from "@/components/shared";
import BillingTabsContainer from "@/components/billing";

const BILLING_CONSTANTS = {
  creditBalance: 7.21,
  autoRechargeMessage: "When your credit balance reaches $0, your API requests will stop working. Enable automatic recharge to automatically keep your credit balance topped up.",
};

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * BillingPage
 *
 * Main page component for the billing section with context-driven tab routing.
 * Wraps the billing component with TabRoutingProvider for seamless navigation.
 */
function BillingPage() {
  return (
    <TabPageLayout title="Billing" defaultTab="overview" paramName="tab">
      <BillingTabsContainer creditBalance={BILLING_CONSTANTS.creditBalance} autoRechargeMessage={BILLING_CONSTANTS.autoRechargeMessage} />
    </TabPageLayout>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export default BillingPage;
