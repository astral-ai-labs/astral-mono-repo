/* ==========================================================================*/
// default-dialog.tsx — Reusable dialog component with flexible animations
/* ==========================================================================*/
// Purpose: Renders a button that opens a modal dialog with configurable styling and animations
// Sections: Imports, Props, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { ReactNode, ComponentType } from "react";

// Local Modules ---
import { DialogContent, DialogTrigger, Dialog } from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface DefaultDialogProps {
  trigger: ReactNode;
  children: ReactNode;
  buttonTrigger?: boolean;
  triggerClassName?: string;
  dialogClassName?: string;
  buttonText?: string;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  // Animation props
  TriggerWrapper?: ComponentType<any>;
  triggerWrapperProps?: any;
  DialogWrapper?: ComponentType<any>;
  dialogWrapperProps?: any;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * DefaultDialog
 *
 * Renders a button or custom trigger that opens a modal dialog.
 * Supports flexible animations through wrapper components.
 *
 * @param trigger - Custom trigger element (used when buttonTrigger is false)
 * @param children - Content to render inside the dialog
 * @param buttonTrigger - Whether to use button trigger (default: false, uses custom trigger)
 * @param triggerClassName - Additional CSS classes for trigger
 * @param dialogClassName - Additional CSS classes for dialog
 * @param buttonText - Optional text for button trigger
 * @param disabled - Whether trigger is disabled
 * @param onOpenChange - Callback when dialog open state changes
 * @param open - Controlled open state
 * @param buttonVariant - Button variant when using button trigger
 * @param buttonSize - Button size when using button trigger
 * @param TriggerWrapper - Optional wrapper component for trigger (e.g., motion.div)
 * @param triggerWrapperProps - Props to pass to TriggerWrapper
 * @param DialogWrapper - Optional wrapper component for dialog content (e.g., motion.div)
 * @param dialogWrapperProps - Props to pass to DialogWrapper
 */
function DefaultDialog({ 
  trigger,
  children, 
  buttonTrigger = false,
  triggerClassName, 
  dialogClassName, 
  buttonText, 
  disabled, 
  onOpenChange,
  open,
  buttonVariant = "outline",
  buttonSize = "sm",
  TriggerWrapper,
  triggerWrapperProps,
  DialogWrapper,
  dialogWrapperProps
}: DefaultDialogProps) {
  
  // Create trigger element
  const triggerContent = buttonTrigger ? (
    <Button 
      variant={buttonVariant} 
      size={buttonSize} 
      disabled={disabled} 
      className={cn("h-7 text-xs !bg-platform-button border !border-platform-button-border text-muted-foreground flex items-center justify-center !cursor-pointer", triggerClassName)}
    >
      {trigger}
      {buttonText && <span className="text-xs ml-2">{buttonText}</span>}
    </Button>
  ) : (
    <span className={cn("cursor-pointer", triggerClassName)}>
      {trigger}
    </span>
  );

  // Wrap trigger with animation wrapper if provided
  const TriggerElement = TriggerWrapper ? (
    <TriggerWrapper {...triggerWrapperProps}>
      {triggerContent}
    </TriggerWrapper>
  ) : (
    triggerContent
  );

  // Create dialog content
  const dialogContent = (
    <DialogContent className={cn("bg-platform-background", dialogClassName)}>
      {children}
    </DialogContent>
  );

  // Wrap dialog content with animation wrapper if provided
  const DialogContentElement = DialogWrapper ? (
    <DialogWrapper {...dialogWrapperProps}>
      {dialogContent}
    </DialogWrapper>
  ) : (
    dialogContent
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {TriggerElement}
      </DialogTrigger>
      {DialogContentElement}
    </Dialog>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { DefaultDialog }; 