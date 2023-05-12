'use client';
import { useState } from 'react';
import { Flex, ModalBody, FormControl, Text, Image } from '@chakra-ui/react';
import { PurpleInput } from '../inputs/PurpleInput';
import { PurpleButton } from '../buttons/PurpleButton';
import GrayModal from './GrayModal';
import { useDispatch } from 'react-redux';
import { useAccount } from 'wagmi';
import { Contract } from 'zksync-web3';
import { address } from '@/libs/address';
import { abi } from '@/web3/services/abi';
import { ethers } from 'ethers';
import { batchTransactionsAdded } from '@/redux/transactions.slice';

interface IDepositModal {
	isOpen: any;
	onClose: any;
	data: any;
}

export default function DepositModal({ isOpen, onClose, data }: IDepositModal) {
	const { isConnected, connector } = useAccount();
	const dispatch = useDispatch();

	const [amount, setAmount] = useState(0);

	// IT IS HARDCODED FOR NOW
	const createTransaction = async () => {
		// SIGNER might not necessary for now
		const signer = await connector?.getSigner();

		const masterChef = new Contract(address.masterchef, abi.masterchef, signer);
		const lpToken = new Contract(address.lptoken, abi.erc20, signer);
		const tokenAmount = amount;
		// poolId and amount

		const approveCallData = await lpToken.populateTransaction.approve(
			address.masterchef,
			ethers.utils.parseEther(tokenAmount.toString())
		);
		// poolId and amount
		const transactionCallData = await masterChef.populateTransaction.deposit(
			0,
			ethers.utils.parseEther(tokenAmount.toString())
		);

		const transactions = [
			{
				from: address.account,
				to: address.lptoken,
				tokenAmount,
				txCalldata: transactionCallData,
			},
			{
				from: address.account,
				to: address.masterchef,
				tokenAmount,
				txCalldata: approveCallData,
			},
		];

		dispatch(batchTransactionsAdded(transactions));
	};

	const Icon = data.lpTokenIcon;

	return (
		<>
			<GrayModal isOpen={isOpen} onClose={onClose} header={'Deposit'}>
				<ModalBody pb={6}>
					<FormControl>
						<PurpleInput
							size='lg'
							iconLeft={<div>{Icon && <Icon />}</div>}
							iconRight={
								<Text me='5' textColor='white' size='xs'>
									{data.lpTokenSymbol}
								</Text>
							}
							placeHolder='0.00'
							setValue={setAmount}
							text={'Amount'}
						/>
						<Flex alignItems='center' mt={2}>
							<PurpleButton
								// onClick={() => dispatch(addToCart({ item: data, amount }))}
								onClick={createTransaction}
								closeClick={onClose}
								text={'Add to Cart'}
							/>
						</Flex>
					</FormControl>
				</ModalBody>
			</GrayModal>
		</>
	);
}
