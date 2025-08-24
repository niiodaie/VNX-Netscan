import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Crown, User, TestTube } from 'lucide-react';
import { checkProStatus } from '@/utils/auth';

export function ProStatusTest() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const data = await checkProStatus(email);
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to check status' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Pro Status Test
        </CardTitle>
        <CardDescription>
          Test the /api/check-pro endpoint with any email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter email to test"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button 
            onClick={handleTest} 
            disabled={!email || loading}
            className="w-full"
          >
            {loading ? 'Checking...' : 'Check Pro Status'}
          </Button>
        </div>
        
        {result && (
          <div className="space-y-2">
            <h4 className="font-semibold">Result:</h4>
            {result.error ? (
              <Badge variant="destructive">Error: {result.error}</Badge>
            ) : (
              <div className="space-y-2">
                <Badge 
                  className={result.is_pro 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white" 
                    : "bg-gray-100 text-gray-700"
                  }
                >
                  {result.is_pro ? (
                    <>
                      <Crown className="w-3 h-3 mr-1" />
                      Pro User
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3 mr-1" />
                      Free User
                    </>
                  )}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}