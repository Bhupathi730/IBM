import React from 'react';
import { Shield, Bell, Search, Settings } from 'lucide-react';

interface HeaderProps {
  unacknowledgedAlerts: number;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ unacknowledgedAlerts, onSearchChange }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">CyberGuard</h1>
            <span className="text-sm text-slate-400 bg-slate-800 px-2 py-1 rounded">
              Risk Assessment
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search entities..."
              className="bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none w-64"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Bell className="h-6 w-6 text-slate-400 hover:text-white cursor-pointer transition-colors" />
            {unacknowledgedAlerts > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unacknowledgedAlerts}
              </span>
            )}
          </div>
          
          <Settings className="h-6 w-6 text-slate-400 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Header;