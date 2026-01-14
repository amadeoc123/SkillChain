import { ethers } from "hardhat";

async function main() {
  console.log("Starting SkillCertificate deployment...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy contract
  const SkillCertificate = await ethers.getContractFactory("SkillCertificate");
  const skillCertificate = await SkillCertificate.deploy();
  
  await skillCertificate.waitForDeployment();
  
  const contractAddress = await skillCertificate.getAddress();
  
  console.log("\n✅ SkillCertificate deployed to:", contractAddress);
  console.log("\n📋 Save this information:");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Deployer:", deployer.address);
  
  console.log("\n🔍 Verify on Etherscan:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
  
  // Save deployment info to file
  const fs = require("fs");
  const deploymentInfo = {
    contractAddress,
    network: (await ethers.provider.getNetwork()).name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    "./deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
