/* ==========================================================================*/
// tool-dummy.ts — Dummy data for tools
/* ==========================================================================*/
// Purpose: Sample tools data for development and testing
// Sections: Types, Dummy Data, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// Local Types ---
import type { FunctionalityItem } from "../shared/mcp-resources";

/* ==========================================================================*/
// Dummy Data
/* ==========================================================================*/

const TOOLS_DUMMY_DATA: FunctionalityItem[] = [
  {
    id: "1",
    name: "File System Navigator",
    description: "Advanced file system navigation tool with search capabilities, file type filtering, and directory traversal. Supports both local and remote file systems.",
    createdBy: "David Kim",
    updatedOn: "3 hours ago",
  },
  {
    id: "2", 
    name: "API Request Builder",
    description: "Constructs and executes HTTP requests with authentication, headers, and response parsing. Includes support for REST, GraphQL, and webhook endpoints.",
    createdBy: "Lisa Wang",
    updatedOn: "5 hours ago",
  },
  {
    id: "3",
    name: "Database Query Runner",
    description: "Executes SQL queries across multiple database systems with result formatting and performance metrics. Supports PostgreSQL, MySQL, and SQLite.",
    createdBy: "Carlos Martinez",
    updatedOn: "1 day ago",
  },
  {
    id: "4",
    name: "Terminal Command Executor",
    description: "Safely executes shell commands with sandboxing and output capturing. Includes command history and environment variable management.",
    createdBy: "Amy Foster",
    updatedOn: "2 days ago",
  },
  {
    id: "5",
    name: "JSON Processor",
    description: "Advanced JSON manipulation tool with path queries, transformations, and validation. Supports JSONPath and JQ-style operations.",
    createdBy: "Robert Chen",
    updatedOn: "4 days ago",
  },
  {
    id: "6",
    name: "Code Analyzer",
    description: "Static code analysis tool that identifies patterns, complexity metrics, and potential improvements across multiple programming languages.",
    createdBy: "Maria Rodriguez",
    updatedOn: "1 week ago",
  },
];

/* ==========================================================================*/
// Public Data Exports
/* ==========================================================================*/

export { TOOLS_DUMMY_DATA }; 