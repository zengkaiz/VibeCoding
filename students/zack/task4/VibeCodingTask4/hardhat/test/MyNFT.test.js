const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT Contract", function () {
  let nft;
  let owner;
  let addr1;
  let addr2;

  const NFT_NAME = "My Awesome NFT";
  const NFT_SYMBOL = "MANFT";
  const BASE_URI = "ipfs://QmTest/";
  const MAX_SUPPLY = 100;
  const MINT_PRICE = ethers.parseEther("0.01");

  beforeEach(async function () {
    // 获取测试账户
    [owner, addr1, addr2] = await ethers.getSigners();

    // 部署合约
    const MyNFT = await ethers.getContractFactory("MyNFT");
    nft = await MyNFT.deploy(NFT_NAME, NFT_SYMBOL, BASE_URI, MAX_SUPPLY, MINT_PRICE);
    await nft.waitForDeployment();
  });

  describe("部署测试", function () {
    it("应该设置正确的名称和符号", async function () {
      expect(await nft.name()).to.equal(NFT_NAME);
      expect(await nft.symbol()).to.equal(NFT_SYMBOL);
    });

    it("应该设置正确的所有者", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("应该设置正确的最大供应量", async function () {
      expect(await nft.maxSupply()).to.equal(MAX_SUPPLY);
    });

    it("应该设置正确的铸造价格", async function () {
      expect(await nft.mintPrice()).to.equal(MINT_PRICE);
    });

    it("初始总供应量应该为 0", async function () {
      expect(await nft.totalSupply()).to.equal(0);
    });
  });

  describe("铸造功能测试", function () {
    const tokenURI = "metadata1.json";

    it("应该能够成功铸造 NFT", async function () {
      await nft.mint(addr1.address, tokenURI, { value: MINT_PRICE });

      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
      expect(await nft.totalSupply()).to.equal(1);
    });

    it("应该能够铸造多个 NFT", async function () {
      await nft.mint(addr1.address, "uri1.json", { value: MINT_PRICE });
      await nft.mint(addr1.address, "uri2.json", { value: MINT_PRICE });
      await nft.mint(addr2.address, "uri3.json", { value: MINT_PRICE });

      expect(await nft.balanceOf(addr1.address)).to.equal(2);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.totalSupply()).to.equal(3);
    });

    it("应该拒绝支付金额不足的铸造", async function () {
      const insufficientPayment = ethers.parseEther("0.005");

      await expect(
        nft.mint(addr1.address, tokenURI, { value: insufficientPayment })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("应该拒绝铸造到零地址", async function () {
      await expect(
        nft.mint(ethers.ZeroAddress, tokenURI, { value: MINT_PRICE })
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("应该在达到最大供应量时拒绝铸造", async function () {
      // 创建一个小的最大供应量的合约
      const MyNFT = await ethers.getContractFactory("MyNFT");
      const smallNFT = await MyNFT.deploy(NFT_NAME, NFT_SYMBOL, BASE_URI, 2, MINT_PRICE);
      await smallNFT.waitForDeployment();

      // 铸造到最大供应量
      await smallNFT.mint(addr1.address, "uri1.json", { value: MINT_PRICE });
      await smallNFT.mint(addr1.address, "uri2.json", { value: MINT_PRICE });

      // 尝试铸造第三个应该失败
      await expect(
        smallNFT.mint(addr1.address, "uri3.json", { value: MINT_PRICE })
      ).to.be.revertedWith("Max supply reached");
    });

    it("应该返还多余的支付", async function () {
      const overpayment = ethers.parseEther("0.05");
      const initialBalance = await ethers.provider.getBalance(addr1.address);

      const tx = await nft.connect(addr1).mint(addr1.address, tokenURI, {
        value: overpayment,
      });
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalBalance = await ethers.provider.getBalance(addr1.address);

      // 最终余额应该是初始余额减去铸造价格和 gas 费用
      const expectedBalance = initialBalance - MINT_PRICE - gasUsed;
      expect(finalBalance).to.be.closeTo(expectedBalance, ethers.parseEther("0.0001"));
    });

    it("应该正确设置 Token URI", async function () {
      await nft.mint(addr1.address, tokenURI, { value: MINT_PRICE });
      const tokenId = 1;

      expect(await nft.tokenURI(tokenId)).to.equal(BASE_URI + tokenURI);
    });

    it("应该触发 NFTMinted 事件", async function () {
      await expect(nft.mint(addr1.address, tokenURI, { value: MINT_PRICE }))
        .to.emit(nft, "NFTMinted")
        .withArgs(addr1.address, 1, tokenURI);
    });
  });

  describe("批量铸造功能测试", function () {
    const tokenURIs = ["uri1.json", "uri2.json", "uri3.json"];
    const batchPrice = MINT_PRICE * BigInt(tokenURIs.length);

    it("应该能够批量铸造 NFT", async function () {
      await nft.mintBatch(addr1.address, tokenURIs, { value: batchPrice });

      expect(await nft.balanceOf(addr1.address)).to.equal(3);
      expect(await nft.totalSupply()).to.equal(3);
    });

    it("应该拒绝批量铸造时支付金额不足", async function () {
      await expect(
        nft.mintBatch(addr1.address, tokenURIs, { value: MINT_PRICE })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("批量铸造应该设置正确的 Token URI", async function () {
      await nft.mintBatch(addr1.address, tokenURIs, { value: batchPrice });

      for (let i = 0; i < tokenURIs.length; i++) {
        expect(await nft.tokenURI(i + 1)).to.equal(BASE_URI + tokenURIs[i]);
      }
    });
  });

  describe("所有者铸造功能测试", function () {
    it("所有者应该能够免费铸造", async function () {
      await nft.ownerMint(addr1.address, "owner-mint.json");

      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
    });

    it("非所有者不应该能够调用 ownerMint", async function () {
      await expect(
        nft.connect(addr1).ownerMint(addr1.address, "owner-mint.json")
      ).to.be.reverted;
    });
  });

  describe("转移功能测试", function () {
    beforeEach(async function () {
      // 先铸造一个 NFT
      await nft.mint(addr1.address, "transfer-test.json", { value: MINT_PRICE });
    });

    it("应该能够转移 NFT", async function () {
      await nft.connect(addr1).transferFrom(addr1.address, addr2.address, 1);

      expect(await nft.ownerOf(1)).to.equal(addr2.address);
      expect(await nft.balanceOf(addr1.address)).to.equal(0);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
    });

    it("应该能够使用 safeTransferFrom 转移 NFT", async function () {
      await nft.connect(addr1).safeTransferFrom(addr1.address, addr2.address, 1);

      expect(await nft.ownerOf(1)).to.equal(addr2.address);
    });

    it("应该能够使用 safeTransfer 转移 NFT", async function () {
      await nft.connect(addr1).safeTransfer(addr1.address, addr2.address, 1);

      expect(await nft.ownerOf(1)).to.equal(addr2.address);
    });

    it("非所有者不应该能够转移 NFT", async function () {
      await expect(
        nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1)
      ).to.be.reverted;
    });

    it("应该能够授权和转移 NFT", async function () {
      // addr1 授权 addr2 可以转移 token 1
      await nft.connect(addr1).approve(addr2.address, 1);

      expect(await nft.getApproved(1)).to.equal(addr2.address);

      // addr2 现在可以转移该 NFT
      await nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1);

      expect(await nft.ownerOf(1)).to.equal(addr2.address);
    });

    it("应该能够批准所有 NFT 给操作员", async function () {
      await nft.mint(addr1.address, "token2.json", { value: MINT_PRICE });

      await nft.connect(addr1).setApprovalForAll(addr2.address, true);

      expect(await nft.isApprovedForAll(addr1.address, addr2.address)).to.be.true;

      // addr2 可以转移 addr1 的所有 NFT
      await nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1);
      await nft.connect(addr2).transferFrom(addr1.address, addr2.address, 2);

      expect(await nft.balanceOf(addr2.address)).to.equal(2);
    });
  });

  describe("销毁功能测试", function () {
    beforeEach(async function () {
      await nft.mint(addr1.address, "burn-test.json", { value: MINT_PRICE });
    });

    it("所有者应该能够销毁自己的 NFT", async function () {
      await nft.connect(addr1).burn(1);

      await expect(nft.ownerOf(1)).to.be.reverted;
      expect(await nft.balanceOf(addr1.address)).to.equal(0);
    });

    it("非所有者不应该能够销毁 NFT", async function () {
      await expect(nft.connect(addr2).burn(1)).to.be.revertedWith(
        "Only token owner can burn"
      );
    });
  });

  describe("查询功能测试", function () {
    beforeEach(async function () {
      await nft.mint(addr1.address, "query1.json", { value: MINT_PRICE });
      await nft.mint(addr1.address, "query2.json", { value: MINT_PRICE });
      await nft.mint(addr2.address, "query3.json", { value: MINT_PRICE });
    });

    it("应该正确返回用户拥有的所有 Token ID", async function () {
      const addr1Tokens = await nft.tokensOfOwner(addr1.address);
      const addr2Tokens = await nft.tokensOfOwner(addr2.address);

      expect(addr1Tokens.length).to.equal(2);
      expect(addr1Tokens[0]).to.equal(1);
      expect(addr1Tokens[1]).to.equal(2);

      expect(addr2Tokens.length).to.equal(1);
      expect(addr2Tokens[0]).to.equal(3);
    });

    it("应该正确返回总供应量", async function () {
      expect(await nft.totalSupply()).to.equal(3);
    });

    it("应该支持 ERC721 接口", async function () {
      // ERC721 接口 ID: 0x80ac58cd
      expect(await nft.supportsInterface("0x80ac58cd")).to.be.true;
    });
  });

  describe("管理功能测试", function () {
    it("所有者应该能够更新基础 URI", async function () {
      const newBaseURI = "ipfs://QmNewBase/";

      await expect(nft.setBaseURI(newBaseURI))
        .to.emit(nft, "BaseURIUpdated")
        .withArgs(newBaseURI);

      await nft.mint(addr1.address, "new.json", { value: MINT_PRICE });
      expect(await nft.tokenURI(1)).to.equal(newBaseURI + "new.json");
    });

    it("非所有者不应该能够更新基础 URI", async function () {
      await expect(nft.connect(addr1).setBaseURI("ipfs://hack/")).to.be.reverted;
    });

    it("所有者应该能够更新铸造价格", async function () {
      const newPrice = ethers.parseEther("0.05");

      await expect(nft.setMintPrice(newPrice))
        .to.emit(nft, "MintPriceUpdated")
        .withArgs(newPrice);

      expect(await nft.mintPrice()).to.equal(newPrice);
    });

    it("非所有者不应该能够更新铸造价格", async function () {
      await expect(
        nft.connect(addr1).setMintPrice(ethers.parseEther("0.05"))
      ).to.be.reverted;
    });

    it("所有者应该能够提取合约余额", async function () {
      // 铸造几个 NFT 以积累余额
      await nft.mint(addr1.address, "withdraw1.json", { value: MINT_PRICE });
      await nft.mint(addr2.address, "withdraw2.json", { value: MINT_PRICE });

      const contractBalance = await ethers.provider.getBalance(await nft.getAddress());
      expect(contractBalance).to.equal(MINT_PRICE * BigInt(2));

      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

      const tx = await nft.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

      expect(ownerBalanceAfter).to.be.closeTo(
        ownerBalanceBefore + contractBalance - gasUsed,
        ethers.parseEther("0.0001")
      );

      expect(await ethers.provider.getBalance(await nft.getAddress())).to.equal(0);
    });

    it("当合约余额为 0 时提取应该失败", async function () {
      await expect(nft.withdraw()).to.be.revertedWith("No balance to withdraw");
    });

    it("非所有者不应该能够提取", async function () {
      await nft.mint(addr1.address, "test.json", { value: MINT_PRICE });

      await expect(nft.connect(addr1).withdraw()).to.be.reverted;
    });
  });
});
