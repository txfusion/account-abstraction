import { createColumnHelper } from '@tanstack/react-table';
import { Pool } from '../../libs/types';
import { Box, HStack, Image, useDisclosure } from '@chakra-ui/react';
import { PurpleButton } from '@/components/buttons/PurpleButton';
import DepositModal from '../modals/DepositModal';
import { useBalance } from 'wagmi';
import { address } from '@/libs/address';

const DepositAction = ({ getValue, row, column, table }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<DepositModal data={row.original} isOpen={isOpen} onClose={onClose} />
			<PurpleButton text={'Deposit'} onClick={onOpen} />
		</>
	);
};
const AccountBalance = ({ getValue, row, column, table }: any) => {
	console.log(row);

	const { data: tokenBalance } = useBalance({
		address: address.account as `0x${string}`,
		token: row.original.lpToken as `0x${string}`,
		watch: true,
	});

	return <p>{tokenBalance?.formatted}</p>;
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

const columnHelper = createColumnHelper<any>();

export const depositColumns = [
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
	columnHelper.accessor('', {
		header: 'Balance',
		cell: AccountBalance,
	}),
	columnHelper.display({
		id: 'deposit',
		cell: DepositAction,
	}),
];
