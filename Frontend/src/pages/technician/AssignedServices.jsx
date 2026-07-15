import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Wrench, 
  MapPin, 
  Check, 
  X, 
  User, 
  Phone, 
  MessageSquare, 
  Compass, 
  Clock, 
  Camera, 
  CheckCircle2, 
  DollarSign, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Star, 
  FileText,
  Navigation,
  Shield,
  Activity,
  ArrowRight,
  TrendingUp,
  Settings,
  Bell
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';

// Predefined Washing Machine Spare Parts with pricing
const SPARE_PARTS_CATALOG = [
  { name: 'Motor', price: 1800 },
  { name: 'Drain Pump', price: 650 },
  { name: 'PCB Board', price: 2800 },
  { name: 'Water Inlet Valve', price: 450 },
  { name: 'Bearings', price: 550 },
  { name: 'Belt', price: 350 },
  { name: 'Door Lock', price: 400 },
  { name: 'Capacitor', price: 300 }
];

const AssignedServices = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  // RBAC Access Control Screen for non-Washing Machine Technicians
  if (profile && profile.technicianType !== 'Washing Machine Technician') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-150 rounded-3xl text-center space-y-4 shadow-md animate-fade-in">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-150">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="font-extrabold text-slate-800 text-lg">Access Denied (RBAC)</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          This dashboard is reserved for <strong>Washing Machine Technicians</strong> only. Your account is categorized as <strong>{profile.technicianType || 'Other'}</strong>.
        </p>
        <div className="pt-2">
          <button 
            onClick={() => dispatch(logout())}
            className="bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all inline-block cursor-pointer"
          >
            Log Out & Switch Account
          </button>
        </div>
      </div>
    );
  }

  // --- STATE DECLARATIONS ---
  
  // 1. Incoming Service Requests list
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: 'SRV-908231',
      customerName: 'Aravind Swamy',
      phone: '+91 98452 11029',
      brandModel: 'Samsung Ecobubble 8kg',
      problemDescription: 'Heavy vibrations and drum noise during spin cycle. Water heating not working.',
      address: 'Apt 402, Block C, Prestige Sunrise, HSR Layout, Sector 1, Bengaluru 560102',
      distance: '2.4 km',
      scheduledTime: 'Today, 04:30 PM',
      baseCharge: 450,
      priority: 'High',
      machineInstallationDate: '12-Feb-2022',
      warrantyStatus: 'Out of Warranty',
      prevHistory: 'Gasket replacement done on Dec 2024'
    },
    {
      id: 'SRV-882741',
      customerName: 'Shalini Nair',
      phone: '+91 81290 88374',
      brandModel: 'IFB Senator Aqua SX 7kg',
      problemDescription: 'Water not draining. Drain filter cleaned but issue persists.',
      address: 'No. 12, 4th Cross, Koramangala 3rd Block, Bengaluru 560034',
      distance: '4.8 km',
      scheduledTime: 'Tomorrow, 10:00 AM',
      baseCharge: 350,
      priority: 'Medium',
      machineInstallationDate: '05-May-2023',
      warrantyStatus: 'Under Extended Warranty',
      prevHistory: 'Water inlet valve serviced in Aug 2024'
    }
  ]);

  // 2. Active Service Job (null if none accepted)
  const [activeJob, setActiveJob] = useState(null);
  
  // 3. Current workflow step (1 to 9)
  const [workflowStep, setWorkflowStep] = useState(1);

  // 4. Timer states (Step 6)
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // 5. Photos state
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [previews, setPreviews] = useState({ before: '', after: '' });

  // 6. Spare Parts used state
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [partQty, setPartQty] = useState(1);
  const [addedParts, setAddedParts] = useState([]);

  // 7. Service Notes state
  const [diagnosis, setDiagnosis] = useState('');
  const [repairDetails, setRepairDetails] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [nextReminder, setNextReminder] = useState('6 Months');

  // 8. Payment & Receipt states
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // 9. Feedback states
  const [rating, setRating] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState('');

  // 10. Completed History
  const [recentHistory, setRecentHistory] = useState([
    { id: 'SRV-773820', customer: 'Meena Sharma', date: '09-Jul-2026', status: 'COMPLETED', amount: 1200, rating: 5 },
    { id: 'SRV-771239', customer: 'Suresh Babu', date: '08-Jul-2026', status: 'COMPLETED', amount: 350, rating: 4 },
    { id: 'SRV-770882', customer: 'Ravi Teja', date: '05-Jul-2026', status: 'CANCELLED', amount: 0, rating: 1 }
  ]);

  // 11. Performance Metrics
  const [performance, setPerformance] = useState({
    assigned: 3,
    completed: 12,
    pending: 1,
    cancelled: 1,
    earnings: 8500,
    rating: 4.8
  });

  // 12. Notifications list
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'New Service Assigned: Samsung 8kg Drum Issue', time: 'Just now' },
    { id: 2, type: 'info', message: 'Customer Shalini Nair confirmed slot for tomorrow', time: '10 mins ago' },
    { id: 3, type: 'success', message: 'Payment Received: ₹1,200 from Meena Sharma', time: 'Yesterday' },
    { id: 4, type: 'warning', message: 'PCB Board required for Samsung service', time: '1 day ago' },
    { id: 5, type: 'reminder', message: 'Service Reminder: Monthly calibration scheduled', time: '2 days ago' }
  ]);

  // 13. Service page checklists & diagnostics states
  const [toolsChecked, setToolsChecked] = useState({
    multimeter: false,
    screwdrivers: false,
    wrench: false,
    drainTool: false,
    descalingAgent: false,
    spareFuses: false
  });
  const [expandedFault, setExpandedFault] = useState(null);

  const toggleTool = (toolKey) => {
    setToolsChecked(prev => ({ ...prev, [toolKey]: !prev[toolKey] }));
  };

  // --- ACTIONS & HANDLERS ---

  // Timer logic for Step 6
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. Accept Request
  const handleAcceptRequest = (req) => {
    setActiveJob(req);
    setIncomingRequests((prev) => prev.filter((r) => r.id !== req.id));
    setWorkflowStep(2); // Step 2: Accepted
    
    // Add Notification
    setNotifications((prev) => [
      { id: Date.now(), type: 'success', message: `Job #${req.id} accepted. Customer notified!`, time: 'Just now' },
      ...prev
    ]);
  };

  // 2. Decline Request
  const handleDeclineRequest = (id) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  // 3. Workflow triggers
  const handleStartTransit = () => {
    setWorkflowStep(3); // Step 3: On the Way
  };

  const handleConfirmArrival = () => {
    setWorkflowStep(4); // Step 4: Arrived
  };

  const handleUploadPhoto = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'before') {
      setBeforePhoto(file);
      setPreviews((prev) => ({ ...prev, before: url }));
      setWorkflowStep(5); // Step 5: Before Photo
    } else {
      setAfterPhoto(file);
      setPreviews((prev) => ({ ...prev, after: url }));
      setWorkflowStep(7); // Step 7: After Photo
    }
  };

  const handleStartRepair = () => {
    setIsTimerRunning(true);
    setWorkflowStep(6); // Step 6: Repair Started
  };

  const handleStopRepair = () => {
    setIsTimerRunning(false);
  };

  const handleCompleteRepairStep = () => {
    setIsTimerRunning(false);
    setWorkflowStep(7); // Proceed to Step 7
  };

  const handleProceedToPayment = () => {
    setWorkflowStep(8); // Step 8: Payment
  };

  const handleConfirmPayment = () => {
    setPaymentConfirmed(true);
    setNotifications((prev) => [
      { id: Date.now(), type: 'success', message: `Payment of ₹${calculateTotalCost()} confirmed via ${paymentMethod}`, time: 'Just now' },
      ...prev
    ]);
  };

  const handleCompleteService = () => {
    // Move to history
    const completedRecord = {
      id: activeJob.id,
      customer: activeJob.customerName,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      status: 'COMPLETED',
      amount: calculateTotalCost(),
      rating: rating
    };

    setRecentHistory((prev) => [completedRecord, ...prev]);
    setPerformance((prev) => ({
      ...prev,
      completed: prev.completed + 1,
      earnings: prev.earnings + completedRecord.amount
    }));

    // Reset workflow
    setActiveJob(null);
    setWorkflowStep(1);
    setAddedParts([]);
    setPreviews({ before: '', after: '' });
    setBeforePhoto(null);
    setAfterPhoto(null);
    setDiagnosis('');
    setRepairDetails('');
    setRecommendations('');
    setTimerSeconds(0);
    setPaymentConfirmed(false);
  };

  // Spare Parts handlers
  const handleAddSparePart = () => {
    const catalogItem = SPARE_PARTS_CATALOG[selectedPartIndex];
    const existsIndex = addedParts.findIndex((p) => p.name === catalogItem.name);
    
    if (existsIndex > -1) {
      const updated = [...addedParts];
      updated[existsIndex].qty += partQty;
      setAddedParts(updated);
    } else {
      setAddedParts((prev) => [...prev, { name: catalogItem.name, price: catalogItem.price, qty: partQty }]);
    }
    setPartQty(1);
  };

  const handleRemoveSparePart = (name) => {
    setAddedParts((prev) => prev.filter((p) => p.name !== name));
  };

  // Calculators
  const calculatePartsCost = () => {
    return addedParts.reduce((sum, p) => sum + p.price * p.qty, 0);
  };

  const calculateTotalCost = () => {
    if (!activeJob) return 0;
    return activeJob.baseCharge + calculatePartsCost();
  };

  // Helper for Stepper HUD Step Styles
  const getStepClass = (stepNum) => {
    if (workflowStep > stepNum) {
      return 'bg-green-500 border-green-500 text-white';
    }
    if (workflowStep === stepNum) {
      return 'bg-blue-600 border-blue-600 text-white font-extrabold ring-4 ring-blue-50';
    }
    return 'bg-white border-slate-200 text-slate-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto pb-12 animate-fade-in text-slate-800 text-sm">
      
      {/* LEFT COLUMN: MAIN WORKFLOWS */}
      <div className="lg:col-span-8 space-y-6">

        {/* WIDGET 2: WASHING MACHINE DIAGNOSTICS & TROUBLESHOOTING GUIDE */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Common Fault Diagnostics Guide
            </h3>
            <p className="text-[10px] text-slate-455 font-bold uppercase mt-0.5">Washing machine troubleshooting decision tree</p>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: 'fault-1',
                title: 'Machine Not Spinning (Drum Locked)',
                symptoms: 'Motor hums but drum does not spin; error codes displayed.',
                checklists: [
                  'Inspect drive belt for wear, slipping, or breakage.',
                  'Measure motor capacitor microfarad value using multimeter.',
                  'Inspect drum bearings for stiffness or physical seizure.'
                ]
              },
              {
                id: 'fault-2',
                title: 'Water Not Draining (Drain Timeout)',
                symptoms: 'Water stays in drum; cycle stops before spin starts.',
                checklists: [
                  'Unscrew front drain filter and clear coin/hairpin blockages.',
                  'Test drain pump motor windings resistance (normal: 150-300 ohms).',
                  'Verify drain hose is not kinked or blocked.'
                ]
              },
              {
                id: 'fault-3',
                title: 'Excessive Vibration & Noise',
                symptoms: 'Loud banging noise during spin cycle; machine moves on floor.',
                checklists: [
                  'Verify machine is perfectly level using spirit level.',
                  'Inspect all 4 suspension shock absorbers for hydraulic leaks.',
                  'Check tub balance rings and concrete counterweights.'
                ]
              },
              {
                id: 'fault-4',
                title: 'No Water Inlet / Slow Fill',
                symptoms: 'Water does not enter tub; tap icon error indicator.',
                checklists: [
                  'Clean inlet hose mesh filters from rust or scale blockages.',
                  'Test water inlet valve solenoid coil continuity.',
                  'Verify home tap water pressure is sufficient.'
                ]
              }
            ].map((f) => (
              <div 
                key={f.id} 
                className="border border-slate-150 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFault(expandedFault === f.id ? null : f.id)}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100 p-4 flex justify-between items-center transition-all cursor-pointer"
                >
                  <span className="text-xs font-black text-slate-850">{f.title}</span>
                  <span className="text-xs text-slate-400 font-extrabold">{expandedFault === f.id ? '▲' : '▼'}</span>
                </button>
                {expandedFault === f.id && (
                  <div className="p-4 bg-white border-t border-slate-150 text-xs space-y-3">
                    <p className="text-[11px] text-slate-500 leading-relaxed italic"><strong className="text-slate-700 font-bold block not-italic">Common Symptoms:</strong> "{f.symptoms}"</p>
                    <div className="space-y-1.5 pt-1">
                      <strong className="text-slate-800 text-[10px] uppercase font-bold block tracking-wider">Troubleshooting Steps:</strong>
                      <ul className="list-disc list-inside text-slate-650 space-y-1 pl-1">
                        {f.checklists.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MODULE 2: CURRENT ACTIVE SERVICE */}
        {activeJob ? (
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                  Active Repair Service Console
                </h3>
                <p className="text-[10px] text-slate-455 font-bold">REAL-TIME JOB STEP MONITOR</p>
              </div>
              <div className="bg-blue-50 border border-blue-150 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase">
                Step {workflowStep} of 9
              </div>
            </div>

            {/* Stepper HUD (9 Steps Indicator) */}
            <div className="grid grid-cols-9 gap-1 text-center py-2 relative">
              {/* Stepper connectors */}
              <div className="absolute top-6 left-5 right-5 h-0.5 bg-slate-100 z-0"></div>
              
              {[
                { s: 1, name: 'Assign' },
                { s: 2, name: 'Accept' },
                { s: 3, name: 'Transit' },
                { s: 4, name: 'Arrive' },
                { s: 5, name: 'Pre-Photo' },
                { s: 6, name: 'Repair' },
                { s: 7, name: 'Post-Photo' },
                { s: 8, name: 'Payment' },
                { s: 9, name: 'Complete' }
              ].map((step) => (
                <div key={step.s} className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${getStepClass(step.s)}`}>
                    {workflowStep > step.s ? <Check className="w-4 h-4" /> : step.s}
                  </div>
                  <span className={`text-[8px] font-bold mt-1.5 uppercase tracking-tight block ${workflowStep === step.s ? 'text-blue-600 font-extrabold' : 'text-slate-400'}`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Active Service Card details */}
            <div className="border border-slate-150 rounded-2xl p-5 bg-slate-50/40 space-y-5">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] bg-blue-100 text-blue-700 border border-blue-150 px-2.5 py-0.5 rounded-full font-black uppercase">
                    Job ID: #{activeJob.id}
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-lg pt-1">{activeJob.brandModel}</h4>
                  <p className="text-xs text-slate-500 font-medium">Issue: {activeJob.problemDescription}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-bold block">BASE CHARGE</span>
                  <span className="text-base font-black text-slate-800">₹{activeJob.baseCharge}</span>
                </div>
              </div>

              {/* Step Action Workflows UI */}
              <div className="border-t border-slate-150 pt-4 space-y-4">
                
                {/* Step 2 accepted screen */}
                {workflowStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-xl text-xs leading-relaxed font-bold">
                      ✓ Request Accepted! You have committed to servicing this client. Please prepare your tools and click below to begin transit.
                    </div>
                    <button
                      onClick={handleStartTransit}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      <Navigation className="w-4.5 h-4.5" /> Start Traveling (On the Way)
                    </button>
                  </div>
                )}

                {/* Step 3 Transit Trip screen */}
                {workflowStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">ETA</span>
                        <span className="text-sm font-black text-slate-800">12 mins away</span>
                      </div>
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">Distance</span>
                        <span className="text-sm font-black text-slate-800">{activeJob.distance}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(activeJob.address)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <Compass className="w-4.5 h-4.5 animate-spin" /> Live Navigation Map
                      </a>
                      <button
                        onClick={handleConfirmArrival}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Check className="w-4.5 h-4.5" /> Confirm Arrival at Site
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4 Arrived screen */}
                {workflowStep === 4 && (
                  <div className="space-y-4 text-center py-2">
                    <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto text-xl font-bold">
                      📍
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-800 text-sm">Arrived at Customer Location</h5>
                      <p className="text-[10px] text-slate-455 mt-0.5">Arrival timestamp logged successfully in dashboard database.</p>
                    </div>
                    
                    {/* Trigger Before Photo selection */}
                    <div className="pt-2 max-w-sm mx-auto">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="before-photo-file" 
                        onChange={(e) => handleUploadPhoto(e, 'before')} 
                        className="hidden" 
                      />
                      <label 
                        htmlFor="before-photo-file" 
                        className="cursor-pointer w-full border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white rounded-2xl p-6 flex flex-col items-center gap-2 transition-all text-slate-400 hover:text-blue-600"
                      >
                        <Camera className="h-6 w-6" />
                        <span className="text-xs font-bold text-slate-700">Take/Upload Before Service Photo</span>
                        <span className="text-[9px] text-slate-400">Capture current machine condition before starting repair</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 5 Before Photo verification screen */}
                {workflowStep === 5 && (
                  <div className="space-y-4">
                    <span className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-center">Pre-Service Condition Verification</span>
                    <div className="relative max-w-sm mx-auto border border-slate-200 rounded-xl overflow-hidden shadow-inner">
                      <img src={previews.before} className="w-full h-48 object-cover" alt="Pre-Service preview" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent flex items-end p-3">
                        <span className="text-white text-[10px] font-mono">Timestamped: {new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <label 
                        htmlFor="before-photo-file" 
                        className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <Camera className="w-4 h-4" /> Retake Photo
                      </label>
                      <button
                        onClick={handleStartRepair}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                      >
                        <Check className="w-4 h-4" /> Proceed to Repair
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 6 Repair in progress screen */}
                {workflowStep === 6 && (
                  <div className="space-y-4">
                    <div className="bg-slate-800 p-5 rounded-2xl text-center text-white space-y-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-0"></div>
                      <div className="relative z-10 space-y-1">
                        <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest block">REPAIR TIMER IN PROGRESS</span>
                        <p className="text-3xl font-mono font-black text-yellow-400 tracking-wider">
                          {formatTimer(timerSeconds)}
                        </p>
                        <span className="text-[9px] text-slate-350 block">Record details and add spare parts in catalog below</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {isTimerRunning ? (
                        <button
                          onClick={handleStopRepair}
                          className="flex-1 bg-amber-50 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-xl text-xs cursor-pointer text-center"
                        >
                          Pause Timer
                        </button>
                      ) : (
                        <button
                          onClick={handleStartRepair}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl text-xs cursor-pointer text-center"
                        >
                          Resume Timer
                        </button>
                      )}
                      <button
                        onClick={handleCompleteRepairStep}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                      >
                        <CheckCircle2 className="w-4.5 h-4.5" /> Stop & Complete Work
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 7 After Photo upload and comparison screen */}
                {workflowStep === 7 && (
                  <div className="space-y-4">
                    <span className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-center">Post-Service Repair Verification</span>
                    
                    {previews.after ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-400 font-bold block text-center uppercase">Before Repair</span>
                          <img src={previews.before} className="w-full h-32 object-cover rounded-lg border" alt="pre-service" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-400 font-bold block text-center uppercase">After Repair</span>
                          <img src={previews.after} className="w-full h-32 object-cover rounded-lg border border-green-200" alt="post-service" />
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-sm mx-auto">
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="after-photo-file" 
                          onChange={(e) => handleUploadPhoto(e, 'after')} 
                          className="hidden" 
                        />
                        <label 
                          htmlFor="after-photo-file" 
                          className="cursor-pointer w-full border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white rounded-2xl p-6 flex flex-col items-center gap-2 transition-all text-slate-400 hover:text-blue-600"
                        >
                          <Camera className="h-6 w-6" />
                          <span className="text-xs font-bold text-slate-700">Take/Upload After Service Photo</span>
                          <span className="text-[9px] text-slate-400">Capture final condition photo to proceed to billing</span>
                        </label>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      {previews.after && (
                        <>
                          <label 
                            htmlFor="after-photo-file" 
                            className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
                          >
                            <Camera className="w-4.5 h-4.5" /> Retake Photo
                          </label>
                          <button
                            onClick={handleProceedToPayment}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                          >
                            <Check className="w-4 h-4" /> Proceed to Billing
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 8 Billing and Payment Screen */}
                {workflowStep === 8 && (
                  <div className="space-y-4">
                    <span className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-center">Service Invoice Summary</span>
                    
                    <div className="bg-slate-100 p-4 rounded-xl space-y-2.5 text-xs">
                      <div className="flex justify-between font-medium">
                        <span>Base Diagnostic Charge</span>
                        <span>₹{activeJob.baseCharge}</span>
                      </div>
                      {addedParts.map((p, i) => (
                        <div key={i} className="flex justify-between text-slate-500">
                          <span>{p.name} (x{p.qty})</span>
                          <span>₹{p.price * p.qty}</span>
                        </div>
                      ))}
                      <div className="border-t border-slate-250 pt-2.5 flex justify-between font-black text-slate-800 text-sm">
                        <span>Total Invoice Amount</span>
                        <span>₹{calculateTotalCost()}</span>
                      </div>
                    </div>

                    {!paymentConfirmed ? (
                      <div className="space-y-3">
                        <span className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest">Select Payment Method</span>
                        <div className="grid grid-cols-4 gap-2">
                          {['UPI', 'Cash', 'Card', 'Online'].map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                                paymentMethod === method 
                                  ? 'bg-blue-600 border-blue-600 text-white shadow' 
                                  : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={handleConfirmPayment}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                        >
                          <DollarSign className="w-4 h-4" /> Confirm Payment Received
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-150 text-green-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2 justify-center">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span>Payment Received successfully via {paymentMethod}!</span>
                        </div>
                        {/* Receipt rendering mockup */}
                        <div className="border border-dashed border-slate-300 p-4 rounded-xl bg-white space-y-2 text-[11px] font-mono text-slate-600">
                          <p className="text-center font-bold text-xs uppercase tracking-wider text-slate-800">Forge India Receipt</p>
                          <p className="text-center border-b pb-1.5 mb-1.5">Booking ref: #{activeJob.id}</p>
                          <p>Customer: {activeJob.customerName}</p>
                          <p>Device: {activeJob.brandModel}</p>
                          <p>Payment Mode: {paymentMethod}</p>
                          <p className="border-t pt-1.5 font-bold text-slate-800 flex justify-between">
                            <span>Amount Settled:</span>
                            <span>₹{calculateTotalCost()}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => setWorkflowStep(9)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                        >
                          Proceed to Customer Feedback
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 9 Customer Rating feedback Screen */}
                {workflowStep === 9 && (
                  <div className="space-y-4">
                    <span className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-center">Customer Rating & Feedback</span>
                    
                    <div className="space-y-3">
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-1 cursor-pointer text-yellow-400 hover:scale-110 transition-all"
                          >
                            <Star className={`w-7 h-7 ${rating >= star ? 'fill-yellow-400' : 'text-slate-300'}`} />
                          </button>
                        ))}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest">Customer Feedback Notes</label>
                        <textarea
                          rows="2"
                          placeholder="Enter any additional customer feedback/remarks here..."
                          value={feedbackNotes}
                          onChange={(e) => setFeedbackNotes(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <button
                        onClick={handleCompleteService}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                      >
                        <Check className="w-4 h-4" /> Save & Close Service
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* MODULE 5: CUSTOMER INFORMATION CARD */}
            <div className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4">
              <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <User className="w-4.5 h-4.5 text-blue-600" />
                Customer Information Card
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Customer name</span>
                  <span className="font-bold text-slate-800">{activeJob.customerName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Mobile number</span>
                  <span className="font-bold text-blue-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {activeJob.phone}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Full Address</span>
                  <span className="font-medium text-slate-700">{activeJob.address}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Warranty status</span>
                  <span className={`font-bold inline-block px-2 py-0.5 rounded text-[10px] mt-0.5 ${
                    activeJob.warrantyStatus.includes('Under') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {activeJob.warrantyStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Installation Date</span>
                  <span className="font-bold text-slate-800">{activeJob.machineInstallationDate}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Previous History</span>
                  <span className="font-medium text-slate-700 italic">"{activeJob.prevHistory}"</span>
                </div>
              </div>
            </div>

            {/* MODULE 4: SPARE PARTS SECTION */}
            <div className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4">
              <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <Wrench className="w-4.5 h-4.5 text-blue-600" />
                Spare Parts Section
              </h4>
              <p className="text-[10px] text-slate-455 font-bold uppercase tracking-wider">Log machine parts replaced during service</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 space-y-1">
                  <label className="block text-[9px] text-slate-400 font-bold uppercase">Select Spare Part</label>
                  <select
                    value={selectedPartIndex}
                    onChange={(e) => setSelectedPartIndex(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {SPARE_PARTS_CATALOG.map((part, idx) => (
                      <option key={part.name} value={idx}>
                        {part.name} (₹{part.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24 space-y-1">
                  <label className="block text-[9px] text-slate-400 font-bold uppercase">Qty</label>
                  <select
                    value={partQty}
                    onChange={(e) => setPartQty(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddSparePart}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer h-10 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" /> Add Part
                  </button>
                </div>
              </div>

              {addedParts.length > 0 ? (
                <div className="border border-slate-100 rounded-xl overflow-hidden mt-3">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase">
                      <tr>
                        <th className="p-3">Part Replaced</th>
                        <th className="p-3 text-center">Quantity</th>
                        <th className="p-3 text-right">Cost</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {addedParts.map((part, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-800">{part.name}</td>
                          <td className="p-3 text-center">{part.qty}</td>
                          <td className="p-3 text-right">₹{part.price * part.qty}</td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveSparePart(part.name)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No spare parts logged yet for this ticket.
                </div>
              )}
            </div>

            {/* MODULE 6: SERVICE NOTES */}
            <div className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4">
              <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-blue-600" />
                Service Notes
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest">Diagnosis</label>
                  <textarea
                    rows="3"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Enter diagnostic details..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest">Repair Details</label>
                  <textarea
                    rows="3"
                    value={repairDetails}
                    onChange={(e) => setRepairDetails(e.target.value)}
                    placeholder="Enter repair details/actions taken..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest">Recommendations</label>
                  <textarea
                    rows="2"
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    placeholder="Enter preventive recommendations..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest">Next Service Reminder</label>
                  <select
                    value={nextReminder}
                    onChange={(e) => setNextReminder(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 h-10 focus:outline-none focus:border-blue-500"
                  >
                    <option value="3 Months">3 Months Reminder</option>
                    <option value="6 Months">6 Months Reminder</option>
                    <option value="12 Months">12 Months Reminder</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Wrench className="h-8 w-8" />
            </div>
            <h4 className="font-extrabold text-slate-700">No Service Jobs Active</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Please accept an incoming request from the top priority list to initialize your real-time workflow console.
            </p>
          </div>
        )}

      </div>

      {/* RIGHT COLUMN: PERFORMANCE, LOGS, ACTIONS */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* MODULE 10: QUICK ACTIONS */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <a
              href={activeJob ? `https://maps.google.com/?q=${encodeURIComponent(activeJob.address)}` : '#'}
              target="_blank"
              rel="noreferrer"
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeJob 
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-750' 
                  : 'bg-slate-50/50 border-slate-150 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Navigation className="w-4.5 h-4.5 text-blue-600" />
              <span className="font-bold text-[10px]">Open Maps</span>
            </a>
            
            <a
              href={activeJob ? `tel:${activeJob.phone}` : '#'}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeJob 
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-750' 
                  : 'bg-slate-50/50 border-slate-150 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Phone className="w-4.5 h-4.5 text-green-600" />
              <span className="font-bold text-[10px]">Call Customer</span>
            </a>

            <button
              onClick={() => {}}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeJob 
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-750' 
                  : 'bg-slate-50/50 border-slate-150 text-slate-400 cursor-not-allowed'
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5 text-purple-600" />
              <span className="font-bold text-[10px]">Chat support</span>
            </button>

            <button
              onClick={() => {
                if (!activeJob) return;
                const fileInput = document.getElementById(workflowStep >= 7 ? 'after-photo-file' : 'before-photo-file');
                if (fileInput) fileInput.click();
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeJob 
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-750' 
                  : 'bg-slate-50/50 border-slate-150 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Camera className="w-4.5 h-4.5 text-amber-500" />
              <span className="font-bold text-[10px]">Upload Photos</span>
            </button>
          </div>

          {activeJob && (
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={handleConfirmArrival}
                disabled={workflowStep >= 4}
                className={`py-2 px-3 text-[10px] font-extrabold rounded-xl border ${
                  workflowStep < 4 ? 'bg-slate-800 hover:bg-slate-950 text-white cursor-pointer' : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                Mark Arrived
              </button>
              <button
                onClick={handleStartRepair}
                disabled={workflowStep !== 5}
                className={`py-2 px-3 text-[10px] font-extrabold rounded-xl border ${
                  workflowStep === 5 ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md' : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                Start Repair
              </button>
            </div>
          )}
        </div>

        {/* MODULE 7: TODAY'S PERFORMANCE */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Today's Performance</h3>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Operational HUD statistics</p>
            </div>
            <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Assigned</span>
              <p className="text-lg font-black text-slate-800">{performance.assigned}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Completed</span>
              <p className="text-lg font-black text-green-600">{performance.completed}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Pending</span>
              <p className="text-lg font-black text-amber-500">{performance.pending}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Cancelled</span>
              <p className="text-lg font-black text-red-500">{performance.cancelled}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-1 col-span-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Today's Earnings</span>
                <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold">▲ 14%</span>
              </div>
              <p className="text-xl font-black text-slate-855">₹{performance.earnings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* MODULE 11: NOTIFICATIONS PANEL */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-800 text-sm">Notifications Panel</h3>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-2.5 items-start p-2 rounded-xl hover:bg-slate-50 transition-all text-xs">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  n.type === 'alert' ? 'bg-red-500' :
                  n.type === 'success' ? 'bg-green-500' :
                  n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></span>
                <div className="space-y-0.5 flex-1 leading-tight">
                  <p className="font-medium text-slate-700">{n.message}</p>
                  <span className="text-[9px] text-slate-400 font-medium block">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODULE 8: UPCOMING SCHEDULED SERVICES */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm">Upcoming Scheduled Services</h3>
          
          <div className="relative border-l border-slate-200 pl-4 ml-1 space-y-4 text-xs">
            <div className="relative">
              <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white"></span>
              <p className="font-black text-slate-800 text-xs">05:30 PM – Aravind Swamy</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">HSR Layout • Samsung Drum Repair</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white"></span>
              <p className="font-black text-slate-600 text-xs">Tomorrow, 10:00 AM – Shalini Nair</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Koramangala • IFB Drain Fix</p>
            </div>
          </div>
        </div>

        {/* MODULE 9: RECENT SERVICE HISTORY */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm">Recent Service History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[9px] text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-2">Service ID</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2 text-right">Amount</th>
                  <th className="p-2 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-800">#{item.id.split('-')[1]}</td>
                    <td className="p-2 text-slate-650">{item.customer}</td>
                    <td className="p-2 text-right font-bold">₹{item.amount}</td>
                    <td className="p-2 text-center">
                      <span className="text-yellow-600 font-bold flex items-center justify-center gap-0.5">
                        ★ {item.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AssignedServices;
