/* ==========================================================================*/
// page-layouts.tsx — Reusable page layout components
/* ==========================================================================*/
// Purpose: Standardized page layouts to eliminate glue code
// Sections: Imports, Types, Components, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React from "react";

// External Packages ---

// Local Modules ---
import { TabRoutingProvider } from "../../hooks/useTabRouting";
import { useHeaderCollapse } from "../../hooks/useHeaderCollapse";
import { TooltipActionIcon } from "@workspace/ui/components/tooltip-icon";

// Local Components ---
import { PageHeader } from "./page-header";

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface TabPageLayoutProps {
  title: string;
  defaultTab: string;
  paramName?: string;
  children: React.ReactNode;
  headerChildren?: React.ReactNode;
}

interface SimplePageLayoutProps {
  title: string;
  children: React.ReactNode;
  headerChildren?: React.ReactNode;
}

/* ==========================================================================*/
// Tab Page Layout Component
/* ==========================================================================*/

/**
 * TabPageLayout
 *
 * Complete page layout with header and tab routing provider.
 * Perfect for pages with tabbed interfaces - ZERO glue code needed!
 */
function TabPageLayout({ title, defaultTab, paramName = "tab", children, headerChildren }: TabPageLayoutProps) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <PageHeader title={title} headerChildren={headerChildren} />

      <div className="w-full flex-1 min-h-0">
        <TabRoutingProvider defaultTab={defaultTab} paramName={paramName}>
          {children}
        </TabRoutingProvider>
      </div>
    </div>
  );
}

/* ==========================================================================*/
// Simple Page Layout Component
/* ==========================================================================*/

/**
 * SimplePageLayout
 *
 * Complete page layout with header and tab routing provider.
 * Perfect for pages with tabbed interfaces - ZERO glue code needed!
 */
function SimplePageLayout({ title, children, headerChildren }: SimplePageLayoutProps) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <PageHeader title={title} headerChildren={headerChildren} />

      <div className="w-full flex-1 min-h-0">{children}</div>
    </div>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { PageHeader, TabPageLayout, SimplePageLayout };
export type { TabPageLayoutProps, SimplePageLayoutProps };
