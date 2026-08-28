import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "pincodes.json");

export interface PinCodeItem {
  city: string;
  state: string;
  location?: string | null;
}

export interface PinCodeFileSchema {
  updatedAt: string | null;
  count: number;
  data: Record<string, PinCodeItem>;
}

function readPincodesFromFile(): PinCodeFileSchema {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      return JSON.parse(fileContent);
    }
  } catch (err) {
    console.error("Error reading pincodes.json:", err);
  }
  return { updatedAt: null, count: 0, data: {} };
}

function writePincodesToFile(content: PinCodeFileSchema): boolean {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(content, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing pincodes.json:", err);
    return false;
  }
}

/**
 * GET /api/pincodes
 * Query Params:
 * - pin: 6-digit PIN code for instant lookup
 * - search: Search keyword for Admin UI list
 * - page & limit: Pagination for Admin UI list
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get("pin");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

    const fileData = readPincodesFromFile();

    // 1. Single PIN Code Lookup
    if (pin) {
      const cleanPin = pin.trim().replace(/\D/g, "");
      if (cleanPin.length === 6 && fileData.data[cleanPin]) {
        return NextResponse.json({
          status: "success",
          data: {
            pinCode: cleanPin,
            ...fileData.data[cleanPin],
          },
        });
      }
      return NextResponse.json(
        { status: "fail", message: `PIN code ${pin} not found in database` },
        { status: 404 }
      );
    }

    // 2. Admin Listing with Search & Pagination
    let entries = Object.entries(fileData.data).map(([pinCode, info]) => ({
      pinCode,
      location: info.location || null,
      city: info.city,
      state: info.state,
    }));

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      entries = entries.filter(
        (item) =>
          item.pinCode.toLowerCase().includes(q) ||
          (item.location && item.location.toLowerCase().includes(q)) ||
          item.city.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q)
      );
    }

    const total = entries.length;
    const startIndex = (page - 1) * limit;
    const paginatedRecords = entries.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      status: "success",
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      updatedAt: fileData.updatedAt,
      records: paginatedRecords,
    });
  } catch (err: any) {
    console.error("GET /api/pincodes Error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch PIN code data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pincodes
 * Replaces the entire PIN code dataset from uploaded Excel rows
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const records = body.records;

    if (!Array.isArray(records)) {
      return NextResponse.json(
        { status: "fail", message: "Invalid payload. Expected 'records' array." },
        { status: 400 }
      );
    }

    const newDataMap: Record<string, PinCodeItem> = {};

    for (const item of records) {
      if (!item || !item.pinCode) continue;
      const cleanPin = String(item.pinCode).trim().replace(/\D/g, "");
      if (cleanPin.length !== 6) continue;

      const city = (item.city || item.location || "").trim();
      const state = (item.state || "").trim();
      if (!city) continue;

      newDataMap[cleanPin] = {
        city,
        state: state || "N/A",
        location: item.location ? String(item.location).trim() : null,
      };
    }

    const count = Object.keys(newDataMap).length;
    const updatedAt = new Date().toISOString();

    const fileContent: PinCodeFileSchema = {
      updatedAt,
      count,
      data: newDataMap,
    };

    const success = writePincodesToFile(fileContent);

    // Forward to backend server to populate Supabase PostgreSQL database
    try {
      const serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await fetch(`${serverUrl}/pincodes/replace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });
    } catch (dbErr) {
      console.warn("Backend server sync skipped:", dbErr);
    }

    if (!success) {
      return NextResponse.json(
        { status: "error", message: "Failed to save PIN code dataset to storage" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      count,
      updatedAt,
      message: `Successfully replaced PIN code database with ${count} records.`,
    });
  } catch (err: any) {
    console.error("POST /api/pincodes Error:", err);
    return NextResponse.json(
      { status: "error", message: err?.message || "Failed to replace PIN code dataset" },
      { status: 500 }
    );
  }
}
