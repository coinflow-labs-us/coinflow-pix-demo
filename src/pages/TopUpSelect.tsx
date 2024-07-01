import { Pages } from "../App.tsx";
import { Cents, centsToDollars, dollarsToCents } from "../utils.ts";
import { useState } from "react";

export function TopUpSelect({
  amount,
  setAmount,
  setPage,
}: {
  amount: Cents;
  setAmount: (n: Cents) => void;
  setPage: (n: Pages) => void;
}) {
  const [stringAmount, setStringAmount] = useState<string>("");

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
    <div className={"flex flex-col items-center justify-center w-96"}>
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
            setStringAmount(e.target.value);
            setAmount(dollarsToCents(e.target.value));
          }}
          placeholder={"Enter top up amount"}
          className={
            "font-medium caret-emerald-600 my-6 pl-10 w-full bg-white border-b border-b-black/5 focus:border-b-emerald-600 focus:border-b-2  outline-none  transition  flex items-center p-4 text-2xl text-slate-900"
          }
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

      <button
        onClick={() => setPage(Pages.Home)}
        className={
          "rounded-lg flex items-center justify-center h-14 hover:bg-emerald-500 transition group bg-emerald-600 text-white font-semibold text-sm w-full"
        }
      >
        Continue
        <i
          className={
            "bx bx-right-arrow-alt ml-2 group-hover:translate-x-0.5 transition"
          }
        />
      </button>
    </div>
  );
}
