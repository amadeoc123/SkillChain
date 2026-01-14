import mongoose, { Schema, Document } from 'mongoose';
import { ICertificate } from '../types';

export interface CertificateDocument extends ICertificate, Document {}

const CertificateSchema = new Schema<CertificateDocument>({
  proofId: { type: String, required: true, ref: 'Proof' },
  walletAddress: { type: String, required: true, lowercase: true, index: true },
  tokenId: { type: Number, required: true, unique: true },
  skill: { type: String, required: true },
  level: { type: String, required: true },
  score: { type: Number, required: true },
  proofCID: { type: String, required: true },
  metadataCID: { type: String, required: true },
  txHash: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now }
});

export default mongoose.model<CertificateDocument>('Certificate', CertificateSchema);
