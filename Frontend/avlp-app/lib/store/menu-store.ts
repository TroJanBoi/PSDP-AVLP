import { create } from "zustand";

export type MenuType = "home-main" | "class" | "contact";

type GlobalState = {
  menu: MenuType;
};

type GlobalAction = {
  setMenu: (menu: MenuType) => void;
  resetMenu: () => void;
};

export const useMenuStore = create<GlobalState & GlobalAction>((set) => ({
  menu: "home-main",
  setMenu: (menu) => set({ menu }),
  resetMenu: () => set({ menu: "home-main" }),
}));
