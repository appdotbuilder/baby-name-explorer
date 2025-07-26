
import { useState, useEffect, useCallback } from 'react';
import { BabyNameExplorer } from '@/components/BabyNameExplorer';
import { ParentingQuotes } from '@/components/ParentingQuotes';
import { Navigation } from '@/components/Navigation';
import { WelcomeHero } from '@/components/WelcomeHero';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { trpc } from '@/utils/trpc';
import { Toaster } from 'sonner';
import type { BabyName, ParentingQuote, Language, Gender } from '../../server/src/schema';

type ViewMode = 'welcome' | 'explore' | 'quotes' | 'config';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('welcome');
  const [babyNames, setBabyNames] = useState<BabyName[]>([]);
  const [parentingQuotes, setParentingQuotes] = useState<ParentingQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // App configuration state
  const [showAds, setShowAds] = useState(true);
  const [quotesFrequency, setQuotesFrequency] = useState(10); // Show quotes after viewing X names
  const [namesViewed, setNamesViewed] = useState(0);

  const loadBabyNames = useCallback(async () => {
    try {
      setIsLoading(true);
      const query = {
        language: selectedLanguage,
        gender: selectedGender === 'all' ? undefined : selectedGender,
        search: searchQuery || undefined,
        limit: 50,
        offset: 0
      };
      
      const result = await trpc.getBabyNames.query(query);
      setBabyNames(result);
    } catch (error) {
      console.error('Failed to load baby names:', error);
      // For demo purposes, show some sample data when API is not available
      setBabyNames([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLanguage, selectedGender, searchQuery]);

  const loadParentingQuotes = useCallback(async () => {
    try {
      const result = await trpc.getParentingQuotes.query({
        language: selectedLanguage,
        is_active: true,
        limit: 20,
        offset: 0
      });
      setParentingQuotes(result);
    } catch (error) {
      console.error('Failed to load parenting quotes:', error);
      setParentingQuotes([]);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (currentView === 'explore') {
      loadBabyNames();
    } else if (currentView === 'quotes') {
      loadParentingQuotes();
    }
  }, [currentView, loadBabyNames, loadParentingQuotes]);

  // Auto-show quotes based on names viewed
  useEffect(() => {
    if (namesViewed > 0 && namesViewed % quotesFrequency === 0 && currentView === 'explore') {
      setCurrentView('quotes');
    }
  }, [namesViewed, quotesFrequency, currentView]);

  const handleNameView = useCallback(() => {
    setNamesViewed((prev: number) => prev + 1);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleLanguageChange = useCallback((language: Language) => {
    setSelectedLanguage(language);
  }, []);

  const handleGenderChange = useCallback((gender: Gender | 'all') => {
    setSelectedGender(gender);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Navigation */}
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Ad Placeholder */}
        {showAds && <AdPlaceholder position="top" />}

        {currentView === 'welcome' && (
          <WelcomeHero onStartExploring={() => setCurrentView('explore')} />
        )}

        {currentView === 'explore' && (
          <BabyNameExplorer
            names={babyNames}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            selectedGender={selectedGender}
            onGenderChange={handleGenderChange}
            onNameView={handleNameView}
            onShowQuotes={() => setCurrentView('quotes')}
          />
        )}

        {currentView === 'quotes' && (
          <ParentingQuotes
            quotes={parentingQuotes}
            isLoading={isLoading}
            onBackToNames={() => setCurrentView('explore')}
          />
        )}

        {currentView === 'config' && (
          <ConfigurationPanel
            showAds={showAds}
            onShowAdsChange={setShowAds}
            quotesFrequency={quotesFrequency}
            onQuotesFrequencyChange={setQuotesFrequency}
            onResetViews={() => setNamesViewed(0)}
          />
        )}

        {/* Bottom Ad Placeholder */}
        {showAds && currentView !== 'welcome' && (
          <AdPlaceholder position="bottom" />
        )}
      </main>

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
