// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./StorageContract.sol";

contract FactoryContract is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _projectIdCounter;
    address implementation;
    address[] public projects;

    constructor() ERC721("SynthWork", "SNWK") {
        implementation = address(new StorageContract());
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
        _projectIdCounter.increment();
    }

    function safeMint(uint256 tokenId, address to, string memory uri) public onlyOwner {
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
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
