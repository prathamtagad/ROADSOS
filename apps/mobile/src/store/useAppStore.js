import { create } from "zustand";

export const useAppStore = create((set) => ({
  currentCountry: "TH",
  offlineMode: false,
  lastSyncByCategory: {},
  contactsByCategory: {},
  borderGeofences: [],
  setCurrentCountry: (country) => set({ currentCountry: country }),
  setOfflineMode: (offlineMode) => set({ offlineMode }),
  setContacts: (category, contacts, lastSyncedAt) =>
    set((state) => ({
      contactsByCategory: {
        ...state.contactsByCategory,
        [category]: contacts
      },
      lastSyncByCategory: {
        ...state.lastSyncByCategory,
        [category]: lastSyncedAt || state.lastSyncByCategory[category]
      }
    })),
  setBorderGeofences: (borderGeofences) => set({ borderGeofences })
}));
