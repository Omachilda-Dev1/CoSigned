// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title CoSignedNFT
 * @notice Soulbound (non-transferable) NFT credential for CoSigned mentorship Bonds.
 *         Implements ERC-5192 — the minimal soulbound token standard.
 *         Two token types: LEARNER_PROOF and MENTOR_PROOF.
 *         Only the CoSigned core contract can mint tokens.
 *
 * @dev ERC-5192 requirements:
 *      1. locked(tokenId) must always return true
 *      2. Emit Locked(tokenId) on every mint
 *      3. Interface ID 0xb45a3c0e must be supported
 *
 *      Transfer enforcement:
 *      - transferFrom, safeTransferFrom, approve, setApprovalForAll all revert
 *      - _update() override blocks all transfers except mints (from == address(0))
 */
contract CoSignedNFT is ERC721URIStorage {

    // ─────────────────────────────────────────────────────────────────────────
    // ERC-5192 INTERFACE
    // ─────────────────────────────────────────────────────────────────────────

    /// @dev ERC-5192 interface ID: bytes4(keccak256("locked(uint256)"))
    bytes4 private constant _INTERFACE_ID_ERC5192 = 0xb45a3c0e;

    /// @notice Emitted when a token is permanently locked (on every mint).
    event Locked(uint256 tokenId);

    /// @notice Emitted if a token is ever unlocked — never emitted by this contract.
    event Unlocked(uint256 tokenId);

    // ─────────────────────────────────────────────────────────────────────────
    // ENUMS & STATE
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Distinguishes the two credential types minted per completed Bond.
    enum TokenType { LEARNER_PROOF, MENTOR_PROOF }

    /// @notice The CoSigned core contract — the only address allowed to mint.
    address public immutable cosignedContract;

    /// @notice Auto-incrementing token ID counter. First token is ID 1.
    uint256 private _tokenIdCounter;

    /// @notice Token type for each minted token.
    mapping(uint256 => TokenType) public tokenTypes;

    // ─────────────────────────────────────────────────────────────────────────
    // CONSTRUCTOR
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @param _cosignedContract Address of the CoSigned core contract.
     *        Only this address can call mint(). Set once, immutable.
     */
    constructor(address _cosignedContract) ERC721("CoSigned Credential", "COSIGN") {
        require(_cosignedContract != address(0), "CoSignedNFT: invalid CoSigned address");
        cosignedContract = _cosignedContract;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MINT
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Mints a soulbound credential NFT to a recipient.
     * @dev Only callable by the CoSigned core contract.
     *      Emits Locked(tokenId) as required by ERC-5192.
     * @param to          Recipient wallet address.
     * @param tokenType   LEARNER_PROOF or MENTOR_PROOF.
     * @param metadataURI Full IPFS URI for the token metadata JSON.
     * @return tokenId    The ID of the newly minted token.
     */
    function mint(
        address to,
        TokenType tokenType,
        string calldata metadataURI
    ) external returns (uint256 tokenId) {
        require(msg.sender == cosignedContract, "CoSignedNFT: only CoSigned contract can mint");
        require(to != address(0),               "CoSignedNFT: mint to zero address");

        _tokenIdCounter++;
        tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        tokenTypes[tokenId] = tokenType;

        emit Locked(tokenId); // ERC-5192 required
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ERC-5192 — SOULBOUND ENFORCEMENT
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns whether a token is locked (soulbound).
     * @dev Always returns true — all CoSigned credentials are permanently locked.
     * @param tokenId The token to query.
     * @return True always.
     */
    function locked(uint256 tokenId) external view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "CoSignedNFT: token does not exist");
        return true;
    }

    /**
     * @dev Override _update to block all transfers except mints.
     *      In OZ v5, _update() is the single hook for all token movements.
     *      Mints have from == address(0) — these are allowed.
     *      Any transfer from a real address reverts.
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert("CoSignedNFT: soulbound — non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Block approvals — soulbound tokens cannot be approved for transfer.
     */
    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert("CoSignedNFT: soulbound — non-transferable");
    }

    /**
     * @dev Block operator approvals — soulbound tokens cannot be approved for transfer.
     */
    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert("CoSignedNFT: soulbound — non-transferable");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ERC-165 INTERFACE SUPPORT
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Declares support for ERC-5192, ERC-721, and ERC-165.
     * @param interfaceId The interface identifier to check.
     * @return True if the interface is supported.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return
            interfaceId == _INTERFACE_ID_ERC5192 ||
            super.supportsInterface(interfaceId);
    }
}
