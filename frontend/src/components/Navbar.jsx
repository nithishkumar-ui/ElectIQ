import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, Globe } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 glass-panel border-b-0 py-4 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <Globe className="text-primary-500 w-8 h-8 animate-float" />
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
          ElectIQ
        </span>
      </Link>
      
      <div className="flex gap-6 items-center">
        <Link to="/explore" className="hover:text-primary-400 transition-colors">Explore</Link>
        <Link to="/quiz" className="hover:text-primary-400 transition-colors">Quiz</Link>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
              <User size={20} />
              <span>{user?.username}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <LogOut size={20} className="text-red-400" />
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 hover:bg-white/5 rounded-lg transition-colors">
              Log in
            </Link>
            <Link to="/login?signup=true" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors font-medium">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
