import React, { ReactNode, useContext, useEffect, useState } from "react";
import { ethers, Wallet } from "ethers";
import { useWalletStore } from "../stores/useWalletStore.tsx";
import { useParams } from "react-router-dom";
import { doUrlDecrypt } from "../utils.ts";

export interface WalletContextProps {
  wallet: Wallet | null;
  setWallet: React.Dispatch<React.SetStateAction<Wallet | null>>;
}

export const WalletContextInitialState: WalletContextProps = {
  wallet: null,
  setWallet: () => {},
};

export const WalletContext = React.createContext<WalletContextProps>(
  WalletContextInitialState,
);

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const { wallet: urlWallet } = useParams();

  const [wallet, setWallet] = useState<Wallet | null>(null);

  const { mnemonic, setMnemonic } = useWalletStore();

  useEffect(() => {
    if (urlWallet)
      setWallet(ethers.Wallet.fromMnemonic(doUrlDecrypt(urlWallet)));
    if (mnemonic) setWallet(ethers.Wallet.fromMnemonic(mnemonic));
    else {
      const w = ethers.Wallet.createRandom();
      setWallet(w);
      setMnemonic(w.mnemonic.phrase);
    }
  }, [mnemonic, setMnemonic]);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
