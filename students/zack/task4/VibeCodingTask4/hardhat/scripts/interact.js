const hre = require("hardhat");

// 替换为你部署的合约地址
const NFT_CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

async function main() {
  console.log("连接到 MyNFT 合约...");

  // 获取签名者
  const [owner, user1, user2] = await hre.ethers.getSigners();
  console.log("操作账户:", owner.address);

  // 连接到已部署的合约
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = MyNFT.attach(NFT_CONTRACT_ADDRESS);

  console.log("合约地址:", await nft.getAddress());
  console.log("合约名称:", await nft.name());
  console.log("合约符号:", await nft.symbol());

  // ============ 示例 1: 铸造 NFT ============
  console.log("\n========== 铸造 NFT ==========");

  const tokenURI1 = "ipfs://QmExample1/metadata.json";
  const mintPrice = await nft.mintPrice();

  console.log("铸造价格:", hre.ethers.formatEther(mintPrice), "ETH");
  console.log("正在铸造 NFT...");

  const mintTx = await nft.mint(owner.address, tokenURI1, {
    value: mintPrice,
  });
  await mintTx.wait();

  console.log("✅ NFT 铸造成功！交易哈希:", mintTx.hash);

  // 获取 Token ID（通常是当前总供应量）
  const totalSupply = await nft.totalSupply();
  console.log("当前总供应量:", totalSupply.toString());

  // ============ 示例 2: 批量铸造 NFT ============
  console.log("\n========== 批量铸造 NFT ==========");

  const tokenURIs = [
    "ipfs://QmExample2/metadata.json",
    "ipfs://QmExample3/metadata.json",
    "ipfs://QmExample4/metadata.json",
  ];

  const batchMintPrice = mintPrice * BigInt(tokenURIs.length);
  console.log("批量铸造价格:", hre.ethers.formatEther(batchMintPrice), "ETH");

  const batchMintTx = await nft.mintBatch(owner.address, tokenURIs, {
    value: batchMintPrice,
  });
  await batchMintTx.wait();

  console.log("✅ 批量铸造成功！交易哈希:", batchMintTx.hash);
  console.log("新的总供应量:", (await nft.totalSupply()).toString());

  // ============ 示例 3: 查询 NFT 信息 ============
  console.log("\n========== 查询 NFT 信息 ==========");

  const tokenId = 1; // 查询第一个 NFT
  const tokenOwner = await nft.ownerOf(tokenId);
  const tokenUri = await nft.tokenURI(tokenId);

  console.log(`Token ID ${tokenId}:`);
  console.log("- 所有者:", tokenOwner);
  console.log("- Token URI:", tokenUri);

  // 查询地址拥有的所有 NFT
  const ownerTokens = await nft.tokensOfOwner(owner.address);
  console.log(`\n${owner.address} 拥有的 Token IDs:`, ownerTokens.map(id => id.toString()));

  // 查询余额
  const balance = await nft.balanceOf(owner.address);
  console.log("NFT 余额:", balance.toString());

  // ============ 示例 4: 转移 NFT ============
  console.log("\n========== 转移 NFT ==========");

  // 如果有多个签名者，转移给 user1
  if (user1) {
    console.log(`将 Token ${tokenId} 从 ${owner.address} 转移到 ${user1.address}`);

    const transferTx = await nft.safeTransferFrom(
      owner.address,
      user1.address,
      tokenId
    );
    await transferTx.wait();

    console.log("✅ NFT 转移成功！交易哈希:", transferTx.hash);

    // 验证转移
    const newOwner = await nft.ownerOf(tokenId);
    console.log(`Token ${tokenId} 的新所有者:`, newOwner);
    console.log("转移验证:", newOwner === user1.address ? "✅ 成功" : "❌ 失败");
  }

  // ============ 示例 5: 授权和转移 ============
  console.log("\n========== 授权和转移 ==========");

  if (user1 && user2) {
    const tokenId2 = 2; // 使用第二个 Token

    // 授权 user2 可以转移 tokenId2
    console.log(`授权 ${user2.address} 可以转移 Token ${tokenId2}`);
    const approveTx = await nft.approve(user2.address, tokenId2);
    await approveTx.wait();
    console.log("✅ 授权成功");

    // 查询授权
    const approved = await nft.getApproved(tokenId2);
    console.log(`Token ${tokenId2} 的授权地址:`, approved);

    // user2 可以转移该 NFT
    // const nftAsUser2 = nft.connect(user2);
    // await nftAsUser2.transferFrom(owner.address, user2.address, tokenId2);
  }

  // ============ 示例 6: 销毁 NFT ============
  console.log("\n========== 销毁 NFT ==========");

  const tokenToBurn = 3; // 假设要销毁第3个 Token

  try {
    // 检查是否拥有该 Token
    const burnOwner = await nft.ownerOf(tokenToBurn);
    if (burnOwner === owner.address) {
      console.log(`正在销毁 Token ${tokenToBurn}...`);
      const burnTx = await nft.burn(tokenToBurn);
      await burnTx.wait();
      console.log("✅ NFT 销毁成功！交易哈希:", burnTx.hash);
    } else {
      console.log("⚠️  不拥有该 Token，无法销毁");
    }
  } catch (error) {
    console.log("⚠️  Token 不存在或无法销毁:", error.message);
  }

  // ============ 总结 ============
  console.log("\n========== 总结 ==========");
  console.log("最终总供应量:", (await nft.totalSupply()).toString());
  console.log("合约余额:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(await nft.getAddress())), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
