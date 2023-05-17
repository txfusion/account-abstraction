import { constants, ethers } from 'ethers';
import { Contract, ContractFactory, Wallet, utils } from 'zksync-web3';
import { abi, artifacts } from './abi';
import { address } from '@/libs/address';
import { rich_wallet } from '../../libs/rich_wallet';
import { getFallbackProvider } from './getFallbackProvider';
import { getSigner } from './getSigner';

export const GAS_LIMIT = {
	gasLimit: ethers.utils.hexlify(1000000),
};

const provider = getFallbackProvider();
const wallet = new Wallet(rich_wallet[0].privateKey, provider);
export async function deployAccount(
	addressOwner: string | undefined
): Promise<string> {
	console.log(abi.accountfactory);
	const factoryContract = new Contract(
		address.accountfactory,
		abi.accountfactory,
		wallet
	);
	// const contractFac = new ContractFactory(
	// 	abi.accountfactory,
	// 	artifacts.accountfactory.bytecode,
	// 	wallet
	// );
	// const depl = contractFac.attach(address.accountfactory);

	const salt = constants.HashZero;
	const tx = await factoryContract.deployAccount(salt, addressOwner, GAS_LIMIT);
	console.log(tx);
	await tx.wait();

	// Getting the address of the deployed contract account
	// const abiCoder = new ethers.utils.AbiCoder();
	// const accountAddress = utils.create2Address(
	// 	address.accountfactory,
	// 	await factoryContract.aaBytecodeHash(),
	// 	salt,
	// 	abiCoder.encode(['address'], [addressOwner])
	// );
	// console.log('account address', accountAddress);
	// const accAddress = utils.getDeployedContracts(tx)[0].deployedAddress;
	return 'accAddress';
}
