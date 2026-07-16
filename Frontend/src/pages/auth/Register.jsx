import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../redux/slices/authSlice';
import {
  User,
  Briefcase,
  CreditCard,
  CheckSquare,
  ArrowLeft,
  ArrowRight,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [showAddCustomInput, setShowAddCustomInput] = useState(false);
  const [customCatName, setCustomCatName] = useState('');
  const [availableCategories, setAvailableCategories] = useState([
    'AC Technician',
    'Washing Machine Technician',
    'TV / Electronics Technician',
    'Refrigerator Technician',
    'Plumber',
    'Electrician',
    'Carpenter',
    'Mobile Technician',
    'Laptop Technician',
    'Air Conditioner Specialist',
    'Plumbing Repair & Install',
    'Home Electrical Wiring',
    'Washing Machine / TV Appliance Repair',
    'PC & Laptop Repair Technician'
  ]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
    role: 'delivery_partner',

    // Delivery Profile
    aadhaarNumber: '',
    panNumber: '',
    vehicleName: '',
    vehicleNumber: '',
    licenseNumber: '',

    // Technician
    technicianType: 'AC',
    technicianCategories: ['AC'],

    // Bank
    bankName: '',
    accountHolderName: '',
    ifscCode: '',
    accountNumber: '',
    branch: '',

    // Declaration
    termsDecl: false,
    privacyDecl: false,

    // Executive
    executiveType: 'travel'
  });

  const [rcBookFile, setRcBookFile] = useState(null);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'delivery_partner') navigate('/delivery/dashboard');
      else if (user.role === 'technician') navigate('/technician/dashboard');
      else if (user.role === 'executive') navigate('/executive/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
    if (localError) setLocalError('');
  };

  const handleFileChange = (e) => {
    setRcBookFile(e.target.files[0]);
    if (localError) setLocalError('');
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.name.trim()) return 'Full name is required';
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return 'Enter a valid email address';

      // Password validation: capital letter, number, special character, min length 8
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        return 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character';
      }

      // Mobile number: exactly 10 digits
      if (!/^\d{10}$/.test(formData.mobileNumber)) {
        return 'Mobile number must be exactly 10 digits';
      }

      // Aadhaar number: exactly 12 digits
      if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
        return 'Aadhaar number must be exactly 12 digits';
      }

      // PAN Number validation
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.panNumber)) {
        return 'Enter a valid 10-character PAN card number (e.g. ABCDE1234F)';
      }
    } else if (currentStep === 2) {
      if (formData.role === 'delivery_partner') {
        if (!formData.vehicleName.trim()) return 'Vehicle Name is required';
        if (!formData.vehicleNumber.trim()) return 'Vehicle License Plate number is required';
        if (!formData.licenseNumber.trim()) return 'Driving License Number is required';
        if (!rcBookFile) return 'Please upload RC Book PDF / Image';
      }
    } else if (currentStep === 3) {
      // bank details only apply to delivery partner and technician
      if (formData.role === 'delivery_partner' || formData.role === 'technician') {
        if (!formData.bankName.trim()) return 'Bank Name is required';
        if (!formData.accountHolderName.trim()) return 'Account Holder Name is required';
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifscCode)) {
          return 'Enter a valid 11-character bank IFSC code (e.g. SBIN0001234)';
        }
        if (!/^\d{9,18}$/.test(formData.accountNumber)) {
          return 'Account number must be between 9 and 18 digits';
        }
        if (!formData.branch.trim()) return 'Branch name is required';
      }
    }
    return null;
  };

  const nextStep = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    setLocalError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setLocalError('');
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateStep(step);
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    setLocalError('');

    const apiData = new FormData();
    Object.keys(formData).forEach((key) => {
      apiData.append(key, formData[key]);
    });
    if (rcBookFile) {
      apiData.append('rcBook', rcBookFile);
    }

    dispatch(registerUser(apiData));
  };

  return (
    <div>
      {/* Step Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
        {[
          { num: 1, label: 'Profile', icon: User },
          { num: 2, label: 'Type & Vehicle', icon: Briefcase },
          { num: 3, label: 'Bank Info', icon: CreditCard },
          { num: 4, label: 'Submit', icon: CheckSquare }
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.num ? 'bg-brand text-slate-900 font-extrabold' : 'bg-slate-700 text-slate-400'
                }`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-[10px] mt-1 font-semibold ${step >= s.num ? 'text-brand' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {(error || localError) && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6">
          ⚠️ {error || localError}
        </div>
      )}

      {/* Step 1: Personal Profile Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white mb-2">1. Personal Profile Setup</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-4 pr-10 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-4 pr-10 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                maxLength={10}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Aadhaar Number</label>
              <input
                type="text"
                name="aadhaarNumber"
                required
                value={formData.aadhaarNumber}
                onChange={handleChange}
                maxLength={12}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">PAN Number</label>
              <input
                type="text"
                name="panNumber"
                required
                value={formData.panNumber}
                onChange={handleChange}
                maxLength={10}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={nextStep}
              className="bg-brand hover:bg-brand-dark text-slate-950 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Role Details */}
      {step === 2 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white mb-2">2. Operating Role & Credentials</h4>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Portal Type Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="delivery_partner">Delivery Partner</option>
              <option value="technician">Technician Field Agent</option>
              <option value="executive">Operations Executive</option>
            </select>
          </div>

          {formData.role === 'delivery_partner' && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Vehicle Name / Make</label>
                  <input
                    type="text"
                    name="vehicleName"
                    required
                    value={formData.vehicleName}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Vehicle License Number Plate</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    required
                    placeholder="e.g. KA-01-AB-1234"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Driving License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Upload RC Book PDF / Image</label>
                  <label className="w-full bg-slate-900 border border-dashed border-slate-700/60 rounded-xl px-4 py-2.5 text-slate-400 text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800 transition-all">
                    <Upload className="h-4 w-4 text-brand" />
                    {rcBookFile ? rcBookFile.name : 'Select file'}
                    <input type="file" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {formData.role === 'technician' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Technician Specialty Categories (Select all that apply)</label>
              
              {/* Search Box */}
              <input
                type="text"
                placeholder="Search category..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />

              {/* Grid Checkbox list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pt-1 pr-1">
                {availableCategories.filter(cat => 
                  cat.toLowerCase().includes(categorySearch.toLowerCase())
                ).map((cat) => {
                  const isChecked = (formData.technicianCategories || []).includes(cat);
                  return (
                    <label key={cat} className="flex items-center gap-2.5 text-white text-xs bg-slate-800 p-2.5 rounded-xl border border-slate-700/60 cursor-pointer hover:bg-slate-700/50 transition-all select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(formData.technicianCategories || []), cat]
                            : (formData.technicianCategories || []).filter(c => c !== cat);
                          setFormData({
                            ...formData,
                            technicianCategories: updated,
                            technicianType: updated.join(', ')
                          });
                        }}
                        className="rounded border-slate-700 text-brand focus:ring-brand/40 bg-slate-900 w-4 h-4 cursor-pointer"
                      />
                      {cat}
                    </label>
                  );
                })}
              </div>

              {/* Add Custom / Other Category field */}
              <div className="pt-1">
                {showAddCustomInput ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Enter custom category name..."
                      value={customCatName}
                      onChange={(e) => setCustomCatName(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = customCatName.trim();
                        if (trimmed) {
                          if (!availableCategories.includes(trimmed)) {
                            setAvailableCategories([...availableCategories, trimmed]);
                          }
                          const updated = [...(formData.technicianCategories || []), trimmed];
                          setFormData({
                            ...formData,
                            technicianCategories: updated,
                            technicianType: updated.join(', ')
                          });
                          setCustomCatName('');
                          setShowAddCustomInput(false);
                        }
                      }}
                      className="bg-brand text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-brand-dark transition-all"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomInput(false)}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddCustomInput(true)}
                    className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 pl-1 cursor-pointer"
                  >
                    + Add Custom / Other Category...
                  </button>
                )}
              </div>
            </div>
          )}

          {formData.role === 'executive' && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Executive Category Assignment</label>
                <select
                  name="executiveType"
                  value={formData.executiveType}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  <option value="travel">Travel Operations Executive</option>
                  <option value="stay">Stay Operations Executive</option>
                </select>
              </div>
              <p className="text-xs text-slate-400 bg-slate-900 p-4 rounded-xl border border-slate-700/30">
                ℹ️ Corporate Executives are registered directly onto the central dispatch network. No further credentials are required for step 2.
              </p>
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="bg-brand hover:bg-brand-dark text-slate-950 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Bank Details */}
      {step === 3 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white mb-2">3. Direct Deposit Bank Information</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Bank Name</label>
              <input
                type="text"
                name="bankName"
                required
                value={formData.bankName}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Account Holder Name</label>
              <input
                type="text"
                name="accountHolderName"
                required
                value={formData.accountHolderName}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                required
                placeholder="e.g. SBIN0001234"
                value={formData.ifscCode}
                onChange={handleChange}
                maxLength={11}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                required
                value={formData.accountNumber}
                onChange={handleChange}
                maxLength={18}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm Account Number</label>
              <input
                type="text"
                name="confirmAccountNumber"
                required
                value={formData.confirmAccountNumber}
                onChange={handleChange}
                maxLength={18}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Branch Name</label>
              <input
                type="text"
                name="branch"
                required
                value={formData.branch}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="bg-brand hover:bg-brand-dark text-slate-950 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Submit declaration */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="text-lg font-bold text-white mb-2">4. Declaration & Finalize</h4>

          <div className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="termsDecl"
                  name="termsDecl"
                  type="checkbox"
                  required
                  checked={formData.termsDecl}
                  onChange={handleChange}
                  className="h-4 w-4 text-brand focus:ring-brand bg-slate-800 border-slate-700 rounded"
                />
              </div>
              <label htmlFor="termsDecl" className="ml-3 text-xs text-slate-400">
                I accept and agree to the <span className="text-brand font-medium hover:underline cursor-pointer">Terms & Conditions</span> governing operations and direct-deposit payout ledger rules.
              </label>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="privacyDecl"
                  name="privacyDecl"
                  type="checkbox"
                  required
                  checked={formData.privacyDecl}
                  onChange={handleChange}
                  className="h-4 w-4 text-brand focus:ring-brand bg-slate-800 border-slate-700 rounded"
                />
              </div>
              <label htmlFor="privacyDecl" className="ml-3 text-xs text-slate-400">
                I agree to the system capturing live GPS location telemetries for route maps and vendor/customer tracking details as set out in the <span className="text-brand font-medium hover:underline cursor-pointer">Privacy Policy</span>.
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand hover:bg-brand-dark text-slate-950 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-brand/20 disabled:opacity-50"
            >
              {loading ? 'Completing Registration...' : 'Complete & Onboard'}
            </button>
          </div>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-slate-400">
        Already have a partner account?{' '}
        <Link to="/auth/login" className="text-brand font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Register;
