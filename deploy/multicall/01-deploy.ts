import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {  Wallet } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { deployAccount, deployContract } from '../utils/deployment';
import { ACCOUNT_OWNER_PRIVATE_KEY } from '../utils/constants';

const MINT_AMOUNT = ethers.utils.parseEther('1000');

export default async function (hre: HardhatRuntimeEnvironment) {
	const wallet = new Wallet(ACCOUNT_OWNER_PRIVATE_KEY);
	const deployer = new Deployer(hre, wallet);

	const erc20 = await deployContract(deployer, 'MyERC20', [18]);
	const usdc = await deployContract(deployer, 'USDC', [6]);
	await deployContract(deployer, 'Spender');
	const paymaster = await deployContract(deployer, 'Paymaster', [usdc.address]);

	// Supplying paymaster with ETH
	await (
		await deployer.zkWallet.sendTransaction({
			to: paymaster.address,
			value: MINT_AMOUNT,
		})
	).wait();

	const accountContract = await deployAccount(
		deployer,
		'AccountFactory',
		'Account'
	);

	(await erc20.mint(wallet.address, MINT_AMOUNT)).wait();
	console.log(`Minted ${MINT_AMOUNT} tokens for the empty wallet`);

	(await usdc.mint(wallet.address, MINT_AMOUNT)).wait();
	console.log(`Minted ${MINT_AMOUNT} USDC tokens for the empty wallet`);

	(await usdc.mint(accountContract.address, MINT_AMOUNT)).wait();
	console.log(`Minted ${MINT_AMOUNT} USDC tokens for the deployed Account`);

	(await erc20.mint(accountContract.address, MINT_AMOUNT)).wait();
	console.log(`Minted ${MINT_AMOUNT} tokens for the deployed Account`);

	console.log(`Deployment completed!`);
}
