import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ThemeToggle from './components/common/ThemeToggle';

// Dashboard component for authenticated users
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gradient">🏥 Health Wellness Platform</h1>
                <p className="text-gray-600">Day 3: Authentication Complete - Welcome {user.name}!</p>
              </div>
              <button
                onClick={logout}
                className="btn-secondary hover:bg-red-100 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* User Info Card */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">👤</span> User Profile
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="text-gray-600">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Age:</span>
                  <span className="text-gray-600">{user.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Gender:</span>
                  <span className="text-gray-600 capitalize">{user.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Role:</span>
                  <span className="text-gray-600 capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Member Since:</span>
                  <span className="text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🎯</span> Day 3 Complete!
              </h2>
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 font-medium">✅ Authentication System</p>
                  <p className="text-green-600 text-sm">JWT tokens, password hashing</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-700 font-medium">✅ User Management</p>
                  <p className="text-blue-600 text-sm">Login, register, profile update</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-purple-700 font-medium">✅ Secure Routes</p>
                  <p className="text-purple-600 text-sm">Protected API endpoints</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="mr-2">🚀</span> Coming Next
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-400">
                <h3 className="font-medium text-gray-800 mb-1">Day 4-5: Morning Alarm</h3>
                <p className="text-sm text-gray-600">Alarm with puzzle to wake up</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-l-4 border-purple-400">
                <h3 className="font-medium text-gray-800 mb-1">Day 6-7: Meditation</h3>
                <p className="text-sm text-gray-600">Guided meditation sessions</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
                <h3 className="font-medium text-gray-800 mb-1">Day 8-9: Exercise</h3>
                <p className="text-sm text-gray-600">Animated workout routines</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
                <h3 className="font-medium text-gray-800 mb-1">Day 10: Responsive Design</h3>
                <p className="text-sm text-gray-600">Mobile & desktop optimization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading your wellness journey...</p>
    </div>
  </div>
);

// Main App component with authentication logic
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const { user, loading, isInitialized } = useAuth();

  // Show loading while initializing
  if (!isInitialized && loading) {
    return <LoadingScreen />;
  }

  // If user is authenticated, show dashboard
  if (user) {
    return <Dashboard />;
  }

  // If not authenticated, show login/register
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gradient">🏥 Health Wellness</h1>
              <p className="text-sm text-gray-500">Day 3: Authentication System</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('login')}
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  currentView === 'login' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  currentView === 'register' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'login' ? <Login /> : <Register />}
    </div>
  );
};

// Root App component with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="relative">
        <AppContent />
        <ThemeToggle />
      </div>
    </AuthProvider>
  );
};

export default App;
