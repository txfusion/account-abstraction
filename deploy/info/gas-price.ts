import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Provider } from 'zksync-web3';

export default async function (hre: HardhatRuntimeEnvironment) {
	const provider = new Provider('http://localhost:3050', 270);
	const gasPrice = await provider.getGasPrice();

	console.log('Gas price:', ethers.utils.formatEther(gasPrice));
}

// local  0.00000000025
// testnet 0.000000000290168715
// mainnet 0.00000000025
