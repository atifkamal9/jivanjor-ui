const AUTH_KEY = "jivanjor-authenticated";
const USER_EMAIL_KEY = "jivanjor-user-email";
const TOKEN_KEY = "jivanjor-auth-token";

export function isBrowser() {
  return typeof window !== "undefined";
}

export function isAuthenticated() {
  return isBrowser() && localStorage.getItem(AUTH_KEY) === "true";
}

export function signIn(email: string, token: string, permissions?: string[]) {
  if (!isBrowser()) return false;
  localStorage.setItem(AUTH_KEY, "true");
  localStorage.setItem(USER_EMAIL_KEY, email);
  localStorage.setItem(TOKEN_KEY, token);
  if (Array.isArray(permissions)) {
    localStorage.setItem("jivanjor-user-permissions", JSON.stringify(permissions));
  } else {
    // Decode permissions from token if available
    try {
      const payload = token.split(".")[1];
      if (payload) {
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const decoded = JSON.parse(jsonPayload);
        if (Array.isArray(decoded.permissions)) {
          localStorage.setItem("jivanjor-user-permissions", JSON.stringify(decoded.permissions));
        }
      }
    } catch (e) {}
  }
  return true;
}

export function signOut() {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("jivanjor-user-permissions");
}

export function getUserEmail() {
  return isBrowser() ? (localStorage.getItem(USER_EMAIL_KEY) ?? "") : "";
}

export function getAuthToken() {
  return isBrowser() ? (localStorage.getItem(TOKEN_KEY) ?? "") : "";
}

export function getUserRole() {
  const token = getAuthToken();
  if (!token) return "";
  try {
    const payload = token.split(".")[1];
    if (!payload) return "";
    // Decode base64url safely
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.role || "";
  } catch (e) {
    console.error("Failed to parse token payload:", e);
    return "";
  }
}

export function getUserPermissions(): string[] {
  const role = getUserRole();
  if (role === "SUPER_ADMIN") {
    return [
      "manage_products",
      "manage_categories",
      "manage_materials",
      "manage_blogs",
      "manage_use_cases",
      "manage_pages",
      "manage_templates",
      "manage_sitemap",
      "manage_menu",
      "manage_settings",
      "manage_users",
    ];
  }

  // 1. Try decoding permissions array directly from auth JWT token
  const token = getAuthToken();
  if (token) {
    try {
      const payload = token.split(".")[1];
      if (payload) {
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const decoded = JSON.parse(jsonPayload);
        if (Array.isArray(decoded.permissions) && decoded.permissions.length > 0) {
          return decoded.permissions;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // 2. Try checking cached permissions in localStorage
  if (isBrowser()) {
    try {
      const cached = localStorage.getItem("jivanjor-user-permissions");
      if (cached !== null && cached !== undefined) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // 3. Fallback for ADMIN role: Default to standard admin permissions if no custom array is assigned
  if (role === "ADMIN") {
    return [
      "manage_products",
      "manage_categories",
      "manage_blogs",
      "manage_use_cases",
      "manage_pages",
      "manage_sitemap",
      "manage_menu",
      "manage_settings",
      "manage_users",
    ];
  }

  return [];
}

export function hasPermission(permissionKey: string): boolean {
  const role = getUserRole();
  if (role === "SUPER_ADMIN") return true;

  // Template & Material modules are strictly Super Admin only
  if (permissionKey === "manage_templates" || permissionKey === "manage_materials") {
    return false;
  }

  // General User (USER) cannot manage users
  if (role === "USER" && permissionKey === "manage_users") {
    return false;
  }

  const permissions = getUserPermissions();

  // Mapped permission aliases
  if (permissionKey === "manage_menu") {
    return permissions.includes("manage_settings") || permissions.includes("manage_menu");
  }
  if (permissionKey === "manage_use_cases") {
    return permissions.includes("manage_blogs") || permissions.includes("manage_use_cases");
  }
  if (permissionKey === "manage_sitemap") {
    return permissions.includes("manage_pages") || permissions.includes("manage_settings") || permissions.includes("manage_sitemap");
  }

  return permissions.includes(permissionKey);
}
