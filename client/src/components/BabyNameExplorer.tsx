
import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Heart, Share2, BookOpen, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { BabyName, Gender } from '../../../server/src/schema';

interface BabyNameExplorerProps {
  names: BabyName[];
  isLoading: boolean;
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedGender: Gender | 'all';
  onGenderChange: (gender: Gender | 'all') => void;
  onNameView: () => void;
  onShowQuotes: () => void;
}

const genderEmojis = {
  boy: '👦',
  girl: '👧',
  unisex: '👶',
  all: '🌟'
};

const genderColors = {
  boy: 'bg-blue-50 border-blue-200 text-blue-800',
  girl: 'bg-pink-50 border-pink-200 text-pink-800',
  unisex: 'bg-purple-50 border-purple-200 text-purple-800'
};

// Demo data for when API is not available
const demoNames: BabyName[] = [
  {
    id: 1,
    name: 'Aarav',
    meaning: 'Peaceful, Calm',
    origin: 'Sanskrit',
    gender: 'boy' as Gender,
    language: 'english' as const,
    pronunciation: 'AA-rav',
    popularity_rank: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    name: 'Saanvi',
    meaning: 'Knowledge, Goddess Lakshmi',
    origin: 'Sanskrit',
    gender: 'girl' as Gender,
    language: 'english' as const,
    pronunciation: 'SAAN-vi',
    popularity_rank: 2,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    name: 'Arjun',
    meaning: 'Bright, Shining, White',
    origin: 'Sanskrit',
    gender: 'boy' as Gender,
    language: 'english' as const,
    pronunciation: 'AR-jun',
    popularity_rank: 5,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 4,
    name: 'Diya',
    meaning: 'Lamp, Light',
    origin: 'Sanskrit',
    gender: 'girl' as Gender,
    language: 'english' as const,
    pronunciation: 'DEE-ya',
    popularity_rank: 3,
    created_at: new Date(),
    updated_at: new Date()
  }
];

export function BabyNameExplorer({ 
  names, 
  isLoading, 
  searchQuery, 
  onSearch, 
  selectedGender, 
  onGenderChange, 
  onNameView,
  onShowQuotes 
}: BabyNameExplorerProps) {
  const [favoriteNames, setFavoriteNames] = useState<Set<number>>(new Set());
  
  // Use demo data if API returns empty array
  const displayNames = names.length > 0 ? names : demoNames;
  
  // Filter names based on selected gender
  const filteredNames = displayNames.filter((name: BabyName) => 
    selectedGender === 'all' || name.gender === selectedGender
  ).filter((name: BabyName) => 
    !searchQuery || 
    name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    name.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFavorite = useCallback((nameId: number) => {
    setFavoriteNames((prev: Set<number>) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(nameId)) {
        newFavorites.delete(nameId);
        toast.success('Removed from favorites ❤️');
      } else {
        newFavorites.add(nameId);
        toast.success('Added to favorites! 💕');
      }
      return newFavorites;
    });
  }, []);

  const handleShare = useCallback(async (name: BabyName) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Baby Name: ${name.name}`,
          text: `${name.name} means "${name.meaning}" - Origin: ${name.origin}`,
          url: window.location.href
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(
          `${name.name} means "${name.meaning}" - Origin: ${name.origin}`
        );
        toast.success('Name details copied to clipboard! 📋');
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share name');
    }
  }, []);

  const handleNameClick = useCallback(() => {
    onNameView();
    // Could expand name details or show more info
  }, [onNameView]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Discover Beautiful Names ✨
        </h2>
        <p className="text-gray-600">
          Find the perfect name with meaning and origin
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search names or meanings..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
            className="pl-10 border-purple-200 focus:border-purple-400"
          />
        </div>

        <Select value={selectedGender} onValueChange={onGenderChange}>
          <SelectTrigger className="w-48 border-purple-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌟 All Names</SelectItem>
            <SelectItem value="boy">👦 Boy Names</SelectItem>
            <SelectItem value="girl">👧 Girl Names</SelectItem>
            <SelectItem value="unisex">👶 Unisex Names</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={onShowQuotes}
          className="border-purple-200 hover:bg-purple-50"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Get Inspired
        </Button>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {isLoading ? 'Loading...' : `Found ${filteredNames.length} names`}
        </p>
        {favoriteNames.size > 0 && (
          <Badge variant="secondary" className="bg-pink-100 text-pink-700">
            💕 {favoriteNames.size} favorites
          </Badge>
        )}
      </div>

      {/* Names Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-32 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-24" />
            </Card>
          ))}
        </div>
      ) : filteredNames.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No names found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" onClick={() => onSearch('')}>
            Clear Search
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNames.map((name: BabyName) => (
            <Card 
              key={name.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-purple-100"
              onClick={handleNameClick}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl group-hover:text-purple-600 transition-colors">
                      {name.name}
                      <span className="text-lg">
                        {genderEmojis[name.gender]}
                      </span>
                    </CardTitle>
                    {name.pronunciation && (
                      <p className="text-sm text-gray-500 mt-1">
                        🗣️ {name.pronunciation}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleFavorite(name.id);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favoriteNames.has(name.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleShare(name);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Share2 className="h-4 w-4 text-gray-400 hover:text-blue-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-3 font-medium">
                  ✨ {name.meaning}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline"
                    className={`${genderColors[name.gender]} border`}
                  >
                    {name.origin}
                  </Badge>
                  
                  {name.popularity_rank && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      #{name.popularity_rank}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredNames.length > 0 && (
        <div className="text-center pt-6">
          <Button 
            variant="outline" 
            size="lg"
            className="border-purple-200 hover:bg-purple-50"
          >
            Load More Names 📚
          </Button>
        </div>
      )}
    </div>
  );
}
