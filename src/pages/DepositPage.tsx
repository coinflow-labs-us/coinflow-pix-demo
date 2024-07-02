import { Wrapper } from "../App.tsx";
import {
  Cents,
  centsToDollars,
  dollarsToCents,
  getData,
  postData,
} from "../utils.ts";
import { useCallback, useEffect, useState } from "react";
import { useJwtStore } from "../stores/useJwtStore.tsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../LoadingSpinner.tsx";

export const SETTLEMENT_ADDRESS = "0x3D3ECccC2D95731c3668E8C93f1d2aD2ac60ec97";

export function DepositPage() {
  const [stringAmount, setStringAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { jwt, setJwt } = useJwtStore();

  const [amount, setAmount] = useState<Cents>({ cents: 0 });
  const [quote, setQuote] = useState<{ amount: Cents; token: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const getJwt = useCallback(async () => {
    const jwtRes = await (
      await postData("https://api.brla.digital:4567/v1/business/login", {
        email: "tech+coinflow@brla.digital",
        password: "123456789",
      })
    ).json();

    setJwt(jwtRes.accessToken);
    return jwtRes.accessToken;
  }, [setJwt]);

  const getQuote = useCallback(
    async (amt: Cents) => {
      if (!amt.cents) return;
      setLoading(true);

      try {
        const quoteRes = await (
          await getData(
            `https://api.brla.digital:4567/v1/business/fast-quote?operation=pix-to-usd&amount=${amt.cents}&inputCoin=BRLA&outputCoin=USDC&chain=Polygon&fixOutput=true`,
            { Authorization: "Bearer " + jwt },
          )
        ).json();

        setQuote({
          amount: dollarsToCents(Number(quoteRes.amountBrl)),
          token: quoteRes.token,
        });
        setLoading(false);
      } catch (e) {
        console.error(e);
        toast.error("Something went wrong");
        setLoading(false);
      }
    },
    [jwt],
  );

  const getBrCode = useCallback(async () => {
    if (!quote) return;
    setLoading(true);

    try {
      const res = await (
        await postData(
          "https://api.brla.digital:4567/v1/business/pay-in/pix-to-usd",
          {
            token: quote.token,
            receiverAddress: SETTLEMENT_ADDRESS,
          },
          { Authorization: "Bearer " + jwt },
        )
      ).json();
      if (res.error) {
        setError(res.error);
        throw new Error(res.error);
      }

      navigate(
        `/pay?quote=${quote.amount.cents}&code=${res.brCode}&id=${res.id}&amount=${amount.cents}`,
      );
      setLoading(false);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
      setLoading(false);
    }
  }, [amount.cents, jwt, navigate, quote]);

  useEffect(() => {
    getJwt().catch((e) => console.error(e));
  }, [getJwt, jwt]);

  useEffect(() => {
    getQuote(amount).catch((e) => console.error(e));
    const intervalID = setInterval(() => getQuote(amount), 8000);

    return () => clearInterval(intervalID);
  }, [amount, getQuote]);

  const buttons = [
    {
      label: "$10",
      value: { cents: 1000 },
    },
    {
      label: "$20",
      value: { cents: 2000 },
    },
    {
      label: "$50",
      value: { cents: 5000 },
    },
  ];

  return (
    <Wrapper title={"Choose top up amount"}>
      <div className={"flex flex-col items-center justify-center w-full"}>
        <div className={"relative w-full"}>
          <span
            className={
              "absolute top-1/2 -translate-y-1/2 left-3 mt-0.5 text-emerald-600 font-medium text-sm"
            }
          >
            $
          </span>

          <input
            onBlur={() => setStringAmount(centsToDollars(amount))}
            autoFocus
            type={"number"}
            value={stringAmount}
            onChange={(e) => {
              if (Number(e.target.value) > 20) setError("Max payment of $20");
              else if (error) setError(null);

              setStringAmount(e.target.value);
              setAmount(dollarsToCents(e.target.value));
            }}
            placeholder={"Enter top up amount"}
            className={`font-medium caret-emerald-600 my-6 pl-10 w-full bg-white border-b ${error ? "border-b-red-500 focus:border-b-red-500" : "border-b-black/5  focus:border-b-emerald-600"} focus:border-b-2  outline-none  transition  flex items-center p-4 text-2xl text-slate-900`}
          />
        </div>
        <div className={"flex space-x-6 w-full mb-6"}>
          {buttons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => {
                setAmount(btn.value);
                setStringAmount(centsToDollars(btn.value));
              }}
              className={`${btn.value.cents === amount.cents ? "ring-2 ring-emerald-600" : "ring-1 ring-black/5"} rounded-lg h-14  flex-1 flex items-center justify-center hover:bg-slate-100 transition hover:scale-[99%] font-semibold text-base text-slate-900`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <QuoteTable
          amount={amount}
          quote={quote?.amount ?? { cents: 0 }}
          loading={loading}
        />

        <button
          onClick={() => {
            if (Number(amount.cents) > 2000) {
              toast.error("Max payment of $20");
              setError("Max payment of $20");
            } else getBrCode().catch();
          }}
          className={
            "rounded-lg flex items-center justify-center h-14 hover:bg-emerald-500 transition group bg-emerald-600 text-white font-semibold text-sm w-full"
          }
        >
          {loading ? (
            <LoadingSpinner color={"#FFFFFF"} />
          ) : (
            <>
              Continue
              <i
                className={
                  "bx bx-right-arrow-alt ml-2 group-hover:translate-x-0.5 transition"
                }
              />
            </>
          )}
        </button>
      </div>

      {error ? (
        <div
          className={
            "bg-red-50 flex flex-col rounded-md ring-1 ring-red-100 text-red-900 text-sm p-4 pt-2 w-full lg:w-96"
          }
        >
          <div className={"flex w-full items-center justify-between"}>
            <span className={"text-red-900 font-semibold text-sm"}>Error:</span>
            <button
              onClick={() => setError(null)}
              className={"group size-8 rounded-full relative"}
            >
              <div
                className={
                  "absolute rounded-full top-0 bottom-0 right-0 left-0 scale-0 group-hover:scale-100 transition bg-red-100"
                }
              />
              <i className={"bx z-10 relative bx-x text-red-900"} />
            </button>
          </div>
          <span className={"text-red-900 text-xs"}>{error}</span>
        </div>
      ) : null}
    </Wrapper>
  );
}

function QuoteTable({
  amount,
  quote,
  loading,
}: {
  amount: Cents;
  quote: Cents;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div
        className={
          "flex items-baseline h-14 py-4 border-t border-black/10 w-full"
        }
      >
        <span className={"flex-1 text-slate-700 text-sm"}>
          Conversion Quote
        </span>

        <div className={"h-3.5 w-20 bg-slate-200 animate-pulse rounded-sm"} />
        <i className={"bx bx-arrow-to-right text-emerald-600 mx-3"} />
        <div className={"h-3.5 w-20  bg-slate-200 animate-pulse rounded-sm"} />
      </div>
    );
  }

  return (
    <div
      className={
        "flex items-baseline py-4 h-14 border-t border-black/10 w-full"
      }
    >
      <span className={"text-slate-700 text-sm"}>Conversion Quote</span>
      <div
        className={"flex-1 h-1 border-b border-dashed border-black/10 mx-2"}
      />

      <span className={"text-slate-900 text-sm min-w-[80px] text-end"}>
        ${centsToDollars(amount)} 🇺🇸
      </span>
      <i className={"bx bx-right-arrow-alt text-emerald-600 mx-3"} />
      <span className={"text-slate-900 text-sm min-w-[80px] text-end"}>
        R$ {centsToDollars(quote)} 🇧🇷
      </span>
    </div>
  );
}
