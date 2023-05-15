import { constants } from 'ethers';
import { Contract, Wallet, utils } from 'zksync-web3';
import  { abi } from './abi'
import { address } from '@/libs/address';
import {rich_wallet} from '../../libs/rich_wallet'
import { getFallbackProvider } from './getFallbackProvider';


  
export async function deployAccount(
	addressOwner: string | undefined,
): Promise<string> {
	const provider = await getFallbackProvider();
	const wallet = new Wallet(rich_wallet[7].privateKey, provider);
	const contract = new Contract(address.accountfactory, abi.accountfactory, wallet);
	const tx = await (await contract.deployAccount(constants.HashZero, wallet.address)).wait()
	const accAddress = (await utils.getDeployedContracts(tx))[0].deployedAddress
	return accAddress;
}