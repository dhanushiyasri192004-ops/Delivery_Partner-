import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderHistory, fetchDeliveryDashboard } from '../../redux/slices/deliverySlice';
import { 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  User, 
  CreditCard, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  SlidersHorizontal, 
  RefreshCw, 
  FileText,
  Utensils, 
  Package, 
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  Inbox
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ActiveOrders = () => {
  const dispatch = useDispatch();
  const { history, activeOrder, loading } = useSelector((state) => state.delivery);

  // Tabs: Active, Completed, Cancelled, Returned, Scheduled
  const [activeTab, setActiveTab] = useState('Active');

  // Filter states
  const [dateFilter, setDateFilter] = useState('All');
  const [orderTypeFilter, setOrderTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Sort state
  const [sortBy, setSortBy] = useState('Latest First');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load data
  useEffect(() => {
    dispatch(fetchDeliveryDashboard());
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  // Handler to clear all filters
  const handleClearFilters = () => {
    setDateFilter('All');
    setOrderTypeFilter('All');
    setPriorityFilter('All');
    setPaymentFilter('All');
    setStatusFilter('All');
    setCustomStartDate('');
    setCustomEndDate('');
    setSearchQuery('');
    setSortBy('Latest First');
    setCurrentPage(1);
  };

  // Helper to trigger data refresh
  const handleRefresh = () => {
    dispatch(fetchDeliveryDashboard());
    dispatch(fetchOrderHistory());
  };

  // Helper: check if a date is today
  const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  };

  // Helper: check if a date is yesterday
  const isYesterday = (dateStr) => {
    const d = new Date(dateStr);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();
  };

  // Helper: check if a date is this week
  const isThisWeek = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0,0,0,0);
    return d >= startOfWeek;
  };

  // Helper: check if a date is this month
  const isThisMonth = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  // Format date helper
  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
  };

  // Helper to trigger invoice download
  const downloadMockInvoice = (orderId) => {
    const element = document.createElement("a");
    const file = new Blob([
      `FORGE INDIA CONNECT - DELIVERY INVOICE\n=====================================\nOrder ID: ${orderId}\nGenerated on: ${new Date().toLocaleString()}\nStatus: Verified & Delivered\nTotal Earning payout released.\nThank you for partner service!`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Invoice_${orderId.substring(orderId.length - 6)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Combine both activeOrder and history into a single list
  const allOrders = [];
  if (activeOrder && !history.find(o => o._id === activeOrder._id)) {
    allOrders.push(activeOrder);
  }
  history.forEach(order => {
    if (!allOrders.find(o => o._id === order._id)) {
      allOrders.push(order);
    }
  });

  // 1. FILTER BY TAB
  const tabFiltered = allOrders.filter(order => {
    const status = order.status?.toLowerCase();
    switch (activeTab) {
      case 'Active':
        return ['pending', 'accepted', 'reached_vendor', 'picked_up', 'reached_customer'].includes(status);
      case 'Completed':
        return status === 'delivered' || status === 'completed';
      case 'Cancelled':
        return status === 'cancelled';
      case 'Returned':
        return status === 'returned';
      case 'Scheduled':
        return status === 'scheduled';
      default:
        return true;
    }
  });

  // 2. APPLY FILTER SECTION DROPDOWNS
  const filtersApplied = tabFiltered.filter(order => {
    // Search Query (matches customerName, order ID, locations)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesId = order._id?.toLowerCase().includes(q);
      const matchesCustomer = order.customerName?.toLowerCase().includes(q) || order.customerId?.toLowerCase().includes(q);
      const matchesPickup = order.pickupLocation?.toLowerCase().includes(q);
      const matchesDelivery = order.deliveryLocation?.toLowerCase().includes(q);
      if (!matchesId && !matchesCustomer && !matchesPickup && !matchesDelivery) {
        return false;
      }
    }

    // Order Type Filter
    if (orderTypeFilter !== 'All') {
      if ((order.orderType || 'Food').toLowerCase() !== orderTypeFilter.toLowerCase()) {
        return false;
      }
    }

    // Priority Filter
    if (priorityFilter !== 'All') {
      if ((order.priority || 'Normal').toLowerCase() !== priorityFilter.toLowerCase()) {
        return false;
      }
    }

    // Payment Filter
    if (paymentFilter !== 'All') {
      const isCod = paymentFilter === 'Cash on Delivery';
      const orderPay = order.paymentMethod || 'Online';
      if (isCod && orderPay !== 'Cash on Delivery') return false;
      if (!isCod && orderPay === 'Cash on Delivery') return false;
    }

    // Status Filter (Overrides tab check if specific selected)
    if (statusFilter !== 'All') {
      const s = order.status?.toLowerCase();
      if (statusFilter === 'Active' && !['pending', 'accepted', 'reached_vendor', 'picked_up', 'reached_customer'].includes(s)) return false;
      if (statusFilter === 'Completed' && s !== 'delivered' && s !== 'completed') return false;
      if (statusFilter === 'Cancelled' && s !== 'cancelled') return false;
      if (statusFilter === 'Returned' && s !== 'returned') return false;
    }

    // Date Filter
    const orderDate = order.createdAt;
    if (dateFilter !== 'All') {
      if (dateFilter === 'Today' && !isToday(orderDate)) return false;
      if (dateFilter === 'Yesterday' && !isYesterday(orderDate)) return false;
      if (dateFilter === 'This Week' && !isThisWeek(orderDate)) return false;
      if (dateFilter === 'This Month' && !isThisMonth(orderDate)) return false;
      if (dateFilter === 'Custom Range') {
        if (customStartDate && new Date(orderDate) < new Date(customStartDate)) return false;
        if (customEndDate) {
          const endLimit = new Date(customEndDate);
          endLimit.setHours(23, 59, 59, 999);
          if (new Date(orderDate) > endLimit) return false;
        }
      }
    }

    return true;
  });

  // 3. SORTING OPTIONS
  const sortedOrders = [...filtersApplied].sort((a, b) => {
    const aDate = new Date(a.createdAt || 0);
    const bDate = new Date(b.createdAt || 0);
    const aEarnings = (a.earnings?.tripPay || 0) + (a.earnings?.tips || 0) + (a.earnings?.incentives || 0);
    const bEarnings = (b.earnings?.tripPay || 0) + (b.earnings?.tips || 0) + (b.earnings?.incentives || 0);

    switch (sortBy) {
      case 'Latest First':
        return bDate - aDate;
      case 'Oldest First':
        return aDate - bDate;
      case 'Highest Earnings':
        return bEarnings - aEarnings;
      case 'Nearest Distance':
        // Mock sorting by simulated distance (using coordinates or order ID length)
        return (a._id?.length || 0) % 3 - (b._id?.length || 0) % 3;
      default:
        return 0;
    }
  });

  // 4. GROUP BY DATE (for displaying in view)
  const groupOrdersByDate = (ordersList) => {
    const groups = {
      Today: [],
      Yesterday: [],
      Earlier: []
    };

    ordersList.forEach(order => {
      const date = order.createdAt;
      if (isToday(date)) {
        groups.Today.push(order);
      } else if (isYesterday(date)) {
        groups.Yesterday.push(order);
      } else {
        groups.Earlier.push(order);
      }
    });

    return groups;
  };

  // Paginated calculations
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage) || 1;
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const groupedPaginated = groupOrdersByDate(paginatedOrders);

  // Helper variables for styling priority & type
  const getOrderTypeBadge = (type) => {
    const t = type || 'Food';
    switch (t) {
      case 'Food':
        return {
          icon: <Utensils className="h-3 w-3" />,
          color: 'bg-red-50 text-red-600 border-red-100',
          label: 'Food Delivery'
        };
      case 'Product':
        return {
          icon: <Package className="h-3 w-3" />,
          color: 'bg-blue-50 text-blue-600 border-blue-100',
          label: 'Product Package'
        };
      case 'Technician':
        return {
          icon: <Wrench className="h-3 w-3" />,
          color: 'bg-purple-50 text-purple-600 border-purple-100',
          label: 'Technician Toolkit'
        };
      default:
        return {
          icon: <Package className="h-3 w-3" />,
          color: 'bg-slate-50 text-slate-600 border-slate-100',
          label: t
        };
    }
  };

  const getPriorityBadge = (prio) => {
    const p = prio || 'Normal';
    if (p === 'Express') {
      return 'bg-amber-100 text-amber-700 border-amber-200 font-extrabold flex items-center gap-0.5';
    }
    return 'bg-slate-150 text-slate-500 border-slate-200 font-bold';
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (['pending', 'accepted', 'reached_vendor', 'picked_up', 'reached_customer'].includes(s)) {
      return 'bg-blue-500 text-white border-blue-600';
    }
    if (s === 'delivered' || s === 'completed') {
      return 'bg-green-500 text-white border-green-600';
    }
    if (s === 'cancelled') {
      return 'bg-red-500 text-white border-red-600';
    }
    if (s === 'returned') {
      return 'bg-indigo-500 text-white border-indigo-600';
    }
    if (s === 'scheduled') {
      return 'bg-teal-500 text-white border-teal-600';
    }
    return 'bg-slate-400 text-white border-slate-500';
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-10">
      {/* HORIZONTAL TABS */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-250 shadow-sm gap-2">
        {['Active', 'Completed', 'Cancelled', 'Returned', 'Scheduled'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`flex-1 py-3 text-center font-bold text-xs uppercase tracking-wider rounded-xl transition-all ${
                isActive 
                  ? 'bg-brand text-slate-950 font-black shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* FILTER & SORT SECTION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            Filters & Sorting
          </div>
          <div>
            <button 
              onClick={handleClearFilters}
              className="text-[10px] font-black text-red-500 hover:text-red-650 uppercase flex items-center gap-0.5 hover:underline whitespace-nowrap"
            >
              <RotateCcw className="h-3 w-3" /> Clear Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Date Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Date Assigned</label>
            <select
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none font-bold text-slate-700"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Custom Range">Custom Range</option>
            </select>
          </div>

          {/* Order Type */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Order Type</label>
            <select
              value={orderTypeFilter}
              onChange={(e) => { setOrderTypeFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none font-bold text-slate-700"
            >
              <option value="All">All Types</option>
              <option value="Food">Food Delivery</option>
              <option value="Product">Product Package</option>
            </select>
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none font-bold text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="Express">⚡ Express</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          {/* Payment */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Payment Mode</label>
            <select
              value={paymentFilter}
              onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none font-bold text-slate-700"
            >
              <option value="All">All Payments</option>
              <option value="Online">Online / Prepaid</option>
              <option value="Cash on Delivery">Cash on Delivery (COD)</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sort List By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none font-bold text-slate-750"
            >
              <option value="Latest First">Latest First</option>
              <option value="Oldest First">Oldest First</option>
              <option value="Highest Earnings">Highest Earnings</option>
              <option value="Nearest Distance">Nearest Distance</option>
            </select>
          </div>
        </div>

        {/* Custom Date Picker Fields */}
        {dateFilter === 'Custom Range' && (
          <div className="flex items-center gap-3 pt-3 border-t border-dashed border-slate-100 animate-slide-down">
            <div className="flex-1 max-w-[200px]">
              <input 
                type="date"
                value={customStartDate}
                onChange={(e) => { setCustomStartDate(e.target.value); setCurrentPage(1); }}
                className="w-full px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-slate-400 text-xs font-semibold">to</span>
            <div className="flex-1 max-w-[200px]">
              <input 
                type="date"
                value={customEndDate}
                onChange={(e) => { setCustomEndDate(e.target.value); setCurrentPage(1); }}
                className="w-full px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-6">
        {sortedOrders.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-slate-50 text-slate-350 rounded-full flex items-center justify-center mx-auto border-2 border-slate-100/50 shadow-inner">
              <Inbox className="h-9 w-9" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-800 text-lg">No Orders Found</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Try changing the filters or wait for new order assignments.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 mx-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Orders
            </button>
          </div>
        ) : (
          /* DISPLAY GROUPED DATE SECTIONS */
          ['Today', 'Yesterday', 'Earlier'].map((group) => {
            const groupList = groupedPaginated[group];
            if (groupList.length === 0) return null;

            return (
              <div key={group} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">{group} Orders</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold">{groupList.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupList.map((order) => {
                    const typeBadge = getOrderTypeBadge(order.orderType);
                    const isOrderActive = ['pending', 'accepted', 'reached_vendor', 'picked_up', 'reached_customer'].includes(order.status?.toLowerCase());
                    const totalPay = (order.earnings?.tripPay || 0) + (order.earnings?.tips || 0) + (order.earnings?.incentives || 0);

                    return (
                      <div 
                        key={order._id}
                        className="bg-white rounded-2xl border border-slate-150 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
                      >
                        {/* Upper Section */}
                        <div className="p-5 space-y-4">
                          {/* Header badge row */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <span className="text-[9px] text-slate-450 font-black tracking-wider uppercase block">Order ID</span>
                              <span className="text-xs font-black text-slate-800 font-mono">
                                #ORD{order._id?.substring(14) || order._id}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-[9px] font-black border px-2.5 py-1 rounded-full uppercase ${typeBadge.color}`}>
                                {typeBadge.label}
                              </span>
                              <span className={`text-[9px] font-black border px-2.5 py-1 rounded-full uppercase ${getPriorityBadge(order.priority)}`}>
                                {order.priority === 'Express' ? '⚡ ' : ''}{order.priority || 'Normal'}
                              </span>
                              <span className={`text-[9px] font-black border px-2.5 py-1 rounded-full uppercase ${getStatusBadge(order.status)}`}>
                                {order.status?.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          {/* Customer name row */}
                          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                              <User className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Customer</span>
                              <span className="text-xs font-black text-slate-700 leading-none">{order.customerName || 'Anonymous Rider'}</span>
                            </div>
                          </div>

                          {/* Route locations */}
                          <div className="relative border-l border-dashed border-slate-200 pl-4.5 ml-3 space-y-3 text-xs">
                            <div className="relative">
                              <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow"></span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase block">Pickup</span>
                              <p className="font-bold text-slate-750 line-clamp-1">{order.pickupLocation || 'Restaurant Depot, MG Road'}</p>
                            </div>
                            <div className="relative">
                              <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white shadow"></span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase block">Delivery Dropoff</span>
                              <p className="font-bold text-slate-750 line-clamp-1">{order.deliveryLocation || 'Indiranagar Housing'}</p>
                            </div>
                          </div>

                          {/* Time details and payment mode row */}
                          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                            <div className="space-y-0.5">
                              <span className="text-[9px] text-slate-400 font-bold uppercase block flex items-center gap-0.5">
                                <Clock className="h-3 w-3" /> Assigned
                              </span>
                              <span className="font-semibold text-slate-600 block">{formatDateTime(order.createdAt)}</span>
                            </div>
                            {order.deliveryTime && (
                              <div className="space-y-0.5">
                                <span className="text-[9px] text-slate-400 font-bold uppercase block flex items-center gap-0.5">
                                  <CheckCircle className="h-3 w-3 text-green-500" /> Completed
                                </span>
                                <span className="font-semibold text-slate-600 block">{formatDateTime(order.deliveryTime)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer row (Earnings & Action Buttons) */}
                        <div className="bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase block flex items-center gap-0.5">
                              <CreditCard className="h-3.5 w-3.5 text-slate-400" /> {order.paymentMethod || 'Online'}
                            </span>
                            <span className="font-black text-slate-800 text-base">₹{totalPay.toFixed(2)}</span>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-450" /> Details
                            </button>
                            {!isOrderActive && (
                              <button 
                                onClick={() => downloadMockInvoice(order._id)}
                                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center transition-all shadow-sm"
                                title="Download Invoice"
                              >
                                <Download className="h-3.5 w-3.5 text-slate-450" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION SECTION */}
      {sortedOrders.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="text-slate-400 text-xs font-semibold">
            Showing Page <span className="text-slate-700 font-bold">{currentPage}</span> of <span className="text-slate-700 font-bold">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border border-slate-200 flex items-center justify-center transition-all ${
                currentPage === 1 
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-300' 
                  : 'hover:bg-slate-50 text-slate-600 active:scale-95'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isCurrent = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center border ${
                    isCurrent 
                      ? 'bg-blue-600 border-blue-600 text-white font-black shadow-md shadow-blue-100' 
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl border border-slate-200 flex items-center justify-center transition-all ${
                currentPage === totalPages 
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-300' 
                  : 'hover:bg-slate-50 text-slate-600 active:scale-95'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* DETAILED ORDER POPUP MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-scale-up flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-800">Order Details</h3>
                <span className="text-[10px] text-slate-400 font-mono font-bold">#ORD{selectedOrder._id}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Type, status, priority tags */}
              <div className="flex flex-wrap gap-2">
                <span className={`text-[10px] font-black border px-3 py-1.5 rounded-full uppercase ${getOrderTypeBadge(selectedOrder.orderType).color}`}>
                  {getOrderTypeBadge(selectedOrder.orderType).label}
                </span>
                <span className={`text-[10px] font-black border px-3 py-1.5 rounded-full uppercase ${getPriorityBadge(selectedOrder.priority)}`}>
                  {selectedOrder.priority === 'Express' ? '⚡ ' : ''}{selectedOrder.priority || 'Normal'} Priority
                </span>
                <span className={`text-[10px] font-black border px-3 py-1.5 rounded-full uppercase ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status?.replace('_', ' ')}
                </span>
              </div>

              {/* Customer Profile Banner */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Customer</span>
                  <span className="text-sm font-black text-slate-800">{selectedOrder.customerName || 'Anonymous Rider'}</span>
                </div>
              </div>

              {/* Route Path timeline */}
              <div className="relative border-l-2 border-dashed border-slate-200 pl-6 ml-3.5 space-y-5 text-xs">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-3 border-white shadow"></span>
                  <span className="text-[10px] text-blue-500 font-black uppercase tracking-wider block">Pickup Outlet Address</span>
                  <h5 className="font-extrabold text-slate-800 text-sm mt-0.5">Fresh Bites Restaurant</h5>
                  <p className="text-slate-500 mt-0.5">{selectedOrder.pickupLocation || '24, MG Road, Indiranagar, Bengaluru'}</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-red-500 border-3 border-white shadow"></span>
                  <span className="text-[10px] text-red-500 font-black uppercase tracking-wider block">Customer Destination Address</span>
                  <h5 className="font-extrabold text-slate-800 text-sm mt-0.5">{selectedOrder.customerName || 'Arun Kumar'}</h5>
                  <p className="text-slate-500 mt-0.5">{selectedOrder.deliveryLocation || '45, 5th Cross, Koramangala, Bengaluru'}</p>
                </div>
              </div>

              {/* Timestamp Tracking Timeline */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Dispatch Timestamps</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Job Assigned</span>
                    <span className="font-extrabold text-slate-700">{formatDateTime(selectedOrder.createdAt)}</span>
                  </div>
                  {selectedOrder.deliveryTime ? (
                    <div className="bg-green-50/55 border border-green-100/50 rounded-xl p-3">
                      <span className="text-[9px] text-green-600 font-bold uppercase block">Delivered Completed</span>
                      <span className="font-extrabold text-green-700">{formatDateTime(selectedOrder.deliveryTime)}</span>
                    </div>
                  ) : (
                    <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-3">
                      <span className="text-[9px] text-amber-600 font-bold uppercase block">Transit Status</span>
                      <span className="font-extrabold text-amber-700 capitalize">{selectedOrder.status?.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Details & Earnings breakdown */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Earnings & Payout Breakdown</h4>
                
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Distance Trip Pay</span>
                    <span className="font-bold text-slate-750">₹{(selectedOrder.earnings?.tripPay || 120).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Tips</span>
                    <span className="font-bold text-slate-750">₹{(selectedOrder.earnings?.tips || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak Hours Dispatch Incentive</span>
                    <span className="font-bold text-slate-750">₹{(selectedOrder.earnings?.incentives || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-slate-200 pt-2.5 text-slate-800">
                    <span className="font-black text-sm">Total Rider Earnings</span>
                    <span className="font-black text-sm text-green-650">
                      ₹{((selectedOrder.earnings?.tripPay || 0) + (selectedOrder.earnings?.tips || 0) + (selectedOrder.earnings?.incentives || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-green-100/60 text-green-600 flex items-center justify-center font-bold">
                    💳
                  </div>
                  <div>
                    <span className="text-[9px] text-green-700 font-bold uppercase block leading-none">Payment Released via</span>
                    <span className="text-xs font-black text-green-800 leading-none">{selectedOrder.paymentMethod || 'Online'} Payment</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              {['delivered', 'completed'].includes(selectedOrder.status?.toLowerCase()) ? (
                <button
                  onClick={() => downloadMockInvoice(selectedOrder._id)}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Download className="h-3.5 w-3.5" /> Download Invoice
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-black rounded-xl text-xs shadowactive:scale-95 transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
