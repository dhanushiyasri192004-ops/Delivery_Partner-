import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWalletDetails, submitWithdrawalRequest } from '../../redux/slices/walletSlice';
import { 
  Wallet as WalletIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowDownRight, 
  ArrowUpRight, 
  X, 
  AlertTriangle,
  Download,
  Search,
  SlidersHorizontal,
  Lock,
  HelpCircle,
  CreditCard,
  Plus,
  RefreshCw,
  Bell,
  FileText,
  ShieldCheck,
  ChevronRight,
  ShieldAlert,
  ChevronLeft,
  Info
} from 'lucide-react';

const Withdraw = () => {
  const dispatch = useDispatch();
  const { balance, transactions, withdrawals, loading, error } = useSelector((state) => state.wallet);
  const { profile } = useSelector((state) => state.auth);

  // Time stamp state
  const [lastUpdated, setLastUpdated] = useState('2 mins ago');

  // Modal control states
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Bank Account Fields (Local mock overrides for demo)
  const [bankName, setBankName] = useState(profile?.bankDetails?.bankName || 'STATE BANK OF INDIA');
  const [accountHolderName, setAccountHolderName] = useState(profile?.bankDetails?.accountHolderName || 'Dhanu');
  const [accountNumber, setAccountNumber] = useState(profile?.bankDetails?.accountNumber || '•••• 8678');
  const [ifscCode, setIfscCode] = useState(profile?.bankDetails?.ifscCode || 'SBIN0001234');
  const [branch, setBranch] = useState(profile?.bankDetails?.branch || 'Nagarbhavi');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Credit, Debit, Refund, Withdrawal
  const [timeFilter, setTimeFilter] = useState('All'); // All, Today, Week, Month

  // Help/Dispute Modals
  const [supportModal, setSupportModal] = useState(false);
  const [supportTopic, setSupportTopic] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Local notifications list
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Withdrawal of ₹1,500.00 pending', message: 'Payout submitted for processing to your bank.', time: '10 mins ago', type: 'pending' },
    { id: 2, title: 'Bank Account Linked Successfully', message: 'Primary SBI account verification completed.', time: '2 hours ago', type: 'success' },
    { id: 3, title: 'Welcome Credit received', message: '₹200.00 added to your available balance.', time: '1 day ago', type: 'credit' }
  ]);

  useEffect(() => {
    dispatch(fetchWalletDetails());
  }, [dispatch]);

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum < 100) {
      return alert('Minimum withdrawal amount is ₹100');
    }
    if (amountNum > balance) {
      return alert('Insufficient balance in your wallet');
    }
    setShowConfirmModal(true);
  };

  const handleConfirmWithdrawal = () => {
    dispatch(submitWithdrawalRequest(withdrawAmount)).then((res) => {
      if (!res.error) {
        setSuccessMsg(`Payout request of ₹${withdrawAmount} submitted successfully!`);
        setWithdrawAmount('');
        setShowConfirmModal(false);
        setWithdrawModalOpen(false);
        setLastUpdated('Just now');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    });
  };

  const handleBankDetailsUpdate = (e) => {
    e.preventDefault();
    setShowBankModal(false);
    setSuccessMsg('Linked bank account details updated!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDownloadReport = (type) => {
    const text = `FORGE INDIA CONNECT - ${type.toUpperCase()}\nDate: ${new Date().toLocaleString()}\nAccount: ${bankName} (${accountNumber})\nBalance: ₹${balance.toFixed(2)}\n`;
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${type.replace(/ /g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Helper date checker
  const isWithinDays = (dateStr, days) => {
    const date = new Date(dateStr);
    const limit = new Date();
    limit.setDate(limit.getDate() - days);
    return date >= limit;
  };

  // Filter Transaction data
  const filteredTransactions = transactions.filter(t => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchId = t._id?.toLowerCase().includes(q);
      if (!matchDesc && !matchId) return false;
    }

    // Type tab
    if (filterType !== 'All') {
      const descLower = t.description.toLowerCase();
      if (filterType === 'Credit' && t.type !== 'credit') return false;
      if (filterType === 'Debit' && t.type !== 'debit') return false;
      if (filterType === 'Withdrawal' && !descLower.includes('withdrawal')) return false;
      if (filterType === 'Refund' && !descLower.includes('refund')) return false;
    }

    // Date
    if (timeFilter !== 'All') {
      const date = t.timestamp || t.date;
      if (timeFilter === 'Today' && new Date(date).toDateString() !== new Date().toDateString()) return false;
      if (timeFilter === 'This Week' && !isWithinDays(date, 7)) return false;
      if (timeFilter === 'This Month' && !isWithinDays(date, 30)) return false;
    }

    return true;
  });

  // Pagination math
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Dynamic Action banners */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-sm text-xs font-bold animate-fade-in flex items-center justify-between">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg('')}><X className="h-4 w-4" /></button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-650 px-4 py-3 rounded-xl shadow-sm text-xs font-bold">
          ⚠️ {error}
        </div>
      )}

      {/* Row 1: Available Wallet Balance card (Dark Blue) & Wallet Information (White) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left card: Available Wallet Balance */}
        <div className="md:col-span-6 bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WalletIcon className="h-5 w-5 text-slate-950/80" />
                <span className="text-[11px] text-slate-950/80 font-extrabold uppercase tracking-wider">Available Wallet Balance</span>
              </div>
              <span className="text-[10px] text-slate-950/60 font-medium">Last updated {lastUpdated}</span>
            </div>
            <h3 className="text-4xl font-black">₹{balance.toFixed(2)}</h3>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button 
              onClick={() => setWithdrawModalOpen(true)}
              className="flex-1 bg-slate-950 hover:bg-slate-900 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md text-center"
            >
              Withdraw to Bank
            </button>
            <button 
              onClick={() => { setSearchQuery(''); setFilterType('All'); setTimeFilter('All'); }}
              className="px-4 py-3 bg-white/20 hover:bg-white/30 text-slate-950 font-bold rounded-xl text-xs transition-all border border-black/10 active:scale-95"
            >
              Clear Transactions
            </button>
          </div>
        </div>

        {/* Right card: Wallet Information */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between min-h-[220px]">
          <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-slate-450" /> Wallet Information
          </h4>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs flex-1 py-2">
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-400">Min Withdrawal</span>
              <span className="font-extrabold text-slate-700">₹100</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-400">Max Withdrawal</span>
              <span className="font-extrabold text-slate-700">₹50,000</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-400">Processing Time</span>
              <span className="font-extrabold text-green-600 flex items-center gap-0.5">⚡ Instant</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-400">Settlement Channel</span>
              <span className="font-extrabold text-slate-700">IMPS / NEFT</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-400">Verification Status</span>
              <span className="font-extrabold text-slate-700">KYC Verified</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-400">Security Level</span>
              <span className="font-extrabold text-blue-600">High (SSL)</span>
            </div>
          </div>
        </div>

      </div>


      {/* Row 3: Wallet Transactions (Ledger Table view) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
        
        {/* Table Header Filter options */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h4 className="font-black text-slate-800 text-base">Wallet Transactions</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Filter category or search ledger records</p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            {/* Type Category Dropdown */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span>Category:</span>
              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-750 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Credit">Wallet Credit</option>
                <option value="Debit">Wallet Debit</option>
                <option value="Withdrawal">Withdrawals</option>
                <option value="Refund">Refunds</option>
              </select>
            </div>

            {/* Time Filter */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span>Timeline:</span>
              <select
                value={timeFilter}
                onChange={(e) => { setTimeFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-750 focus:outline-none"
              >
                <option value="All">All Timelines</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-4 py-2 border border-slate-200 focus:border-blue-500 rounded-xl text-xs focus:outline-none transition-all font-semibold text-slate-700"
              />
              <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Date &amp; Time</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    No transaction records found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((t, idx) => {
                  const isCredit = t.type === 'credit';
                  const dateStr = new Date(t.timestamp || t.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
                  const descLower = t.description.toLowerCase();
                  
                  // Map Transaction Types dynamically
                  let displayType = isCredit ? 'Wallet Credit' : 'Wallet Debit';
                  if (descLower.includes('withdrawal')) displayType = 'Withdrawal';
                  if (descLower.includes('refund')) displayType = 'Refund';
                  if (descLower.includes('adjustment')) displayType = 'Adjustment';

                  return (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all font-semibold text-slate-700">
                      <td className="py-3 px-3 font-mono text-xs text-slate-400">
                        #TXN-{(t._id || idx).toString().substring(0,8).toUpperCase()}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {dateStr}
                      </td>
                      <td className="py-3 px-3">
                        {t.description}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-black uppercase ${
                          displayType === 'Wallet Credit' ? 'bg-green-50 text-green-700' :
                          displayType === 'Withdrawal' ? 'bg-amber-50 text-amber-700' :
                          displayType === 'Refund' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {displayType}
                        </span>
                      </td>
                      <td className={`py-3 px-3 text-right text-base font-black ${
                        isCredit ? 'text-green-650' : 'text-red-500'
                      }`}>
                        {isCredit ? '+' : '-'}₹{t.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="bg-green-50 text-green-700 text-xs font-black px-2 py-0.5 rounded-full uppercase border border-green-150">
                          Success
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-slate-400 font-semibold text-[11px]">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${
                    p === currentPage
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Row 4: Quick Actions (Left) & Recent Notifications / Alerts (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left card: Quick Actions */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-600">
            <button 
              onClick={() => handleDownloadStatement('Wallet Statement')}
              className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl hover:text-blue-600 transition-all text-left flex flex-col justify-between min-h-[90px]"
            >
              <span className="text-lg">📊</span>
              <span>Download Statement</span>
            </button>
            <button 
              onClick={() => { setSupportTopic('Report Payment Issue'); setSupportModal(true); }}
              className="p-4 bg-slate-50 hover:bg-red-50 border border-slate-100 rounded-xl hover:text-red-650 transition-all text-left flex flex-col justify-between min-h-[90px]"
            >
              <span className="text-lg">🚨</span>
              <span>Raise a Dispute</span>
            </button>
            <button 
              onClick={() => { setSupportTopic('Payment FAQ'); setSupportModal(true); }}
              className="p-4 bg-slate-50 hover:bg-amber-50 border border-slate-100 rounded-xl hover:text-amber-700 transition-all text-left flex flex-col justify-between min-h-[90px]"
            >
              <span className="text-lg">❓</span>
              <span>Payment FAQ</span>
            </button>
            <button 
              onClick={() => { setSupportTopic('Contact Finance Team'); setSupportModal(true); }}
              className="p-4 bg-slate-50 hover:bg-green-50 border border-slate-100 rounded-xl hover:text-green-700 transition-all text-left flex flex-col justify-between min-h-[90px]"
            >
              <span className="text-lg">📧</span>
              <span>Contact Finance</span>
            </button>
          </div>
        </div>

        {/* Right card: Recent Notifications / Alerts */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-800 text-sm">Recent Alerts</h4>
              <button 
                onClick={() => setNotifications([])}
                className="text-[10px] font-black text-red-500 hover:text-red-600 uppercase hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-3.5 mt-3 max-h-[140px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No recent wallet notifications.</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="text-xs border-b border-dashed border-slate-100 pb-2.5 last:border-0 last:pb-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-750">{n.title}</span>
                      <span className="text-[9px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-450 text-[10px]">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: WITHDRAW MONEY POPUP AMOUNT ENTER */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-scale-up">
            <div>
              <h4 className="font-black text-slate-800 text-lg">Withdraw to Bank</h4>
              <p className="text-xs text-slate-450 mt-1">Funds will be deposited to your linked account. Minimum limit is ₹100.</p>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Amount to Withdraw (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-450 font-black text-xl">₹</span>
                  <input
                    type="number"
                    required
                    min="100"
                    max={balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Min. ₹100"
                    className="w-full text-center pl-8 pr-16 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-2xl text-2xl font-black text-slate-800 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(Math.floor(balance).toString())}
                    className="absolute right-3.5 top-3.5 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase hover:bg-blue-100 transition-all"
                  >
                    Max
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1.5 text-right font-medium">
                  Available Balance: ₹{balance.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow active:scale-95 transition-all"
                >
                  Proceed
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-150 text-slate-650 font-bold py-3.5 rounded-2xl text-xs active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: WITHDRAWAL CONFIRMATION POPUP */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-scale-up">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center border border-amber-100">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <h4 className="font-black text-slate-800 text-lg">Confirm Bank Payout</h4>
              <p className="text-xs text-slate-400 mt-1">
                You are about to transfer <span className="font-bold text-slate-800 text-sm">₹{withdrawAmount}</span> to your linked account:
              </p>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs font-semibold text-slate-700 space-y-1 mt-3">
                <div className="flex justify-between"><span>Bank Name:</span><span className="font-extrabold">{bankName}</span></div>
                <div className="flex justify-between"><span>Account Number:</span><span className="font-extrabold">{accountNumber}</span></div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleConfirmWithdrawal}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow active:scale-95 transition-all"
              >
                Yes, Payout
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-150 text-slate-650 font-bold py-3.5 rounded-2xl text-xs active:scale-95 transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE BANK DETAILS */}
      {showBankModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-scale-up flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-black text-slate-805 text-base">Update Linked Bank Details</h4>
              <button onClick={() => setShowBankModal(false)} className="text-slate-400 hover:text-slate-650"><X className="h-5 w-5" /></button>
            </div>
            
            <form onSubmit={handleBankDetailsUpdate} className="space-y-3.5 text-xs overflow-y-auto pr-1 flex-1">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bank Name</label>
                <input 
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Account Holder Name</label>
                <input 
                  type="text"
                  required
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Account Number</label>
                <input 
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">IFSC Code</label>
                <input 
                  type="text"
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Branch</label>
                <input 
                  type="text"
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl uppercase tracking-wider shadow"
                >
                  Verify &amp; Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HELP & SUPPORT INFORMATION */}
      {supportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-black text-slate-805 text-base">{supportTopic}</h4>
              <button onClick={() => setSupportModal(false)} className="text-slate-400 hover:text-slate-650"><X className="h-5 w-5" /></button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              {supportTopic === 'Payment FAQ' && (
                <>
                  <div>
                    <p className="font-extrabold text-slate-800">Q: When is the minimum payout balance?</p>
                    <p className="mt-0.5">A: You need a minimum balance of ₹100 in your Available balance to request a withdrawal to bank.</p>
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800">Q: Are there any payout withdrawal transaction fees?</p>
                    <p className="mt-0.5">A: No! Payout bank transfers are 100% free with zero fees for all connect rider partners.</p>
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800">Q: How long does settlement transfer take?</p>
                    <p className="mt-0.5">A: Settlements are instant. Transactions are sent immediately and credit within 10 minutes to linked accounts.</p>
                  </div>
                </>
              )}

              {supportTopic === 'Report Payment Issue' && (
                <div className="space-y-3">
                  <p>Our audit team will review transactions immediately. Please describe the payment query or discrepancy:</p>
                  <textarea 
                    placeholder="Enter order ID / transaction issue details here..."
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 h-24"
                  />
                  <button 
                    onClick={() => { setSupportModal(false); setSuccessMsg('Report submitted successfully to Audit Team!'); setTimeout(() => setSuccessMsg(''), 3000); }}
                    className="w-full py-2.5 bg-red-650 hover:bg-red-750 text-white font-black rounded-xl uppercase tracking-wider text-[10px]"
                  >
                    Submit Discrepancy Ticket
                  </button>
                </div>
              )}

              {supportTopic === 'Contact Finance Team' && (
                <div className="space-y-2">
                  <p>Contact connection finance specialists directly:</p>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1 mt-1 font-semibold text-slate-700">
                    <p>📧 Email: finance-connect@forgeindia.in</p>
                    <p>📞 Helpline: +1800-456-9922 (Mon-Sat, 9AM to 6PM)</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Standard ticket resolution window is 24 to 48 working hours.</p>
                </div>
              )}
            </div>

            {supportTopic !== 'Report Payment Issue' && (
              <div className="pt-2 border-t border-slate-100 text-right">
                <button 
                  onClick={() => setSupportModal(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white font-black rounded-xl"
                >
                  Okay
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Withdraw;
