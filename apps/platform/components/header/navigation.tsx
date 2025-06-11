/* ==========================================================================*/
// navigation.tsx — Platform navigation component with dynamic highlighting
/* ==========================================================================*/
// Purpose: Renders navigation tabs with hover effects and pathname-based active state
// Sections: Imports, Props, Component, Helpers, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { useState, useRef, useEffect, useCallback } from "react";

// Next.js ---
import { usePathname } from "next/navigation";
import Link from "next/link";

// External Packages ---
import { Card, CardContent } from "@workspace/ui/components/card";

// Local Files ---
import { DUMMY_PROJECTS, DUMMY_USER, PLATFORM_TABS } from "../../constants";

// Local Utils ---
import { cn } from "@workspace/ui/lib/utils";
import { ProjectSwitcher } from "./projects";
import { NavUser } from "./user";

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * PlatformNavigation
 *
 * Navigation component with hover effects and pathname-based active highlighting.
 * Uses smooth transitions for hover states and active indicators.
 */
export function PlatformNavigation() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ==========================================================================*/
  // Helpers
  /* ==========================================================================*/

  /**
   * Helper function to check if a path is active
   *
   * @param href - The route slug to check against current pathname
   * @returns Boolean indicating if the route is currently active
   */
  const isActive = useCallback(
    (href: string) => {
      if (!pathname) return false;
      return pathname.includes(href);
    },
    [pathname]
  );

  /**
   * Get the index of the currently active tab based on pathname
   */
  const getActiveIndex = useCallback(() => {
    return PLATFORM_TABS.findIndex((tab) => isActive(tab.slug));
  }, [isActive]);

  /**
   * Ref callback to store tab element references
   */
  const setTabRef = (index: number, el: HTMLDivElement | null) => {
    tabRefs.current[index] = el;
  };

  /* ==========================================================================*/
  // Effects
  /* ==========================================================================*/

  // Update hover highlight position
  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  // Update active indicator position based on pathname
  useEffect(() => {
    const activeIndex = getActiveIndex();
    if (activeIndex >= 0) {
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [pathname, getActiveIndex]);

  // Initialize active indicator position
  useEffect(() => {
    requestAnimationFrame(() => {
      const activeIndex = getActiveIndex();
      if (activeIndex >= 0) {
        const activeElement = tabRefs.current[activeIndex];
        if (activeElement) {
          const { offsetLeft, offsetWidth } = activeElement;
          setActiveStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      }
    });
  }, [getActiveIndex]);

  const activeIndex = getActiveIndex();

  return (
    <div className="overflow-x-scroll invisible-scrollbar border-b lg:border-none border-border">
      <div className="w-fit px-4">
        {/* Start of Navigation --- */}
        <Card className={cn("w-full border-none shadow-none bg-transparent p-0")}>
          <CardContent className={cn("p-0 py-3")}>
            <div className="relative">
              {/* Start of Navigation Elements --- */}

              {/* Hover Highlight */}
              <div
                className="absolute h-[30px] transition-all duration-300 ease-out bg-platform-accent-900/50 rounded-[6px] flex items-center"
                style={{
                  ...hoverStyle,
                  opacity: hoveredIndex !== null ? 1 : 0,
                }}
              />

              {/* Active Indicator */}
              <div className="absolute bottom-[-12px] h-[2px] bg-foreground transition-all duration-300 ease-out" style={activeStyle} />

              {/* Tabs */}
              <div className="relative flex space-x-[4px] items-center">
                {PLATFORM_TABS.map((tab, index) => (
                  <div key={tab.slug} ref={(el) => setTabRef(index, el)} className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] ${index === activeIndex ? "text-foreground" : "text-muted-foreground/80 hover:text-foreground"}`} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                    <Link href={`/${tab.slug}`} className="block w-full h-full">
                      <div className="text-[14px] font-light leading-5 whitespace-nowrap flex items-center justify-center h-full">{tab.name}</div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* End of Navigation Elements --- */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
