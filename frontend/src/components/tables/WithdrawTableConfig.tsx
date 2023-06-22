import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDisclosure } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { useContractRead } from 'wagmi';
import { ethers } from 'ethers';
import { smartAccount } from '@/redux/account.slice';
import { getSigner } from '@/web3/services/getSigner';
import { batchTransactionsAdded } from '@/redux/transactions.slice';
import { Contract } from 'zksync-web3';
import { address } from '@/libs/address';
import { abi } from '@/web3/services/abi';
import { PurpleButton } from '@/components/buttons/PurpleButton';
import WithdrawModal from '../modals/WithdrawModal';

const WithdrawAction = ({ row }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<WithdrawModal data={row.original} isOpen={isOpen} onClose={onClose} />
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
		return <p>~ {reward}</p>;
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
	columnHelper.display({
		header: 'LP Token',
		cell: ({ row }) => (
			<div className='flex flex-col gap-1 '>
				<p>{row.original.lpTokenName}</p>
				<p className='text-white/50'>{row.original.lpTokenSymbol}</p>
			</div>
		),
	}),
	columnHelper.display({
		header: 'Reward',
		id: 'Reward',
		cell: RewardBalance,
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
		id: 'withdraw',
		cell: WithdrawAction,
	}),
	columnHelper.display({
		id: 'harvest',
		header: HarvestAllAction,
		cell: HarvestAction,
	}),
];
