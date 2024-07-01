import { Link, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext.tsx";
import { centsToDollars, getData, postData } from "../utils.ts";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../LoadingSpinner.tsx";

export function PaymentPage() {
  const [searchParams, _] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>("");
  const [quote, setQuote] = useState<string | null>(null);

  const { wallet } = useWallet();

  console.log({ quote });

  const amount = searchParams.get("amount");

  const address = wallet?.address;

  const getQuote = useCallback(async () => {
    if (!amount) return;
    try {
      const jwtRes = await (
        await postData("https://api.brla.digital:4567/v1/business/login", {
          email: "tech+coinflow@brla.digital",
          password: "123456789",
        })
      ).json();

      const accessToken = jwtRes.accessToken;

      const quoteRes = await (
        await getData(
          `https://api.brla.digital:4567/v1/business/fast-quote?operation=swap&amount=${amount}&inputCoin=USDC&outputCoin=BRLA&chain=Polygon`,
          { Authorization: "Bearer " + accessToken },
        )
      ).json();

      setQuote(quoteRes.amountBrl);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  }, [amount]);

  useEffect(() => {
    getQuote().catch((e) => console.error(e));
  }, [getQuote]);

  const checkout = useCallback(async () => {
    setLoading(true);

    const card = {
      cardToken: "543111LSQPT51111",
      expYear: "25",
      expMonth: "08",
      email: "test@pixelpay.test",
      firstName: "test",
      lastName: "test",
      address1: "test",
      city: "test",
      zip: "55555",
      state: "IL",
      country: "US",
    };

    const merchant = "pixelpay";

    const endpoint = `https://api-sandbox.coinflow.cash/api/checkout/card/${merchant}`;

    const headers = {
      "x-coinflow-auth-wallet": address,
      "x-coinflow-auth-blockchain": "polygon",
    };

    try {
      const res = await postData(
        endpoint,
        { subtotal: { cents: amount }, card },
        headers,
      );

      const data = await res.json();

      console.log("Payment Authorized", data.paymentId);

      while (!signature) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await getData(
          `https://api-sandbox.coinflow.cash/api/merchant/payments/${data.paymentId}`,
          {
            Authorization:
              "coinflow_sandbox_5560fe34ce0444eabb5016243fc44d40_1674d71a021f414b8919e9c80d694871",
          },
        );
        const responseData = await response.json();
        console.log({ responseData });
        setSignature(responseData.signature);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setLoading(false);
      console.log("SIGNATURE: ", signature);
    } catch (e) {
      console.log("CHECKOUT ERROR: ", e);
      console.error(e);
      toast.error("Error on checkout");
      setLoading(false);
    }
  }, [address, amount, signature]);

  if (!wallet) return null;

  if (!quote)
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
              Order number
            </span>
            <span className={"text-slate-500 text-xs"}>#57283</span>
          </div>
          <div className={"flex items-baseline mt-2"}>
            <span className={"flex-1 text-slate-700 text-sm"}>
              Payment method
            </span>
            <span className={"text-slate-500 text-xs"}>PIX</span>
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
          {signature ? (
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

              <span className={"text-base text-emerald-950 mb-1"}>
                Payment Success
              </span>
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
          ) : (
            <div className={"p-4"}>
              <button
                onClick={() => checkout()}
                className={
                  "rounded-lg flex items-center justify-center !h-14 hover:bg-emerald-500 transition group bg-emerald-600 text-white font-semibold text-sm w-full"
                }
              >
                {loading ? (
                  <LoadingSpinner color={"#FFFFFF"} />
                ) : (
                  <>
                    Confirm payment of R${" "}
                    {centsToDollars({ cents: amount ? Number(amount) : 0 })}
                    <i
                      className={
                        "bx bx-right-arrow-alt ml-2 group-hover:translate-x-0.5 transition"
                      }
                    />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {signature ? (
        <Link
          to={"/"}
          className={
            "mt-6 bg-white/5 hover:bg-white/10 transition rounded-full p-3 flex items-center space-x-2"
          }
        >
          <i className={"bx bx-refresh"} />
          <span className={"text-xs"}>Deposit again</span>
        </Link>
      ) : null}
    </div>
  );
}
