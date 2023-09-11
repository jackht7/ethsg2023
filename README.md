# Eth SG- Synthwork

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
- Go to [web](./apps/web/) folder and run frontend React loaclly.

```bash
cd ./apps/web
npm run dev
```
