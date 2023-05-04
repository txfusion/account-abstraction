import { Provider, utils, Wallet, Contract } from 'zksync-web3';
import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { rich_wallet } from '../utils/rich_wallet';

export const GASLIMIT = {
	gasLimit: ethers.utils.hexlify(1000000),
};

export default async function (hre: HardhatRuntimeEnvironment) {
	const provider = new Provider('http://localhost:3050', 270);

	// Get wallet
	const wallet = new Wallet(rich_wallet[0].privateKey, provider);
	const deployer = new Deployer(hre, wallet);

	// Deploying ERC20 token
	const erc20Artifact = await deployer.loadArtifact('MyERC20');
	const erc20 = await deployer.deploy(erc20Artifact, []);
	console.log(`erc20: "${erc20.address}",`);

	// Deploy Spender (contract that transfers from ERC20 to it self)
	const spenderArtifact = await deployer.loadArtifact('Spender');
	const Spender = await deployer.deploy(spenderArtifact);
	console.log(`spender: "${Spender.address}",`);

	// Deploy AccountFactory
	const factoryArtifact = await deployer.loadArtifact('AccountFactory');
	const accountArtifact = await deployer.loadArtifact('Account');
	const bytecodeHash = utils.hashBytecode(accountArtifact.bytecode);

	const factory = <ethers.Contract>(
		await deployer.deploy(factoryArtifact, [bytecodeHash], undefined, [
			accountArtifact.bytecode,
		])
	);

	console.log(`factory: "${factory.address}",`);

	// Deploying the paymaster
	const paymasterArtifact = await deployer.loadArtifact('Paymaster');
	const paymaster = await deployer.deploy(paymasterArtifact, []);
	console.log(`paymaster: "${paymaster.address}",`);

	// Supplying paymaster with ETH
	await (
		await deployer.zkWallet.sendTransaction({
			to: paymaster.address,
			value: ethers.utils.parseEther('100'),
		})
	).wait();

	// Deploy account
	const salt = ethers.constants.HashZero;
	const transaction = await (
		await factory.deployAccount(salt, wallet.address, GASLIMIT)
	).wait();

	// Get account address
	const accountAddr =
		utils.getDeployedContracts(transaction)[0].deployedAddress;

	const accountContract = new ethers.Contract(
		accountAddr,
		accountArtifact.abi,
		wallet
	);
	console.log(`account: "${accountContract.address}",`);

	(await erc20.mint(wallet.address, ethers.utils.parseEther('3000'))).wait();
	console.log('Minted 30 tokens for the empty wallet');

	(
		await erc20.mint(accountContract.address, ethers.utils.parseEther('1000'))
	).wait();
	console.log('Minted tokens for the deployed Account');

	console.log(`Deployment completed!`);
}
