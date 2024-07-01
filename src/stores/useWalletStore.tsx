import { create } from "zustand";
import { persist } from "zustand/middleware";

type WalletStore = {
  mnemonic: string;
  setMnemonic: (mnemonic: string) => void;
};

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      mnemonic: "",
      setMnemonic: (m: string) => {
        set(() => ({
          mnemonic: m,
        }));
      },
    }),
    {
      name: "pixel-pay-wallet-store",
      partialize: (state) => ({
        mnemonic: state.mnemonic,
      }),
    },
  ),
);
