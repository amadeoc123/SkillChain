import { expect } from "chai";
import { ethers } from "hardhat";
import { SkillCertificate } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SkillCertificate", function () {
  let skillCertificate: SkillCertificate;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const SkillCertificate = await ethers.getContractFactory("SkillCertificate");
    skillCertificate = await SkillCertificate.deploy();
    await skillCertificate.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await skillCertificate.name()).to.equal("SkillChain Certificate");
      expect(await skillCertificate.symbol()).to.equal("SKILL");
    });

    it("Should set the deployer as owner", async function () {
      expect(await skillCertificate.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a certificate with correct data", async function () {
      const tx = await skillCertificate.mintCertificate(
        user1.address,
        "Solidity Development",
        "Intermediate",
        85,
        "QmTest123",
        "ipfs://QmMetadata123"
      );

      await expect(tx)
        .to.emit(skillCertificate, "CertificateMinted")
        .withArgs(0, user1.address, "Solidity Development", "Intermediate", 85);

      const certData = await skillCertificate.getCertificateData(0);
      expect(certData.skill).to.equal("Solidity Development");
      expect(certData.level).to.equal("Intermediate");
      expect(certData.score).to.equal(85);
      expect(certData.proofCID).to.equal("QmTest123");
      expect(certData.revoked).to.be.false;
    });

    it("Should reject minting with invalid data", async function () {
      await expect(
        skillCertificate.mintCertificate(
          ethers.ZeroAddress,
          "Skill",
          "Level",
          80,
          "QmTest",
          "ipfs://test"
        )
      ).to.be.revertedWith("Invalid recipient");

      await expect(
        skillCertificate.mintCertificate(
          user1.address,
          "Skill",
          "Level",
          101,
          "QmTest",
          "ipfs://test"
        )
      ).to.be.revertedWith("Score must be <= 100");
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        skillCertificate.connect(user1).mintCertificate(
          user2.address,
          "Skill",
          "Level",
          80,
          "QmTest",
          "ipfs://test"
        )
      ).to.be.revertedWithCustomError(skillCertificate, "OwnableUnauthorizedAccount");
    });
  });

  describe("Soulbound Functionality", function () {
    beforeEach(async function () {
      await skillCertificate.mintCertificate(
        user1.address,
        "Test Skill",
        "Beginner",
        70,
        "QmTest",
        "ipfs://test"
      );
    });

    it("Should prevent transfers", async function () {
      await expect(
        skillCertificate.connect(user1).transferFrom(user1.address, user2.address, 0)
      ).to.be.revertedWith("SkillCertificate: token is Soulbound and cannot be transferred");
    });

    it("Should prevent safeTransferFrom", async function () {
      await expect(
        skillCertificate.connect(user1)["safeTransferFrom(address,address,uint256)"](
          user1.address,
          user2.address,
          0
        )
      ).to.be.revertedWith("SkillCertificate: token is Soulbound and cannot be transferred");
    });
  });

  describe("Certificate Tracking", function () {
    it("Should track multiple certificates per wallet", async function () {
      await skillCertificate.mintCertificate(
        user1.address,
        "Skill 1",
        "Beginner",
        70,
        "QmTest1",
        "ipfs://test1"
      );

      await skillCertificate.mintCertificate(
        user1.address,
        "Skill 2",
        "Advanced",
        90,
        "QmTest2",
        "ipfs://test2"
      );

      const certs = await skillCertificate.getCertificatesByWallet(user1.address);
      expect(certs.length).to.equal(2);
      expect(certs[0]).to.equal(0);
      expect(certs[1]).to.equal(1);
    });
  });

  describe("Revocation", function () {
    beforeEach(async function () {
      await skillCertificate.mintCertificate(
        user1.address,
        "Test Skill",
        "Beginner",
        70,
        "QmTest",
        "ipfs://test"
      );
    });

    it("Should allow owner to revoke certificate", async function () {
      await expect(
        skillCertificate.revokeCertificate(0, "Fraudulent proof")
      ).to.emit(skillCertificate, "CertificateRevoked");

      const certData = await skillCertificate.getCertificateData(0);
      expect(certData.revoked).to.be.true;
      expect(await skillCertificate.isValid(0)).to.be.false;
    });

    it("Should not allow non-owner to revoke", async function () {
      await expect(
        skillCertificate.connect(user1).revokeCertificate(0, "Test")
      ).to.be.revertedWithCustomError(skillCertificate, "OwnableUnauthorizedAccount");
    });
  });
});
