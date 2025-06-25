# Vana DLP UI Template

This is a generic UI for uploading data to a Data Liquidity Pool (DLP). This app enables users to contribute data to the Vana network while maintaining privacy through client-side encryption.

## How It Works

1. Connect your EVM compatible wallet, which holds some $VANA tokens
2. Upload your data file, which is encrypted client-side before being stored on IPFS via Pinata
3. A transaction is written on-chain, which DLP validators will pick up to verify your file
4. The Satya Network (using Trusted Execution Environment) validates your contribution

### What happens during upload?

- When you upload a file, the app automatically generates an `account.json` file containing your connected wallet address in the following format:

  ```json
  {
    "user": "<CONNECTED_WALLET>"
  }
  ```
- Both your data file and this `account.json` are zipped together, encrypted client-side, and then uploaded to IPFS via Pinata.

## Features

- Secure wallet connection with Wagmi 
- Client-side encryption using OpenPGP before any data leaves your browser
- Integration with Pinata for decentralized IPFS storage 
- On-chain transaction writing using Vana smart contracts
- TEE-based data validation through the Satya Network
- Responsive UI built with modern components

## Prerequisites

- Node.js (version 16 or newer)
- Yarn package manager
- An EVM-compatible wallet with $VANA tokens

## Getting Started

```bash
# First, install the dependencies
yarn install

# Run the development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running.

## Client-side encryption

The Vana network strives to ensure personal data remains private, and is only shared with trusted parties. You can read more about how a DLP uses client-side encryption to protect user data [here](https://docs.vana.org/docs/data-privacy).

## Data Validation

Data submitted to the Vana network is validated using a Proof of Contribution system through the Satya Network, which consists of highly confidential nodes running on special hardware. The validation process ensures:

1. Your encrypted data is securely decrypted within a trusted execution environment (Intel TDX)
2. Custom validation logic for your DLP runs against the data
3. Attestations are generated and proofs are written on-chain

For more details about how data validation works on Vana, see the [data validation documentation](https://docs.vana.org/docs/data-validation).

## Learn more

You can find out more about building a data liquidity pool with Vana [here](https://docs.vana.org/docs/how-to-create-a-data-liquidity-pool).

## License

[MIT](LICENSE)
