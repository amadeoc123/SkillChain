import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useActiveAccount } from 'thirdweb/react';
import { submitProof } from '../utils/api';

export default function ProofSubmit() {
  const { courseId } = useParams<{ courseId: string }>();
  const account = useActiveAccount();
  const navigate = useNavigate();
  const [proofType, setProofType] = useState<'github' | 'pdf'>('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !courseId) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('walletAddress', account.address);
      formData.append('proofType', proofType);

      if (proofType === 'github') {
        formData.append('proofData', githubUrl);
      } else if (file) {
        formData.append('proofData', file.name);
        formData.append('file', file);
      }

      await submitProof(formData);
      navigate('/my-certificates');
    } catch (err: any) {
      setError(err.message || 'Failed to submit proof');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Please connect your wallet to submit proof.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Submit Proof of Skill</h1>

        <form onSubmit={handleSubmit} className="card">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Proof Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="github"
                  checked={proofType === 'github'}
                  onChange={() => setProofType('github')}
                  className="mr-2"
                />
                GitHub Repository
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="pdf"
                  checked={proofType === 'pdf'}
                  onChange={() => setProofType('pdf')}
                  className="mr-2"
                />
                PDF Document
              </label>
            </div>
          </div>

          {proofType === 'github' ? (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="input-field"
                required
              />
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Upload PDF (Max 10MB)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="input-field"
                required
              />
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Proof'}
          </button>
        </form>
      </div>
    </div>
  );
}
