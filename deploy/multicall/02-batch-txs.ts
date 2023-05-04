import { Provider, utils, Wallet, Contract, types } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { rich_wallet } from '../utils/rich_wallet';
import { address } from '../utils/address';
import { ethers } from 'ethers';
import {
	addSignature,
	constructBatchedCalldata,
	getCustomData,
	getEIP712TxRequest,
	getTxWithApproval,
} from '../utils/multicall';

const AMOUNT = ethers.utils.parseEther('100');

export default async function (hre: HardhatRuntimeEnvironment) {
	const provider = new Provider('http://localhost:3050', 270);
	const wallet = new Wallet(rich_wallet[0].privateKey, provider);
	const deployer = new Deployer(hre, wallet);

	// ERC20 Token
	const erc20 = await deployer.loadArtifact('MyERC20');
	const erc20Contract = new Contract(address.erc20, erc20.abi, wallet);

	// Spender Contract
	const spenderArtifact = await deployer.loadArtifact('Spender');
	const spender = <Contract>(
		new Contract(address.spender, spenderArtifact.abi, wallet)
	);

	// TODO: CHECK IF SPENDER IS APPROVED TO SPEND ERC20

	const erc20SpenderAllowance = await erc20Contract.allowance(
		address.account,
		address.spender
	);

	console.log('erc20SpenderAllowance', erc20SpenderAllowance.toString());

	// 1. TX - Approve for (the) Spender to spend certain amount of tokens on the behalf of account
	const approveErc20Tx = await erc20Contract.populateTransaction.approve(
		address.spender,
		AMOUNT
	);

	console.log(
		'Create 1. TX - Approve for (the) Spender to spend certain amount of tokens on the behalf of account'
	);

	// 2. TX - Deposit (transferFrom) ERC20 Token from account to the Spender address
	const depositTx = await spender.populateTransaction.deposit(
		address.erc20,
		AMOUNT
	);

	console.log(
		'Create 2. TX - Deposit (transferFrom) ERC20 Token from account to the Spender address'
	);

	// concatenate multiple txs
	const multiTx = await constructBatchedCalldata([approveErc20Tx, depositTx]);

	console.log('TXs batched');

	// calldata
	// const callData = await getTxWithApproval(
	// 	depositTx,
	// 	address.erc20,
	// 	erc20.abi,
	// 	AMOUNT,
	// 	wallet
	// );
	// console.log('GET CALLDATA ');

	// paymaster data
	const paymasterD: types.Eip712Meta = {
		gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
		paymasterParams: utils.getPaymasterParams(address.paymaster, {
			type: 'General',
			innerInput: new Uint8Array(),
		}),
	};

	console.log('Paymaster data obtained');

	// const customData = await getCustomData(provider, address.erc20);
	// console.log('GET CUSTOM DATA');

	//
	let tx: types.TransactionRequest = await getEIP712TxRequest(
		provider,
		address.account,
		address.account,
		multiTx,
		paymasterD
	);

	// console.log('CUSTOM TX');

	tx = await addSignature(tx, wallet);

	// const status = await provider.sendTransaction(utils.serialize(tx));

	// const txWait = await status.wait();

	// console.log('Status', txWait);
}
