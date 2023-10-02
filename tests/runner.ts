import { appendFileSync } from "fs";
import { CosmosChain, GetRoute, Squid } from "@0xsquid/sdk";
import { SigningStargateClient } from "@cosmjs/stargate";
import {
  DirectSecp256k1HdWallet,
  OfflineDirectSigner,
} from "@cosmjs/proto-signing";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { ethers } from "ethers";
import { sleep } from "../utils";
import { loadAsync } from "node-yaml-config";
import { RunnerCase, cases, intoBaseRequest } from "./cases";

const LOG_FILE = "actions.log";

function log(text: string) {
  appendFileSync(LOG_FILE, `${text}\n`, "utf8");
  console.log(text);
}

export async function getConfig(network: string): Promise<any> {
  const config = await loadAsync("./config.yml", network);
  if (typeof config === undefined) {
    throw new Error("create config.yml file in the root of the repo");
  }

  log(
    `Current config for network type ${network}:\n${JSON.stringify(
      config.api_url,
      null,
      2
    )}`
  );
  return config;
}

export async function runCase(config: any, runnerCase: RunnerCase) {
  log(`Running case: ${runnerCase.caseName}`);

  const squid = new Squid({
    baseUrl: config.api_url,
  });
  await squid.init();
  console.log("Squid SDK inited");

  let signer: ethers.Wallet | SigningStargateClient;
  let signerAddress: string | null = null;
  let params: object;

  switch (runnerCase.caseType) {
    case "evm": {
      const provider = ethers.getDefaultProvider(
        squid.chains.find((c) => c.chainId === runnerCase.fromChainId)!.rpc
      );
      signer = new ethers.Wallet(config.pk, provider);

      params = intoBaseRequest(runnerCase, squid, await signer.getAddress());
      break;
    }

    case "cosmos": {
      const chain = squid.chains.find(
        (c) =>
          c.chainId.toString().toLocaleLowerCase() === runnerCase.fromChainId
      ) as CosmosChain;

      const getSignerFromMnemonic = async (): Promise<OfflineDirectSigner> => {
        return DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
          prefix: chain.bech32Config.bech32PrefixAccAddr,
        });
      };
      const offlineSigner: OfflineDirectSigner = await getSignerFromMnemonic();
      signer = await SigningStargateClient.connectWithSigner(
        chain.rpc,
        offlineSigner
      );

      signerAddress = (await offlineSigner.getAccounts())[0].address;
      log(
        `Cosmos account ${signerAddress} balances:\n ${JSON.stringify(
          await signer.getAllBalances(signerAddress),
          null,
          2
        )}`
      );

      params = intoBaseRequest(runnerCase, squid, signerAddress);
      break;
    }
  }

  log("Getting route...");
  const { route } = await squid.getRoute(params as GetRoute);

  //override gas for fantom
  let overrides;
  if ((params as GetRoute).fromChain === 250) {
    overrides = {
      maxPriorityFeePerGas: ethers.utils.parseUnits("200", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("200", "gwei"),
    };
  }

  log("Route received. Broadcasting transaction...");
  const tx = await squid.executeRoute({
    signer,
    signerAddress,
    route,
    overrides: overrides,
  });

  let txHash: string;
  switch (runnerCase.caseType) {
    case "evm": {
      const evmTx = tx as ethers.providers.TransactionResponse;
      const txReceipt = await evmTx.wait();
      txHash = txReceipt.transactionHash;

      break;
    }

    case "cosmos": {
      const cosmosTx = tx as TxRaw;
      const txReceipt = await (signer as SigningStargateClient).broadcastTx(
        TxRaw.encode(cosmosTx).finish()
      );

      txHash = txReceipt.transactionHash;

      break;
    }
  }

  //const txHash =
  //  "3FF5ABD0596A0A91DB39627FC89FB79C49E0736963BC0637A46041C9C432DF0D";
  log(`TX Hash: ${txHash}`);

  log("Waiting for tx to be indexed...");
  //await sleep(5);

  let statusResult = false;
  while (!statusResult) {
    console.log(
      `Getting tx status for: ${txHash} - caseId: ${runnerCase.caseId} - caseName: ${runnerCase.caseName}`
    );
    try {
      const status = (await squid.getStatus({
        transactionId: txHash,
        fromChainId: runnerCase.fromChainId,
        toChainId: runnerCase.toChainId,
      })) as any;
      console.log(status);
      if (!!status.routeStatus) {
        if (
          !!status.routeStatus.find(
            (s) => s.chainId === runnerCase.toChainId && s.status === "success"
          )
        ) {
          log(
            `Route status found:\n${JSON.stringify(
              status.routeStatus,
              null,
              2
            )}`
          );

          statusResult = true;
          log("########### tx success ############");
          break;
        }
      }
    } catch (error) {
      console.log(error);
      console.log("Tx not found yet..");
      await sleep(3);
    }
  }

  log(
    "------------------------------------------------------------------------------"
  );
}

(async () => {
  const args = process.argv.slice(2);
  const network = args[0] as "testnet" | "mainnet";
  const caseId = parseInt(args[1]);

  const config = await getConfig(network);
  const runnerCase = cases[network].find(
    (runnerCase) => runnerCase.caseId === caseId
  );

  await runCase(config, runnerCase);
})();
