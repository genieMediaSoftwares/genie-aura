import React, { useState } from 'react';
import { Sparkles, Lock, Mail, User, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('Genie Media & Studio');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(name, email, password, orgName);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLogins = [
    { label: 'Managing Director (Super Admin)', email: 'admin@geniemedia.in', pass: 'admin123', role: 'SUPER_ADMIN' },
    { label: 'Client Operations Lead', email: 'manager@geniemedia.in', pass: 'admin123', role: 'AGENCY_MANAGER' },
    { label: 'Creative Content Lead', email: 'creative@geniemedia.in', pass: 'admin123', role: 'TEAM_MEMBER' },
    { label: 'Client Viewer (Kalinga Café)', email: 'client@kalingacafe.com', pass: 'admin123', role: 'CLIENT_VIEWER' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1E1B2E]">
            {isLogin ? 'Sign In to GenieAura' : 'Create Agency Account'}
          </h3>
          <p className="text-xs text-gray-500">
            AI Agency Operating System &bull; Genie Media & Studio
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* Quick 1-click test roles */}
        <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E0D8] space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            1-Click Quick Demo Switcher:
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {quickLogins.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={async () => {
                  setEmail(q.email);
                  setPassword(q.pass);
                  setIsSubmitting(true);
                  try {
                    await signIn(q.email, q.pass);
                    onClose();
                  } catch (e: any) {
                    setError(e.message);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="text-left text-xs p-2 rounded-lg bg-white hover:bg-purple-50 hover:border-purple-200 border border-gray-200 flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-bold text-gray-800 block text-xs">{q.label}</span>
                  <span className="text-[10px] text-gray-400">{q.email}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#7C3AED]" />
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {!isLogin && (
            <>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Suresh Varma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#DCD6CA] bg-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Agency / Org Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Genie Media & Studio"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#DCD6CA] bg-[#FAF8F5]"
                />
              </div>
            </>
          )}

          <div>
            <label className="font-bold text-gray-700 block mb-1">Work Email</label>
            <input
              required
              type="email"
              placeholder="user@geniemedia.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#DCD6CA] bg-[#FAF8F5]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#DCD6CA] bg-[#FAF8F5]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs transition-colors"
          >
            {isSubmitting ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#7C3AED] font-semibold hover:underline"
          >
            {isLogin ? "Need a new account? Register" : 'Already have an account? Sign in'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
