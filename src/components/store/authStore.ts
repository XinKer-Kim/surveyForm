// src/components/store/authStore.ts
import { create } from "zustand";

interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isAuthReady: boolean;
  setUser: (user: User | null) => void;
  initAuth: () => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthReady: false,
  clearUser: () => set({ user: null, isAuthReady: true }),
  setUser: (user) => set({ user }),
  initAuth: () => {
    const storedUser = sessionStorage.getItem("supabase_session");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        set({ user: parsed, isAuthReady: true });
      } catch (e) {
        console.error("세션 파싱 실패", e);
        set({ isAuthReady: true });
      }
    } else {
      set({ isAuthReady: true });
    }
  },
}));
