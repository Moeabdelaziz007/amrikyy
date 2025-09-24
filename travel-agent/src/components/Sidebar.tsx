import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Plane,
  Hotel,
  Car,
  MapPin,
  MessageCircle,
  User,
  TrendingUp,
  Calendar,
  Heart,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/flights', icon: Plane, label: 'Flights' },
    { path: '/hotels', icon: Hotel, label: 'Hotels' },
    { path: '/cars', icon: Car, label: 'Car Rental' },
    { path: '/planner', icon: MapPin, label: 'Travel Planner' },
    { path: '/ai-chat', icon: MessageCircle, label: 'AI Assistant' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full text-left">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Deals & Offers</span>
            </button>
            <button className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full text-left">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">My Trips</span>
            </button>
            <button className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full text-left">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Saved</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
