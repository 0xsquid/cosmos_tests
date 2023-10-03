import { ChainData, GetRoute, ChainType, CosmosChain } from "@0xsquid/sdk";
import { SigningStargateClient } from "@cosmjs/stargate";
import {
  DirectSecp256k1HdWallet,
  OfflineDirectSigner,
} from "@cosmjs/proto-signing";
import { ethers } from "ethers";

export const sleep = (seconds: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

export const getBalance = async (
  params: GetRoute,
  chain: ChainData,
  pk_mnemonic: string
) => {
  if (chain.chainType === ChainType.Cosmos) {
    const getSignerFromMnemonic = async (): Promise<OfflineDirectSigner> => {
      return DirectSecp256k1HdWallet.fromMnemonic(pk_mnemonic, {
        prefix: (chain as CosmosChain).bech32Config.bech32PrefixAccAddr,
      });
    };
    const offlineSigner: OfflineDirectSigner = await getSignerFromMnemonic();
    const signer = await SigningStargateClient.connectWithSigner(
      chain.rpc,
      offlineSigner
    );
    const signerAddress = (await offlineSigner.getAccounts())[0].address;
    const allBalances = await signer.getAllBalances(signerAddress);
    const amount = allBalances.find(
      (item) => item.denom === params.toToken
    ).amount;
    return amount;
  } else if (chain.chainType === ChainType.EVM) {
    const provider = ethers.getDefaultProvider(chain.rpc);
    const signer = new ethers.Wallet(pk_mnemonic, provider);
    if (params.toToken === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
      const balance = await provider.getBalance(signer.address);
      return balance.toString();
    } else {
      const tokenAddress = params.toToken; // Replace with your token contract address
      const abi = ["function balanceOf(address owner) view returns (uint256)"];
      const contract = new ethers.Contract(tokenAddress, abi, provider);
      const balance = await contract.balanceOf(signer.address);
      return balance.toString();
    }
  }
};
