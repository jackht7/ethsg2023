// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract StorageContract is Initializable, Ownable {

    struct Project {
        uint256 projectId;
        uint256 amount;
        address juniorAddress;
        address seniorAddress;
        address clientAddress;
        string ipfsHash;
    }

    address factoryAddress;
    Project project;

    constructor() {
      _disableInitializers();
    }

    function initialize(
        uint256 _projectId,
        uint256 _amount,
        address _juniorAddress,
        address _seniorAddress,
        address _clientAddress,
        address _factoryAddress,
        string calldata _ipfsHash
    ) 
        external 
        initializer
    {
        project = Project(_projectId, _amount, _juniorAddress, _seniorAddress, _clientAddress, _ipfsHash);
        factoryAddress = _factoryAddress;
    }
}
