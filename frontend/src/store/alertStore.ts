import { create } from "zustand";
interface A { alert: any; identity_name: string }
interface S { alerts: A[]; addAlert: (a: A) => void }
export const useAlertStore = create<S>((set) => ({ alerts: [], addAlert: (a) => set((s) => ({ alerts: [a, ...s.alerts] })) }));
