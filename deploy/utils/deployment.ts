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

	console.log(`${contractName.toLowerCase()}: "${contract.address}",`);

	return contract;
}

export async function deployAccount(
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

	console.log(
		`${factoryContractName.toLowerCase()}: "${factory.address}",`
	);

	const salt = ethers.constants.HashZero;
	const transaction = await (
		await factory.deployAccount(salt, deployer.zkWallet.address, GAS_LIMIT)
	).wait();

	const accountAddr =
		utils.getDeployedContracts(transaction)[0].deployedAddress;
	const accountContract = new Contract(
		accountAddr,
		accountArtifact.abi,
		deployer.zkWallet
	);

	console.log(
		`${accountContractName.toLowerCase()}: "${accountContract.address}",`
	);

	return accountContract;
}
