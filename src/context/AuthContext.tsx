import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  name: string;
  email: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_STORAGE_KEY = "app.auth.user";

function deriveNameFromEmail(email: string): string {
  const left = email.split("@")[0] || "User";
  return left.charAt(0).toUpperCase() + left.slice(1);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      try {
        const parsed: AuthUser = JSON.parse(raw);
        setUser(parsed);
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const signIn = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    setUser({ email, name: deriveNameFromEmail(email) });
  };

  const signUp = async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const resolvedName = name?.trim() || deriveNameFromEmail(email);
    setUser({ email, name: resolvedName });
  };

  const signOut = () => setUser(null);

  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
