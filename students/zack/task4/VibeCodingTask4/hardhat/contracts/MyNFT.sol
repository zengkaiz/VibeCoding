// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MyNFT
 * @dev 标准 ERC721 NFT 合约，支持铸造和转移功能
 */
contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    // 当前 Token ID 计数器
    uint256 private _tokenIdCounter;

    // 最大供应量（可选，设置为0表示无限制）
    uint256 public maxSupply;

    // 铸造价格（单位：wei）
    uint256 public mintPrice;

    // 基础 URI，用于存储 NFT 元数据
    string private _baseTokenURI;

    // 事件
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event BaseURIUpdated(string newBaseURI);
    event MintPriceUpdated(uint256 newPrice);

    /**
     * @dev 构造函数
     * @param name NFT 集合名称
     * @param symbol NFT 集合符号
     * @param baseURI 基础 URI
     * @param _maxSupply 最大供应量（0 表示无限制）
     * @param _mintPrice 铸造价格（单位：wei）
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        uint256 _maxSupply,
        uint256 _mintPrice
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        _tokenIdCounter = 1; // 从 1 开始
    }

    /**
     * @dev 铸造新的 NFT（公共函数，任何人都可以调用）
     * @param to 接收 NFT 的地址
     * @param uri Token 的元数据 URI
     */
    function mint(address to, string memory uri) public payable {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(maxSupply == 0 || _tokenIdCounter <= maxSupply, "Max supply reached");
        require(to != address(0), "Cannot mint to zero address");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit NFTMinted(to, tokenId, uri);

        // 返还多余的 ETH
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }
    }

    /**
     * @dev 批量铸造 NFT
     * @param to 接收 NFT 的地址
     * @param uris Token 的元数据 URI 数组
     */
    function mintBatch(address to, string[] memory uris) public payable {
        uint256 amount = uris.length;
        require(msg.value >= mintPrice * amount, "Insufficient payment");
        require(maxSupply == 0 || _tokenIdCounter + amount - 1 <= maxSupply, "Max supply reached");
        require(to != address(0), "Cannot mint to zero address");

        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;

            _safeMint(to, tokenId);
            _setTokenURI(tokenId, uris[i]);

            emit NFTMinted(to, tokenId, uris[i]);
        }

        // 返还多余的 ETH
        uint256 totalCost = mintPrice * amount;
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    /**
     * @dev 仅所有者可以铸造（免费铸造，用于空投等场景）
     * @param to 接收 NFT 的地址
     * @param uri Token 的元数据 URI
     */
    function ownerMint(address to, string memory uri) public onlyOwner {
        require(maxSupply == 0 || _tokenIdCounter <= maxSupply, "Max supply reached");
        require(to != address(0), "Cannot mint to zero address");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit NFTMinted(to, tokenId, uri);
    }

    /**
     * @dev 转移 NFT（继承自 ERC721，已实现）
     * 用户可以使用以下函数：
     * - transferFrom(address from, address to, uint256 tokenId)
     * - safeTransferFrom(address from, address to, uint256 tokenId)
     * - safeTransferFrom(address from, address to, uint256 tokenId, bytes data)
     */

    /**
     * @dev 批准并转移 NFT（安全转移，推荐）
     * @param from 当前所有者地址
     * @param to 接收者地址
     * @param tokenId Token ID
     */
    function safeTransfer(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId);
    }

    /**
     * @dev 销毁 NFT
     * @param tokenId 要销毁的 Token ID
     */
    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only token owner can burn");
        _burn(tokenId);
    }

    /**
     * @dev 设置基础 URI
     * @param baseURI 新的基础 URI
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }

    /**
     * @dev 设置铸造价格
     * @param newPrice 新的铸造价格
     */
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }

    /**
     * @dev 提取合约余额到所有者地址
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }

    /**
     * @dev 获取总供应量
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    /**
     * @dev 获取某地址拥有的所有 Token ID
     * @param owner 所有者地址
     */
    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        uint256 index = 0;

        for (uint256 i = 1; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) == owner) {
                tokenIds[index] = i;
                index++;
            }
        }

        return tokenIds;
    }

    /**
     * @dev 重写 _baseURI 函数
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev 重写 tokenURI 函数以支持 URI 存储
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev 重写 supportsInterface 函数
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
