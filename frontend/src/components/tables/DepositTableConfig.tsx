import { createColumnHelper } from '@tanstack/react-table';
import { Box, HStack, Image, useDisclosure } from '@chakra-ui/react';
import { PurpleButton } from '@/components/buttons/PurpleButton';
import DepositModal from '../modals/DepositModal';
import { useBalance } from 'wagmi';
import { smartAccount } from '@/redux/account.slice';
import { useSelector } from 'react-redux';

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
	const { accountAddress } = useSelector(smartAccount);

	const { data: tokenBalance } = useBalance({
		address: accountAddress as `0x${string}`,
		token: row.original.lpToken as `0x${string}`,
		watch: true,
	});
	if (tokenBalance?.formatted) {
		return <p>~{(+tokenBalance?.formatted).toFixed(2)}</p>;
	}
	return <p>-</p>;
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
