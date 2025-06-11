/* ==========================================================================*/
// tooltip-popover.tsx — Tooltip-wrapped popover component
/* ==========================================================================*/
// Purpose: Renders a button/icon with tooltip that opens a popover
// Sections: Imports, Props, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { ReactNode } from "react";

// Local Modules ---
import { TooltipContent, TooltipTrigger, Tooltip, TooltipProvider } from "@workspace/ui/components/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface TooltipPopoverProps {
  tooltipContent: string;
  icon: ReactNode;
  children: ReactNode;
  buttonTrigger?: boolean;
  iconOnly?: boolean;
  triggerClassName?: string;
  popoverClassName?: string;
  buttonText?: string;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  open?: boolean;
  popoverSide?: "top" | "right" | "bottom" | "left";
  popoverSideOffset?: number;
  align?: "start" | "center" | "end";
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * TooltipPopover
 *
 * Renders a button or icon with tooltip that opens a popover.
 * Supports custom trigger elements as first child or default button trigger.
 *
 * @param tooltipContent - Text to display in tooltip
 * @param icon - Icon element to display
 * @param children - Popover content or [trigger, ...content] if custom trigger
 * @param buttonTrigger - Whether to use default button trigger
 * @param iconOnly - Whether to use icon-only styling (matches tooltip-icon.tsx)
 * @param triggerClassName - Additional CSS classes for trigger
 * @param popoverClassName - Additional CSS classes for popover
 * @param buttonText - Optional text for button trigger
 * @param disabled - Whether trigger is disabled
 * @param onOpenChange - Callback when popover open state changes
 * @param side - Tooltip position side
 * @param sideOffset - Tooltip offset from trigger
 * @param open - Controlled open state
 * @param popoverSide - Popover position side
 * @param popoverSideOffset - Popover offset from trigger
 * @param align - Popover alignment
 */
function TooltipPopover({ tooltipContent, icon, children, buttonTrigger, iconOnly = false, triggerClassName, popoverClassName, buttonText, disabled, onOpenChange, side = "top", sideOffset = 2, popoverSide = "bottom", popoverSideOffset = 5, align = "end", open }: TooltipPopoverProps) {
  // Check if first child is meant to be the trigger
  const [triggerChild, ...contentChildren] = Array.isArray(children) ? children : [null, children];

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              {triggerChild ? (
                triggerChild
              ) : iconOnly ? (
                <span className={cn(disabled ? "text-foreground/30 cursor-default" : "text-muted-foreground hover:text-foreground cursor-pointer", triggerClassName)}>{icon}</span>
              ) : buttonTrigger ? (
                <Button variant="outline" size="sm" disabled={disabled} className={cn("h-7 text-xs border-border/70 text-muted-foreground flex items-center justify-center", triggerClassName)}>
                  {icon}
                  {buttonText && <span className="text-xs ml-2">{buttonText}</span>}
                </Button>
              ) : (
                <span className={cn("cursor-pointer", triggerClassName)}>{icon}</span>
              )}
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side={side} sideOffset={sideOffset} className="text-xs bg-platform-background border !border-platform-button-border text-foreground">
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent side={popoverSide} sideOffset={popoverSideOffset} align={align} className={cn("w-44 p-1 bg-platform-background border border-border/50 text-muted-foreground", popoverClassName)}>
        {contentChildren}
      </PopoverContent>
    </Popover>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { TooltipPopover };
