import { Provider, utils, Wallet, Contract, types } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { address } from '../utils/address';
import { ethers } from 'ethers';
import {
	BATCH_SELECTOR,
	addSignature,
	constructBatchedCalldata,
	getApprovalBasedPaymasterData,
	getEIP712TxRequest,
} from '../utils/multicall';
import { ACCOUNT_OWNER_PRIVATE_KEY } from '../utils/constants';

const AMOUNT = ethers.utils.parseEther('0.1');

export default async function (hre: HardhatRuntimeEnvironment) {
	const provider = new Provider('http://localhost:3050', 270);
	const wallet = new Wallet(ACCOUNT_OWNER_PRIVATE_KEY, provider);
	const deployer = new Deployer(hre, wallet);

	// ERC20 Token
	const erc20 = await deployer.loadArtifact('MyERC20');
	const erc20Contract = new Contract(address.myerc20, erc20.abi, wallet);

	// USDC Token
	const usdc = await deployer.loadArtifact('MyERC20');
	const usdcContract = new Contract(address.usdc, usdc.abi, wallet);

	// Smart Account
	const account = await deployer.loadArtifact('Account');
	const accountContract = new Contract(address.account, account.abi, wallet);

	// Account token balance
	const erc20AccountBalance = await erc20Contract.balanceOf(address.account);
	console.log(
		'Account token balance before batch transaction',
		ethers.utils.formatEther(erc20AccountBalance)
	);
	// Usdc token balance
	const usdcAccountBalance = await usdcContract.balanceOf(address.account);
	console.log(
		'USDC token balance before batch transaction',
		ethers.utils.formatEther(usdcAccountBalance)
	);

	const paymasterBalance = await provider.getBalance(address.paymaster);
	console.log(
		'Paymaster balance before batch transaction',
		ethers.utils.formatEther(paymasterBalance)
	);
	console.log('=============================================');

	let transactionList: any[] = [];
	for (let i = 0; i < 101; i++) {
		transactionList[i] = await erc20Contract.populateTransaction.transfer(
			address.spender,
			AMOUNT
		);
	}

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

	// Account token balance
	const erc20AccountBalanceAfter = await erc20Contract.balanceOf(
		address.account
	);
	console.log(
		'Account token balance after batch transaction',
		ethers.utils.formatEther(erc20AccountBalanceAfter)
	);

	// Usdc token balance
	const usdcAccountBalanceAfterTx = await usdcContract.balanceOf(
		address.account
	);
	console.log(
		'USDC token balance after batch transaction',
		ethers.utils.formatEther(usdcAccountBalanceAfterTx)
	);
	const paymasterBalanceAfter = await provider.getBalance(address.paymaster);
	console.log(
		'Paymaster balance after batch transaction',
		ethers.utils.formatEther(paymasterBalanceAfter)
	);
}
