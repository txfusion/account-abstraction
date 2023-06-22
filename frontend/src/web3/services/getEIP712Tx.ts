import { BigNumber } from 'ethers';
import { types, utils, Provider, Contract } from 'zksync-web3';

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
