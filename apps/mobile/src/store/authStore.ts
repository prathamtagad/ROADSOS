import { create } from "zustand";

type AuthUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
};

type AuthState = {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  isOnboarded: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setOnboarded: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  uid: null,
  displayName: null,
  email: null,
  isOnboarded: false,
  isLoading: true,
  setUser: (user) =>
    set({
      uid: user?.uid ?? null,
      displayName: user?.displayName ?? null,
      email: user?.email ?? null
    }),
  setOnboarded: (value) => set({ isOnboarded: value }),
  setLoading: (value) => set({ isLoading: value }),
  clearAuth: () =>
    set({
      uid: null,
      displayName: null,
      email: null,
      isOnboarded: false,
      isLoading: false
    })
}));
