import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTechnicianDashboard, 
  acceptService, 
  startTransit, 
  arrivedCustomer,
  uploadBeforePhoto,
  uploadAfterPhoto,
  completeService
} from '../../redux/slices/technicianSlice';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  Camera, 
  CheckCircle,
  FileSpreadsheet,
  AlertTriangle,
  PenTool
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { metrics, activeService, assignedService, technicianStatus, walletBalance, loading, error } = useSelector((state) => state.technician);
  const { user } = useSelector((state) => state.auth);

  // States for verification
  const [otp, setOtp] = useState('');
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [sigFile, setSigFile] = useState(null);

  // Signature canvas refs
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    dispatch(fetchTechnicianDashboard());
  }, [dispatch]);

  const handleAccept = (id) => {
    dispatch(acceptService(id));
  };

  const handleTransit = (id) => {
    dispatch(startTransit(id));
  };

  const handleArrived = (id) => {
    dispatch(arrivedCustomer(id));
  };

  const handleBeforePhotoUpload = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    dispatch(uploadBeforePhoto({ bookingId: id, formData }));
  };

  const handleAfterPhotoUpload = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    dispatch(uploadAfterPhoto({ bookingId: id, formData }));
  };

  // Canvas drawing functions
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleCompleteJob = (e, id) => {
    e.preventDefault();
    if (!otp) return alert('Please enter customer verification OTP');

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return alert('Please collect customer signature');
      
      const formData = new FormData();
      formData.append('otp', otp);
      formData.append('signature', blob, 'signature.png');

      dispatch(completeService({ bookingId: id, formData })).then((res) => {
        if (!res.error) {
          setOtp('');
          clearCanvas();
        }
      });
    }, 'image/png');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Widget */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Welcome, {user?.name || 'Technician'}</h2>
          <p className="text-xs text-slate-400">Technician Dispatch Center</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Wallet Balance</span>
          <p className="text-xl font-extrabold text-brand">₹{walletBalance.toFixed(2)}</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Completed Services</span>
            <p className="text-3xl font-extrabold text-slate-800">{metrics.completedCount}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-bold text-lg">
            ✓
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Today's Payouts</span>
            <p className="text-3xl font-extrabold text-slate-800">₹{metrics.todayEarnings}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-bold text-lg">
            ₹
          </div>
        </div>
      </div>

      {/* Active Service Job Status Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 text-sm flex items-center gap-2">
            <Wrench className="h-4 w-4 text-brand" /> Active Service Booking
          </h3>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {activeService ? (
            <div className="space-y-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border">
                <span className="text-[10px] bg-brand/20 text-brand-dark px-2.5 py-0.5 rounded font-bold uppercase">
                  Service Assigned
                </span>
                <h4 className="font-bold text-slate-800 text-sm mt-2">Home AC Maintenance</h4>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  Plot 104, HSR Layout, Sector 2, Bengaluru 560102
                </p>
                <div className="pt-2 flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Est. Payout</span>
                  <span className="text-slate-700">₹{activeService.earnings || '450.00'}</span>
                </div>
              </div>

              {/* Status workflow dispatcher */}
              <div className="space-y-2 pt-2">
                {activeService.status === 'accepted' && (
                  <button
                    onClick={() => handleTransit(activeService._id)}
                    className="w-full bg-brand hover:bg-brand-dark text-slate-950 font-bold py-3 rounded-xl text-sm"
                  >
                    Start Transit Trip
                  </button>
                )}

                {activeService.status === 'transit' && (
                  <button
                    onClick={() => handleArrived(activeService._id)}
                    className="w-full bg-brand hover:bg-brand-dark text-slate-950 font-bold py-3 rounded-xl text-sm"
                  >
                    I Arrived at Customer Location
                  </button>
                )}

                {activeService.status === 'arrived' && (
                  <div className="space-y-2">
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Pre-Service Verification Proof
                    </span>
                    <label className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl py-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 text-slate-400">
                      <Camera className="h-6 w-6 text-brand" />
                      <span className="text-xs font-bold text-slate-600">Upload Before Service Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleBeforePhotoUpload(e, activeService._id)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                )}

                {activeService.status === 'service_started' && (
                  <div className="space-y-4">
                    {/* Before Service Preview */}
                    {activeService.beforeServicePhoto && (
                      <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <img src={activeService.beforeServicePhoto} className="w-12 h-12 object-cover rounded-md" />
                        <span className="text-[10px] text-green-600 font-bold">✓ Before Photo Uploaded</span>
                      </div>
                    )}

                    {/* After Service Upload Option */}
                    {!activeService.afterServicePhoto ? (
                      <div>
                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Post-Service Verification Proof
                        </span>
                        <label className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 text-slate-400">
                          <Camera className="h-6 w-6 text-brand" />
                          <span className="text-xs font-bold text-slate-600">Upload After Service Photo</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleAfterPhotoUpload(e, activeService._id)} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <img src={activeService.afterServicePhoto} className="w-12 h-12 object-cover rounded-md" />
                        <span className="text-[10px] text-green-600 font-bold">✓ After Photo Uploaded</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : assignedService ? (
            /* Assigned Alert */
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-4">
              <div className="flex gap-3">
                <Wrench className="h-6 w-6 text-brand" />
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">New Service Job Assigned!</h5>
                  <p className="text-xs text-slate-500 mt-0.5">Please accept to resume site travel routing.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAccept(assignedService._id)}
                  className="flex-1 bg-brand text-slate-950 font-bold py-2 rounded-lg text-xs"
                >
                  Accept Service
                </button>
                <button className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-2 rounded-lg text-xs">
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-xs py-8 text-center">No active service assignments currently assigned.</p>
          )}
        </div>

        {/* Customer Signature & OTP verification screen block */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 text-sm flex items-center gap-2">
            <PenTool className="h-4 w-4 text-brand" /> Customer Verification Closeout
          </h3>

          {activeService && activeService.status === 'service_started' && activeService.afterServicePhoto ? (
            <form onSubmit={(e) => handleCompleteJob(e, activeService._id)} className="space-y-4">
              {/* OTP Entry */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Enter 4-Digit Customer OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength="4"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="0 0 0 0"
                  className="w-full text-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xl font-bold tracking-[1em] text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              {/* Signature Canvas */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Customer Signature
                  </label>
                  <button 
                    type="button" 
                    onClick={clearCanvas} 
                    className="text-[10px] text-red-500 hover:underline font-bold"
                  >
                    Clear Canvas
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <canvas
                    ref={canvasRef}
                    width={350}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full cursor-crosshair h-36"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand-dark text-slate-950 font-bold py-3 rounded-xl text-sm transition-all"
              >
                Verify & Complete Service
              </button>
            </form>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              ⚠️ Available after uploading post-service photos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
