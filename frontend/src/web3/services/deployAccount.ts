import { Signer, constants } from 'ethers';
import { Contract, Web3Provider } from 'zksync-web3';
import  { abi } from './abi'
import { address } from '@/libs/address';
import { useSigner } from '@/hooks/useSigner';
  
export async function deployAccount(
	addressOwner: string
): Promise<String> {
	const signer = useSigner();
	const contract = new Contract(address.accountfactory, abi.accountfactory, signer);
	let smartAccount =  await contract.deployAccount(constants.HashZero, addressOwner);
	return smartAccount;
}
