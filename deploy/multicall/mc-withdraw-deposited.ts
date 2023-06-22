import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Wallet, Contract, Provider, types, utils } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { address } from '../utils/address';
import {
	BATCH_SELECTOR,
	addSignature,
	constructBatchedCalldata,
	getApprovalBasedPaymasterData,
	getEIP712TxRequest,
} from '../utils/multicall';
import { ethers } from 'ethers';
import { ACCOUNT_OWNER_PRIVATE_KEY } from '../utils/constants';

const POOL_ID = 0;

export default async function (hre: HardhatRuntimeEnvironment) {
	const provider = new Provider('http://localhost:3050', 270);
	const wallet = new Wallet(ACCOUNT_OWNER_PRIVATE_KEY, provider);
	const deployer = new Deployer(hre, wallet);

	// Smart Account
	const account = await deployer.loadArtifact('Account');
	const accountContract = new Contract(address.account, account.abi, wallet);

	// MasterChef Contract
	const masterChefArtifact = await deployer.loadArtifact('MasterChef');
	const masterChef = new Contract(
		address.masterchef,
		masterChefArtifact.abi,
		wallet
	);

	// RewardToken Contract
	const rewardTokenArtifact = await deployer.loadArtifact('RewardToken');
	const rewardToken = new Contract(
		address.rewardtoken,
		rewardTokenArtifact.abi,
		wallet
	);

	// LPToken Contract
	const lpTokenArtifact = await deployer.loadArtifact('LPToken');
	const lpToken = new Contract(address.lptoken, lpTokenArtifact.abi, wallet);

	// Smart Account LP token balance
	const lpTokenBalance = await lpToken.balanceOf(address.account);

	console.log(
		'Account LP Token Balance before Txs:',
		ethers.utils.formatEther(lpTokenBalance)
	);

	const rewardTokenBalance = await rewardToken.balanceOf(address.account);
	console.log(
		'Smart Account reward token balance before TXs:',
		ethers.utils.formatEther(rewardTokenBalance)
	);

	// User Info
	const userInfo = await masterChef.userInfo(0, address.account);
	const [amount] = userInfo;

	// Withdraws all deposited LP tokens
	// stores all tokens: userInfo.amount

	console.log(
		"Smart Account's LP token balance on MasterChef before TXs:",
		ethers.utils.formatEther(amount)
	);

	// Withdraw TX
	const withdrawTx = await masterChef.populateTransaction.withdraw(
		POOL_ID,
		amount
	);

	// concatenate multiple txs
	const multiTxCalldata = await constructBatchedCalldata([withdrawTx]);

	console.log('TXs batched');

	// paymaster data
	const paymasterData: types.Eip712Meta = await getApprovalBasedPaymasterData(
		provider,
		address.usdc,
		accountContract,
		'multicall',
		multiTxCalldata.replace(BATCH_SELECTOR, '0x'),
		address.paymaster
	);

	console.log('Paymaster data obtained');

	const tx = await getEIP712TxRequest(
		provider,
		address.account,
		address.account,
		undefined,
		multiTxCalldata,
		paymasterData
	);

	await addSignature(tx, wallet);

	const status = await provider.sendTransaction(utils.serialize(tx));
	const txWait = await status.wait();
	console.log('Status', txWait.status);

	console.log('=============================================');

	// balance of reward tokens
	const rewardTokenBalanceAfterTx = await rewardToken.balanceOf(
		address.account
	);

	// Smart Account LP token balance
	const lpTokenBalanceAfterTx = await lpToken.balanceOf(address.account);

	// User info
	const userInfoAfterTx = await masterChef.userInfo(0, address.account);
	const [amountAfterTx] = userInfoAfterTx;

	console.log(
		'Account LP Token Balance after  Txs:',
		ethers.utils.formatEther(lpTokenBalanceAfterTx)
	);
	console.log(
		'Smart Account reward token balance after TXs:',
		ethers.utils.formatEther(rewardTokenBalanceAfterTx)
	);

	console.log(
		"Smart Account's LP token balance on MasterChef before TXs:",
		ethers.utils.formatEther(amountAfterTx)
	);
}
