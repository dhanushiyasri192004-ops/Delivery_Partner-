import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
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
  Headphones
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: null, lng: null });
  const [cameraStream, setCameraStream] = useState(null);
  const unreadNotifications = useSelector((state) => state.notification.unreadCount || 0);
  const notificationList = useSelector((state) => state.notification.notifications || []);

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
      // User is checking out: show confirmation modal
      setShowCheckoutModal(true);
    } else {
      // User is checking in: show camera modal
      setShowCameraModal(true);
      // Fetch GPS coordinates
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setGpsCoordinates({
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6)
            });
          },
          (err) => {
            // Fallback mock coordinates if GPS fails or blocked
            setGpsCoordinates({ lat: "12.971598", lng: "77.594562" });
          }
        );
      } else {
        setGpsCoordinates({ lat: "12.971598", lng: "77.594562" });
      }
      
      // Request Camera Access
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
    // Stop camera stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
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
    setIsOnline(false);
    setShowCheckoutModal(false);
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
      case 'technician':
        return [
          { name: 'Dashboard', path: '/technician/dashboard', icon: LayoutDashboard },
          { name: 'Services Checklist', path: '/technician/services', icon: Wrench },
          { name: 'Wallet ledger', path: '/technician/wallet', icon: Wallet },
          { name: 'Profile & Settings', path: '/technician/profile', icon: Settings },
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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200 overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex flex-col items-center pt-3 pb-1">
            {/* SVG Logo Icon matching 2nd image */}
            <div className="flex items-center justify-center">
              <svg className="h-7.5 w-auto" viewBox="0 0 80 40" fill="none">
                {/* Left blue bracket shape */}
                <rect x="25" y="8" width="5" height="24" fill="#2563eb" />
                <rect x="25" y="8" width="18" height="5" fill="#2563eb" />
                <rect x="38" y="13" width="5" height="5" fill="#2563eb" />
                {/* Yellow triangle shape */}
                <polygon points="36,32 44,20 52,32" fill="#eab308" />
              </svg>
            </div>
            
            {/* Logo Text branding */}
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
 
          {/* Profile overview card (Matches reference layout) */}
          <div className="p-3 flex flex-col items-center text-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" 
                alt="Rider avatar" 
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 shadow-sm"
              />
              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}></span>
            </div>
            <h4 className="mt-1 font-bold text-slate-800 text-xs">{user?.name || 'Ramesh Kumar'}</h4>
            <div className="flex items-center gap-1 mt-0.5 justify-center">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span className="text-[9px] font-bold text-green-600 capitalize">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            
            {/* Rating Bar */}
            <div className="mt-1.5 bg-yellow-50/80 border border-yellow-100 rounded-xl px-3 py-1 w-28 shadow-sm text-center">
              <div className="text-[10px] font-extrabold text-yellow-600 flex items-center justify-center gap-1 leading-none">
                ⭐ 4.8
              </div>
              <div className="text-[8px] text-slate-400 font-bold mt-0.5">250+ Deliveries</div>
            </div>
          </div>
 
          {/* Nav items */}
          <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-hidden">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`group flex items-center px-3 py-2.5 text-[13px] font-bold rounded-xl transition-all ${
                    isActive 
                      ? 'bg-brand text-slate-900 font-extrabold shadow shadow-brand/10' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`mr-2.5 h-4.5 w-4.5 ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {link.name}
                  {link.name === 'Chat Support' && unreadNotifications > 0 && (
                    <span className="ml-auto bg-yellow-500 text-slate-900 font-bold rounded-full text-[8px] px-1.5 py-0.5 leading-none">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
              );
            })}
 
            {/* Log Out link directly inside nav list */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-[13px] font-bold text-red-600 rounded-xl hover:bg-red-50 transition-all mt-2"
            >
              <LogOut className="mr-2.5 h-4.5 w-4.5 text-red-500" />
              Log Out
            </button>
          </nav>
 
          {/* Refer & Earn Promo Card */}
          <div className="px-3 py-1.5">
            <div className="bg-orange-50/70 border border-orange-100 rounded-2xl p-2 text-center relative overflow-hidden shadow-sm">
              <h5 className="font-bold text-slate-800 text-[9px] uppercase tracking-wider">Refer & Earn</h5>
              <p className="text-[8px] text-slate-500 mt-0.5 leading-tight">Refer a friend and earn exciting rewards</p>
              
              {/* Gift image asset placeholder */}
              <div className="w-8 h-8 mx-auto my-1.5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center border border-orange-100 shadow-inner">
                <span className="text-lg">🎁</span>
              </div>
 
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-[9px] font-bold py-1.5 rounded-xl shadow-sm shadow-orange-500/10 transition-all">
                Refer Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="md:pl-64 flex flex-col flex-1 w-full">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-slate-200 md:hidden justify-between items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-base font-bold text-slate-900 capitalize">
            connect app-<span className="text-brand">delivery partner</span>
          </span>
          <div className="flex items-center gap-4">
            <button className="relative p-1 rounded-full text-slate-400 hover:text-slate-500">
              <Bell className="h-6 w-6" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <header className="hidden md:flex flex-shrink-0 justify-between items-center px-8 pt-8 pb-4 w-full">
          <div className="flex-1">
            {location.pathname === '/delivery/dashboard' ? (
              <div>
                <h2 className="text-2.5xl font-extrabold text-slate-800 flex items-center gap-2 tracking-tight leading-tight">
                  Hello, {user?.name || 'Partner'} 👋
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-1">Ready to deliver smiles today!</p>
              </div>
            ) : (
              <h1 className="text-xl font-bold text-slate-800 capitalize">
                {getPageTitle()}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-yellow-50 hover:bg-yellow-100/80 rounded-full text-yellow-600 transition-all border border-yellow-100"
              >
                <Bell className="h-4.5 w-4.5" />
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
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                  <span className="text-xs font-bold text-slate-700">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
                <div className="text-[8px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
                  {isOnline ? 'SHIFT STARTED: 08:00 AM' : 'SHIFT NOT STARTED'}
                </div>
              </div>

              {/* Check In / Check Out Action Button */}
              <button 
                onClick={toggleOnlineStatus}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-xs font-extrabold shadow-sm transition-all active:scale-95"
              >
                {isOnline ? 'Check Out' : 'Check In'}
              </button>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 px-8 pb-8 pt-2">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer (Matches details) */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transition-all">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            {/* Drawer Sidebar Content */}
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1 capitalize">
                  connect app-<span className="text-brand">delivery partner</span>
                </span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive ? 'bg-brand text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="mr-4 h-6 w-6" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-slate-200 p-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-2 py-2 text-base font-medium text-red-600 rounded-md hover:bg-slate-50"
              >
                <LogOut className="mr-4 h-6 w-6 text-red-400" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-In Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-800 text-center">Rider GPS Onboarding</h3>
            <p className="text-xs text-slate-500 text-center mt-1">Please take a live GPS onboarding verification selfie to Check In.</p>
            
            {/* Camera View Window */}
            <div className="relative w-64 h-64 rounded-full overflow-hidden bg-slate-100 border-4 border-yellow-400 my-6 shadow-inner flex items-center justify-center">
              {cameraStream ? (
                <video 
                  id="checkin-video" 
                  className="w-full h-full object-cover scale-x-[-1]"
                  playsInline 
                  muted 
                />
              ) : (
                <div className="text-center p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
                  <span className="text-[10px] text-slate-400 font-bold">Connecting Camera...</span>
                </div>
              )}

              {/* HUD Coordinates Watermark overlay */}
              {gpsCoordinates.lat && (
                <div className="absolute bottom-4 bg-slate-900/80 text-white px-3 py-1 rounded-full text-[8px] font-mono tracking-tight font-bold">
                  📍 {gpsCoordinates.lat}, {gpsCoordinates.lng}
                </div>
              )}
            </div>

            {/* GPS Lock Card Info */}
            <div className="bg-green-50/70 border border-green-100 rounded-xl px-4 py-2 w-full text-center flex items-center justify-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider">GPS Onboarding Photo Verified</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <button 
                onClick={handleCaptureCheckIn}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                Capture & Check In
              </button>
              <button 
                onClick={handleCancelCheckIn}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 font-bold py-2.5 rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Confirmation Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 bg-red-50/70 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 text-2xl font-bold">
              !
            </div>
            <h3 className="text-base font-bold text-slate-800">Confirm Shift Check-Out</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to end your active shift and stop receiving delivery assignments?
            </p>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleConfirmCheckOut}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow transition-all active:scale-95"
              >
                Yes, Check Out
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
    </div>
  );
};

export default DashboardLayout;
export { socket };
