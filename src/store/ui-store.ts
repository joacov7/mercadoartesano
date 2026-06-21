import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HomeTab, UIFilters } from "@/types";

interface UIState {
  homeTab: HomeTab;
  filters: UIFilters;
  sidebarOpen: boolean;
  setHomeTab: (tab: HomeTab) => void;
  setFilter: (key: keyof UIFilters, value: string) => void;
  resetFilters: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const defaultFilters: UIFilters = {
  provincia: "",
  localidad: "",
  categoria: "",
  search: "",
  orderBy: "reciente",
  tipoVenta: "",
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      homeTab: "mates",
      filters: defaultFilters,
      sidebarOpen: false,
      setHomeTab: (tab) => set({ homeTab: tab }),
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "mercadoartesano-ui",
      partialize: (state) => ({ homeTab: state.homeTab, filters: state.filters }),
    }
  )
);
