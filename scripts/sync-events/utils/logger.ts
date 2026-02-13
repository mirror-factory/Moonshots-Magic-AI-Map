/**
 * @module sync-events/utils/logger
 * Colored console logger for the sync pipeline.
 */

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
} as const;

/** Colored console logger for sync pipeline output. */
export const logger = {
  /** Log an informational message in cyan. */
  info(msg: string): void {
    console.log(`${COLORS.cyan}[INFO]${COLORS.reset} ${msg}`);
  },

  /** Log a success message in green. */
  success(msg: string): void {
    console.log(`${COLORS.green}[OK]${COLORS.reset} ${msg}`);
  },

  /** Log a warning message in yellow. */
  warn(msg: string): void {
    console.log(`${COLORS.yellow}[WARN]${COLORS.reset} ${msg}`);
  },

  /** Log an error message in red. */
  error(msg: string): void {
    console.error(`${COLORS.red}[ERROR]${COLORS.reset} ${msg}`);
  },

  /** Log a section header in magenta. */
  section(msg: string): void {
    console.log(`\n${COLORS.magenta}=== ${msg} ===${COLORS.reset}`);
  },

  /** Log a dim/debug message in gray. */
  debug(msg: string): void {
    console.log(`${COLORS.gray}[DEBUG] ${msg}${COLORS.reset}`);
  },
};
