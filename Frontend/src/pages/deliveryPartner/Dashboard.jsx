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
    if (!pickupOtp) return alert('Please enter OTP');
    if (!pickupPhoto) return alert('Please capture package photo');
 
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
    if (!deliveryOtp) return alert('Please enter OTP');
    if (!deliveryPhoto) return alert('Please capture delivery proof photo');
 
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
      if (window.L && !mapRef.current) {
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
    dispatch(acceptOrder(orderId));
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
    <div className="space-y-6">
      {/* Top Welcome Panel is rendered inside the layout header */}

      {/* Metrics Row (Matching exact layout: Earnings, Today's Orders, Completed, Cancellation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {/* Earnings Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Today's Earnings</span>
            <p className="text-2xl font-extrabold text-slate-850">₹{metrics.todayEarnings || '1,680'}</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              ▲ 18% <span className="text-slate-400 font-normal">vs yesterday</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50/70 text-blue-500 flex items-center justify-center border border-blue-100">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Today's Orders</span>
            <p className="text-2xl font-extrabold text-slate-850">{metrics.todayOrdersCount || '8'}</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              ▲ 14% <span className="text-slate-400 font-normal">vs yesterday</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50/70 text-blue-500 flex items-center justify-center border border-blue-100">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Completed Orders</span>
            <p className="text-2xl font-extrabold text-slate-850">{metrics.completedCount || '6'}</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              ▲ 20% <span className="text-slate-400 font-normal">vs yesterday</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50/70 text-green-600 flex items-center justify-center border border-green-100">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Cancellation Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Cancellation</span>
            <p className="text-2xl font-extrabold text-slate-850">{metrics.cancellationCount || '1'}</p>
            <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5">
              ▼ 50% <span className="text-slate-400 font-normal">vs yesterday</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50/70 text-red-500 flex items-center justify-center border border-red-100">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Order & Tracking section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current active order block */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
            <h3 className="font-bold text-slate-800 text-lg">Current Order</h3>
            {activeOrder && (
              <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold">
                #{activeOrder._id?.substring(18) || 'ORD67890'}
              </span>
            )}
          </div>

            {/* Scrollable content area */}
            {activeOrder ? (
              <div className="flex flex-col flex-1 px-6 py-5 space-y-4 overflow-y-auto">

                {/* ── 9-STEP PROGRESS BAR ── */}
                {(() => {
                  const stepIdx = getStepperIndex();
                  return (
                    <div className="relative flex items-start justify-between">
                      <div className="absolute top-[9px] left-[9px] right-[9px] h-0.5 bg-slate-100 z-0" />
                      <div
                        className="absolute top-[9px] left-[9px] h-0.5 bg-green-400 z-0 transition-all duration-500"
                        style={{ width: `calc(${(stepIdx / 8) * 100}% - 9px)` }}
                      />
                      {STEPS.map((s, i) => {
                        const done = i < stepIdx;
                        const active = i === stepIdx;
                        return (
                          <div key={i} className="flex flex-col items-center gap-0.5 z-10" style={{ width: `${100 / STEPS.length}%` }}>
                            <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center text-[7px] font-black transition-all ${
                              done   ? 'bg-green-500 border-green-500 text-white' :
                              active ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-125' :
                                       'bg-white border-slate-200 text-slate-300'
                            }`}>
                              {done ? '✓' : i + 1}
                            </div>
                            <span className={`text-center text-[6px] font-extrabold uppercase leading-tight ${
                              active ? 'text-blue-600' : done ? 'text-green-500' : 'text-slate-300'
                            }`} style={{ maxWidth: 38 }}>{s.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* ── STEP BANNER ── */}
                {(() => {
                  const idx = getStepperIndex();
                  const s = STEPS[idx];
                  const colorCls = {
                    amber:  'bg-amber-50  border-amber-200  text-amber-700',
                    blue:   'bg-blue-50   border-blue-200   text-blue-700',
                    purple: 'bg-purple-50 border-purple-200 text-purple-700',
                    orange: 'bg-orange-50 border-orange-200 text-orange-700',
                    green:  'bg-green-50  border-green-200  text-green-700',
                  }[s.color];
                  return (
                    <div className={`rounded-xl border px-4 py-2.5 flex items-center justify-between ${colorCls}`}>
                      <div>
                        <p className="font-black text-sm">{s.title}</p>
                        <p className="text-[10px] font-medium opacity-75">{s.sub}</p>
                      </div>
                      <span className="text-xs font-black opacity-40 whitespace-nowrap ml-2">{idx + 1} / 9</span>
                    </div>
                  );
                })()}

                {/* ── ROUTE TIMELINE ── */}
                <div className="relative border-l-2 border-dashed border-slate-200 pl-5 ml-1 space-y-4">
                  <div className="relative">
                    <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow"></span>
                    <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Pickup</p>
                    <p className="font-bold text-slate-800 text-sm">Fresh Bites Restaurant</p>
                    <p className="text-xs text-slate-400">24, MG Road, Indiranagar, Bengaluru</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow"></span>
                    <p className="text-[9px] text-red-500 font-black uppercase tracking-widest">Drop</p>
                    <p className="font-bold text-slate-800 text-sm">Arun Kumar</p>
                    <p className="text-xs text-slate-400">45, 5th Cross, Koramangala, Bengaluru</p>
                  </div>
                </div>

                {/* ── AMOUNT ROW ── */}
                <div className="flex items-center justify-between border-t border-b border-slate-100 py-3">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Amount</span>
                    <span className="font-black text-slate-800 text-base">₹250.00</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Payment</span>
                    <span className="text-green-600 font-black">Prepaid</span>
                  </div>
                </div>

                {/* ── STEP ACTION PANELS ── */}
                <div className="space-y-3">

                  {/* STEP 1 → Reach Pickup */}
                  {activeOrder.status === 'accepted' && (
                    <button
                      onClick={() => handleReachedVendor(activeOrder._id)}
                      disabled={loading}
                      className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-yellow-100 transition-all active:scale-95 text-sm"
                    >
                      📍  I Reached Vendor Outlet
                    </button>
                  )}

                  {/* STEP 2 → Pick Up Order */}
                  {activeOrder.status === 'reached_vendor' && !pickupConfirmed && (
                    <button
                      onClick={() => setPickupConfirmed(true)}
                      className="w-full bg-brand hover:bg-brand-dark text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-yellow-100 transition-all active:scale-95 text-sm"
                    >
                      ✅  Confirm Items Collected
                    </button>
                  )}

                  {/* STEP 3 → Upload Pickup Photo */}
                  {activeOrder.status === 'reached_vendor' && pickupConfirmed && !pickupPhoto && (
                    <div className="space-y-2">
                      <input type="file" accept="image/*" id="pkp-photo" capture="environment" className="hidden"
                        onChange={(e) => {
                          const f = e.target.files[0];
                          if (f) { setPickupPhoto(f); setPickupPreview(URL.createObjectURL(f)); }
                        }}
                      />
                      <label htmlFor="pkp-photo"
                        className="cursor-pointer w-full border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 rounded-2xl p-5 flex flex-col items-center gap-2 transition-all"
                      >
                        <Camera className="h-7 w-7 text-blue-400" />
                        <span className="text-sm font-black text-blue-600">Tap to Capture Package Photo</span>
                        <span className="text-[10px] text-blue-400">Photo required before entering OTP</span>
                      </label>
                    </div>
                  )}

                  {/* STEP 4 → Start Delivery (Pickup OTP) */}
                  {activeOrder.status === 'reached_vendor' && pickupConfirmed && pickupPhoto && (
                    <div className="space-y-3">
                      {pickupPreview && (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                          <img src={pickupPreview} className="w-10 h-10 rounded-lg object-cover border border-green-200" alt="pickup" />
                          <div>
                            <p className="text-[10px] font-black text-green-700">Photo Captured ✓</p>
                            <p className="text-[9px] text-green-500">Package photo saved</p>
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Enter Pickup OTP from Merchant</label>
                        <input
                          type="tel" inputMode="numeric" maxLength={6}
                          value={pickupOtp}
                          onChange={(e) => setPickupOtp(e.target.value.replace(/\D/g,''))}
                          placeholder="_ _ _ _"
                          className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-xl font-black text-slate-800 text-center tracking-[0.4em] focus:outline-none transition-all"
                        />
                        <p className="text-[9px] text-slate-400 mt-1 text-center">Demo OTP: <span className="font-black text-slate-700">1234</span></p>
                      </div>
                      <button
                        onClick={handleVerifyPickup}
                        disabled={loading || pickupOtp.length < 4}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-md shadow-blue-100 transition-all active:scale-95 text-sm"
                      >
                        🚀  Start Delivery Trip
                      </button>
                    </div>
                  )}

                  {/* STEP 5 → Reach Customer */}
                  {activeOrder.status === 'picked_up' && (
                    <button
                      onClick={() => handleReachedCustomer(activeOrder._id)}
                      disabled={loading}
                      className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-yellow-100 transition-all active:scale-95 text-sm"
                    >
                      🏠  I Reached Customer Address
                    </button>
                  )}

                  {/* STEP 6 → Verify Customer OTP */}
                  {activeOrder.status === 'reached_customer' && !deliveryOtpConfirmed && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Enter Delivery OTP from Customer</label>
                        <input
                          type="tel" inputMode="numeric" maxLength={6}
                          value={deliveryOtp}
                          onChange={(e) => setDeliveryOtp(e.target.value.replace(/\D/g,''))}
                          placeholder="_ _ _ _"
                          className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-xl font-black text-slate-800 text-center tracking-[0.4em] focus:outline-none transition-all"
                        />
                        <p className="text-[9px] text-slate-400 mt-1 text-center">Demo OTP: <span className="font-black text-slate-700">5678</span></p>
                      </div>
                      <button
                        onClick={() => {
                          if (deliveryOtp.length < 4) return alert('Please enter OTP');
                          setDeliveryOtpConfirmed(true);
                        }}
                        disabled={deliveryOtp.length < 4}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-md shadow-blue-100 transition-all active:scale-95 text-sm"
                      >
                        🔐  Verify OTP
                      </button>
                    </div>
                  )}

                  {/* STEP 7 → Upload Delivery Photo */}
                  {activeOrder.status === 'reached_customer' && deliveryOtpConfirmed && !deliveryPhoto && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                        <span className="text-green-600 text-base">🔐</span>
                        <div>
                          <p className="text-[10px] font-black text-green-700">OTP Verified ✓</p>
                          <p className="text-[9px] text-green-500">Now capture delivery proof photo</p>
                        </div>
                      </div>
                      <input type="file" accept="image/*" id="dlv-photo" capture="environment" className="hidden"
                        onChange={(e) => {
                          const f = e.target.files[0];
                          if (f) { setDeliveryPhoto(f); setDeliveryPreview(URL.createObjectURL(f)); }
                        }}
                      />
                      <label htmlFor="dlv-photo"
                        className="cursor-pointer w-full border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50 hover:bg-purple-100 rounded-2xl p-5 flex flex-col items-center gap-2 transition-all"
                      >
                        <Camera className="h-7 w-7 text-purple-400" />
                        <span className="text-sm font-black text-purple-600">Capture Delivery Proof Photo</span>
                        <span className="text-[10px] text-purple-400">Photo of package being handed over</span>
                      </label>
                    </div>
                  )}

                  {/* STEP 8 → Complete Delivery */}
                  {activeOrder.status === 'reached_customer' && deliveryOtpConfirmed && deliveryPhoto && (
                    <div className="space-y-3">
                      {deliveryPreview && (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                          <img src={deliveryPreview} className="w-10 h-10 rounded-lg object-cover border border-green-200" alt="delivery" />
                          <div>
                            <p className="text-[10px] font-black text-green-700">Delivery Photo Captured ✓</p>
                            <p className="text-[9px] text-green-500">Proof photo saved</p>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={handleVerifyDelivery}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-md shadow-green-100 transition-all active:scale-95 text-sm"
                      >
                        🎉  Complete Delivery & End Trip
                      </button>
                    </div>
                  )}

                  <Link
                    to={`/delivery/order-details/${activeOrder._id}`}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 font-semibold py-2.5 rounded-xl block text-center text-xs transition-all border border-slate-100 mt-1"
                  >
                    View Order Details
                  </Link>
                </div>
              </div>

            ) : assignedOrder ? (
              /* New Order Alert */
              <div className="px-6 py-5">
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-4">
                  <div className="flex gap-3 items-start">
                    <Compass className="h-5 w-5 text-brand animate-spin mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-black text-slate-800 text-sm">New Order Assigned!</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Accept within 60 seconds to secure this dispatch.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptOrder(assignedOrder._id)}
                      className="flex-1 bg-brand hover:bg-brand-dark text-slate-950 font-black py-3 rounded-xl text-xs transition-all active:scale-95"
                    >
                      ✅ Accept Order
                    </button>
                    <button className="flex-1 bg-white border border-slate-200 text-slate-500 font-bold py-3 rounded-xl text-xs">
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                  <Compass className="h-6 w-6 text-slate-300 animate-spin" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Waiting for next dispatch...</p>
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  Active on Dispatch Radar
                </div>
              </div>
            )}
        </div>

        {/* Live Map Telemetry Widget (Matches mockup right block) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between min-h-[440px]">
          {/* Dummy Map Visual matching the reference image layout */}
          <div className="flex-1 bg-slate-50 relative flex items-center justify-center overflow-hidden min-h-[340px]">
            {/* Real Interactive Leaflet Map Container */}
            <div id="leaflet-map-container" className="absolute inset-0 w-full h-full z-0 bg-slate-100" />
 
            {/* GPS HUD Info overlay */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] text-slate-700 shadow border border-slate-100 font-bold flex items-center gap-1.5 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
              GPS Synchronized
            </div>
 
            {/* Crosshair Button */}
            <button className="absolute top-4 right-4 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow text-slate-600 hover:bg-slate-50 transition-all z-10">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </svg>
            </button>
 
            {/* Yellow Navigator Button */}
            <button className="absolute bottom-4 right-4 bg-yellow-400 hover:bg-yellow-500 text-slate-900 p-3.5 rounded-2xl shadow-lg shadow-yellow-500/25 transition-all z-10">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Distance to pickup</span>
              <span className="font-extrabold text-slate-800 text-lg">1.2 km</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Est. time</span>
              <span className="font-extrabold text-slate-800 text-lg">6 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Quick Access, Earnings graph preview, Performance Gauges (Matches wireframe bottom row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Access Grid */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4 text-sm">Quick Access</h4>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/delivery/orders" className="p-3 bg-slate-50 hover:bg-brand/10 hover:text-slate-900 rounded-xl text-center transition-all block border border-slate-100">
              <span className="text-xl block mb-1">📦</span>
              <span className="text-xs font-semibold text-slate-600 block">Orders</span>
            </Link>
            <Link to="/delivery/wallet" className="p-3 bg-slate-50 hover:bg-brand/10 hover:text-slate-900 rounded-xl text-center transition-all block border border-slate-100">
              <span className="text-xl block mb-1">💳</span>
              <span className="text-xs font-semibold text-slate-600 block">Earnings</span>
            </Link>
            <Link to="/delivery/wallet" className="p-3 bg-slate-50 hover:bg-brand/10 hover:text-slate-900 rounded-xl text-center transition-all block border border-slate-100">
              <span className="text-xl block mb-1">💼</span>
              <span className="text-xs font-semibold text-slate-600 block">Wallet</span>
            </Link>
            <button className="p-3 bg-slate-50 hover:bg-brand/10 hover:text-slate-950 rounded-xl text-center transition-all border border-slate-100 w-full">
              <span className="text-xl block mb-1">🎧</span>
              <span className="text-xs font-semibold text-slate-600 block">Support</span>
            </button>
          </div>
        </div>

        {/* Earnings chart visual wrapper */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800 text-sm">Earnings Today</h4>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded border">Today</span>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-extrabold text-slate-800">₹1,680</p>
            {/* Mock chart SVG line graph */}
            <div className="h-16 w-full pt-4">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path d="M0,25 Q15,10 30,20 T60,5 T90,15 T100,10" fill="none" stroke="#3b82f6" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Performance circular indicator */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-between text-center">
          <h4 className="font-bold text-slate-800 text-sm w-full text-left">Performance</h4>
          <div className="relative flex items-center justify-center my-2">
            {/* SVG circle track */}
            <svg className="w-24 h-24">
              <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="38" cx="48" cy="48" />
              <circle className="text-green-500" strokeWidth="8" strokeDasharray="238" strokeDashoffset="24" strokeLinecap="round" stroke="currentColor" fill="transparent" r="38" cx="48" cy="48" />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-extrabold text-slate-800">90%</span>
              <span className="text-[8px] text-green-600 block font-bold">EXCELLENT</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium">Keep up the great work! 🚀</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
