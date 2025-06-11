/**
 * lib/logger.ts
 *
 * High-performance, structured logging for Next.js.
 * Uses Pino under the hood, with JSON output in production
 * and human-friendly pretty-printing in development.
 *

 * Getting Started:
 * 1. Install dependencies:
 *    npm install pino pino-pretty
 *
 * 2. Import and use:
 *    import { logger } from '@/lib/logger';
 *    logger.info('Server started', { port: 3000 });
 *    logger.error('Unexpected error', error);
 */

import pino from "pino";

// Detect environment
const isProduction = process.env.NODE_ENV === "production";

// Create logger with minimal configuration to avoid Worker issues in Next.js
// Worker path issues occur in RSC context, so we use a simple configuration
export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  timestamp: pino.stdTimeFunctions.isoTime,
});
