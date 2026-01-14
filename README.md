# SkillChain — Decentralized Proof-of-Skill Learning Platform

**Academic MVP for Master's Thesis Defense**

---

## 📋 Project Overview

SkillChain is a **proof-of-concept** blockchain-based platform that demonstrates how skill verification can be implemented using smart contracts and NFT certificates. This project was developed as part of a Master's thesis to explore decentralized credentialing systems.

### ⚠️ Important Disclaimer

**This is an academic research project**, not a production system. It:

- Does NOT replace formal education or official certifications
- Is NOT audited for security vulnerabilities
- Is NOT intended for commercial use
- Demonstrates concepts for research purposes only

---

## 🏗️ Architecture

### Hybrid Design (On-Chain + Off-Chain)

```
┌─────────────┐
│   Frontend  │  React + Vite + TypeScript + TailwindCSS + thirdweb
│  (Web3 UI)  │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
┌──────▼──────┐  ┌───▼────────┐
│   Backend   │  │ Blockchain │
│  (Express)  │  │  (Sepolia) │
│             │  │            │
│ - Courses   │  │ - ERC-721  │
│ - Proofs    │  │ - Soulbound│
│ - Eval      │  │ - Metadata │
└──────┬──────┘  └────────────┘
       │
┌──────▼──────┐
│   MongoDB   │
│ (Off-Chain) │
└─────────────┘
       │
┌──────▼──────┐
│    IPFS     │
│  (Pinata)   │
└─────────────┘
```

**Why Hybrid?**

- On-chain: Immutable credentials, ownership, verification
- Off-chain: Course content, evaluation logic, scalability

---

## 🛠️ Technology Stack

| Layer               | Technology                     | Justification                 |
| ------------------- | ------------------------------ | ----------------------------- |
| **Smart Contracts** | Solidity 0.8.20                | Industry standard, secure     |
| **Blockchain**      | Ethereum Sepolia Testnet       | Free, production-like         |
| **Token Standard**  | ERC-721 (Soulbound)            | Non-transferable NFTs         |
| **Storage**         | IPFS (Pinata)                  | Decentralized, permanent      |
| **Backend**         | Node.js + Express + TypeScript | Lightweight, type-safe        |
| **Database**        | MongoDB                        | Flexible schema for MVP       |
| **Frontend**        | React + Vite + TypeScript      | Modern, fast, type-safe       |
| **Styling**         | TailwindCSS                    | Rapid UI development          |
| **Web3**            | thirdweb                       | Simplified wallet integration |
| **Testing**         | Hardhat + Chai                 | Contract testing              |

---

## 📁 Project Structure

```
SkillChain1.0/
├── contracts/              # Smart contracts (Solidity + Hardhat)
│   ├── contracts/
│   │   └── SkillCertificate.sol
│   ├── scripts/
│   │   └── deploy.ts
│   ├── test/
│   │   └── SkillCertificate.test.ts
│   ├── hardhat.config.ts
│   └── package.json
│
├── backend/                # REST API (Node.js + Express)
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   │   ├── ipfsService.ts
│   │   │   ├── evaluationService.ts
│   │   │   └── blockchainService.ts
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.ts
│   └── package.json
│
└── frontend/               # UI (React + Vite)
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── utils/
    │   ├── types/
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- MetaMask wallet
- Infura/Alchemy account (for RPC)
- Pinata account (for IPFS)

### 1. Clone Repository

```bash
git clone <repository-url>
cd SkillChain1.0
```

### 2. Smart Contracts

```bash
cd contracts

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your keys

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Sepolia (requires testnet ETH)
npm run deploy:sepolia
```

**Save the deployed contract address!**

### 3. Backend

```bash
cd ../backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with:
# - MongoDB URI
# - Contract address (from step 2)
# - Pinata credentials
# - Sepolia RPC URL

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

### 4. Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with:
# - Contract address
# - thirdweb client ID

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔄 Complete User Flow

### 1. Connect Wallet

- User connects MetaMask via thirdweb
- Address displayed in header

### 2. Browse Courses

- Navigate to `/courses`
- View available courses
- Select course by level/skill

### 3. View Course Details

- Read description
- View lessons
- Click "Submit Proof"

### 4. Submit Proof

- Choose proof type (GitHub or PDF)
- Provide GitHub repo URL OR upload PDF
- File uploads to IPFS automatically
- Proof stored in database with `pending` status

### 5. Evaluation (Auto or Manual)

- Backend evaluates proof
- GitHub: URL validation + basic checks
- PDF: Auto-approved for MVP
- Status updated to `approved` or `rejected`

### 6. Mint Certificate

- If approved, user can mint NFT
- Metadata uploaded to IPFS
- Smart contract called via backend
- Soulbound NFT minted to user's wallet
- Transaction confirmed on Sepolia

