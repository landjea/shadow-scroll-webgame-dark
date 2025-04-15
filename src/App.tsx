
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

<<<<<<< HEAD
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import RequireAuth from '@/components/RequireAuth';
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
=======
// Admin pages
import InventoryAdmin from "./pages/admin/Inventory";
import CharactersAdmin from "./pages/admin/Characters";
import MissionsAdmin from "./pages/admin/Missions";
import StoriesAdmin from "./pages/admin/Stories";
import LocationsAdmin from "./pages/admin/Locations";
>>>>>>> parent of c70e26d (feat: Add roles and abilities admin pages)

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
<<<<<<< HEAD
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
=======
              <Route path="/" element={
                <RequireAuth>
                  <Index />
                </RequireAuth>
              } />
              <Route path="/admin" element={
                <RequireAuth adminOnly>
                  <Admin />
                </RequireAuth>
              } />
              <Route path="/character-stats" element={
                <RequireAuth adminOnly>
                  <CharacterStats />
                </RequireAuth>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/inventory" element={
                <RequireAuth adminOnly>
                  <InventoryAdmin />
                </RequireAuth>
              } />
              <Route path="/admin/characters" element={
                <RequireAuth adminOnly>
                  <CharactersAdmin />
                </RequireAuth>
              } />
              <Route path="/admin/missions" element={
                <RequireAuth adminOnly>
                  <MissionsAdmin />
                </RequireAuth>
              } />
              <Route path="/admin/stories" element={
                <RequireAuth adminOnly>
                  <StoriesAdmin />
                </RequireAuth>
              } />
              <Route path="/admin/map" element={
                <RequireAuth adminOnly>
                  <LocationsAdmin />
                </RequireAuth>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
>>>>>>> parent of c70e26d (feat: Add roles and abilities admin pages)
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
