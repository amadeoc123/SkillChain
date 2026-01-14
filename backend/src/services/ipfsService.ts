import axios from 'axios';
import FormData from 'form-data';
import { IPFSUploadResponse, MetadataJSON } from '../types';

const PINATA_API_URL = 'https://api.pinata.cloud';

export class IPFSService {
  private apiKey: string;
  private secretKey: string;
  private jwt: string;

  constructor() {
    this.apiKey = process.env.PINATA_API_KEY || '';
    this.secretKey = process.env.PINATA_SECRET_KEY || '';
    this.jwt = process.env.PINATA_JWT || '';
  }

  /**
   * Upload JSON metadata to IPFS
   */
  async uploadJSON(data: MetadataJSON): Promise<string> {
    try {
      const response = await axios.post(
        `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.jwt}`
          }
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('IPFS JSON upload error:', error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  }

  /**
   * Upload file buffer to IPFS (for proof files)
   */
  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, fileName);

      const response = await axios.post(
        `${PINATA_API_URL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${this.jwt}`
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('IPFS file upload error:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  /**
   * Get IPFS gateway URL
   */
  getGatewayURL(cid: string): string {
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }

  /**
   * Get IPFS URI for token metadata
   */
  getIPFSURI(cid: string): string {
    return `ipfs://${cid}`;
  }
}

export default new IPFSService();
