import { createColumnHelper } from '@tanstack/react-table';
import { useDisclosure } from '@chakra-ui/react';
import { PurpleButton } from '@/components/buttons/PurpleButton';
import DepositModal from '../modals/DepositModal';
import { useContractRead } from 'wagmi';
import { address } from '@/libs/address';
import { abi } from '@/web3/services/abi';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { smartAccount } from '@/redux/account.slice';
import { useDispatch, useSelector } from 'react-redux';
import { getSigner } from '@/web3/services/getSigner';
import { Contract } from 'zksync-web3';
import {
	TransactionType,
	batchTransactionsAdded,
} from '@/redux/transactions.slice';

const WithdrawAction = ({ row }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<DepositModal data={row.original} isOpen={isOpen} onClose={onClose} />
			<PurpleButton text={'Withdraw'} onClick={onOpen} />
		</>
	);
};

const HarvestAction = ({ row }: any) => {
	const { accountAddress } = useSelector(smartAccount);
	const dispatch = useDispatch();
	const pool = row.original;

	const onHarvest = async () => {
		if (!accountAddress) {
			console.log('Smart Account Address not found');
			return;
		}
		const masterChef = new Contract(
			address.masterchef,
			abi.masterchef,
			await getSigner()
		);

		const txCallData = await masterChef.populateTransaction.withdraw(
			pool.poolId,
			0
		);

		dispatch(
			batchTransactionsAdded([
				{
					fromAddress: accountAddress as string,
					toAddress: address.masterchef,
					toName: pool.yieldFarmName,
					tokenAmount: 0,
					txCalldata: txCallData,
					value: 0,
					functionName: 'WITHDRAW',
				},
			])
		);
	};

	return <PurpleButton text={'Harvest'} onClick={onHarvest} />;
};

const HarvestAllAction = ({ table }: any) => {
	const pools = table.options.data;
	const dispatch = useDispatch();
	const { accountAddress } = useSelector(smartAccount);

	const createTransaction = async () => {
		if (pools.length === 0) {
			console.log('No pools');
			return;
		}
		if (!accountAddress) {
			console.log('Smart Account Address not found');
			return;
		}

		const masterChef = new Contract(
			address.masterchef,
			abi.masterchef,
			await getSigner()
		);

		const txs = pools.map(async (pool: any) => {
			const callData = await masterChef.populateTransaction.withdraw(
				pool.poolId,
				0
			);

			return {
				fromAddress: accountAddress as string,
				toAddress: address.masterchef,
				toName: pool.yieldFarmName,
				tokenAmount: 0,
				txCalldata: callData,
				value: 0,
				functionName: 'WITHDRAW',
			};
		});

		Promise.all(txs).then((txsResolved: any) =>
			dispatch(batchTransactionsAdded([...txsResolved]))
		);
	};

	return (
		<button
			onClick={createTransaction}
			className='w-full text-center border border-white/30 px-1 py-1 rounded-lg hover:bg-white/5 animate-all duration-150'>
			Harvest All
		</button>
	);
};

const RewardBalance = ({ row }: any) => {
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
		id: 'withdraw',
		cell: WithdrawAction,
	}),
	columnHelper.display({
		id: 'harvest',
		header: HarvestAllAction,
		cell: HarvestAction,
	}),
];
