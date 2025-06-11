/* ==========================================================================*/
// tooltip-dropdown-menu.tsx — Tooltip-wrapped dropdown menu component
/* ==========================================================================*/
// Purpose: Renders a button/icon with tooltip that opens a dropdown menu
// Sections: Imports, Props, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { ReactNode } from "react";

// Local Modules ---
import { TooltipContent, TooltipTrigger, Tooltip, TooltipProvider } from "@workspace/ui/components/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface TooltipDropdownMenuProps {
  tooltipContent: string;
  icon: ReactNode;
  children: ReactNode;
  buttonTrigger?: boolean;
  triggerClassName?: string;
  dropdownClassName?: string;
  buttonText?: string;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  open?: boolean;
  dropdownSide?: "top" | "right" | "bottom" | "left";
  dropdownSideOffset?: number;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * TooltipDropdownMenu
 *
 * Renders a button or icon with tooltip that opens a dropdown menu.
 * Supports custom trigger elements as first child or default button trigger.
 *
 * @param tooltipContent - Text to display in tooltip
 * @param icon - Icon element to display
 * @param children - Menu content or [trigger, ...content] if custom trigger
 * @param buttonTrigger - Whether to use default button trigger
 * @param triggerClassName - Additional CSS classes for trigger
 * @param dropdownClassName - Additional CSS classes for dropdown
 * @param buttonText - Optional text for button trigger
 * @param disabled - Whether trigger is disabled
 * @param onOpenChange - Callback when dropdown open state changes
 * @param side - Tooltip position side
 * @param sideOffset - Tooltip offset from trigger
 * @param open - Controlled open state
 * @param dropdownSide - Dropdown position side
 * @param dropdownSideOffset - Dropdown offset from trigger
 */
function TooltipDropdownMenu({ 
  tooltipContent, 
  icon, 
  children, 
  buttonTrigger, 
  triggerClassName, 
  dropdownClassName, 
  buttonText, 
  disabled, 
  onOpenChange, 
  side = "top", 
  sideOffset = 2, 
  dropdownSide = "bottom", 
  dropdownSideOffset = 5, 
  open 
}: TooltipDropdownMenuProps) {
  // Check if first child is meant to be the trigger
  const [triggerChild, ...contentChildren] = Array.isArray(children) ? children : [null, children];

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              {triggerChild ? (
                triggerChild
              ) : buttonTrigger ? (
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
            </DropdownMenuTrigger>
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
      <DropdownMenuContent 
        side={dropdownSide} 
        sideOffset={dropdownSideOffset} 
        className={cn("bg-platform-accent-900 border border-border/50 text-foreground", dropdownClassName)}
      >
        {contentChildren}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { TooltipDropdownMenu };
