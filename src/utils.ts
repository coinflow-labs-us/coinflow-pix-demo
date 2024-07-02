export type Cents = {
  cents: number;
};

const secretKey = "yourSecretKey";

export function centsToDollars({ cents }: Cents): string {
  return (Math.trunc(cents) / 100).toFixed(2);
}

export function centsToLocalizedDollars({ cents }: Cents): string {
  try {
    return Number(centsToDollars({ cents })).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (e) {
    console.error(e);
    return centsToDollars({ cents });
  }
}

export function dollarsToCents(dollars: string | number): Cents {
  if (typeof dollars === "string") {
    dollars = Number(dollars);
  }

  if (isNaN(dollars) || dollars <= 0) return { cents: 0 };
  return { cents: Math.trunc(Number((dollars * 100).toFixed(0))) };
}

export function postData(
  url: string = "",
  data: object = {},
  headers: object = {},
) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });
}

export function getData(url: string = "", headers: object = {}) {
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

import CryptoJS from "crypto-js";

// Function to encrypt a plain text string
export function encryptString(plainText: string, secretKey: string): string {
  const ciphertext = CryptoJS.AES.encrypt(plainText, secretKey).toString();
  return ciphertext;
}

// Function to decrypt a ciphertext string
export function decryptString(cipherText: string, secretKey: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

// Function to URL-safe encode a string
export function urlSafeEncode(data: string): string {
  return encodeURIComponent(data);
}

// Function to URL-safe decode a string
export function urlSafeDecode(data: string): string {
  return decodeURIComponent(data);
}

export function doUrlEncrypt(text: string): string {
  const encryptedText = encryptString(text, secretKey);
  return urlSafeEncode(encryptedText);
}

export function doUrlDecrypt(text: string) {
  const decodedText = urlSafeDecode(text);
  return decryptString(decodedText, secretKey);
}

export async function getBrlaTransactionHistory(
  jwt: string,
  paymentId: string,
  unauthorizedCallback: () => void,
) {
  const res = await getData(
    `https://api.brla.digital:4567/v1/business/pay-in/pix-to-usd/history?id=${paymentId}`,
    { Authorization: "Bearer " + jwt },
  );

  if (res.status === 401) return unauthorizedCallback();

  const json = await res.json();

  if (
    !json ||
    !json.depositsLogs ||
    !json.depositsLogs[0] ||
    !json.depositsLogs[0].pixToUsdOps
  )
    return null;

  const log = json.depositsLogs[0];

  return {
    settlementAddress: log.receiverAddress,
    reference: log.referenceLabel,
    signature: log.pixToUsdOps[0].smartContractOps[0].tx,
  };
}
