import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
export function sandbox() {
  // Read private key from a file
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename);
  const privateKeyPath = path.join(__dirname, "priv.pem");
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");

  // Message you want to sign
  const message = "My API Key";

  // Create a SHA-256 hash of the message
  // const hash = crypto.createHash("sha256").update(message).digest();

  // Sign the hash with the private key
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(message);
  const signature = signer.sign(privateKey, "base64");

  console.log("Signature:", signature);

  // Optionally, you can also export the public key from the private key
  const keyPair = crypto.createPrivateKey(privateKey);
  const publicKey = crypto.createPublicKey(keyPair);
  const publicKeyPEM = publicKey.export({ type: "spki", format: "pem" });

  console.log("Public Key:", publicKeyPEM);
}

sandbox();
