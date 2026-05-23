import { create } from 'zustand';

export interface AlertPayload {
  incidentId: string;
  incidentType: string;
  distance: number;
  incidentLat: number;
  incidentLng: number;
}

interface ResponderState {
  alertPayload: AlertPayload | null;
  setAlertPayload: (payload: AlertPayload | null) => void;
  clearAlert: () => void;
}

export const useResponderStore = create<ResponderState>((set) => ({
  alertPayload: null,
  setAlertPayload: (payload) => set({ alertPayload: payload }),
  clearAlert: () => set({ alertPayload: null }),
}));
