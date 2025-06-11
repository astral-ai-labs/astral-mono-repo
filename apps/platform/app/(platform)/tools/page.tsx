/* ==========================================================================*/
// page.tsx — Tools page component
/* ==========================================================================*/
// Purpose: Renders the main Tools page with tabbed interface
// Sections: Imports, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React from "react";

// Local Components ---
import { SimplePageLayout } from "@/components/shared";
import { Tools } from "@/components/tools";

const TOOLS_CONSTANTS = {
  creditBalance: 7.21,
  autoRechargeMessage: "When your credit balance reaches $0, your API requests will stop working. Enable automatic recharge to automatically keep your credit balance topped up.",
};

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * ToolsPage
 *
 * Main page component for the Tools section.
 */
function ToolsPage() {
  return (
    <SimplePageLayout title="Tools">
      <Tools />
    </SimplePageLayout>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export default ToolsPage;
