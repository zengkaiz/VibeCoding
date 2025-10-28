# NFT Marketplace Frontend

这是一个基于 Next.js 的 NFT 市场前端应用，使用 RainbowKit 和 Wagmi 与智能合约交互。

## 功能特性

- 🎨 使用 RainbowKit 连接钱包
- ⚡ 支持多种钱包（MetaMask、WalletConnect 等）
- 🖼️ NFT 铸造功能
- 📱 响应式设计，支持移动端
- 🎭 查看用户拥有的 NFT 集合
- 💰 实时显示铸造价格和供应量

## 技术栈

- **Next.js 16** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **RainbowKit** - 钱包连接 UI
- **Wagmi** - React Hooks for Ethereum
- **Viem** - Ethereum 交互库
- **TanStack Query** - 数据获取和缓存

## 快速开始

### 1. 安装依赖

```bash
yarn install
```

### 2. 配置合约地址

编辑 `src/contracts/MyNFT.ts` 文件，更新合约地址：

```typescript
export const NFT_CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // 替换为您的合约地址
```

### 3. 配置 WalletConnect

编辑 `src/config/wagmi.ts` 文件，更新 Project ID：

1. 访问 [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. 创建新项目
3. 获取 Project ID
4. 替换 `YOUR_PROJECT_ID`

```typescript
export const config = getDefaultConfig({
  appName: "NFT Marketplace",
  projectId: "YOUR_PROJECT_ID", // 替换为您的 Project ID
  // ...
});
```

### 4. 启动开发服务器

```bash
yarn dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

## 项目结构

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # 根布局，包含 Web3 Provider
│   │   ├── page.tsx         # 主页面
│   │   └── globals.css      # 全局样式
│   ├── components/
│   │   ├── Web3Provider.tsx # Web3 上下文提供者
│   │   ├── NFTMint.tsx      # NFT 铸造组件
│   │   └── NFTGallery.tsx   # NFT 展示组件
│   ├── config/
│   │   └── wagmi.ts         # Wagmi 配置
│   └── contracts/
│       └── MyNFT.ts         # 合约 ABI 和地址
└── package.json
```

## 使用说明

### 连接钱包

1. 点击页面右上角的 "Connect Wallet" 按钮
2. 选择您的钱包（MetaMask、WalletConnect 等）
3. 在钱包中确认连接请求

### 铸造 NFT

1. 确保钱包已连接
2. 在 "Mint Your NFT" 区域输入 Token URI（元数据 JSON 文件的 URL）
3. 点击 "Mint NFT" 按钮
4. 在钱包中确认交易并支付 Gas 费用
5. 等待交易确认

### Token URI 格式

Token URI 应该指向一个包含以下格式的 JSON 文件：

```json
{
  "name": "My NFT #1",
  "description": "This is my first NFT",
  "image": "ipfs://YOUR_IMAGE_CID"
}
```

您可以使用 IPFS、Arweave 或任何其他存储服务。

### 查看 NFT 集合

连接钱包后，您的 NFT 集合会自动显示在 "Your Collection" 区域。

## 支持的网络

- Hardhat 本地网络（默认：http://127.0.0.1:8545）
- Sepolia 测试网

您可以在 `src/config/wagmi.ts` 中添加更多网络。

## 构建生产版本

```bash
yarn build
yarn start
```

## 常见问题

### 1. 钱包连接失败

- 确保您的钱包已安装并解锁
- 确保选择了正确的网络
- 检查 WalletConnect Project ID 是否正确

### 2. 交易失败

- 确保您的账户有足够的 ETH 支付铸造价格和 Gas 费用
- 确认合约地址正确
- 检查是否已达到最大供应量

### 3. NFT 不显示

- 确保 Token URI 可访问
- 检查元数据 JSON 格式是否正确
- 等待区块链确认（可能需要几秒钟）

## 下一步

- [ ] 添加 NFT 转移功能
- [ ] 实现批量铸造
- [ ] 添加 NFT 市场交易功能
- [ ] 集成 IPFS 上传
- [ ] 添加价格显示（USD）

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
