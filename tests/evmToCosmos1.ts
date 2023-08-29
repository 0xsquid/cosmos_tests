import { Squid } from "@0xsquid/sdk";
import { ethers } from "ethers";
import { sleep } from "../utils";
import { loadAsync } from "node-yaml-config";

const fromAmount = ethers.utils.parseUnits(".05", "18").toString()
const fromChainId = 43113; //avalanche fuji testnet
const fromToken = "avax";
const toChainId = "dydxprotocol-testnet";
const toToken = "usdc";
const toAddress = "dydx1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64qa96wl";

(async () => {
    const config = await loadAsync("./config.yml", process.argv.slice(2)[0]); //TODO pass env in as an argument
    console.log(config)
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
    const provider = ethers.getDefaultProvider(
        squid.chains.find((c) => c.chainId === fromChainId)!.rpc
    );
    const signer = new ethers.Wallet(config.pk, provider);

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
        fromAddress: config.fallBackAddress,
    };

    console.log("route params", params);
    const { route } = await squid.getRoute(params);
    console.log(route.estimate.route);
    const tx = (await squid.executeRoute({
        signer,
        route,
    })) as ethers.providers.TransactionResponse;
    const txReceipt = await tx.wait();
    const txHash = txReceipt.transactionHash;
    //const txHash =
    //    "0x7bc868b00d832b07a0f0c1f39c7b48f0b9d76c97bc2ee27488c502259cafc260";

    await sleep(5); //wait for axelar to index
    let statusResult = false;
    while (!statusResult) {
        console.log(`getting tx status for: ${txHash}`);
        try {
            const status = (await squid.getStatus({
                transactionId: txHash,
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
