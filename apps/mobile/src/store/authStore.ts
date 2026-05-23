import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User as FirebaseUser } from "firebase/auth";

type AuthState = {
  user: FirebaseUser | null;
  isOnboarded: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setOnboarded: (value: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isOnboarded: false,
      setUser: (user) => set({ user }),
      setOnboarded: (value) => set({ isOnboarded: value }),
      clearAuth: () => set({ user: null, isOnboarded: false })
    }),
    {
      name: "roadsos-auth",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
