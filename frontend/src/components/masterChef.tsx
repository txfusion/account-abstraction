import RewardIcon from '../icons/RewardIcon';
import YieldStakeIcon from '../icons/YieldStakeIcon';
import StakePlusIcon from '../icons/StakePlusIcon';

export const masterChefDetails = {
	address: '0x88E6157DB8c42c7569cC61139E6777971f4De181',
	rewardToken: '0x837C56cFAA62bdc2f5400a0aadAAef3B83403b03',
	rewardTokenName: 'YieldReward',
	rewardTokenSymbol: 'YRW',
	rewardTokenIcon: RewardIcon,
	pools: [
		{
			poolId: 0,
			lpToken: 'address',
			lpTokenName: 'YieldStake',
			lpTokenSymbol: 'YST',
			lpTokenIcon: YieldStakeIcon,
			rewardToken: 'address',
			allocationPoints: 'allocPoints',
		},
		{
			poolId: 1,
			lpToken: 'address',
			lpTokenName: 'StakePlus',
			lpTokenSymbol: 'STP',
			lpTokenIcon: StakePlusIcon,
			rewardToken: 'address',
			allocationPoints: 'allocPoints',
		},
	],
};
