import { Provider, utils, Wallet, Contract, types } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { rich_wallet } from '../utils/rich_wallet';
import { address } from '../utils/address';
import { ethers } from 'ethers';
import { addSignature, getEIP712TxRequest } from '../utils/multicall';

const AMOUNT = ethers.utils.parseEther('10');

export default async function (hre: HardhatRuntimeEnvironment) {
	const provider = new Provider('http://localhost:3050', 270);
	const wallet = new Wallet(rich_wallet[0].privateKey, provider);
	const deployer = new Deployer(hre, wallet);

	// ERC20 Token
	const erc20 = await deployer.loadArtifact('MyERC20');
	const erc20Contract = new Contract(address.myerc20, erc20.abi, wallet);

	// TODO: CHECK IF SPENDER IS APPROVED TO SPEND ERC20

	const erc20SpenderAllowance = await erc20Contract.allowance(
		address.account,
		address.spender
	);

	console.log('erc20SpenderAllowance', erc20SpenderAllowance);

	const accountBalance = await erc20Contract.balanceOf(address.account);
	console.log('account balance', ethers.utils.formatEther(accountBalance));

	const paymasterD: types.Eip712Meta = {
		gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
		paymasterParams: utils.getPaymasterParams(address.paymaster, {
			type: 'General',
			innerInput: new Uint8Array(),
		}),
	};

	const transferTX = await erc20Contract.populateTransaction.transfer(
		address.spender,
		AMOUNT
	);

	console.log(
		'Create 1. TX - Approve for (the) Spender to spend certain amount of tokens on the behalf of account'
	);

	let tx: types.TransactionRequest = await getEIP712TxRequest(
		provider,
		address.account,
		address.account,
		transferTX.data,
		paymasterD
	);

	tx = await addSignature(tx, wallet);

	const response = await (
		await provider.sendTransaction(utils.serialize(tx))
	).wait();

	console.log('response: ', response);

	const SpenderBalance = await erc20Contract.balanceOf(address.spender);

	console.log('Spender balance', SpenderBalance.toString());
}
