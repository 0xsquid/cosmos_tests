import { cases } from "./cases";
import { getConfig, runCase } from "./runner";

(async () => {
  const args = process.argv.slice(2);
  const network = args[0] as "testnet" | "mainnet";

  const config = await getConfig(network);
  const allCases = cases[network];

  for (const runnerCase of allCases) {
    await runCase(config, runnerCase);
  }
})();
