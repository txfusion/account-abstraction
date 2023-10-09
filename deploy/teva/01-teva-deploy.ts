import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Wallet } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { deployAccount, deployContract } from "../utils/deployment";
import { ACCOUNT_OWNER_PRIVATE_KEY } from "../utils/constants";
const MINT_AMOUNT = ethers.utils.parseEther("10");

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log("Teva deploy");

  const wallet = new Wallet(ACCOUNT_OWNER_PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);

  await deployContract(deployer, "MyERC20", [18]);

  const acc = await deployAccount(
    deployer,
    "SessionAccountFactory",
    "SessionAccount"
  );

  // Supplying paymaster with ETH
  await (
    await deployer.zkWallet.sendTransaction({
      to: acc.address,
      value: MINT_AMOUNT,
    })
  ).wait();

  console.log(`Deployment completed!`);
}
