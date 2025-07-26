
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface AdPlaceholderProps {
  position: 'top' | 'bottom' | 'sidebar';
}

export function AdPlaceholder({ position }: AdPlaceholderProps) {
  const dimensions = {
    top: 'h-24 sm:h-32',
    bottom: 'h-20 sm:h-24',
    sidebar: 'h-64 w-full sm:w-64'
  };

  return (
    <Card className={`${dimensions[position]} mb-6 border-dashed border-gray-300 bg-gray-50/50`}>
      <CardContent className="h-full flex flex-col items-center justify-center p-4">
        <Badge variant="outline" className="mb-2 text-xs text-gray-500">
          Advertisement
        </Badge>
        <div className="text-center text-gray-400">
          <ExternalLink className="h-6 w-6 mx-auto mb-1" />
          <p className="text-xs">Google Ads Space</p>
          <p className="text-xs opacity-75">
            {position === 'top' && 'Banner 728x90'}
            {position === 'bottom' && 'Footer 728x90'}
            {position === 'sidebar' && 'Sidebar 300x250'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
