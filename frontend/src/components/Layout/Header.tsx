import { Link } from 'react-router-dom';
import { ConnectButton } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import { sepolia } from 'thirdweb/chains';

// Get client ID from environment
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

// Only create client if ID is provided
const client = clientId 
  ? createThirdwebClient({ clientId })
  : null;

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkillChain
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="text-gray-600 hover:text-primary transition-colors">
              Courses
            </Link>
            <Link to="/my-certificates" className="text-gray-600 hover:text-primary transition-colors">
              My Certificates
            </Link>
          </nav>

          {client ? (
            <ConnectButton
              client={client}
              chain={sepolia}
            />
          ) : (
            <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
              Configure thirdweb client ID
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
