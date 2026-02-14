import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';

const LaptopCard = ({ laptop }) => {
  const imageUrl = laptop.images && laptop.images.length > 0 
    ? `http://localhost:8000/${laptop.images[0]}`
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <Link to={`/laptop/${laptop.id}`} className="group block">
      <div className="card h-full hover:scale-105 transform transition-all duration-300">
        <div className="relative overflow-hidden rounded-xl mb-4">
          <img 
            src={imageUrl} 
            alt={laptop.title}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
          {laptop.condition && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              {laptop.condition}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {laptop.title}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-extrabold gradient-text">
            ${laptop.price.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{laptop.company}</span>
        </div>
      
        <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
          {laptop.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{laptop.location}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span className="font-medium">{new Date(laptop.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LaptopCard;
