// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./StorageContract.sol";

contract FactoryContract is ERC721, ERC721URIStorage, AccessControl, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _projectIdCounter;
    address public immutable implementation;
    address[] public projects;
    mapping(uint256 => address[3]) projectMembers;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC721("SynthWork", "SNWK") {
        implementation = address(new StorageContract());
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function createProject(
        uint256 amount,
        address seniorAddress,
        address clientAddress,
        string calldata ipfsHash
    )   external {
        uint256 projectId = _projectIdCounter.current();
        address projectAddress = Clones.clone(implementation);
        StorageContract(projectAddress).initialize(
            projectId,
            amount,
            msg.sender,
            seniorAddress,
            clientAddress,
            address(this),
            ipfsHash
        );
        projects.push(projectAddress);
        projectMembers[projectId] = [msg.sender, seniorAddress, clientAddress];
        _projectIdCounter.increment();
        _grantRole(MINTER_ROLE, projectAddress);
    }

    function safeMint(uint256 tokenId, address to, string memory uri) public onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getProjectsOfUser(address user)
        public
        view
        returns (address[] memory)
    {
        uint256 i = 0;
        for (uint256 j = 0; j < projects.length; j++) {
            if (projectMembers[j][0] == user
                || projectMembers[j][1] == user
                || projectMembers[j][2] == user) {
                i++;
            }
        }
        address[] memory userProjects = new address[](i);
        uint256 k = 0;
        for (uint256 j = 0; j < projects.length; j++) {
            if (projectMembers[j][0] == user
                || projectMembers[j][1] == user
                || projectMembers[j][2] == user) {
                userProjects[k] = projects[j];
                k++;
            }
        }
        return userProjects;
    }
}
