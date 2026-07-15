import React, { useState } from 'react';
import { CreditCard, Award, Zap, CheckCircle2 } from 'lucide-react';

const MembershipCard = () => {
  const [activePlan, setActivePlan] = useState(() => {
    const saved = localStorage.getItem('active_membership_plan');
    return saved ? JSON.parse(saved) : null;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('membership_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handlePurchase = (planName, price, discount, duration) => {
    const planDetails = {
      name: planName,
      price,
      discount,
      duration,
      memberId: 'MEM-' + Math.floor(100000 + Math.random() * 900000),
      purchasedOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      savings: '₹0'
    };
    localStorage.setItem('active_membership_plan', JSON.stringify(planDetails));
    setActivePlan(planDetails);

    // Save transaction history
    const transaction = {
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      plan: planName + ' Plan',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: price,
      status: 'Successful'
    };
    const updatedHistory = [transaction, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('membership_history', JSON.stringify(updatedHistory));
  };

  const handleCancelPlan = () => {
    localStorage.removeItem('active_membership_plan');
    setActivePlan(null);
  };

  const getGradient = (planName) => {
    switch (planName) {
      case 'Silver': return 'from-slate-400 to-slate-650';
      case 'Gold': return 'from-amber-400 via-amber-500 to-yellow-605';
      case 'Diamond': return 'from-cyan-400 via-blue-500 to-indigo-650';
      default: return 'from-slate-800 to-slate-900';
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-800">
      
      {/* Header removed */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Digital Card View */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center min-h-[380px]">
          {activePlan ? (
            <div className="w-full space-y-6">
              {/* Premium Digital Card Mockup */}
              <div className={`w-full aspect-[1.586/1] bg-gradient-to-br ${getGradient(activePlan.name)} rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden transition-all transform hover:scale-[1.02]`}>
                {/* Decorative circles */}
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/5 blur-xl"></div>

                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black tracking-widest uppercase opacity-75">Connect App Member</span>
                    <h3 className="text-lg font-black mt-0.5 tracking-wide">{activePlan.name} Plan</h3>
                  </div>
                  <Award className="h-7 w-7 text-white/90" />
                </div>

                <div className="space-y-2">
                  <div className="text-center font-bold tracking-[0.25em] text-sm md:text-base font-mono">
                    {activePlan.memberId.match(/.{1,4}/g).join(' ')}
                  </div>
                  <div className="flex justify-between items-end text-[10px] uppercase font-bold opacity-80 pt-2">
                    <div>
                      <span className="block text-[8px] opacity-75">Card Holder</span>
                      <span>Dhanu Sri</span>
                    </div>
                    <div>
                      <span className="block text-[8px] opacity-75">Active Since</span>
                      <span>{activePlan.purchasedOn}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Active Subscription
                </span>
                <p className="text-xs text-slate-400 font-semibold">Your card gives you a {activePlan.discount} discount on selected options.</p>
                <button
                  onClick={handleCancelPlan}
                  className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase tracking-wider block mx-auto pt-2 hover:underline"
                >
                  Cancel Plan Subscription
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 max-w-xs">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto shadow-sm">
                <CreditCard className="h-8 w-8 text-slate-400 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-805">No Membership Card</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Purchase a membership plan on the right to unlock customer discounts across all participating outlets.
              </p>
            </div>
          )}
        </div>

        {/* Right Panels */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Panel: Benefits Summary */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-sm text-slate-805">Membership Benefits Summary</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Savings Earned</span>
                <span className="text-xl font-black text-blue-600 block">{activePlan ? '₹250' : '₹0'}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Active Discounts</span>
                <span className="text-xl font-black text-emerald-600 block">{activePlan ? activePlan.discount : 'None'}</span>
              </div>
            </div>

            {/* Benefits block removed */}
          </div>

          {/* Bottom Panel: Available Membership Plans */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-extrabold text-sm text-slate-805">Available Membership Plans</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Silver Plan */}
              <div className={`bg-gradient-to-br from-slate-200 via-slate-50 to-slate-300 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-h-[300px] shadow-sm relative overflow-hidden`}>
                {activePlan?.name === 'Silver' && (
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-slate-800 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-md tracking-wider">
                      Active Plan
                    </span>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-slate-250 text-slate-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Silver Plan
                    </span>
                  </div>
                  
                  <div className="space-y-0.5">
                    <span className="text-2xl font-black text-slate-800">₹500</span>
                    <span className="text-[10px] text-slate-400 font-bold"> / Month</span>
                  </div>

                  <div className="border-t border-slate-200/60 pt-3 space-y-2">
                    <span className="text-[9px] uppercase font-extrabold text-slate-400 block tracking-wider">Plan Benefits</span>
                    <div className="space-y-1.5 text-[11px] font-bold text-slate-655">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-slate-600" />
                        <span>% Discount Card</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-5">
                        <span className="w-1 h-1 rounded-full bg-slate-600 block"></span>
                        <span>10% Discount</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-5">
                        <span className="w-1 h-1 rounded-full bg-slate-600 block"></span>
                        <span>Basic Support</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handlePurchase('Silver', '₹500', '10%', 'Month')}
                    className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-black uppercase rounded-xl transition-all shadow-sm"
                  >
                    Purchase Plan
                  </button>
                </div>
              </div>

              {/* Gold Plan */}
              <div className={`bg-gradient-to-br from-amber-200 via-yellow-50 to-amber-300 border border-amber-250 rounded-2xl p-5 flex flex-col justify-between min-h-[300px] shadow-sm relative overflow-hidden`}>
                {activePlan?.name === 'Gold' && (
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-amber-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-md tracking-wider">
                      Active Plan
                    </span>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-amber-500 text-amber-550" /> Gold Plan
                    </span>
                  </div>
                  
                  <div className="space-y-0.5">
                    <span className="text-2xl font-black text-amber-800">₹1000</span>
                    <span className="text-[10px] text-amber-600 font-bold"> / 3 Months</span>
                  </div>

                  <div className="border-t border-amber-200/60 pt-3 space-y-2">
                    <span className="text-[9px] uppercase font-extrabold text-amber-550 block tracking-wider">Plan Benefits</span>
                    <div className="space-y-1.5 text-[11px] font-bold text-amber-800">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-700" />
                        <span>% Discount Card</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-5">
                        <span className="w-1 h-1 rounded-full bg-amber-700 block"></span>
                        <span>15% Discount</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-5">
                        <span className="w-1 h-1 rounded-full bg-amber-700 block"></span>
                        <span>Priority Support</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-5">
                        <span className="w-1 h-1 rounded-full bg-amber-700 block"></span>
                        <span>Featured Listing</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handlePurchase('Gold', '₹1000', '15%', '3 Months')}
                    className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-black uppercase rounded-xl transition-all shadow-sm"
                  >
                    Purchase Plan
                  </button>
                </div>
              </div>

              {/* Diamond Plan */}
              <div className={`bg-gradient-to-br from-cyan-200 via-blue-50 to-cyan-300 border border-cyan-250 rounded-2xl p-5 flex flex-col justify-between min-h-[300px] shadow-sm relative overflow-hidden`}>
                {activePlan?.name === 'Diamond' && (
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-cyan-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-md tracking-wider">
                      Active Plan
                    </span>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-cyan-100 text-cyan-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Diamond Plan
                    </span>
                  </div>
                  
                  <div className="space-y-0.5">
                    <span className="text-2xl font-black text-cyan-850">₹2000</span>
                    <span className="text-[10px] text-cyan-600 font-bold"> / Year</span>
                  </div>

                  <div className="border-t border-cyan-200/60 pt-3 space-y-2">
                    <span className="text-[9px] uppercase font-extrabold text-cyan-655 block tracking-wider">Plan Benefits</span>
                    <div className="space-y-1.5 text-[11px] font-bold text-cyan-800">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-705" />
                        <span>% Discount Card</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-5">
                        <span className="w-1 h-1 rounded-full bg-cyan-705 block"></span>
                        <span>20% Discount</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-5">
                        <span className="w-1 h-1 rounded-full bg-cyan-705 block"></span>
                        <span>Premium Support</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-5">
                        <span className="w-1 h-1 rounded-full bg-cyan-705 block"></span>
                        <span>Featured Listing</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-5">
                        <span className="w-1 h-1 rounded-full bg-cyan-705 block"></span>
                        <span>Exclusive Promotions</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handlePurchase('Diamond', '₹2000', '20%', 'Year')}
                    className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-black uppercase rounded-xl transition-all shadow-sm"
                  >
                    Purchase Plan
                  </button>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>

      {/* Membership History Log */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-805">Membership History Log</h3>
        
        {history.length === 0 ? (
          <div className="text-center text-xs text-slate-400 font-semibold py-8 italic">
            No membership transaction history found
          </div>
        ) : (
          <div className="overflow-x-auto text-xs font-semibold text-slate-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="pb-3 pl-3">Transaction ID</th>
                  <th className="pb-3">Plan Name</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3 pr-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/50">
                    <td className="py-3 pl-3 font-bold text-slate-800">{h.id}</td>
                    <td className="py-3 text-blue-600 font-bold">{h.plan}</td>
                    <td className="py-3 text-slate-450">{h.date}</td>
                    <td className="py-3 font-extrabold text-slate-800">{h.amount}</td>
                    <td className="py-3 pr-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default MembershipCard;
