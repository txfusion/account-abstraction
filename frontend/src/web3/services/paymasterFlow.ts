import { address } from '@/libs/address';
import { ethers } from 'ethers';
import { types, utils, Provider, Contract } from 'zksync-web3';

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
	contract: Contract,
	methodName: string,
	paramData: string,
	paymasterAddress: string = address.paymaster
): Promise<types.Eip712Meta> {
	const gasPrice = await provider.getGasPrice();

	const paramsForFeeEstimation = utils.getPaymasterParams(paymasterAddress, {
		type: 'ApprovalBased',
		minimalAllowance: ethers.BigNumber.from('1'),
		token: tokenAddress,
		innerInput: new Uint8Array(),
	});

	console.log('BEFORE GAS LIMIT');
	// Estimate gasLimit via paymaster
	const gasLimit = await contract.estimateGas[methodName](paramData, {
		customData: {
			gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
			paymasterParams: paramsForFeeEstimation,
		},
	});

	console.log('GAS LIMIT', gasLimit);

	const fee = gasPrice.mul(gasLimit);
	console.log('Fee', ethers.utils.formatEther(fee));

	const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
		type: 'ApprovalBased',
		token: tokenAddress,
		minimalAllowance: fee,
		innerInput: new Uint8Array(),
	});

	return {
		gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
		paymasterParams: paymasterParams,
	};
}
