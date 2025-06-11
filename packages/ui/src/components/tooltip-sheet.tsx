/* ==========================================================================*/
// tooltip-sheet.tsx — Tooltip-wrapped sheet component
/* ==========================================================================*/
// Purpose: Renders a button with tooltip that opens a sheet sidebar
// Sections: Imports, Props, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { ReactNode } from "react";

// Local Modules ---
import { Sheet, SheetTrigger, SheetContent } from "@workspace/ui/components/sheet";
import { TooltipContent, TooltipTrigger, Tooltip, TooltipProvider } from "@workspace/ui/components/tooltip";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface TooltipSheetProps {
  tooltipContent: string;
  icon: ReactNode;
  children: ReactNode;
  buttonClassName?: string;
  sheetClassName?: string;
  buttonText?: string;
  side?: "top" | "right" | "bottom" | "left";
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * TooltipSheet
 *
 * Renders a button with tooltip that opens a sheet sidebar.
 *
 * @param tooltipContent - Text to display in tooltip
 * @param icon - Icon element to display in button
 * @param children - Content to render inside the sheet
 * @param buttonClassName - Additional CSS classes for button
 * @param sheetClassName - Additional CSS classes for sheet
 * @param buttonText - Optional text to display next to icon
 * @param side - Side of screen where sheet opens
 * @param disabled - Whether button is disabled
 * @param onOpenChange - Callback when sheet open state changes
 */
function TooltipSheet({ 
  tooltipContent, 
  icon, 
  children, 
  buttonClassName, 
  sheetClassName, 
  buttonText, 
  side = "right", 
  disabled, 
  onOpenChange 
}: TooltipSheetProps) {
  return (
    <Sheet onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={disabled} 
                className={cn("h-7 text-xs border-border/70 text-muted-foreground flex items-center justify-center", buttonClassName)}
              >
                {icon}
                {buttonText && <span className="text-xs ml-2">{buttonText}</span>}
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent className="text-xs bg-platform-accent-900 border border-border/50 text-foreground">
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent 
        side={side} 
        className={cn("bg-sidebar min-w-[400px] lg:min-w-[500px] flex flex-col", sheetClassName)}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { TooltipSheet };
