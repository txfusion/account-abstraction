import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Provider, Wallet, Contract } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { address } from '../utils/address';
import { ACCOUNT_OWNER_PRIVATE_KEY, SESSION_OWNER_ADDRESS } from '../utils/constants';

export default async function (hre: HardhatRuntimeEnvironment) {
    const provider = new Provider('http://localhost:3050', 270);
    const wallet = new Wallet(ACCOUNT_OWNER_PRIVATE_KEY, provider);
    const deployer = new Deployer(hre, wallet);

    const account = await deployer.loadArtifact('Account');

    const accountContract = new Contract(address.account, account.abi, wallet);

    const tx = await accountContract.deleteSession(SESSION_OWNER_ADDRESS);
    await tx.wait();

    console.log(`Session deleted.`);
}
