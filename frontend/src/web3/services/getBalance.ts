import { BigNumber } from 'ethers';
import ERC20 from '../artifacts-zk/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import { Contract, Provider } from 'zksync-web3';

const fallbackProvider = new Provider('http://localhost:3050', 270);

export async function getBalance(
	tokenAddress: string,
	targetAddress: string,
	provider?: Provider
): Promise<BigNumber> {
	const { abi } = ERC20;
	const selectedProvider = provider ? provider : fallbackProvider;
	const erc20Contract = new Contract(tokenAddress, abi, selectedProvider);
	const balance = await erc20Contract.balanceOf(targetAddress);
	return balance;
}
