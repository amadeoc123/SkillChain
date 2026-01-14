import { Request, Response } from 'express';
import Proof from '../models/Proof';
import Course from '../models/Course';
import ipfsService from '../services/ipfsService';
import evaluationService from '../services/evaluationService';

/**
 * Submit proof (GitHub link or PDF upload)
 */
export const submitProof = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, walletAddress, proofType, proofData } = req.body;

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ success: false, error: 'Course not found' });
      return;
    }

    // Upload proof data to IPFS
    let ipfsCID: string;
    
    if (proofType === 'github') {
      // For GitHub, create JSON with link
      const proofJSON = {
        type: 'github',
        url: proofData,
        timestamp: new Date().toISOString()
      };
      ipfsCID = await ipfsService.uploadJSON(proofJSON as any);
    } else if (proofType === 'pdf' && req.file) {
      // Upload PDF file buffer to IPFS
      ipfsCID = await ipfsService.uploadFile(req.file.buffer, req.file.originalname);
    } else {
      res.status(400).json({ success: false, error: 'Invalid proof type or missing file' });
      return;
    }

    // Create proof record
    const proof = new Proof({
      courseId,
      walletAddress: walletAddress.toLowerCase(),
      proofType,
      proofData,
      ipfsCID,
      status: 'pending'
    });

    await proof.save();

    res.status(201).json({ 
      success: true, 
      data: proof,
      ipfsURL: ipfsService.getGatewayURL(ipfsCID)
    });
  } catch (error) {
    console.error('Submit proof error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit proof' });
  }
};

/**
 * Get proofs by wallet address
 */
export const getProofsByWallet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress } = req.params;
    const proofs = await Proof.find({ 
      walletAddress: walletAddress.toLowerCase() 
    }).populate('courseId').sort({ createdAt: -1 });

    res.json({ success: true, data: proofs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch proofs' });
  }
};

/**
 * Evaluate proof (auto or manual)
 */
export const evaluateProof = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { manualScore } = req.body;

    const proof = await Proof.findById(id);
    if (!proof) {
      res.status(404).json({ success: false, error: 'Proof not found' });
      return;
    }

    let result: { pass: boolean; score: number };

    // Manual evaluation if score provided
    if (manualScore !== undefined) {
      result = { pass: manualScore >= 60, score: manualScore };
    } else {
      // Auto evaluation
      if (proof.proofType === 'github') {
        result = await evaluationService.evaluateGitHubProof(proof.proofData);
      } else {
        result = await evaluationService.evaluatePDFProof(proof.ipfsCID);
      }
    }

    // Update proof
    proof.status = result.pass ? 'approved' : 'rejected';
    proof.score = result.score;
    proof.evaluatedAt = new Date();
    await proof.save();

    res.json({ success: true, data: proof });
  } catch (error) {
    console.error('Evaluate proof error:', error);
    res.status(500).json({ success: false, error: 'Failed to evaluate proof' });
  }
};
