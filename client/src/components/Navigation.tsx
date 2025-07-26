
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Baby, Heart, Settings, Home } from 'lucide-react';
import type { Language } from '../../../server/src/schema';

type ViewMode = 'welcome' | 'explore' | 'quotes' | 'config';

interface NavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languageLabels: Record<Language, string> = {
  english: 'English',
  hindi: 'हिंदी',
  tamil: 'தமிழ்',
  telugu: 'తెలుగు',
  bengali: 'বাংলা',
  marathi: 'मराठी',
  gujarati: 'ગુજરાતી',
  kannada: 'ಕನ್ನಡ',
  malayalam: 'മലയാളം',
  punjabi: 'ਪੰਜਾਬੀ'
};

export function Navigation({ currentView, onViewChange, selectedLanguage, onLanguageChange }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-purple-100 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Baby className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                BabyNames 💕
              </h1>
              <p className="text-xs text-gray-500">Find the perfect name</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentView === 'welcome' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('welcome')}
              className="hidden sm:flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            
            <Button
              variant={currentView === 'explore' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('explore')}
              className="flex items-center gap-1"
            >
              <Baby className="h-4 w-4" />
              Explore
              <Badge variant="secondary" className="ml-1 text-xs">
                New
              </Badge>
            </Button>

            <Button
              variant={currentView === 'quotes' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('quotes')}
              className="flex items-center gap-1"
            >
              <Heart className="h-4 w-4" />
              Quotes
            </Button>

            <Button
              variant={currentView === 'config' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('config')}
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>

          {/* Language Selector */}
          <Select value={selectedLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-28 sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languageLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </nav>
  );
}
