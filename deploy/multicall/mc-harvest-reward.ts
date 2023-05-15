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

// to harvest tokens (i.e. without withdrawing staked tokens, withdraw amount should be 0)
const POOL_ID = 0;
const AMOUNT = 0;

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

	// reward Contract
	const rewardTokenArtifact = await deployer.loadArtifact('RewardToken');
	const rewardToken = new Contract(
		address.rewardtoken,
		rewardTokenArtifact.abi,
		wallet
	);

	const rewardTokenBalance = await rewardToken.balanceOf(address.account);
	console.log(
		'Smart Account reward token balance before TXs:',
		ethers.utils.formatEther(rewardTokenBalance)
	);

	// Harvest TX
	const harvestTx = await masterChef.populateTransaction.withdraw(
		POOL_ID,
		AMOUNT
	);

	// concatenate multiple txs
	const multiTxCalldata = await constructBatchedCalldata([harvestTx]);

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

	const rewardTokenBalanceAfterTx = await rewardToken.balanceOf(
		address.account
	);
	console.log(
		'Smart Account reward token balance after TXs:',
		ethers.utils.formatEther(rewardTokenBalanceAfterTx)
	);
}
