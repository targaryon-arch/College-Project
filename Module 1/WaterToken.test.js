const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WaterToken", function () {
  let waterToken, admin, farmer1, farmer2, stranger;

  beforeEach(async function () {
    [admin, farmer1, farmer2, stranger] = await ethers.getSigners();
    const WaterToken = await ethers.getContractFactory("WaterToken");
    waterToken = await WaterToken.deploy(admin.address);
    await waterToken.waitForDeployment();
  });

  it("allocates season tokens to a farmer", async function () {
    await waterToken.connect(admin).allocateSeasonTokens(farmer1.address, 100, 2026);
    expect(await waterToken.balanceOf(farmer1.address)).to.equal(100);
  });

  it("prevents non-minters from allocating tokens", async function () {
    await expect(
      waterToken.connect(stranger).allocateSeasonTokens(farmer1.address, 100, 2026)
    ).to.be.reverted;
  });

  it("batch allocates to multiple farmers in one call", async function () {
    await waterToken
      .connect(admin)
      .batchAllocate([farmer1.address, farmer2.address], [50, 75], 2026);

    expect(await waterToken.balanceOf(farmer1.address)).to.equal(50);
    expect(await waterToken.balanceOf(farmer2.address)).to.equal(75);
  });

  it("deducts water usage from a farmer's balance", async function () {
    await waterToken.connect(admin).allocateSeasonTokens(farmer1.address, 100, 2026);
    await waterToken.connect(admin).deductUsage(farmer1.address, 30, "meter-001-reading-A");

    expect(await waterToken.balanceOf(farmer1.address)).to.equal(70);
  });

  it("reverts deduction if farmer has insufficient tokens", async function () {
    await waterToken.connect(admin).allocateSeasonTokens(farmer1.address, 10, 2026);

    await expect(
      waterToken.connect(admin).deductUsage(farmer1.address, 50, "meter-001")
    ).to.be.revertedWith("Insufficient water tokens");
  });

  it("prevents non-deductors from deducting usage", async function () {
    await waterToken.connect(admin).allocateSeasonTokens(farmer1.address, 100, 2026);

    await expect(
      waterToken.connect(stranger).deductUsage(farmer1.address, 10, "meter-001")
    ).to.be.reverted;
  });

  it("allows peer-to-peer trading between farmers via transfer", async function () {
    await waterToken.connect(admin).allocateSeasonTokens(farmer1.address, 100, 2026);
    await waterToken.connect(farmer1).transfer(farmer2.address, 40);

    expect(await waterToken.balanceOf(farmer1.address)).to.equal(60);
    expect(await waterToken.balanceOf(farmer2.address)).to.equal(40);
  });

  it("uses 0 decimals so tokens represent whole water units", async function () {
    expect(await waterToken.decimals()).to.equal(0);
  });
});

describe("WaterMarketplace", function () {
  let waterToken, marketplace, admin, farmer1, farmer2;

  beforeEach(async function () {
    [admin, farmer1, farmer2] = await ethers.getSigners();

    const WaterToken = await ethers.getContractFactory("WaterToken");
    waterToken = await WaterToken.deploy(admin.address);
    await waterToken.waitForDeployment();

    const WaterMarketplace = await ethers.getContractFactory("WaterMarketplace");
    marketplace = await WaterMarketplace.deploy(await waterToken.getAddress());
    await marketplace.waitForDeployment();

    await waterToken.connect(admin).allocateSeasonTokens(farmer1.address, 100, 2026);
  });

  it("lists tokens for sale and escrows them", async function () {
    await waterToken.connect(farmer1).approve(await marketplace.getAddress(), 50);
    await marketplace.connect(farmer1).createListing(50, ethers.parseEther("0.001"));

    const listing = await marketplace.listings(0);
    expect(listing.amount).to.equal(50);
    expect(listing.seller).to.equal(farmer1.address);
    expect(await waterToken.balanceOf(farmer1.address)).to.equal(50);
  });

  it("allows a buyer to purchase listed tokens", async function () {
    await waterToken.connect(farmer1).approve(await marketplace.getAddress(), 50);
    await marketplace.connect(farmer1).createListing(50, ethers.parseEther("0.001"));

    const price = ethers.parseEther("0.001") * 20n;
    await marketplace.connect(farmer2).buy(0, 20, { value: price });

    expect(await waterToken.balanceOf(farmer2.address)).to.equal(20);
  });

  it("refunds overpayment on purchase", async function () {
    await waterToken.connect(farmer1).approve(await marketplace.getAddress(), 50);
    await marketplace.connect(farmer1).createListing(50, ethers.parseEther("0.001"));

    const exactPrice = ethers.parseEther("0.001") * 10n;
    const overpay = exactPrice + ethers.parseEther("0.01");

    const balanceBefore = await ethers.provider.getBalance(farmer2.address);
    const tx = await marketplace.connect(farmer2).buy(0, 10, { value: overpay });
    const receipt = await tx.wait();
    const gasCost = receipt.gasUsed * receipt.gasPrice;
    const balanceAfter = await ethers.provider.getBalance(farmer2.address);

    // farmer2 should only be out exactPrice + gas, not the full overpay
    expect(balanceBefore - balanceAfter).to.equal(exactPrice + gasCost);
  });

  it("allows a seller to cancel a listing and reclaim tokens", async function () {
    await waterToken.connect(farmer1).approve(await marketplace.getAddress(), 50);
    await marketplace.connect(farmer1).createListing(50, ethers.parseEther("0.001"));
    await marketplace.connect(farmer1).cancelListing(0);

    expect(await waterToken.balanceOf(farmer1.address)).to.equal(100);
  });

  it("prevents non-sellers from cancelling a listing", async function () {
    await waterToken.connect(farmer1).approve(await marketplace.getAddress(), 50);
    await marketplace.connect(farmer1).createListing(50, ethers.parseEther("0.001"));

    await expect(marketplace.connect(farmer2).cancelListing(0)).to.be.revertedWith(
      "Not the seller"
    );
  });
});
