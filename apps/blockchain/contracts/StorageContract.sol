// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract StorageContract is Initializable, Ownable {

    struct Project {
        uint256 projectId;
        uint256 amount;
        address juniorAddress;
        address seniorAddress;
        address clientAddress;
        string ipfsHash;
    }

    struct Request {
        uint256 txId;
        bool approved;
        ProjectStatus status;
        uint256 amount;
        string ipfsHash;
    }

    enum ProjectStatus {
        Pending,
        Approved,
        Rejected
    }

    address factoryAddress;
    Project project;
    ProjectStatus status = ProjectStatus.Pending;
    mapping(address => bool) hasApproved;

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

    function approveRequest(uint256 _projectId, bytes signature) external {
        require(msg.sender == project.clientAddress 
                || msg.sender == project.seniorAddress, 
                "Unauthorized");
        hasApproved[msg.sender] = true;
        if (hasApproved[project.clientAddress] && hasApproved[project.seniorAddress]) {
            status = ProjectStatus.Approved;
            _mintNFT();
        }
    }

    function rejectRequest(uint256 _projectId, bytes signature) external {
        require(msg.sender == project.clientAddress 
                || msg.sender == project.seniorAddress, 
                "Unauthorized");
        status = ProjectStatus.Rejected;
    }

    function _mintNFT() internal {
        bytes memory payload = abi.encodeWithSignature("safeMint(uint256,address,string)", project.projectId, address(this), project.ipfsHash);
        (bool success, ) = address(factoryAddress).call(payload);
        require(success, "minting failed");
    }

    function getRequests(address) external view returns (Request[] memory) {
        Request[] memory requests = new Request[](1);
        requests[0] = Request(project.projectId, hasApproved[address], status, project.amount, project.ipfsHash);
        return requests;  
    }
}
