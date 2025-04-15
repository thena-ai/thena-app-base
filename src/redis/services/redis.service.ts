import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
  constructor(
    @Inject("REDIS_CLIENT")
    private readonly redis: Redis,
    private readonly configService: ConfigService
  ) {}

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.error(`Error getting key ${key}:`, error);
      throw error;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<"OK" | null> {
    try {
      const defaultTtl = this.configService.get<number>("redis.ttl");
      if (ttl || defaultTtl) {
        return await this.redis.set(key, value, "EX", ttl || defaultTtl);
      }
      return await this.redis.set(key, value);
    } catch (error) {
      console.error(`Error setting key ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<number> {
    try {
      return await this.redis.del(key);
    } catch (error) {
      console.error(`Error deleting key ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<"OK"> {
    try {
      return await this.redis.flushall();
    } catch (error) {
      console.error("Error clearing cache:", error);
      throw error;
    }
  }

  async getTtl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      console.error(`Error getting TTL for key ${key}:`, error);
      throw error;
    }
  }

  async setTtl(key: string, ttl: number): Promise<number> {
    try {
      return await this.redis.expire(key, ttl);
    } catch (error) {
      console.error(`Error setting TTL for key ${key}:`, error);
      throw error;
    }
  }
}
