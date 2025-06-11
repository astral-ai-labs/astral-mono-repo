/* ==========================================================================*/
// projects.tsx — Project switcher dropdown component
/* ==========================================================================*/
// Purpose: Renders project selection dropdown with team branding and shortcuts
// Sections: Imports, Types, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import * as React from "react";

// External Packages ---
import { ChevronsUpDown, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";

// Package Files ---
import { OwnerType } from "@workspace/keychain/types";

// Local Utils ---
import { cn } from "@workspace/ui/lib/utils";

/* ==========================================================================*/
// Types
/* ==========================================================================*/

interface Project {
  id: string;
  name: string;
}

type AccountInfo = {
  accountType: OwnerType;
  teamName?: string;
  individualPlan?: string;
}

interface ProjectSwitcherProps {
  projects: Project[];
  accountInfo?: AccountInfo;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * ProjectSwitcher
 * 
 * Project selection dropdown with visual prominence.
 * 
 * @param projects - Array of available projects
 * @param accountInfo - Account information for branding
 */
function ProjectSwitcher({ projects, accountInfo }: ProjectSwitcherProps) {
  // Account info extraction
  const accountType = accountInfo?.accountType || "individual";
  const teamName = accountInfo?.teamName;
  const individualPlan = accountInfo?.individualPlan || "Hobby";
  const isOrganization = accountType === "organization";
  const displayName = isOrganization ? teamName : "Individual";
  const badgeText = isOrganization ? "Team" : individualPlan;

  const [activeProject, setActiveProject] = React.useState(projects[0]);

  // Early return if no active project
  if (!activeProject) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "h-9 w-44 px-3 text-sm font-semibold bg-background/50 backdrop-blur-sm",
            "hover:bg-platform-accent-900 hover:text-accent-foreground hover:border-border",
            "data-[state=open]:bg-platform-accent-900 data-[state=open]:text-accent-foreground data-[state=open]:border-border",
            "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none !focus-visible:hover:border focus-visible:border-border",
            "transition-all duration-200 ease-in-out",
            "shadow-sm hover:shadow-md"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-foreground/80 text-sm">{activeProject.name}</span>
            </div>
            <ChevronsUpDown className="h-3 w-3 text-muted-foreground/70 flex-shrink-0" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-64 p-2" 
        align="start" 
        side="bottom" 
        sideOffset={8}
      >
        {/* Account Section */}
        <DropdownMenuLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Account
        </DropdownMenuLabel>
        <div className="px-2 py-1 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {displayName}
            </span>
            <Badge variant="secondary" className="text-xs">
              {badgeText}
            </Badge>
          </div>
        </div>
        <DropdownMenuSeparator className="mb-2" />

        {/* Projects Section */}
        <DropdownMenuLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Projects
        </DropdownMenuLabel>

        <div className="mt-2 space-y-1">
          {projects.map((project, index) => (
            <DropdownMenuItem 
              key={project.id} 
              onClick={() => setActiveProject(project)} 
              className={cn(
                "rounded-md px-2 py-2 text-sm cursor-pointer transition-colors group",
                "focus:bg-platform-accent-900 focus:text-accent-foreground",
                activeProject.id === project.id 
                  ? "bg-platform-accent-900 text-accent-foreground font-medium" 
                  : "text-foreground hover:bg-platform-accent-900 hover:text-accent-foreground"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-2 w-2 rounded-full transition-colors duration-200",
                    activeProject.id === project.id 
                      ? "bg-emerald-500" 
                      : "bg-platform-accent-900-foreground/50 group-hover:bg-emerald-500"
                  )}></div>
                  <span>{project.name}</span>
                </div>
                <DropdownMenuShortcut className="text-xs">
                  ⌘{index + 1}
                </DropdownMenuShortcut>
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Create Project */}
        <DropdownMenuItem className={cn(
          "rounded-md px-2 py-2 text-sm cursor-pointer",
          "text-muted-foreground hover:text-foreground hover:bg-platform-accent-900",
          "transition-colors duration-150"
        )}>
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Project</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ==========================================================================*/
// Exports
/* ==========================================================================*/

export { ProjectSwitcher };
