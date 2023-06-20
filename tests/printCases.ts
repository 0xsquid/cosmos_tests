import { cases } from "./cases";

(async () => {
  const args = process.argv.slice(2);
  const network = args[0] as "testnet" | "mainnet";

  const allCases = cases[network];

  console.log(`Available cases:\n${JSON.stringify(allCases, null, 2)}`);
})();
