import { Provider, utils, Wallet, Contract, types } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { rich_wallet } from '../utils/rich_wallet';
import { address } from '../utils/address';
import { ethers } from 'ethers';
import {
	addSignature,
	constructBatchedCalldata,
	getEIP712TxRequest,
} from '../utils/multicall';

const AMOUNT = ethers.utils.parseEther('10');
const ALLOWANCE_AMOUNT = ethers.utils.parseEther('100');

export default async function (hre: HardhatRuntimeEnvironment) {
	const provider = new Provider('http://localhost:3050', 270);
	const wallet = new Wallet(rich_wallet[0].privateKey, provider);
	const deployer = new Deployer(hre, wallet);

	// ERC20 Token
	const erc20 = await deployer.loadArtifact('MyERC20');
	const erc20Contract = new Contract(address.myerc20, erc20.abi, wallet);

	// Spender Contract
	const spenderArtifact = await deployer.loadArtifact('Spender');
	const spender = new Contract(address.spender, spenderArtifact.abi, wallet);

	// TODO: CHECK IF SPENDER IS APPROVED TO SPEND REQUIRED AMOUNT OF ERC20

	const erc20AccountBalance = await erc20Contract.balanceOf(address.account);
	console.log(
		'Account token balance before batch transaction: ',
		ethers.utils.formatEther(erc20AccountBalance)
	);

	const erc20SpenderBalance = await erc20Contract.balanceOf(address.spender);
	console.log(
		'Spender token balance before batch transaction: ',
		ethers.utils.formatEther(erc20SpenderBalance)
	);

	const erc20SpenderAllowance = await erc20Contract.allowance(
		address.account,
		address.spender
	);
	console.log(
		'Spender allowance before transfer: ',
		ethers.utils.formatEther(erc20SpenderAllowance)
	);

	console.log('=============================================');

	// 1. TX - Approve for (the) Spender to spend certain amount of tokens on the behalf of account
	const approveErc20Tx = await erc20Contract.populateTransaction.approve(
		address.spender,
		ALLOWANCE_AMOUNT
	);

	console.log(
		'Create Approve Tx for (the) Spender to spend certain amount of tokens on the behalf of account'
	);

	// 2. TX - Deposit (transferFrom) ERC20 Token from account to the Spender address
	const depositTx = await spender.populateTransaction.deposit(
		address.myerc20,
		AMOUNT
	);

	console.log(
		'Create Deposit Tx (transferFrom) ERC20 Token from account to the Spender address'
	);

	// concatenate multiple txs
	const multiTx = await constructBatchedCalldata([approveErc20Tx, depositTx]);

	console.log('TXs batched');

	// paymaster data
	const paymasterData: types.Eip712Meta = {
		gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
		paymasterParams: utils.getPaymasterParams(address.paymaster, {
			type: 'General',
			innerInput: new Uint8Array(),
		}),
	};

	console.log('General Flow Paymaster data obtained');

	let tx: types.TransactionRequest = await getEIP712TxRequest(
		wallet.provider,
		address.account,
		address.account,
		multiTx,
		paymasterData
	);

	tx = await addSignature(tx, wallet);

	const status = await wallet.provider.sendTransaction(utils.serialize(tx));
	const txWait = await status.wait();

	console.log('Status', txWait.status);
	console.log('=============================================');

	const erc20AccountBalanceAfter = await erc20Contract.balanceOf(
		address.account
	);
	console.log(
		'Account token balance after batch transaction',
		ethers.utils.formatEther(erc20AccountBalanceAfter)
	);

	const erc20SpenderBalanceAfterTx = await erc20Contract.balanceOf(
		address.spender
	);
	console.log(
		'Spender token balance after batch transaction',
		ethers.utils.formatEther(erc20SpenderBalanceAfterTx)
	);
	const erc20SpenderAllowanceAfterTx = await erc20Contract.allowance(
		address.account,
		address.spender
	);
	console.log(
		'Spender allowance after transactions: ',
		ethers.utils.formatEther(erc20SpenderAllowanceAfterTx)
	);
}
