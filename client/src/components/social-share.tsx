import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";

export default function SocialShare() {
  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this professional network diagnostic tool by VNX-Netscan! 🔍 Get comprehensive IP lookup, port scanning, WHOIS, and traceroute analysis. #NetworkDiagnostics #VNXNetscan');
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text} ${url}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
      trackEvent('social_share', 'user_action', platform);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="w-5 h-5 mr-2 text-blue-600" />
          Share VNX-Netscan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 mb-4">
          Share this powerful network diagnostic tool with your colleagues and help them analyze network infrastructure efficiently.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => shareToSocial('twitter')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <FaTwitter className="w-4 h-4 mr-2" />
            Share on Twitter
          </Button>
          
          <Button 
            onClick={() => shareToSocial('linkedin')}
            className="bg-blue-700 hover:bg-blue-800 text-white"
          >
            <FaLinkedin className="w-4 h-4 mr-2" />
            Share on LinkedIn
          </Button>
          
          <Button 
            onClick={() => shareToSocial('whatsapp')}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <FaWhatsapp className="w-4 h-4 mr-2" />
            Share on WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
