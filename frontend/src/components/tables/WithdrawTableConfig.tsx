import { createColumnHelper } from '@tanstack/react-table';
import { Pool } from '../../libs/types';
import { Box, HStack, Image, useDisclosure } from '@chakra-ui/react';
import { PurpleButton } from '@/components/buttons/PurpleButton';
import DepositModal from '../modals/DepositModal';
import { useBalance, useContractRead } from 'wagmi';
import { address } from '@/libs/address';
import { abi } from '@/web3/services/abi';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { smartAccount } from '@/redux/account.slice';
import { useSelector } from 'react-redux';

const DepositAction = ({ getValue, row, column, table }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<DepositModal data={row.original} isOpen={isOpen} onClose={onClose} />
			<PurpleButton text={'Withdraw'} onClick={onOpen} />
		</>
	);
};

const MergePictureWithName = ({ getValue, row, column, table }: any) => {
	return (
		<HStack spacing={5}>
			<Box borderColor='system-purple.500' border='0.2rem'>
				<Image boxSize='50px' src={row.original.logoURI} alt='Image' />
			</Box>
			<Box>{getValue()}</Box>
		</HStack>
	);
};

const RewardBalance = ({ getValue, row, column, table }: any) => {
	const [reward, setReward] = useState<string>('');
	const { accountAddress } = useSelector(smartAccount);

	const { data } = useContractRead({
		address: address.masterchef as `0x${string}`,
		abi: abi.masterchef,
		functionName: 'pendingRewardToken',
		args: [row.original.poolId, accountAddress],
		watch: true,
	});

	useEffect(() => {
		if (data) {
			const rewards = ethers.utils.formatEther(data as ethers.BigNumberish);
			setReward((+rewards).toFixed(2));
		}
	}, [data, accountAddress]);

	if (reward) {
		return <p>~{reward}</p>;
	}

	return <p>-</p>;
};

const columnHelper = createColumnHelper<any>();

export const withdrawColumns = [
	columnHelper.accessor('lpTokenIcon', {
		header: '',
		cell: ({ row }) => {
			const Icon = row.original.lpTokenIcon;
			return <Icon />;
		},
	}),
	columnHelper.accessor('lpTokenName', {
		header: 'Name',
	}),
	columnHelper.accessor('lpTokenSymbol', {
		header: 'Symbol',
	}),
	columnHelper.display({
		header: 'Reward',
		id: 'Reward',
		cell: RewardBalance,
	}),
	columnHelper.display({
		id: 'deposit',
		cell: DepositAction,
	}),
];
