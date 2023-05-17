import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Wallet, utils } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { toBN } from '../utils/helper';
import { rich_wallet } from '../utils/rich_wallet';

export default async function (hre: HardhatRuntimeEnvironment) {
	const wallet = new Wallet(rich_wallet[0].privateKey);
	const deployer = new Deployer(hre, wallet);

	const wethArtifact = await deployer.loadArtifact('WETH9');
	const tknArtifact = await deployer.loadArtifact('MockTKN');
	const factoryArtifact = await deployer.loadArtifact('UniswapV2Factory');
	const routerArtifact = await deployer.loadArtifact('UniswapV2Router');
	const pairArtifact = await deployer.loadArtifact('UniswapV2Pair');

	// Deploy WETH
	const weth = await deployer.deploy(wethArtifact);
	console.log(`weth: "${weth.address}",`);

	// Deploy Mock DAI
	const dai = await deployer.deploy(tknArtifact, ['DAI Stablecoin', 'DAI', 18]);
	console.log(`dai: "${dai.address}",`);

	//    // Deploy Mock LUSD
	const lusd = await deployer.deploy(tknArtifact, ['Liquity USD', 'LUSD', 18]);
	console.log(`lusd: "${lusd.address}",`);

	// Deploy Factory with pair bytecode
	const pairBytecodeHash = utils.hashBytecode(pairArtifact.bytecode);
	const factory = await deployer.deploy(
		factoryArtifact,
		[wallet.address, pairBytecodeHash],
		undefined,
		[pairArtifact.bytecode]
	);
	console.log(`factory: "${factory.address}",`);

	// Deploy Router
	const router = await deployer.deploy(routerArtifact, [
		factory.address,
		weth.address,
	]);
	console.log(`router: "${router.address}",`);

	// Deposit ETH into WETH
	await (await weth.deposit({ value: toBN('10000') })).wait();

	// Mint DAI
	await (await dai.mint(wallet.address, toBN('2000000'))).wait();

	//Mint lusd
	await (await lusd.mint(wallet.address, toBN('2000000'))).wait();

	// Approve Router
	await (
		await weth.approve(router.address, ethers.constants.MaxUint256)
	).wait();
	await (await dai.approve(router.address, ethers.constants.MaxUint256)).wait();
	await (
		await lusd.approve(router.address, ethers.constants.MaxUint256)
	).wait();

	// Add Liquidity
	let tx = await router.addLiquidity(
		weth.address,
		dai.address,
		toBN('500'), // DAI/WETH == 2000
		toBN('1000000'),
		0,
		0,
		wallet.address,
		ethers.constants.MaxUint256,
		{ gasLimit: ethers.BigNumber.from(1000000) }
	);
	await tx.wait();

	//Add Liquidity
	let tx2 = await router.addLiquidity(
		weth.address,
		lusd.address,
		toBN('500'), // LUSD/WETH == 2000
		toBN('1000000'),
		0,
		0,
		wallet.address,
		ethers.constants.MaxUint256,
		{ gasLimit: ethers.BigNumber.from(1000000) }
	);
	await tx2.wait();

	console.log('Deployed');
}
