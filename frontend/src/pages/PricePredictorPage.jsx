import React, { useState } from 'react';
import { mlService } from '../services/laptopService';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TrendingUp, DollarSign } from 'lucide-react';

const PricePredictorPage = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await mlService.predictPrice({
        company: data.company,
        type_name: data.type_name,
        inches: parseFloat(data.inches),
        screen_resolution: data.screen_resolution,
        cpu: data.cpu,
        ram: data.ram,
        memory: data.memory,
        gpu: data.gpu,
        os: data.os,
        weight: data.weight,
      });
      setPrediction(result);
      toast.success('Price predicted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to predict price');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-64 h-64 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl mb-6 shadow-2xl relative">
          <TrendingUp className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-5xl font-extrabold mb-4 relative">
          <span className="gradient-text">AI Price Predictor</span>
        </h1>
        <p className="text-xl text-gray-700 relative">
          Get an instant AI-powered price estimate for your laptop 🤖
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Enter Laptop Specifications
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  </select>
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    {...register('type_name', { required: 'Type is required' })}
                    className="input"
                  >
                    <option value="">Select Type</option>
                    <option value="Ultrabook">Ultrabook</option>
                    <option value="Notebook">Notebook</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Workstation">Workstation</option>
                    <option value="2 in 1 Convertible">2 in 1</option>
                  </select>
                  {errors.type_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.type_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Screen Size (inches) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('inches', { required: 'Screen size is required' })}
                    className="input"
                    placeholder="13.3"
                  />
                  {errors.inches && (
                    <p className="text-red-500 text-sm mt-1">{errors.inches.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Screen Resolution *
                  </label>
                  <input
                    type="text"
                    {...register('screen_resolution', { required: 'Resolution is required' })}
                    className="input"
                    placeholder="1920x1080 Full HD"
                  />
                  {errors.screen_resolution && (
                    <p className="text-red-500 text-sm mt-1">{errors.screen_resolution.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Processor (CPU) *
                  </label>
                  <input
                    type="text"
                    {...register('cpu', { required: 'CPU is required' })}
                    className="input"
                    placeholder="Intel Core i5 2.3GHz"
                  />
                  {errors.cpu && (
                    <p className="text-red-500 text-sm mt-1">{errors.cpu.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RAM *
                  </label>
                  <input
                    type="text"
                    {...register('ram', { required: 'RAM is required' })}
                    className="input"
                    placeholder="8GB"
                  />
                  {errors.ram && (
                    <p className="text-red-500 text-sm mt-1">{errors.ram.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage *
                  </label>
                  <input
                    type="text"
                    {...register('memory', { required: 'Storage is required' })}
                    className="input"
                    placeholder="256GB SSD"
                  />
                  {errors.memory && (
                    <p className="text-red-500 text-sm mt-1">{errors.memory.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graphics (GPU) *
                  </label>
                  <input
                    type="text"
                    {...register('gpu', { required: 'GPU is required' })}
                    className="input"
                    placeholder="Intel Iris Plus Graphics"
                  />
                  {errors.gpu && (
                    <p className="text-red-500 text-sm mt-1">{errors.gpu.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operating System *
                  </label>
                  <input
                    type="text"
                    {...register('os', { required: 'OS is required' })}
                    className="input"
                    placeholder="Windows 11"
                  />
                  {errors.os && (
                    <p className="text-red-500 text-sm mt-1">{errors.os.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight *
                  </label>
                  <input
                    type="text"
                    {...register('weight', { required: 'Weight is required' })}
                    className="input"
                    placeholder="1.5kg"
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Predicting...' : 'Predict Price'}
              </button>
            </form>
          </div>
        </div>

        {/* Prediction Result */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Price Estimate
            </h2>

            {prediction ? (
              <div className="space-y-4">
                <div className="text-center p-6 bg-primary-50 rounded-lg">
                  <DollarSign className="h-12 w-12 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Estimated Price</p>
                  <p className="text-4xl font-bold text-primary-600">
                    ${prediction.predicted_price.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Min Price:</span>
                    <span className="font-semibold text-gray-900">
                      ${prediction.min_price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Max Price:</span>
                    <span className="font-semibold text-gray-900">
                      ${prediction.max_price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  <p className="font-medium text-blue-900 mb-1">💡 Pricing Tip:</p>
                  <p>
                    This prediction is based on similar laptops in the market. 
                    Consider condition and market demand when setting your price.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Fill in the specifications to get a price estimate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePredictorPage;
