import React, { useState } from 'react';
import { AuthProvider } from './components/auth/AuthContext';
import { useAuth } from './utils/authUtils';
import { AlarmProvider } from './components/alarm/AlarmContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AlarmSetter from './components/alarm/AlarmSetter';
import ThemeToggle from './components/common/ThemeToggle';

// Dashboard component for authenticated users
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alarm'>('dashboard');

  if (!user) return null;

  return (
    <AlarmProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gradient">🏥 Health Wellness Platform</h1>
                <p className="text-sm text-gray-500">Day 4-5: Morning Alarm System Complete</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'dashboard' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('alarm')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'alarm' 
                      ? 'bg-yellow-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⏰ Alarms
                </button>
                <button
                  onClick={logout}
                  className="btn-secondary hover:bg-red-100 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Welcome Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Welcome back, {user.name}! 👋
                </h2>
                <p className="text-gray-600">Day 4-5: Morning Alarm System is now complete</p>
              </div>

              {/* Day 4-5 Completion Status */}
              <div className="card mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">🎉</span> Day 4-5 Complete!
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-700 font-medium">✅ Smart Alarm System</p>
                    <p className="text-yellow-600 text-sm">Set alarms with custom puzzle challenges</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-orange-700 font-medium">✅ Puzzle Integration</p>
                    <p className="text-orange-600 text-sm">Math, memory, and pattern puzzles to wake up</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-700 font-medium">✅ Customizable Settings</p>
                    <p className="text-purple-600 text-sm">Choose tones, difficulty, and snooze limits</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 font-medium">✅ User-Specific Alarms</p>
                    <p className="text-green-600 text-sm">Personal alarm management with database storage</p>
                  </div>
                </div>
              </div>

              {/* User Profile Card */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="mr-2">👤</span> User Profile
                  </h3>
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
                      <span className="font-medium text-gray-700">Member Since:</span>
                      <span className="text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="mr-2">⚡</span> Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('alarm')}
                      className="btn-wellness w-full text-left"
                    >
                      <span className="mr-2">⏰</span> Set New Alarm
                    </button>
                    <button className="btn-primary w-full text-left" disabled>
                      <span className="mr-2">🧘</span> Start Meditation (Coming Soon)
                    </button>
                    <button className="btn-secondary w-full text-left" disabled>
                      <span className="mr-2">💪</span> View Exercises (Coming Soon)
                    </button>
                    <button className="btn-secondary w-full text-left" disabled>
                      <span className="mr-2">🍎</span> Track Calories (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>

              {/* Coming Soon Features */}
              <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="mr-2">🚀</span> Coming Next
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-purple-400">
                    <h4 className="font-medium text-gray-800 mb-1">Day 6-7: Meditation</h4>
                    <p className="text-sm text-gray-600">Guided meditation sessions with breathing exercises</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
                    <h4 className="font-medium text-gray-800 mb-1">Day 8-9: Exercise</h4>
                    <p className="text-sm text-gray-600">Animated workout routines and fitness tracking</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-red-400">
                    <h4 className="font-medium text-gray-800 mb-1">Day 10-12: Nutrition</h4>
                    <p className="text-sm text-gray-600">Calorie tracking and meal planning</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
                    <h4 className="font-medium text-gray-800 mb-1">Day 13-15: Analytics</h4>
                    <p className="text-sm text-gray-600">Progress tracking and health insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alarm Content */}
        {activeTab === 'alarm' && <AlarmSetter />}
        
        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </AlarmProvider>
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
              <p className="text-sm text-gray-500">Day 4-5: Alarm System Complete</p>
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
