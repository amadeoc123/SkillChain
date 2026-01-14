import mongoose, { Schema, Document } from 'mongoose';
import { IProof } from '../types';

export interface ProofDocument extends IProof, Document {}

const ProofSchema = new Schema<ProofDocument>({
  courseId: { type: String, required: true, ref: 'Course' },
  walletAddress: { type: String, required: true, lowercase: true },
  proofType: { type: String, enum: ['github', 'pdf'], required: true },
  proofData: { type: String, required: true },
  ipfsCID: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  score: { type: Number, min: 0, max: 100 },
  evaluatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

ProofSchema.index({ walletAddress: 1, courseId: 1 });

export default mongoose.model<ProofDocument>('Proof', ProofSchema);
