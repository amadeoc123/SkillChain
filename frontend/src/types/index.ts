
export interface Course {
  _id: string;
  title: string;
  description: string;
  skillTag: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: string[];
  createdAt: string;
}

export interface Proof {
  _id: string;
  courseId: Course | string;
  walletAddress: string;
  proofType: 'github' | 'pdf';
  proofData: string;
  ipfsCID: string;
  status: 'pending' | 'approved' | 'rejected';
  score?: number;
  evaluatedAt?: string;
  createdAt: string;
}

export interface Certificate {
  _id: string;
  proofId: string;
  walletAddress: string;
  tokenId: number;
  skill: string;
  level: string;
  score: number;
  proofCID: string;
  metadataCID: string;
  txHash: string;
  issuedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Lesson progress tracking
export interface LessonProgress {
  courseId: string;
  completedLessons: number[]; // indices of completed lessons
  lastAccessedLesson: number;
}

export interface CourseProgress {
  [courseId: string]: LessonProgress;
}
