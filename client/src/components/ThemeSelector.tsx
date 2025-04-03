import { useState, useEffect } from 'react';
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
import { Moon, Sun, Laptop, Palette, Check } from 'lucide-react';
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
  
  // Fetch current theme from localStorage or use default from theme.json
  const [currentTheme, setCurrentTheme] = useState<ThemeOptions>(() => {
    // Try to load from localStorage first
    const savedTheme = localStorage.getItem('pdfcore-theme');
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch (e) {
        console.error('Failed to parse saved theme', e);
      }
    }
    
    // Default theme from theme.json
    return {
      variant: 'professional',
      primary: 'hsl(210, 90%, 40%)',
      appearance: 'light',
      radius: 0.75
    };
  });
  
  // Apply theme changes to document when theme changes
  useEffect(() => {
    // Set CSS variables based on the current theme
    document.documentElement.style.setProperty('--theme-primary', currentTheme.primary);
    
    // Apply appearance (light/dark mode)
    if (currentTheme.appearance === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    
    // Apply radius
    document.documentElement.style.setProperty('--theme-radius', `${currentTheme.radius}rem`);
    document.documentElement.style.setProperty('--radius', `${currentTheme.radius}rem`);
    
    // Apply theme variant - make sure we remove other variants first
    document.documentElement.classList.remove('professional', 'tint', 'vibrant');
    document.documentElement.classList.add(currentTheme.variant);
    document.documentElement.setAttribute('data-theme-variant', currentTheme.variant);
    
    // Set theme variant as CSS variable as well for components that use it
    document.documentElement.style.setProperty('--theme-variant', currentTheme.variant);
    
    // Save to localStorage for persistence
    localStorage.setItem('pdfcore-theme', JSON.stringify(currentTheme));
    
    console.log('Theme applied:', currentTheme);
  }, [currentTheme]);
  
  // Function to update theme
  const updateTheme = async (updates: Partial<ThemeOptions>) => {
    const newTheme = { ...currentTheme, ...updates };
    setCurrentTheme(newTheme);
    
    try {
      // Save to API (simulated)
      // In a real application, we would update theme.json on the server
      toast({
        title: 'Theme updated',
        description: 'Your theme preferences have been saved.',
      });
      
      // Simulate API call to update theme.json
      setTimeout(() => {
        // This is just for visual feedback in the demo
        // In a real app, we would make a real API call
      }, 300);
      
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
                    ? 'ring-2 ring-white' 
                    : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => updateTheme({ primary: color.value })}
                title={color.label}
              >
                {currentTheme.primary === color.value && (
                  <Check className="h-4 w-4 text-white" />
                )}
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