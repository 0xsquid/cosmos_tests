import { Squid } from "@0xsquid/sdk";
import { ethers } from "ethers";

export type RunnerCase = {
  caseId: number;
  caseName: string;
  caseType: "cosmos" | "evm";
  fromAmount: string;
  fromChainId: string | number;
  fromToken: string;
  toChainId: string | number;
  toToken: string;
  toAddress: string;
};

export type Cases = {
  ["testnet"]: RunnerCase[];
  ["mainnet"]: RunnerCase[];
};

export const cases: Cases = {
  ["testnet"]: [
    // evm-cosmos
    {
      caseId: 101,
      caseName: "avax:avax-nusdc:dydx",
      caseType: "evm",
      fromAmount: ethers.utils.parseUnits(".05", "18").toString(),
      fromChainId: 43113,
      fromToken: "avax",
      toChainId: "dydxprotocol-testnet",
      toToken: "usdc",
      toAddress: "dydx1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64qa96wl",
    },
    {
      caseId: 102,
      caseName: "avax:avax-nusdc:osmosis",
      caseType: "evm",
      fromAmount: ethers.utils.parseUnits(".05", "18").toString(),
      fromChainId: 43113,
      fromToken: "avax",
      toChainId: "osmo-test-5",
      toToken: "usdc",
      toAddress: "osmo1eaztm3pqrkw2xgt0lxppahtx5v5pndmjg6yfrh",
    },
    {
      caseId: 103,
      caseName: "avax:avax-nusdc:noble",
      caseType: "evm",
      fromAmount: ethers.utils.parseUnits(".1", "18").toString(),
      fromChainId: 43113,
      fromToken: "avax",
      toChainId: "grand-1",
      toToken: "usdc",
      toAddress: "noble1al29pjgw8hy7rmtvxlckrse7vkdrlz5z78m8rc",
    },

    // cosmos-evm
    {
      caseId: 201,
      caseName: "nusdc:osmosis-avax:avax",
      caseType: "cosmos",
      fromAmount: "151111",
      fromChainId: "osmo-test-5",
      fromToken: "usdc",
      toChainId: 43113,
      toToken: "avax",
      toAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
    },
    {
      caseId: 202,
      caseName: "ausdc:osmosis-avax:avax",
      caseType: "cosmos",
      fromAmount: "1511111",
      fromChainId: "osmo-test-5",
      fromToken: "ausdc",
      toChainId: 43113,
      toToken: "avax",
      toAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
    },
    {
      caseId: 203,
      caseName: "nusdc:noble-avax:avax",
      caseType: "cosmos",
      fromAmount: "1511111",
      fromChainId: "grand-1",
      fromToken: "usdc",
      toChainId: 43113,
      toToken: "avax",
      toAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
    },
    // cosmos-cosmos
    {
      caseId: 301,
      caseName: "nusdc:noble-nusdc:osmosis",
      caseType: "cosmos",
      fromAmount: "111111",
      fromChainId: "grand-1",
      fromToken: "usdc",
      toChainId: "osmo-test-5",
      toToken: "usdc",
      toAddress: "osmo1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64plcwc6",
    },
    {
      caseId: 302,
      caseName: "nusdc:osmosis-nusdc:noble",
      caseType: "cosmos",
      fromAmount: "1511111",
      fromChainId: "osmo-test-5",
      fromToken: "usdc",
      toChainId: "grand-1",
      toToken: "usdc",
      toAddress: "noble1al29pjgw8hy7rmtvxlckrse7vkdrlz5z78m8rc",
    },
    {
      caseId: 303,
      caseName: "nusdc:osmosis-uosmo:osmosis",
      caseType: "cosmos",
      fromAmount: "111111",
      fromChainId: "osmo-test-5",
      fromToken: "usdc",
      toChainId: "osmo-test-5",
      toToken: "osmo",
      toAddress: "osmo1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64plcwc6",
    },
    {
      caseId: 304,
      caseName: "nusdc:osmosis-ausdc:axelar",
      caseType: "cosmos",
      fromAmount: "111111",
      fromChainId: "osmo-test-5",
      fromToken: "usdc",
      toChainId: "axelar-testnet-lisbon-3",
      toToken: "ausdc",
      toAddress: "axelar1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64d2ak9f",
    },
    {
      caseId: 305,
      caseName: "ausdc:osmosis-ausdc:axelar",
      caseType: "cosmos",
      fromAmount: "111111",
      fromChainId: "osmo-test-5",
      fromToken: "ausdc",
      toChainId: "axelar-testnet-lisbon-3",
      toToken: "ausdc",
      toAddress: "axelar1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64d2ak9f",
    },
    // add new cases here
  ],
  ["mainnet"]: [
    // evm-cosmos
    {
      caseId: 101,
      caseName: "ftm:fantom-osmo:osmosis",
      caseType: "evm",
      fromAmount: ethers.utils.parseUnits(".05", "18").toString(),
      fromChainId: 250,
      fromToken: "ftm",
      toChainId: "osmosis-1",
      toToken: "osmo",
      toAddress: "osmo1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64plcwc6",
    },
  ],
};

export function intoBaseRequest(runnerCase: RunnerCase, squid: Squid): object {
  return {
    fromChain: runnerCase.fromChainId,
    fromToken: squid.tokens.find(
      (t) =>
        t.symbol.toLocaleLowerCase() === runnerCase.fromToken &&
        t.chainId === runnerCase.fromChainId
    )!.address,
    fromAmount: runnerCase.fromAmount,
    toChain: runnerCase.toChainId,
    toToken: squid.tokens.find(
      (t) =>
        t.symbol.toLocaleLowerCase() === runnerCase.toToken &&
        t.chainId === runnerCase.toChainId
    )!.address,
    toAddress: runnerCase.toAddress,
    slippage: 3.0,
    enableForecall: false,
    quoteOnly: false,
  };
}
