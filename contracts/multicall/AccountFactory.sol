//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";

/**
@title Factory Contract that deploys Account contract
@author Porco Rosso<porcorossoj89@gmail.com>
@notice This is a factory contract that deploys Account contract, which also passes deployed addresses to AccountRegistry contract.

*/

contract AccountFactory {
    bytes32 public immutable accountBytecodeHash;

    constructor(bytes32 _accountBytecodeHash) {
        accountBytecodeHash = _accountBytecodeHash;
    }

    /**
    @notice this function deploys an Account contract and passes deployed address to AccountRegistry.
    @param salt arbitrary hash to pass create2Account metho
    @param owner signer address of the deployed account
    @return accountAddress deployed Account contract address
     */
    function deployAccount(
        bytes32 salt,
        address owner
    ) external returns (address accountAddress) {
        (bool success, bytes memory returnData) = SystemContractsCaller
            .systemCallWithReturndata(
                uint32(gasleft()),
                address(DEPLOYER_SYSTEM_CONTRACT),
                uint128(0),
                abi.encodeCall(
                    DEPLOYER_SYSTEM_CONTRACT.create2Account,
                    (
                        salt,
                        accountBytecodeHash,
                        abi.encode(owner),
                        IContractDeployer.AccountAbstractionVersion.Version1
                    )
                )
            );
        require(success, "Deployment Failed");
        accountAddress = abi.decode(returnData, (address));
    }
}
