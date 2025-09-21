import type { RedisClientType } from '@redis/client';
import bcrypt from 'bcrypt';
import { createClient } from 'redis';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  password: string | undefined,
  hash: string | undefined | null,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(
  getVar: () => TResult,
): string | undefined {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replaceAll(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1]!;

  const memberParts = fullMemberName.split('.');

  return memberParts.at(-1);
}

export async function connectToRedis(
  options: {
    host: string;
    port: number;
    username?: string;
    password?: string;
  },
  retry: number = 5,
): Promise<RedisClientType | void> {
  try {
    const client = createClient({
      socket: { host: options.host, port: options.port },
      username: options.username,
      password: options.password,
    });
    await client.connect();
    console.info('Redis is connected successfully.');
    return client as unknown as RedisClientType;
  } catch (error) {
    console.error('Redis connection error:', error);
    if (retry > 0) {
      console.warn(
        `Retrying to connect to Redis. Attempts remaining: ${retry}`,
      );
      await new Promise((resolve) => setTimeout(resolve, 2500));
      return connectToRedis(options, retry - 1);
    } else {
      console.error('Redis is not reachable right now');
    }
  }
}

export function normalizeStringToPersian(name: string): string {
  if (!name) return name;

  return name.replace(/ي/g, 'ی').replace(/ك/g, 'ک');
}

export function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
