
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeSelector } from '@/components/ui/theme-selector';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-end mb-4">
          <ThemeSelector />
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
