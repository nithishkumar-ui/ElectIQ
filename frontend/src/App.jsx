import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Quiz from './pages/Quiz';
import FloatingChatWidget from './components/FloatingChatWidget';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const fetchUser = useAuthStore(state => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </main>
      <FloatingChatWidget />
    </div>
  );
}

export default App;
