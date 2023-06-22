import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { utils, Wallet, Contract, types, Provider } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { address } from '../utils/address';
import {
	BATCH_SELECTOR,
	addSignature,
	constructBatchedCalldata,
	getApprovalBasedPaymasterData,
	getEIP712TxRequest,
} from '../utils/multicall';
import { ACCOUNT_OWNER_PRIVATE_KEY } from '../utils/constants';

const MINT_AMOUNT = ethers.utils.parseEther('100');
const STAKE_AMOUNT = ethers.utils.parseEther('80');

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
		provider
	);

	// reward Contract
	const rewardTokenArtifact = await deployer.loadArtifact('RewardToken');
	const rewardToken = new Contract(
		address.rewardtoken,
		rewardTokenArtifact.abi,
		wallet
	);

	// lpToken Contract
	const lpTokenArtifact = await deployer.loadArtifact('LPToken');
	const lpToken = new Contract(address.lptoken, lpTokenArtifact.abi, wallet);

	// Smart Account LP token balance
	const lpTokenBalance = await lpToken.balanceOf(address.account);
	const lpTokenMasterChefAllowance = await lpToken.allowance(
		address.account,
		address.masterchef
	);

	console.log(
		'Account LP Token Balance before Batch Tx:',
		ethers.utils.formatEther(lpTokenBalance)
	);
	console.log(
		'Master Chef allowance to spend LP Token before Batch Tx:',
		ethers.utils.formatEther(lpTokenMasterChefAllowance)
	);

	console.log('=============================================');

	// Mint LP Tokens
	await (await lpToken.mint(address.account, MINT_AMOUNT)).wait();

	// Smart Account balance of LP tokens after minting
	const lpTokenBalanceAfterMinting = await lpToken.balanceOf(address.account);

	console.log(
		'Account LP Token Balance after minting:',
		ethers.utils.formatEther(lpTokenBalanceAfterMinting)
	);
	console.log('=============================================');

	// Approve Smart Account's LP tokens  for MasterChef to spend
	const approveLpTokenTx = await lpToken.populateTransaction.approve(
		masterChef.address,
		MINT_AMOUNT
	);

	// Deposit LP tokens to MasterChef
	const depositToMC = await masterChef.populateTransaction.deposit(
		0,
		STAKE_AMOUNT
	);

	// OPTIONAL: minting LP tokens can be the first transaction
	let transactionList: any[] = [approveLpTokenTx, depositToMC];

	// concatenate multiple txs
	const multiTxCalldata = await constructBatchedCalldata([...transactionList]);

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

	const lpTokenBalanceAfter = await lpToken.balanceOf(address.account);

	const lpTokenMasterChefAllowanceAfter = await lpToken.allowance(
		address.account,
		address.masterchef
	);
	const lpTokenMasterChefBalance = await lpToken.balanceOf(address.masterchef);

	console.log(
		'Account LP Token Balance before Batch Tx:',
		ethers.utils.formatEther(lpTokenBalanceAfter)
	);
	console.log(
		'Master Chef allowance to spend LP Token before Batch Tx:',
		ethers.utils.formatEther(lpTokenMasterChefAllowanceAfter)
	);
	console.log(
		'Master Chef balance of LP Tokens before Batch Tx:',
		ethers.utils.formatEther(lpTokenMasterChefBalance)
	);
	const rewardTokenBalance = await rewardToken.balanceOf(address.account);
	console.log(
		'Smart Account reward token balance:',
		ethers.utils.formatEther(rewardTokenBalance)
	);

	console.log(`Deployment completed!`);
}
