import React, { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Wallet,
  CreditCard,
  PiggyBank,
  Target,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  Settings,
  Bell,
  Star,
  Award,
  Calculator,
  Receipt,
  Building,
  Home,
  Car,
  Utensils,
  ShoppingBag,
  Gamepad2,
  Book,
  Heart,
  Plane
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: Date;
  account: string;
  tags: string[];
  recurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes?: string;
}

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  alertThreshold: number; // percentage
}

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  color: string;
  icon: string;
}

interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  progress: number;
}

interface FinancialInsight {
  totalIncome: number;
  totalExpenses: number;
  netWorth: number;
  monthlyTrend: number;
  topExpenseCategories: Array<{ category: string; amount: number; percentage: number; icon: string }>;
  savingsRate: number;
  budgetAlerts: number;
  upcomingBills: Transaction[];
}

const AIFinanceManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets' | 'accounts' | 'goals' | 'insights'>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [insights, setInsights] = useState<FinancialInsight | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Load data from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('finance-transactions');
    const savedBudgets = localStorage.getItem('finance-budgets');
    const savedAccounts = localStorage.getItem('finance-accounts');
    const savedGoals = localStorage.getItem('finance-goals');
    
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    if (savedAccounts) setSavedAccounts(JSON.parse(savedAccounts));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  // Save data to localStorage
  const saveData = useCallback(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
    localStorage.setItem('finance-budgets', JSON.stringify(budgets));
    localStorage.setItem('finance-accounts', JSON.stringify(accounts));
    localStorage.setItem('finance-goals', JSON.stringify(goals));
  }, [transactions, budgets, accounts, goals]);

  useEffect(() => {
    saveData();
  }, [saveData]);

  // Calculate financial insights
  useEffect(() => {
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const monthlyTransactions = transactions.filter(t => 
      t.date >= startOfMonth && t.date <= endOfMonth
    );

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0);

    // Calculate monthly trend (compare with previous month)
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    
    const previousMonthTransactions = transactions.filter(t => 
      t.date >= previousMonth && t.date <= endOfPreviousMonth
    );
    
    const previousMonthIncome = previousMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyTrend = previousMonthIncome > 0 
      ? ((totalIncome - previousMonthIncome) / previousMonthIncome) * 100 
      : 0;

    // Top expense categories
    const expenseCategories = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    const topExpenseCategories = Object.entries(expenseCategories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalExpenses) * 100,
        icon: getCategoryIcon(category)
      }));

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Budget alerts
    const budgetAlerts = budgets.filter(budget => {
      const spentPercentage = (budget.spent / budget.amount) * 100;
      return spentPercentage >= budget.alertThreshold;
    }).length;

    // Upcoming bills (recurring expenses due soon)
    const upcomingBills = transactions
      .filter(t => t.recurring && t.type === 'expense')
      .slice(0, 5);

    setInsights({
      totalIncome,
      totalExpenses,
      netWorth,
      monthlyTrend,
      topExpenseCategories,
      savingsRate,
      budgetAlerts,
      upcomingBills
    });
  }, [transactions, budgets, accounts, selectedPeriod]);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Food & Dining': 'Utensils',
      'Transportation': 'Car',
      'Shopping': 'ShoppingBag',
      'Entertainment': 'Gamepad2',
      'Education': 'Book',
      'Healthcare': 'Heart',
      'Travel': 'Plane',
      'Housing': 'Home',
      'Utilities': 'Building',
      'Income': 'DollarSign',
      'Investment': 'TrendingUp'
    };
    return icons[category] || 'Receipt';
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString()
    };
    setTransactions(prev => [...prev, newTransaction]);

    // Update account balance
    if (transactionData.type === 'income') {
      setAccounts(prev => prev.map(account => 
        account.name === transactionData.account 
          ? { ...account, balance: account.balance + transactionData.amount }
          : account
      ));
    } else {
      setAccounts(prev => prev.map(account => 
        account.name === transactionData.account 
          ? { ...account, balance: account.balance - transactionData.amount }
          : account
      ));
    }
  };

  const addAccount = (accountData: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...accountData,
      id: Date.now().toString()
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const addBudget = (budgetData: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: Date.now().toString()
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const addGoal = (goalData: Omit<FinancialGoal, 'id' | 'progress'>) => {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: Date.now().toString(),
      progress: (goalData.currentAmount / goalData.targetAmount) * 100
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Education': 'bg-green-100 text-green-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Travel': 'bg-indigo-100 text-indigo-800',
      'Housing': 'bg-yellow-100 text-yellow-800',
      'Utilities': 'bg-gray-100 text-gray-800',
      'Income': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Worth</p>
              <p className="text-2xl font-bold text-gray-900">
                {showBalance ? `$${insights?.netWorth.toLocaleString() || '0'}` : '••••••'}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                {showBalance ? `$${insights?.totalIncome.toLocaleString() || '0'}` : '••••••'}
              </p>
              {insights?.monthlyTrend && (
                <p className={`text-xs ${insights.monthlyTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {insights.monthlyTrend >= 0 ? '+' : ''}{insights.monthlyTrend.toFixed(1)}% vs last month
                </p>
              )}
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {showBalance ? `$${insights?.totalExpenses.toLocaleString() || '0'}` : '••••••'}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Savings Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {insights?.savingsRate.toFixed(1) || '0'}%
              </p>
            </div>
            <PiggyBank className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Accounts Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Accounts</h3>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(account => (
            <div key={account.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: account.color }}
                  />
                  <span className="font-medium text-gray-900">{account.name}</span>
                </div>
                <span className="text-xs text-gray-500 capitalize">{account.type}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {showBalance ? `$${account.balance.toLocaleString()}` : '••••••'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Expense Categories */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Expense Categories</h3>
        <div className="space-y-4">
          {insights?.topExpenseCategories.map((category, index) => (
            <div key={category.category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  {/* Icon would go here */}
                  <Receipt className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">{category.category}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-20">
                  ${category.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Alerts */}
      {insights && insights.budgetAlerts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-800">
              {insights.budgetAlerts} budget alert{insights.budgetAlerts > 1 ? 's' : ''} - You're over budget!
            </span>
          </div>
        </div>
      )}

      {/* Financial Goals */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Goals</h3>
        <div className="space-y-4">
          {goals.slice(0, 3).map(goal => (
            <div key={goal.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{goal.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                  goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {goal.priority}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {goal.progress.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TransactionsTab = () => (
    <div className="space-y-6">
      {/* Add Transaction Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Transaction</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          addTransaction({
            amount: parseFloat(formData.get('amount') as string),
            description: formData.get('description') as string,
            category: formData.get('category') as string,
            type: formData.get('type') as 'income' | 'expense',
            date: new Date(formData.get('date') as string),
            account: formData.get('account') as string,
            tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
            recurring: formData.get('recurring') === 'on',
            notes: formData.get('notes') as string
          });
          (e.target as HTMLFormElement).reset();
        }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="description"
              type="text"
              placeholder="Transaction description"
              className="px-3 py-2 border rounded-lg"
              required
            />
            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Amount"
              className="px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="type" className="px-3 py-2 border rounded-lg" required>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select name="category" className="px-3 py-2 border rounded-lg" required>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Transportation">Transportation</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Travel">Travel</option>
              <option value="Housing">Housing</option>
              <option value="Utilities">Utilities</option>
              <option value="Income">Income</option>
            </select>
            <select name="account" className="px-3 py-2 border rounded-lg" required>
              {accounts.map(account => (
                <option key={account.id} value={account.name}>{account.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="date"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border rounded-lg"
              required
            />
            <input
              name="tags"
              type="text"
              placeholder="Tags (comma-separated)"
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              name="recurring"
              type="checkbox"
              className="rounded"
            />
            <label className="text-sm text-gray-600">Recurring transaction</label>
          </div>
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            className="w-full px-3 py-2 border rounded-lg"
            rows={2}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Transaction
          </button>
        </form>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <Download className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="divide-y">
          {transactions.slice(-10).reverse().map(transaction => (
            <div key={transaction.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.account} • {transaction.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </p>
                  {transaction.recurring && (
                    <p className="text-xs text-gray-500">Recurring</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">AI Finance Manager</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
              <Settings className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'transactions', label: 'Transactions', icon: Receipt },
              { id: 'budgets', label: 'Budgets', icon: Target },
              { id: 'accounts', label: 'Accounts', icon: Wallet },
              { id: 'goals', label: 'Goals', icon: Star },
              { id: 'insights', label: 'Insights', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'budgets' && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Budget Management</h3>
            <p className="text-gray-600">Budget tracking and management features coming soon.</p>
          </div>
        )}
        {activeTab === 'accounts' && (
          <div className="text-center py-12">
            <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Account Management</h3>
            <p className="text-gray-600">Account setup and management features coming soon.</p>
          </div>
        )}
        {activeTab === 'goals' && (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Goals</h3>
            <p className="text-gray-600">Goal setting and tracking features coming soon.</p>
          </div>
        )}
        {activeTab === 'insights' && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI Insights</h3>
            <p className="text-gray-600">Advanced AI-powered financial insights coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFinanceManager;
