# Water Token Smart Contract Engine (Module 1)

The core rulebook for the project: minting seasonal water allocations, deducting
tokens as water is used, and letting farmers trade tokens peer-to-peer.

## Contracts

- **`contracts/WaterToken.sol`** — ERC-20 token where 1 token = 1 unit of water
  (define your real-world unit, e.g. 1000 liters). Uses OpenZeppelin's
  `AccessControl` so minting and deduction are separate, revocable permissions:
  - `MINTER_ROLE` → `allocateSeasonTokens()` / `batchAllocate()`
  - `DEDUCTOR_ROLE` → `deductUsage()`
  - Plain `transfer()` / `transferFrom()` (inherited from ERC-20) already gives
    you basic peer-to-peer trading.
- **`contracts/WaterMarketplace.sol`** (optional) — an escrow-based marketplace
  so a farmer can list surplus tokens for sale at a price in ETH, instead of a
  bare wallet-to-wallet transfer.

## 1. Install

```bash
npm install
```

## 2. Compile

```bash
npx hardhat compile
```

## 3. Run the test suite locally

```bash
npx hardhat test
```

This spins up Hardhat's built-in local network automatically — no setup needed.
The tests cover: minting, batch minting, deduction (including the insufficient-balance
revert), role-based access control reverts, peer-to-peer transfer, and the full
marketplace flow (list → buy → refund overpayment → cancel).

## 4. Deploy to Sepolia testnet

1. Copy `.env.example` to `.env` and fill in:
   - `SEPOLIA_RPC_URL` — free from [Alchemy](https://alchemy.com) or [Infura](https://infura.io)
   - `PRIVATE_KEY` — a **test wallet's** private key (never your main wallet)
   - Get free Sepolia ETH from a faucet, e.g. https://sepoliafaucet.com
2. Deploy:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. The script prints both contract addresses — save these for whoever is
   building the frontend/wallet integration (Module 2+).

## Design notes for your writeup

- **Roles instead of a single owner.** In a real deployment, `DEDUCTOR_ROLE`
  could be handed to a separate wallet controlled by an automated water meter
  or oracle, so the irrigation authority doesn't need to sign every single
  usage transaction, but still fully controls who is allowed to allocate new
  tokens.
- **0 decimals.** Water allocations are whole numbers of a defined unit, so
  fractional token amounts aren't needed — this keeps balances easy for
  farmers to read.
- **Escrow marketplace vs. bare transfer.** A plain `transfer()` works for
  trading but has no price discovery — it's really a gift, not a sale. The
  marketplace contract adds listings, pricing, and payment so a genuine
  buy/sell market can exist on top of the token.
- **Events everywhere.** `WaterAllocated`, `WaterUsed`, `Listed`, `Purchased`,
  `Cancelled` — these make it easy to build a transparent dashboard showing
  every farmer's allocation and usage history straight from the blockchain.
