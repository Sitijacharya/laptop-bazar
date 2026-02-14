import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { laptopService } from '../services/laptopService';
import LaptopCard from '../components/LaptopCard';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

const MyListingsPage = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const data = await laptopService.getMyListings();
      setLaptops(data);
    } catch (error) {
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <Link to="/create-listing" className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create New Listing</span>
        </Link>
      </div>

      {laptops.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-xl text-gray-600 mb-4">You don't have any listings yet</p>
          <Link to="/create-listing" className="btn btn-primary">
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {laptops.map((laptop) => (
            <LaptopCard key={laptop.id} laptop={laptop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
