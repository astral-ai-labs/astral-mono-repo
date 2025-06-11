/* ==========================================================================*/
// prompts-ide.tsx — Prompt IDE component for editing prompt templates
/* ==========================================================================*/
// Purpose: Provides an IDE interface for editing prompt templates with stats and empty state
// Sections: Imports, Props, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React, { useState } from "react";

// External Packages -----
import { MessageSquare, Plus } from "lucide-react";

// Local Components ---
import { MCPIDEContainer } from "../mcp-servers/mcp-ide-container";

// Local Data ---
import { generatePromptTemplate } from "./prompt-dummy";

// Local Types ---
import type { FunctionalityItem } from "../shared/mcp-resources";

// Workspace UI Components ---
import { Button } from "@workspace/ui/components/button";

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface PromptIDEProps {
  selectedPrompt: FunctionalityItem | null;
  onClose: () => void;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * PromptIDE
 *
 * IDE component for editing prompt templates with live stats and empty state handling.
 *
 * @param selectedPrompt - The currently selected prompt to edit
 * @param onClose - Function to call when closing the IDE
 */
function PromptIDE({ selectedPrompt, onClose }: PromptIDEProps) {
  const [promptContent, setPromptContent] = useState(
    selectedPrompt ? generatePromptTemplate(selectedPrompt) : ""
  );

  const footerContent = (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span>Lines: {promptContent.split("\n").length}</span>
        <span>Characters: {promptContent.length}</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Updated {selectedPrompt?.updatedOn}</span>
      </div>
    </div>
  );

  const emptyStateAction = (
    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
      <Plus className="h-4 w-4 mr-2" />
      Create New Prompt
    </Button>
  );

  return (
    <MCPIDEContainer
      icon={selectedPrompt ? MessageSquare : undefined}
      title={selectedPrompt?.name}
      onClose={selectedPrompt ? onClose : undefined}
      footerContent={selectedPrompt ? footerContent : undefined}
      isEmpty={!selectedPrompt}
      emptyStateIcon={MessageSquare}
      emptyStateTitle="Click a prompt to edit it in the prompt IDE"
      emptyStateDescription="Select a prompt from the left panel to start editing, or create a new one to get started with your AI assistant templates."
      emptyStateAction={emptyStateAction}
    >
      <textarea 
        value={promptContent} 
        onChange={(e) => setPromptContent(e.target.value)} 
        placeholder="Enter your prompt template here..." 
        className="w-full h-full resize-none border-r border-border/50 p-6 text-sm font-mono bg-background/50 backdrop-blur-sm focus-visible:outline-none rounded-none transition-all duration-200 shadow-sm" 
      />
    </MCPIDEContainer>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { PromptIDE };