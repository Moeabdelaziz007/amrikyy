import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Shield, 
  Key, 
  Lock, 
  Unlock, 
  Link, 
  Coins,
  Wallet,
  Send,
  Download,
  History,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Settings,
  RefreshCw,
  Upload,
  Eye,
  EyeOff,
  Copy,
  QrCode,
  Scan,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  Clock,
  Calendar,
  Hash,
  Database,
  Network,
  Globe,
  Zap,
  Star,
  Award,
  Trophy,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Box,
  Package,
  Truck,
  Factory,
  Building,
  Home,
  Car,
  Smartphone,
  Laptop,
  Monitor
} from 'lucide-react';

interface BlockchainNetwork {
  id: string;
  name: string;
  type: 'mainnet' | 'testnet' | 'private';
  currency: string;
  symbol: string;
  blockHeight: number;
  hashRate: string;
  difficulty: string;
  status: 'active' | 'syncing' | 'error';
  nodes: number;
  lastBlock: Date;
  avgBlockTime: number;
  gasPrice: string;
  gasLimit: string;
}

interface Wallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  currency: string;
  type: 'hot' | 'cold' | 'hardware';
  network: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed: Date;
  transactions: number;
}

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  gasUsed: number;
  gasPrice: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber: number;
  timestamp: Date;
  type: 'send' | 'receive' | 'contract' | 'mint' | 'burn';
  description: string;
}

interface SmartContract {
  id: string;
  name: string;
  address: string;
  network: string;
  abi: any[];
  bytecode: string;
  creator: string;
  deployedAt: Date;
  functions: ContractFunction[];
  events: ContractEvent[];
  balance: number;
  isVerified: boolean;
}

interface ContractFunction {
  name: string;
  inputs: any[];
  outputs: any[];
  stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
  gas: number;
}

interface ContractEvent {
  name: string;
  inputs: any[];
  anonymous: boolean;
}

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  tokenId: string;
  contract: string;
  owner: string;
  creator: string;
  network: string;
  standard: 'ERC-721' | 'ERC-1155' | 'ERC-20';
  price: number;
  currency: string;
  isListed: boolean;
  createdAt: Date;
  metadata: Record<string, any>;
}

interface DeFiProtocol {
  id: string;
  name: string;
  type: 'lending' | 'borrowing' | 'staking' | 'yield-farming' | 'dex' | 'insurance';
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  network: string;
  tokens: string[];
  isActive: boolean;
  description: string;
}

