import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { CardSkeleton } from '@/components/shared/SkeletonLoader';
import { useDashboardKPIs } from '@/hooks/useDataHooks';
import { useConversations } from '@/hooks/useDataHooks';
import { 
  Smartphone, 
  MessageSquare, 
  Target, 
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { formatPercent, formatDateTime, getChannelIcon } from '@/utils/helpers';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from 'recharts';

const mockConversationsData = [
  { date: 'Dec 22', conversations: 85 },
  { date: 'Dec 23', conversations: 102 },
  { date: 'Dec 24', conversations: 78 },
  { date: 'Dec 25', conversations: 45 },
  { date: 'Dec 26', conversations: 110 },
  { date: 'Dec 27', conversations: 125 },
  { date: 'Dec 28', conversations: 148 },
];

const mockQuestionsData = [
  { question: 'Product Inquiry', count: 342 },
  { question: 'Price Check', count: 289 },
  { question: 'Stock Status', count: 156 },
  { question: 'Return Policy', count: 124 },
  { question: 'Warranty Info', count: 98 },
];

export default function DashboardPage() {
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs();
  const { data: conversations, isLoading: conversationsLoading } = useConversations();

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your RAG-powered shop assistant"
      />

      {/* KPIs Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpisLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={kpis?.totalProducts ?? 0}
              icon={<Smartphone className="h-6 w-6" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Total Conversations"
              value={kpis?.totalConversations.toLocaleString() ?? 0}
              icon={<MessageSquare className="h-6 w-6" />}
              trend={{ value: 8.5, isPositive: true }}
            />
            <StatCard
              title="AI Accuracy"
              value={formatPercent(kpis?.aiAccuracy ?? 0)}
              icon={<Target className="h-6 w-6" />}
              trend={{ value: 2.3, isPositive: true }}
            />
            <StatCard
              title="Top Search"
              value={kpis?.topSearchedPhones[0]?.model?.split(' ').slice(0, 2).join(' ') ?? 'N/A'}
              icon={<TrendingUp className="h-6 w-6" />}
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Conversations Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Conversations</h3>
              <p className="text-sm text-muted-foreground">Daily conversation volume</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockConversationsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs fill-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line
                  type="monotone"
                  dataKey="conversations"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Asked Questions Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Most Asked Questions</h3>
              <p className="text-sm text-muted-foreground">Top intent categories</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockQuestionsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                <XAxis 
                  type="number"
                  className="text-xs fill-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  type="category"
                  dataKey="question"
                  className="text-xs fill-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--accent))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Conversations</h3>
            <p className="text-sm text-muted-foreground">Latest AI assistant interactions</p>
          </div>
          <Link to="/conversations">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="divide-y divide-border">
          {conversationsLoading ? (
            <div className="p-6">
              <CardSkeleton />
            </div>
          ) : (
            conversations?.data.slice(0, 5).map((conversation) => (
              <Link 
                key={conversation.id} 
                to={`/conversations/${conversation.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getChannelIcon(conversation.channel)}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {conversation.messages[0]?.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(conversation.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={conversation.confidenceScore >= 0.8 ? 'success' : conversation.confidenceScore >= 0.6 ? 'warning' : 'destructive'}
                  >
                    {formatPercent(conversation.confidenceScore * 100)}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
