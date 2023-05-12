'use client';
import { useSelector } from 'react-redux';
import { selectTransactions } from '@/redux/transactions.slice';
import GrayModal from '../modals/GrayModal';
import { ModalBody, Text, Button } from '@chakra-ui/react';
import useSubmitBatchTx from '@/hooks/useSubmitBatchTx';

interface ITransactionsModal {
	isOpen: any;
	onClose: any;
}

export default function TransactionsModal({
	isOpen,
	onClose,
}: ITransactionsModal) {
	const pendingTransactions = useSelector(selectTransactions.selectAll);
	const { submitBatchTxs, error, loading } = useSubmitBatchTx({
		transactions: pendingTransactions,
	});

	const onSubmitTxs = async () => {
		const tx = await submitBatchTxs();
		const txWait = await tx.wait();
		console.log('Status', txWait.status);
	};

	const noPendingTransactions = pendingTransactions.length === 0;
	return (
		<>
			<GrayModal
				isOpen={isOpen}
				onClose={onClose}
				header={'Pending Transactions'}>
				<ModalBody pb={6}>
					<div className='flex flex-col items-center gap-4'>
						<table className='w-full text-center text-white table-auto'>
							<thead className='border-b border-white/10 '>
								<tr className='text-lg font-bold'>
									<th>#</th>
									<th>From</th>
									<th>Function</th>
									<th>Amount</th>
									<th>To</th>
								</tr>
							</thead>
							<tbody>
								{pendingTransactions.map(
									(
										{
											fromAddress,
											toAddress,
											toName,
											tokenAmount,
											functionName,
											transactionId,
										},
										index
									) => {
										return (
											<tr
												key={transactionId}
												className={'text-white border-b border-white/5'}>
												<td>{index}</td>
												<td className='flex flex-col '>
													<p>Account</p>
													<p className='text-white/30 text-sm'>
														{fromAddress.slice(0, 4)}...{fromAddress.slice(-4)}
													</p>
												</td>
												<td>{functionName}</td>
												<td>{tokenAmount} TOKEN</td>
												<td className='flex flex-col'>
													<p>{toName}</p>
													<p className='text-white/30 text-sm'>
														{toAddress.slice(0, 4)}...{toAddress.slice(-4)}
													</p>
												</td>
											</tr>
										);
									}
								)}
							</tbody>
						</table>

						{noPendingTransactions && (
							<p className='text-white'>No Pending Transactions</p>
						)}

						<Button
							disabled={noPendingTransactions}
							colorScheme='system-purple'
							onClick={submitBatchTxs}
							borderRadius='xl'>
							<Text color='white' fontSize='sm'>
								Submit all transactions
							</Text>
						</Button>
					</div>
				</ModalBody>
			</GrayModal>
		</>
	);
}
