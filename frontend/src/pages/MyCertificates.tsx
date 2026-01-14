import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { getCertificatesByWallet } from '../utils/api';
import type { Certificate } from '../types';

export default function MyCertificates() {
  const account = useActiveAccount();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) loadCertificates();
  }, [account]);

  const loadCertificates = async () => {
    if (!account) return;
    try {
      const data = await getCertificatesByWallet(account.address);
      setCertificates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Connect your wallet to view certificates.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">My Certificates</h1>

      {certificates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">You don't have any certificates yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="card">
              <div className="mb-4">
                <h3 className="text-xl font-bold">{cert.skill}</h3>
                <p className="text-sm text-gray-600">{cert.level}</p>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Score:</strong> {cert.score}/100</p>
                <p><strong>Token ID:</strong> #{cert.tokenId}</p>
                <p><strong>Issued:</strong> {new Date(cert.issuedAt).toLocaleDateString()}</p>
              </div>
              <a
                href={`https://sepolia.etherscan.io/tx/${cert.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                View on Etherscan →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
