export type UserRole = "admin" | "administrator" | "researcher" | "forest_officer";
export type SessionUser = { name: string; email: string; role: UserRole; token?: string };
const sessionKey = "wildlife-population-intelligence-session";
export function saveSession(user: SessionUser) { localStorage.setItem(sessionKey, JSON.stringify(user)); }
export function getSession(): SessionUser | null { try { const value = localStorage.getItem(sessionKey); return value ? JSON.parse(value) as SessionUser : null; } catch { return null; } }
export function clearSession() { localStorage.removeItem(sessionKey); }
export function roleLabel(role: UserRole) { return role === "forest_officer" ? "Forest Officer" : role === "admin" || role === "administrator" ? "Administrator" : "Researcher"; }
