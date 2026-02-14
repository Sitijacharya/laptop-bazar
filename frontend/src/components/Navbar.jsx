import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Laptop, User, LogOut, PlusCircle, Home, TrendingUp } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-110">
              <Laptop className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-extrabold gradient-text">Laptop Bazar</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/predict" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <TrendingUp className="h-4 w-4" />
              <span>Price Predictor</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-listings" className="text-gray-700 hover:text-primary-600">
                  My Listings
                </Link>
                <Link to="/create-listing" className="flex items-center space-x-1 btn btn-primary">
                  <PlusCircle className="h-4 w-4" />
                  <span>Sell Laptop</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                    <User className="h-5 w-5" />
                    <span>{user?.username}</span>
                  </Link>
                  <button onClick={logout} className="flex items-center space-x-1 text-gray-700 hover:text-red-600">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
