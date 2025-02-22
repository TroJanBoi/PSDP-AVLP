import { create } from 'zustand';

export type MenuTpye = "home" | "about" | "contact" | "profile" | "settings" | "logout";

type GlobalState = {
    menu: MenuTpye;
};

type GlobalStateAction = {
    setMenu: (menu: MenuTpye) => void;
    resetMenu: () => void;
};

export const useMenuStore = create<GlobalState & GlobalStateAction>((set) => ({
    menu: "home",
    setMenu: (menu) => set({ menu }),
    resetMenu: () => set({ menu: "home" }),
}));