import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { CardSkeleton } from '@/components/shared/SkeletonLoader';
import { useKnowledgeEntries, useReindexKnowledge, useUpdateKnowledge, useDeleteKnowledge } from '@/hooks/useDataHooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { KnowledgeType } from '@/types';
import {
  Plus,
  RefreshCw,
  BookOpen,
  FileText,
  Gift,
  FileCheck,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const typeIcons: Record<KnowledgeType, React.ReactNode> = {
  faq: <BookOpen className="h-5 w-5" />,
  policy: <FileText className="h-5 w-5" />,
  promotion: <Gift className="h-5 w-5" />,
  manual: <FileCheck className="h-5 w-5" />,
};

const typeLabels: Record<KnowledgeType, string> = {
  faq: 'FAQs',
  policy: 'Policies',
  promotion: 'Promotions',
  manual: 'Manuals',
};

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const typeFilter = activeTab === 'all' ? undefined : activeTab;
  const { data: entries, isLoading } = useKnowledgeEntries(typeFilter);
  const reindex = useReindexKnowledge();
  const updateKnowledge = useUpdateKnowledge();
  const deleteKnowledge = useDeleteKnowledge();
  const { toast } = useToast();

  const filteredEntries = entries?.filter(entry => 
    entry.title.toLowerCase().includes(search.toLowerCase()) ||
    entry.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleReindex = async () => {
    try {
      await reindex.mutateAsync();
      toast({
        title: 'Reindexing complete',
        description: 'All knowledge entries have been re-embedded.',
      });
    } catch (error) {
      toast({
        title: 'Reindexing failed',
        description: 'An error occurred while reindexing.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleEnabled = async (id: string, currentEnabled: boolean) => {
    try {
      await updateKnowledge.mutateAsync({ id, data: { enabled: !currentEnabled } });
      toast({
        title: currentEnabled ? 'Entry disabled' : 'Entry enabled',
        description: `Knowledge entry has been ${currentEnabled ? 'disabled' : 'enabled'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update entry.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedEntryId) return;
    
    try {
      await deleteKnowledge.mutateAsync(selectedEntryId);
      toast({
        title: 'Entry deleted',
        description: 'The knowledge entry has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete entry.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedEntryId(null);
    }
  };

  const getEmbeddingStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Indexed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="warning" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="ghost" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="ghost">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Knowledge Base"
        description="Manage your RAG knowledge entries"
        actions={
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleReindex}
              disabled={reindex.isPending}
            >
              {reindex.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Re-index All
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="policy">Policies</TabsTrigger>
            <TabsTrigger value="promotion">Promotions</TabsTrigger>
            <TabsTrigger value="manual">Manuals</TabsTrigger>
          </TabsList>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search entries..."
            className="max-w-xs"
          />
        </div>
      </Tabs>

      {/* Knowledge Entries Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredEntries?.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-8 w-8 text-muted-foreground" />}
          title="No knowledge entries found"
          description="Add your first knowledge entry to power your RAG assistant."
          action={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries?.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {typeIcons[entry.type]}
                  </div>
                  <div>
                    <Badge variant="secondary" className="text-xs">
                      {typeLabels[entry.type]}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Chunks
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleEnabled(entry.id, entry.enabled)}>
                      {entry.enabled ? (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-2" />
                          Disable
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-4 w-4 mr-2" />
                          Enable
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setSelectedEntryId(entry.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{entry.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{entry.content}</p>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  {getEmbeddingStatusBadge(entry.embeddingStatus)}
                  {!entry.enabled && (
                    <Badge variant="ghost">Disabled</Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">v{entry.version}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Knowledge Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this knowledge entry? This will remove it from the RAG index.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
