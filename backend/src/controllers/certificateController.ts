import { Request, Response } from 'express';
import Certificate from '../models/Certificate';
import Proof from '../models/Proof';
import Course from '../models/Course';
import ipfsService from '../services/ipfsService';
import blockchainService from '../services/blockchainService';
import { MetadataJSON } from '../types';

/**
 * Mint certificate NFT
 */
export const mintCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { proofId, walletAddress } = req.body;

    // Validate proof
    const proof = await Proof.findById(proofId).populate('courseId');
    if (!proof) {
      res.status(404).json({ success: false, error: 'Proof not found' });
      return;
    }

    if (proof.status !== 'approved') {
      res.status(400).json({ success: false, error: 'Proof not approved yet' });
      return;
    }

    // Check if certificate already exists for this proof
    const existing = await Certificate.findOne({ proofId });
    if (existing) {
      res.status(400).json({ success: false, error: 'Certificate already minted' });
      return;
    }

    const course = proof.courseId as any;

    // Create metadata JSON
    const metadata: MetadataJSON = {
      name: `SkillChain Certificate - ${course.skillTag}`,
      description: `Certificate of completion for ${course.title}`,
      image: 'ipfs://QmPlaceholderImage', // TODO: Generate certificate image
      attributes: [
        { trait_type: 'Skill', value: course.skillTag },
        { trait_type: 'Level', value: course.level },
        { trait_type: 'Score', value: proof.score || 0 },
        { trait_type: 'Proof CID', value: proof.ipfsCID },
        { trait_type: 'Issue Date', value: new Date().toISOString() }
      ]
    };

    // Upload metadata to IPFS
    const metadataCID = await ipfsService.uploadJSON(metadata);
    const metadataURI = ipfsService.getIPFSURI(metadataCID);

    // Mint NFT on blockchain
    const { tokenId, txHash } = await blockchainService.mintCertificate(
      walletAddress,
      course.skillTag,
      course.level,
      proof.score || 0,
      proof.ipfsCID,
      metadataURI
    );

    // Save certificate to database
    const certificate = new Certificate({
      proofId,
      walletAddress: walletAddress.toLowerCase(),
      tokenId,
      skill: course.skillTag,
      level: course.level,
      score: proof.score || 0,
      proofCID: proof.ipfsCID,
      metadataCID,
      txHash
    });

    await certificate.save();

    res.status(201).json({
      success: true,
      data: certificate,
      explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`
    });
  } catch (error) {
    console.error('Mint certificate error:', error);
    res.status(500).json({ success: false, error: 'Failed to mint certificate' });
  }
};

/**
 * Get certificate by token ID
 */
export const getCertificateByTokenId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenId } = req.params;
    
    const certificate = await Certificate.findOne({ tokenId: Number(tokenId) })
      .populate({
        path: 'proofId',
        populate: { path: 'courseId' }
      });

    if (!certificate) {
      res.status(404).json({ success: false, error: 'Certificate not found' });
      return;
    }

    // Verify on blockchain
    const isValid = await blockchainService.isValid(Number(tokenId));

    res.json({
      success: true,
      data: certificate,
      isValid,
      metadataURL: ipfsService.getGatewayURL(certificate.metadataCID),
      proofURL: ipfsService.getGatewayURL(certificate.proofCID)
    });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch certificate' });
  }
};

/**
 * Get all certificates for a wallet
 */
export const getCertificatesByWallet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress } = req.params;
    
    const certificates = await Certificate.find({
      walletAddress: walletAddress.toLowerCase()
    }).populate({
      path: 'proofId',
      populate: { path: 'courseId' }
    }).sort({ issuedAt: -1 });

    res.json({ success: true, data: certificates });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch certificates' });
  }
};
