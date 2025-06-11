/* ==========================================================================*/
// mcp-functionality-card.tsx — Shared card component for MCP prompts and tools
/* ==========================================================================*/
// Purpose: Reusable animated card component for MCP functionality items
// Sections: Imports, Types, Animation Variants, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React from "react";

// External Packages -----
import { motion, useReducedMotion } from "motion/react";
import { Code, Copy, Server, Plus, Trash2, LucideIcon, MoreVertical } from "lucide-react";

// Workspace UI Components ---
import { TooltipPopover } from "@workspace/ui/components/tooltip-popover";

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface FunctionalityItem {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  updatedOn: string;
}

interface MCPFunctionalityCardProps {
  item: FunctionalityItem;
  icon: LucideIcon;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  cardType: "prompt" | "tool";
}

interface MCPResourcesHeaderProps {
  count: number;
  countTotal: number;
}

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

const animations = {
  card: {
    initial: {
      opacity: 0,
      scale: 0.9,
      y: 10,
      z: 20,
      rotateX: -5,
      transformPerspective: 1000,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      z: 0,
      rotateX: 0,
      transformPerspective: 1000,
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 10,
      z: -20,
      rotateX: 5,
      transformPerspective: 1000,
    },
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
    },
  },

  reducedMotion: {
    card: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    },
  },
};

/* ==========================================================================*/
// MCP Resources Card Header Component
/* ==========================================================================*/

/**
 * MCPResourcesHeader
 *
 * Fixed header component for MCP resources cards
 */
function MCPResourcesHeader({ count, countTotal }: MCPResourcesHeaderProps) {
  return (
    <div className="shrink-0">
      <div className="flex items-center justify-between">
        {/* For future use --- */}
        <div></div>

        {/* Showing count of total count --- */}
        <span className="text-[11px] text-muted-foreground/80">
          Showing {count} of {countTotal}
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================*/
// MCP Resources Card Component
/* ==========================================================================*/

/**
 * MCPFunctionalityCard
 *
 * Shared card component for MCP prompts and tools with animations and interactions
 */
function MCPFunctionalityCard({ item, icon: Icon, onDelete, onSelect, isSelected = false, cardType }: MCPFunctionalityCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(item.id);
    }
  };

  const handleAction = (action: string) => {
    console.log(`${action} action for ${cardType} ${item.id}`);

    switch (action) {
      case "open":
        if (onSelect) onSelect(item.id);
        break;
      case "duplicate":
        // Handle duplicate
        break;
      case "add-to-server":
        // Handle add to server
        break;
      case "create-server":
        // Handle create new server
        break;
      case "delete":
        onDelete(item.id);
        break;
    }
  };

  return (
    <motion.div layout layoutId={`${cardType}-card-${item.id}`} style={{ transformStyle: "preserve-3d" }} {...selectedAnimations.card} onClick={handleCardClick} className={`group relative pt-2 rounded-lg border bg-input/10 duration-200 transition-all ${isSelected ? "border-border bg-muted/30" : "border-border hover:border-border/80 cursor-pointer"}`} onMouseEnter={() => {}} onMouseLeave={() => {}}>
      {/* Card Header --- */}
      <div className="flex items-center justify-between px-2 h-[40px]">
        <div className="flex items-center gap-2">
          <div className="p-2 ml-0.5 rounded-md border border-border bg-background/50 shrink-0">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className={`text-[12.5px] text-foreground/70 select-none font-medium truncate 
                ${isSelected ? "text-foreground" : ""}`}
            >
              {item.name}
            </span>
          </div>
        </div>

        {/* Actions Menu --- */}
        <div className="flex items-center gap-1 transition-opacity duration-200 shrink-0" onClick={(e) => e.stopPropagation()}>
          <TooltipPopover tooltipContent="Actions" icon={<MoreVertical className="h-3.5 w-3.5" />} iconOnly={true} triggerClassName="p-1 rounded">
            <div className="flex flex-col gap-1 p-1">
              <button onClick={() => handleAction("open")} className="flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-muted/50 transition-colors text-left w-full">
                <Code className="h-3.5 w-3.5" />
                Open in IDE
              </button>
              <button onClick={() => handleAction("duplicate")} className="flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-muted/50 transition-colors text-left w-full">
                <Copy className="h-3.5 w-3.5" />
                Duplicate
              </button>
              <div className="h-px bg-border/50 my-1" />
              <button onClick={() => handleAction("add-to-server")} className="flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-muted/50 transition-colors text-left w-full">
                <Server className="h-3.5 w-3.5" />
                Add to Server
              </button>
              <button onClick={() => handleAction("create-server")} className="flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-muted/50 transition-colors text-left w-full">
                <Plus className="h-3.5 w-3.5" />
                Create New Server
              </button>
              <div className="h-px bg-border/50 my-1" />
              <button onClick={() => handleAction("delete")} className="flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-destructive/20 transition-colors text-left w-full text-red-600 hover:text-red-700">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </TooltipPopover>
        </div>
      </div>

      {/* Card Content --- */}
      <div className="py-1">
        <p className="text-xs px-3 text-muted-foreground/80 mb-4 line-clamp-2 leading-relaxed">{item.description}</p>

        {/* Card Footer - Metadata --- */}
        <div className="flex items-center justify-between text-[10px] px-3 text-muted-foreground pt-2 pb-1 border-t border-border/50">
          <span>{item.createdBy}</span>
          <span>{item.updatedOn}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { MCPFunctionalityCard, MCPResourcesHeader };
export type { FunctionalityItem, MCPFunctionalityCardProps, MCPResourcesHeaderProps };
