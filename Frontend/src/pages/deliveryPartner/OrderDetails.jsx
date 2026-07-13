import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDeliveryDashboard, 
  reachedVendor, 
  verifyPickup, 
  reachedCustomer, 
  verifyDelivery 
} from '../../redux/slices/deliverySlice';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Camera, 
  Check, 
  ShoppingBag, 
  User, 
  CreditCard, 
  Info,
  Clock
} from 'lucide-react';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeOrder, history, loading, error } = useSelector((state) => state.delivery);

  const [order, setOrder] = useState(null);
  const mapRef = useRef(null);

  // Workflow states
  const [pickupPhoto, setPickupPhoto] = useState(null);
  const [pickupPreview, setPickupPreview] = useState(null);
  const [pickupPin, setPickupPin] = useState('');
  
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [deliveryPreview, setDeliveryPreview] = useState(null);
  const [deliveryOtp, setDeliveryOtp] = useState('');

  // Sync active order or fetch details
  useEffect(() => {
    dispatch(fetchDeliveryDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (activeOrder && activeOrder._id === orderId) {
      setOrder(activeOrder);
    } else {
      const histOrder = history.find(o => o._id === orderId);
      if (histOrder) {
        setOrder(histOrder);
      }
    }
  }, [activeOrder, history, orderId]);

  // Leaflet map setup
  useEffect(() => {
    if (!order) return;

    // Inject Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Inject Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      if (window.L && !mapRef.current) {
        const vendorCoords = [12.9716, 77.5946];
        const customerCoords = [12.9616, 77.6046];
        const activeCoords = (order.status === 'accepted' || order.status === 'reached_vendor') 
          ? vendorCoords 
          : customerCoords;

        const map = window.L.map('details-map', {
          zoomControl: false,
          attributionControl: false
        }).setView(activeCoords, 14);
        mapRef.current = map;

        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 20
        }).addTo(map);

        // Pickup Marker
        const pickupIcon = window.L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
                   <div class="relative w-5 h-5 rounded-full bg-blue-600 border border-white shadow-md flex items-center justify-center text-white text-[8px] font-bold">P</div>
                 </div>`,
          className: 'custom-map-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        // Drop Marker
        const dropIcon = window.L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <div class="absolute w-8 h-8 rounded-full bg-red-500/20"></div>
                   <div class="relative w-5 h-5 rounded-full bg-red-500 border border-white shadow-md flex items-center justify-center text-white text-[8px] font-bold">D</div>
                 </div>`,
          className: 'custom-map-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        window.L.marker(vendorCoords, { icon: pickupIcon }).addTo(map).bindPopup('<b>Vendor: Fresh Bites Restaurant</b>');
        window.L.marker(customerCoords, { icon: dropIcon }).addTo(map).bindPopup(`<b>Customer: ${order.customerName || 'Arun Kumar'}</b>`);

        // Path
        window.L.polyline([vendorCoords, customerCoords], {
          color: '#2563eb',
          weight: 4,
          dashArray: '8, 6'
        }).addTo(map);
      }
    };
    document.head.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      link.remove();
      script.remove();
    };
  }, [order?._id, order?.status]);

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4 max-w-md mx-auto mt-10">
        <p className="text-slate-500 font-bold text-sm">Loading Order details...</p>
      </div>
    );
  }

  // Workflow Handlers
  const handleReachedVendorClick = () => {
    dispatch(reachedVendor(order._id)).then(() => {
      dispatch(fetchDeliveryDashboard());
    });
  };

  const handlePickupSubmit = (e) => {
    e.preventDefault();
    if (!pickupPin) return alert('Please enter Pickup PIN');
    if (!pickupPhoto) return alert('Please upload confirmation photo');

    const formData = new FormData();
    formData.append('otp', pickupPin);
    formData.append('photo', pickupPhoto);
    formData.append('latitude', '12.9716');
    formData.append('longitude', '77.5946');

    dispatch(verifyPickup({ orderId: order._id, formData })).then((res) => {
      if (!res.error) {
        dispatch(fetchDeliveryDashboard());
      }
    });
  };

  const handleReachedCustomerClick = () => {
    dispatch(reachedCustomer(order._id)).then(() => {
      dispatch(fetchDeliveryDashboard());
    });
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    if (!deliveryOtp) return alert('Please enter Delivery OTP');
    if (!deliveryPhoto) return alert('Please upload confirmation photo');

    const formData = new FormData();
    formData.append('otp', deliveryOtp);
    formData.append('photo', deliveryPhoto);
    formData.append('latitude', '12.9616');
    formData.append('longitude', '77.6046');

    dispatch(verifyDelivery({ orderId: order._id, formData })).then((res) => {
      if (!res.error) {
        dispatch(fetchDeliveryDashboard());
      }
    });
  };

  // Determine current active phase
  // Phase 1: pending, accepted, reached_vendor
  // Phase 2: picked_up, reached_customer, delivered
  const isPhase1 = ['pending', 'accepted', 'reached_vendor'].includes(order.status?.toLowerCase());
  const isPickupDone = ['picked_up', 'reached_customer', 'delivered', 'completed'].includes(order.status?.toLowerCase());

  // Payment defaults
  const paymentMethod = order.paymentMethod || 'Online';
  const paymentStatus = (paymentMethod === 'Cash on Delivery' && order.status !== 'delivered') ? 'Pending' : 'Paid';

  return (
    <div className="max-w-xl mx-auto pb-12 animate-fade-in text-base text-slate-800">
      
      {/* Centered Console Card */}
      <div className="bg-white rounded-3xl border border-slate-150 shadow-xl overflow-hidden flex flex-col">
        
        {/* Top Header Section inside card */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Link to="/delivery/dashboard" className="p-2 bg-white hover:bg-slate-100 rounded-full text-slate-655 transition-all border border-slate-100 shadow-xs">
              <ArrowLeft className="h-4.5 w-4.5" />
            </Link>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Order Console</h3>
              <span className="text-[10px] font-black font-mono text-slate-400">#ORD{order._id?.substring(14) || order._id}</span>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
            isPhase1 ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
          }`}>
            {isPhase1 ? 'Vendor Pickup' : 'Delivery'}
          </span>
        </div>

        {/* Live Map Section inside card */}
        <div className="relative h-[220px] bg-slate-50 border-b border-slate-100 z-0">
          <div id="details-map" className="w-full h-full" />
          <span className="absolute top-3 right-3 text-[9px] bg-green-500/90 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider z-10 shadow-sm">
            GPS ACTIVE
          </span>
        </div>

        {/* Content Body of Card */}
        <div className="p-6 space-y-6">
          {/* Phase 1 card: Vendor details */}
          {isPhase1 && (
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
                Vendor Details
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Vendor Name</span>
                  <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">Fresh Bites Restaurant</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Contact Number</span>
                  <span className="font-extrabold text-blue-600 flex items-center gap-1 mt-1 text-sm">
                    <Phone className="h-3.5 w-3.5" /> +91 99887 76655
                  </span>
                </div>
                <div className="col-span-2 border-t border-slate-100 pt-2.5 mt-1">
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Pickup Address</span>
                  <span className="font-semibold text-slate-650 block mt-0.5">{order.pickupLocation || '24, MG Road, Indiranagar, Bengaluru'}</span>
                </div>
              </div>

              {/* Progress Actions */}
              <div className="space-y-4">
                {order.status === 'accepted' ? (
                  <button
                    onClick={handleReachedVendorClick}
                    disabled={loading}
                    className="w-full bg-brand hover:bg-brand/90 text-slate-955 font-black py-4 rounded-xl shadow-md transition-all active:scale-95 text-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    📍 I Reached Vendor Outlet
                  </button>
                ) : (
                  <form onSubmit={handlePickupSubmit} className="space-y-4">
                    <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-xs font-semibold text-green-700 flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> Reached vendor site. Confirm pickup below.
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Enter Pickup PIN</label>
                      <input 
                        type="tel"
                        required
                        maxLength={4}
                        placeholder="_ _ _ _"
                        value={pickupPin}
                        onChange={(e) => setPickupPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center bg-slate-50 border-2 border-slate-205 rounded-xl py-3 text-xl font-black focus:outline-none focus:border-blue-500 tracking-[0.4em]"
                      />
                      <p className="text-[10px] text-slate-400 mt-1 text-center">Demo PIN: <span className="font-black text-slate-700">1234</span></p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Confirmation Photo</label>
                      {pickupPreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-slate-205">
                          <img src={pickupPreview} alt="pickup preview" className="w-full h-32 object-cover" />
                          <button 
                            type="button" 
                            onClick={() => { setPickupPhoto(null); setPickupPreview(null); }}
                            className="absolute top-2 right-2 bg-red-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment" 
                            id="p-file" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) { setPickupPhoto(file); setPickupPreview(URL.createObjectURL(file)); }
                            }}
                          />
                          <label htmlFor="p-file" className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-6 bg-slate-50/55 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold text-slate-500">
                            <Camera className="h-6 w-6 text-slate-400" />
                            <span>Capture Package Photo</span>
                          </label>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !pickupPin || !pickupPhoto}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all shadow-md active:scale-95 text-sm"
                    >
                      Pickup Completed ✓
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Phase 2 card: Customer details */}
          {isPickupDone && (
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <User className="h-5 w-5 text-red-500" />
                Customer Details
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Customer Name</span>
                  <span className="font-extrabold text-slate-805 text-sm mt-0.5 block">{order.customerName || 'Arun Kumar'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Contact Number</span>
                  <span className="font-extrabold text-red-600 flex items-center gap-1 mt-1 text-sm">
                    <Phone className="h-3.5 w-3.5" /> +91 81290 88374
                  </span>
                </div>
                <div className="col-span-2 border-t border-slate-100 pt-2.5 mt-1">
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Delivery Address</span>
                  <span className="font-semibold text-slate-650 block mt-0.5">{order.deliveryLocation || '45, 5th Cross, Koramangala, Bengaluru'}</span>
                </div>
              </div>

              {/* Payment Details block */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Payment Method</span>
                  <span className="font-extrabold text-slate-700">{paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Payment Status</span>
                  <span className={`px-2 py-0.5 rounded font-black uppercase text-[10px] ${
                    paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {paymentStatus}
                  </span>
                </div>
              </div>

              {/* Progress Actions */}
              <div className="space-y-4">
                {order.status === 'picked_up' ? (
                  <button
                    onClick={handleReachedCustomerClick}
                    disabled={loading}
                    className="w-full bg-brand hover:bg-brand/90 text-slate-955 font-black py-4 rounded-xl shadow-md transition-all active:scale-95 text-sm"
                  >
                    🏠 I Reached Customer Location
                  </button>
                ) : (order.status === 'reached_customer') ? (
                  <form onSubmit={handleDeliverySubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Verify Delivery OTP</label>
                      <input 
                        type="tel"
                        required
                        maxLength={4}
                        placeholder="_ _ _ _"
                        value={deliveryOtp}
                        onChange={(e) => setDeliveryOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center bg-slate-50 border-2 border-slate-200 rounded-xl py-3 text-xl font-black focus:outline-none focus:border-blue-500 tracking-[0.4em]"
                      />
                      <p className="text-[10px] text-slate-400 mt-1 text-center">Demo OTP: <span className="font-black text-slate-700">5678</span></p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Delivery Confirmation Photo</label>
                      {deliveryPreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-slate-205">
                          <img src={deliveryPreview} alt="delivery preview" className="w-full h-32 object-cover" />
                          <button 
                            type="button" 
                            onClick={() => { setDeliveryPhoto(null); setDeliveryPreview(null); }}
                            className="absolute top-2 right-2 bg-red-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment" 
                            id="d-file" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) { setDeliveryPhoto(file); setDeliveryPreview(URL.createObjectURL(file)); }
                            }}
                          />
                          <label htmlFor="d-file" className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-6 bg-slate-50/50 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold text-slate-500">
                            <Camera className="h-6 w-6 text-slate-400" />
                            <span>Capture Handover Proof Photo</span>
                          </label>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !deliveryOtp || !deliveryPhoto}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all shadow-md active:scale-95 text-sm"
                    >
                      Complete Delivery
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center text-xs font-semibold text-green-700 space-y-1">
                      <p className="text-sm font-black">Trip Completed successfully! 🎉</p>
                      <p>Payout and telemetry have been verified and processed in orders.</p>
                    </div>
                    <button
                      onClick={() => navigate('/delivery/dashboard')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-xl transition-all active:scale-95 text-xs uppercase tracking-wider"
                    >
                      End Trip &amp; Return to Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
