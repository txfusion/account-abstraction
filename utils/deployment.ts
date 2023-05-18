const artifact = await deployer.loadArtifact(contractName);
	const contract = await deployer.deploy(artifact, constructorArguments);

	console.log(`${contractName.toLocaleLowerCase()}: "${contract.address}",`);
	console.log(`${contractName.toLowerCase()}: "${contract.address}",`);

	return contract;
}
@@ -35,7 +35,7 @@ export async function deployAccount(
	);

	console.log(
		`${factoryContractName.toLocaleLowerCase()}: "${factory.address}",`
		`${factoryContractName.toLowerCase()}: "${factory.address}",`
	);

	const salt = ethers.constants.HashZero;
@@ -52,7 +52,7 @@ export async function deployAccount(
	);

	console.log(
		`${accountContractName.toLocaleLowerCase()}: "${accountContract.address}",`
		`${accountContractName.toLowerCase()}: "${accountContract.address}",`
	);

	return accountContract;