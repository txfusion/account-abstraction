import { address } from '@/libs/address';
import { TransactionType } from '@/redux/transactions.slice';
import { abi } from '@/web3/services/abi';
import { addSignature } from '@/web3/services/addSignature';
import {
	BATCH_SELECTOR,
	constructBatchedCalldata,
} from '@/web3/services/constructBatchedCalldata';
import { getEIP712TxRequest } from '@/web3/services/getEIP712Tx';
import { getFallbackProvider } from '@/web3/services/getFallbackProvider';
import { getApprovalBasedPaymasterData } from '@/web3/services/paymasterFlow';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import {
	Contract,
	Provider,
	Signer,
	Web3Provider,
	types,
	utils,
} from 'zksync-web3';

interface IUseSubmitBatchTx {
	transactions: TransactionType[];
}

interface IUseSubmitBatchTxReturn {
	error: string;
	loading: boolean;
	submitBatchTxs: () => any;
}

const useSubmitBatchTx = ({
	transactions,
}: IUseSubmitBatchTx): IUseSubmitBatchTxReturn => {
	const { connector } = useAccount();

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const noTransactions = transactions.length === 0;

	// batch transactions

	const getSigner = (): Signer => {
		let signer: any;
		if (typeof window !== 'undefined') {
			signer = new Web3Provider((window as any).ethereum).getSigner();
		}
		return signer;
	};

	const getTxsCalldata = () => {
		return transactions.map(({ txCalldata }) => txCalldata);
	};

	const submitBatchTxs = async () => {
		if (noTransactions) {
			setError('No Pending Transactions');
		}
		const provider = await getFallbackProvider();

		setLoading(true);
		let tx: types.TransactionRequest;
		try {
			const accountContract = new Contract(
				address.account,
				abi.account,
				getSigner()
			);

			const prov = getSigner().provider;
			const txs = getTxsCalldata();
			const multiTxCalldata = await constructBatchedCalldata(txs);
			const paymasterData = await getApprovalBasedPaymasterData(
				prov,
				address.usdc,
				accountContract,
				'multicall',
				multiTxCalldata.replace(BATCH_SELECTOR, '0x'),
				address.paymaster
			);

			let tx: types.TransactionRequest = await getEIP712TxRequest(
				prov,
				address.account,
				address.account,
				multiTxCalldata,
				paymasterData
			);

			tx = await addSignature(tx, getSigner());

			return await prov.sendTransaction(utils.serialize(tx));
		} catch (e: any) {
			setError(e);
			throw new Error(e);
		} finally {
			setLoading(false);
		}
	};

	return { submitBatchTxs, error, loading };
};

export default useSubmitBatchTx;
