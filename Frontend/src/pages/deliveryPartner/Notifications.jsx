import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Send, 
  MessageSquare, 
  Phone, 
  Mail, 
  Check, 
  Paperclip, 
  ChevronRight, 
  User, 
  MapPin,
  Clock, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

const Notifications = () => {
  const { user } = useSelector((state) => state.auth);
  const { activeOrder } = useSelector((state) => state.delivery);

  // Main page tab state: 'support' or 'customer'
  const [activeMainTab, setActiveMainTab] = useState('support');

  // Simulation state for Customer Chat (helps in test runs if no DB activeOrder is present)
  const [simulateActiveOrder, setSimulateActiveOrder] = useState(false);

  // --- SUPPORT CHAT STATE ---
  const categories = [
    { id: 'payment', name: 'Payment & Payouts', icon: '💳' },
    { id: 'delivery', name: 'Order & Delivery', icon: '🍔' },
    { id: 'account', name: 'Account & KYC', icon: '👤' },
    { id: 'general', name: 'General Queries', icon: '❓' }
  ];

  const [chatThreads, setChatThreads] = useState([
    { 
      id: 'chat1', 
      title: 'Payout & Balance Query', 
      lastMsg: 'Funds settle within 10 minutes.', 
      time: 'Just now', 
      status: 'Active',
      category: 'payment',
      messages: [
        { id: 1, text: 'Hello Dhanu! Welcome to Connect Rider Support. How can we help you today with your payouts?', isBot: true, timestamp: '10:15 AM' }
      ]
    },
    { 
      id: 'chat2', 
      title: 'Delayed Pickup #567890', 
      lastMsg: 'Understood, drive safe.', 
      time: 'Yesterday', 
      status: 'Closed',
      category: 'delivery',
      messages: [
        { id: 1, text: 'I have reached the vendor but they said order is not ready yet.', isBot: false, timestamp: '8:42 PM' },
        { id: 2, text: 'No worries, Dhanu. We verified with the merchant. It will be ready in 3 minutes.', isBot: true, timestamp: '8:43 PM' },
        { id: 3, text: 'Okay, picked up now and heading to customer.', isBot: false, timestamp: '8:46 PM' },
        { id: 4, text: 'Great! Understood, drive safe.', isBot: true, timestamp: '8:47 PM' }
      ]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState('chat1');
  const [supportInputValue, setSupportInputValue] = useState('');
  const [supportIsTyping, setSupportIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('payment');

  // --- CUSTOMER CHAT STATE ---
  const [customerMessages, setCustomerMessages] = useState([
    { id: 1, text: 'Hi! Can you please make sure to ask the restaurant for extra tissues?', isBot: true, timestamp: '11:45 AM' },
    { id: 2, text: 'Sure, I will ask them before pickup.', isBot: false, timestamp: '11:47 AM' },
    { id: 3, text: 'Thanks! Also, please leave the packet at the gate security if I do not pick up your call.', isBot: true, timestamp: '11:49 AM' }
  ]);
  const [customerInputValue, setCustomerInputValue] = useState('');
  const [customerIsTyping, setCustomerIsTyping] = useState(false);

  const activeChat = chatThreads.find(c => c.id === activeChatId) || chatThreads[0];
  const supportChatEndRef = useRef(null);
  const customerChatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (activeMainTab === 'support') {
      supportChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      customerChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat.messages, customerMessages, activeMainTab, supportIsTyping, customerIsTyping]);

  // Handle Support message submission
  const handleSupportSend = (e) => {
    e.preventDefault();
    if (!supportInputValue.trim()) return;

    const text = supportInputValue;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatThreads(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          lastMsg: text,
          time: 'Just now',
          messages: [...chat.messages, { id: Date.now(), text, isBot: false, timestamp: timeStr }]
        };
      }
      return chat;
    }));

    setSupportInputValue('');
    setSupportIsTyping(true);

    setTimeout(() => {
      setSupportIsTyping(false);
      let replyText = 'Thank you for reaching out! A support coordinator has been alerted to review your chat thread.';
      
      const lower = text.toLowerCase();
      if (lower.includes('payment') || lower.includes('wallet') || lower.includes('withdraw') || lower.includes('earning')) {
        replyText = 'Instant bank settlements process automatically within 10 minutes. If your balance remains uncredited, upload verification screenshots here.';
      } else if (lower.includes('order') || lower.includes('delivery') || lower.includes('pickup')) {
        replyText = 'Please type the Order/Trip ID reference code (e.g. #ORD-567890) so we can trace progress with the merchant.';
      } else if (lower.includes('account') || lower.includes('kyc') || lower.includes('verify')) {
        replyText = 'To update your profile KYC documents, please use the Edit profile settings from the dashboard menu.';
      }

      setChatThreads(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            lastMsg: replyText,
            messages: [...chat.messages, { id: Date.now() + 1, text: replyText, isBot: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
          };
        }
        return chat;
      }));
    }, 1500);
  };

  // Handle Customer message submission
  const handleCustomerSend = (e) => {
    e.preventDefault();
    if (!customerInputValue.trim()) return;

    const text = customerInputValue;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCustomerMessages(prev => [...prev, { id: Date.now(), text, isBot: false, timestamp: timeStr }]);
    setCustomerInputValue('');
    setCustomerIsTyping(true);

    setTimeout(() => {
      setCustomerIsTyping(false);
      let replyText = 'Perfect, thank you! I will collect it once you arrive.';
      
      const lower = text.toLowerCase();
      if (lower.includes('ready') || lower.includes('arrive') || lower.includes('reach') || lower.includes('outside')) {
        replyText = 'Okay, I will come downstairs to pick it up.';
      } else if (lower.includes('gate') || lower.includes('security') || lower.includes('watchman')) {
        replyText = 'Yes, please hand it over to the gate security guard. Thank you!';
      }

      setCustomerMessages(prev => [...prev, { id: Date.now() + 1, text: replyText, isBot: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  const handleCategoryClick = (catId, catName) => {
    setSelectedCategory(catId);
    const existing = chatThreads.find(c => c.category === catId);
    if (existing) {
      setActiveChatId(existing.id);
      return;
    }

    const newChatId = `chat_${Date.now()}`;
    const newChat = {
      id: newChatId,
      title: `${catName} Support`,
      lastMsg: 'New conversation started.',
      time: 'Just now',
      status: 'Active',
      category: catId,
      messages: [
        { id: 1, text: `Hello Dhanu! Welcome to Connect ${catName} Support. Please outline your issue details below.`, isBot: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]
    };

    setChatThreads(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
  };

  // Determine if customer chat should be enabled (either real activeOrder or simulation)
  const isCustomerChatEnabled = activeOrder || simulateActiveOrder;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Top Navigation Mode Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveMainTab('support')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-black text-xs transition-all ${
            activeMainTab === 'support'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🛟 Chat Support Team
        </button>
        <button
          onClick={() => setActiveMainTab('customer')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-black text-xs transition-all relative ${
            activeMainTab === 'customer'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          💬 Customer Chat
          {isCustomerChatEnabled && (
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* --- MODE A: CHAT SUPPORT PORTAL --- */}
      {activeMainTab === 'support' && (
        <div className="h-[74vh] flex flex-col lg:flex-row gap-6 animate-fade-in">
          
          {/* Left panel */}
          <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto pr-1">
            
            {/* Help Categories */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2">Help Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id, cat.name)}
                    className={`p-3 text-left rounded-xl border transition-all hover:bg-slate-50 flex flex-col justify-between min-h-[90px] ${
                      selectedCategory === cat.id ? 'border-blue-500 bg-blue-50/20' : 'border-slate-100 bg-slate-50/30'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-bold text-slate-700 text-[10px] block mt-1 leading-snug">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Conversations */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex-1 space-y-3.5">
              <h4 className="font-bold text-slate-805 text-xs border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-slate-400" /> Recent Conversations
              </h4>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-0.5">
                {chatThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => { setActiveChatId(thread.id); setSelectedCategory(thread.category); }}
                    className={`p-3 rounded-xl border cursor-pointer hover:bg-slate-50 transition-all flex items-center justify-between gap-2.5 ${
                      activeChatId === thread.id ? 'border-blue-500 bg-blue-50/10' : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">
                        💬
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-black text-slate-800 text-[11px] leading-snug">{thread.title}</p>
                        <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[140px]">{thread.lastMsg}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="text-[9px] text-slate-400 font-semibold">{thread.time}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                        thread.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-450'
                      }`}>
                        {thread.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotline channels */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-3.5">
              <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-slate-400" /> Contact Support Channels
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <Phone className="h-4 w-4 text-blue-650" />
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Helpline Hotline</p>
                    <span className="font-black text-slate-750">+1800-456-9922</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <Mail className="h-4 w-4 text-green-650" />
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Email Assistance</p>
                    <span className="font-black text-slate-750">support-connect@forgeindia.in</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right panel: Active chat */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-150 shadow-sm flex flex-col overflow-hidden min-h-[450px]">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold">
                  🤖
                </div>
                <div>
                  <h5 className="font-black text-slate-800 text-xs">{activeChat.title}</h5>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">Topic: {categories.find(c => c.id === activeChat.category)?.name}</p>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-bold bg-slate-200/60 border border-slate-300/40 px-2 py-0.5 rounded-full uppercase">
                {activeChat.status}
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeChat.messages.map((m) => {
                const isBot = m.isBot;
                return (
                  <div key={m.id} className={`flex gap-3 max-w-[80%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold ${isBot ? 'bg-slate-100' : 'bg-blue-600 text-white'}`}>
                      {isBot ? '🤖' : '👨'}
                    </div>
                    <div className="space-y-1">
                      <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-xs ${isBot ? 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                        {m.text}
                      </div>
                      <span className={`text-[9px] text-slate-400 block font-semibold ${isBot ? 'text-left' : 'text-right'}`}>
                        {m.timestamp} {!isBot && <Check className="h-3 w-3 inline text-green-500" />}
                      </span>
                    </div>
                  </div>
                );
              })}
              {supportIsTyping && (
                <div className="flex gap-3 max-w-[70%] mr-auto items-center animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">🤖</div>
                  <div className="p-3 bg-slate-50 border border-slate-100 text-slate-400 text-xs font-semibold rounded-2xl rounded-tl-none">Assistant typing...</div>
                </div>
              )}
              <div ref={supportChatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSupportSend} className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
              <button type="button" onClick={() => {}} className="p-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-400 transition-all">
                <Paperclip className="h-4.5 w-4.5" />
              </button>
              <input
                type="text"
                value={supportInputValue}
                onChange={(e) => setSupportInputValue(e.target.value)}
                placeholder="Type your message support query here..."
                className="flex-1 px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-xs focus:outline-none bg-white font-semibold text-slate-700"
              />
              <button type="submit" className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center">
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* --- MODE B: CUSTOMER CHAT PORTAL --- */}
      {activeMainTab === 'customer' && (
        <div className="h-[74vh] flex flex-col lg:flex-row gap-6 animate-fade-in">
          
          {/* Active order exists or is simulated */}
          {isCustomerChatEnabled ? (
            <>
              {/* Left Column: Customer details */}
              <div className="w-full lg:w-80 flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">
                      👤
                    </div>
                    <div>
                      <h4 className="font-black text-slate-808 text-xs">{activeOrder?.customerName || 'Rajesh Kumar'}</h4>
                      <p className="text-[9px] text-green-600 font-bold uppercase tracking-wider block">Customer</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-semibold">
                    <div className="flex gap-2 text-slate-500">
                      <MapPin className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                      <span>{activeOrder?.deliveryAddress || 'Flat 405, Block B, Prestige Heights, Outer Ring Rd, Bengaluru'}</span>
                    </div>
                    <div className="flex gap-2 text-slate-500">
                      <Clock className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                      <span>Order Delivery: #ORD-{activeOrder?._id?.substring(18) || '567890'}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-xl text-[10px] leading-relaxed flex gap-2">
                    <AlertCircle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0" />
                    <span>
                      <strong>Notice:</strong> This secure chat channel will automatically close once you check out and complete the order delivery validation.
                    </span>
                  </div>
                </div>

                {/* Switch off simulation helper */}
                {simulateActiveOrder && (
                  <button 
                    onClick={() => setSimulateActiveOrder(false)}
                    className="w-full py-2.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-all font-bold text-xs rounded-xl"
                  >
                    Disconnect Active Order Chat
                  </button>
                )}
              </div>

              {/* Right Column: Live Chat Messenger */}
              <div className="flex-1 bg-white rounded-2xl border border-slate-150 shadow-sm flex flex-col overflow-hidden min-h-[450px]">
                
                {/* Chat Top bar */}
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center font-bold">
                      👨
                    </div>
                    <div>
                      <h5 className="font-black text-slate-800 text-xs">{activeOrder?.customerName || 'Rajesh Kumar'}</h5>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">Connected to customer</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-green-600 font-bold bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Connected
                  </span>
                </div>

                {/* Message list */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {customerMessages.map((m) => {
                    const isCustomer = m.isBot; // Treat customer as incoming/left side
                    return (
                      <div key={m.id} className={`flex gap-3 max-w-[80%] ${isCustomer ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold ${
                          isCustomer ? 'bg-amber-100' : 'bg-blue-600 text-white'
                        }`}>
                          {isCustomer ? '👨' : '🏍️'}
                        </div>
                        <div className="space-y-1">
                          <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-xs ${
                            isCustomer 
                              ? 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100' 
                              : 'bg-blue-600 text-white rounded-tr-none'
                          }`}>
                            {m.text}
                          </div>
                          <span className={`text-[9px] text-slate-400 block font-semibold ${isCustomer ? 'text-left' : 'text-right'}`}>
                            {m.timestamp} {!isCustomer && <Check className="h-3 w-3 inline text-green-500" />}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {customerIsTyping && (
                    <div className="flex gap-3 max-w-[70%] mr-auto items-center animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold">👨</div>
                      <div className="p-3 bg-slate-50 border border-slate-100 text-slate-400 text-xs font-semibold rounded-2xl rounded-tl-none">Customer typing...</div>
                    </div>
                  )}
                  <div ref={customerChatEndRef} />
                </div>

                {/* Send chat block */}
                <form onSubmit={handleCustomerSend} className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
                  <button type="button" onClick={() => {}} className="p-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-400 transition-all">
                    <Paperclip className="h-4.5 w-4.5" />
                  </button>
                  <input
                    type="text"
                    value={customerInputValue}
                    onChange={(e) => setCustomerInputValue(e.target.value)}
                    placeholder="Type message to the customer..."
                    className="flex-1 px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-xs focus:outline-none bg-white font-semibold text-slate-700"
                  />
                  <button type="submit" className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center">
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </form>

              </div>
            </>
          ) : (
            
            /* No active order scenario */
            <div className="w-full bg-white rounded-2xl p-16 text-center border border-slate-150 shadow-sm space-y-5 flex flex-col justify-center items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl">
                💬
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="font-black text-slate-808 text-sm">Customer Chat Offline</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Customer chats are only active and open while you are processing an active order delivery. The channel closes immediately after delivery completion.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSimulateActiveOrder(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white transition-all font-bold text-xs rounded-xl shadow-md"
                >
                  Simulate Active Customer Chat
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Notifications;
