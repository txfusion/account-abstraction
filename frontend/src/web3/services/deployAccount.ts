import { Signer, constants } from 'ethers';
import { Contract, Web3Provider } from 'zksync-web3';
import { abi } from './abi';
import { address } from '@/libs/address';

export async function getSigner(): Promise<Signer> {
	let signer: any;

	if (typeof window !== 'undefined') {
		signer = new Web3Provider((window as any).ethereum).getSigner();
	}

	return signer;
}

export async function deployAccount(addressOwner: string): Promise<String> {
	const signer = await getSigner();
	const contract = new Contract(
		address.accountfactory,
		abi.accountfactory,
		signer
	);
	let smartAccount = await contract.deployAccount(
		constants.HashZero,
		addressOwner
	);
	return smartAccount;
}
