'use client';
import { useEffect, useState } from 'react';

// hooks
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useContractRead } from 'wagmi';

// utils
import { ethers } from 'ethers';
import { Contract } from 'zksync-web3';
import { address } from '@/libs/address';
import { abi } from '@/web3/services/abi';
import { batchTransactionsAdded } from '@/redux/transactions.slice';
import { smartAccount } from '@/redux/account.slice';
import { getSigner } from '@/web3/services/getSigner';

// components
import { PurpleInput } from '../inputs/PurpleInput';
import { PurpleButton } from '../buttons/PurpleButton';
import GrayModal from './GrayModal';
import {
	Flex,
	ModalBody,
	FormControl,
	Text,
	FormErrorMessage,
} from '@chakra-ui/react';

interface IWithdrawModal {
	isOpen: any;
	onClose: any;
	data: any;
}

export default function WithdrawModal({
	isOpen,
	onClose,
	data,
}: IWithdrawModal) {
	const dispatch = useDispatch();
	const { isConnected } = useAccount();
	const { accountAddress } = useSelector(smartAccount);
	const [amount, setAmount] = useState<number>(0);
	const [stakedAmount, setStakedAmount] = useState<string>('');

	const { data: contractData } = useContractRead({
		address: address.masterchef as `0x${string}`,
		abi: abi.masterchef,
		functionName: 'userInfo',
		args: [data.poolId, accountAddress],
		watch: true,
	});

	useEffect(() => {
		if (contractData) {
			console.log(contractData);
			const rewards = ethers.utils.formatEther(
				contractData.amount as ethers.BigNumberish
			);
			setStakedAmount((+rewards).toFixed(2));
		}
	}, [contractData, accountAddress]);

	// createTransaction
	const createTransaction = async () => {
		const masterChef = new Contract(
			address.masterchef,
			abi.masterchef,
			await getSigner()
		);

		// poolId and amount
		const txCalldata = await masterChef.populateTransaction.withdraw(
			address.masterchef,
			ethers.utils.parseEther(amount.toString())
		);

		dispatch(
			batchTransactionsAdded([
				{
					fromAddress: accountAddress,
					toAddress: data.yieldFarmAddress,
					toName: data.yieldFarmName,
					tokenAmount: amount,
					value: 0,
					txCalldata: txCalldata,
					functionName: 'WITHDRAW',
				},
			])
		);
	};

	const balanceError = false;
	const amountError = false;
	const Icon = data.lpTokenIcon;

	return (
		<>
			<GrayModal isOpen={isOpen} onClose={onClose} header={'Withdraw'}>
				<ModalBody pb={6}>
					{isConnected && stakedAmount && (
						<div className='flex flex-row justify-between w-full gap-1 mb-5'>
							<p className='text-white '>Smart Account balance:</p>
							<p className='text-white/50 '>
								{stakedAmount} {data.lpTokenSymbol}
							</p>
						</div>
					)}
					<FormControl>
						<PurpleInput
							type='number'
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
						{balanceError && (
							<FormErrorMessage>Invalid balance.</FormErrorMessage>
						)}
						{amountError && (
							<FormErrorMessage>
								Amount need to be positive number.
							</FormErrorMessage>
						)}
						<p className='text-red-400/50 mb-5'>
							All transaction costs will be paid in USDC
						</p>

						<Flex alignItems='center' mt={2}>
							<PurpleButton
								isDisabled={balanceError || amountError}
								onClick={createTransaction}
								closeClick={onClose}
								text={'Add to pending transactions'}
							/>
						</Flex>
					</FormControl>
				</ModalBody>
			</GrayModal>
		</>
	);
}
