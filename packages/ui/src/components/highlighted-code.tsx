/* ==========================================================================*/
// highlighted-code.tsx — Syntax highlighted code display component
/* ==========================================================================*/
// Purpose: Renders code with syntax highlighting, line numbers, and terminal styling
// Sections: Imports, Props, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { useEffect, useState } from "react";

// Local Modules ---
import { highlight, type BundledLanguage } from "@workspace/ui/lib/shiki-utils";
import { cn } from "@workspace/ui/lib/utils";

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface HighlightedCodeProps {
  code: string;
  language?: string;
  terminal?: boolean;
  command?: string;
  initial?: string;
  className?: string;
  preClassName?: string;
  showLines?: boolean;
  forceWrap?: boolean;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * HighlightedCode
 *
 * Renders code with syntax highlighting, optional line numbers, and terminal styling.
 * Supports client-side highlighting with fallback for SSR.
 *
 * @param code - Code string to highlight
 * @param language - Programming language (default: "python")
 * @param terminal - Whether to style as terminal output
 * @param command - Terminal command to highlight (overrides code)
 * @param initial - Initial HTML to show before highlighting
 * @param className - Additional CSS classes for container
 * @param preClassName - Additional CSS classes for pre element
 * @param showLines - Whether to show line numbers
 * @param forceWrap - Whether to force text wrapping
 */
function HighlightedCode({ 
  code, 
  language = "python", 
  terminal, 
  command, 
  initial,
  className = "",
  preClassName = "",
  showLines = true,
  forceWrap = false 
}: HighlightedCodeProps) {
  // If terminal prop is true or command is provided, use bash language
  const effectiveLanguage = terminal || command ? "bash" : language;
  const effectiveCode = command || code;
  
  // State for highlighted HTML
  const [highlightedHtml, setHighlightedHtml] = useState<string | undefined>(initial);
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Highlight code on client side
  useEffect(() => {
    let isMounted = true;
    
    // If initial is provided on first render, use it
    if (isFirstRender && initial) {
      setIsFirstRender(false);
      return;
    }
    
    // Otherwise always re-highlight
    highlight(effectiveCode, effectiveLanguage as BundledLanguage, "github-dark")
      .then(result => {
        if (isMounted) {
          setHighlightedHtml(result);
          setIsFirstRender(false);
        }
      })
      .catch(error => {
        console.error("Error highlighting code:", error);
        if (isMounted) {
          // Fallback to plain text
          setHighlightedHtml(undefined);
          setIsFirstRender(false);
        }
      });
      
    return () => {
      isMounted = false;
    };
  }, [effectiveCode, effectiveLanguage, initial, isFirstRender]);

  // Fallback for when highlighting fails or is loading
  if (!highlightedHtml) {
    return (
      <div className={cn("relative w-full", className)}>
        <pre className={cn("pl-4 sm:pl-12 relative", preClassName)}>
          <code>{effectiveCode}</code>
        </pre>
      </div>
    );
  }

  // Create line numbers based on code content
  const lines = effectiveCode.split("\n");

  return (
    <div className={cn("relative w-full", className)}>
      <div className={cn(
        "pl-4 sm:pl-12 relative",
        forceWrap && "whitespace-pre-wrap break-words overflow-x-auto max-w-full",
        preClassName
      )}>
        {/* Start of Line Numbers --- */}
        {showLines && (
          <div className="absolute top-0 left-0 select-none hidden sm:block">
            {lines.map((_, idx) => (
              <div key={idx} className="text-gray-400 text-right pr-4 w-12 leading-[25px]">
                {idx + 1}
              </div>
            ))}
          </div>
        )}
        {/* End of Line Numbers ---- */}

        {/* Start of Code Content --- */}
        <div className="code-content">
          <div 
            className={cn(
              forceWrap && "whitespace-pre-wrap break-words max-w-full"
            )}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </div>
        {/* End of Code Content ---- */}
      </div>
    </div>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { HighlightedCode }; 