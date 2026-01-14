import { Router } from 'express';
import { 
  mintCertificate, 
  getCertificateByTokenId, 
  getCertificatesByWallet 
} from '../controllers/certificateController';

const router = Router();

router.post('/mint', mintCertificate);
router.get('/token/:tokenId', getCertificateByTokenId);
router.get('/wallet/:walletAddress', getCertificatesByWallet);

export default router;
