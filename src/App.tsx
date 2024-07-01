import "./App.css";
import QRCode from "qrcode.react";
import { ReactNode, useState } from "react";
import { TopUpSelect } from "./pages/TopUpSelect.tsx";
import { Cents } from "./utils.ts";
import { ForeignBankPage } from "./pages/ForeignBankPage.tsx";
import { useQueryParam } from "./hooks/useQueryParam.tsx";
import { Toaster } from "react-hot-toast";
import { Outlet, useLocation } from "react-router-dom";
import { useWallet, WalletContextProvider } from "./context/WalletContext.tsx";

export enum Pages {
  Home = "home",
  ForeignScan = "foreign-pay",
  PixScan = "pix-pay",
  TopUp = "top-up",
}

function App() {
  return (
    <WalletContextProvider>
      <Toaster position={"bottom-center"} />
      <Outlet />
    </WalletContextProvider>
  );
}

export function AppContent() {
  const [amount, setAmount] = useState<Cents>({ cents: 0 });
  const [page, setPage] = useQueryParam<Pages>("page", Pages.TopUp);

  const location = useLocation();

  const qrData =
    "00020126580014br.gov.bcb.pix0136f8dc3b59-072b-4d44-857b-90e9e8f30c94520400005303986540510.005802BR5917Brla Digital Ltda6009Sao Paulo6223051900001IP2THFKHQdr54q6304505A";

  if (page === Pages.TopUp)
    return (
      <Wrapper title={"Choose top up amount"}>
        <TopUpSelect amount={amount} setAmount={setAmount} setPage={setPage} />
      </Wrapper>
    );

  if (page === Pages.ForeignScan)
    return (
      <Wrapper onBack={() => setPage(Pages.Home)} title={"Scan QR Code to pay"}>
        <ForeignBankPage
          amount={amount}
          qrData={`${location.pathname}?page=${Pages.ForeignScan}&amount=${amount.cents}`}
        />
      </Wrapper>
    );

  if (page === Pages.Home)
    return (
      <Wrapper title={"Select home bank"} onBack={() => setPage(Pages.TopUp)}>
        <button
          onClick={() => setPage(Pages.PixScan)}
          className={
            "flex items-center rounded-lg group hover:bg-slate-100 transition ring-black/5 space-x-8 ring-1 p-6 w-full max-w-96"
          }
        >
          <div className={"flex flex-col text-start flex-1"}>
            <span className={"text-base"}>🇧🇷</span>
            <span className={"text-base font-medium text-slate-900"}>
              I have a Brazilian Bank
            </span>
            <span className={"text-sm font-light text-slate-700"}>
              I live in Brazil and am able to pay with PIX
            </span>
          </div>
          <i
            className={
              "bx text-lg bx-right-arrow-alt text-slate-900 transition group-hover:translate-x-0.5"
            }
          />
        </button>

        <button
          onClick={() => setPage(Pages.ForeignScan)}
          className={
            "flex items-center justify-start outline-none group hover:bg-slate-100 transition rounded-lg ring-black/5 space-x-8 ring-1 p-6 w-full max-w-96"
          }
        >
          <div className={"flex flex-col text-start flex-1"}>
            <span className={"text-base"}>🇺🇸 🇨🇦 🇪🇺</span>
            <span className={"text-base font-medium text-slate-900"}>
              I'm a foreigner
            </span>
            <span className={"text-sm font-light text-slate-700"}>
              I do not have a Brazilian bank account and cannot pay with PIX
            </span>
          </div>
          <i
            className={
              "bx text-lg bx-right-arrow-alt text-slate-900 transition group-hover:translate-x-0.5"
            }
          />
        </button>
      </Wrapper>
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

  console.log({ wallet });

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
