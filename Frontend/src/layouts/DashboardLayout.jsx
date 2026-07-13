import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { updateOnlineStatus } from '../redux/slices/deliverySlice';
import { 
  LayoutDashboard, 
  MapPin, 
  Wallet, 
  History, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X,
  User,
  Wrench,
  Navigation,
  ShoppingBag,
  CreditCard,
  PieChart,
  Headphones,
  CheckCircle,
  TrendingUp,
  Plus,
  Briefcase,
  Layers,
  Star,
  Activity,
  FileText,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { io } from 'socket.io-client';

let socket = null;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, profile } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(profile?.status === 'online');
  const [shiftStatus, setShiftStatus] = useState('active'); // active, break, lunch
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showActiveOrderWarning, setShowActiveOrderWarning] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: null, lng: null });
  const [cameraStream, setCameraStream] = useState(null);
  const unreadNotifications = useSelector((state) => state.notification.unreadCount || 0);
  const notificationList = useSelector((state) => state.notification.notifications || []);

  // Select activeOrder & partnerStatus from delivery slice safely
  const deliveryState = useSelector((state) => state.delivery || {});
  const { partnerStatus, activeOrder } = deliveryState;

  // --- MULTI-BUSINESS STATES FOR TECHNICIAN ---
  const [businesses, setBusinesses] = useState(() => {
    if (user?.role === 'technician') {
      const saved = localStorage.getItem(`tech_businesses_${user.id}`);
      if (saved) return JSON.parse(saved);
      // Clean display name of profile technician type
      const primaryType = profile?.technicianType || 'Washing Machine Technician';
      const cleanPrimary = primaryType.replace(' Technician', '').replace(' Repair', '');
      return [cleanPrimary];
    }
    return [];
  });

  const [selectedBusiness, setSelectedBusiness] = useState(() => {
    if (user?.role === 'technician') {
      const saved = localStorage.getItem(`tech_selected_biz_${user.id}`);
      return saved || 'OVERALL';
    }
    return 'OVERALL';
  });

  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false);

  // Add Business Form state
  const [newBizFormData, setNewBizFormData] = useState({
    businessType: 'AC Repair',
    businessName: '',
    logo: '🛠️',
    description: '',
    workingHours: '09:00 AM - 06:00 PM',
    serviceArea: 'Koramangala, HSR Layout, JP Nagar',
    availableServices: 'Installation, Gas Filling, General Service, Repair'
  });

  // Sync businesses to localStorage
  useEffect(() => {
    if (user?.role === 'technician' && businesses.length > 0) {
      localStorage.setItem(`tech_businesses_${user.id}`, JSON.stringify(businesses));
    }
  }, [businesses, user]);

  // Sync selectedBusiness to localStorage
  useEffect(() => {
    if (user?.role === 'technician') {
      localStorage.setItem(`tech_selected_biz_${user.id}`, selectedBusiness);
    }
  }, [selectedBusiness, user]);

  // Sync online status
  useEffect(() => {
    if (user?.role === 'delivery_partner' && partnerStatus) {
      setIsOnline(partnerStatus !== 'offline');
      if (partnerStatus === 'break') setShiftStatus('break');
      else if (partnerStatus === 'lunch') setShiftStatus('lunch');
      else if (partnerStatus === 'online') setShiftStatus('active');
    }
  }, [partnerStatus, user?.role]);

  // Initialize Socket connection
  useEffect(() => {
    if (user) {
      socket = io('http://localhost:5000', {
        auth: { token: localStorage.getItem('token') }
      });

      socket.emit('join_room', { userId: user.id, role: user.role });

      // Simulating GPS location tracking loop
      const locationInterval = setInterval(() => {
        if (isOnline && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              socket.emit('update_location', {
                tripId: 'simulation_trip',
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                role: user.role
              });
            },
            (err) => {
              // Mock coordinates if browser geolocator is blocked
              socket.emit('update_location', {
                tripId: 'simulation_trip',
                latitude: 12.9716 + (Math.random() - 0.5) * 0.01,
                longitude: 77.5946 + (Math.random() - 0.5) * 0.01,
                role: user.role
              });
            }
          );
        }
      }, 10000);

      return () => {
        clearInterval(locationInterval);
        socket.disconnect();
      };
    }
  }, [user, isOnline]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];

    if (path.startsWith('/delivery/')) {
      const mapping = {
        'dashboard': 'Dashboard',
        'orders': 'My Orders',
        'wallet': 'Earnings',
        'withdraw': 'Wallet',
        'history': 'Performance',
        'notifications': 'Chat Support',
        'settings': 'Settings',
        'profile': 'Profile'
      };
      return mapping[lastSegment] || lastSegment.replace('-', ' ');
    }
    return lastSegment?.replace('-', ' ') || 'Dashboard';
  };

  const toggleOnlineStatus = () => {
    if (isOnline) {
      if (user?.role === 'delivery_partner' && activeOrder) {
        setShowActiveOrderWarning(true);
        return;
      }
      setShowCheckoutModal(true);
    } else {
      setShowCameraModal(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setGpsCoordinates({
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6)
            });
          },
          (err) => {
            setGpsCoordinates({ lat: "12.971598", lng: "77.594562" });
          }
        );
      } else {
        setGpsCoordinates({ lat: "12.971598", lng: "77.594562" });
      }
      
      setTimeout(() => {
        const videoElement = document.getElementById('checkin-video');
        if (videoElement && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
            .then((stream) => {
              videoElement.srcObject = stream;
              videoElement.play().catch(e => console.log(e));
              setCameraStream(stream);
            })
            .catch((err) => {
              console.log("No webcam hardware available, using simulation avatar:", err);
            });
        }
      }, 300);
    }
  };

  const handleCaptureCheckIn = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    if (user?.role === 'delivery_partner') {
      dispatch(updateOnlineStatus('online'));
    }
    setIsOnline(true);
    setShowCameraModal(false);
  };

  const handleCancelCheckIn = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const handleConfirmCheckOut = () => {
    if (user?.role === 'delivery_partner') {
      dispatch(updateOnlineStatus('offline'));
    }
    setIsOnline(false);
    setShiftStatus('active');
    setShowCheckoutModal(false);
  };

  // Add new business submission
  const handleAddBusinessSubmit = (e) => {
    e.preventDefault();
    if (!newBizFormData.businessName) return alert('Please enter Business Name');
    
    // Save to businesses list
    const cleanBizType = newBizFormData.businessType.replace(' Technician', '').replace(' Repair', '');
    if (businesses.includes(cleanBizType)) {
      alert('Business category already exists!');
      return;
    }

    setBusinesses((prev) => [...prev, cleanBizType]);
    setSelectedBusiness(cleanBizType);
    setActiveMenu('Dashboard');
    setShowAddBusinessModal(false);

    // Reset Form
    setNewBizFormData({
      businessType: 'AC Repair',
      businessName: '',
      logo: '🛠️',
      description: '',
      workingHours: '09:00 AM - 06:00 PM',
      serviceArea: 'Koramangala, HSR Layout, JP Nagar',
      availableServices: 'Installation, Gas Filling, General Service, Repair'
    });
  };

  // Define navigation based on roles
  const getNavLinks = () => {
    switch (user?.role) {
      case 'delivery_partner':
        return [
          { name: 'Dashboard', path: '/delivery/dashboard', icon: LayoutDashboard },
          { name: 'My Orders', path: '/delivery/orders', icon: ShoppingBag },
          { name: 'Earnings', path: '/delivery/wallet', icon: CreditCard },
          { name: 'Wallet', path: '/delivery/withdraw', icon: Wallet },
          { name: 'Performance', path: '/delivery/history', icon: PieChart },
          { name: 'Chat Support', path: '/delivery/notifications', icon: Headphones },
          { name: 'Settings', path: '/delivery/settings', icon: Settings },
        ];
      case 'executive':
        return [
          { name: 'Dashboard', path: '/executive/dashboard', icon: LayoutDashboard },
          { name: 'Assigned Trips', path: '/executive/trips', icon: MapPin },
          { name: 'Profile', path: '/executive/profile', icon: User },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  // Helper for rendering business category icons
  const getBizIcon = (bizName) => {
    switch (bizName.toLowerCase()) {
      case 'washing machine': return '🛠️';
      case 'ac repair':
      case 'ac': return '❄️';
      case 'refrigerator': return '🧊';
      case 'tv repair':
      case 'tv': return '📺';
      case 'geyser': return '🔥';
      case 'electrician': return '⚡';
      case 'plumber': return '🚰';
      default: return '💼';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-base">
      
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200 overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex flex-col items-center pt-3 pb-1">
            <div className="flex items-center justify-center">
              <svg className="h-7.5 w-auto" viewBox="0 0 80 40" fill="none">
                <rect x="25" y="8" width="5" height="24" fill="#2563eb" />
                <rect x="25" y="8" width="18" height="5" fill="#2563eb" />
                <rect x="38" y="13" width="5" height="5" fill="#2563eb" />
                <polygon points="36,32 44,20 52,32" fill="#eab308" />
              </svg>
            </div>
            <div className="text-center mt-0.5">
              <div className="text-xs font-black tracking-wide leading-none flex items-center justify-center gap-0.5">
                <span className="text-blue-600">FORGE</span>
                <span className="text-amber-500">INDIA</span>
              </div>
              <div className="text-[7.5px] font-bold text-blue-600 tracking-[0.2em] mt-1 uppercase text-center leading-none">
                CONNECT
              </div>
            </div>
          </div>
 
          {/* Profile overview card */}
          <div className="p-3 flex flex-col items-center text-center border-b border-slate-100">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" 
                alt="Rider avatar" 
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-sm"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}></span>
            </div>
            <h4 className="mt-1 font-extrabold text-slate-805 text-sm">{user?.name || 'Dhanu'}</h4>
            <div className="flex items-center gap-1 mt-0.5 justify-center">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span className="text-xs font-bold text-green-600 capitalize">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
 
          {/* Nav items */}
          <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
            {user?.role === 'technician' ? (
              // --- TECHNICIAN CUSTOM MULTI-BUSINESS SIDEBAR LAYOUT ---
              <div className="space-y-4">
                
                {/* Overall Dashboard Link */}
                <button
                  onClick={() => {
                    setSelectedBusiness('OVERALL');
                    setActiveMenu('Dashboard');
                    navigate('/technician/dashboard');
                  }}
                  className={`flex items-center w-full px-3 py-2.5 text-sm font-bold rounded-xl transition-all ${
                    selectedBusiness === 'OVERALL' && activeMenu === 'Dashboard'
                      ? 'bg-brand text-slate-900 font-black shadow shadow-brand/10' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="mr-2 h-4.5 w-4.5 text-slate-400" />
                  Dashboard
                </button>

                {/* MY BUSINESSES SECTION */}
                <div className="space-y-1">
                  <div className="px-3 text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">
                    MY BUSINESSES
                  </div>
                  {businesses.map((biz) => {
                    const isSelected = selectedBusiness === biz && activeMenu === 'Dashboard';
                    return (
                      <button
                        key={biz}
                        onClick={() => {
                          setSelectedBusiness(biz);
                          setActiveMenu('Dashboard');
                          navigate('/technician/dashboard');
                        }}
                        className={`flex items-center w-full px-3 py-1.5 text-sm font-bold rounded-xl transition-all ${
                          isSelected
                            ? 'bg-amber-50 border border-amber-100 text-amber-700 font-black'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="mr-2 text-sm">{getBizIcon(biz)}</span>
                        {biz}
                      </button>
                    );
                  })}
                  
                  {/* Add Business Link */}
                  <button
                    onClick={() => setShowAddBusinessModal(true)}
                    className="flex items-center w-full px-3 py-1.5 text-sm font-black text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Business
                  </button>
                </div>

                {/* SERVICE MENU SECTION */}
                <div className="space-y-0.5">
                  <div className="px-3 text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 pt-2">
                    SERVICE MENU
                  </div>
                  {[
                    { name: 'Service Requests', icon: Wrench },
                    { name: 'Bookings', icon: Calendar },
                    { name: 'Customers', icon: User },
                    { name: 'Technicians', icon: Briefcase },
                    { name: 'Payments', icon: CreditCard },
                    { name: 'Reviews', icon: Star },
                    { name: 'Reports', icon: FileText },
                    { name: 'Notifications', icon: Bell }
                  ].map((menuItem) => {
                    const isActive = activeMenu === menuItem.name;
                    const Icon = menuItem.icon;
                    return (
                      <button
                        key={menuItem.name}
                        onClick={() => {
                          setActiveMenu(menuItem.name);
                          navigate('/technician/dashboard');
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-bold rounded-xl transition-all ${
                          isActive 
                            ? 'bg-slate-800 text-white font-black' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {menuItem.name}
                      </button>
                    );
                  })}
                </div>

              </div>
            ) : (
              // Standard Navigation links for delivery/executive
              navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`group flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all ${
                      isActive 
                        ? 'bg-brand text-slate-900 font-extrabold shadow shadow-brand/10' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`mr-2 h-4.5 w-4.5 ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-500'}`} />
                    {link.name}
                  </Link>
                );
              })
            )}
 
            {/* Log Out link directly inside nav list */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-bold text-red-655 rounded-xl hover:bg-red-50 transition-all mt-2"
            >
              <LogOut className="mr-2 h-4.5 w-4.5 text-red-500" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        
        {/* Main Header bar */}
        {!location.pathname.includes('/delivery/order-details/') && (
          <header className="sticky top-0 z-40 bg-white border-b border-slate-200 flex items-center justify-between px-8 py-3.5 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 border border-slate-200"
            >
              <Menu className="h-5 w-5" />
            </button>
            {location.pathname === '/delivery/dashboard' ? (
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Welcome, {user?.name || 'Rider'}
                </h2>
                <p className="text-xs text-slate-600 font-bold mt-1">Ready to deliver smiles today!</p>
              </div>
            ) : location.pathname === '/technician/dashboard' ? (
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Welcome, {user?.name || 'Dhanu'}
                </h2>
                <p className="text-xs text-slate-600 font-bold mt-1">Technician Dispatch Console</p>
              </div>
            ) : (
              <h1 className="text-lg font-extrabold text-slate-800 capitalize">
                {getPageTitle()}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-yellow-50 hover:bg-yellow-100/80 rounded-full text-yellow-600 transition-all border border-yellow-100 cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-slate-950 font-bold rounded-full text-[9px] flex items-center justify-center border border-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notification drop menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-150 font-semibold text-slate-700 flex justify-between items-center">
                    <span>Recent Notifications</span>
                    {unreadNotifications > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                        {unreadNotifications} New
                      </span>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notificationList.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-slate-400 text-center">
                        No notifications yet.
                      </div>
                    ) : (
                      notificationList.map((n, i) => (
                        <div key={i} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shift Availability Status Indicator */}
            <div className="flex items-center gap-4 ml-2">
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className={`w-2 h-2 rounded-full ${
                    !isOnline 
                      ? 'bg-slate-400' 
                      : 'bg-green-500 animate-pulse'
                  }`}></span>
                  <span className="text-xs font-bold text-slate-700">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <button 
                onClick={toggleOnlineStatus}
                className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm ${
                  isOnline 
                    ? 'bg-red-50 text-red-650 hover:bg-red-100/80 border border-red-100' 
                    : 'bg-blue-600 text-white hover:bg-blue-750'
                }`}
              >
                {isOnline ? 'Check Out' : 'Check In'}
              </button>
            </div>
          </div>
        </header>
        )}

        {/* Content Outlet with passed context values */}
        <main className="flex-1 px-6 pb-6 pt-5">
          <Outlet context={{ selectedBusiness, setSelectedBusiness, businesses, setBusinesses, activeMenu, setActiveMenu }} />
        </main>
      </div>

      {/* Dynamic "+ Add Business" Modal Form Overlay */}
      {showAddBusinessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-150 space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-805">Add New Service Business</h3>
              <button onClick={() => setShowAddBusinessModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBusinessSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Business Type</label>
                  <select
                    value={newBizFormData.businessType}
                    onChange={(e) => setNewBizFormData({ ...newBizFormData, businessType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="AC Repair">AC Repair</option>
                    <option value="Refrigerator">Refrigerator</option>
                    <option value="TV Repair">TV Repair</option>
                    <option value="Geyser">Geyser</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indiranagar AC Fixers"
                    value={newBizFormData.businessName}
                    onChange={(e) => setNewBizFormData({ ...newBizFormData, businessName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-850"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                <textarea
                  placeholder="Describe your service specialty..."
                  value={newBizFormData.description}
                  onChange={(e) => setNewBizFormData({ ...newBizFormData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-850 h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Working Hours</label>
                  <input
                    type="text"
                    value={newBizFormData.workingHours}
                    onChange={(e) => setNewBizFormData({ ...newBizFormData, workingHours: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Service Area</label>
                  <input
                    type="text"
                    value={newBizFormData.serviceArea}
                    onChange={(e) => setNewBizFormData({ ...newBizFormData, serviceArea: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-850"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBusinessModal(false)}
                  className="bg-white border border-slate-200 text-slate-500 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl text-xs shadow-md"
                >
                  Save Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standard checkin camera, checkout & warning modal overlays */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up text-center">
            <h3 className="text-base font-bold text-slate-805">Camera Verification</h3>
            <div className="bg-slate-900 aspect-video rounded-2xl overflow-hidden relative border border-slate-800">
              <video id="checkin-video" className="w-full h-full object-cover transform scale-x-[-1]"></video>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-600 font-bold">Please look at the camera to check-in</p>
              {gpsCoordinates.lat && (
                <span className="text-[10px] text-slate-400 block font-bold">📍 GPS: {gpsCoordinates.lat}, {gpsCoordinates.lng}</span>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleCancelCheckIn}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 font-bold py-2.5 rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleCaptureCheckIn}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                Capture & Check-In
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up text-center">
            <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              🚪
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-805">Check Out Duty</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">Are you sure you want to log off and stop receiving requests?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleConfirmCheckOut}
                className="flex-1 bg-red-650 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                Yes, Check-Out
              </button>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 font-bold py-2.5 rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showActiveOrderWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-scale-up">
            <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">Active Delivery In Progress</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                You have an active delivery. Please complete your current order before checking out.
              </p>
            </div>
            <button 
              onClick={() => setShowActiveOrderWarning(false)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
            >
              Understand
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardLayout;
export { socket };
