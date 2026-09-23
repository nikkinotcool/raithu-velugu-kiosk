/**
 * Universal Resilient API Client for Raithu Velugu Kiosk
 * Automatically handles primary local requests and falls back to
 * the production Render Cloud API whenever a network or server failure occurs.
 */

export const CLOUD_API_BASE = 'https://raithu-velugu-kiosk.onrender.com/api';

export function getApiBase() {
  if (typeof window === 'undefined') return CLOUD_API_BASE;
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (window.location.hostname.includes('vercel.app')) {
    return CLOUD_API_BASE;
  }
  if (window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:8000/api`;
  }
  return 'http://localhost:8000/api';
}

/**
 * Executes a fetch request with seamless fallback to cloud if local backend is down.
 * @param {string} endpoint - Path like '/grievances' or '/chat'
 * @param {RequestInit} options - Standard fetch options
 * @param {string} [customApiBase] - Optional custom base URL
 * @returns {Promise<Response>}
 */
export async function fetchWithCloudFallback(endpoint, options = {}, customApiBase = null) {
  const base = customApiBase || getApiBase();
  const primaryUrl = `${base}${endpoint}`;

  try {
    return await fetch(primaryUrl, options);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    if (base !== CLOUD_API_BASE) {
      console.warn(`[Kiosk Network] Primary endpoint ${primaryUrl} failed (${err.message}). Seamlessly retrying with Render Cloud API...`);
      return await fetch(`${CLOUD_API_BASE}${endpoint}`, options);
    }
    throw err;
  }
}
