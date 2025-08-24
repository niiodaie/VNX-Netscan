import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Crown, 
  Zap, 
  Shield, 
  Users, 
  BarChart3,
  Clock,
  Globe,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Upgrade() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with basic network diagnostics',
      features: [
        'IP Lookup',
        'WHOIS / Domain Tools',
        'Basic SSL check (1 domain)',
        'Basic Traceroute (1 per day)',
        '5 scans/day limit'
      ],
      limitations: [
        'Limited daily usage',
        'No historical data',
        'No API access'
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'Advanced tools for professionals and small teams',
      features: [
        'Unlimited scans (no daily cap)',
        'SSL/TLS analyzer (deep analysis)',
        'Email/DNS health checks (SPF, DKIM, DMARC)',
        'Traceroute visualizer + export',
        'Scan history (stored in DB)',
        'SSL expiry alerts',
        'Priority support'
      ],
      limitations: [],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      name: 'Business',
      price: '$49',
      period: 'per month',
      description: 'Comprehensive solution for growing businesses',
      features: [
        'Everything in Pro',
        'Bulk CSV uploads for IP/domain scans',
        'Scheduled monitoring (SSL, uptime, blacklist)',
        'API access (with quota/credits)',
        'Threat intelligence (IP/domain reputation)',
        'Weekly PDF/CSV reports',
        'Slack/email alert integration'
      ],
      limitations: [],
      buttonText: 'Upgrade to Business',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Enterprise',
      price: '$299',
      period: 'per month',
      description: 'Enterprise-grade solution for large organizations',
      features: [
        'Everything in Business',
        'Large API quota (high-volume access)',
        'Continuous attack surface monitoring',
        'White-label dashboards & branded reports',
        'Team accounts & role management',
        'Dedicated SLA & support',
        'Custom integrations'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false
    }
  ]

  const features = [
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Access network data from servers worldwide'
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Enterprise-grade security and compliance'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sub-second response times for all queries'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Comprehensive reports and insights'
    },
    {
      icon: Clock,
      title: '24/7 Monitoring',
      description: 'Round-the-clock network monitoring'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share results and collaborate with your team'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Unlock the full potential of professional network diagnostics with our flexible pricing plans
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {plans.map((plan, index) => (
              <Card key={index} className={`shadow-lg border-0 relative ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
                      <Crown className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-slate-800">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-800">{plan.price}</span>
                    <span className="text-slate-600 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-slate-600 mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : ''}`}
                    variant={plan.buttonVariant}
                    disabled={plan.name === 'Free'}
                  >
                    {plan.buttonText}
                    {plan.name !== 'Free' && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
              Why Choose VNX-Netscan?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="text-white w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Can I change plans anytime?</h3>
                  <p className="text-slate-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Is there a free trial?</h3>
                  <p className="text-slate-600">Our free plan gives you access to basic features. No credit card required to get started.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">What payment methods do you accept?</h3>
                  <p className="text-slate-600">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Do you offer refunds?</h3>
                  <p className="text-slate-600">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who trust VNX-Netscan for their network diagnostic needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/sign-in">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/support">
                <Button variant="outline" className="px-8 py-3 text-lg border-2">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

