# Navigate to project root
cd c:\Users\asus\Desktop\SkillChain1.0

# Create contracts directory structure
New-Item -ItemType Directory -Force -Path "contracts\contracts"
New-Item -ItemType Directory -Force -Path "contracts\scripts"
New-Item -ItemType Directory -Force -Path "contracts\test"

# Create package.json
$packageJson = @"
{
  "name": "skillchain-contracts",
  "version": "1.0.0",
  "description": "Smart contracts for SkillChain MVP",
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "deploy:sepolia": "hardhat run scripts/deploy.ts --network sepolia"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "@types/node": "^20.0.0",
    "hardhat": "^2.19.0",
    "typescript": "^5.3.0"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.0.1"
  }
}
"@

Set-Content -Path "contracts\package.json" -Value $packageJson

Write-Host "✅ Directory structure created"
Write-Host "📦 Run: cd contracts && npm install"
