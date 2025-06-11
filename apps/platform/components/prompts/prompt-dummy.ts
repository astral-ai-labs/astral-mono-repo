/* ==========================================================================*/
// prompt-dummy.ts — Dummy data for prompts functionality
/* ==========================================================================*/
// Purpose: Provides mock data for prompt management interface
// Sections: Imports, Types, Data, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// Local Types ---
import type { FunctionalityItem } from "../shared/mcp-resources";

/* ==========================================================================*/
// Dummy Data
/* ==========================================================================*/

const PROMPTS_DUMMY_DATA: FunctionalityItem[] = [
  {
    id: "1",
    name: "Code Review Assistant",
    description: "A comprehensive prompt designed to help review code for best practices, security vulnerabilities, and performance optimizations. It analyzes code structure and provides detailed feedback.",
    createdBy: "Sarah Chen",
    updatedOn: "2 hours ago",
  },
  {
    id: "2",
    name: "Documentation Generator",
    description: "Automatically generates professional documentation from code comments and function signatures. Perfect for API documentation and code explanations.",
    createdBy: "Mike Johnson",
    updatedOn: "1 day ago",
  },
  {
    id: "3",
    name: "Bug Finder",
    description: "Specialized prompt for identifying potential bugs and edge cases in code. Uses pattern recognition to spot common programming errors.",
    createdBy: "Alex Rodriguez",
    updatedOn: "3 days ago",
  },
  {
    id: "4",
    name: "Performance Optimizer",
    description: "Analyzes code performance and suggests optimizations for better execution speed and memory usage.",
    createdBy: "Emma Davis",
    updatedOn: "1 week ago",
  },
  {
    id: "5",
    name: "API Documentation Writer",
    description: "Creates comprehensive API documentation with examples, response formats, and error handling guides.",
    createdBy: "James Wilson",
    updatedOn: "2 weeks ago",
  },
];

/**
 * generatePromptTemplate
 * 
 * Generates a default prompt template for a given prompt item.
 * 
 * @param prompt - The prompt item to generate template for
 * @returns Formatted prompt template string
 */
function generatePromptTemplate(prompt: FunctionalityItem): string {
  return `# ${prompt.name}

${prompt.description}

## Instructions
You are a helpful AI assistant. Please follow these guidelines:

1. Be clear and concise
2. Provide accurate information
3. Ask clarifying questions when needed

## Example
User: Help me debug this code
Assistant: I'd be happy to help you debug your code. Could you please share the code you're having trouble with and describe what issue you're experiencing?`;
}

/* ==========================================================================*/
// Public Data Exports
/* ==========================================================================*/

export { PROMPTS_DUMMY_DATA, generatePromptTemplate }; 