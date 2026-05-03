import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  setAuth: (user: any, token: string) => void;
  clearAuth: () => void;
  updateUser: (updates: any) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoginModalOpen: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true, isLoginModalOpen: false }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) => set({ user: { ...get().user, ...updates } }),
      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),
    }),
    { 
      name: "electiq-auth",
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
    }
  )
);
