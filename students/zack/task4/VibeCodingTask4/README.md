# NFT Marketplace - 完整项目

这是一个完整的 NFT 市场 DApp，包含智能合约和前端应用。

## 项目结构

```
VibeCodingTask4/
├── my-hardhat-project/     # 智能合约项目（Hardhat）
│   ├── contracts/          # Solidity 智能合约
│   │   └── MyNFT.sol      # NFT 合约
│   ├── scripts/           # 部署脚本
│   ├── test/              # 合约测试
│   └── hardhat.config.js  # Hardhat 配置
│
└── frontend/              # Next.js 前端应用
    ├── src/
    │   ├── app/          # Next.js 页面
    │   ├── components/   # React 组件
    │   ├── config/       # 配置文件
    │   └── contracts/    # 合约 ABI 和地址
    └── package.json
```

## 快速开始

### 1. 部署智能合约

```bash
cd my-hardhat-project
npm install
npx hardhat compile
npx hardhat node  # 启动本地节点

# 在另一个终端窗口
npx hardhat run scripts/deploy.js --network localhost
```

记录部署的合约地址。

### 2. 配置前端

```bash
cd frontend
yarn install
```

编辑 `frontend/src/contracts/MyNFT.ts`，更新合约地址：

```typescript
export const NFT_CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 3. 启动前端

```bash
cd frontend
yarn dev
```

访问 http://localhost:3000

## 功能特性

### 智能合约 (MyNFT.sol)

- ✅ 标准 ERC721 NFT
- ✅ 付费铸造功能
- ✅ 批量铸造
- ✅ 所有者特权铸造（空投）
- ✅ 可配置的铸造价格和最大供应量
- ✅ NFT 转移和销毁
- ✅ 查询用户拥有的所有 NFT

### 前端应用

- 🎨 使用 RainbowKit 连接多种钱包
- 🖼️ NFT 铸造界面
- 📱 响应式设计
- 🎭 NFT 集合展示
- 💰 实时显示铸造价格和供应量
- ⚡ 交易状态追踪

## 技术栈

### 后端/智能合约
- Solidity ^0.8.28
- Hardhat
- OpenZeppelin Contracts
- Ethers.js

### 前端
- Next.js 16
- TypeScript
- RainbowKit
- Wagmi
- Viem
- Tailwind CSS

## 使用说明

### 连接钱包

1. 确保安装了 MetaMask 或其他 Web3 钱包
2. 切换到正确的网络（Hardhat 本地网络或 Sepolia 测试网）
3. 点击 "Connect Wallet" 按钮

### 铸造 NFT

1. 准备 NFT 元数据 JSON 文件（可以上传到 IPFS）
2. 在铸造界面输入 Token URI
3. 确认交易并支付 Gas 费用
4. 等待交易确认

### Token URI 示例

```json
{
  "name": "My Awesome NFT",
  "description": "This is a unique digital collectible",
  "image": "ipfs://QmXxx..."
}
```

## 开发指南

### 修改智能合约

```bash
cd my-hardhat-project
# 编辑 contracts/MyNFT.sol
npx hardhat compile
npx hardhat test
```

### 重新部署

```bash
npx hardhat run scripts/deploy.js --network localhost
# 更新前端的合约地址
```

### 前端开发

```bash
cd frontend
yarn dev
```

## 常见问题

### 1. 合约部署失败

- 确保 Hardhat 节点正在运行
- 检查 Gas 限制
- 验证构造函数参数

### 2. 前端连接失败

- 确保钱包连接到正确的网络
- 验证合约地址是否正确
- 检查 WalletConnect Project ID

### 3. 交易失败

- 确保账户有足够的 ETH
- 检查铸造价格是否正确
- 验证是否达到最大供应量

## 测试网部署

### Sepolia 测试网

1. 获取 Sepolia 测试 ETH：https://sepoliafaucet.com/
2. 配置 Hardhat 网络
3. 部署合约
4. 更新前端配置

## 安全注意事项

- 🔒 私钥不要提交到 Git
- 🔒 使用环境变量存储敏感信息
- 🔒 在主网部署前进行充分测试
- 🔒 考虑进行智能合约审计

## 下一步开发

- [ ] 添加 NFT 二级市场交易
- [ ] 实现拍卖功能
- [ ] 集成 IPFS 上传
- [ ] 添加稀有度系统
- [ ] 实现白名单功能
- [ ] 添加版税分配

## 许可证

MIT

## 支持

如有问题，请查看文档或提交 Issue。
