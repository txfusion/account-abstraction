import * as ethers from "ethers";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { EIP712Signer, Provider, Wallet, types, utils } from "zksync-web3";
import { ACCOUNT_OWNER_PRIVATE_KEY } from "../utils/constants";

const AMOUNT = ethers.utils.parseEther("0.001");

const RECEIVER = "0xDc71B91aaD17F9DF286D54B5dfF66372707B8C7d";
const CUSTOM_ACCOUNT_ADDRESS = "0x30f41889f2C1659A99d76Bdd3EDA3577f5a2a4a2";
// const CUSTOM_ACCOUNT_ADDRESS = "0x558ebD3021bC1E917DA392Fc95fbF3fC3bd89aa8"; working!!!

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log("Teva transfer");

  const provider = new Provider("http://localhost:3050", 270);
  const wallet = new Wallet(ACCOUNT_OWNER_PRIVATE_KEY, provider);
  const deployer = new Deployer(hre, wallet);

  const accBalanceBefore = await provider.getBalance(RECEIVER);

  const aaTx: types.TransactionRequest = {
    from: CUSTOM_ACCOUNT_ADDRESS,
    to: RECEIVER,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(CUSTOM_ACCOUNT_ADDRESS),
    type: 113,
    customData: {
      ergsPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    } as types.Eip712Meta,
    value: AMOUNT,
    data: new Uint8Array(),
  };

  aaTx.gasLimit = "10000000";
  aaTx.gasPrice = await provider.getGasPrice();

  const signedTxHash = EIP712Signer.getSignedDigest(aaTx);

  const signature = ethers.utils.joinSignature(
    deployer.zkWallet._signingKey().signDigest(signedTxHash)
  );

  aaTx.customData = {
    ...aaTx.customData,
    customSignature: signature,
  };
  try {
    const sentTx = await provider.sendTransaction(utils.serialize(aaTx));

    const txWait = await sentTx.wait();

    console.log("Status", txWait.status);
  } catch (e: any) {
    console.log(e);
    console.log(
      "ERR, sent value:",
      ethers.utils.formatEther(e.transaction.value)
    );
    console.log("ERR", e.transaction);
  }
  console.log("=============================================");

  const accBalanceAfter = await provider.getBalance(RECEIVER);
  const isBalanceIncreased = accBalanceAfter.sub(accBalanceBefore).eq(AMOUNT);

  console.log("isBalanceIncreased", isBalanceIncreased);
}
