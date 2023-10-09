import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-upgradable";

import * as dotenv from "dotenv";
dotenv.config();

const zkSyncNetwork = {
  url: process.env.ZK_PROVIDER_URL,
  ethNetwork: process.env.ETH_NETWORK_URL,
  zksync: true,
};

const compilers = [
  { version: "0.8.1" },
  { version: "0.8.4" },
  { version: "0.8.11" },
  { version: "0.8.18" },
  { version: "0.8.19" },
];

module.exports = {
  zksolc: {
    version: "1.3.13",
    compilerSource: "binary",
    settings: {
      isSystem: true,
    },
  },
  defaultNetwork: "zkSyncNetwork",
  networks: { zkSyncNetwork },
  solidity: { compilers },
};
