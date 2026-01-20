import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL disconntect')
    }

    this.client = new Redis(redisUrl);

    this.client.on('connect', () => {
      console.log('Redis connected')
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err)
    })
  }

  async set(key: string, value: string, seconds: number) {
    await this.client.set(key, value, 'EX', seconds)
  }

  async get(key: string) {
    return this.client.get(key)
  }

  async delete(key: string) {
    await this.client.del(key)
  }
  onModuleDestroy() {
    this.client.quit()
  }
}