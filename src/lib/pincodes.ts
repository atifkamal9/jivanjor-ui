/**
 * PIN Code to City & State lookup utility for Indian postal codes.
 * Contains local fast lookup for major Indian PIN codes and falls back
 * to the official India Post API for complete coverage.
 */

export interface PinCodeInfo {
  city: string;
  state: string;
}

// Local dataset of common Indian pin codes across major metro & tier-1/2 hubs
const PINCODE_MAP: Record<string, PinCodeInfo> = {
  // New Delhi / NCR
  "110001": { city: "New Delhi", state: "Delhi" },
  "110002": { city: "New Delhi", state: "Delhi" },
  "110003": { city: "New Delhi", state: "Delhi" },
  "110005": { city: "New Delhi", state: "Delhi" },
  "110016": { city: "New Delhi", state: "Delhi" },
  "110020": { city: "New Delhi", state: "Delhi" },
  "110048": { city: "New Delhi", state: "Delhi" },
  "110075": { city: "New Delhi", state: "Delhi" },
  "110091": { city: "New Delhi", state: "Delhi" },
  "110092": { city: "New Delhi", state: "Delhi" },
  "122001": { city: "Gurugram", state: "Haryana" },
  "122002": { city: "Gurugram", state: "Haryana" },
  "122018": { city: "Gurugram", state: "Haryana" },
  "201301": { city: "Noida", state: "Uttar Pradesh" },
  "201303": { city: "Noida", state: "Uttar Pradesh" },
  "201304": { city: "Noida", state: "Uttar Pradesh" },
  "201001": { city: "Ghaziabad", state: "Uttar Pradesh" },
  "121001": { city: "Faridabad", state: "Haryana" },

  // Mumbai & Thane
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "400002": { city: "Mumbai", state: "Maharashtra" },
  "400013": { city: "Mumbai", state: "Maharashtra" },
  "400050": { city: "Mumbai", state: "Maharashtra" },
  "400051": { city: "Mumbai", state: "Maharashtra" },
  "400053": { city: "Mumbai", state: "Maharashtra" },
  "400069": { city: "Mumbai", state: "Maharashtra" },
  "400078": { city: "Mumbai", state: "Maharashtra" },
  "400092": { city: "Mumbai", state: "Maharashtra" },
  "400099": { city: "Mumbai", state: "Maharashtra" },
  "400601": { city: "Thane", state: "Maharashtra" },
  "400703": { city: "Navi Mumbai", state: "Maharashtra" },

  // Bengaluru
  "560001": { city: "Bengaluru", state: "Karnataka" },
  "560002": { city: "Bengaluru", state: "Karnataka" },
  "560004": { city: "Bengaluru", state: "Karnataka" },
  "560011": { city: "Bengaluru", state: "Karnataka" },
  "560025": { city: "Bengaluru", state: "Karnataka" },
  "560034": { city: "Bengaluru", state: "Karnataka" },
  "560037": { city: "Bengaluru", state: "Karnataka" },
  "560066": { city: "Bengaluru", state: "Karnataka" },
  "560095": { city: "Bengaluru", state: "Karnataka" },
  "560100": { city: "Bengaluru", state: "Karnataka" },

  // Kolkata
  "700001": { city: "Kolkata", state: "West Bengal" },
  "700016": { city: "Kolkata", state: "West Bengal" },
  "700019": { city: "Kolkata", state: "West Bengal" },
  "700027": { city: "Kolkata", state: "West Bengal" },
  "700091": { city: "Kolkata", state: "West Bengal" },
  "700106": { city: "Kolkata", state: "West Bengal" },

  // Chennai
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "600002": { city: "Chennai", state: "Tamil Nadu" },
  "600017": { city: "Chennai", state: "Tamil Nadu" },
  "600020": { city: "Chennai", state: "Tamil Nadu" },
  "600034": { city: "Chennai", state: "Tamil Nadu" },
  "600040": { city: "Chennai", state: "Tamil Nadu" },

  // Hyderabad
  "500001": { city: "Hyderabad", state: "Telangana" },
  "500003": { city: "Hyderabad", state: "Telangana" },
  "500016": { city: "Hyderabad", state: "Telangana" },
  "500032": { city: "Hyderabad", state: "Telangana" },
  "500081": { city: "Hyderabad", state: "Telangana" },

  // Pune
  "411001": { city: "Pune", state: "Maharashtra" },
  "411002": { city: "Pune", state: "Maharashtra" },
  "411004": { city: "Pune", state: "Maharashtra" },
  "411014": { city: "Pune", state: "Maharashtra" },
  "411038": { city: "Pune", state: "Maharashtra" },
  "411057": { city: "Pune", state: "Maharashtra" },

  // Ahmedabad & Gujarat
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "380009": { city: "Ahmedabad", state: "Gujarat" },
  "380015": { city: "Ahmedabad", state: "Gujarat" },
  "380054": { city: "Ahmedabad", state: "Gujarat" },
  "395001": { city: "Surat", state: "Gujarat" },
  "390001": { city: "Vadodara", state: "Gujarat" },
  "360001": { city: "Rajkot", state: "Gujarat" },

  // Jaipur & Rajasthan
  "302001": { city: "Jaipur", state: "Rajasthan" },
  "302004": { city: "Jaipur", state: "Rajasthan" },
  "302017": { city: "Jaipur", state: "Rajasthan" },
  "342001": { city: "Jodhpur", state: "Rajasthan" },
  "313001": { city: "Udaipur", state: "Rajasthan" },

  // Uttar Pradesh
  "226001": { city: "Lucknow", state: "Uttar Pradesh" },
  "226010": { city: "Lucknow", state: "Uttar Pradesh" },
  "208001": { city: "Kanpur", state: "Uttar Pradesh" },
  "221001": { city: "Varanasi", state: "Uttar Pradesh" },
  "211001": { city: "Prayagraj", state: "Uttar Pradesh" },
  "282001": { city: "Agra", state: "Uttar Pradesh" },

  // Punjab, Haryana, Chandigarh
  "160017": { city: "Chandigarh", state: "Chandigarh" },
  "160022": { city: "Chandigarh", state: "Chandigarh" },
  "141001": { city: "Ludhiana", state: "Punjab" },
  "143001": { city: "Amritsar", state: "Punjab" },
  "134109": { city: "Panchkula", state: "Haryana" },

  // Madhya Pradesh
  "452001": { city: "Indore", state: "Madhya Pradesh" },
  "462001": { city: "Bhopal", state: "Madhya Pradesh" },
  "482001": { city: "Jabalpur", state: "Madhya Pradesh" },

  // Bihar & Jharkhand
  "800001": { city: "Patna", state: "Bihar" },
  "834001": { city: "Ranchi", state: "Jharkhand" },
  "831001": { city: "Jamshedpur", state: "Jharkhand" },

  // Odisha, Kerala, Assam, etc.
  "751001": { city: "Bhubaneswar", state: "Odisha" },
  "682001": { city: "Kochi", state: "Kerala" },
  "695001": { city: "Thiruvananthapuram", state: "Kerala" },
  "781001": { city: "Guwahati", state: "Assam" },
};

/**
 * Look up City & State by 6-digit Indian PIN code.
 * Checks local map first, then fetches from postalpincode API.
 */
export async function lookupPinCode(pinCode: string): Promise<PinCodeInfo | null> {
  const cleanPin = pinCode.trim().replace(/\D/g, "");
  if (cleanPin.length !== 6) {
    return null;
  }

  // Check local map
  if (PINCODE_MAP[cleanPin]) {
    return PINCODE_MAP[cleanPin];
  }

  // Fallback to official India Post API
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
        return { city, state };
      }
    }
  } catch (err) {
    // API fetch failed or timed out; silent fallback so form submission works uninterrupted
  }

  return null;
}
