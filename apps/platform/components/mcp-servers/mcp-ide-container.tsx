/* ==========================================================================*/
// mcp-ide-container.tsx — Reusable IDE container component
/* ==========================================================================*/
// Purpose: Provides a structured IDE layout with header, content, and footer
// Sections: Imports, Props, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React, { ReactNode } from "react";

// External Packages -----
import { LucideIcon, X, ArrowLeftRight  } from "lucide-react";

// Workspace UI Components ---
import { TooltipActionIcon } from "@workspace/ui/components/tooltip-icon";

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface MCPIDEContainerProps {
  // Header props
  icon?: LucideIcon;
  title?: string;
  onClose?: () => void;
  
  // Content props
  children: ReactNode;
  
  // Footer props
  footerContent?: ReactNode;
  
  // State props
  isEmpty?: boolean;
  emptyStateIcon?: LucideIcon;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateAction?: ReactNode;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * MCPIDEContainer
 *
 * Reusable IDE container with minimalistic header, content area, and footer.
 * Provides fixed height layout with proper scroll handling.
 *
 * @param icon - Icon to display in header (optional)
 * @param title - Main title in header (optional)
 * @param onClose - Function to call when close button is clicked
 * @param children - Main content area (usually textarea or editor)
 * @param footerContent - Content for footer area
 * @param isEmpty - Whether to show empty state
 * @param emptyStateIcon - Icon for empty state
 * @param emptyStateTitle - Title for empty state
 * @param emptyStateDescription - Description for empty state
 * @param emptyStateAction - Action button for empty state
 */
function MCPIDEContainer({
  title,
  onClose,
  children,
  footerContent,
  isEmpty = false,
  emptyStateIcon: EmptyIcon,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateAction,
}: MCPIDEContainerProps) {
  
  if (isEmpty && EmptyIcon) {
    return (
      <div className="ide-empty-state">
        <EmptyIcon className="ide-empty-icon" />
        <h3 className="ide-empty-title">{emptyStateTitle}</h3>
        <p className="ide-empty-description">
          {emptyStateDescription}
        </p>
        {emptyStateAction}
      </div>
    );
  }

  return (
    <div className="ide-container">
      {/* Minimalistic Header --- */}
      {title && (
        <div className="ide-header">
          <div className="ide-header-content">
            <div className="ide-header-info">
              <span className="ide-header-title">{title}</span>
            </div>
            {onClose && (
              <TooltipActionIcon
                tooltipContent="Close"
                icon={<ArrowLeftRight className="h-3.5 w-3.5" />}
                onClick={onClose}
              />
            )}
          </div>
        </div>
      )}

      {/* IDE Content --- */}
      <div className="ide-content">
        {children}
      </div>

      {/* IDE Footer --- */}
      {footerContent && (
        <div className="ide-footer">
          {footerContent}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { MCPIDEContainer };
export type { MCPIDEContainerProps }; 