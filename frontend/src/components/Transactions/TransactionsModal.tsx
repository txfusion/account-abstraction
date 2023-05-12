'use client';
import { useState } from 'react';
import { Flex, ModalBody, FormControl, Text, Image } from '@chakra-ui/react';
import { PurpleInput } from '../inputs/PurpleInput';
import { PurpleButton } from '../buttons/PurpleButton';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import { Contract } from 'zksync-web3';
import { address } from '@/libs/address';
import { abi } from '@/web3/services/abi';
import { ethers } from 'ethers';
import {
	batchTransactionsAdded,
	selectAll,
	selectTransactions,
} from '@/redux/transactions.slice';
import GrayModal from '../modals/GrayModal';

interface ITransactionsModal {
	isOpen: any;
	onClose: any;
}

export default function TransactionsModal({
	isOpen,
	onClose,
}: ITransactionsModal) {
	const pendingTransactions = useSelector(selectTransactions.selectAll);
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
										const isLastItem = index === pendingTransactions.length - 1;
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

						<PurpleButton
							text='Submit all transactions'
							onClick={() => {}}></PurpleButton>
					</div>
				</ModalBody>
			</GrayModal>
		</>
	);
}
