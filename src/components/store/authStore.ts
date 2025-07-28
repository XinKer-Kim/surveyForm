// store/authStore.ts

import { create } from "zustand";

interface AuthUser {
  id: string;
  email: string;
  username?: string;
  gender?: string;
  birthdate?: string; // 날짜를 문자열로 저장 (또는 Date)
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
