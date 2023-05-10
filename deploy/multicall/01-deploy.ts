import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { utils, Wallet, Contract } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { rich_wallet } from '../utils/rich_wallet';

const MINT_AMOUNT = ethers.utils.parseEther('1000');
const GAS_LIMIT = {
	gasLimit: ethers.utils.hexlify(1000000),
};

export default async function(hre: HardhatRuntimeEnvironment) {
	const wallet = new Wallet(rich_wallet[0].privateKey);
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
		
	const accountContract = await deployAccount(deployer, 'AccountFactory', 'Account');

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

async function deployContract(
	deployer: Deployer,
	contractName: string,
	constructorArguments: any[] = []
): Promise<Contract> {
	const artifact = await deployer.loadArtifact(contractName);
	const contract = await deployer.deploy(artifact, constructorArguments);

	console.log(`${contractName.toLocaleLowerCase()}: "${contract.address}",`);

	return contract;
}

async function deployAccount(
	deployer: Deployer,
	factoryContractName: string,
	accountContractName: string
): Promise<Contract> {
	const factoryArtifact = await deployer.loadArtifact(factoryContractName);
	const accountArtifact = await deployer.loadArtifact(accountContractName);
	const bytecodeHash = utils.hashBytecode(accountArtifact.bytecode);

	const factory = await deployer.deploy(
		factoryArtifact,
		[bytecodeHash],
		undefined,
		[accountArtifact.bytecode]
	);

	console.log(`${factoryContractName.toLocaleLowerCase()}: "${factory.address}",`);

	const salt = ethers.constants.HashZero;
	const transaction = await (
		await factory.deployAccount(salt, deployer.zkWallet.address, GAS_LIMIT)
	).wait();

	const accountAddr = utils.getDeployedContracts(transaction)[0].deployedAddress;
	const accountContract = new Contract(
		accountAddr,
		accountArtifact.abi,
		deployer.zkWallet
	);

	console.log(`${accountContractName.toLocaleLowerCase()}: "${accountContract.address}",`);

	return accountContract;
}
