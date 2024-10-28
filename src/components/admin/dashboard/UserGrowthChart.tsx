import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Demo data
const data = [
  { date: '2024-01', users: 1200, active: 980 },
  { date: '2024-02', users: 1350, active: 1100 },
  { date: '2024-03', users: 1500, active: 1250 },
  { date: '2024-04', users: 1800, active: 1500 },
  { date: '2024-05', users: 2100, active: 1750 },
  { date: '2024-06', users: 2400, active: 2000 },
  { date: '2024-07', users: 2800, active: 2300 },
];

export function UserGrowthChart() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">User Growth</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="7d">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('default', { month: 'short' });
              }}
            />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#2563eb" 
              strokeWidth={2}
              name="Total Users"
            />
            <Line 
              type="monotone" 
              dataKey="active" 
              stroke="#16a34a" 
              strokeWidth={2}
              name="Active Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <div className="text-2xl font-bold text-blue-500">2,800</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-500">2,300</div>
          <div className="text-sm text-muted-foreground">Active Users</div>
        </div>
      </div>
    </Card>
  );
}