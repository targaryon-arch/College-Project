const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const WaterToken = await hre.ethers.getContractFactory("WaterToken");
  const waterToken = await WaterToken.deploy(deployer.address);
  await waterToken.waitForDeployment();
  const waterTokenAddress = await waterToken.getAddress();
  console.log("WaterToken deployed to:", waterTokenAddress);

  const WaterMarketplace = await hre.ethers.getContractFactory("WaterMarketplace");
  const marketplace = await WaterMarketplace.deploy(waterTokenAddress);
  await marketplace.waitForDeployment();
  console.log("WaterMarketplace deployed to:", await marketplace.getAddress());

  console.log("\nDone. Save these addresses for your teammates (Module 2 / frontend):");
  console.log({
    WaterToken: waterTokenAddress,
    WaterMarketplace: await marketplace.getAddress(),
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
