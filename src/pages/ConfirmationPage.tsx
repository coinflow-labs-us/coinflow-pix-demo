import { Link, useSearchParams } from "react-router-dom";
import { useWallet } from "../context/WalletContext.tsx";
import { centsToDollars, doUrlDecrypt } from "../utils.ts";
import { LoadingSpinner } from "../LoadingSpinner.tsx";
import { useTransaction } from "../hooks/useTransaction.tsx";

export function ConfirmationPage() {
  const [searchParams] = useSearchParams();

  const { wallet } = useWallet();

  const amount = searchParams.get("amount");
  const quote = searchParams.get("quote");
  const urlJwt = searchParams.get("jwt");
  console.log({ urlJwt });
  const jwt = doUrlDecrypt(urlJwt ?? "");
  console.log({ jwt });
  const paymentId = searchParams.get("id");

  const transaction = useTransaction(jwt, paymentId ?? "", 3000);

  if (!wallet) return null;

  if (!transaction) {
    return (
      <div
        className={
          "w-screen h-screen flex flex-col items-center justify-center bg-emerald-600"
        }
      >
        <div
          className={
            "flex flex-col items-center justify-center size-80 rounded-lg bg-white relative"
          }
        >
          <LoadingSpinner color={"#000000"} className={"!size-7"} />
          <h2 className={"text-xl font-medium text-slate-900 mt-4"}>
            Loading Payment
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "w-screen h-screen flex flex-col items-center justify-center bg-emerald-600"
      }
    >
      <div className={"flex flex-col w-96 rounded-lg bg-white relative"}>
        <h1
          className={
            "text-xl font-medium m-4 flex text-emerald-600 pb-4 border-dashed border-b border-black/10"
          }
        >
          pixel • pay
        </h1>

        <div className={"mx-4 mb-4 pb-4"}>
          <h2 className={"text-base font-medium flex text-slate-900 mb-3"}>
            Checkout summary
          </h2>
          <div className={"flex items-baseline mt-2"}>
            <span className={"flex-1 text-slate-700 text-sm"}>
              Payment method
            </span>
            <span className={"text-slate-500 text-xs"}>PIX</span>
          </div>
          <div className={"flex items-baseline mt-2"}>
            <span className={"flex-1 text-slate-700 text-sm"}>Transaction</span>
            <a
              href={`https://amoy.polygonscan.com/tx/${transaction.signature}`}
              className={
                "text-emerald-600 text-xs underline decoration-emerald-600"
              }
            >
              {transaction.signature.slice(0, 8)}...
            </a>
          </div>
          <div className={"flex items-baseline mt-2"}>
            <span className={"flex-1 text-slate-700 text-sm"}>
              Settlement Address
            </span>
            <a
              href={`https://amoy.polygonscan.com/address/${transaction.settlementAddress}`}
              className={
                "text-emerald-600 text-xs underline decoration-emerald-600"
              }
            >
              {transaction.settlementAddress.slice(0, 8)}...
            </a>
          </div>
          <div className={"flex items-baseline mt-2"}>
            <span className={"flex-1 text-slate-700 text-sm"}>Reference</span>
            <span className={"text-slate-500 text-xs"}>
              {transaction.reference}
            </span>
          </div>
        </div>

        <div className={"w-full relative flex items-center h-5"}>
          <div
            className={
              "absolute size-5 rounded-full bg-emerald-600 top-0 bottom-0 -left-2.5"
            }
          />
          <div className={"w-full border-b border-dashed border-black/10"} />
          <div
            className={
              "absolute size-5 rounded-full bg-emerald-600 top-0 bottom-0 -right-2.5"
            }
          />
        </div>

        <div
          className={"mx-4 mt-4 pb-4 border-dashed border-b border-black/10"}
        >
          <h2 className={"text-base font-medium flex text-slate-900 mb-3"}>
            Item
          </h2>
          <div className={"flex items-baseline mt-2"}>
            <span className={"flex-1 text-slate-700 text-sm"}>
              Wallet top up
            </span>
            <span className={"text-slate-900 text-xs"}>
              {centsToDollars({ cents: amount ? Number(amount) : 0 })} USD
            </span>
          </div>
          <div className={"flex items-baseline mt-2"}>
            <span className={"flex-1 text-slate-700 text-sm"}>Total</span>
            <span className={"text-slate-900 text-lg font-semibold"}>
              R$ {quote}
            </span>
          </div>
        </div>

        <div className={"flex flex-col w-full md:w-96"}>
          <PaymentSuccess {...transaction} />
        </div>
      </div>

      <Link
        to={"/"}
        className={
          "mt-6 bg-white/5 hover:bg-white/10 transition rounded-full p-3 flex items-center space-x-2"
        }
      >
        <i className={"bx bx-refresh"} />
        <span className={"text-xs"}>Deposit again</span>
      </Link>
    </div>
  );
}

export function PaymentSuccess({
  signature,
  reference,
  settlementAddress,
}: {
  signature: string;
  reference: string;
  settlementAddress: string;
}) {
  return (
    <div
      className={
        "w-full rounded-lg  text-center p-6 flex flex-col items-center"
      }
    >
      <div
        className={
          "rounded-full flex items-center justify-center size-10 bg-green-200 mb-3"
        }
      >
        <div
          className={
            "rounded-full flex items-center justify-center size-8 bg-green-300"
          }
        >
          <i className={"bx bxs-badge-check text-emerald-900"} />
        </div>
      </div>

      <span className={"text-base text-emerald-950 mb-1"}>Payment Success</span>
      <a
        target={"_blank"}
        href={`https://amoy.polygonscan.com/tx/${signature}#eventlog`}
        className={
          "text-sm hover:opacity-80  transition underline decoration-emerald-600 text-emerald-600"
        }
      >
        View transaction
      </a>
    </div>
  );
}
