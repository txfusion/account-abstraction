import { BigNumber, ethers } from 'ethers';

export const toBN = (x: string): BigNumber => {
	return ethers.utils.parseEther(x);
};
