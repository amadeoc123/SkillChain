import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

// Import contract ABI (after compilation)
// This path assumes artifacts exist from compiled contracts
const CONTRACT_ABI = [
  "function mintCertificate(address recipient, string skill, string level, uint256 score, string proofCID, string metadataURI) external returns (uint256)",
  "function getCertificateData(uint256 tokenId) external view returns (tuple(string skill, string level, uint256 score, string proofCID, uint256 issuedAt, address issuer, bool revoked))",
  "function getCertificatesByWallet(address wallet) external view returns (uint256[])",
  "function isValid(uint256 tokenId) external view returns (bool)"
];

export class BlockchainService {
  private provider?: ethers.JsonRpcProvider;
  private wallet?: ethers.Wallet;
  private contract?: ethers.Contract;
  private isConfigured: boolean = false;

  constructor() {
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const privateKey = process.env.PLATFORM_PRIVATE_KEY;
    const contractAddress = process.env.CONTRACT_ADDRESS;

    // Only initialize if all credentials are present
    if (!rpcUrl || !privateKey || !contractAddress) {
      console.warn('⚠️  Blockchain service not configured. Set SEPOLIA_RPC_URL, PLATFORM_PRIVATE_KEY, and CONTRACT_ADDRESS in .env');
      console.warn('⚠️  Blockchain features will be disabled until configured.');
      return;
    }

    try {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.wallet);
      this.isConfigured = true;
      console.log('✅ Blockchain service configured successfully');
    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error);
    }
  }

  /**
   * Mint a new certificate NFT
   */
  async mintCertificate(
    recipientAddress: string,
    skill: string,
    level: string,
    score: number,
    proofCID: string,
    metadataURI: string
  ): Promise<{ tokenId: number; txHash: string }> {
    if (!this.isConfigured || !this.contract) {
      throw new Error('Blockchain service not configured. Please set environment variables.');
    }

    try {
      const tx = await this.contract.mintCertificate(
        recipientAddress,
        skill,
        level,
        score,
        proofCID,
        metadataURI
      );

      const receipt = await tx.wait();
      
      // Extract tokenId from event logs
      const mintEvent = receipt.logs.find((log: any) => {
        try {
          return this.contract.interface.parseLog(log)?.name === 'CertificateMinted';
        } catch {
          return false;
        }
      });

      const parsedLog = this.contract.interface.parseLog(mintEvent);
      const tokenId = Number(parsedLog?.args?.tokenId || 0);

      return {
        tokenId,
        txHash: receipt.hash
      };
    } catch (error) {
      console.error('Mint certificate error:', error);
      throw new Error('Failed to mint certificate on blockchain');
    }
  }

  /**
   * Get certificate data from blockchain
   */
  async getCertificateData(tokenId: number): Promise<any> {
    if (!this.isConfigured || !this.contract) {
      throw new Error('Blockchain service not configured');
    }
    try {
      const data = await this.contract.getCertificateData(tokenId);
      return {
        skill: data.skill,
        level: data.level,
        score: Number(data.score),
        proofCID: data.proofCID,
        issuedAt: Number(data.issuedAt),
        issuer: data.issuer,
        revoked: data.revoked
      };
    } catch (error) {
      console.error('Get certificate data error:', error);
      throw new Error('Failed to fetch certificate from blockchain');
    }
  }

  /**
   * Get all certificates for a wallet
   */
  async getCertificatesByWallet(walletAddress: string): Promise<number[]> {    if (!this.isConfigured || !this.contract) {
      throw new Error('Blockchain service not configured');
    }    try {
      const tokenIds = await this.contract.getCertificatesByWallet(walletAddress);
      return tokenIds.map((id: bigint) => Number(id));
    } catch (error) {
      console.error('Get certificates by wallet error:', error);
      return [];
    }
  }

  /**
   * Verify if certificate is valid (not revoked)
   */
  async isValid(tokenId: number): Promise<boolean> {
    if (!this.isConfigured || !this.contract) {
      throw new Error('Blockchain service not configured');
    }
    try {
      return await this.contract.isValid(tokenId);
    } catch (error) {
      console.error('Certificate validation error:', error);
      return false;
    }
  }
}

export default new BlockchainService();
