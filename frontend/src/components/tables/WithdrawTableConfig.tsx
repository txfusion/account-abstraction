import { createColumnHelper } from '@tanstack/react-table';
import { Pool } from '../../libs/types';
import { Box, HStack, Image, useDisclosure } from '@chakra-ui/react';
import { PurpleButton } from '@/components/buttons/PurpleButton';
import DepositModal from '../modals/DepositModal';

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

const columnHelper = createColumnHelper<Pool>();

export const withdrawColumns = [
	columnHelper.accessor('name', {
		header: 'Name',
		cell: MergePictureWithName,
	}),
	columnHelper.accessor('symbol', {
		header: 'Symbol',
	}),
	columnHelper.display({
		id: 'withdraw',
		cell: DepositAction,
	}),
];
