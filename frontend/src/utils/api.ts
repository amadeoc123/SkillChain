import axios from 'axios';
import type { Course, Proof, Certificate, ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Courses
export const getCourses = async (): Promise<Course[]> => {
  const { data } = await api.get<ApiResponse<Course[]>>('/courses');
  return data.data || [];
};

export const getCourseById = async (id: string): Promise<Course> => {
  const { data } = await api.get<ApiResponse<Course>>(`/courses/${id}`);
  if (!data.data) throw new Error('Course not found');
  return data.data;
};

// Proofs
export const submitProof = async (formData: FormData): Promise<Proof> => {
  const { data } = await api.post<ApiResponse<Proof>>('/proofs/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (!data.data) throw new Error('Failed to submit proof');
  return data.data;
};

export const getProofsByWallet = async (walletAddress: string): Promise<Proof[]> => {
  const { data } = await api.get<ApiResponse<Proof[]>>(`/proofs/wallet/${walletAddress}`);
  return data.data || [];
};

// Certificates
export const mintCertificate = async (proofId: string, walletAddress: string): Promise<Certificate> => {
  const { data } = await api.post<ApiResponse<Certificate>>('/certificates/mint', {
    proofId,
    walletAddress,
  });
  if (!data.data) throw new Error('Failed to mint certificate');
  return data.data;
};

export const getCertificatesByWallet = async (walletAddress: string): Promise<Certificate[]> => {
  const { data } = await api.get<ApiResponse<Certificate[]>>(`/certificates/wallet/${walletAddress}`);
  return data.data || [];
};

export const getCertificateByTokenId = async (tokenId: number): Promise<Certificate> => {
  const { data } = await api.get<ApiResponse<Certificate>>(`/certificates/token/${tokenId}`);
  if (!data.data) throw new Error('Certificate not found');
  return data.data;
};
