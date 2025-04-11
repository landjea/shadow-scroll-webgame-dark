
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Edit, Loader2, Search, User } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CharacterStat {
  id: string;
  user_id: string;
  hero_name: string;
  energy: number;
  health: number;
  speed: number;
  strength: number;
  intelligence: number;
  charisma: number;
  missions_completed: number;
  level: number;
  experience: number;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

const CharacterStats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<CharacterStat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterStat | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Partial<CharacterStat>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    loadCharacters();
  }, [currentPage, searchQuery]);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      
      // Count total characters for pagination
      const { count, error: countError } = await supabase
        .from('character_stats')
        .select('*', { count: 'exact', head: true })
        .ilike('hero_name', `%${searchQuery}%`);
      
      if (countError) throw countError;
      
      if (count !== null) {
        setTotalPages(Math.ceil(count / itemsPerPage));
      }

      // Get characters for current page
      let query = supabase
        .from('character_stats')
        .select('*')
        .ilike('hero_name', `%${searchQuery}%`)
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Get user emails for each character
        const charactersWithEmail = await Promise.all(
          data.map(async (character) => {
            try {
              const { data: emailData } = await supabase.rpc('get_user_email', { user_id: character.user_id });
              return { ...character, user_email: emailData || 'Unknown' };
            } catch (err) {
              console.error('Error fetching email:', err);
              return { ...character, user_email: 'Unknown' };
            }
          })
        );
        
        setCharacters(charactersWithEmail);
      }
    } catch (error) {
      console.error('Error loading characters:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load character stats'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (character: CharacterStat) => {
    setSelectedCharacter(character);
    setEditValues({
      hero_name: character.hero_name,
      strength: character.strength,
      speed: character.speed,
      intelligence: character.intelligence,
      charisma: character.charisma,
      health: character.health,
      energy: character.energy,
      level: character.level,
      experience: character.experience
    });
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Convert numeric fields
    if (name !== 'hero_name') {
      parsedValue = parseInt(value) || 0;
    }
    
    setEditValues(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSave = async () => {
    if (!selectedCharacter) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('character_stats')
        .update({
          ...editValues,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCharacter.id);
      
      if (error) throw error;
      
      toast({
        title: 'Character updated',
        description: `Successfully updated ${editValues.hero_name}`
      });
      
      setIsEditing(false);
      loadCharacters();
    } catch (error) {
      console.error('Error updating character:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update character'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4"
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Button>
        
        <h1 className="text-2xl font-bold text-purple-800">Character Management</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Character Stats</CardTitle>
          <CardDescription>
            View and manage all character stats in the game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by hero name..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : characters.length === 0 ? (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No characters found</AlertTitle>
              <AlertDescription>
                No character stats matching your search criteria were found.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hero Name</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Health</TableHead>
                      <TableHead>Energy</TableHead>
                      <TableHead>Strength</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {characters.map((character) => (
                      <TableRow key={character.id}>
                        <TableCell className="font-medium">{character.hero_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{character.user_email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{character.health}</TableCell>
                        <TableCell>{character.energy}</TableCell>
                        <TableCell>{character.strength}</TableCell>
                        <TableCell>{character.level}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(character)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => Math.abs(page - currentPage) < 2 || page === 1 || page === totalPages)
                      .map((page, i, array) => (
                        <React.Fragment key={page}>
                          {i > 0 && array[i - 1] !== page - 1 && (
                            <PaginationItem>
                              <span className="flex h-9 w-9 items-center justify-center">...</span>
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Character Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Character</DialogTitle>
            <DialogDescription>
              Update the stats and attributes for this character.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hero_name" className="text-right">Hero Name</Label>
              <Input
                id="hero_name"
                name="hero_name"
                value={editValues.hero_name || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="strength" className="text-right">Strength</Label>
                <Input
                  id="strength"
                  name="strength"
                  type="number"
                  value={editValues.strength || 0}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="speed" className="text-right">Speed</Label>
                <Input
                  id="speed"
                  name="speed"
                  type="number"
                  value={editValues.speed || 0}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="intelligence" className="text-right">Intelligence</Label>
                <Input
                  id="intelligence"
                  name="intelligence"
                  type="number"
                  value={editValues.intelligence || 0}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="charisma" className="text-right">Charisma</Label>
                <Input
                  id="charisma"
                  name="charisma"
                  type="number"
                  value={editValues.charisma || 0}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="health" className="text-right">Health</Label>
                <Input
                  id="health"
                  name="health"
                  type="number"
                  value={editValues.health || 0}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="energy" className="text-right">Energy</Label>
                <Input
                  id="energy"
                  name="energy"
                  type="number"
                  value={editValues.energy || 0}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="level" className="text-right">Level</Label>
                <Input
                  id="level"
                  name="level"
                  type="number"
                  value={editValues.level || 0}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="experience" className="text-right">Experience</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  value={editValues.experience || 0}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CharacterStats;
