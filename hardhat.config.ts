import '@matterlabs/hardhat-zksync-deploy';
import '@matterlabs/hardhat-zksync-solc';

// local testnet
const zkSyncLocalTestnet = {
	url: 'http://localhost:3050',
	ethNetwork: 'http://localhost:8545',
	zksync: true,
};

// testnet
const zkSyncTestnet = {
	url: 'https://zksync2-testnet.zksync.dev',
	ethNetwork: 'process.env.alchemy_api_goerli',
	zksync: true,
};

const compilers = [
	{ version: '0.8.1' },
	{ version: '0.8.4' },
	{ version: '0.8.11' },
];

module.exports = {
	zksolc: {
		version: '1.3.9',
		compilerSource: 'binary',
		settings: {
			isSystem: true,
		},
	},
	defaultNetwork: 'zkSyncTestnet',

	networks: {
		zkSyncTestnet: zkSyncLocalTestnet,
	},
	solidity: {
		compilers: compilers,
	},
};