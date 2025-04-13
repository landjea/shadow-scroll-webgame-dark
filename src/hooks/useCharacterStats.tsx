
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface EditValues {
  hero_name?: string;
  energy?: number;
  health?: number;
  speed?: number;
  strength?: number;
  intelligence?: number;
  charisma?: number;
  level?: number;
  experience?: number;
}

export const useCharacterStats = () => {
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<CharacterStat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterStat | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<EditValues>({});
  const { toast } = useToast();
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

  return {
    loading,
    characters,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedCharacter,
    isEditing,
    setIsEditing,
    editValues,
    handleEdit,
    handleInputChange,
    handleSave,
    loadCharacters
  };
};
