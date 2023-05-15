import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Provider, Wallet, utils, Contract } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { addSignature, getEIP712TxRequest } from '../utils/multicall';
import { address } from '../utils/address';
import { ACCOUNT_OWNER_PRIVATE_KEY, SESSION_OWNER_PRIVATE_KEY } from '../utils/constants';

const TRANSFER_AMOUNT = ethers.utils.parseEther('0.1');

export default async function (hre: HardhatRuntimeEnvironment) {
    const provider = new Provider('http://localhost:3050', 270);
    const sessionWallet = new Wallet(SESSION_OWNER_PRIVATE_KEY, provider);
    const wallet = new Wallet(ACCOUNT_OWNER_PRIVATE_KEY, provider);
	const deployer = new Deployer(hre, wallet);

	const erc20 = await deployer.loadArtifact('MyERC20');
	const erc20Contract = new Contract(address.myerc20, erc20.abi, wallet);

    await(
        await sessionWallet.sendTransaction({
            to: address.account,
            value: ethers.utils.parseEther('0.01'),
        })
    ).wait();

    const tx = await erc20Contract.populateTransaction.transfer(sessionWallet.address, TRANSFER_AMOUNT);

    const txRequest = await getEIP712TxRequest(
        provider,
        address.account,
        tx.to as string,
        undefined,
        tx.data,
        {
            gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        }
    );

    // signer is the Session Wallet (instead of the Smart Account Owner Wallet)
    await addSignature(txRequest, sessionWallet);

	console.log(
		'Account token balance before batch transaction',
		ethers.utils.formatEther(await erc20Contract.balanceOf(address.account))
	);
    console.log(
		'Session wallet token balance before batch transaction',
		ethers.utils.formatEther(await erc20Contract.balanceOf(sessionWallet.address))
	);

    const txResponse = await provider.sendTransaction(utils.serialize(txRequest));
    const txReceipt = await txResponse.wait();

    console.log(
		'Account token balance after batch transaction',
		ethers.utils.formatEther(await erc20Contract.balanceOf(address.account))
	);
    console.log(
		'Session wallet token balance after batch transaction',
		ethers.utils.formatEther(await erc20Contract.balanceOf(sessionWallet.address))
	);

    console.log(`${txReceipt ? 'Successful ETH transfer via session' : 'Failed to transfer ETH via session'}`);
}
