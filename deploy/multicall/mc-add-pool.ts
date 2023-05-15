import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Wallet, Contract, Provider } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { rich_wallet } from '../utils/rich_wallet';
import { deployContract } from '../utils/deployment';
import { address } from '../utils/address';

// allocation points represent the percentage of the reward that belongs to each pool
// e.g. alloc points: pool1=100; pool2=500; pool3=400;
// to calculate the percentage of the reward that belongs to each pool, sum all allocation points (100+500+400)
// and divide it by the allocation points of a pool you want to calculate the percentage for
// i.e. in this case 1000/100 (pool1 alloc points) = 10%
const ALLOC_POINTS = 500;

export default async function (hre: HardhatRuntimeEnvironment) {
	const provider = new Provider('http://localhost:3050', 270);
	const wallet = new Wallet(rich_wallet[0].privateKey, provider);
	const deployer = new Deployer(hre, wallet);

	// NEW LP TOKEN, must not be the same LP token used in step 05
	const ypToken = await deployContract(deployer, 'LPToken', [
		18,
		'YieldProvider',
		'YP',
	]);

	// MasterChef Contract
	const masterChefArtifact = await deployer.loadArtifact('MasterChef');
	const masterChef = new Contract(
		address.masterchef,
		masterChefArtifact.abi,
		wallet
	);

	// Add new pool on MasterChef
	(await masterChef.add(ALLOC_POINTS, ypToken.address, false)).wait();

	const poolLength = await masterChef.poolLength();

	console.log('=============================================');

	// in this case +poolLength.toString() - 1 is not needed
	console.log('Created pool at index:', poolLength.toString());

	console.log('=============================================');
}
