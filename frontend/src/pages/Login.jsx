import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Login() {
  const [searchParams] = useSearchParams();
  const isSignupInit = searchParams.get('signup') === 'true';
  
  const [isSignup, setIsSignup] = useState(isSignupInit);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      const success = await register(email, username, password);
      if (success) {
        // auto login
        const loginSuccess = await login(username, password);
        if (loginSuccess) navigate('/dashboard');
      }
    } else {
      const success = await login(username, password);
      if (success) navigate('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isSignup ? 'Create an Account' : 'Welcome Back'}
        </h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Log In')}
          </button>
        </form>
        
        <p className="mt-6 text-center text-slate-400">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button 
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
