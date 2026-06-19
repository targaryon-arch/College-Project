import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Header Section */}
      <header className="bg-blue-900 text-white p-6 text-center shadow-md border-b-4 border-green-500">
        <h1 className="text-2xl font-bold tracking-wide">Government of Pakistan</h1>
        <h2 className="text-xl font-semibold text-green-400 mt-1">Irrigation Department</h2>
        <h3 className="text-md mt-2 font-light">Access to Water Supply Quota to Farmers</h3>
      </header>

      {/* Login Panel */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-blue-900">
          <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Admin Login</h2>

          <form className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Username</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder="Enter your username" 
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Password</label>
              <input 
                type="password" 
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder="Enter your password" 
              />
            </div>

            <div className="flex justify-between items-center text-sm mt-2">
              <button type="button" className="text-blue-700 hover:text-blue-900 font-medium hover:underline">Forgot Password?</button>
              <button type="button" className="text-green-600 hover:text-green-800 font-medium hover:underline">Register Now</button>
            </div>

           <div className="pt-4">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-blue-900 text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 transition duration-200 shadow-md">
                Login
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-gray-300 text-center p-4 text-sm">
        <p>Developed for Irrigation Department Balochistan © {new Date().getFullYear()}</p>
      </footer>
      
    </div>
  );
}

export default Login;