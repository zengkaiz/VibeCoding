# MyNFT - ERC721 NFT 智能合约

一个功能完整的 ERC721 NFT 智能合约，支持铸造、转移、销毁等功能。

## 合约特性

### 核心功能
- ✅ 标准 ERC721 实现
- ✅ 公开铸造（支付 ETH）
- ✅ 批量铸造
- ✅ 所有者免费铸造（空投）
- ✅ NFT 转移
- ✅ NFT 销毁
- ✅ Token URI 支持（IPFS 元数据）

### 管理功能
- ✅ 设置铸造价格
- ✅ 设置最大供应量
- ✅ 更新基础 URI
- ✅ 提取合约余额
- ✅ 所有者权限控制

### 查询功能
- ✅ 查询用户拥有的所有 NFT
- ✅ 查询总供应量
- ✅ 查询 NFT 所有者
- ✅ 查询授权信息

## 合约结构

```
contracts/
├── MyNFT.sol          # 主合约
scripts/
├── deploy.js          # 部署脚本
└── interact.js        # 交互脚本
test/
└── MyNFT.test.js      # 测试文件（36个测试用例）
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入：
# - PRIVATE_KEY: 你的钱包私钥
# - INFURA_API_KEY: Infura API Key
# - ETHERSCAN_API_KEY: Etherscan API Key
```

### 3. 编译合约

```bash
npx hardhat compile
```

### 4. 运行测试

```bash
# 运行所有测试
npx hardhat test

# 运行 NFT 合约测试
npx hardhat test test/MyNFT.test.js

# 查看测试覆盖率
npx hardhat coverage
```

## 部署合约

### 部署到本地网络

```bash
# 启动本地节点
npx hardhat node

# 在另一个终端部署
npx hardhat run scripts/deploy.js --network localhost
```

### 部署到 Sepolia 测试网

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 部署到以太坊主网

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## 使用合约

### 1. 修改部署参数

编辑 `scripts/deploy.js` 文件：

```javascript
const NFT_NAME = "My Awesome NFT";       // NFT 集合名称
const NFT_SYMBOL = "MANFT";              // NFT 符号
const BASE_URI = "ipfs://QmYourBaseURI/"; // IPFS 基础 URI
const MAX_SUPPLY = 10000;                // 最大供应量（0 = 无限制）
const MINT_PRICE = ethers.parseEther("0.01"); // 铸造价格
```

### 2. 与合约交互

修改 `scripts/interact.js` 中的合约地址，然后运行：

```bash
npx hardhat run scripts/interact.js --network sepolia
```

### 3. 使用 Hardhat Console

```bash
# 连接到 Sepolia 测试网
npx hardhat console --network sepolia

# 在控制台中操作
> const MyNFT = await ethers.getContractFactory("MyNFT");
> const nft = MyNFT.attach("YOUR_CONTRACT_ADDRESS");
> await nft.name();
> await nft.totalSupply();
```

## 合约接口

### 铸造功能

```solidity
// 公开铸造（支付 ETH）
function mint(address to, string memory uri) public payable

// 批量铸造
function mintBatch(address to, string[] memory uris) public payable

// 所有者免费铸造
function ownerMint(address to, string memory uri) public onlyOwner
```

### 转移功能

```solidity
// 标准转移
function transferFrom(address from, address to, uint256 tokenId) public

// 安全转移
function safeTransferFrom(address from, address to, uint256 tokenId) public

// 便捷安全转移
function safeTransfer(address from, address to, uint256 tokenId) public
```

### 授权功能

```solidity
// 授权单个 NFT
function approve(address to, uint256 tokenId) public

// 授权所有 NFT
function setApprovalForAll(address operator, bool approved) public

// 查询授权
function getApproved(uint256 tokenId) public view returns (address)
function isApprovedForAll(address owner, address operator) public view returns (bool)
```

### 销毁功能

```solidity
// 销毁 NFT
function burn(uint256 tokenId) public
```

### 查询功能

```solidity
// 查询所有者
function ownerOf(uint256 tokenId) public view returns (address)

// 查询余额
function balanceOf(address owner) public view returns (uint256)

// 查询 Token URI
function tokenURI(uint256 tokenId) public view returns (string memory)

// 查询总供应量
function totalSupply() public view returns (uint256)

// 查询用户的所有 NFT
function tokensOfOwner(address owner) public view returns (uint256[] memory)
```

### 管理功能（仅所有者）

```solidity
// 设置基础 URI
function setBaseURI(string memory baseURI) public onlyOwner

// 设置铸造价格
function setMintPrice(uint256 newPrice) public onlyOwner

// 提取合约余额
function withdraw() public onlyOwner
```

## 使用示例

### JavaScript/TypeScript

```javascript
const { ethers } = require("hardhat");

// 连接到合约
const nft = await ethers.getContractAt("MyNFT", contractAddress);

// 铸造 NFT
const mintPrice = await nft.mintPrice();
await nft.mint(userAddress, "metadata1.json", { value: mintPrice });

// 批量铸造
const uris = ["uri1.json", "uri2.json", "uri3.json"];
const batchPrice = mintPrice * BigInt(uris.length);
await nft.mintBatch(userAddress, uris, { value: batchPrice });

// 转移 NFT
await nft.safeTransferFrom(fromAddress, toAddress, tokenId);

// 查询用户的 NFT
const tokenIds = await nft.tokensOfOwner(userAddress);
console.log("用户拥有的 NFT:", tokenIds);

// 查询 NFT 信息
const owner = await nft.ownerOf(tokenId);
const uri = await nft.tokenURI(tokenId);
const totalSupply = await nft.totalSupply();
```

## 元数据格式

NFT 元数据应该遵循 OpenSea 标准：

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "ipfs://QmImageHash",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Rarity",
      "value": "Common"
    }
  ]
}
```

## 安全考虑

1. ⚠️ 私钥安全：永远不要分享或提交 `.env` 文件
2. ⚠️ 主网部署：部署到主网前请充分测试
3. ⚠️ 审计建议：建议在主网部署前进行安全审计
4. ⚠️ 测试网测试：先在测试网（Sepolia）上完整测试所有功能

## 测试覆盖

合约包含 36 个测试用例，覆盖：

- ✅ 部署测试（5个）
- ✅ 铸造功能（8个）
- ✅ 批量铸造（3个）
- ✅ 所有者铸造（2个）
- ✅ 转移功能（6个）
- ✅ 销毁功能（2个）
- ✅ 查询功能（3个）
- ✅ 管理功能（7个）

所有测试 100% 通过！

## Gas 优化

合约已进行基本的 Gas 优化：

- 使用 `uint256` 而不是 `uint8`
- 批量操作减少交易次数
- 合理使用存储和内存
- 开启 Solidity 优化器（200 runs）

## 许可证

MIT License

## 支持

如有问题，请联系开发团队或提交 Issue。
