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
  fromAddress?: string;
  toAddress: string;
  receiveGasOnDestination?: boolean;
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
      toChainId: "dydx-testnet-3",
      toToken: "usdc",
      fromAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
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
      fromAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
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
      fromAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
      toAddress: "noble1al29pjgw8hy7rmtvxlckrse7vkdrlz5z78m8rc",
    },
    {
      caseId: 104,
      caseName: "usdc:avax-osmo:osmosis",
      caseType: "evm",
      fromAmount: ethers.utils.parseUnits(".05", "6").toString(),
      fromChainId: 43113,
      fromToken: "ausdc",
      toChainId: "osmo-test-5",
      toToken: "osmo",
      fromAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
      toAddress: "osmo1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64plcwc6",
    },
    {
      caseId: 105,
      caseName: "avax:avax - usdc:osmosis",
      caseType: "evm",
      fromAmount: ethers.utils.parseUnits(".15", "6").toString(),
      fromChainId: 43113,
      fromToken: "ausdc",
      toChainId: "osmo-test-5",
      toToken: "usdc",
      fromAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
      toAddress: "osmo1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64plcwc6",
      receiveGasOnDestination: true,
    },

    // cosmos-evm
    {
      caseId: 201,
      caseName: "nusdc:osmosis-avax:avax",
      caseType: "cosmos",
      fromAmount: "181111",
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
      fromAmount: "1811111",
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
    {
      caseId: 204,
      caseName: "nusdc:dydx-avax:avax",
      caseType: "cosmos",
      fromAmount: "1311111",
      fromChainId: "dydx-testnet-2",
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
    {
      caseId: 306,
      caseName: "ausdc:axelar-ausdc:axelar",
      caseType: "cosmos",
      fromAmount: "111111",
      fromChainId: "axelar-testnet-lisbon-3",
      fromToken: "ausdc",
      toChainId: "osmo-test-5",
      toToken: "ausdc",
      toAddress: "osmo1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64plcwc6",
    },
    {
      caseId: 307,
      caseName: "nusdc:dydx-nusdc:noble",
      caseType: "cosmos",
      fromAmount: "10536",
      fromChainId: "dydx-testnet-2",
      fromToken: "usdc",
      toChainId: "grand-1",
      toToken: "usdc",
      toAddress: "noble1al29pjgw8hy7rmtvxlckrse7vkdrlz5z78m8rc",
    },
    {
      caseId: 308,
      caseName: "nusdc:noble-ausdc:osmosis",
      caseType: "cosmos",
      fromAmount: "111111",
      fromChainId: "grand-1",
      fromToken: "usdc",
      toChainId: "osmo-test-5",
      toToken: "ausdc",
      toAddress: "osmo1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64plcwc6",
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
    {
      caseId: 102,
      caseName: "avax:avax - xprt:osmosis",
      caseType: "evm",
      fromAmount: ethers.utils.parseUnits(".05", "18").toString(),
      fromChainId: 43114,
      fromToken: "avax",
      toChainId: "osmosis-1",
      toToken: "xprt",
      fromAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
      toAddress: "osmo1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64plcwc6",
      receiveGasOnDestination: true,
    },
    {
      caseId: 103,
      caseName: "axlusdc:avax - axlusdc:sei(bridge only)",
      caseType: "evm",
      fromAmount: "2000000",
      fromChainId: 43114,
      fromToken: "0xfaB550568C688d5D8A52C7d794cb93Edc26eC0eC",
      toChainId: "pacific-1",
      toToken:
        "ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349",
      toAddress: "sei1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64yg6ggf",
    },

    // cosmos-cosmos
    {
      caseId: 300,
      caseName: "uaxl:axelar -> atom:osmosis",
      caseType: "cosmos",
      fromAmount: "10000000",
      fromChainId: "axelar-dojo-1",
      fromToken: "uaxl",
      toChainId: "osmosis-1",
      toToken:
        "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
      toAddress: "osmo1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64plcwc6",
      receiveGasOnDestination: true,
    },
  ],
};

export function intoBaseRequest(runnerCase: RunnerCase, squid: Squid): object {
  return {
    fromChain: runnerCase.fromChainId,
    fromToken: squid.tokens.find(
      (t) =>
        t.symbol.toLocaleLowerCase() ===
          runnerCase.fromToken.toLocaleLowerCase() &&
        t.chainId === runnerCase.fromChainId
    )!.address,
    fromAmount: runnerCase.fromAmount,
    toChain: runnerCase.toChainId,
    toToken: squid.tokens.find(
      (t) =>
        t.symbol.toLocaleLowerCase() ===
          runnerCase.toToken.toLocaleLowerCase() &&
        t.chainId === runnerCase.toChainId
    )!.address,
    fromAddress: runnerCase.fromAddress,
    toAddress: runnerCase.toAddress,
    slippage: 3.0,
    enableForecall: false,
    quoteOnly: false,
    receiveGasOnDestination: runnerCase.receiveGasOnDestination ?? false,
  };
}
