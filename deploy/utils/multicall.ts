import { BigNumber, ethers } from 'ethers';
import {
	types,
	utils,
	Contract,
	Provider,
	Wallet,
	EIP712Signer,
} from 'zksync-web3';
import { address } from './address';

const BATCH_SELECTOR = '0x29451959';

export async function constructBatchedCalldata(
	transactions: ethers.PopulatedTransaction[]
): Promise<any> {
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

export async function getGeneralFlowPaymasterData(
	paymasterAddress: string = address.paymaster
): Promise<types.Eip712Meta> {
	const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
		type: 'General',
		innerInput: new Uint8Array(),
	});

	const customData: types.Eip712Meta = {
		gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
		paymasterParams: paymasterParams,
	};

	return customData;
}

export async function getApprovalBasedPaymasterData(
	provider: Provider,
	tokenAddress: string,
	paymasterAddress: string = address.paymaster
): Promise<types.Eip712Meta> {
	const abiCoder = new ethers.utils.AbiCoder();
	const input = abiCoder.encode([], []);

	const eth_fee = BigNumber.from(
		1000000 * Number(await provider.getGasPrice())
	);

	const token_fee = BigNumber.from(Number(eth_fee || BigNumber.from(0)) * 1.5);

	console.log(
		'Token Fees',
		ethers.utils.formatEther(eth_fee),
		ethers.utils.formatEther(token_fee)
	);

	const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
		type: 'ApprovalBased',
		token: tokenAddress,
		minimalAllowance: token_fee,
		innerInput: input,
	});

	const customData: types.Eip712Meta = {
		gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
		paymasterParams: paymasterParams,
	};

	return customData;
}

export async function getCustomData(
	provider: Provider,
	tokenAddress: string,
	isGeneralFlow: boolean = false
): Promise<types.Eip712Meta> {
	let paymasterParams: types.PaymasterParams;
	if (isGeneralFlow) {
		const abiCoder = new ethers.utils.AbiCoder();
		const input = abiCoder.encode([], []);

		const eth_fee = BigNumber.from(
			1000000 * Number(await provider.getGasPrice())
		);
		const token_fee = BigNumber.from(
			Number(eth_fee || BigNumber.from(0)) * 1.5
		);

		paymasterParams = utils.getPaymasterParams(address.paymaster, {
			type: 'ApprovalBased',
			token: tokenAddress,
			minimalAllowance: token_fee,
			innerInput: input,
		});
	} else {
		paymasterParams = utils.getPaymasterParams(address.paymaster, {
			type: 'General',
			innerInput: new Uint8Array(),
		});
	}

	const customData: types.Eip712Meta = {
		gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
		paymasterParams: paymasterParams,
	};

	return customData;
}

export async function getTxWithApproval(
	tx: any,
	tokenAddress: string,
	contractInterface: ethers.ContractInterface,
	amount: BigNumber,
	signer: ethers.providers.Provider | ethers.Signer
) {
	const tokenContract = new Contract(tokenAddress, contractInterface, signer);
	const approveTx = await tokenContract.populateTransaction.approve(
		address.spender,
		amount
	);

	return await constructBatchedCalldata([approveTx, tx]);
}

export async function getEIP712TxRequest(
	provider: Provider,
	_from: string,
	to: string,
	calldata: string | undefined,
	_customData: types.Eip712Meta
): Promise<types.TransactionRequest> {
	return {
		from: _from,
		to: to,
		chainId: (await provider.getNetwork()).chainId,
		maxFeePerGas: await provider.getGasPrice(),
		//  nonce value should be from the account that is sending the transaction
		nonce: await provider.getTransactionCount(_from as string),
		maxPriorityFeePerGas: BigNumber.from(0),
		type: 113,
		data: calldata as string,
		customData: _customData,
		value: BigNumber.from(0),
		gasPrice: await provider.getGasPrice(),
		gasLimit: BigNumber.from(1500000),
	};
}

export async function addSignature(tx: any, signer: Wallet): Promise<any> {
	const signedTxHash = EIP712Signer.getSignedDigest(tx);
	const signature = ethers.utils.arrayify(
		ethers.utils.joinSignature(signer._signingKey().signDigest(signedTxHash))
	);

	tx.customData = {
		...tx.customData,
		customSignature: signature,
	};
	return tx;
}
