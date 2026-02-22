import { create } from "zustand";

interface WalletState {
    //data
    favorite: string[];
    searchHistory: string[];
    isDevnet: boolean;

    //actions
    addFavorite: (address: string) => void;
    removeFavorite: (address: string) => void;
    addHistory: (address: string) => void;
    isFavorite: (address: string) => boolean;
    clearHistory: () => void;
    toggleDevnet: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
    favorite: [],
    searchHistory: [],
    isDevnet: false,

    addFavorite: (address: string) => {
        set((state: any) => {
            if (state.favorite.includes(address)) return state;
            return { favorite: [...state.favorite, address] };
        })
    },
    removeFavorite: (address: string) => {
        set((state: any) => {
            return { favorite: state.favorite.filter((a: string) => a !== address) };
        })
    },
    addHistory: (address: string) => {
        set((state: any) => {
            if (state.searchHistory.includes(address)) return state;
            return { searchHistory: [...state.searchHistory, address] };
        })
    },
    isFavorite: (address: string) => {
        return get().favorite.includes(address);
    },
    clearHistory: () => {
        set({ searchHistory: [] });
    },
    toggleDevnet: () => {
        set((state: any) => ({ isDevnet: !state.isDevnet }));
    },
}));
