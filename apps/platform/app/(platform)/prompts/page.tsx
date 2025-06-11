/* ==========================================================================*/
// page.tsx — Prompts page component
/* ==========================================================================*/
// Purpose: Renders the main Prompts page with tabbed interface
// Sections: Imports, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React from "react";

// Local Components ---
import { SimplePageLayout } from "@/components/shared";
import { Prompts } from "@/components/prompts";
import { Button } from "@workspace/ui/components/button";
import { MCPResourcesHeader } from "@/components/shared";

const PROMPTS_CONSTANTS = {
  creditBalance: 7.21,
  autoRechargeMessage: "When your credit balance reaches $0, your API requests will stop working. Enable automatic recharge to automatically keep your credit balance topped up.",
};

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * PromptsPage
 *
 * Main page component for the Prompts section.
 */
function PromptsPage() {
  return (
    <SimplePageLayout title="Prompts" headerChildren={<MCPResourcesHeader count={10} countTotal={10} />}>
      <Prompts />
    </SimplePageLayout>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export default PromptsPage;
