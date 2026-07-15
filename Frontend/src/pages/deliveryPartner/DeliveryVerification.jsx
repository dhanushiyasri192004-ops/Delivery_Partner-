import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyDelivery } from '../../redux/slices/deliverySlice';
import { ArrowLeft, Camera } from 'lucide-react';

const DeliveryVerification = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.delivery);

  const [otp, setOtp] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!otp) return;
    if (!photo) return;

    const formData = new FormData();
    formData.append('otp', otp);
    formData.append('photo', photo);

    // Get position to record delivery location coordinates
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        formData.append('latitude', pos.coords.latitude);
        formData.append('longitude', pos.coords.longitude);
        dispatch(verifyDelivery({ orderId, formData })).then((res) => {
          if (!res.error) navigate('/delivery/dashboard');
        });
      },
      () => {
        formData.append('latitude', '12.9716');
        formData.append('longitude', '77.5946');
        dispatch(verifyDelivery({ orderId, formData })).then((res) => {
          if (!res.error) navigate('/delivery/dashboard');
        });
      }
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/delivery/dashboard" className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-600 transition-all">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h3 className="font-bold text-slate-800 text-lg">Verify Order Delivery</h3>
      </div>

      {error && (
        <div className="bg-red-550/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input */}
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
            className="w-full text-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-2xl font-bold tracking-[1em] text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
          <p className="text-[10px] text-slate-400 mt-1 text-center">Ask the customer for the verification code received on SMS.</p>
        </div>

        {/* Photo Proof */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Upload Delivery Photo
          </label>
          
          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200">
              <img src={preview} alt="Delivery Proof" className="w-full h-48 object-cover" />
              <button 
                type="button" 
                onClick={() => { setPhoto(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-red-650 text-white p-1 rounded-full text-xs font-bold px-2.5"
              >
                Clear
              </button>
            </div>
          ) : (
            <label className="w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-150 transition-all text-slate-400">
              <Camera className="h-8 w-8 text-slate-300" />
              <span className="text-xs font-semibold text-slate-500">Take a photo at drop address location</span>
              <span className="text-[9px]">JPEG, PNG up to 5MB</span>
              <input type="file" capture="environment" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand-dark text-slate-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
        >
          {loading ? 'Completing Job...' : 'Confirm Delivery'}
        </button>
      </form>
    </div>
  );
};

export default DeliveryVerification;
