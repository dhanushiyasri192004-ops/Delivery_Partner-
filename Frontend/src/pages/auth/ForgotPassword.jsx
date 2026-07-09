import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white">Reset Password</h3>
        <p className="text-sm text-slate-400 mt-1">Enter your email and we'll send you link to recover access</p>
      </div>

      {submitted ? (
        <div className="text-center space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm">
            📧 An recovery email was dispatched to <strong>{email}</strong>. Please check your inbox or spam filters.
          </div>
          <Link to="/auth/login" className="inline-flex items-center gap-2 text-brand hover:underline font-semibold mt-4">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand" /> Registered Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand hover:bg-brand-dark text-slate-950 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand/20"
          >
            Send Recovery Email
          </button>

          <p className="text-center text-sm text-slate-400 mt-6">
            <Link to="/auth/login" className="inline-flex items-center gap-2 text-brand hover:underline font-semibold">
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
