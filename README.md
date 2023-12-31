﻿# Eth SG- Synthwork

## Project Description

- Synthwork is a report generating tool to tackle the following issues:
  - troubles in producing recurring reports
  - inefficiency of decision making
  - traceability of information

## Getting Started

User workflow:

- Create your own Telegram bot.
- Login to Synthwork dapp
- The photos or text messages sent via Telegram Chat will be forwarded to Synthwork dapp
- Synthwork dapp then stores AI Gerenated reports in IPFS using `web3.storage`
- Reports can be minted as NFT upon approval from reviewers (customized "multisig" smart contract)

### Run Locally

- Check `.env.sample`, get necessary API keys and configure `.env` at local.
- Go to [web](./apps/web/) folder and run frontend React locally.

```bash
cd ./apps/web
npm run dev
```

## Reference

Deployed smart contracts:

- Linea
  - https://explorer.goerli.linea.build/address/0xb0ed5C158B7966462088b8312459299517fe9eFB
- Neon EVM
  - https://devnet.neonscan.org/address/0xfD69f04D100841dF40BC31989a216E4731645f92
- Mantle
  - https://explorer.testnet.mantle.xyz/address/0x4B52749b6c3CDF470F905fDed5971aBbdaA32537
