import { registerAs } from "@nestjs/config";

export const configuration = () => {
  const config = {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_CACHE_TTL: process.env.REDIS_CACHE_TTL,
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOG_TIME_FORMAT: process.env.LOG_TIME_FORMAT,
    LOG_STYLE: process.env.LOG_STYLE,
    LOG_COLORS: process.env.LOG_COLORS,
    EXTENDED_LOGS: process.env.EXTENDED_LOGS,
    LOG_SINGLE_LINE: process.env.LOG_SINGLE_LINE,
    QUEUE_MONITOR: process.env.QUEUE_MONITOR,
    EVENT_QUEUE_NAME: process.env.EVENT_QUEUE_NAME,
    INSTALLATION_QUEUE_NAME: process.env.INSTALLATION_QUEUE_NAME,
    QUEUE_MONITOR_USERNAME: process.env.QUEUE_MONITOR_USERNAME,
    QUEUE_MONITOR_PASSWORD: process.env.QUEUE_MONITOR_PASSWORD,
  };

  return config;
};

export default registerAs("config", configuration);
