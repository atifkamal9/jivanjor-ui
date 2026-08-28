/**
 * Pincode Storage & Lookup Service for Jivanjor UI.
 * Provides client-side and persistent storage for pincode mappings.
 */

export interface PinCodeRecord {
  pinCode: string;
  location?: string | null;
  city: string;
  state: string;
}

export interface PinCodeInfo {
  city: string;
  state: string;
  location?: string | null;
}

const PINCODE_STORAGE_KEY = "jivanjor_pincode_master_data";
const PINCODE_METADATA_KEY = "jivanjor_pincode_master_meta";

// Memory cache for runtime lookup speed
let inMemoryPincodeMap: Record<string, PinCodeInfo> | null = null;

/**
 * Get all mapped pincodes from storage
 */
export function getStoredPincodes(): Record<string, PinCodeInfo> {
  if (typeof window === "undefined") return {};
  if (inMemoryPincodeMap) return inMemoryPincodeMap;

  try {
    const raw = localStorage.getItem(PINCODE_STORAGE_KEY);
    if (raw) {
      inMemoryPincodeMap = JSON.parse(raw);
      return inMemoryPincodeMap || {};
    }
  } catch (err) {
    console.error("Failed to parse stored pincodes:", err);
  }

  return {};
}

/**
 * Save / Replace entire pincode map
 */
export function savePincodeMap(records: PinCodeRecord[]): { count: number; updatedAt: string } {
  const map: Record<string, PinCodeInfo> = {};

  for (const item of records) {
    if (!item || !item.pinCode) continue;
    const cleanPin = String(item.pinCode).trim().replace(/\D/g, "");
    if (cleanPin.length !== 6) continue;

    const city = (item.city || item.location || "").trim();
    const state = (item.state || "").trim();
    if (!city) continue;

    map[cleanPin] = {
      city,
      state: state || "N/A",
      location: item.location ? String(item.location).trim() : null,
    };
  }

  const count = Object.keys(map).length;
  const updatedAt = new Date().toISOString();

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PINCODE_STORAGE_KEY, JSON.stringify(map));
      localStorage.setItem(
        PINCODE_METADATA_KEY,
        JSON.stringify({ count, updatedAt })
      );
      inMemoryPincodeMap = map;
      
      // Dispatch custom event so form components update instantly
      window.dispatchEvent(new Event("jivanjor_pincodes_updated"));
    } catch (err) {
      console.error("Failed to save pincodes to localStorage:", err);
    }
  }

  return { count, updatedAt };
}

/**
 * Get storage metadata (total count, last updated timestamp)
 */
export function getPincodeMetadata(): { count: number; updatedAt: string | null } {
  if (typeof window === "undefined") return { count: 0, updatedAt: null };
  try {
    const rawMeta = localStorage.getItem(PINCODE_METADATA_KEY);
    if (rawMeta) {
      return JSON.parse(rawMeta);
    }
    const map = getStoredPincodes();
    const count = Object.keys(map).length;
    return { count, updatedAt: count > 0 ? new Date().toISOString() : null };
  } catch {
    return { count: 0, updatedAt: null };
  }
}

/**
 * Lookup PIN Code
 */
export function findPinCode(pinCode: string): PinCodeInfo | null {
  const cleanPin = String(pinCode || "").trim().replace(/\D/g, "");
  if (cleanPin.length !== 6) return null;

  const map = getStoredPincodes();
  if (map[cleanPin]) {
    return map[cleanPin];
  }
  return null;
}
