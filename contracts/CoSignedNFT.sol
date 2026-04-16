// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title CoSignedNFT
 * @notice Soulbound (non-transferable) NFT credential for CoSigned mentorship Bonds.
 *         Implements ERC-5192 - the minimal soulbound token standard.
 *         Two token types: LEARNER_PROOF and MENTOR_PROOF.
 *         Only the CoSigned core contract can mint tokens.
 */
contract CoSignedNFT is ERC721URIStorage {

    // -------------------------------------------------------------------------
    // ERC-5192
    // -------------------------------------------------------------------------

    bytes4 private constant _INTERFACE_ID_ERC5192 = 0xb45a3c0e;

    event Locked(uint256 tokenId);
    event Unlocked(uint256 tokenId);

    // -------------------------------------------------------------------------
    // ENUMS & STATE
    // -------------------------------------------------------------------------

    enum TokenType { LEARNER_PROOF, MENTOR_PROOF }

    address public immutable cosignedContract;
    uint256 private _tokenIdCounter;
    mapping(uint256 => TokenType) public tokenTypes;

    // -------------------------------------------------------------------------
    // CONSTRUCTOR
    // -------------------------------------------------------------------------

    constructor(address _cosignedContract) ERC721("CoSigned Credential", "COSIGN") {
        require(_cosignedContract != address(0), "CoSignedNFT: invalid CoSigned address");
        cosignedContract = _cosignedContract;
    }

    // -------------------------------------------------------------------------
    // MINT
    // -------------------------------------------------------------------------

    /**
     * @notice Mints a soulbound credential NFT to a recipient.
     * @dev Only callable by the CoSigned core contract.
     *      Emits Locked(tokenId) as required by ERC-5192.
     */
    function mint(
        address to,
        TokenType tokenType,
        string calldata metadataURI
    ) external returns (uint256 tokenId) {
        require(msg.sender == cosignedContract, "CoSignedNFT: only CoSigned contract can mint");
        require(to != address(0), "CoSignedNFT: mint to zero address");

        _tokenIdCounter++;
        tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        tokenTypes[tokenId] = tokenType;

        emit Locked(tokenId);
    }

    // -------------------------------------------------------------------------
    // ERC-5192 SOULBOUND ENFORCEMENT
    // -------------------------------------------------------------------------

    /**
     * @notice Always returns true - all CoSigned credentials are permanently locked.
     */
    function locked(uint256 tokenId) external view returns (bool) {
        require(_exists(tokenId), "CoSignedNFT: token does not exist");
        return true;
    }

    /**
     * @dev OZ v4: _beforeTokenTransfer is the hook for all token movements.
     *      Blocks all transfers except mints (from == address(0)).
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        if (from != address(0)) {
            revert("CoSignedNFT: soulbound - non-transferable");
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert("CoSignedNFT: soulbound - non-transferable");
    }

    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert("CoSignedNFT: soulbound - non-transferable");
    }

    // -------------------------------------------------------------------------
    // ERC-165
    // -------------------------------------------------------------------------

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return interfaceId == _INTERFACE_ID_ERC5192 || super.supportsInterface(interfaceId);
    }
}
