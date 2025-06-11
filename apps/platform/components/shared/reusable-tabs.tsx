/* ==========================================================================*/
// ReusableTabs.tsx — Context-driven tabbed interface component
/* ==========================================================================*/
// Purpose: Ultra-simple tabs component that uses context for routing
// Sections: Imports, Types, Component, Exports

'use client'

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React from "react";

// External Packages -----
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

// Local Hooks ---
import { useActiveTab, useTabNavigation } from "../../hooks/useTabRouting";

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface TabConfig {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface ReusableTabsProps {
  tabs: TabConfig[];
  className?: string;
  children?: React.ReactNode;
  sharedTabsContent?: React.ReactNode;
}

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * ReusableTabs
 * 
 * Ultra-simple tabs component that automatically handles routing via context.
 * No need to manage state or pass routing props - everything is handled globally.
 * 
 * @param tabs - Array of tab configurations with value, label, and content
 * @param className - Additional CSS classes for the container
 * @param children - Optional additional content to render at bottom of tab area
 */
function ReusableTabs({ 
  tabs, 
  className = "",
  children,
  sharedTabsContent
}: ReusableTabsProps) {
  // ✅ Get routing state from context - no prop drilling!
  const activeTab = useActiveTab();
  const setActiveTab = useTabNavigation();

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className={`w-full h-full gap-0 overflow-hidden ${className}`}
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
            className="mt-0 h-full overflow-hidden"
          >
            {tab.content}
            {sharedTabsContent}
          </TabsContent>
        ))}
        
        {children}
      </div>
    </Tabs>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { ReusableTabs };
export type { TabConfig, ReusableTabsProps }; 