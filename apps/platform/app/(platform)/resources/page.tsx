/* ==========================================================================*/
// page.tsx — Resources page component with context-driven tab routing
/* ==========================================================================*/
// Purpose: Renders the main Resources page content with tab routing provider
// Sections: Imports, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React from "react";

// Local Components ---
import { TabPageLayout } from "@/components/shared";
// import MCPServersTabsContainer from "@/components/mcp-servers";

const RESOURCES_CONSTANTS = {
  creditBalance: 7.21,
  autoRechargeMessage: "When your credit balance reaches $0, your API requests will stop working. Enable automatic recharge to automatically keep your credit balance topped up.",
};

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * ResourcesPage
 *
 * Main page component for the Resources section with context-driven tab routing.
 * Wraps the Resources component with TabRoutingProvider for seamless navigation.
 */
function ResourcesPage() {
  return (
    <TabPageLayout title="Resources" defaultTab="overview" paramName="tab">
        <div>
            <h1>Resources</h1>
        </div>
    </TabPageLayout>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export default ResourcesPage;
