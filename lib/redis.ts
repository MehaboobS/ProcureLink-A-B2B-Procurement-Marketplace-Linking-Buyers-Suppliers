const redisUrl = process.env.REDIS_URL;

class MemoryRedisFallback {
	private store = new Map<string, { value: string; expiresAt?: number }>();

	async get(key: string) {
		const entry = this.store.get(key);

		if (!entry) {
			return null;
		}

		if (entry.expiresAt && entry.expiresAt <= Date.now()) {
			this.store.delete(key);
			return null;
		}

		return entry.value;
	}

	async set(key: string, value: string, mode?: 'EX', ttlSeconds?: number) {
		const expiresAt = mode === 'EX' && typeof ttlSeconds === 'number' ? Date.now() + ttlSeconds * 1000 : undefined;
		this.store.set(key, { value, expiresAt });
		return 'OK';
	}

	async del(key: string) {
		return this.store.delete(key) ? 1 : 0;
	}
}

const memoryRedisFallback = new MemoryRedisFallback();

const useRealRedis = process.env.NODE_ENV === 'production' && Boolean(redisUrl);

export const redis = useRealRedis
	? createRedisClient(redisUrl!)
	: memoryRedisFallback;

function createRedisClient(url: string) {
	const Redis = require('ioredis').default as typeof import('ioredis').default;
	const client = new Redis(url, {
		lazyConnect: true,
		maxRetriesPerRequest: 1,
		enableOfflineQueue: false,
		retryStrategy(times) {
			return Math.min(times * 100, 1000);
		}
	});

	client.on('error', (error) => {
		console.warn('[redis] connection error:', error.message);
	});

	return client;
}