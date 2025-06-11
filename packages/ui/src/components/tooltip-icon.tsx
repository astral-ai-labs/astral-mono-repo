/* ==========================================================================*/
// tooltip-icon.tsx — Tooltip-wrapped clickable icon component
/* ==========================================================================*/
// Purpose: Renders a clickable icon with tooltip hover functionality
// Sections: Imports, Props, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { ReactNode } from "react";

// Local Modules ---
import { TooltipContent, TooltipTrigger, Tooltip, TooltipProvider } from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface TooltipActionIconProps {
  tooltipContent: string;
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * TooltipActionIcon
 *
 * Renders a clickable icon with tooltip that appears on hover.
 *
 * @param tooltipContent - Text to display in tooltip
 * @param icon - Icon element to display
 * @param onClick - Click handler function
 * @param className - Additional CSS classes
 * @param onMouseEnter - Mouse enter handler
 * @param onMouseLeave - Mouse leave handler
 * @param disabled - Whether the icon is disabled (defaults to false)
 */
function TooltipActionIcon({ 
  tooltipContent, 
  icon, 
  onClick, 
  className, 
  onMouseEnter, 
  onMouseLeave,
  disabled = false
}: TooltipActionIconProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span 
            className={cn(
              disabled 
                ? "text-foreground/30 cursor-default" 
                : "text-muted-foreground hover:text-foreground cursor-pointer",
              className
            )} 
            onClick={disabled ? undefined : onClick} 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave}
          >
            {icon}
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-xs bg-platform-background border border-border/50 text-foreground">
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { TooltipActionIcon };