### 7. View Certificates

- Navigate to `/my-certificates`
- See all owned NFTs
- View on Etherscan
- Check metadata on IPFS

### 8. Verify Certificates (Public)

- Anyone can visit `/verify/{tokenId}`
- View certificate details
- Confirm on-chain validity
- See proof and metadata links

---

## 🎓 Academic Considerations

### Why This Architecture?

**Blockchain Layer (On-Chain)**

- ✅ Immutable certificate records
- ✅ Tamper-proof ownership
- ✅ Public verifiability
- ❌ Expensive storage
- ❌ Cannot update content

**Backend Layer (Off-Chain)**

- ✅ Flexible course management
- ✅ Complex evaluation logic
- ✅ Cost-effective storage
- ❌ Requires trust in platform
- ❌ Potential downtime

**Hybrid = Best of Both Worlds**

### Limitations Acknowledged

1. **Evaluation**: Simple auto-approval (not AI-based code review)
2. **Sybil Attacks**: No identity verification (one wallet = multiple accounts)
3. **Scalability**: MongoDB for MVP (not optimized for millions of users)
4. **Security**: No smart contract audit
5. **Governance**: Centralized platform (no DAO)
6. **Economics**: No token incentives
7. **Legal**: No KYC/AML compliance

### Future Work (Out of Scope for MVP)

- DAO-based course approval
- Peer review system
- AI code evaluation
- Cross-chain certificates
- Credential marketplace
- Institution partnerships
- Mobile app

---

## 📊 Key Features Demonstrated

### ✅ Implemented

- [x] Web3 wallet authentication
- [x] Course browsing
- [x] Proof submission (GitHub/PDF)
- [x] IPFS storage integration
- [x] Basic evaluation logic
- [x] Soulbound NFT minting
- [x] On-chain certificate verification
- [x] Public certificate viewing

### ❌ Out of Scope (Intentionally)

- [ ] Payment/tokenomics
- [ ] Advanced AI evaluation
- [ ] Decentralized governance
- [ ] Mobile app
- [ ] Real-time chat
- [ ] Reputation system

---

## 🧪 Testing

### Smart Contracts

```bash
cd contracts
npm test
```

**10 tests covering:**

- Deployment
- Minting
- Soulbound logic
- Certificate tracking
- Revocation

### Manual Testing Checklist

- [ ] Connect wallet
- [ ] Browse courses
- [ ] Submit GitHub proof
- [ ] Submit PDF proof
- [ ] Mint certificate
- [ ] View on Etherscan
- [ ] Verify certificate publicly

---

## 📝 API Endpoints

### Courses

- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details

### Proofs

- `POST /api/proofs/submit` - Submit proof (multipart/form-data)
- `GET /api/proofs/wallet/:address` - Get user's proofs
- `POST /api/proofs/:id/evaluate` - Evaluate proof

### Certificates

- `POST /api/certificates/mint` - Mint NFT certificate
- `GET /api/certificates/wallet/:address` - Get user's certificates
- `GET /api/certificates/token/:tokenId` - Get certificate by ID

---

## 🔐 Environment Variables

### Contracts (.env)

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=...
```

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillchain
PINATA_API_KEY=...
PINATA_SECRET_KEY=...
PINATA_JWT=...
CONTRACT_ADDRESS=0x...
SEPOLIA_RPC_URL=...
PLATFORM_PRIVATE_KEY=0x...
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
VITE_THIRDWEB_CLIENT_ID=...
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=11155111
```

---

## 🎯 Success Criteria for Defense

### Technical Demonstration

- ✅ Live demo: Wallet → Proof → NFT
- ✅ Show Etherscan transaction
- ✅ Display IPFS-stored metadata
- ✅ Verify certificate publicly

### Code Quality

- ✅ TypeScript strict mode
- ✅ Clean architecture
- ✅ Commented code
- ✅ Test coverage

### Academic Rigor

- ✅ Architecture justification
- ✅ Tradeoff analysis
- ✅ Limitations documented
- ✅ Future work identified

---

## 🤝 Contributing

This is an academic project. Contributions are not accepted as it's for thesis evaluation.

---

## 📄 License

MIT License (for educational purposes)

---

## 👨‍🎓 Author

Master's Thesis Project  
Date: January 2026

---

## 🙏 Acknowledgments

- OpenZeppelin for secure contract libraries
- Hardhat for development framework
- thirdweb for Web3 integration
- Pinata for IPFS hosting

---

## ⚡ Quick Start Summary

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend && npm install && npm run dev

# Terminal 3: Frontend
cd frontend && npm install && npm run dev

# Browser: http://localhost:5173
```

**Remember:** This is a research prototype, not production software.

---

**Questions for Defense?** Review [ARCHITECTURE.md](docs/ARCHITECTURE.md) and [API.md](docs/API.md)
