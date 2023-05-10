import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Wallet, Contract, Provider } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { rich_wallet } from '../utils/rich_wallet';
import { address } from '../utils/address';

export default async function (hre: HardhatRuntimeEnvironment) {
	const provider = new Provider('http://localhost:3050', 270);
	const wallet = new Wallet(rich_wallet[0].privateKey, provider);
	const deployer = new Deployer(hre, wallet);

	// MasterChef Contract
	const masterChefArtifact = await deployer.loadArtifact('MasterChef');
	const masterChef = new Contract(
		address.masterchef,
		masterChefArtifact.abi,
		provider
	);

	// reward Contract
	const rewardTokenArtifact = await deployer.loadArtifact('RewardToken');
	const rewardToken = new Contract(
		address.rewardtoken,
		rewardTokenArtifact.abi,
		wallet
	);
	const rewardTokenBalance = await rewardToken.balanceOf(address.account);
	console.log(
		'ACC reward token balance:',
		ethers.utils.formatEther(rewardTokenBalance)
	);

	const userInfo = await masterChef.userInfo(0, address.account);
	const poolInfo = await masterChef.poolInfo(0);
	const pendingReward = await masterChef.pendingRewardToken(0, address.account);

	const [lpToken, allocPoint, lastRewardBlock, accRewardTokenPerShare] =
		poolInfo;

	const [amount, rewardDebt] = userInfo;

	console.log('=============================================');
	console.log('Pool info:');
	console.log('lpToken:', lpToken);
	console.log('allocPoint:', allocPoint.toString());
	console.log('lastRewardBlock:', lastRewardBlock.toString());
	console.log('accRewardTokenPerShare:', accRewardTokenPerShare.toString());
	console.log('=============================================');
	console.log('User Info:');
	console.log('amount:', amount.toString());
	console.log('rewardDebt:', rewardDebt.toString());
	console.log('=============================================');
	console.log('Pending reward', ethers.utils.formatEther(pendingReward));
	console.log('=============================================');
}
