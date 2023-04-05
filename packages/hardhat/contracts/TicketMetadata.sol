//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

library TicketMetadata {
  using Strings for uint256;

  function tokenURI(uint256 id, string memory svg) public pure returns (string memory) {
    string memory name = string.concat("Ticket #", id.toString());
    string memory image = Base64.encode(bytes(svg));

    // TODO: add attributes

    return
      string.concat(
        "data:application/json;base64,",
        Base64.encode(
          bytes(
            string.concat(
              '{"name":"',
              name,
              '", "description":"',
              name,
              '", "external_url":"https://www.emotilon.com/emotilon/',
              id.toString(),
              '", "attributes": [{"trait_type": "Eyes Color", "value": "#',
              "FFFFFF",
              '"},{"trait_type": "Ears Color", "value": "#',
              "AAAAAA",
              '"}], "image": "',
              "data:image/svg+xml;base64,",
              image,
              '"}'
            )
          )
        )
      );
  }

  function renderTicket(uint256 id) public pure returns (string memory) {
    string memory render = string.concat(
      '<style type="text/css">',
      ".st0{fill:#629FFC;}",
      ".st1{fill:#A9CBFF;}",
      "</style>",
      "<defs>",
      '<filter id="f1">',
      '<feImage result="p0" xlink:href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjkwJyBoZWlnaHQ9JzUwMCcgdmlld0JveD0nMCAwIDI5MCA1MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzI5MHB4JyBoZWlnaHQ9JzUwMHB4JyBmaWxsPScjODM4NDNmJy8+PC9zdmc+"/>',
      '<feImage result="p1" xlink:href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjkwJyBoZWlnaHQ9JzUwMCcgdmlld0JveD0nMCAwIDI5MCA1MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGNpcmNsZSBjeD0nMTknIGN5PScyNzEnIHI9JzEyMHB4JyBmaWxsPScjYzAyYWFhJy8+PC9zdmc+"/>',
      '<feImage result="p2" xlink:href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjkwJyBoZWlnaHQ9JzUwMCcgdmlld0JveD0nMCAwIDI5MCA1MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGNpcmNsZSBjeD0nMTA0JyBjeT0nNDYyJyByPScxMjBweCcgZmlsbD0nIzkwMjJkOScvPjwvc3ZnPg=="/>',
      '<feImage result="p3" xlink:href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjkwJyBoZWlnaHQ9JzUwMCcgdmlld0JveD0nMCAwIDI5MCA1MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGNpcmNsZSBjeD0nMjU4JyBjeT0nNDQzJyByPScxMDBweCcgZmlsbD0nIzc1NmNjMicvPjwvc3ZnPg=="/>',
      '<feBlend mode="overlay" in="p0" in2="p1"/>',
      '<feBlend mode="exclusion" in2="p2"/>',
      '<feBlend mode="overlay" in2="p3" result="blendOut"/>',
      '<feGaussianBlur in="blendOut" stdDeviation="42"/>',
      "</filter>",
      '<clipPath id="corners">',
      '<rect width="290" height="500" rx="42" ry="42"/>',
      "</clipPath>",
      '<path id="text-path-a" d="M40 12 H250 A28 28 0 0 1 278 40 V460 A28 28 0 0 1 250 488 H40 A28 28 0 0 1 12 460 V40 A28 28 0 0 1 40 12 z"/>',
      '<path id="minimap" d="M234 444C234 457.949 242.21 463 253 463"/>',
      '<filter id="top-region-blur">',
      '<feGaussianBlur in="SourceGraphic" stdDeviation="24"/>',
      "</filter>",
      '<linearGradient id="grad-up" x1="1" x2="0" y1="1" y2="0">',
      '<stop offset="0.0" stop-color="white" stop-opacity="1"/>',
      '<stop offset=".9" stop-color="white" stop-opacity="0"/>',
      "</linearGradient>",
      '<linearGradient id="grad-down" x1="0" x2="1" y1="0" y2="1">',
      '<stop offset="0.0" stop-color="white" stop-opacity="1"/>',
      '<stop offset="0.9" stop-color="white" stop-opacity="0"/>',
      "</linearGradient>",
      '<mask id="fade-up" maskContentUnits="objectBoundingBox">',
      '<rect width="1" height="1" fill="url(#grad-up)"/>',
      "</mask>",
      '<mask id="fade-down" maskContentUnits="objectBoundingBox">',
      '<rect width="1" height="1" fill="url(#grad-down)"/>',
      "</mask>",
      '<mask id="none" maskContentUnits="objectBoundingBox">',
      '<rect width="1" height="1" fill="white"/>',
      "</mask>",
      '<linearGradient id="grad-symbol">',
      '<stop offset="0.7" stop-color="white" stop-opacity="1"/>',
      '<stop offset=".95" stop-color="white" stop-opacity="0"/>',
      "</linearGradient>",
      '<mask id="fade-symbol" maskContentUnits="userSpaceOnUse">',
      '<rect width="290px" height="200px" fill="url(#grad-symbol)"/>',
      "</mask>",
      "</defs>",
      '<g clip-path="url(#corners)">',
      '<rect fill="83843f" x="0px" y="0px" width="290px" height="500px"/>',
      '<rect style="filter: url(#f1)" x="0px" y="0px" width="290px" height="500px"/>',
      '<g style="filter:url(#top-region-blur); transform:scale(1.5); transform-origin:center top;">',
      '<rect fill="none" x="0px" y="0px" width="290px" height="500px"/>',
      '<ellipse cx="50%" cy="0px" rx="180px" ry="120px" fill="#000" opacity="0.85"/>',
      "</g>",
      '<rect x="0" y="0" width="290" height="500" rx="42" ry="42" fill="rgba(0,0,0,0)" stroke="rgba(255,255,255,0.2)"/>',
      "</g>",
      '<text text-rendering="optimizeSpeed">',
      '<textPath startOffset="-100%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
      "EVENTO \u25CF 2023-01-01",
      '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite"/>',
      "</textPath>",
      '<textPath startOffset="0%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
      "EVENTO \u25CF 2023-01-01",
      '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite"/>',
      "</textPath>",
      '<textPath startOffset="50%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
      "0x83843fb626e4349f6c51e335352d4860189022d9 \u25CF 0.1 ETH",
      '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite"/>',
      "</textPath>",
      '<textPath startOffset="-50%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
      "0x83843fb626e4349f6c51e335352d4860189022d9 \u25CF 0.1 ETH",
      '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite"/>',
      "</textPath>",
      "</text>",
      '<g mask="url(#fade-symbol)">',
      '<rect fill="none" x="0px" y="0px" width="290px" height="200px"/>',
      '<text y="70px" x="32px" fill="white" font-family="\'Courier New\', monospace" font-weight="200" font-size="36px">EVENTO</text>',
      '<text y="115px" x="32px" fill="white" font-family="\'Courier New\', monospace" font-weight="200" font-size="36px">2023-01-01</text>',
      "</g>",
      '<rect x="16" y="16" width="258" height="468" rx="26" ry="26" fill="rgba(0,0,0,0)" stroke="rgba(255,255,255,0.2)"/>',
      '<g style="transform:translate(480px, 0px)">',
      '<path class="st0" d="M-339.5,279.9v-40.7c0-0.8-0.6-1.4-1.4-1.4c-0.8,0-1.4,0.6-1.4,1.4v40.7c0,0.8,0.6,1.4,1.4,1.4',
      'C-340.1,281.3-339.5,280.7-339.5,279.9z"/>',
      '<path class="st0" d="M-354.2,319.2l-11.9-22.3v-20.3h7.5v10.2h10.9v-10.2h7V319L-354.2,319.2z"/>',
      '<path class="st1" d="M-327.1,319.2l11.9-22.3v-20.3h-7.6v10.2h-10.9v-10.2h-7V319L-327.1,319.2z"/>',
      '<path class="st0" d="M-340.6,240c3,0,5.9,5.8,9.3,6.6c3.4,0.9,5-1.9,9.9-1.4c4.4,0.5,3.9,6.5,11.4,7c-2.7,1.9-6.4,4.6-12.2,4',
      'c-4.4-0.4-5.6-3.3-10.5-2.2c-4.9,1-6,4.1-7.9,4.6C-340.6,249.3-340.6,240-340.6,240z"/>',
      "</g>",
      '<g style="transform:translate(29px, 384px)">',
      '<rect width="98px" height="26px" rx="8px" ry="8px" fill="rgba(0,0,0,0.6)"/>',
      '<text x="12px" y="17px" font-family="\'Courier New\', monospace" font-size="12px" fill="white"><tspan fill="rgba(255,255,255,0.6)">ID: </tspan>',
      id.toString(),
      "</text>",
      "</g>",
      '<g style="transform:translate(29px, 414px)">',
      '<rect width="140px" height="26px" rx="8px" ry="8px" fill="rgba(0,0,0,0.6)"/>',
      '<text x="12px" y="17px" font-family="\'Courier New\', monospace" font-size="12px" fill="white"><tspan fill="rgba(255,255,255,0.6)">Section: </tspan>2</text>',
      "</g>",
      '<g style="transform:translate(29px, 444px)">',
      '<rect width="140px" height="26px" rx="8px" ry="8px" fill="rgba(0,0,0,0.6)"/>',
      '<text x="12px" y="17px" font-family="\'Courier New\', monospace" font-size="12px" fill="white"><tspan fill="rgba(255,255,255,0.6)">Seat: </tspan>102</text>',
      "</g>"
    );

    return render;
  }
}
