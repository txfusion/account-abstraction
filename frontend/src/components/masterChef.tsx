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
			lpToken: '0xb960B59212E2e8518Cb9a7a53CF1845A83dB0931',
			lpTokenName: 'StakePlus',
			lpTokenSymbol: 'STP',
			lpTokenIcon: StakePlusIcon,
			rewardToken: '0x837C56cFAA62bdc2f5400a0aadAAef3B83403b03',
			rewardTokenName: 'YieldReward',
			rewardTokenSymbol: 'YRW',
			rewardTokenIcon: RewardIcon,
			allocationPoints: 500,
		},
	],
};
