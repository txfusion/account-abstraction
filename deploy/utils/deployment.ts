import * as ethers from 'ethers';
import { utils, Contract } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

export const GAS_LIMIT = {
	gasLimit: ethers.utils.hexlify(1000000),
};
export async function deployContract(
	deployer: Deployer,
	contractName: string,
	constructorArguments: any[] = []
): Promise<Contract> {
	const artifact = await deployer.loadArtifact(contractName);
	const contract = await deployer.deploy(artifact, constructorArguments);

	console.log(`${contractName.toLocaleLowerCase()}: "${contract.address}",`);

	return contract;
}

export async function deployAccount(
	deployer: Deployer,
	factoryContractName: string,
	accountContractName: string,
	displayGasUsed: boolean = false
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

	// Deploy Factory gas used
	if (displayGasUsed) {
		const gasUsed = (await factory.deployTransaction.wait()).gasUsed.toString();
		console.log('Gas used to deploy Factory contract', gasUsed);
	}
	console.log(
		`${factoryContractName.toLocaleLowerCase()}: "${factory.address}",`
	);

	const salt = ethers.constants.HashZero;
	const transaction = await (
		await factory.deployAccount(salt, deployer.zkWallet.address, GAS_LIMIT)
	).wait();

	// Deploy Account gas used
	if (displayGasUsed) {
		const gasUsed = transaction.gasUsed.toString();
		console.log('Gas used to deploy Account contract', gasUsed);
	}
	const accountAddr =
		utils.getDeployedContracts(transaction)[0].deployedAddress;
	const accountContract = new Contract(
		accountAddr,
		accountArtifact.abi,
		deployer.zkWallet
	);

	console.log(
		`${accountContractName.toLocaleLowerCase()}: "${accountContract.address}",`
	);

	return accountContract;
}
