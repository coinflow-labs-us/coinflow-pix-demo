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
      <div className={"overflow-auto bg-emerald-600"}>
        <Outlet />
      </div>
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
        "w-screen flex flex-col overflow-auto py-12 px-4 bg-emerald-600 min-h-screen"
      }
    >
      <h1 className={"text-4xl font-medium text-white mb-4 text-center"}>
        pixel • pay
      </h1>
      <WalletUi />

      <div
        className={
          "rounded-lg ring-black/5 ring-1 relative overflow-hidden bg-white mt-8 w-full md:w-96 m-auto"
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

  if (!wallet) return null;

  return (
    <div className={"flex space-x-2 items-center mx-auto"}>
      <i className={"bx bxs-wallet text-white/70"} />
      <span className={"text-white/70 font-light text-xs"}>
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
