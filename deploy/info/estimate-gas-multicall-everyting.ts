import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Provider, Wallet, types, utils } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { rich_wallet } from '../utils/rich_wallet';
import { deployAccount, deployContract } from '../utils/deployment';
import { addSignature, getEIP712TxRequest } from '../utils/multicall';

const MINT_AMOUNT = ethers.utils.parseEther('100');
const TRANSFER_AMOUNT = ethers.utils.parseEther('0.1');
const TRANSFER_AMOUNT2 = ethers.utils.parseEther('0.01');
const SECONDARY_ACCOUNT = rich_wallet[1].address;
// testnet
// const SECONDARY_ACCOUNT = '0x33A37c6A25E50c41fe987f4986273DfD24C4fff1';

export default async function (hre: HardhatRuntimeEnvironment) {
	const provider = new Provider('https://testnet.era.zksync.dev', 280);

	const pk = process.env.ZK_TESTNET_PK as string;
	const wallet = new Wallet(pk, provider);
	const deployer = new Deployer(hre, wallet);

	// Deploy ERC20
	const erc20 = await deployContract(deployer, 'MyERC20', [18]);

	// Deploy Account
	const accountContract = await deployAccount(
		deployer,
		'AccountFactory',
		'Account',
		true
	);

	// Supplying account with ETH
	await (
		await deployer.zkWallet.sendTransaction({
			to: accountContract.address,
			value: TRANSFER_AMOUNT,
		})
	).wait();

	// Mint ERC20 tokens to Account
	(await erc20.mint(accountContract.address, MINT_AMOUNT)).wait();
	console.log(`Minted ${MINT_AMOUNT} tokens for the deployed Account`);

	// Account token balance
	const erc20AccountBalance = await erc20.balanceOf(accountContract.address);
	console.log(
		'Account token balance before  transaction',
		ethers.utils.formatEther(erc20AccountBalance)
	);

	const transferErc20Tx = await erc20.populateTransaction.transfer(
		SECONDARY_ACCOUNT,
		TRANSFER_AMOUNT
	);

	let tx: types.TransactionRequest = await getEIP712TxRequest({
		provider: provider,
		from: accountContract.address,
		to: erc20.address,
		calldata: transferErc20Tx.data,
	});
	tx = await addSignature(tx, wallet);

	provider.getFeeData();
	const status = await provider.sendTransaction(utils.serialize(tx));
	const txWait = await status.wait();

	console.log('Status', txWait.status);
	console.log(
		'Gas Used - ERC-20 token transfers send 0.11 of the ERC-20 token',
		txWait.gasUsed.toString()
	);

	// Target token balance
	const erc20TargetBalanceAfterTxs = await erc20.balanceOf(
		accountContract.address
	);

	console.log(
		'Target address token balance before batch transaction',
		ethers.utils.formatEther(erc20TargetBalanceAfterTxs)
	);

	const accountBalance = await provider.getBalance(accountContract.address);
	console.log('BALANCE', ethers.utils.formatEther(accountBalance));

	console.log('=============================================');

	let simpleTransfer: types.TransactionRequest = await getEIP712TxRequest({
		provider,
		from: accountContract.address,
		to: SECONDARY_ACCOUNT,
		calldata: '0x',
		value: TRANSFER_AMOUNT2,
	});

	simpleTransfer = await addSignature(simpleTransfer, wallet);

	const statusSimpleTransfer = await provider.sendTransaction(
		utils.serialize(simpleTransfer)
	);
	const txWaitSimpleTransfer = await statusSimpleTransfer.wait();

	console.log('Status', txWaitSimpleTransfer.status);
	console.log(
		'Gas Used - Native token transfers send 0.1 of the native token.',
		txWaitSimpleTransfer.gasUsed.toString()
	);
	const accountBalancePost = await provider.getBalance(accountContract.address);
	console.log('ACCOUNT BALANCE', ethers.utils.formatEther(accountBalancePost));

	const secondaryAccountBalance = await provider.getBalance(SECONDARY_ACCOUNT);
	console.log(
		'TARGET ACCOUNT BALANCE',
		ethers.utils.formatEther(secondaryAccountBalance)
	);
}
