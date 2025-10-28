const hre = require("hardhat");

async function main() {
  console.log("网络:", hre.network.name);
  console.log("================================\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("账户地址:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.log("\n⚠️  余额为 0！");
    console.log("\n请从以下水龙头获取测试 ETH：");
    console.log("1. https://sepoliafaucet.com");
    console.log("2. https://www.infura.io/faucet/sepolia");
    console.log("3. https://faucet.quicknode.com/ethereum/sepolia");
    console.log("4. https://cloud.google.com/application/web3/faucet/ethereum/sepolia");
    console.log("\n复制上面的账户地址，粘贴到水龙头网站获取测试 ETH");
  } else {
    console.log("\n✅ 账户有余额，可以部署合约");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
