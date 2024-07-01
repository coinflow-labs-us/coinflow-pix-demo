import { Cents, centsToDollars, doUrlEncrypt } from "../utils.ts";
import { QRCodeComponent } from "../App.tsx";
import { toast } from "react-hot-toast";
import { useWalletStore } from "../stores/useWalletStore.tsx";
import { useMemo } from "react";

export function ForeignBankPage({
  amount,
  qrData,
}: {
  amount: Cents;
  qrData: string;
}) {
  const { mnemonic } = useWalletStore();

  const url = useMemo(() => {
    return `${window.location.host}/pay?amount=${amount.cents}&wallet=${doUrlEncrypt(mnemonic)}&data=${qrData}`;
  }, [amount.cents, mnemonic, qrData]);

  const copyToClipboard = async () => {
    if ("clipboard" in navigator) {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    } else {
      console.log("Clipboard not supported");
    }
  };

  return (
    <div className={"flex flex-col items-center justify-center w-full md:w-96"}>
      <QRCodeComponent value={"PixTestPayment"} />
      <div
        className={
          "flex items-center space-x-1 text-xs text-emerald-900 bg-emerald-100 rounded-xl p-1 pr-2"
        }
      >
        <i className={"bx bxs-check-circle"} />
        <span>Top up ${centsToDollars(amount)}</span>
      </div>
      <div className={"flex items-center space-x-6 my-6 w-full"}>
        <div className={"h-[0.5px] flex-1 bg-black/10"} />
        <span className={"text-slate-600 text-sm"}>or</span>
        <div className={"h-[0.5px] flex-1 bg-black/10"} />
      </div>
      <button
        onClick={() => {}}
        className={
          "rounded-lg flex items-center justify-center h-14 hover:bg-slate-50 transition group bg-slate-100 text-slate-900 font-semibold text-sm w-full"
        }
      >
        Navigate to payment link
        <i
          className={
            "bx bx-link-external ml-2 group-hover:translate-x-0.5 transition"
          }
        />
      </button>
      <button
        onClick={() => copyToClipboard()}
        className={
          "rounded-lg flex items-center justify-center h-14 hover:bg-slate-100 transition group ring-1 ring-black/5 mt-6 text-slate-900 font-semibold text-sm w-full"
        }
      >
        Copy payment link
        <i
          className={"bx bx-copy ml-2 group-hover:translate-x-0.5 transition"}
        />
      </button>
    </div>
  );
}
