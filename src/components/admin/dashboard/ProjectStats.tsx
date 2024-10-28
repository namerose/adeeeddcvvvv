import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Demo data
const data = [
  { category: 'AI & ML', count: 45, featured: 5 },
  { category: 'Web Dev', count: 78, featured: 8 },
  { category: 'Mobile', count: 32, featured: 4 },
  { category: 'DevOps', count: 28, featured: 3 },
  { category: 'Design', count: 52, featured: 6 },
  { category: 'Other', count: 25, featured: 2 },
];

export function ProjectStats() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Project Statistics</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="category">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category">By Category</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
              <SelectItem value="type">By Type</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" name="Total Projects" />
            <Bar dataKey="featured" fill="#16a34a" name="Featured" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <div className="text-2xl font-bold">260</div>
          <div className="text-sm text-muted-foreground">Total Projects</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-500">28</div>
          <div className="text-sm text-muted-foreground">Featured</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-500">45</div>
          <div className="text-sm text-muted-foreground">This Month</div>
        </div>
      </div>
    </Card>
  );
}