import { useCallback, useEffect, useState } from "react";
import { getBrlaTransactionHistory } from "../utils.ts";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useTransaction(
  jwt: string,
  paymentId: string,
  interval?: number = 10000,
) {
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState<{
    settlementAddress: string;
    signature: string;
    reference: string;
  } | null>(null);

  const getTxHistory = useCallback(async () => {
    if (transaction) return;
    try {
      const tx = await getBrlaTransactionHistory(jwt, paymentId, () =>
        navigate("/"),
      );
      if (tx) setTransaction(tx);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  }, [transaction, jwt, paymentId, navigate]);

  useEffect(() => {
    const intervalID = setInterval(getTxHistory, interval);

    return () => clearInterval(intervalID);
  }, [getTxHistory]);

  return transaction;
}
