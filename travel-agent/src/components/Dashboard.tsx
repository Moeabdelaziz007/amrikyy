import React from 'react';
import { motion } from 'framer-motion';
import {
  Plane,
  Hotel,
  Car,
  MapPin,
  MessageCircle,
  TrendingUp,
  Clock,
  Star,
  Users,
  Globe,
  Home,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const travelServices = [
    {
      name: 'Booking.com',
      icon: Hotel,
      color: 'bg-blue-500',
      description: 'Hotels & Accommodations',
      features: ['2M+ properties', 'Best price guarantee', '24/7 support'],
    },
    {
      name: 'Expedia',
      icon: Plane,
      color: 'bg-green-500',
      description: 'Flights & Packages',
      features: ['Flight deals', 'Bundle savings', 'Rewards program'],
    },
    {
      name: 'Airbnb',
      icon: Home,
      color: 'bg-pink-500',
      description: 'Unique Stays',
      features: ['Unique homes', 'Experiences', 'Local hosts'],
    },
    {
      name: 'Trip.com',
      icon: Globe,
      color: 'bg-purple-500',
      description: 'Global Travel',
      features: ['Worldwide coverage', 'Multi-language', 'Local expertise'],
    },
    {
      name: 'Orbitz',
      icon: MapPin,
      color: 'bg-orange-500',
      description: 'Travel Packages',
      features: ['Package deals', 'Car rentals', 'Activities'],
    },
    {
      name: 'Momondo',
      icon: TrendingUp,
      color: 'bg-red-500',
      description: 'Price Comparison',
      features: ['Best prices', 'Price alerts', 'Deal finder'],
    },
  ];

  const quickStats = [
    {
      label: 'Active Bookings',
      value: '12',
      icon: Clock,
      color: 'text-blue-600',
    },
    { label: 'Saved Trips', value: '8', icon: Star, color: 'text-yellow-600' },
    {
      label: 'Travel Partners',
      value: '6',
      icon: Users,
      color: 'text-green-600',
    },
    {
      label: 'Countries Visited',
      value: '15',
      icon: Globe,
      color: 'text-purple-600',
    },
  ];

  const recentActivities = [
    { action: 'Booked flight to Paris', time: '2 hours ago', type: 'flight' },
    { action: 'Saved hotel in Tokyo', time: '1 day ago', type: 'hotel' },
    {
      action: 'AI suggested itinerary for Rome',
      time: '2 days ago',
      type: 'ai',
    },
    { action: 'Rented car in Barcelona', time: '3 days ago', type: 'car' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, Traveler! ✈️</h1>
        <p className="text-blue-100 text-lg">
          Your AI travel assistant is ready to help you plan your next adventure
        </p>
        <div className="mt-6 flex space-x-4">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Start Planning
          </button>
          <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Chat with AI
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Travel Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Integrated Travel Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`${service.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{service.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="text-sm text-gray-600 flex items-center"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-4 bg-gray-50 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Explore {service.name}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Activities
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`p-2 rounded-lg ${
                  activity.type === 'flight'
                    ? 'bg-blue-100'
                    : activity.type === 'hotel'
                      ? 'bg-green-100'
                      : activity.type === 'ai'
                        ? 'bg-purple-100'
                        : 'bg-orange-100'
                }`}
              >
                {activity.type === 'flight' && (
                  <Plane className="h-4 w-4 text-blue-600" />
                )}
                {activity.type === 'hotel' && (
                  <Hotel className="h-4 w-4 text-green-600" />
                )}
                {activity.type === 'ai' && (
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                )}
                {activity.type === 'car' && (
                  <Car className="h-4 w-4 text-orange-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
