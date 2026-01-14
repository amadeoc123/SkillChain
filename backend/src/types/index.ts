
export interface ICourse {
  _id?: string;
  title: string;
  description: string;
  skillTag: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: string[];
  createdAt?: Date;
}

export interface IProof {
  _id?: string;
  courseId: string;
  walletAddress: string;
  proofType: 'github' | 'pdf';
  proofData: string; // GitHub URL or uploaded file info
  ipfsCID: string;
  status: 'pending' | 'approved' | 'rejected';
  score?: number;
  evaluatedAt?: Date;
  createdAt?: Date;
}

export interface ICertificate {
  _id?: string;
  proofId: string;
  walletAddress: string;
  tokenId: number;
  skill: string;
  level: string;
  score: number;
  proofCID: string;
  metadataCID: string;
  txHash: string;
  issuedAt: Date;
}

export interface IPFSUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface MetadataJSON {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
}
