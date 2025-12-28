import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { CardSkeleton } from '@/components/shared/SkeletonLoader';
import { useAnalytics, useExportReport } from '@/hooks/useDataHooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Download,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { formatPercent, formatDate } from '@/utils/helpers';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--muted))'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const { data: analytics, isLoading } = useAnalytics();
  const exportReport = useExportReport();
  const { toast } = useToast();

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const blob = await exportReport.mutateAsync(format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: 'Report exported',
        description: `Your ${format.toUpperCase()} report has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export report.',
        variant: 'destructive',
      });
    }
  };

  const accuracyTrend = analytics?.dailyStats 
    ? analytics.dailyStats[analytics.dailyStats.length - 1].accuracy - analytics.dailyStats[0].accuracy
    : 0;

  return (
    <DashboardLayout>
      <PageHeader
        title="Analytics"
        description="AI performance metrics and insights"
        actions={
          <div className="flex gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-8">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overall Accuracy</span>
                {accuracyTrend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </div>
              <p className="text-3xl font-bold text-foreground">
                {formatPercent(analytics?.overallAccuracy ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {accuracyTrend > 0 ? '+' : ''}{accuracyTrend.toFixed(1)}% from period start
              </p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Conversations</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {analytics?.totalConversations.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ~{Math.round((analytics?.totalConversations ?? 0) / 30)} per day average
              </p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Failed Queries</span>
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {analytics?.failedQueries.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Needs knowledge base updates
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Accuracy Over Time */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-1">Accuracy Over Time</h3>
              <p className="text-sm text-muted-foreground mb-6">Daily AI response accuracy</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.dailyStats.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="date"
                      className="text-xs fill-muted-foreground"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                      domain={[80, 100]}
                      className="text-xs fill-muted-foreground"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Accuracy']}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--success))', strokeWidth: 0, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Intents */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-1">Top Intents</h3>
              <p className="text-sm text-muted-foreground mb-6">Most common user intents</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.topIntents} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis type="number" className="text-xs fill-muted-foreground" axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="intent" className="text-xs fill-muted-foreground" axisLine={false} tickLine={false} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Failed Queries */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Failed Queries</h3>
              <p className="text-sm text-muted-foreground">Queries that need knowledge base updates</p>
            </div>
            <div className="divide-y divide-border">
              {analytics?.failedQueries.map((query) => (
                <div key={query.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground mb-1">"{query.query}"</p>
                      <p className="text-sm text-muted-foreground">{query.reason}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(query.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
