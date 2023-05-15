import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Wallet } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { deployContract } from '../utils/deployment';
import { ACCOUNT_OWNER_PRIVATE_KEY } from '../utils/constants';

const REWARD_TOKEN_PER_BLOCK = ethers.utils.parseEther('100');

export default async function (hre: HardhatRuntimeEnvironment) {
	const wallet = new Wallet(ACCOUNT_OWNER_PRIVATE_KEY);
	const deployer = new Deployer(hre, wallet);

	const lpToken = await deployContract(deployer, 'LPToken', [
		18,
		'LPToken',
		'LP',
	]);

	const rewardToken = await deployContract(deployer, 'RewardToken', [
		18,
		'RewardToken',
		'RWT',
	]);

	const masterChef = await deployContract(deployer, 'MasterChef', [
		rewardToken.address,
		REWARD_TOKEN_PER_BLOCK,
		0,
		0,
	]);

	(await masterChef.add(100, lpToken.address, false)).wait();
	console.log('Pool at index 0 created');

	console.log('=============================================');

	console.log(`Deployment completed!`);
}
