/**
 * PIN Code to City & State lookup utility for Indian postal codes.
 * Dynamically queries local master store, backend API, and falls back
 * to the official India Post API for complete coverage.
 */

import { api } from "@/lib/api";
import { findPinCode } from "@/lib/pincodeStore";

export interface PinCodeInfo {
  city: string;
  state: string;
}

// In-memory cache for ultra-fast repeated lookups during a user session
const sessionPinCache = new Map<string, PinCodeInfo>();

/**
 * Look up City & State by 6-digit Indian PIN code.
 * Strategy:
 * 1. Session memory cache
 * 2. Client pincodeStore (localStorage master file)
 * 3. Dynamic server API database lookup (/api/pincodes)
 * 4. Official India Post API fallback
 */
export async function lookupPinCode(pinCode: string): Promise<PinCodeInfo | null> {
  const cleanPin = pinCode.trim().replace(/\D/g, "");
  if (cleanPin.length !== 6) {
    return null;
  }

  // 1. Check session memory cache
  if (sessionPinCache.has(cleanPin)) {
    return sessionPinCache.get(cleanPin)!;
  }

  // 2. Check client pincodeStore (localStorage master file)
  const storeHit = findPinCode(cleanPin);
  if (storeHit) {
    sessionPinCache.set(cleanPin, storeHit);
    return storeHit;
  }

  // 3. Query server API database (/api/pincodes?pin=cleanPin)
  try {
    const apiResult = await api.lookupPinCode(cleanPin);
    if (apiResult && (apiResult.city || apiResult.state)) {
      const info: PinCodeInfo = {
        city: apiResult.city,
        state: apiResult.state,
      };
      sessionPinCache.set(cleanPin, info);
      return info;
    }
  } catch (err) {
    // Silent failover to fallbacks
  }

  // 4. Fallback to official India Post API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = await res.json();
    if (
      Array.isArray(data) &&
      data[0]?.Status === "Success" &&
      Array.isArray(data[0]?.PostOffice) &&
      data[0].PostOffice.length > 0
    ) {
      const po = data[0].PostOffice[0];
      const city = po.District || po.Block || po.Name || "";
      const state = po.State || "";
      if (city || state) {
        const info: PinCodeInfo = { city, state };
        sessionPinCache.set(cleanPin, info);
        return info;
      }
    }
  } catch (err) {
    // API fetch failed or timed out; silent fallback
  }

  return null;
}
