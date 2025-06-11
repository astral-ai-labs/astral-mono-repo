/* ==========================================================================*/
// index.tsx — Main platform navigation header component
/* ==========================================================================*/
// Purpose: Renders the complete platform header with project switcher, navigation, and user menu
// Sections: Imports, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// Local Components ---
import { ProjectSwitcher } from "./projects";
import { NavUser } from "./user";
import { PlatformNavigation } from "./navigation";
import { useHeaderCollapse } from "../../hooks/useHeaderCollapse";

// Local Files ---
import { DUMMY_PROJECTS, DUMMY_USER } from "../../constants";

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * PlatformNavbar
 *
 * Main platform navigation header component that combines project switching,
 * documentation access, user menu, and tab navigation into a cohesive header.
 *
 * Features:
 * - Project switcher with team branding
 * - User profile dropdown
 * - Platform navigation tabs
 * - Collapsible header functionality
 */
export function PlatformNavbar() {
  const { isCollapsed, toggleCollapse } = useHeaderCollapse();

  return (
    <header className="w-full pt-2 transition-all duration-300 ease-in-out">
      <div className="flex w-full flex-col">
        {/* Header Content */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? "max-h-0" : "max-h-[100px]"}`}>
          {/* Project Switcher + User + Toggle */}
          <div className="flex justify-between items-center pt-1 px-4">
            <ProjectSwitcher projects={DUMMY_PROJECTS} accountInfo={DUMMY_USER.accountInfo} />
            <div className="flex items-center gap-2">
              <NavUser user={DUMMY_USER} />
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-0">
            <PlatformNavigation />
          </div>
        </div>
      </div>
    </header>
  );
}
