// utils.js
import { kv } from '@vercel/kv';

export async function getKVData(key) {
  try {
    return await kv.get(key);
  } catch (error) {
    console.error(`Error fetching ${key} from KV:`, error);
    throw new Error(`Failed to fetch ${key}`);
  }
}

export async function setKVData(key, value) {
  try {
    await kv.set(key, value);
  } catch (error) {
    console.error(`Error setting ${key} in KV:`, error);
    throw new Error(`Failed to set ${key}`);
  }
}

export function handleApiError(res, error, customMessage) {
  console.error(customMessage, error);
  res.status(500).json({ error: customMessage, details: error.message });
}

export function methodNotAllowed(res, allowedMethods) {
  res.setHeader('Allow', allowedMethods);
  res.status(405).end(`Method ${res.req.method} Not Allowed`);
}
