import { BigNumber, Signer, constants } from 'ethers';
import AccountFactory from '../artifacts-zk/contracts/multicall/AccountFactory.sol/AccountFactory.json';
import { Contract } from 'zksync-web3';
import  { abi } from './abi'
import { address } from '@/libs/address';

export async function deployAccount(
	sig: Signer,
	addressOwner: string
): Promise<String> {
	console.log(sig);
	const contract = new Contract(address.accountfactory, abi.accountfactory, sig);
	let smartAccount =  await contract.deployAccount(constants.HashZero, addressOwner);
	return smartAccount;
}
