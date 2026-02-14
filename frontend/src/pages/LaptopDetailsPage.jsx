import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { laptopService } from '../services/laptopService';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Cpu, HardDrive, Monitor, Weight, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const LaptopDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchLaptop();
  }, [id]);

  const fetchLaptop = async () => {
    try {
      const data = await laptopService.getById(id);
      setLaptop(data);
    } catch (error) {
      toast.error('Failed to load laptop details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await laptopService.delete(id);
        toast.success('Listing deleted successfully');
        navigate('/my-listings');
      } catch (error) {
        toast.error('Failed to delete listing');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!laptop) return null;

  const images = laptop.images && laptop.images.length > 0 
    ? laptop.images.map(img => `http://localhost:8000/${img}`)
    : ['https://via.placeholder.com/600x400?text=No+Image'];

  const isOwner = user && user.id === laptop.owner_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="card">
            <img
              src={images[currentImageIndex]}
              alt={laptop.title}
              className="w-full h-96 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
              }}
            />
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${laptop.title} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer ${
                      index === currentImageIndex ? 'ring-2 ring-primary-600' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{laptop.title}</h1>
              {laptop.condition && (
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                  {laptop.condition}
                </span>
              )}
            </div>

            <p className="text-4xl font-bold text-primary-600 mb-6">
              ${laptop.price.toLocaleString()}
            </p>

            {/* Specifications */}
            <div className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Specifications</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {laptop.company && (
                  <div className="flex items-start space-x-2">
                    <Monitor className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Brand</p>
                      <p className="font-medium">{laptop.company}</p>
                    </div>
                  </div>
                )}

                {laptop.cpu && (
                  <div className="flex items-start space-x-2">
                    <Cpu className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Processor</p>
                      <p className="font-medium">{laptop.cpu}</p>
                    </div>
                  </div>
                )}

                {laptop.ram && (
                  <div className="flex items-start space-x-2">
                    <HardDrive className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">RAM</p>
                      <p className="font-medium">{laptop.ram}</p>
                    </div>
                  </div>
                )}

                {laptop.memory && (
                  <div className="flex items-start space-x-2">
                    <HardDrive className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Storage</p>
                      <p className="font-medium">{laptop.memory}</p>
                    </div>
                  </div>
                )}

                {laptop.gpu && (
                  <div className="flex items-start space-x-2">
                    <Monitor className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Graphics</p>
                      <p className="font-medium">{laptop.gpu}</p>
                    </div>
                  </div>
                )}

                {laptop.screen_resolution && (
                  <div className="flex items-start space-x-2">
                    <Monitor className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Display</p>
                      <p className="font-medium">{laptop.screen_resolution}</p>
                    </div>
                  </div>
                )}

                {laptop.weight && (
                  <div className="flex items-start space-x-2">
                    <Weight className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">{laptop.weight}</p>
                    </div>
                  </div>
                )}

                {laptop.os && (
                  <div className="flex items-start space-x-2">
                    <Monitor className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Operating System</p>
                      <p className="font-medium">{laptop.os}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {laptop.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{laptop.description}</p>
              </div>
            )}

            {/* Seller Info */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Seller Information</h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Seller:</span> {laptop.owner.username}
                </p>
                {laptop.contact_info && (
                  <p className="text-gray-700">
                    <span className="font-medium">Contact:</span> {laptop.contact_info}
                  </p>
                )}
                {laptop.location && (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span>{laptop.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Posted on {new Date(laptop.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              {isOwner ? (
                <>
                  <button
                    onClick={() => navigate(`/edit-listing/${laptop.id}`)}
                    className="btn btn-primary flex-1"
                  >
                    Edit Listing
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn bg-red-600 text-white hover:bg-red-700 flex-1"
                  >
                    Delete Listing
                  </button>
                </>
              ) : (
                <button className="btn btn-primary w-full">
                  Contact Seller
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopDetailsPage;
