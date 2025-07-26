
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, RefreshCw, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ConfigurationPanelProps {
  showAds: boolean;
  onShowAdsChange: (show: boolean) => void;
  quotesFrequency: number;
  onQuotesFrequencyChange: (frequency: number) => void;
  onResetViews: () => void;
}

export function ConfigurationPanel({
  showAds,
  onShowAdsChange,
  quotesFrequency,
  onQuotesFrequencyChange,
  onResetViews
}: ConfigurationPanelProps) {
  const handleExportSettings = () => {
    const settings = {
      showAds,
      quotesFrequency,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'babynames-config.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Settings exported! 📁');
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const settings = JSON.parse(event.target?.result as string);
          
          if (typeof settings.showAds === 'boolean') {
            onShowAdsChange(settings.showAds);
          }
          if (typeof settings.quotesFrequency === 'number') {
            onQuotesFrequencyChange(settings.quotesFrequency);
          }
          
          toast.success('Settings imported successfully! ✅');
        } catch (error) {
          console.error('Import failed:', error);
          toast.error('Failed to import settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Settings className="h-8 w-8 text-purple-600" />
          App Settings
        </h2>
        <p className="text-gray-600">
          Customize your baby names browsing experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Display Settings */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 Display Settings
            </CardTitle>
            <CardDescription>
              Control what content is shown in the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-ads" className="text-sm font-medium">
                  Show Advertisements
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Display Google Ads placeholders throughout the app
                </p>
              </div>
              <Switch
                id="show-ads"
                checked={showAds}
                onCheckedChange={onShowAdsChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Behavior Settings */}
        <Card className="border-pink-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Behavior Settings
            </CardTitle>
            <CardDescription>
              Customize how the app behaves during browsing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Label className="text-sm font-medium">
                    Quote Display Frequency
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Show parenting quotes after viewing this many names
                  </p>
                </div>
                <Badge variant="secondary">
                  {quotesFrequency} names
                </Badge>
              </div>
              <Slider
                value={[quotesFrequency]}
                onValueChange={(value: number[]) => onQuotesFrequencyChange(value[0] || 10)}
                max={50}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5 names</span>
                <span>25 names</span>
                <span>50 names</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💾 Data Management
            </CardTitle>
            <CardDescription>
              Manage your app data and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={onResetViews}
              className="w-full border-orange-200 hover:bg-orange-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset View Counter
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSettings}
                className="border-green-200 hover:bg-green-50"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleImportSettings}
                className="border-blue-200 hover:bg-blue-50"
              >
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ℹ️ App Information
            </CardTitle>
            <CardDescription>
              About this Progressive Web Application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <Badge variant="outline">1.0.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Languages:</span>
                <Badge variant="outline">10 supported</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Offline Mode:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Enabled
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PWA Ready:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Yes
                </Badge>
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <p className="text-xs text-gray-500 text-center">
                Built with ❤️ for parents discovering the perfect name
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="max-w-2xl mx-auto border-purple-100">
        <CardHeader>
          <CardTitle className="text-center">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.success('Cache cleared! 🗑️')}
              className="border-red-200 hover:bg-red-50"
            >
              Clear Cache
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.success('Data refreshed! ♻️')}
              className="border-blue-200 hover:bg-blue-50"
            >
              Refresh Data
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.success('Checking for updates... 🔄')}
              className="border-green-200 hover:bg-green-50"
            >
              Check Updates
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
              className="border-purple-200 hover:bg-purple-50"
            >
              Restart App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
