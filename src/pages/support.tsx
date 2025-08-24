import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { 
  Coffee, 
  Heart, 
  Users, 
  Code, 
  Server,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  Star,
  Github,
  Mail,
  MessageSquare
} from "lucide-react";

export default function Support() {
  const featureRequests = [
    "Advanced packet filtering and analysis",
    "Real-time network topology discovery",
    "Enhanced vulnerability database integration",
    "Multi-subnet scanning capabilities",
    "Custom reporting and dashboards",
    "API integrations with enterprise tools"
  ];

  const stats = [
    { label: "Active Users", value: "15,247", icon: Users, color: "text-blue-600" },
    { label: "Scans Performed", value: "2.3M", icon: Zap, color: "text-green-600" },
    { label: "Vulnerabilities Found", value: "45k", icon: Shield, color: "text-red-600" },
    { label: "Uptime", value: "99.9%", icon: TrendingUp, color: "text-purple-600" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support vNetscan</h1>
        <p className="text-muted-foreground">
          Help us maintain and improve the most advanced free network scanning tool
        </p>
      </div>

      {/* Impact Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Support Section */}
      <BuyMeCoffee />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Development Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2 text-blue-600" />
              Development Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Currently Working On</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI-powered threat detection</span>
                    <Badge variant="default">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mobile app development</span>
                    <Badge variant="secondary">Planning</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Planned Features</h4>
                <div className="space-y-1">
                  {featureRequests.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Star className="w-3 h-3 text-yellow-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community & Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
              Community & Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Get Involved</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://github.com/vnetscan" target="_blank">
                    <Github className="w-4 h-4 mr-2" />
                    Contribute on GitHub
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="mailto:support@vnetscan.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Feature Requests
                  </a>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Enterprise Support</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Need custom features or enterprise deployment? We offer consulting services.
              </p>
              <Button className="w-full">Contact Enterprise Team</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Infrastructure Costs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="w-5 h-5 mr-2 text-orange-600" />
            Infrastructure & Operating Costs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">$150</div>
              <div className="text-sm text-muted-foreground">Monthly Server Costs</div>
              <div className="text-xs text-muted-foreground mt-1">
                High-performance APIs, CDN, databases
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">$50</div>
              <div className="text-sm text-muted-foreground">Third-party Services</div>
              <div className="text-xs text-muted-foreground mt-1">
                Geolocation, threat intelligence feeds
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">$25</div>
              <div className="text-sm text-muted-foreground">Development Tools</div>
              <div className="text-xs text-muted-foreground mt-1">
                CI/CD, monitoring, security scanning
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Total Monthly: $225</h4>
                <p className="text-sm text-muted-foreground">
                  Your support helps keep vNetscan free and reliable for everyone
                </p>
              </div>
              <Button 
                onClick={() => window.open('https://www.buymeacoffee.com/vnetscan', '_blank')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Coffee className="w-4 h-4 mr-2" />
                Support Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transparency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-600" />
            Transparency Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">How Donations Are Used</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Server Infrastructure</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Development Tools</span>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Security & Monitoring</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Community Events</span>
                  <span className="text-sm font-medium">5%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Recent Supporters</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Anonymous Supporter - $25</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm">TechCorp Networks - $50</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Network Admin Joe - $10</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Thank you to all 127 supporters this month!
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}