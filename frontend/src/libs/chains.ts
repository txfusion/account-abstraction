import { zkSyncTestnet, zkSync } from '@wagmi/chains'

const zkSyncLocal = {
  id: 270,
  name: 'zkSync Local',
  network: 'zksync-era-localnet',
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ["http://localhost:8450"]
    },
    public: {
      http: ["http://localhost:8450"]
    }
  },
  blockExplorers: {
    default: {
      name: "zkExplorer",
      url: 'https://zksync2-testnet.zkscan.io'
    }
  },
  testnet: true,
};

function defaultChains() {
  return [zkSyncTestnet, zkSyncLocal, zkSync];
}

export default defaultChains();