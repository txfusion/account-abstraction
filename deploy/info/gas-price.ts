import * as ethers from 'ethers';
import { Provider } from 'zksync-web3';

const MAINNET_RPC = 'https://mainnet.era.zksync.io';
const TESTNET_RPC = 'https://mainnet.era.zksync.io';
const LOCAL_RPC = 'https://mainnet.era.zksync.io';

export default async function () {
	const provider = new Provider(MAINNET_RPC, 324);
	const gasFeed = await provider.getFeeData();

	for (let [key, value] of Object.entries(gasFeed)) {
		console.log(`${key}: ${ethers.utils.formatUnits(value, 'gwei')}`);
	}
}

// local  0.00000000025
// testnet 0.000000000290168715
// mainnet 0.00000000025
