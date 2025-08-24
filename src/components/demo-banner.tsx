import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Crown, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "wouter";

interface DemoBannerProps {
  feature: string;
  description: string;
  proOnly?: boolean;
  comingSoon?: boolean;
}

export function DemoBanner({ feature, description, proOnly = false, comingSoon = false }: DemoBannerProps) {
  if (comingSoon) {
    return (
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 text-blue-600 mr-3" />
              <div>
                <span className="font-semibold text-blue-800 dark:text-blue-200">
                  {feature} - Coming Soon
                </span>
                <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                  {description}
                </p>
              </div>
            </div>
            <Badge variant="secondary">In Development</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (proOnly) {
    return (
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="h-4 w-4 text-yellow-600 mr-3" />
              <div>
                <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                  {feature} - Pro Feature
                </span>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                  {description}
                </p>
              </div>
            </div>
            <Link href="/support">
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Info className="h-4 w-4 text-orange-600 mr-3" />
            <div>
              <span className="font-semibold text-orange-800 dark:text-orange-200">
                Demo Mode: {feature}
              </span>
              <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">
                {description}
              </p>
            </div>
          </div>
          <Link href="/sign-in">
            <Button size="sm" variant="outline" className="border-orange-300 hover:bg-orange-100">
              Sign In to Unlock
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}