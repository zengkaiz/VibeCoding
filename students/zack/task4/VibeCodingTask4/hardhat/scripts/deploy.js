const hre = require("hardhat");

async function main() {
  console.log("开始部署 MyNFT 合约...");

  // 获取部署者账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);

  // 获取账户余额
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", hre.ethers.formatEther(balance), "ETH");

  // 合约参数配置
  const NFT_NAME = "My Awesome NFT";
  const NFT_SYMBOL = "MANFT";
  const BASE_URI = "ipfs://QmYourBaseURI/"; // 替换为你的 IPFS 基础 URI
  const MAX_SUPPLY = 10000; // 最大供应量，设置为 0 表示无限制
  const MINT_PRICE = hre.ethers.parseEther("0.01"); // 0.01 ETH

  console.log("\n合约配置:");
  console.log("- 名称:", NFT_NAME);
  console.log("- 符号:", NFT_SYMBOL);
  console.log("- 基础URI:", BASE_URI);
  console.log("- 最大供应量:", MAX_SUPPLY === 0 ? "无限制" : MAX_SUPPLY);
  console.log("- 铸造价格:", hre.ethers.formatEther(MINT_PRICE), "ETH");

  // 获取合约工厂
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  // 部署合约
  console.log("\n正在部署合约...");
  const nft = await MyNFT.deploy(
    NFT_NAME,
    NFT_SYMBOL,
    BASE_URI,
    MAX_SUPPLY,
    MINT_PRICE
  );

  await nft.waitForDeployment();

  const nftAddress = await nft.getAddress();
  console.log("✅ MyNFT 合约已部署到:", nftAddress);

  // 等待几个区块确认（如果是测试网或主网）
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n等待区块确认...");
    await nft.deploymentTransaction().wait(6);
    console.log("✅ 已确认");

    // 验证合约（需要配置 Etherscan API Key）
    console.log("\n开始验证合约...");
    try {
      await hre.run("verify:verify", {
        address: nftAddress,
        constructorArguments: [
          NFT_NAME,
          NFT_SYMBOL,
          BASE_URI,
          MAX_SUPPLY,
          MINT_PRICE,
        ],
      });
      console.log("✅ 合约验证成功");
    } catch (error) {
      console.log("❌ 合约验证失败:", error.message);
    }
  }

  // 保存部署信息
  console.log("\n=================================");
  console.log("部署完成！");
  console.log("=================================");
  console.log("网络:", hre.network.name);
  console.log("合约地址:", nftAddress);
  console.log("部署者:", deployer.address);
  console.log("=================================\n");

  // 保存到文件
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: nftAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    config: {
      name: NFT_NAME,
      symbol: NFT_SYMBOL,
      baseURI: BASE_URI,
      maxSupply: MAX_SUPPLY,
      mintPrice: hre.ethers.formatEther(MINT_PRICE),
    },
  };

  const fileName = `deployment-${hre.network.name}-${Date.now()}.json`;
  fs.writeFileSync(fileName, JSON.stringify(deploymentInfo, null, 2));
  console.log("部署信息已保存到:", fileName);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
