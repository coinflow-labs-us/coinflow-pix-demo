import { centsToDollars, doUrlEncrypt } from "../utils.ts";
import { QRCodeComponent, Wrapper } from "../App.tsx";
import { toast } from "react-hot-toast";
import { useWalletStore } from "../stores/useWalletStore.tsx";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useJwtStore } from "../stores/useJwtStore.tsx";
import { useTransaction } from "../hooks/useTransaction.tsx";
import { PaymentSuccess } from "./ConfirmationPage.tsx";

export function PaymentPage() {
  const { jwt } = useJwtStore();
  const { mnemonic } = useWalletStore();
  const [searchParams] = useSearchParams();

  const amount = Number(searchParams.get("amount"));
  const quote = Number(searchParams.get("quote"));
  const brCode = searchParams.get("code");
  const paymentId = searchParams.get("id");

  const transaction = useTransaction(jwt, paymentId ?? "");

  const url = useMemo(() => {
    return `/confirm?amount=${amount}&quote=${quote}&jwt&wallet=${doUrlEncrypt(mnemonic)}&id=${paymentId}&jwt=${doUrlEncrypt(jwt)}`;
  }, [amount, quote, mnemonic, paymentId, jwt]);

  const copyToClipboard = async () => {
    if ("clipboard" in navigator) {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  if (transaction) {
    return (
      <Wrapper title={"Payment complete"}>
        <div
          className={"flex flex-col items-center justify-center w-full md:w-96"}
        >
          <PaymentSuccess {...transaction} />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper title={"Scan QR code to pay"}>
      <div
        className={"flex flex-col items-center justify-center w-full md:w-96"}
      >
        <QRCodeComponent value={brCode ?? ""} />
        <div
          className={
            "flex items-center space-x-1 text-xs text-emerald-900 bg-emerald-100 rounded-xl p-1 pr-2"
          }
        >
          <i className={"bx bxs-check-circle"} />
          <span>Top up ${centsToDollars({ cents: quote })}</span>
        </div>
        <div className={"flex items-center space-x-6 my-6 w-full"}>
          <div className={"h-[0.5px] flex-1 bg-black/10"} />
          <span className={"text-slate-600 text-sm"}>or</span>
          <div className={"h-[0.5px] flex-1 bg-black/10"} />
        </div>
        <Link
          target={"_blank"}
          to={url}
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
        </Link>
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
    </Wrapper>
  );
}
