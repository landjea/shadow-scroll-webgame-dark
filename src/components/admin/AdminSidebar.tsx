
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Award, 
  BookOpen, 
  Map, 
  Zap, 
  Shield, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar: React.FC = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={18} />, 
      path: '/admin' 
    },
    { 
      label: 'Characters', 
      icon: <Users size={18} />, 
      path: '/admin/characters' 
    },
    { 
      label: 'Inventory', 
      icon: <Package size={18} />, 
      path: '/admin/inventory' 
    },
    { 
      label: 'Missions', 
      icon: <Award size={18} />, 
      path: '/admin/missions' 
    },
    { 
      label: 'Stories', 
      icon: <BookOpen size={18} />, 
      path: '/admin/stories' 
    },
    { 
      label: 'Map Locations', 
      icon: <Map size={18} />, 
      path: '/admin/map' 
    },
    { 
      label: 'Abilities', 
      icon: <Zap size={18} />, 
      path: '/admin/abilities' 
    },
    { 
      label: 'Roles', 
      icon: <Shield size={18} />, 
      path: '/admin/roles' 
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col border-r">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-purple-800">Admin Panel</h1>
        <p className="text-sm text-gray-600">Superhero Game</p>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                end={item.path === '/admin'}
              >
                <span className="text-purple-600">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t mt-auto">
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <LogOut size={18} className="text-purple-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
