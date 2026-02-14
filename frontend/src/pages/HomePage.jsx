import React, { useState, useEffect } from 'react';
import { laptopService } from '../services/laptopService';
import LaptopCard from '../components/LaptopCard';
import SearchFilter from '../components/SearchFilter';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadLaptops();
  }, [filters]);

  const loadLaptops = async () => {
    setLoading(true);
    try {
      const data = await laptopService.getAll(filters);
      setLaptops(data);
    } catch (error) {
      toast.error('Failed to load laptops');
    }
    setLoading(false);
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm });
  };

  const handleFilter = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        <h1 className="text-6xl font-extrabold mb-6 relative">
          <span className="gradient-text">Find Your Perfect Laptop</span>
        </h1>
        <p className="text-2xl text-gray-700 mb-8 relative">
          Buy and sell second-hand laptops with confidence 💻
        </p>
        <div className="flex justify-center gap-4 relative">
          <div className="feature-card inline-flex items-center gap-2 px-6 py-3">
            <span className="text-3xl">🚀</span>
            <span className="font-semibold">Fast Deals</span>
          </div>
          <div className="feature-card inline-flex items-center gap-2 px-6 py-3">
            <span className="text-3xl">🔒</span>
            <span className="font-semibold">Secure</span>
          </div>
          <div className="feature-card inline-flex items-center gap-2 px-6 py-3">
            <span className="text-3xl">💰</span>
            <span className="font-semibold">Best Prices</span>
          </div>
        </div>
      </div>

      <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : laptops.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No laptops found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {laptops.map(laptop => (
            <LaptopCard key={laptop.id} laptop={laptop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
