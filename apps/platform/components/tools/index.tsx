/* ==========================================================================*/
// index.tsx — MCP tools tab component
/* ==========================================================================*/
// Purpose: Renders MCP tools management interface with two-column layout
// Sections: Imports, Animation Variants, Components, Main Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React, { useState } from "react";

// External Packages -----
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Wrench } from "lucide-react";

// Local Components ---
import { MCPFunctionalityCard, type FunctionalityItem } from "../shared/mcp-resources";
import { ToolIDE } from "./tools-ide";

// Local Data ---
import { TOOLS_DUMMY_DATA } from "./tool-dummy";

// Workspace UI Components ---
import { Button } from "@workspace/ui/components/button";

/* ==========================================================================*/
// Animation Variants
/* ==========================================================================*/

const animations = {
  container: {
    initial: {
      transformPerspective: 1000,
    },
    animate: {
      transformPerspective: 1000,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  },

  header: {
    initial: { opacity: 0, y: -5, z: 10 },
    animate: { opacity: 1, y: 0, z: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  leftPanel: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  rightPanel: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: "easeOut", delay: 0.1 },
  },

  reducedMotion: {
    container: {
      initial: {},
      animate: {},
    },
    header: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    leftPanel: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    rightPanel: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
  },
};

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * Tools
 *
 * MCP tools management tab with two-column layout
 */
function Tools() {
  const shouldReduceMotion = useReducedMotion();
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [tools, setTools] = useState<FunctionalityItem[]>(TOOLS_DUMMY_DATA);

  const selectedTool = tools.find((t) => t.id === selectedToolId) || null;

  const handleDelete = (id: string) => {
    console.log(`Deleting tool with id: ${id}`);
    setTools(prev => prev.filter(tool => tool.id !== id));
    if (selectedToolId === id) {
      setSelectedToolId(tools.length > 1 ? tools.find(t => t.id !== id)?.id || null : null);
    }
  };

  const handleSelectTool = (id: string) => {
    setSelectedToolId(id);
  };

  return (
    <motion.div className="mcp-motion-container" style={{ transformStyle: "preserve-3d" }} {...selectedAnimations.container}>
      {/* Two Column Layout --- */}
      <div className="mcp-two-column-layout">
        {/* Left Panel - Scrollable Cards --- */}
        <motion.div className="mcp-left-panel" {...selectedAnimations.leftPanel}>
          {/* Scrollable Content --- */}
          <div className="mcp-scrollable-content scrollbar-astral">
            <div className="pr-10 py-5 pl-3">
              {tools.length > 0 ? (
                <div className="space-y-6">
                  <AnimatePresence>
                    {tools.map((tool) => (
                      <MCPFunctionalityCard 
                        key={tool.id} 
                        item={tool} 
                        icon={Wrench} 
                        onDelete={handleDelete} 
                        onSelect={handleSelectTool} 
                        isSelected={selectedToolId === tool.id} 
                        cardType="tool" 
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="border border-border rounded-lg p-8 text-center h-full flex flex-col justify-center">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No tools configured</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add your first tool integration to get started</p>
                  <Button>Add Your First Tool</Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Tool IDE --- */}
        <motion.div className="mcp-right-panel" {...selectedAnimations.rightPanel}>
          <ToolIDE selectedTool={selectedTool} onClose={() => setSelectedToolId(null)} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { Tools }; 