import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';

interface PremiumFeatureProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
  level?: 'basic' | 'premium' | 'pro';
  showUpgrade?: boolean;
  className?: string;
}

export function PremiumFeature({ 
  children, 
  feature, 
  description, 
  level = 'premium', 
  showUpgrade = true,
  className = ''
}: PremiumFeatureProps) {
  const { user, isAuthenticated, isPremium, loading } = useAuth();

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="animate-pulse bg-muted rounded-lg h-32"></div>
      </div>
    );
  }

  // Check access level with real Pro status from database
  const hasAccess = 
    level === 'basic' ? !!user :
    level === 'premium' ? isAuthenticated :
    level === 'pro' ? (user && user.is_pro === true) : // Real Pro status from database
    false;

  if (hasAccess) {
    return <div className={className}>{children}</div>;
  }

  // Show premium lock overlay
  const levelConfig = {
    basic: { icon: User, label: 'Guest+', color: 'bg-blue-500' },
    premium: { icon: Crown, label: 'Premium', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
    pro: { icon: Zap, label: 'Pro', color: 'bg-gradient-to-r from-purple-500 to-pink-500' }
  };

  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <div className={`relative ${className}`}>
      {/* Blurred content */}
      <div className="filter blur-sm pointer-events-none opacity-50">
        {children}
      </div>
      
      {/* Premium overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-muted-foreground/30">
        <Card className="max-w-sm mx-4 border-2">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${config.color} text-white`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="flex justify-center mb-3">
              <Badge variant="secondary" className="px-3 py-1">
                <Lock className="w-3 h-3 mr-1" />
                {config.label} Feature
              </Badge>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{feature}</h3>
            {description && (
              <p className="text-muted-foreground text-sm mb-4">{description}</p>
            )}
            
            {!user ? (
              // Not logged in - show sign in options
              <div className="space-y-2">
                <Link href="/sign-in">
                  <Button className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Sign In to Access
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                  Free Google sign-in • No credit card required
                </p>
              </div>
            ) : user.isGuest ? (
              // Guest user - show upgrade options
              <div className="space-y-2">
                <Link href="/sign-in">
                  <Button className="w-full">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                  Sign in with your account for full access
                </p>
              </div>
            ) : (
              // Authenticated but not enough level - shouldn't happen with current logic
              <div className="space-y-2">
                <Button disabled className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Feature Locked
                </Button>
                <p className="text-xs text-muted-foreground">
                  Contact support for access
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simplified premium button component
interface PremiumButtonProps {
  children: React.ReactNode;
  feature: string;
  level?: 'basic' | 'premium' | 'pro';
  className?: string;
  onClick?: () => void;
}

export function PremiumButton({ 
  children, 
  feature, 
  level = 'premium', 
  className = '', 
  onClick 
}: PremiumButtonProps) {
  const { user, isAuthenticated } = useAuth();

  const hasAccess = 
    level === 'basic' ? !!user :
    level === 'premium' ? isAuthenticated :
    level === 'pro' ? isAuthenticated :
    false;

  if (hasAccess) {
    return (
      <Button onClick={onClick} className={className}>
        {children}
      </Button>
    );
  }

  return (
    <PremiumFeature feature={feature} level={level} className={className}>
      <Button onClick={onClick} className="w-full">
        {children}
      </Button>
    </PremiumFeature>
  );
}