import { Router } from 'express';
import multer from 'multer';
import { submitProof, getProofsByWallet, evaluateProof } from '../controllers/proofController';

const router = Router();

// Configure multer for file uploads (store in memory for IPFS upload)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/submit', upload.single('file'), submitProof);
router.get('/wallet/:walletAddress', getProofsByWallet);
router.post('/:id/evaluate', evaluateProof);

export default router;