export const BlockchainFeatures: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'networks' | 'wallets' | 'transactions' | 'contracts' | 'nfts' | 'defi'>('networks');
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('ethereum');

  // Mock data - in production, this would come from blockchain APIs
  const [networks] = useState<BlockchainNetwork[]>([
    {
      id: 'ethereum',
      name: 'Ethereum',
      type: 'mainnet',
      currency: 'Ether',
      symbol: 'ETH',
      blockHeight: 18500000,
      hashRate: '850 TH/s',
      difficulty: '12.5P',
      status: 'active',
      nodes: 8500,
      lastBlock: new Date(Date.now() - 12 * 1000),
      avgBlockTime: 12,
      gasPrice: '20 Gwei',
      gasLimit: '30,000,000'
    },
    {
      id: 'polygon',
      name: 'Polygon',
      type: 'mainnet',
      currency: 'MATIC',
      symbol: 'MATIC',
      blockHeight: 45000000,
      hashRate: 'N/A',
      difficulty: 'N/A',
      status: 'active',
      nodes: 100,
      lastBlock: new Date(Date.now() - 2 * 1000),
      avgBlockTime: 2,
      gasPrice: '30 Gwei',
      gasLimit: '30,000,000'
    },
    {
      id: 'binance',
      name: 'Binance Smart Chain',
      type: 'mainnet',
      currency: 'BNB',
      symbol: 'BNB',
      blockHeight: 32000000,
      hashRate: 'N/A',
      difficulty: 'N/A',
      status: 'active',
      nodes: 21,
      lastBlock: new Date(Date.now() - 3 * 1000),
      avgBlockTime: 3,
      gasPrice: '5 Gwei',
      gasLimit: '140,000,000'
    }
  ]);

  const [wallets] = useState<Wallet[]>([
    {
      id: '1',
      name: 'Main Wallet',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      balance: 2.5,
      currency: 'ETH',
      type: 'hot',
      network: 'ethereum',
      isActive: true,
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      transactions: 156
    },
    {
      id: '2',
      name: 'DeFi Wallet',
      address: '0x8ba1f109551bD432803012645Hac136c4C8C3C5',
      balance: 1250.75,
      currency: 'USDC',
      type: 'hot',
      network: 'polygon',
      isActive: true,
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000),
      transactions: 89
    },
    {
      id: '3',
      name: 'Cold Storage',
      address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
      balance: 15.2,
      currency: 'ETH',
      type: 'cold',
      network: 'ethereum',
      isActive: false,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      transactions: 23
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      hash: '0x1234567890abcdef1234567890abcdef12345678',
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      to: '0x8ba1f109551bD432803012645Hac136c4C8C3C5',
      amount: 0.5,
      currency: 'ETH',
      gasUsed: 21000,
      gasPrice: 20,
      status: 'confirmed',
      blockNumber: 18500001,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'send',
      description: 'Payment for services'
    },
    {
      id: '2',
      hash: '0xabcdef1234567890abcdef1234567890abcdef12',
      from: '0x8ba1f109551bD432803012645Hac136c4C8C3C5',
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      amount: 100,
      currency: 'USDC',
      gasUsed: 65000,
      gasPrice: 30,
      status: 'pending',
      blockNumber: 0,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'receive',
      description: 'Salary payment'
    },
    {
      id: '3',
      hash: '0x567890abcdef1234567890abcdef1234567890ab',
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      to: '0xContractAddress1234567890abcdef1234567890',
      amount: 0,
      currency: 'ETH',
      gasUsed: 150000,
      gasPrice: 25,
      status: 'confirmed',
      blockNumber: 18500000,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'contract',
      description: 'Smart contract interaction'
    }
  ]);

  const [smartContracts] = useState<SmartContract[]>([
    {
      id: '1',
      name: 'Token Contract',
      address: '0xContractAddress1234567890abcdef1234567890',
      network: 'ethereum',
      abi: [],
      bytecode: '0x608060405234801561001057600080fd5b50...',
      creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      deployedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      functions: [
        {
          name: 'transfer',
          inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
          outputs: [{ name: 'success', type: 'bool' }],
          stateMutability: 'nonpayable',
          gas: 21000
        }
      ],
      events: [
        {
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false }
          ],
          anonymous: false
        }
      ],
      balance: 0.1,
      isVerified: true
    }
  ]);

  const [nfts] = useState<NFT[]>([
    {
      id: '1',
      name: 'Amrikyy AIOS Avatar',
      description: 'Unique avatar for Amrikyy AIOS System',
      image: '/api/placeholder/300/300',
      tokenId: '1',
      contract: '0xNFTContract1234567890abcdef1234567890',
      owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      network: 'ethereum',
      standard: 'ERC-721',
      price: 0.5,
      currency: 'ETH',
      isListed: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      metadata: { rarity: 'legendary', attributes: ['AI', 'System', 'Avatar'] }
    },
    {
      id: '2',
      name: 'Digital Art Collection #1',
      description: 'Generative art piece from AI collection',
      image: '/api/placeholder/300/300',
      tokenId: '42',
      contract: '0xArtContract1234567890abcdef1234567890',
      owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      creator: '0xArtistAddress1234567890abcdef1234567890',
      network: 'polygon',
      standard: 'ERC-721',
      price: 0,
      currency: 'MATIC',
      isListed: false,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      metadata: { rarity: 'rare', attributes: ['Art', 'AI', 'Generative'] }
    }
  ]);

  const [defiProtocols] = useState<DeFiProtocol[]>([
    {
      id: '1',
      name: 'Compound',
      type: 'lending',
      apy: 3.2,
      tvl: 2500000000,
      risk: 'low',
      network: 'ethereum',
      tokens: ['USDC', 'USDT', 'DAI'],
      isActive: true,
      description: 'Decentralized lending protocol'
    },
    {
      id: '2',
      name: 'Uniswap V3',
      type: 'dex',
      apy: 15.8,
      tvl: 4500000000,
      risk: 'medium',
      network: 'ethereum',
      tokens: ['ETH', 'USDC', 'WBTC'],
      isActive: true,
      description: 'Decentralized exchange with concentrated liquidity'
    },
    {
      id: '3',
      name: 'Aave',
      type: 'lending',
      apy: 4.1,
      tvl: 1800000000,
      risk: 'low',
      network: 'polygon',
      tokens: ['MATIC', 'USDC', 'DAI'],
      isActive: true,
      description: 'Decentralized lending and borrowing'
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case 'ethereum': return <Globe className="w-4 h-4" />;
      case 'polygon': return <Layers className="w-4 h-4" />;
      case 'binance': return <Coins className="w-4 h-4" />;
      default: return <Network className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'syncing': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'confirmed': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUp className="w-4 h-4 text-red-500" />;
      case 'receive': return <ArrowDown className="w-4 h-4 text-green-500" />;
      case 'contract': return <Box className="w-4 h-4 text-blue-500" />;
      case 'mint': return <Plus className="w-4 h-4 text-green-500" />;
      case 'burn': return <Minus className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'hot': return <Wallet className="w-4 h-4" />;
      case 'cold': return <Shield className="w-4 h-4" />;
      case 'hardware': return <Key className="w-4 h-4" />;
      default: return <Wallet className="w-4 h-4" />;
    }
  };

  const getDeFiIcon = (type: string) => {
    switch (type) {
      case 'lending': return <TrendingUp className="w-4 h-4" />;
      case 'borrowing': return <TrendingDown className="w-4 h-4" />;
      case 'staking': return <Lock className="w-4 h-4" />;
      case 'yield-farming': return <Zap className="w-4 h-4" />;
      case 'dex': return <BarChart3 className="w-4 h-4" />;
      case 'insurance': return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toFixed(4)} ${currency}`;
  };

  const formatTVL = (tvl: number) => {
    if (tvl >= 1000000000) {
      return `$${(tvl / 1000000000).toFixed(1)}B`;
    } else if (tvl >= 1000000) {
      return `$${(tvl / 1000000).toFixed(1)}M`;
    } else if (tvl >= 1000) {
      return `$${(tvl / 1000).toFixed(1)}K`;
    }
    return `$${tvl}`;
  };

  const sendTransaction = () => {
    // In production, this would initiate a transaction
    console.log('Sending transaction...');
  };

  const createWallet = () => {
    // In production, this would create a new wallet
    console.log('Creating new wallet...');
  };

  const deployContract = () => {
    // In production, this would deploy a smart contract
    console.log('Deploying smart contract...');
  };

  if (loading) {
    return (
      <div className="blockchain-features">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading blockchain features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blockchain-features">
      <div className="blockchain-header">
        <div className="header-content">
          <div className="header-title">
            <Shield className="header-icon" />
            <h1>Blockchain Features</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={sendTransaction}>
              <Send className="button-icon" />
              Send
            </button>
            <button className="action-button" onClick={createWallet}>
              <Plus className="button-icon" />
              Create Wallet
            </button>
            <button className="action-button" onClick={deployContract}>
              <Box className="button-icon" />
              Deploy Contract
            </button>
          </div>
        </div>
      </div>

      <div className="blockchain-tabs">
        <button 
          className={`tab ${activeTab === 'networks' ? 'active' : ''}`}
          onClick={() => setActiveTab('networks')}
        >
          <Network className="tab-icon" />
          Networks
        </button>
        <button 
          className={`tab ${activeTab === 'wallets' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallets')}
        >
          <Wallet className="tab-icon" />
          Wallets
        </button>
        <button 
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <History className="tab-icon" />
          Transactions
        </button>
        <button 
          className={`tab ${activeTab === 'contracts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contracts')}
        >
          <Box className="tab-icon" />
          Contracts
        </button>
        <button 
          className={`tab ${activeTab === 'nfts' ? 'active' : ''}`}
          onClick={() => setActiveTab('nfts')}
        >
          <Star className="tab-icon" />
          NFTs
        </button>
        <button 
          className={`tab ${activeTab === 'defi' ? 'active' : ''}`}
          onClick={() => setActiveTab('defi')}
        >
          <TrendingUp className="tab-icon" />
          DeFi
        </button>
      </div>

      <div className="blockchain-content">
        {activeTab === 'networks' && (
          <div className="networks-tab">
            <div className="networks-list">
              <h3>Blockchain Networks</h3>
              {networks.map((network) => (
                <div key={network.id} className="network-item">
                  <div className="network-icon">
                    {getNetworkIcon(network.id)}
                  </div>
                  <div className="network-info">
                    <div className="network-header">
                      <h4 className="network-name">{network.name}</h4>
                      <div className="network-badges">
                        <span className={`status-badge ${getStatusColor(network.status)}`}>
                          {getStatusIcon(network.status)}
                          {network.status}
                        </span>
                        <span className="type-badge">{network.type}</span>
                      </div>
                    </div>
                    <div className="network-details">
                      <div className="detail-row">
                        <span className="detail-label">Currency:</span>
                        <span className="detail-value">{network.currency} ({network.symbol})</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Block Height:</span>
                        <span className="detail-value">{network.blockHeight.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Hash Rate:</span>
                        <span className="detail-value">{network.hashRate}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Nodes:</span>
                        <span className="detail-value">{network.nodes.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Avg Block Time:</span>
                        <span className="detail-value">{network.avgBlockTime}s</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Gas Price:</span>
                        <span className="detail-value">{network.gasPrice}</span>
                      </div>
                    </div>
                  </div>
                  <div className="network-actions">
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wallets' && (
          <div className="wallets-tab">
            <div className="wallets-list">
              <h3>Wallets</h3>
              {wallets.map((wallet) => (
                <div key={wallet.id} className="wallet-item">
                  <div className="wallet-icon">
                    {getWalletIcon(wallet.type)}
                  </div>
                  <div className="wallet-info">
                    <div className="wallet-header">
                      <h4 className="wallet-name">{wallet.name}</h4>
                      <div className="wallet-badges">
                        <span className="type-badge">{wallet.type}</span>
                        {wallet.isActive && (
                          <span className="active-badge">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="wallet-details">
                      <div className="detail-row">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">{formatAddress(wallet.address)}</span>
                        <button className="copy-button" title="Copy address">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Balance:</span>
                        <span className="detail-value">{formatCurrency(wallet.balance, wallet.currency)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Network:</span>
                        <span className="detail-value">{wallet.network}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Transactions:</span>
                        <span className="detail-value">{wallet.transactions}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Used:</span>
                        <span className="detail-value">{wallet.lastUsed.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="wallet-actions">
                    <button className="action-button">
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                    <button className="action-button">
                      <Download className="w-4 h-4" />
                      Receive
                    </button>
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-tab">
            <div className="transactions-list">
              <h3>Recent Transactions</h3>
              {transactions.map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div className="transaction-icon">
                    {getTypeIcon(tx.type)}
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-header">
                      <h4 className="transaction-type">{tx.type}</h4>
                      <div className="transaction-badges">
                        <span className={`status-badge ${getStatusColor(tx.status)}`}>
                          {getStatusIcon(tx.status)}
                          {tx.status}
                        </span>
                        <span className="type-badge">{tx.type}</span>
                      </div>
                    </div>
                    <div className="transaction-details">
                      <div className="detail-row">
                        <span className="detail-label">Hash:</span>
                        <span className="detail-value">{formatAddress(tx.hash)}</span>
                        <button className="copy-button" title="Copy transaction hash">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">From:</span>
                        <span className="detail-value">{formatAddress(tx.from)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">To:</span>
                        <span className="detail-value">{formatAddress(tx.to)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Amount:</span>
                        <span className="detail-value">{formatCurrency(tx.amount, tx.currency)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Gas Used:</span>
                        <span className="detail-value">{tx.gasUsed.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Block:</span>
                        <span className="detail-value">{tx.blockNumber.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Time:</span>
                        <span className="detail-value">{tx.timestamp.toLocaleString()}</span>
                      </div>
                      {tx.description && (
                        <div className="detail-row">
                          <span className="detail-label">Description:</span>
                          <span className="detail-value">{tx.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="contracts-tab">
            <div className="contracts-list">
              <h3>Smart Contracts</h3>
              {smartContracts.map((contract) => (
                <div key={contract.id} className="contract-item">
                  <div className="contract-icon">
                    <Box className="w-5 h-5" />
                  </div>
                  <div className="contract-info">
                    <div className="contract-header">
                      <h4 className="contract-name">{contract.name}</h4>
                      <div className="contract-badges">
                        {contract.isVerified && (
                          <span className="verified-badge">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        <span className="network-badge">{contract.network}</span>
                      </div>
                    </div>
                    <div className="contract-details">
                      <div className="detail-row">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">{formatAddress(contract.address)}</span>
                        <button className="copy-button" title="Copy contract address">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Creator:</span>
                        <span className="detail-value">{formatAddress(contract.creator)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Deployed:</span>
                        <span className="detail-value">{contract.deployedAt.toLocaleDateString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Functions:</span>
                        <span className="detail-value">{contract.functions.length}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Events:</span>
                        <span className="detail-value">{contract.events.length}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Balance:</span>
                        <span className="detail-value">{formatCurrency(contract.balance, 'ETH')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="contract-actions">
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Interact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="nfts-tab">
            <div className="nfts-grid">
              <h3>NFT Collection</h3>
              {nfts.map((nft) => (
                <div key={nft.id} className="nft-item">
                  <div className="nft-image">
                    <img src={nft.image} alt={nft.name} />
                    {nft.isListed && (
                      <div className="listed-badge">
                        <span>Listed</span>
                      </div>
                    )}
                  </div>
                  <div className="nft-info">
                    <h4 className="nft-name">{nft.name}</h4>
                    <p className="nft-description">{nft.description}</p>
                    <div className="nft-details">
                      <div className="detail-row">
                        <span className="detail-label">Token ID:</span>
                        <span className="detail-value">{nft.tokenId}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Standard:</span>
                        <span className="detail-value">{nft.standard}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Network:</span>
                        <span className="detail-value">{nft.network}</span>
                      </div>
                      {nft.isListed && (
                        <div className="detail-row">
                          <span className="detail-label">Price:</span>
                          <span className="detail-value">{formatCurrency(nft.price, nft.currency)}</span>
                        </div>
                      )}
                    </div>
                    <div className="nft-actions">
                      <button className="action-button">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      {nft.isListed ? (
                        <button className="action-button">
                          <Minus className="w-4 h-4" />
                          Unlist
                        </button>
                      ) : (
                        <button className="action-button">
                          <Plus className="w-4 h-4" />
                          List
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'defi' && (
          <div className="defi-tab">
            <div className="defi-list">
              <h3>DeFi Protocols</h3>
              {defiProtocols.map((protocol) => (
                <div key={protocol.id} className="defi-item">
                  <div className="defi-icon">
                    {getDeFiIcon(protocol.type)}
                  </div>
                  <div className="defi-info">
                    <div className="defi-header">
                      <h4 className="defi-name">{protocol.name}</h4>
                      <div className="defi-badges">
                        <span className="type-badge">{protocol.type}</span>
                        <span className={`risk-badge ${getRiskColor(protocol.risk)}`}>
                          {protocol.risk} risk
                        </span>
                        {protocol.isActive && (
                          <span className="active-badge">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="defi-description">{protocol.description}</p>
                    <div className="defi-details">
                      <div className="detail-row">
                        <span className="detail-label">APY:</span>
                        <span className="detail-value">{protocol.apy}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">TVL:</span>
                        <span className="detail-value">{formatTVL(protocol.tvl)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Network:</span>
                        <span className="detail-value">{protocol.network}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Tokens:</span>
                        <span className="detail-value">{protocol.tokens.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="defi-actions">
                    <button className="action-button">
                      <TrendingUp className="w-4 h-4" />
                      Invest
                    </button>
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
