
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RequireAuth } from "./components/RequireAuth";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import CharacterStats from "./pages/CharacterStats";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Admin pages
import InventoryAdmin from "./pages/admin/Inventory";
import CharactersAdmin from "./pages/admin/Characters";
import MissionsAdmin from "./pages/admin/Missions";
import StoriesAdmin from "./pages/admin/Stories";
import LocationsAdmin from "./pages/admin/Locations";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/auth" element={<Auth />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
