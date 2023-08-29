import { CosmosChain, Squid } from "@0xsquid/sdk";
import { SigningStargateClient, DeliverTxResponse } from "@cosmjs/stargate";
import {
    DirectSecp256k1HdWallet,
    OfflineDirectSigner,
} from "@cosmjs/proto-signing";
import { sleep } from "../utils";
import { loadAsync } from "node-yaml-config";

const fromAmount = "555555"
const fromChainId = "grand-1"; //avalanche fuji testnet
const fromToken = "usdc";
const toChainId = "osmo-test-5";
const toToken = "usdc";
const toAddress = "osmo1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64plcwc6";

(async () => {
    const config = await loadAsync("./config.yml", process.argv.slice(2)[0]); //TODO pass env in as an argument
    //console.log(config)
    if (typeof config === undefined) {
        console.log("configure the config.yml file in the root of the repo");
    }

    // instantiate the SDK
    //const baseUrl =
    //  "https://squid-api-git-feat-cosmos-maintestnet-0xsquid.vercel.app";
    const squid = new Squid({
        baseUrl: config.api_url,
    });
    // init the SDK
    await squid.init();
    console.log("Squid inited");

    const chain = squid.chains.find(
        (c) => c.chainId.toString().toLocaleLowerCase() === fromChainId
    ) as CosmosChain;

    const getSignerFromMnemonic = async (): Promise<OfflineDirectSigner> => {
        return DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
            prefix: chain.bech32Config.bech32PrefixAccAddr,
        });
    };
    const signer: OfflineDirectSigner = await getSignerFromMnemonic();
    const signingClient = await SigningStargateClient.connectWithSigner(
        chain.rpc,
        signer
    );

    const signerAddress = (await signer.getAccounts())[0].address;
    console.log(signerAddress);
    console.log("balances: ", await signingClient.getAllBalances(signerAddress));

    const params = {
        fromChain: fromChainId,
        fromToken: squid.tokens.find(
            (t) => t.symbol.toLocaleLowerCase() === fromToken && t.chainId === fromChainId
        )!.address,
        fromAmount: fromAmount,
        toChain: toChainId,
        toToken: squid.tokens.find(
            (t) => t.symbol.toLocaleLowerCase() === toToken && t.chainId === toChainId
        )!.address,
        toAddress: toAddress,
        slippage: 3.0,
        enableForecall: false,
        quoteOnly: false,
        fromAddress: signerAddress,
    };

    console.log("route params", params);
    const { route } = await squid.getRoute(params);
    console.log(route.estimate.route);
    const tx = (await squid.executeRoute({
        signer: signingClient,
        signerAddress,
        route,
    })) as DeliverTxResponse;
    const txHash = tx.transactionHash;
    //const txHash =
    //    "F3B0102ADC9A1B8423383ED1258D23215DCA3DD6D3A3C7B7887EA9A0FDB9DDAD";

    await sleep(5); //wait for axelar to index
    let statusResult = false;
    while (!statusResult) {
        console.log(`getting tx status for: ${txHash}`);
        try {
            const status = (await squid.getStatus({
                transactionId: txHash,
                fromChainId: fromChainId,
            })) as any;
            console.log(status);
            if (!!status.routeStatus) {
                if (
                    !!status.routeStatus.find(
                        (s) => s.chainId === toChainId && s.status === "success"
                    )
                ) {
                    statusResult = true;
                    console.log("########### tx success ############");
                    break;
                }
            }
        } catch (error) {
            console.log("not found yet..");
            await sleep(3);
            //console.log(error);
        }
    }
    //console.log(`https://testnet.axelarscan.io/gmp/${txReceipt.transactionHash}`);
})();
