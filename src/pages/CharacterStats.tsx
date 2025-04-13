
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Loader2, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminLayout from '@/components/admin/AdminLayout';
import CharacterStatsTable from '@/components/admin/character-stats/CharacterStatsTable';
import CharacterStatsDialog from '@/components/admin/character-stats/CharacterStatsDialog';
import { useCharacterStats } from '@/hooks/useCharacterStats';

const CharacterStats: React.FC = () => {
  const navigate = useNavigate();
  const {
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
    handleSave
  } = useCharacterStats();

  return (
    <AdminLayout>
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
              <CharacterStatsTable
                characters={characters}
                onEdit={handleEdit}
              />
              
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
      <CharacterStatsDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        selectedCharacter={selectedCharacter}
        editValues={editValues}
        onInputChange={handleInputChange}
        onSave={handleSave}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default CharacterStats;
