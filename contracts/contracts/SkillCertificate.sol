// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SkillCertificate
 * @dev Soulbound NFT (non-transferable) for skill verification
 * @notice This is an MVP for academic purposes
 */
contract SkillCertificate is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    // Struct to store certificate metadata on-chain
    struct CertificateData {
        string skill;           // e.g., "Solidity Development"
        string level;           // e.g., "Intermediate"
        uint256 score;          // 0-100
        string proofCID;        // IPFS CID of proof file
        uint256 issuedAt;       // Timestamp
        address issuer;         // Platform/evaluator address
        bool revoked;           // Revocation flag
    }
    
    // Mapping from tokenId to certificate data
    mapping(uint256 => CertificateData) public certificates;
    
    // Mapping to track certificates per wallet
    mapping(address => uint256[]) public walletCertificates;
    
    // Events
    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string skill,
        string level,
        uint256 score
    );
    
    event CertificateRevoked(uint256 indexed tokenId, string reason);
    
    constructor() ERC721("SkillChain Certificate", "SKILL") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new certificate
     * @param recipient Address receiving the certificate
     * @param skill Name of the skill
     * @param level Proficiency level
     * @param score Numerical score (0-100)
     * @param proofCID IPFS CID of the proof file
     * @param metadataURI IPFS URI for metadata JSON
     */
    function mintCertificate(
        address recipient,
        string memory skill,
        string memory level,
        uint256 score,
        string memory proofCID,
        string memory metadataURI
    ) external onlyOwner returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(score <= 100, "Score must be <= 100");
        require(bytes(skill).length > 0, "Skill cannot be empty");
        require(bytes(proofCID).length > 0, "Proof CID cannot be empty");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        // Store certificate data
        certificates[tokenId] = CertificateData({
            skill: skill,
            level: level,
            score: score,
            proofCID: proofCID,
            issuedAt: block.timestamp,
            issuer: msg.sender,
            revoked: false
        });
        
        // Track certificate by wallet
        walletCertificates[recipient].push(tokenId);
        
        emit CertificateMinted(tokenId, recipient, skill, level, score);
        
        return tokenId;
    }
    
    /**
     * @dev Revoke a certificate (for fraud cases)
     * @param tokenId The certificate to revoke
     * @param reason Reason for revocation
     */
    function revokeCertificate(uint256 tokenId, string memory reason) 
        external 
        onlyOwner 
    {
        require(ownerOf(tokenId) != address(0), "Certificate does not exist");
        require(!certificates[tokenId].revoked, "Already revoked");
        
        certificates[tokenId].revoked = true;
        
        emit CertificateRevoked(tokenId, reason);
    }
    
    /**
     * @dev Get all certificate IDs owned by an address
     * @param wallet The wallet address
     */
    function getCertificatesByWallet(address wallet) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return walletCertificates[wallet];
    }
    
    /**
     * @dev Get certificate data
     * @param tokenId The certificate ID
     */
    function getCertificateData(uint256 tokenId) 
        external 
        view 
        returns (CertificateData memory) 
    {
        require(ownerOf(tokenId) != address(0), "Certificate does not exist");
        return certificates[tokenId];
    }
    
    /**
     * @dev Check if certificate is valid (exists and not revoked)
     * @param tokenId The certificate ID
     */
    function isValid(uint256 tokenId) external view returns (bool) {
        if (ownerOf(tokenId) == address(0)) return false;
        return !certificates[tokenId].revoked;
    }
    
    // ============ SOULBOUND LOGIC ============
    
    /**
     * @dev Override transfer functions to make NFT non-transferable (Soulbound)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        // Block all other transfers
        if (from != address(0) && to != address(0)) {
            revert("SkillCertificate: token is Soulbound and cannot be transferred");
        }
        
        return super._update(to, tokenId, auth);
    }
    
    // ============ OVERRIDES ============
    
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
