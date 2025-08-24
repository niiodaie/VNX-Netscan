import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Mail, 
  MessageCircle, 
  Book, 
  HelpCircle,
  Clock,
  Phone,
  ArrowRight,
  Search
} from 'lucide-react'

export default function Support() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      action: 'Start Chat',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message about your issue',
      availability: 'Response within 24 hours',
      action: 'Send Email',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our technical experts',
      availability: 'Pro & Enterprise only',
      action: 'Schedule Call',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Browse our comprehensive guides and tutorials',
      availability: 'Always available',
      action: 'View Docs',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const faqs = [
    {
      question: 'How do I perform an IP lookup?',
      answer: 'Navigate to the IP Lookup tool in your dashboard, enter the IP address you want to analyze, and click "Lookup". You\'ll get detailed information including geolocation, ISP, and security data.'
    },
    {
      question: 'What ports does the port scanner check?',
      answer: 'Our port scanner checks the most common ports by default (1-1024), but Pro users can specify custom port ranges and perform comprehensive scans up to port 65535.'
    },
    {
      question: 'How accurate is the geolocation data?',
      answer: 'Our geolocation data is sourced from multiple providers and is typically accurate to the city level. Accuracy can vary based on the IP address type and location.'
    },
    {
      question: 'Can I export my scan results?',
      answer: 'Yes, Pro and Enterprise users can export results in multiple formats including CSV, JSON, and PDF reports.'
    },
    {
      question: 'What is the API rate limit?',
      answer: 'Free users get 100 API calls per day, Pro users get 1,000 calls per day, and Enterprise users have unlimited access.'
    },
    {
      question: 'How do I upgrade my account?',
      answer: 'Visit the Pricing page in your dashboard and select the plan that fits your needs. Upgrades are processed immediately.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              How Can We Help?
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get the support you need to make the most of VNX-Netscan's powerful network diagnostic tools
            </p>
          </div>

          {/* Search */}
          <Card className="shadow-lg border-0 mb-12">
            <CardContent className="p-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input 
                    placeholder="Search for help articles, guides, or common issues..."
                    className="pl-10"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {supportOptions.map((option, index) => (
              <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <option.icon className="text-white w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{option.title}</h3>
                  <p className="text-slate-600 mb-3">{option.description}</p>
                  <div className="flex items-center justify-center gap-1 text-sm text-slate-500 mb-4">
                    <Clock className="w-4 h-4" />
                    {option.availability}
                  </div>
                  <Button className="w-full" variant="outline">
                    {option.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Please describe your issue or question in detail..."
                    rows={5}
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Send Message
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-slate-800 mb-2">{faq.question}</h3>
                    <p className="text-slate-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All FAQs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Resources */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <Book className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">User Guide</h3>
                  <p className="text-slate-600 mb-4">Comprehensive documentation and tutorials</p>
                  <Button variant="outline" className="w-full">
                    Read Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Community Forum</h3>
                  <p className="text-slate-600 mb-4">Connect with other users and experts</p>
                  <Button variant="outline" className="w-full">
                    Join Forum
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <HelpCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">API Documentation</h3>
                  <p className="text-slate-600 mb-4">Technical reference for developers</p>
                  <Button variant="outline" className="w-full">
                    View API Docs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

