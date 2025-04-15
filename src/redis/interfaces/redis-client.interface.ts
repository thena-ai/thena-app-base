export interface RedisClientConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  ttl?: number;
  lazyConnect?: boolean;
}
