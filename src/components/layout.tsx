import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Menu, 
  Home, 
  Radar, 
  Network, 
  Package, 
  History, 
  Globe, 
  Map,
  Moon,
  Sun,
  Activity,
  Zap,
  Monitor,
  Shield,
  Coffee,
  Heart,
  Languages,
  User
} from "lucide-react";
import OAuthLogin, { UserProfileDisplay } from "./oauth-login";
// OAuth functionality now handled by Supabase authentication

interface LayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/monitoring", label: "Real-time Monitoring", icon: Monitor },
  { path: "/vuln-scan", label: "Vulnerability Scanner", icon: Shield },
  { path: "/lookup", label: "Device Lookup", icon: Radar },
  { path: "/ports", label: "Port Management", icon: Network },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/history", label: "History", icon: History },
  { path: "/domain", label: "Domain Check", icon: Globe },
  { path: "/map", label: "Network Map", icon: Map },
  { path: "/packets", label: "Packet Capture", icon: Zap },
  { path: "/support", label: "Support Development", icon: Coffee },
];

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

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('user_session');
    return stored ? JSON.parse(stored) : null;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to lookup page with search query
      window.location.href = `/lookup?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Store in localStorage for persistence
    localStorage.setItem('selectedLanguage', languageCode);
    // In a real app, this would trigger i18n language change
    console.log('Language changed to:', languageCode);
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      const { signOut } = await import('../lib/supabase');
      await signOut();
      localStorage.removeItem('user_session');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear session anyway
      localStorage.removeItem('user_session');
      setCurrentUser(null);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2 px-2">
                  <Activity className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-lg">vNetscan</span>
                </div>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 mr-6">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg hidden sm:inline-block">vNetScan</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by IP, MAC, or hostname..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
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
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Coffee className="w-4 h-4 mr-1" />
              <Heart className="w-3 h-3 mr-1 text-red-200" />
              Support
            </Button>
            
            {/* User Authentication */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <UserProfileDisplay user={currentUser} onLogout={handleLogout} />
              ) : (
                <OAuthLogin onLoginSuccess={handleLoginSuccess} />
              )}
            </div>

            {/* Dark mode toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-muted/40 min-h-[calc(100vh-3.5rem)]">
          <nav className="flex flex-col space-y-2 p-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4">
            {children}
          </div>
          
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
    </div>
  );
}