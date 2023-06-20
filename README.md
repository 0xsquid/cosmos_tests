# Running cosmos cases

## Config 

Create `config.yml` file from `config.example.yml` and set your private key for evm tx's and mnemonic for cosmos tx's.

## Available commands list

1. Print available cases: `yarn show:testnet` or `yarn show:mainnet`. Each case has it's unique id and name. ID will be used in order to run one specific case. Output:
```json
Available cases:
[  
  {             
    "caseId": 1,                              
    "caseName": "avax:avax-nusdc:dydx",
    "caseType": "evm",     
    "fromAmount": "50000000000000000",
    "fromChainId": 43113,
    "fromToken": "avax",       
    "toChainId": "dydxprotocol-testnet",
    "toToken": "usdc",                                        
    "toAddress": "dydx1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64qa96wl"
  }
]
```
2. Running one selected case `yarn runner:testnet {case-id}` or `yarn runner:mainnet {case-id}`. <br>
Example: `yarn runner:testnet 1`.

3. Running all cases one after another `yarn runner:all:testnet` or `yarn runner:all:mainnet`

## New scenarious
New cases or modifications for an existing one can be added into this [`file`](tests/cases.ts).
