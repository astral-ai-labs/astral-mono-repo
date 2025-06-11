/* ==========================================================================*/
// tooltip-button.tsx — Tooltip-wrapped button component
/* ==========================================================================*/
// Purpose: Renders a button with tooltip that appears on hover
// Sections: Imports, Props, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { ReactNode } from "react";

// Local Modules ---
import { TooltipContent, TooltipTrigger, Tooltip, TooltipProvider } from "@workspace/ui/components/tooltip";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface TooltipButtonProps {
  tooltipContent: string;
  icon: ReactNode;
  text?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;  
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * TooltipButton
 *
 * Renders a button with tooltip that appears on hover.
 *
 * @param tooltipContent - Text to display in tooltip
 * @param icon - Icon element to display in button
 * @param text - Optional text to display next to icon
 * @param onClick - Click handler function
 * @param className - Additional CSS classes for button
 * @param disabled - Whether button is disabled
 * @param delayDuration - Delay before tooltip appears (ms)
 * @param side - Tooltip position side
 * @param sideOffset - Tooltip offset from button
 */
function TooltipButton({ 
  tooltipContent, 
  icon, 
  text, 
  onClick, 
  className, 
  disabled, 
  delayDuration = 100, 
  side = "top", 
  sideOffset = 2 
}: TooltipButtonProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClick} 
              disabled={disabled} 
              className={cn("h-7 text-xs border-border/70 text-muted-foreground flex items-center justify-center", className)}
            >
              {icon}
              {text && <span className="text-xs ml-2">{text}</span>}
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          sideOffset={sideOffset} 
          className="text-xs bg-platform-accent-900 p-2 rounded-md border border-border/50 text-foreground"
        >
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { TooltipButton };
