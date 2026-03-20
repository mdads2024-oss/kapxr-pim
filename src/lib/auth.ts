export type AuthSession = {
  email: string;
  name?: string;
  loggedInAt: string;
};

const AUTH_STORAGE_KEY = "kapxr:auth-session";

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAuthSession());
}

export function signInSession(session: Omit<AuthSession, "loggedInAt">) {
  if (typeof window === "undefined") return;
  const payload: AuthSession = { ...session, loggedInAt: new Date().toISOString() };
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

export function signOutSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
