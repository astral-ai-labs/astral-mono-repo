/* ==========================================================================*/
// index.tsx — MCP prompts tab component
/* ==========================================================================*/
// Purpose: Renders MCP prompts management interface with two-column layout
// Sections: Imports, Animation Variants, Components, Main Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React, { useState } from "react";

// External Packages -----
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MessageSquare, MessageCircleMore } from "lucide-react";

// Local Components ---
import { MCPFunctionalityCard, type FunctionalityItem } from "../shared/mcp-resources";
import { PromptIDE } from "./prompts-ide";

// Local Data ---
import { PROMPTS_DUMMY_DATA } from "./prompt-dummy";

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
 * Prompts
 *
 * MCP prompts management tab with two-column layout
 */
function Prompts() {
  const shouldReduceMotion = useReducedMotion();
  const selectedAnimations = shouldReduceMotion ? animations.reducedMotion : animations;

  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<FunctionalityItem[]>(PROMPTS_DUMMY_DATA);

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId) || null;

  const handleDelete = (id: string) => {
    console.log(`Deleting prompt with id: ${id}`);
    setPrompts(prev => prev.filter(prompt => prompt.id !== id));
    if (selectedPromptId === id) {
      setSelectedPromptId(prompts.length > 1 ? prompts.find(p => p.id !== id)?.id || null : null);
    }
  };

  const handleSelectPrompt = (id: string) => {
    setSelectedPromptId(id);
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
              {prompts.length > 0 ? (
                <div className="space-y-6">
                  <AnimatePresence>
                    {prompts.map((prompt) => (
                      <MCPFunctionalityCard 
                        key={prompt.id} 
                        item={prompt} 
                        icon={MessageCircleMore} 
                        onDelete={handleDelete} 
                        onSelect={handleSelectPrompt} 
                        isSelected={selectedPromptId === prompt.id} 
                        cardType="prompt" 
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="border border-border rounded-lg p-8 text-center h-full flex flex-col justify-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No prompts configured</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create your first prompt template to get started</p>
                  <Button>Add Your First Prompt</Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Prompt IDE --- */}
        <motion.div className="mcp-right-panel" {...selectedAnimations.rightPanel}>
          <PromptIDE selectedPrompt={selectedPrompt} onClose={() => setSelectedPromptId(null)} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { Prompts };
