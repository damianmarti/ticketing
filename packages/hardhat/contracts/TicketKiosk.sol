//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "./TicketMetadata.sol";

contract TicketKiosk is ERC721Enumerable, EIP712, Ownable {
  using ECDSA for bytes32;

  uint256 currentlyMinted;
  uint256 totalMint = 10000;

  uint256 public immutable price = 0.01 ether;

  mapping(uint256 => bool) admissions;

  event tokenAdmitted(uint256 tokenId, address holder);

  constructor() payable ERC721("Some Event Ticket", "SET") EIP712("Some Event Ticket", "0.0.1") {}

  function tokenURI(uint256 id) public view override returns (string memory) {
    require(_exists(id), "not exist");
    return TicketMetadata.tokenURI(id, generateSVGofTokenById(id));
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {
    string memory svg = string(
      abi.encodePacked(
        '<svg width="290" height="500" viewBox="0 0 290 500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
        renderTokenById(id),
        "</svg>"
      )
    );

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    return TicketMetadata.renderTicket(id);
  }

  function buyTicket() public payable returns (uint256 tokenId) {
    require(msg.value >= price, "Not enough ETH sent");
    require(balanceOf(msg.sender) < 1, "1 ticket allowed per address");
    require(currentlyMinted < totalMint, "Tickets are sold out");

    currentlyMinted += 1;
    tokenId = currentlyMinted;

    _mint(msg.sender, tokenId);
  }

  function admitHolder(uint256 tokenId, bytes memory signature) public onlyOwner {
    //
    bytes32 digest = _hashTypedDataV4(
      keccak256(abi.encode(keccak256("Checkin(address owner,uint256 tokenId)"), ownerOf(tokenId), tokenId))
    );
    address signer = digest.recover(signature);

    console.log("Signer Address", ownerOf(tokenId), signer, block.chainid);

    require(ownerOf(tokenId) == signer, "You do not own this ticket");
    require(!admissions[tokenId], "This ticket has been used for admission");

    admissions[tokenId] = true;

    emit tokenAdmitted(tokenId, msg.sender);
  }

  // to support receiving ETH by default
  receive() external payable {}

  fallback() external payable {}
}
