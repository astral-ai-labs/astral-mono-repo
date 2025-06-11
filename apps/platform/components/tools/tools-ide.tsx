/* ==========================================================================*/
// tools-ide.tsx — Tool configuration IDE component
/* ==========================================================================*/
// Purpose: Renders tool configuration interface with code editor
// Sections: Imports, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React, { useState } from "react";

// External Packages -----
import { Wrench, Plus } from "lucide-react";

// Local Components ---
import { MCPIDEContainer } from "../mcp-servers/mcp-ide-container";
import type { FunctionalityItem } from "../shared/mcp-resources";

// Workspace UI Components ---
import { Button } from "@workspace/ui/components/button";

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

interface ToolIDEProps {
  selectedTool: FunctionalityItem | null;
  onClose: () => void;
}

/**
 * ToolIDE
 *
 * Tool configuration IDE with code editor and empty state
 */
function ToolIDE({ selectedTool, onClose }: ToolIDEProps) {
  const [toolConfig, setToolConfig] = useState(
    selectedTool 
      ? `{
  "name": "${selectedTool.name.toLowerCase().replace(/\s+/g, '_')}",
  "description": "${selectedTool.description}",
  "version": "1.0.0",
  "configuration": {
    "endpoint": "https://api.example.com",
    "authentication": {
      "type": "bearer_token",
      "token": "your-token-here"
    },
    "timeout": 30000,
    "retries": 3
  },
  "parameters": {
    "input_format": "json",
    "output_format": "json",
    "validation": true
  },
  "capabilities": [
    "read",
    "write",
    "execute"
  ]
}`
      : ""
  );

  const footerContent = (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span>Lines: {toolConfig.split('\n').length}</span>
        <span>Size: {new Blob([toolConfig]).size} bytes</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Updated {selectedTool?.updatedOn}</span>
      </div>
    </div>
  );

  const emptyStateAction = (
    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
      <Plus className="h-4 w-4 mr-2" />
      Create New Tool
    </Button>
  );

  return (
    <MCPIDEContainer
      icon={selectedTool ? Wrench : undefined}
      title={selectedTool?.name}
      onClose={selectedTool ? onClose : undefined}
      footerContent={selectedTool ? footerContent : undefined}
      isEmpty={!selectedTool}
      emptyStateIcon={Wrench}
      emptyStateTitle="Click a tool to edit it in the tool IDE"
      emptyStateDescription="Select a tool from the left panel to configure, or create a new one to get started with your integrations."
      emptyStateAction={emptyStateAction}
    >
      <div className="p-8 h-full">
        <textarea
          value={toolConfig}
          onChange={(e) => setToolConfig(e.target.value)}
          placeholder="Enter your tool configuration here..."
          className="w-full h-full resize-none border border-border/60 rounded-xl p-6 text-sm font-mono bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200 shadow-sm"
        />
      </div>
    </MCPIDEContainer>
  );
}

/* ==========================================================================*/
// Public Component Exports
/* ==========================================================================*/

export { ToolIDE }; 