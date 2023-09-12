// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@pendle/core-v2/contracts/interfaces/IPRouterHelper.sol";
import "@pendle/core-v2/contracts/interfaces/IPMarket.sol";

error InvalidApproval();

contract StorageContract is Initializable, Ownable, ERC721Holder {
    struct Project {
        uint256 projectId;
        uint256 amount;
        address juniorAddress;
        address creatorAddress;
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

    address public factoryAddress;
    Project public project;
    ProjectStatus public status = ProjectStatus.Pending;
    mapping(address => bool) hasApproved;

    address public USD = 0x81B584d90e0121f5fD38F14637eC4dA7028Bd59e;
    address public USDSY = 0xf0192BdCbCf20fFfc868dDED247855fde8a2b0BF;
    IPRouterHelper public pendleRouter;
    IPMarket public pendleMarket;

    constructor() {
        _disableInitializers();
        pendleRouter = IPRouterHelper(0xA1f02dba3cc90e22cc391D70Ad5f0E5b68E8feE9);
        pendleMarket = IPMarket(0xA1f02dba3cc90e22cc391D70Ad5f0E5b68E8feE9);
    }

    modifier validForRejection(uint256 _projectId) {
        require(_projectId == project.projectId, "Invalid project id");
        require(status == ProjectStatus.Pending, "Project is not pending");
        require(msg.sender == project.clientAddress || msg.sender == project.creatorAddress, "Unauthorized");
        require(!hasApproved[msg.sender], "Already approved");
        _;
    }

    modifier validForCreatorApproval(uint256 _projectId) {
        require(_projectId == project.projectId, "Invalid project id");
        require(status == ProjectStatus.Pending, "Project is not pending");
        require(msg.sender == project.creatorAddress, "Unauthorized");
        require(!hasApproved[msg.sender], "Already approved");
        _;
    }

    modifier validForClientApproval(uint256 _projectId) {
        require(_projectId == project.projectId, "Invalid project id");
        require(status == ProjectStatus.Pending, "Project is not pending");
        require(msg.sender == project.clientAddress, "Unauthorized");
        require(!hasApproved[msg.sender], "Already approved");
        _;
    }

    function initialize(
        uint256 _projectId,
        uint256 _amount,
        address _juniorAddress,
        address _creatorAddress,
        address _clientAddress,
        address _factoryAddress,
        string calldata _ipfsHash
    ) external initializer {
        project = Project(_projectId, _amount, _juniorAddress, _creatorAddress, _clientAddress, _ipfsHash);
        factoryAddress = _factoryAddress;
    }

    function establishServiceAgreement(uint256 _projectId) external validForClientApproval(_projectId) {
        // Client's deposit transfer to Yield protocol: Pendle, Spark
        pendleRouter.mintSyFromToken(
            address(this),
            USDSY,
            TokenInput(USD, project.amount, USD, address(0), address(0), SwapData(SwapType.NONE, address(0), "", false))
        );
    }

    function creatorApprove(uint256 _projectId) external validForCreatorApproval(_projectId) {
        hasApproved[msg.sender] = true;
    }

    function clientApprove(uint256 _projectId) external validForRejection(_projectId) {
        // Verify creator's PoW and sign
        // Release fund to creator
        // Earn part of yield
        // Transfer yield balance to protocol
    }

    function protocol(uint256 _projectId) external {
        // Bounty hunter submit proof and protocol sign
        // Release fund to creator
        // Take yield and distribute to bounty hunter
    }

    function rejectRequest(uint256 _projectId) external validForRejection(_projectId) {
        status = ProjectStatus.Rejected;
    }

    function _mintNFT() internal {
        bytes memory payload = abi.encodeWithSignature(
            "safeMint(uint256,address,string)", project.projectId, address(this), project.ipfsHash
        );
        (bool success,) = address(factoryAddress).call(payload);
        require(success, "minting failed");
    }

    function getRequests(address _user) external view returns (Request[] memory) {
        Request[] memory requests = new Request[](1);
        requests[0] = Request(project.projectId, hasApproved[_user], status, project.amount, project.ipfsHash);
        return requests;
    }
}
