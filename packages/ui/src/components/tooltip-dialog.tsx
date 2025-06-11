/* ==========================================================================*/
// tooltip-dialog.tsx — Tooltip-wrapped dialog component
/* ==========================================================================*/
// Purpose: Renders a button/icon with tooltip that opens a modal dialog
// Sections: Imports, Props, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { ReactNode } from "react";

// Local Modules ---
import { TooltipContent, TooltipTrigger, Tooltip, TooltipProvider } from "@workspace/ui/components/tooltip";
import { DialogContent, DialogTrigger, Dialog } from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface TooltipDialogProps {
  tooltipContent: string;
  icon: ReactNode;
  children: ReactNode;
  buttonTrigger?: boolean;
  triggerClassName?: string;
  dialogClassName?: string;
  buttonText?: string;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * TooltipDialog
 *
 * Renders a button or icon with tooltip that opens a modal dialog.
 *
 * @param tooltipContent - Text to display in tooltip
 * @param icon - Icon element to display
 * @param children - Content to render inside the dialog
 * @param buttonTrigger - Whether to use button trigger (default: icon span)
 * @param triggerClassName - Additional CSS classes for trigger
 * @param dialogClassName - Additional CSS classes for dialog
 * @param buttonText - Optional text for button trigger
 * @param disabled - Whether trigger is disabled
 * @param onOpenChange - Callback when dialog open state changes
 * @param side - Tooltip position side
 * @param sideOffset - Tooltip offset from trigger
 */
function TooltipDialog({ 
  tooltipContent, 
  icon, 
  children, 
  buttonTrigger, 
  triggerClassName, 
  dialogClassName, 
  buttonText, 
  disabled, 
  onOpenChange, 
  side = "top", 
  sideOffset = 2 
}: TooltipDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              {buttonTrigger ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={disabled} 
                  className={cn("h-7 text-xs border-border/70 text-muted-foreground flex items-center justify-center", triggerClassName)}
                >
                  {icon}
                  {buttonText && <span className="text-xs ml-2">{buttonText}</span>}
                </Button>
              ) : (
                <span className={cn("cursor-pointer", triggerClassName)}>
                  {icon}
                </span>
              )}
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent 
            side={side} 
            sideOffset={sideOffset} 
            className="text-xs bg-platform-accent-900 border border-border/50 text-foreground z-[100]"
          >
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className={cn("bg-sidebar", dialogClassName)}>
        {children}
      </DialogContent>
    </Dialog>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { TooltipDialog };