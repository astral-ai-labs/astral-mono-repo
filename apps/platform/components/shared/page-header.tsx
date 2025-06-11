"use client";
/* ==========================================================================*/
// page-header.tsx — Reusable page header component
/* ==========================================================================*/
// Purpose: Standardized page header with title and optional actions
// Sections: Imports, Types, Components, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React from "react";

// External Packages ---
import { ChevronUp, ChevronDown } from "lucide-react";

// Local Modules ---
import { useHeaderCollapse } from "../../hooks/useHeaderCollapse";
import { TooltipActionIcon } from "@workspace/ui/components/tooltip-icon";

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface PageHeaderProps {
  title: string;
  headerChildren?: React.ReactNode;
}

/* ==========================================================================*/
// Page Header Component
/* ==========================================================================*/

/**
 * PageHeader
 *
 * Standardized page header with title and optional actions
 */
function PageHeader({ title, headerChildren }: PageHeaderProps) {
  const { isCollapsed, toggleCollapse } = useHeaderCollapse();

  return (
    <header className="flex h-12 items-center justify-between border-b border-border px-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <TooltipActionIcon 
          tooltipContent={isCollapsed ? "Expand header" : "Collapse header"} 
          icon={isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />} 
          onClick={toggleCollapse} 
          className="p-1.5 rounded-md hover:bg-muted/50 transition-colors duration-200" 
        />
        <span className="flex items-center tracking-wide font-medium text-muted-foreground hover:text-primary transition-colors">{title}</span>
      </div>
      {headerChildren && headerChildren}
    </header>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { PageHeader };
