
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import { RequireAuth } from '@/components/RequireAuth';
import Admin from '@/pages/Admin';
import CharacterStats from '@/pages/CharacterStats';
import Characters from '@/pages/admin/Characters';
import Inventory from '@/pages/admin/Inventory';
import Stories from '@/pages/admin/Stories';
import Missions from '@/pages/admin/Missions';
import Locations from '@/pages/admin/Locations';
import Abilities from '@/pages/admin/Abilities';
import Roles from '@/pages/admin/Roles';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
            <Route path="/character-stats" element={<RequireAuth><CharacterStats /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
            <Route path="/admin/characters" element={<RequireAuth><Characters /></RequireAuth>} />
            <Route path="/admin/inventory" element={<RequireAuth><Inventory /></RequireAuth>} />
            <Route path="/admin/stories" element={<RequireAuth><Stories /></RequireAuth>} />
            <Route path="/admin/missions" element={<RequireAuth><Missions /></RequireAuth>} />
            <Route path="/admin/map" element={<RequireAuth><Locations /></RequireAuth>} />
            <Route path="/admin/abilities" element={<RequireAuth><Abilities /></RequireAuth>} />
            <Route path="/admin/roles" element={<RequireAuth><Roles /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
