import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  userId: string;
  username: string;
  tier: string;
};

type AuthStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  tierInfoSeen: boolean;
  setTierInfoSeen: () => void;
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user });
      },
      logout: () => set({ user: null }),
      tierInfoSeen: false,
      setTierInfoSeen: () => set({ tierInfoSeen: true }),
    }),
    {
      name: "auth-storage", //local storage key
    }
  )
);
