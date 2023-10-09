import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { Wallet, utils } from "zksync-web3";
import * as hre from "hardhat";
import { ACCOUNT_OWNER_PRIVATE_KEY } from "../utils/constants";
import { ethers } from "ethers";

const PRICE = 12000000000000;

async function main() {
  console.info("Deploying Citizen NFT");

  const zkWallet = new Wallet(ACCOUNT_OWNER_PRIVATE_KEY);
  const deployer = new Deployer(hre, zkWallet);

  const CitizenIDV1Artifact = await deployer.loadArtifact("CitizenIDV1");

  const citizenContract = await hre.zkUpgrades.deployProxy(
    deployer.zkWallet,
    CitizenIDV1Artifact,
    ["", PRICE],
    { initializer: "initialize", unsafeAllow: ["state-variable-assignment"] }
  );

  await citizenContract.deployed();

  console.log(`CONTRACTS_CITIZEN_NFT_ADDR=${citizenContract.address}`);

  console.log("=============================================");
  console.info("Deploying KarmaPoint NFT");

  const KarmaPointV2Artifact = await deployer.loadArtifact("KarmaPointV2");

  const karmaContract = await hre.zkUpgrades.deployProxy(
    deployer.zkWallet,
    KarmaPointV2Artifact,
    [
      citizenContract.address,
      ethers.constants.AddressZero,
      PRICE,
      ethers.constants.MaxUint256,
      ethers.constants.MaxUint256,
    ],
    { initializer: "initialize", unsafeAllow: ["state-variable-assignment"] }
  );

  await karmaContract.deployed();

  console.log(`CONTRACTS_KARMA_NFT_ADDR=${karmaContract.address}`);
}

main().catch((error) => {
  throw error;
});
