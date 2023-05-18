// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Session is Ownable {
    bytes4 private constant ERC20_TRANSFER = bytes4(keccak256(bytes("transfer(address,uint256)")));
    bytes4 private constant ERC20_APPROVE = bytes4(keccak256(bytes("approve(address,uint256)")));
    bytes4 private constant ERC20_TRANSFER_FROM = bytes4(keccak256(bytes("transferFrom(address,address,uint256)")));

    struct SessionInfo {
        uint256 id;
        mapping(address => uint256) spenders;
        bool restrictedBySpenders;
        bool initiated;
        bool expired;
        uint256 endTime;
    }

    mapping(address => SessionInfo) private sessions;
    uint256 private sessionCount;

    uint256 private constant SESSION_DURATION = 1 minutes; // Adjust as needed

    event SessionCreated(address indexed signer, uint256 indexed id);
    event SessionExpired(address indexed signer, uint256 indexed id);

    function createSession(address signer, address[] memory newSpenders) external onlyOwner returns (uint256) {
        sessionCount++;
        sessions[signer].id = sessionCount;
        sessions[signer].expired = false;
        sessions[signer].initiated = true;
        sessions[signer].endTime = block.timestamp + SESSION_DURATION;

        if (newSpenders.length > 0) {
            sessions[signer].restrictedBySpenders = true;

            for (uint256 i = 0; i < newSpenders.length; i++) {
                sessions[signer].spenders[newSpenders[i]] = sessionCount;
            }
        }

        emit SessionCreated(signer, sessionCount);
        return sessionCount;
    }

    function deleteSession(address signer) external onlyOwner {
        sessions[signer].expired = true;
        emit SessionExpired(signer, sessions[signer].id);
    }

    function isActiveSession(address signer, address to, bytes memory data) internal view returns (bool) {
        if (sessions[signer].expired || !sessions[signer].initiated || block.timestamp >= sessions[signer].endTime) {
            return false;
        }

        if (!sessions[signer].restrictedBySpenders) {
            return true;
        }

        address spender = getSpender(to, data);
        return sessions[signer].spenders[spender] == sessions[signer].id;
    }

     function isSpender(address sessionSigner, address spender) public view returns (bool) {
        uint256 sessionId = sessions[sessionSigner].spenders[spender];
        return sessionId > 0 && sessionId == sessions[sessionSigner].id;
    }

    function getSpender(address _to, bytes memory _data) internal pure returns (address spender) {
        if (_data.length >= 68) {
            bytes4 methodId;
            assembly {
                methodId := mload(add(_data, 0x20))
            }

            if (
                methodId == ERC20_TRANSFER ||
                methodId == ERC20_APPROVE
            ) {
                assembly {
                    spender := mload(add(_data, 0x24))
                }
            } else if (methodId == ERC20_TRANSFER_FROM) {
                assembly {
                    spender := mload(add(_data, 0x44))
                }
            } else {
                spender = _to;
            }
        }
    }
}
