//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "./TicketMetadata.sol";

contract TicketKiosk is ERC721Enumerable, EIP712, Ownable {
  event EventAdded(uint256 indexed eventId, string indexed name, address indexed owner);
  event ShowAdded(uint256 indexed eventId, string indexed name);
  event SectionAdded(
    uint256 indexed eventId,
    string indexed showName,
    string indexed name,
    uint256 totalSeats,
    uint256 price
  );
  event SeatBooked(uint256 indexed eventId, string indexed showName, string indexed sectionName, uint256 seatId);

  using ECDSA for bytes32;

  uint256 public currentlyMinted;
  uint256 public eventCount;
  uint256 public defaultPlataformEventFee = 0.1 ether;
  uint256 public defaultPlataformFee = 5; // 5% service fee
  uint256 totalMint = 10000;

  uint256 public immutable price = 0.01 ether;

  // TODO: allow rows and seats to be configurable

  struct Section {
    string name;
    uint256 totalSeats;
    uint256 price;
    uint256 totalBookedSeats;
    mapping(uint256 => bool) bookedSeats;
  }

  struct Show {
    string name;
    string[] nameSections;
    mapping(string => Section) sections;
  }

  struct Event {
    string name;
    string[] nameShows;
    mapping(string => Show) shows;
    uint256 totalSeats;
    uint256 totalBookedSeats;
    uint256 amountRaised;
    uint256 plataformFee;
    address owner;
  }

  struct SectionInfo {
    string name;
    uint256 totalSeats;
    uint256 price;
    uint256[] bookedSeats;
  }

  struct ShowInfo {
    string name;
    SectionInfo[] sections;
  }

  struct EventInfo {
    string name;
    ShowInfo[] shows;
    uint256 totalSeats;
    uint256 totalBookedSeats;
    uint256 amountRaised;
    uint256 plataformFee;
    address owner;
  }

  struct Ticket {
    uint256 eventId;
    string showName;
    string sectionName;
    uint256 seatId;
    uint256 price;
  }

  mapping(uint256 => Event) events;

  mapping(uint256 => Ticket) tickets;

  mapping(uint256 => bool) admissions;

  event tokenAdmitted(uint256 tokenId, address holder);

  // eventos -> { name, sections(seats, price), shows(date, time)}

  modifier onlyEventOwner(uint256 eventId) {
    require(events[eventId].owner == msg.sender, "ONLY EVENT OWNER");
    _;
  }

  constructor() payable ERC721("Some Event Ticket", "SET") EIP712("Some Event Ticket", "0.0.1") {}

  function addEvent(string memory _name) public payable returns (uint256) {
    require(msg.value >= defaultPlataformEventFee, "Not enough ETH sent");

    eventCount += 1;

    events[eventCount].name = _name;
    events[eventCount].owner = msg.sender;
    events[eventCount].plataformFee = defaultPlataformFee;

    emit EventAdded(eventCount, _name, msg.sender);

    return eventCount;
  }

  function addShow(uint256 eventId, string memory _name) public onlyEventOwner(eventId) {
    require(bytes(events[eventId].name).length > 0, "Event does not exist");
    require(bytes(events[eventId].shows[_name].name).length == 0, "Show already exists");

    events[eventId].nameShows.push(_name);
    events[eventId].shows[_name].name = _name;

    emit ShowAdded(eventId, _name);
  }

  function addSection(
    uint256 eventId,
    string memory _showName,
    string memory _name,
    uint256 _totalSeats,
    uint256 _price
  ) public onlyEventOwner(eventId) {
    require(bytes(events[eventId].name).length > 0, "Event does not exist");
    require(bytes(events[eventId].shows[_showName].name).length > 0, "Show does not exist");
    require(bytes(events[eventId].shows[_showName].sections[_name].name).length == 0, "Section already exists");

    events[eventId].shows[_showName].nameSections.push(_name);
    events[eventId].shows[_showName].sections[_name].name = _name;
    events[eventId].shows[_showName].sections[_name].totalSeats = _totalSeats;
    events[eventId].shows[_showName].sections[_name].price = _price;
    events[eventId].totalSeats += _totalSeats;

    emit SectionAdded(eventId, _showName, _name, _totalSeats, _price);
  }

  function eventName(uint256 eventId) public view returns (string memory) {
    return events[eventId].name;
  }

  function eventInfo(uint256 eventId) public view returns (EventInfo memory) {
    EventInfo memory eventInfo;

    eventInfo.name = events[eventId].name;
    eventInfo.totalSeats = events[eventId].totalSeats;
    eventInfo.totalBookedSeats = events[eventId].totalBookedSeats;
    eventInfo.amountRaised = events[eventId].amountRaised;
    eventInfo.plataformFee = events[eventId].plataformFee;
    eventInfo.owner = events[eventId].owner;
    eventInfo.shows = new ShowInfo[](events[eventId].nameShows.length);
    for (uint256 i = 0; i < events[eventId].nameShows.length; i++) {
      eventInfo.shows[i].name = events[eventId].nameShows[i];
      eventInfo.shows[i].sections = new SectionInfo[](
        events[eventId].shows[events[eventId].nameShows[i]].nameSections.length
      );
      for (uint256 j = 0; j < events[eventId].shows[events[eventId].nameShows[i]].nameSections.length; j++) {
        eventInfo.shows[i].sections[j].name = events[eventId].shows[events[eventId].nameShows[i]].nameSections[j];
        eventInfo.shows[i].sections[j].totalSeats = events[eventId]
          .shows[events[eventId].nameShows[i]]
          .sections[events[eventId].shows[events[eventId].nameShows[i]].nameSections[j]]
          .totalSeats;
        eventInfo.shows[i].sections[j].price = events[eventId]
          .shows[events[eventId].nameShows[i]]
          .sections[events[eventId].shows[events[eventId].nameShows[i]].nameSections[j]]
          .price;
        eventInfo.shows[i].sections[j].bookedSeats = new uint256[](
          events[eventId]
            .shows[events[eventId].nameShows[i]]
            .sections[events[eventId].shows[events[eventId].nameShows[i]].nameSections[j]]
            .totalBookedSeats
        );
        uint256 k = 0;
        for (
          uint256 l = 0;
          l <
          events[eventId]
            .shows[events[eventId].nameShows[i]]
            .sections[events[eventId].shows[events[eventId].nameShows[i]].nameSections[j]]
            .totalSeats;
          l++
        ) {
          if (
            events[eventId]
              .shows[events[eventId].nameShows[i]]
              .sections[events[eventId].shows[events[eventId].nameShows[i]].nameSections[j]]
              .bookedSeats[l]
          ) {
            eventInfo.shows[i].sections[j].bookedSeats[k] = l;
            k++;
          }
        }
      }
    }

    return eventInfo;
  }

  function buyTicket2(
    uint256 eventId,
    string memory showName,
    string memory sectionName,
    uint256 seatId
  ) public payable returns (uint256 tokenId) {
    // require(msg.value >= price, "Not enough ETH sent");
    // require(balanceOf(msg.sender) < 1, "1 ticket allowed per address");
    // require(currentlyMinted < totalMint, "Tickets are sold out");
    require(bytes(events[eventId].name).length > 0, "Event does not exist");
    require(bytes(events[eventId].shows[showName].name).length > 0, "Show does not exist");
    require(bytes(events[eventId].shows[showName].sections[sectionName].name).length > 0, "Section does not exist");

    Event storage event_ = events[eventId];
    Show storage show = event_.shows[showName];
    Section storage section = show.sections[sectionName];

    require(seatId <= section.totalSeats, "Seat does not exist");
    require(!section.bookedSeats[seatId], "Seat already booked");
    require(msg.value >= section.price, "Not enough ETH sent");

    section.bookedSeats[seatId] = true;
    event_.totalBookedSeats += 1;
    section.totalBookedSeats += 1;

    // uint256 plataformFee = event_.plataformFee;
    // uint256 plataformFeeAmount = (msg.value * plataformFee) / 100;
    // payable(owner()).transfer(plataformFeeAmount);
    // payable(event_.owner).transfer(msg.value - plataformFeeAmount);

    event_.amountRaised += msg.value;

    currentlyMinted += 1;
    tokenId = currentlyMinted;

    _mint(msg.sender, tokenId);

    tickets[tokenId] = Ticket(eventId, showName, sectionName, seatId, section.price);

    emit SeatBooked(eventId, showName, sectionName, seatId);

    return tokenId;
  }

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
    string memory ticketEventName = events[tickets[id].eventId].name;
    string memory showName = tickets[id].showName;
    string memory sectionName = tickets[id].sectionName;
    uint256 seatId = tickets[id].seatId;

    return
      TicketMetadata.renderTicket(id, ticketEventName, showName, sectionName, seatId, tickets[id].price, ownerOf(id));
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
