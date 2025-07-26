
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Baby, Heart, Sparkles, Globe } from 'lucide-react';

interface WelcomeHeroProps {
  onStartExploring: () => void;
}

export function WelcomeHero({ onStartExploring }: WelcomeHeroProps) {
  return (
    <div className="text-center py-12">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Baby className="h-16 w-16 text-purple-600" />
          <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
          Find the Perfect Name 💕
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover beautiful baby names from across India with meanings, origins, and cultural significance. 
          Let us help you find that special name for your little miracle! ✨
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            onClick={onStartExploring}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
          >
            Start Exploring Names 🚀
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Globe className="h-4 w-4" />
            Available in 10 Indian languages
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="border-purple-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Baby className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Thousands of Names</h3>
            <p className="text-gray-600 text-sm">
              Browse through a comprehensive collection of traditional and modern baby names
            </p>
          </CardContent>
        </Card>

        <Card className="border-pink-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 text-pink-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Meaningful Origins</h3>
            <p className="text-gray-600 text-sm">
              Learn about the beautiful meanings and cultural significance behind each name
            </p>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Parenting Wisdom</h3>
            <p className="text-gray-600 text-sm">
              Discover inspiring quotes and wisdom to accompany your parenting journey
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">1000+</div>
          <div className="text-sm text-gray-500">Baby Names</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600">10</div>
          <div className="text-sm text-gray-500">Languages</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">500+</div>
          <div className="text-sm text-gray-500">Quotes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">100%</div>
          <div className="text-sm text-gray-500">Free</div>
        </div>
      </div>
    </div>
  );
}
