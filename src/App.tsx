import "./App.css";
import QRCode from "qrcode.react";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { useWallet, WalletContextProvider } from "./context/WalletContext.tsx";

function App() {
  return (
    <WalletContextProvider>
      <Toaster position={"bottom-center"} />
      <Outlet />
    </WalletContextProvider>
  );
}

export function Wrapper({
  children,
  onBack,
  title,
}: {
  children: ReactNode;
  onBack?: () => void;
  title: string;
}) {
  return (
    <div
      className={
        "w-screen flex flex-col items-center justify-center h-screen bg-white"
      }
    >
      <h1 className={"text-4xl font-medium text-emerald-600 mb-4"}>
        pixel • pay
      </h1>
      <WalletUi />

      <div
        className={
          "rounded-3xl ring-black/5 ring-1 relative overflow-hidden bg-white mt-8"
        }
      >
        <div
          className={
            "relative flex flex-col p-6 space-y-6 items-center bg-white/90 backdrop-blur-2xl"
          }
        >
          <div
            className={"flex border-b pb-3 items-center border-black/5 w-full"}
          >
            <BackButton onClick={onBack} />
            <span className={"flex-1 text-center text-slate-900 text-base"}>
              {title}
            </span>
            <i className={"bx bx-left-arrow-alt opacity-0"} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function WalletUi() {
  const { wallet } = useWallet();

  // const getBalance = useCallback(async () => {
  //     if(!wallet) return;
  //
  //     const provider = new ethers.providers.JsonRpcProvider(
  //         "https://polygon-rpc.com/",
  //     );
  //
  //     const walletAddress = wallet.address;
  //     const tokenAddress = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582"; // Example: USDC on Polygon
  //
  //     const tokenAbi = [
  //         // balanceOf
  //         "function balanceOf(address owner) view returns (uint256)",
  //     ];
  //
  //     const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
  //
  //     setBalance( await tokenContract.balanceOf(walletAddress))
  // } [])

  if (!wallet) return null;

  return (
    <div className={"flex space-x-2 items-center"}>
      <i className={"bx bxs-wallet text-slate-900"} />
      <span className={"text-slate-600 font-light text-xs"}>
        {wallet.address}
      </span>
    </div>
  );
}

function BackButton({ onClick }: { onClick?: () => void }) {
  if (!onClick) return null;

  return (
    <button onClick={onClick} className={"group size-9 rounded-full relative"}>
      <div
        className={
          "absolute rounded-full top-0 bottom-0 right-0 left-0 scale-0 group-hover:scale-100 transition bg-slate-100"
        }
      />
      <i className={"bx z-10 relative bx-left-arrow-alt text-slate-900"} />
    </button>
  );
}

export function QRCodeComponent({ value }: { value: string }) {
  return (
    <div>
      <QRCode
        value={value}
        size={200} // Size of the QR code
        level="H" // Error correction level: L, M, Q, H
        includeMargin={true} // Include margin
        bgColor="#FFFFFF" // Background color
        fgColor="#000000" // Foreground color
      />
    </div>
  );
}

export default App;
