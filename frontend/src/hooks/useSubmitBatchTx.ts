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
import React, { useEffect, useState } from 'react';
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
	success: string;
	loading: boolean;
	submitBatchTxs: () => any;
}

const useSubmitBatchTx = ({
	transactions,
}: IUseSubmitBatchTx): IUseSubmitBatchTxReturn => {
	const { address: signerAddress } = useAccount();

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');

	const noTransactions = transactions.length === 0;

	useEffect(() => {
		console.log('unmount');
		setError('');
		setSuccess('');
	}, [transactions]);

	// batch transactions
	const getSigner = async (): Promise<Signer> => {
		let signer: any;
		if (typeof window !== 'undefined') {
			signer = new Web3Provider((window as any).ethereum).getSigner();
		}
		return signer;
	};

	// lets try this again
	// batch transactions
	const getProvider = async (): Promise<Provider> => {
		let provider: any;
		if (typeof window !== 'undefined') {
			provider = new Provider((window as any).ethereum);
		}
		return provider;
	};

	const getTxsCalldata = () => {
		return transactions.map(({ txCalldata }) => txCalldata);
	};

	const submitBatchTxs = async () => {
		if (noTransactions) {
			setError('No Pending Transactions');
			return;
		}
		if (!signerAddress) {
			setError('Please connect with you wallet!');
			return;
		}

		setLoading(true);
		setError('');
		setSuccess('');
		try {
			const accountContract = new Contract(
				address.account,
				abi.account,
				await getSigner()
			);

			const provider = await getFallbackProvider();
			// const provider = await getProvider();

			const txs = getTxsCalldata();
			const multiTxCalldata = await constructBatchedCalldata(txs);
			const paymasterData = await getApprovalBasedPaymasterData(
				provider,
				address.usdc,
				accountContract,
				'multicall',
				multiTxCalldata.replace(BATCH_SELECTOR, '0x'),
				address.paymaster
			);

			let tx: types.TransactionRequest = await getEIP712TxRequest(
				provider,
				address.account,
				address.account,
				multiTxCalldata,
				paymasterData
			);

			tx = await addSignature(tx, await getSigner());

			const receipt = await (
				await provider.sendTransaction(utils.serialize(tx))
			).wait();
			if (receipt.status === 1) {
				setSuccess('Transaction successful!');
			}

			console.log(receipt);

			// return await provider.sendTransaction(utils.serialize(tx));
		} catch (e: unknown) {
			throw new Error(e as string);
		} finally {
			setLoading(false);
		}
	};

	return { submitBatchTxs, error, loading, success };
};

export default useSubmitBatchTx;
