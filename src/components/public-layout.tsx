import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity,
  Moon,
  Sun,
  Coffee,
  Heart,
  Languages,
  LogIn
} from "lucide-react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
    console.log('Language changed to:', languageCode);
  };

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      {/* Public Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg">vNetScan</span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center space-x-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue>
                    {languages.find(lang => lang.code === selectedLanguage)?.flag} {languages.find(lang => lang.code === selectedLanguage)?.code.toUpperCase()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.flag} {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Buy Me a Coffee Button */}
            <Button
              onClick={() => window.open('https://coff.ee/visnec', '_blank')}
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Coffee className="w-4 h-4 mr-1" />
              <Heart className="w-3 h-3 mr-1 text-red-200" />
              Support
            </Button>

            {/* Sign In Button */}
            <Link href="/sign-in">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>

            {/* Dark mode toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main content - No sidebar */}
      <main className="flex-1">
        {children}
        
        {/* Footer */}
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-8">
          <div className="container mx-auto py-4 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>© 2025 vNetScan. All rights reserved.</span>
              </div>
              <div className="flex items-center space-x-1 mt-2 sm:mt-0">
                <span>Powered by</span>
                <a 
                  href="https://visnec.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Visnec
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}