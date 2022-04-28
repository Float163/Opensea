// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract mERC1155 is ERC1155, Ownable {
    constructor(string memory _uri) ERC1155(_uri) {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function uri(uint256 _tokenId) override public view returns (string memory) {
        return string(abi.encodePacked(super.uri(_tokenId), Strings.toString(_tokenId)));
    }

    function tokenURI(uint256 _tokenId) public view returns (string memory) {
        return string(abi.encodePacked(super.uri(_tokenId), Strings.toString(_tokenId)));
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }
}