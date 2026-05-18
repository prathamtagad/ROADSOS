import { create } from "zustand";

export const useAppStore = create((set) => ({
  currentCountry: "TH",
  offlineMode: false,
  lastSyncByCategory: {},
  lastGeofenceSync: null,
  contactsByCategory: {},
  borderGeofences: [],
  borderStatus: { inBuffer: false, nextCountry: null },
  lastKnownLocation: null,
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
  setLastSyncByCategory: (lastSyncByCategory) => set({ lastSyncByCategory }),
  setBorderGeofences: (borderGeofences) => set({ borderGeofences }),
  setLastGeofenceSync: (lastGeofenceSync) => set({ lastGeofenceSync }),
  setBorderStatus: (borderStatus) => set({ borderStatus }),
  setLastKnownLocation: (lastKnownLocation) => set({ lastKnownLocation })
}));
