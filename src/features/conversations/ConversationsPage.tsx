import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/SkeletonLoader';
import { useConversations } from '@/hooks/useDataHooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Channel } from '@/types';
import {
  MessageSquare,
  Filter,
  ArrowRight,
  Globe,
  Smartphone,
  Send,
  CheckCircle,
  XCircle,
  MinusCircle,
} from 'lucide-react';
import { formatDateTime, formatPercent, getConfidenceColor } from '@/utils/helpers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const channelIcons: Record<Channel, React.ReactNode> = {
  web: <Globe className="h-4 w-4" />,
  whatsapp: <Smartphone className="h-4 w-4" />,
  telegram: <Send className="h-4 w-4" />,
};

const channelLabels: Record<Channel, string> = {
  web: 'Web',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
};

export default function ConversationsPage() {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('');
  const [confidenceRange, setConfidenceRange] = useState([0, 100]);

  const { data: conversations, isLoading } = useConversations({
    channel: channelFilter as Channel || undefined,
    minConfidence: confidenceRange[0] / 100,
    maxConfidence: confidenceRange[1] / 100,
  });

  const filteredConversations = conversations?.data.filter(conv =>
    conv.messages.some(msg => 
      msg.content.toLowerCase().includes(search.toLowerCase())
    )
  );

  const getFeedbackIcon = (feedback?: { isCorrect: boolean }) => {
    if (!feedback) return <MinusCircle className="h-4 w-4 text-muted-foreground" />;
    return feedback.isCorrect 
      ? <CheckCircle className="h-4 w-4 text-success" />
      : <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Conversations"
        description="Monitor and review AI assistant interactions"
      />

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search conversations..."
              className="max-w-md"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="w-[150px]">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Channel</label>
              <Select value={channelFilter || "all"} onValueChange={(v) => setChannelFilter(v === "all" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Confidence: {confidenceRange[0]}% - {confidenceRange[1]}%
              </label>
              <Slider
                value={confidenceRange}
                onValueChange={setConfidenceRange}
                min={0}
                max={100}
                step={5}
                className="mt-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : filteredConversations?.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="h-8 w-8 text-muted-foreground" />}
            title="No conversations found"
            description="Adjust your filters or wait for new conversations."
          />
        ) : (
          <div className="divide-y divide-border">
            {filteredConversations?.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/conversations/${conversation.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  {channelIcons[conversation.channel]}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {channelLabels[conversation.channel]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(conversation.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-1">
                    {conversation.messages[0]?.content}
                  </p>
                  {conversation.messages[1] && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      AI: {conversation.messages[1].content}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <Badge 
                      variant={conversation.confidenceScore >= 0.8 ? 'success' : conversation.confidenceScore >= 0.6 ? 'warning' : 'destructive'}
                    >
                      {formatPercent(conversation.confidenceScore * 100)}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Feedback</p>
                    {getFeedbackIcon(conversation.feedback)}
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
