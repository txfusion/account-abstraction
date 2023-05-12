import { BigNumber, ethers } from 'ethers';

export const BATCH_SELECTOR = '0x29451959';

export async function constructBatchedCalldata(
	transactions: ethers.PopulatedTransaction[]
): Promise<string> {
	const isDelegatecalls: boolean[] = [];
	const targets: string[] = [];
	const methods: string[] = [];
	const values: BigNumber[] = [];

	for (let i = 0; i < transactions.length; i++) {
		const isDelegatecall: boolean = false;
		// const isDelegatecall: boolean =
		// 	(transactions[i].to as string) == address.swapModule ? true : false;

		isDelegatecalls.push(isDelegatecall);

		targets.push(transactions[i].to as string);
		methods.push(transactions[i].data as string);

		const value: BigNumber = transactions[i].value
			? (transactions[i].value as BigNumber)
			: BigNumber.from(0);
		values.push(value);
	}
	// Encode contract addresses and methods data for Multicall
	const AbiCoder = new ethers.utils.AbiCoder();
	const batchedCalldata: string = AbiCoder.encode(
		['bool[]', 'address[]', 'bytes[]', 'uint[]'],
		[isDelegatecalls, targets, methods, values]
	);
	return BATCH_SELECTOR.concat(batchedCalldata.replace('0x', ''));
}
