import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getCountry, type Country } from "../constants/countries";

type CountryState = {
  currentCountryCode: string;
  isManualOverride: boolean;
  setCountry: (code: string) => void;
  resetToAuto: () => void;
  currentCountry: () => Country;
};

export const useCountryStore = create<CountryState>()(
  persist(
    (set, get) => ({
      currentCountryCode: "IN",
      isManualOverride: false,
      setCountry: (code) =>
        set({ currentCountryCode: code.toUpperCase(), isManualOverride: true }),
      resetToAuto: () => set({ isManualOverride: false }),
      currentCountry: () => getCountry(get().currentCountryCode),
    }),
    {
      name: "roadsos-country",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
