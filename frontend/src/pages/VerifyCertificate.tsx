import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCertificateByTokenId } from '../utils/api';
import type { Certificate } from '../types';

export default function VerifyCertificate() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tokenId) loadCertificate(parseInt(tokenId));
  }, [tokenId]);

  const loadCertificate = async (id: number) => {
    try {
      const data = await getCertificateByTokenId(id);
      setCertificate(data);
    } catch (err: any) {
      setError(err.message || 'Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-16 text-center text-red-600">{error}</div>;
  if (!certificate) return <div className="container mx-auto px-4 py-16 text-center">Certificate not found</div>;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-xl p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">SkillChain Certificate</h1>
          <p className="text-blue-100">Verified On-Chain Credential</p>
        </div>

        <div className="card rounded-t-none">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Skill</h3>
              <p className="text-2xl font-bold mb-4">{certificate.skill}</p>

              <h3 className="text-sm font-medium text-gray-500 mb-1">Level</h3>
              <p className="text-lg mb-4">{certificate.level}</p>

              <h3 className="text-sm font-medium text-gray-500 mb-1">Score</h3>
              <p className="text-lg mb-4">{certificate.score}/100</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Owner</h3>
              <p className="text-sm font-mono mb-4 break-all">{certificate.walletAddress}</p>

              <h3 className="text-sm font-medium text-gray-500 mb-1">Token ID</h3>
              <p className="text-lg mb-4">#{certificate.tokenId}</p>

              <h3 className="text-sm font-medium text-gray-500 mb-1">Issued</h3>
              <p className="text-lg mb-4">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex gap-4">
              <a
                href={`https://sepolia.etherscan.io/tx/${certificate.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 text-center"
              >
                View on Etherscan
              </a>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${certificate.metadataCID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 text-center"
              >
                View Metadata
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-800 font-medium">✓ This certificate is valid and verified on the Ethereum blockchain</p>
        </div>
      </div>
    </div>
  );
}
