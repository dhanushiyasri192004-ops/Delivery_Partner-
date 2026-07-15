import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDeliveryDashboard, 
  acceptOrder, 
  reachedVendor, 
  reachedCustomer,
  verifyPickup,
  verifyDelivery
} from '../../redux/slices/deliverySlice';
import { 
  CreditCard, 
  ShoppingBag, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Compass,
  Camera
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { metrics, activeOrder, assignedOrder, partnerStatus, walletBalance, loading } = useSelector((state) => state.delivery);
  const { user } = useSelector((state) => state.auth);

  const mapRef = useRef(null);

  const [pickupConfirmed, setPickupConfirmed] = React.useState(false);
  const [pickupPhoto, setPickupPhoto] = React.useState(null);
  const [pickupPreview, setPickupPreview] = React.useState(null);
  const [pickupOtp, setPickupOtp] = React.useState('1234');
 
  const [deliveryPhoto, setDeliveryPhoto] = React.useState(null);
  const [deliveryPreview, setDeliveryPreview] = React.useState(null);
  const [deliveryOtp, setDeliveryOtp] = React.useState('');
  const [deliveryOtpConfirmed, setDeliveryOtpConfirmed] = React.useState(false);
 
  // Reset all step state when order changes
  useEffect(() => {
    if (!activeOrder) {
      setPickupConfirmed(false);
      setPickupPhoto(null);
      setPickupPreview(null);
      setPickupOtp('');
      setDeliveryPhoto(null);
      setDeliveryPreview(null);
      setDeliveryOtp('');
      setDeliveryOtpConfirmed(false);
    }
  }, [activeOrder?._id]);
 
  const handleVerifyPickup = () => {
    if (!pickupOtp) return;
    if (!pickupPhoto) return;
 
    const formData = new FormData();
    formData.append('otp', pickupOtp);
    formData.append('photo', pickupPhoto);
 
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        formData.append('latitude', pos.coords.latitude);
        formData.append('longitude', pos.coords.longitude);
        dispatch(verifyPickup({ orderId: activeOrder._id, formData })).then((res) => {
          if (!res.error) {
            dispatch(fetchDeliveryDashboard());
          }
        });
      },
      () => {
        formData.append('latitude', '12.9716');
        formData.append('longitude', '77.5946');
        dispatch(verifyPickup({ orderId: activeOrder._id, formData })).then((res) => {
          if (!res.error) {
            dispatch(fetchDeliveryDashboard());
          }
        });
      }
    );
  };
 
  const handleVerifyDelivery = () => {
    if (!deliveryOtp) return;
    if (!deliveryPhoto) return;
 
    const formData = new FormData();
    formData.append('otp', deliveryOtp);
    formData.append('photo', deliveryPhoto);
 
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        formData.append('latitude', pos.coords.latitude);
        formData.append('longitude', pos.coords.longitude);
        dispatch(verifyDelivery({ orderId: activeOrder._id, formData })).then((res) => {
          if (!res.error) {
            dispatch(fetchDeliveryDashboard());
          }
        });
      },
      () => {
        formData.append('latitude', '12.9716');
        formData.append('longitude', '77.5946');
        dispatch(verifyDelivery({ orderId: activeOrder._id, formData })).then((res) => {
          if (!res.error) {
            dispatch(fetchDeliveryDashboard());
          }
        });
      }
    );
  };

  useEffect(() => {
    dispatch(fetchDeliveryDashboard());
  }, [dispatch]);

  useEffect(() => {
    // 1. Inject Leaflet CSS Link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // 2. Inject Leaflet JS Script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const containerExists = document.getElementById('leaflet-map-container');
      if (window.L && !mapRef.current && containerExists) {
        // Setup coordinates matching mock database order
        const pickup = [12.9716, 77.5946]; // Fresh Bites Restaurant (Indiranagar)
        const drop = [12.9616, 77.6046];   // Arun Kumar Dropoff (Koramangala)
        
        // Initialize Map
        const map = window.L.map('leaflet-map-container', {
          zoomControl: false,
          attributionControl: false
        }).setView(pickup, 13);
        mapRef.current = map;

        // Load Voyager light map tiles
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 20
        }).addTo(map);

        // Custom DivIcon for Pickup Pin
        const pickupIcon = window.L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
                   <div class="relative w-5 h-5 rounded-full bg-blue-600 border border-white shadow-md flex items-center justify-center text-white text-[8px] font-bold">P</div>
                 </div>`,
          className: 'custom-map-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        // Custom DivIcon for Drop Pin
        const dropIcon = window.L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <div class="absolute w-8 h-8 rounded-full bg-red-500/20"></div>
                   <div class="relative w-5 h-5 rounded-full bg-red-50 border border-white shadow-md flex items-center justify-center text-white text-[8px] font-bold">D</div>
                 </div>`,
          className: 'custom-map-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        // Add Markers
        window.L.marker(pickup, { icon: pickupIcon }).addTo(map)
          .bindPopup('<b>Merchant Pickup</b><br>Fresh Bites Restaurant');
        window.L.marker(drop, { icon: dropIcon }).addTo(map)
          .bindPopup('<b>Customer Dropoff</b><br>Arun Kumar');

        // Draw dotted path polyline connecting pins
        window.L.polyline([pickup, drop], {
          color: '#2563eb',
          weight: 4,
          dashArray: '8, 6',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // Fit map bounds
        const bounds = window.L.latLngBounds([pickup, drop]);
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    };
    document.head.appendChild(script);

    return () => {
      // Clean up map instance
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      // Remove assets
      link.remove();
      script.remove();
    };
  }, []);

  const handleAcceptOrder = (orderId) => {
    dispatch(acceptOrder(orderId)).then((res) => {
      if (!res.error) {
        navigate(`/delivery/order-details/${orderId}`);
      }
    });
  };

  const handleReachedVendor = (orderId) => {
    dispatch(reachedVendor(orderId));
  };

  const handleReachedCustomer = (orderId) => {
    dispatch(reachedCustomer(orderId));
  };
 
  // Stepper: 9 steps, 0-indexed
  const STEPS = [
    { label: 'Accept',         title: 'New Order',            sub: 'Accept this dispatch assignment',       color: 'amber'  },
    { label: 'Reach Pickup',   title: 'Head to Pickup',       sub: 'Navigate to the merchant outlet',       color: 'blue'   },
    { label: 'Pick Up',        title: 'Pick Up Order',        sub: 'Collect the package from merchant',     color: 'blue'   },
    { label: 'Upload Photo',   title: 'Capture Package',      sub: 'Take a photo of the package',          color: 'purple' },
    { label: 'Start Delivery', title: 'Verify Pickup OTP',    sub: 'Enter the pickup OTP from merchant',    color: 'blue'   },
    { label: 'Reach Customer', title: 'Head to Customer',     sub: 'Navigate to the drop-off address',      color: 'orange' },
    { label: 'Verify OTP',     title: 'Customer OTP',         sub: 'Get the delivery OTP from customer',    color: 'blue'   },
    { label: 'Upload Photo',   title: 'Delivery Proof',       sub: 'Photograph the package handover',       color: 'purple' },
    { label: 'Complete',       title: 'Complete Delivery',    sub: 'Confirm & end this delivery trip',      color: 'green'  },
  ];

  const getStepperIndex = () => {
    if (!activeOrder) return 0;
    switch (activeOrder.status) {
      case 'accepted':        return 1;
      case 'reached_vendor':
        if (!pickupConfirmed) return 2;
        if (!pickupPhoto)     return 3;
        return 4;
      case 'picked_up':       return 5;
      case 'reached_customer':
        if (!deliveryOtpConfirmed) return 6;
        if (!deliveryPhoto)        return 7;
        return 8;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6 text-base">
      {/* Top Welcome Panel is rendered inside the layout header */}

      {/* Metrics Row (Matching exact layout: Earnings, Today's Orders, Completed, Cancellation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {/* Earnings Card */}
        <Link to="/delivery/earnings" className="bg-gradient-to-br from-amber-50/50 via-white to-white p-6 rounded-2xl border border-amber-150 hover:border-amber-300 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer text-slate-800 hover:text-slate-900 transform hover:-translate-y-1">
          <div className="space-y-1">
            <span className="text-sm text-amber-700 font-bold block uppercase tracking-wider">Today's Earnings</span>
            <p className="text-3xl font-black text-slate-955">₹{metrics?.todayEarnings || '1,680'}</p>
            <span className="text-sm text-green-700 font-bold flex items-center gap-1">
              ▲ 18% <span className="text-slate-500 font-normal">vs yesterday</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100/60 text-amber-700 flex items-center justify-center border border-amber-200">
            <CreditCard className="h-6 w-6" />
          </div>
        </Link>
 
        {/* Orders Card */}
        <Link to="/delivery/orders" className="bg-gradient-to-br from-blue-50/50 via-white to-white p-6 rounded-2xl border border-blue-150 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer text-slate-800 hover:text-slate-900 transform hover:-translate-y-1">
          <div className="space-y-1">
            <span className="text-sm text-blue-700 font-bold block uppercase tracking-wider">Today's Orders</span>
            <p className="text-3xl font-black text-slate-955">{metrics?.todayOrdersCount || '8'}</p>
            <span className="text-sm text-green-700 font-bold flex items-center gap-1">
              ▲ 14% <span className="text-slate-500 font-normal">vs yesterday</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100/60 text-blue-700 flex items-center justify-center border border-blue-200">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </Link>
 
        {/* Completed Card */}
        <Link to="/delivery/orders" className="bg-gradient-to-br from-emerald-50/50 via-white to-white p-6 rounded-2xl border border-emerald-150 hover:border-emerald-300 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer text-slate-800 hover:text-slate-900 transform hover:-translate-y-1">
          <div className="space-y-1">
            <span className="text-sm text-emerald-700 font-bold block uppercase tracking-wider">Completed Orders</span>
            <p className="text-3xl font-black text-slate-955">{metrics?.completedCount || '6'}</p>
            <span className="text-sm text-green-700 font-bold flex items-center gap-1">
              ▲ 20% <span className="text-slate-500 font-normal">vs yesterday</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100/60 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <CheckCircle className="h-6 w-6" />
          </div>
        </Link>
              {/* Cancellation Card */}
        <Link to="/delivery/performance" className="bg-gradient-to-br from-rose-50/50 via-white to-white p-6 rounded-2xl border border-rose-150 hover:border-rose-300 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer text-slate-800 hover:text-slate-900 transform hover:-translate-y-1">
          <div className="space-y-1">
            <span className="text-sm text-rose-700 font-bold block uppercase tracking-wider">Cancellation</span>
            <p className="text-3xl font-black text-slate-955">{metrics?.cancellationCount || '1'}</p>
            <span className="text-sm text-red-750 font-bold flex items-center gap-1">
              ▼ 50% <span className="text-slate-500 font-normal">vs yesterday</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-100/60 text-rose-700 flex items-center justify-center border border-rose-200">
            <XCircle className="h-6 w-6" />
          </div>
        </Link>
          {/* Active Order Notice Banner */}
      {activeOrder && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex gap-3 items-start sm:items-center">
            <span className="text-2xl">📦</span>
            <div>
              <h5 className="font-extrabold text-slate-900 text-sm">Active Delivery in Progress!</h5>
              <p className="text-xs text-slate-500">Order ID: #{activeOrder._id?.substring(14) || activeOrder._id}</p>
            </div>
          </div>
          <Link
            to={`/delivery/order-details/${activeOrder._id}`}
            className="bg-slate-950 hover:bg-slate-900 text-white font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all text-center"
          >
            Open Order Console
          </Link>
        </div>
      )}
      </div>


      {/* Row 3: Quick Access, Earnings graph preview, Performance Gauges (Matches wireframe bottom row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Access Grid */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md duration-300">
          <h4 className="font-bold text-slate-800 mb-4 text-sm">Quick Access</h4>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/delivery/orders" className="p-3 bg-slate-50 hover:bg-brand/10 hover:text-slate-950 rounded-xl text-center border border-slate-100 hover:border-brand/35 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 block">
              <span className="text-xl block mb-1">📦</span>
              <span className="text-xs font-semibold text-slate-650 block">Orders</span>
            </Link>
            <Link to="/delivery/earnings" className="p-3 bg-slate-50 hover:bg-brand/10 hover:text-slate-950 rounded-xl text-center border border-slate-100 hover:border-brand/35 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 block">
              <span className="text-xl block mb-1">💳</span>
              <span className="text-xs font-semibold text-slate-655 block">Earnings</span>
            </Link>
            <Link to="/delivery/wallet" className="p-3 bg-slate-50 hover:bg-brand/10 hover:text-slate-950 rounded-xl text-center border border-slate-100 hover:border-brand/35 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 block">
              <span className="text-xl block mb-1">💼</span>
              <span className="text-xs font-semibold text-slate-650 block">Wallet</span>
            </Link>
            <button className="p-3 bg-slate-50 hover:bg-brand/10 hover:text-slate-950 rounded-xl text-center border border-slate-100 hover:border-brand/35 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 w-full cursor-pointer">
              <span className="text-xl block mb-1">🎧</span>
              <span className="text-xs font-semibold text-slate-650 block">Support</span>
            </button>
          </div>
        </div>

        {/* Earnings chart visual wrapper */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800 text-sm">Earnings Today</h4>
            <span className="text-xs text-brand font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Live</span>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-black text-slate-800">₹{metrics?.todayEarnings || '1,680'}</p>
            {/* Mock chart SVG line graph */}
            <div className="h-16 w-full pt-2 relative overflow-visible">
              <style>{`
                @keyframes draw-line {
                  to { stroke-dashoffset: 0; }
                }
                .animate-draw {
                  stroke-dasharray: 300;
                  stroke-dashoffset: 300;
                  animation: draw-line 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
              `}</style>
              <svg 
                viewBox="0 0 120 40" 
                className="w-full h-full overflow-visible" 
                preserveAspectRatio="none"
                width="100%"
                height="100%"
              >
                <defs>
                  <linearGradient id="earnings-today-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under the line */}
                <path 
                  d="M 10,32 L 30,22 L 50,28 L 70,12 L 90,24 L 110,8 L 110,38 L 10,38 Z" 
                  fill="url(#earnings-today-gradient)" 
                />
                {/* The main stroke line */}
                <path 
                  d="M 10,32 L 30,22 L 50,28 L 70,12 L 90,24 L 110,8" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="animate-draw"
                />
                {/* Dots representing coordinates */}
                <circle cx="10" cy="32" r="2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                <circle cx="30" cy="22" r="2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                <circle cx="50" cy="28" r="2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                <circle cx="70" cy="12" r="2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                <circle cx="90" cy="24" r="2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                <circle cx="110" cy="8" r="2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Performance circular indicator */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-between text-center transition-all hover:shadow-lg hover:shadow-brand/5 hover:border-brand/30 duration-500 transform hover:-translate-y-1">
          <h4 className="font-bold text-slate-800 text-sm w-full text-left">Performance</h4>
          
          <div className="relative flex items-center justify-center my-3 group cursor-pointer">
            <style>{`
              @keyframes rotate-progress {
                from { stroke-dashoffset: 238; }
                to { stroke-dashoffset: 24; }
              }
              @keyframes pulse-soft {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.2)); }
                50% { transform: scale(1.04); filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.4)); }
              }
              .animate-circle {
                stroke-dasharray: 238;
                stroke-dashoffset: 238;
                animation: rotate-progress 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              }
              .pulse-container {
                animation: pulse-soft 3s infinite ease-in-out;
              }
            `}</style>
            
            {/* SVG circle track with gradient stroke */}
            <svg className="w-24 h-24 transform -rotate-90 group-hover:rotate-0 transition-all duration-700 ease-out pulse-container">
              <defs>
                <linearGradient id="perfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="38" cx="48" cy="48" />
              <circle stroke="url(#perfGrad)" strokeWidth="8" strokeDasharray="238" strokeDashoffset="24" strokeLinecap="round" fill="transparent" r="38" cx="48" cy="48" className="animate-circle" />
            </svg>
            
            <div className="absolute text-center transition-all duration-300 transform group-hover:scale-110">
              <span className="text-xl font-black text-slate-800 tracking-tight block">90%</span>
              <span className="text-[8px] text-brand block font-black tracking-widest mt-0.5 relative flex items-center justify-center gap-0.5">
                EXCELLENT <span className="animate-bounce">✨</span>
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium">Keep up the great work! 🚀</p>
          </div>
        </div>
      </div>

      {/* New Order Alert Pop-up Notification Modal */}
      {assignedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-scale-up text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border-2 border-amber-100/50 shadow-inner animate-pulse">
              <Compass className="h-8 w-8 text-amber-600 animate-spin" />
            </div>
            
            <div className="space-y-1.5">
              <h4 className="font-black text-slate-800 text-lg">New Order Assigned!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                A new delivery dispatch has been assigned to you. Accept within 60 seconds to lock in this delivery.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleAcceptOrder(assignedOrder._id)}
                disabled={loading}
                className="flex-1 bg-brand hover:bg-brand-dark text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-yellow-100 cursor-pointer"
              >
                ✅ Accept Order
              </button>
              <button 
                onClick={() => {}} // dummy close / decline
                className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
