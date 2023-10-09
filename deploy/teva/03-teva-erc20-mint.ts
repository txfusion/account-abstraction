import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { EIP712Signer, Provider, Wallet, types, utils } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { deployAccount, deployContract } from "../utils/deployment";
import { ACCOUNT_OWNER_PRIVATE_KEY } from "../utils/constants";
import { MyERC20__factory } from "../../typechain";
import { addSignature } from "../utils/multicall";

const MINT_AMOUNT = ethers.utils.parseEther("1");
const ERC20_ADDR = "0x38618fE7A3eCd38fcD86a580d9352c2A58123f0F";
const CUSTOM_ACCOUNT_ADDRESS = "0x7fC87934f619C8503eDDbF243D94d201BC973428";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log("Teva mint");

  const provider = new Provider("http://localhost:3050", 270);
  const wallet = new Wallet(ACCOUNT_OWNER_PRIVATE_KEY, provider);

  const erc20 = MyERC20__factory.connect(ERC20_ADDR, wallet);

  const aaTx: types.TransactionRequest = {
    from: CUSTOM_ACCOUNT_ADDRESS,
    to: ERC20_ADDR,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(CUSTOM_ACCOUNT_ADDRESS),
    type: 113,
    customData: {
      ergsPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    } as types.Eip712Meta,
    value: 0, // Price
    data: erc20.interface.encodeFunctionData("mint", [
      CUSTOM_ACCOUNT_ADDRESS,
      MINT_AMOUNT,
    ]),
  };

  aaTx.gasLimit = "3500000";
  aaTx.gasPrice = await provider.getGasPrice();

  const signedTxHash = EIP712Signer.getSignedDigest(aaTx);

  const signature = ethers.utils.joinSignature(
    wallet._signingKey().signDigest(signedTxHash)
  );

  aaTx.customData = {
    ...aaTx.customData,
    customSignature: signature,
  };

  const sentTx = await provider.sendTransaction(utils.serialize(aaTx));

  const txWait = await sentTx.wait();

  console.log("Status", txWait.status);
  console.log("=============================================");
  const balance = await erc20.balanceOf(CUSTOM_ACCOUNT_ADDRESS);

  console.log("ACC BALANCE:", ethers.utils.formatEther(balance));
}
