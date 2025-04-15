import { z } from "zod";

export const validationSchema = z.object({
  // Server
  PORT: z.coerce.number().default(3000),

  // Database
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string().default(""),
  DB_SYNCHRONIZE: z.coerce.boolean().default(false),

  // Redis
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_CACHE_TTL: z.coerce.number().default(3600),

  // Logging
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  LOG_TIME_FORMAT: z.string().default("yyyy-mm-dd HH:MM:ss.l"),
  LOG_STYLE: z.enum(["pretty", "json"]).default("pretty"),
  LOG_COLORS: z.string().default("true"),
  LOG_SINGLE_LINE: z.string().default("false"),
  EXTENDED_LOGS: z.string().default("false"),

  // Queue Monitor
  QUEUE_MONITOR: z.coerce.boolean().default(true),
  QUEUE_MONITOR_USERNAME: z.string(),
  QUEUE_MONITOR_PASSWORD: z.string(),
});
