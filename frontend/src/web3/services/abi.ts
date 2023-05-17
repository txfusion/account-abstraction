export const abi = {
	erc20:
		require('../artifacts-zk/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json')
			.abi,
	masterchef:
		require('../artifacts-zk/contracts/yieldFarming/MasterChef.sol/MasterChef.json')
			.abi,
	account:
		require('../artifacts-zk/contracts/multicall/Account.sol/Account.json').abi,
	accountfactory:
		require('../artifacts-zk/contracts/multicall/AccountFactory.sol/AccountFactory.json')
			.abi,
	paymaster:
		require('../artifacts-zk/contracts/multicall/Paymaster.sol/Paymaster.json')
			.abi,
};

export const artifacts = {
	erc20: require('../artifacts-zk/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'),
	masterchef: require('../artifacts-zk/contracts/yieldFarming/MasterChef.sol/MasterChef.json'),
	account: require('../artifacts-zk/contracts/multicall/Account.sol/Account.json'),
	accountfactory: require('../artifacts-zk/contracts/multicall/AccountFactory.sol/AccountFactory.json'),
	paymaster: require('../artifacts-zk/contracts/multicall/Paymaster.sol/Paymaster.json'),
};
