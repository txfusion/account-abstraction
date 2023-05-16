import RewardIcon from '../icons/RewardIcon';
import YieldStakeIcon from '../icons/YieldStakeIcon';
import StakePlusIcon from '../icons/StakePlusIcon';
import SquareIcon from '@/icons/SquareIcon';
import CirclesIcon from '@/icons/CirclesIcon';

export const masterChefDetails = {
	address: '0x88E6157DB8c42c7569cC61139E6777971f4De181',
	rewardToken: '0x837C56cFAA62bdc2f5400a0aadAAef3B83403b03',
	rewardTokenName: 'YieldReward',
	rewardTokenSymbol: 'YRW',
	rewardTokenIcon: RewardIcon,
	pools: [
		{
			poolId: 0,
			yieldFarmAddress: '0x88E6157DB8c42c7569cC61139E6777971f4De181',
			yieldFarmName: 'YieldFarm',
			lpToken: '0xb960B59212E2e8518Cb9a7a53CF1845A83dB0931',
			lpTokenName: 'YieldStake',
			lpTokenSymbol: 'YST',
			lpTokenIcon: YieldStakeIcon,
			rewardToken: '0x837C56cFAA62bdc2f5400a0aadAAef3B83403b03',
			rewardTokenName: 'YieldReward',
			rewardTokenSymbol: 'YRW',
			rewardTokenIcon: RewardIcon,
			allocationPoints: 100,
		},
		{
			poolId: 1,
			yieldFarmAddress: '0x88E6157DB8c42c7569cC61139E6777971f4De181',
			yieldFarmName: 'YieldFarm',
			lpToken: '0x678286CF32866dC1f62901a3B84E3E9E00FDe1E6',
			lpTokenName: 'StakePlus',
			lpTokenSymbol: 'STP',
			lpTokenIcon: CirclesIcon,
			rewardToken: '0x837C56cFAA62bdc2f5400a0aadAAef3B83403b03',
			rewardTokenName: 'YieldReward',
			rewardTokenSymbol: 'YRW',
			rewardTokenIcon: RewardIcon,
			allocationPoints: 500,
		},
		{
			poolId: 2,
			yieldFarmAddress: '0x88E6157DB8c42c7569cC61139E6777971f4De181',
			yieldFarmName: 'YieldFarm',
			lpToken: '0xBa53fdD96B62cdDE84106F529613d1E9E6Aecf43',
			lpTokenName: 'FarmGain',
			lpTokenSymbol: 'FGN',
			lpTokenIcon: SquareIcon,
			rewardToken: '0x837C56cFAA62bdc2f5400a0aadAAef3B83403b03',
			rewardTokenName: 'YieldReward',
			rewardTokenSymbol: 'YRW',
			rewardTokenIcon: RewardIcon,
			allocationPoints: 500,
		},
	],
};
