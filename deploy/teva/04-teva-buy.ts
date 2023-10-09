import * as ethers from "ethers";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { EIP712Signer, Provider, Wallet, types, utils } from "zksync-web3";
import { ACCOUNT_OWNER_PRIVATE_KEY } from "../utils/constants";
import { KarmaPointV2__factory } from "../../typechain";

const MINT_AMOUNT = 100;

const CONTRACTS_KARMA_NFT_ADDR = "0x14DefD7344653c01a7EC2fa92eF5D678f8cF0Be9";
// our acc: 0xDc71B91aaD17F9DF286D54B5dfF66372707B8C7d
const CUSTOM_ACCOUNT_ADDRESS = "0x558ebD3021bC1E917DA392Fc95fbF3fC3bd89aa8";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log("Teva buy");

  const provider = new Provider("http://localhost:3050", 270);
  const wallet = new Wallet(ACCOUNT_OWNER_PRIVATE_KEY, provider);
  const deployer = new Deployer(hre, wallet);

  const KarmaContract = KarmaPointV2__factory.connect(
    CONTRACTS_KARMA_NFT_ADDR,
    deployer.zkWallet
  );

  console.log("Whitelisting addresses to call *buyForAddress*");

  const whitelistTx = await KarmaContract.whitelistCallers([
    CUSTOM_ACCOUNT_ADDRESS,
    deployer.zkWallet.address,
  ]);

  const whitelistTxStatus = await whitelistTx.wait();

  if (whitelistTxStatus.status != 1) {
    console.log("Failed to whitelist address");
    return;
  }

  console.log("Addresses are whitelisted");

  console.log(
    "Balance of custom acc:",
    ethers.utils.formatEther(await provider.getBalance(CUSTOM_ACCOUNT_ADDRESS))
  );

  const isWhiteListed = await KarmaContract.whitelistedCallers(
    CUSTOM_ACCOUNT_ADDRESS
  );

  console.log("Is caller whitelisted:", isWhiteListed);

  const priceToPayForTokens = await KarmaContract.getPrice(MINT_AMOUNT);
  console.log(
    "priceToPayForTokens:",
    ethers.utils.formatEther(priceToPayForTokens)
  );

  const tokenPrice = await KarmaContract.price();

  console.log(
    "KarmaContract token price:",
    ethers.utils.formatEther(tokenPrice)
  );

  const aaTx: types.TransactionRequest = {
    from: CUSTOM_ACCOUNT_ADDRESS,
    to: CONTRACTS_KARMA_NFT_ADDR,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(CUSTOM_ACCOUNT_ADDRESS),
    type: 113,
    customData: {
      ergsPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    } as types.Eip712Meta,
    value: ethers.utils.formatUnits(priceToPayForTokens, "wei"), // Price
    data: KarmaContract.interface.encodeFunctionData("buyForAddress", [
      CUSTOM_ACCOUNT_ADDRESS,
      MINT_AMOUNT,
    ]),
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
  const balance = await KarmaContract.balanceOf(CUSTOM_ACCOUNT_ADDRESS);

  console.log("ACCOUNT KARMA BALANCE:", ethers.utils.formatEther(balance));
}
