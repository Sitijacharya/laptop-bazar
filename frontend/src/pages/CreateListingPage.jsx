import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { laptopService } from '../services/laptopService';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Create laptop listing
      const laptop = await laptopService.create(data);
      
      // Upload images if any
      if (images.length > 0) {
        await laptopService.uploadImages(laptop.id, images);
      }
      
      toast.success('Listing created successfully!');
      navigate(`/laptop/${laptop.id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Laptop Listing</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="input"
                placeholder="e.g., MacBook Pro 13 inch 2020"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <select
                  {...register('company', { required: 'Company is required' })}
                  className="input"
                >
                  <option value="">Select Brand</option>
                  <option value="Apple">Apple</option>
                  <option value="Dell">Dell</option>
                  <option value="HP">HP</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="Asus">Asus</option>
                  <option value="Acer">Acer</option>
                  <option value="MSI">MSI</option>
                  <option value="Other">Other</option>
                </select>
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select {...register('type_name')} className="input">
                  <option value="">Select Type</option>
                  <option value="Ultrabook">Ultrabook</option>
                  <option value="Notebook">Notebook</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Workstation">Workstation</option>
                  <option value="2 in 1">2 in 1</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: 'Price is required', min: 0 })}
                  className="input"
                  placeholder="999.99"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select {...register('condition')} className="input">
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Processor (CPU)
                </label>
                <input
                  type="text"
                  {...register('cpu')}
                  className="input"
                  placeholder="Intel Core i5 2.3GHz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RAM
                </label>
                <input
                  type="text"
                  {...register('ram')}
                  className="input"
                  placeholder="8GB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage
                </label>
                <input
                  type="text"
                  {...register('memory')}
                  className="input"
                  placeholder="256GB SSD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graphics (GPU)
                </label>
                <input
                  type="text"
                  {...register('gpu')}
                  className="input"
                  placeholder="Intel Iris Plus Graphics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Screen Size (inches)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('inches')}
                  className="input"
                  placeholder="13.3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Screen Resolution
                </label>
                <input
                  type="text"
                  {...register('screen_resolution')}
                  className="input"
                  placeholder="1920x1080"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operating System
                </label>
                <input
                  type="text"
                  {...register('os')}
                  className="input"
                  placeholder="Windows 11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="text"
                  {...register('weight')}
                  className="input"
                  placeholder="1.5kg"
                />
              </div>
            </div>
          </div>

          {/* Description and Contact */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Additional Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="input"
                placeholder="Describe the laptop's condition, features, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Information
                </label>
                <input
                  type="text"
                  {...register('contact_info')}
                  className="input"
                  placeholder="Email or phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="input"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="input"
            />
            <p className="text-sm text-gray-500 mt-1">
              You can upload multiple images (max 5MB each)
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
