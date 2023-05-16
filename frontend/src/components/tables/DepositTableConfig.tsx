import { createColumnHelper } from '@tanstack/react-table';
import { useDisclosure } from '@chakra-ui/react';
import { PurpleButton } from '@/components/buttons/PurpleButton';
import DepositModal from '../modals/DepositModal';
import { useBalance, useContractRead } from 'wagmi';
import { smartAccount } from '@/redux/account.slice';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { address } from '@/libs/address';
import { abi } from '@/web3/services/abi';

const DepositAction = ({ row }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<DepositModal data={row.original} isOpen={isOpen} onClose={onClose} />
			<PurpleButton text={'Deposit'} onClick={onOpen} />
		</>
	);
};
const AccountBalance = ({ row }: any) => {
	const { accountAddress } = useSelector(smartAccount);

	const { data: tokenBalance } = useBalance({
		address: accountAddress as `0x${string}`,
		token: row.original.lpToken as `0x${string}`,
		watch: true,
	});

	if (tokenBalance?.formatted) {
		return <p>~ {(+tokenBalance?.formatted).toFixed(2)}</p>;
	}
	return <p>-</p>;
};
const StakedAmount = ({ row }: any) => {
	const { accountAddress } = useSelector(smartAccount);

	const [stakedAmount, setStakedAmount] = useState<string>('');

	const { data: contractData } = useContractRead({
		address: address.masterchef as `0x${string}`,
		abi: abi.masterchef,
		functionName: 'userInfo',
		args: [row.original.poolId, accountAddress],
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

	if (stakedAmount) {
		return <p>~ {(+stakedAmount).toFixed(2)}</p>;
	}
	return <p>-</p>;
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
		header: 'LP Token',
		cell: ({ row }) => (
			<div className='flex flex-col gap-1 '>
				<p>{row.original.lpTokenName}</p>
				<p className='text-white/50'>{row.original.lpTokenSymbol}</p>
			</div>
		),
	}),

	columnHelper.display({
		header: 'Balance',
		cell: AccountBalance,
	}),
	columnHelper.display({
		header: 'Staked',
		cell: StakedAmount,
	}),

	columnHelper.display({
		header: 'Reward Token',
		cell: ({ row }) => (
			<div className='flex flex-col gap-1'>
				<p>{row.original.rewardTokenName}</p>
				<p className='text-white/50'>{row.original.rewardTokenSymbol}</p>
			</div>
		),
	}),
	columnHelper.display({
		id: 'deposit',
		cell: DepositAction,
	}),
];
