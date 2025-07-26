
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Share2, Download, RefreshCw, Heart } from 'lucide-react';
import { toast } from 'sonner';
import type { ParentingQuote } from '../../../server/src/schema';

interface ParentingQuotesProps {
  quotes: ParentingQuote[];
  isLoading: boolean;
  onBackToNames: () => void;
}

// Demo quotes for when API is not available
const demoQuotes: ParentingQuote[] = [
  {
    id: 1,
    quote: "The days are long, but the years are short.",
    author: "Gretchen Rubin",
    category: "Time",
    language: 'english' as const,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    quote: "There is no such thing as a perfect parent. So just be a real one.",
    author: "Sue Atkins",
    category: "Authenticity",
    language: 'english' as const,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    quote: "Children are not things to be molded, but people to be unfolded.",
    author: "Jess Lair",
    category: "Growth",
    language: 'english' as const,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 4,
    quote: "The love between a parent and child is forever.",
    author: null,
    category: "Love",
    language: 'english' as const,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

export function ParentingQuotes({ quotes, isLoading, onBackToNames }: ParentingQuotesProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [favoriteQuotes, setFavoriteQuotes] = useState<Set<number>>(new Set());
  
  // Use demo data if API returns empty array
  const displayQuotes = quotes.length > 0 ? quotes : demoQuotes;
  const currentQuote = displayQuotes[currentQuoteIndex];

  const handleNextQuote = useCallback(() => {
    setCurrentQuoteIndex((prev: number) => (prev + 1) % displayQuotes.length);
  }, [displayQuotes.length]);

  const handlePreviousQuote = useCallback(() => {
    setCurrentQuoteIndex((prev: number) => 
      prev === 0 ? displayQuotes.length - 1 : prev - 1
    );
  }, [displayQuotes.length]);

  const handleShare = useCallback(async (quote: ParentingQuote) => {
    try {
      const shareText = `"${quote.quote}"${quote.author ? ` - ${quote.author}` : ''}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Parenting Quote',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Quote copied to clipboard! 📋');
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share quote');
    }
  }, []);

  const handleDownloadImage = useCallback((quote: ParentingQuote) => {
    // Create a canvas to generate quote image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#EC4899');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Quote text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Word wrap for quote
    const words = quote.quote.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach((word: string) => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > canvas.width - 100 && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);

    // Draw quote lines
    const lineHeight = 50;
    const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;
    
    lines.forEach((line: string, index: number) => {
      ctx.fillText(`"${line.trim()}"`, canvas.width / 2, startY + index * lineHeight);
    });

    // Author
    if (quote.author) {
      ctx.font = '24px Arial';
      ctx.fillText(`- ${quote.author}`, canvas.width / 2, startY + lines.length * lineHeight + 40);
    }

    // Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quote-${quote.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Quote image downloaded! 📱');
    });
  }, []);

  const handleFavorite = useCallback((quoteId: number) => {
    setFavoriteQuotes((prev: Set<number>) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(quoteId)) {
        newFavorites.delete(quoteId);
        toast.success('Removed from favorites');
      } else {
        newFavorites.add(quoteId);
        toast.success('Added to favorites! 💕');
      }
      return newFavorites;
    });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card className="p-12">
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBackToNames}
          className="border-purple-200 hover:bg-purple-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Names
        </Button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Parenting Wisdom 💫
          </h2>
          <p className="text-sm text-gray-600">
            Quote {currentQuoteIndex + 1} of {displayQuotes.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {favoriteQuotes.size > 0 && (
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
              💕 {favoriteQuotes.size}
            </Badge>
          )}
        </div>
      </div>

      {/* Quote Card */}
      {currentQuote && (
        <Card className="max-w-2xl mx-auto border-purple-100 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <blockquote className="text-xl sm:text-2xl font-medium text-gray-800 leading-relaxed mb-4">
                "{currentQuote.quote}"
              </blockquote>
              
              {currentQuote.author && (
                <cite className="text-lg text-purple-600 font-semibold">
                  — {currentQuote.author}
                </cite>
              )}
            </div>

            {/* Category Badge */}
            {currentQuote.category && (
              <Badge 
                variant="outline" 
                className="mb-6 bg-purple-50 text-purple-700 border-purple-200"
              >
                {currentQuote.category}
              </Badge>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFavorite(currentQuote.id)}
                className="border-pink-200 hover:bg-pink-50"
              >
                <Heart 
                  className={`h-4 w-4 mr-2 ${
                    favoriteQuotes.has(currentQuote.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-400'
                  }`}
                />
                {favoriteQuotes.has(currentQuote.id) ? 'Favorited' : 'Favorite'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare(currentQuote)}
                className="border-blue-200 hover:bg-blue-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadImage(currentQuote)}
                className="border-green-200 hover:bg-green-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          onClick={handlePreviousQuote}
          disabled={displayQuotes.length <= 1}
          className="border-purple-200 hover:bg-purple-50"
        >
          ← Previous
        </Button>

        <Button
          variant="outline"
          onClick={handleNextQuote}
          disabled={displayQuotes.length <= 1}
          className="border-purple-200 hover:bg-purple-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Next Quote
        </Button>

        <Button
          variant="outline"
          onClick={handleNextQuote}
          disabled={displayQuotes.length <= 1}
          className="border-purple-200 hover:bg-purple-50"
        >
          Next →
        </Button>
      </div>

      {/* Quote Grid for Favorites */}
      {favoriteQuotes.size > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Your Favorite Quotes 💕
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {displayQuotes.filter((quote: ParentingQuote) => favoriteQuotes.has(quote.id)).map((quote: ParentingQuote) => (
              <Card key={quote.id} className="p-4 border-pink-100">
                <CardContent className="p-0">
                  <p className="text-sm text-gray-700 mb-2">"{quote.quote}"</p>
                  {quote.author && (
                    <p className="text-xs text-purple-600">— {quote.author}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
