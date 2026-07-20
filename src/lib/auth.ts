const AUTH_KEY = "jivanjor-authenticated";
const USER_EMAIL_KEY = "jivanjor-user-email";
const TOKEN_KEY = "jivanjor-auth-token";

export function isBrowser() {
  return typeof window !== "undefined";
}

export function isAuthenticated() {
  return isBrowser() && localStorage.getItem(AUTH_KEY) === "true";
}

export function signIn(email: string, token: string) {
  if (!isBrowser()) return false;
  localStorage.setItem(AUTH_KEY, "true");
  localStorage.setItem(USER_EMAIL_KEY, email);
  localStorage.setItem(TOKEN_KEY, token);
  return true;
}

export function signOut() {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(TOKEN_KEY);
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


