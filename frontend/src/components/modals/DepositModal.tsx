'use client';
import { useState } from 'react';
import {
	Flex,
	ModalBody,
	FormControl,
	Text,
	FormHelperText,
	FormErrorMessage,
} from '@chakra-ui/react';
import { PurpleInput } from '../inputs/PurpleInput';
import { PurpleButton } from '../buttons/PurpleButton';
import GrayModal from './GrayModal';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useBalance } from 'wagmi';
import { Contract, Signer, Web3Provider } from 'zksync-web3';
import { address } from '@/libs/address';
import { abi } from '@/web3/services/abi';
import { ethers } from 'ethers';
import { batchTransactionsAdded } from '@/redux/transactions.slice';
import { smartAccount } from '@/redux/account.slice';

interface IDepositModal {
	isOpen: any;
	onClose: any;
	data: any;
}

export default function DepositModal({ isOpen, onClose, data }: IDepositModal) {
	const { isConnected, connector } = useAccount();
	const { accountAddress } = useSelector(smartAccount);

	const dispatch = useDispatch();

	const [amount, setAmount] = useState<number>(0);

	const { data: tokenBalance } = useBalance({
		address: accountAddress as `0x${string}`,
		token: data.lpToken as `0x${string}`,
		watch: true,
	});

	const getSigner = (): Signer => {
		let signer: any;
		if (typeof window !== 'undefined') {
			signer = new Web3Provider((window as any).ethereum).getSigner();
		}
		return signer;
	};

	// IT IS HARDCODED FOR NOW
	const createTransaction = async () => {
		const masterChef = new Contract(
			address.masterchef,
			abi.masterchef,
			getSigner()
		);
		const lpToken = new Contract(data.lpToken, abi.erc20, getSigner());

		// poolId and amount
		const approveCallData = await lpToken.populateTransaction.approve(
			address.masterchef,
			ethers.utils.parseEther(amount.toString())
		);

		// poolId and amount
		const transactionCallData = await masterChef.populateTransaction.deposit(
			data.poolId,
			ethers.utils.parseEther(amount.toString())
		);

		dispatch(
			batchTransactionsAdded([
				{
					fromAddress: accountAddress,
					toAddress: data.lpToken,
					toName: data.lpTokenName,
					tokenAmount: amount,
					value: 0,
					txCalldata: approveCallData,
					functionName: 'APPROVE',
				},
				{
					fromAddress: accountAddress,
					toAddress: address.masterchef,
					toName: data.yieldFarmName,
					tokenAmount: amount,
					value: 0,
					txCalldata: transactionCallData,
					functionName: 'DEPOSIT',
				},
			])
		);
	};

	const Icon = data.lpTokenIcon;

	const balanceError = tokenBalance
		? +(+tokenBalance.formatted).toFixed(2) - amount <= 0
		: true;
	const amountError = isNaN(amount) || amount < 0;

	return (
		<>
			<GrayModal isOpen={isOpen} onClose={onClose} header={'Deposit'}>
				<ModalBody pb={6}>
					<FormControl isInvalid={balanceError || amountError}>
						{/* <FormControl>
							<NumberInput max={50} min={10}>
								<NumberInputField />
							</NumberInput>
						</FormControl> */}
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
						<p className='text-red-400/50'>
							All transaction costs will be paid in USDC
						</p>

						{isConnected && (
							<div className='flex flex-row gap-1'>
								<p className='text-white '>
									Smart Account {data.lpTokenSymbol} balance:
								</p>
								<p className='text-white/50 '>{tokenBalance?.formatted}</p>
							</div>
						)}
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
