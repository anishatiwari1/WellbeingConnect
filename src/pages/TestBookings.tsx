import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function TestBookings() {
  const [count, setCount] = useState(0);

  const handleTest = () => {
    setCount(prev => prev + 1);
    toast({
      title: "Test successful!",
      description: `Button clicked ${count + 1} times`,
    });
  };

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Bookings Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>This is a test page to verify the routing is working.</p>
            <Button onClick={handleTest}>
              Test Button (Clicked {count} times)
            </Button>
            <div className="text-sm text-muted-foreground">
              If you can see this page, the routing is working correctly.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
