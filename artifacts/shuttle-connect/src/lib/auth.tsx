import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { login as loginApi, updateProfile as updateProfileApi } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";

interface ExtraUserInfo {
  phone: string;
  dob: string;
  nationalId: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: string | null;
  userProfile: User | null;
  extraInfo: ExtraUserInfo;
  login: (username: string) => Promise<void>;
  logout: () => void;
  updateProfile: (avatar: string, skillLevel: string) => Promise<void>;
  updateExtraInfo: (info: Partial<ExtraUserInfo>) => void;
}

const DEFAULT_EXTRA: ExtraUserInfo = { phone: "", dob: "", nationalId: "", avatarUrl: "/avatar1.png" };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "shuttle_connect_user";
const EXTRA_KEY = "shuttle_connect_extra";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [extraInfo, setExtraInfo] = useState<ExtraUserInfo>(() => {
    if (typeof window === "undefined") return DEFAULT_EXTRA;
    try {
      const raw = localStorage.getItem(EXTRA_KEY);
      return raw ? { ...DEFAULT_EXTRA, ...JSON.parse(raw) } : DEFAULT_EXTRA;
    } catch {
      return DEFAULT_EXTRA;
    }
  });

  useEffect(() => {
    if (user) {
      loginApi({ username: user })
        .then((result) => {
          setUserProfile(result);
          if (result.avatar) {
            setExtraInfo((prev) => {
              if (prev.avatarUrl === result.avatar) return prev;
              const updated = { ...prev, avatarUrl: result.avatar };
              localStorage.setItem(EXTRA_KEY, JSON.stringify(updated));
              return updated;
            });
          }
        })
        .catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) throw new Error("Tên đăng nhập không được để trống");
    const result = await loginApi({ username: trimmed });
    localStorage.setItem(STORAGE_KEY, result.username);
    setUser(result.username);
    setUserProfile(result);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setUserProfile(null);
  };

  const updateProfile = async (avatar: string, skillLevel: string) => {
    if (!user) throw new Error("Chưa đăng nhập");
    const result = await updateProfileApi({ username: user, avatar, skillLevel });
    setUserProfile(result);
  };

  const updateExtraInfo = (info: Partial<ExtraUserInfo>) => {
    setExtraInfo((prev) => {
      const updated = { ...prev, ...info };
      localStorage.setItem(EXTRA_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, extraInfo, login, logout, updateProfile, updateExtraInfo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
