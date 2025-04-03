import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Laptop, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// These theme options match the ones in theme.json
interface ThemeOptions {
  variant: 'professional' | 'tint' | 'vibrant';
  primary: string;
  appearance: 'light' | 'dark' | 'system';
  radius: number;
}

const THEME_VARIANTS = [
  { value: 'professional', label: 'Professional' },
  { value: 'tint', label: 'Tint' },
  { value: 'vibrant', label: 'Vibrant' }
];

const COLOR_PRESETS = [
  { value: 'hsl(210, 90%, 40%)', label: 'Blue', class: 'bg-blue-600' },
  { value: 'hsl(142, 71%, 45%)', label: 'Green', class: 'bg-green-500' },
  { value: 'hsl(349, 89%, 60%)', label: 'Red', class: 'bg-red-500' },
  { value: 'hsl(47, 100%, 50%)', label: 'Yellow', class: 'bg-yellow-400' },
  { value: 'hsl(262, 80%, 60%)', label: 'Purple', class: 'bg-purple-500' },
  { value: 'hsl(20, 90%, 50%)', label: 'Orange', class: 'bg-orange-500' },
];

const ThemeSelector: React.FC = () => {
  const { toast } = useToast();
  
  // Fetch current theme from theme.json
  const [currentTheme, setCurrentTheme] = useState<ThemeOptions>({
    variant: 'professional',
    primary: 'hsl(210, 90%, 40%)',
    appearance: 'light',
    radius: 0.75
  });

  const updateTheme = async (updates: Partial<ThemeOptions>) => {
    const newTheme = { ...currentTheme, ...updates };
    setCurrentTheme(newTheme);
    
    try {
      // In a real application, we would save this to the server or localStorage
      // Here we're just showing toast for demonstration
      toast({
        title: 'Theme updated',
        description: 'Your theme preferences have been saved.',
      });
      
      // In a production environment, we would update the actual theme.json
      // Example fetch call (commented out as we don't have this endpoint):
      // await fetch('/api/theme', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newTheme)
      // });
    } catch (error) {
      toast({
        title: 'Theme update failed',
        description: 'There was an error saving your theme preferences.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Color picker */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9 relative">
            <Palette className="h-5 w-5" />
            <span className="absolute right-0.5 bottom-0.5 w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: currentTheme.primary }}></span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="grid grid-cols-3 gap-1 p-2">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color.value}
                className={`w-full h-8 rounded-md border transition-colors flex items-center justify-center ${
                  currentTheme.primary === color.value 
                    ? 'ring-2 ring-primary' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => updateTheme({ primary: color.value })}
              >
                <span className="sr-only">{color.label}</span>
              </button>
            ))}
          </div>
          <DropdownMenuSeparator />
          <div className="p-2">
            <label className="text-xs text-muted-foreground block mb-1">
              Custom Color
            </label>
            <input
              type="color"
              value={currentTheme.primary}
              onChange={(e) => updateTheme({ primary: e.target.value })}
              className="w-full h-8 cursor-pointer rounded"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Appearance toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            {currentTheme.appearance === 'light' && <Sun className="h-5 w-5" />}
            {currentTheme.appearance === 'dark' && <Moon className="h-5 w-5" />}
            {currentTheme.appearance === 'system' && <Laptop className="h-5 w-5" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup 
            value={currentTheme.appearance} 
            onValueChange={(value) => updateTheme({ appearance: value as 'light' | 'dark' | 'system' })}
          >
            <DropdownMenuRadioItem value="light" className="cursor-pointer">
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark" className="cursor-pointer">
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system" className="cursor-pointer">
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Style variant */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <span className="capitalize">{currentTheme.variant}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Style Variant</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup 
            value={currentTheme.variant} 
            onValueChange={(value) => updateTheme({ variant: value as 'professional' | 'tint' | 'vibrant' })}
          >
            {THEME_VARIANTS.map((variant) => (
              <DropdownMenuRadioItem 
                key={variant.value} 
                value={variant.value}
                className="cursor-pointer"
              >
                {variant.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeSelector;