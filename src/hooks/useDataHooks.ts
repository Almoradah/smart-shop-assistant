import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, knowledgeService, conversationService, aiSettingsService, dashboardService, analyticsService, userService } from '@/services/dataService';
import type { Product, ProductFilters, KnowledgeEntry, ConversationFilters, AISettings } from '@/types';

// Product Hooks
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
      productService.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => 
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Knowledge Hooks
export function useKnowledgeEntries(type?: string) {
  return useQuery({
    queryKey: ['knowledge', type],
    queryFn: () => knowledgeService.getAll(type),
  });
}

export function useKnowledgeEntry(id: string) {
  return useQuery({
    queryKey: ['knowledge', id],
    queryFn: () => knowledgeService.getById(id),
    enabled: !!id,
  });
}

export function useCreateKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'chunks' | 'embeddingStatus'>) => 
      knowledgeService.create(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] });
    },
  });
}

export function useUpdateKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<KnowledgeEntry> }) => 
      knowledgeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] });
    },
  });
}

export function useDeleteKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => knowledgeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] });
    },
  });
}

export function useReindexKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => knowledgeService.reindex(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] });
    },
  });
}

// Conversation Hooks
export function useConversations(filters?: ConversationFilters) {
  return useQuery({
    queryKey: ['conversations', filters],
    queryFn: () => conversationService.getAll(filters),
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => conversationService.getById(id),
    enabled: !!id,
  });
}

export function useAddFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: { isCorrect: boolean; note?: string } }) => 
      conversationService.addFeedback(id, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// AI Settings Hooks
export function useAISettings() {
  return useQuery({
    queryKey: ['ai-settings'],
    queryFn: () => aiSettingsService.get(),
  });
}

export function useUpdateAISettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<AISettings>) => aiSettingsService.update(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-settings'] });
    },
  });
}

// Dashboard Hooks
export function useDashboardKPIs() {
  return useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => dashboardService.getKPIs(),
  });
}

// Analytics Hooks
export function useAnalytics(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['analytics', startDate, endDate],
    queryFn: () => analyticsService.getData(startDate, endDate),
  });
}

export function useExportReport() {
  return useMutation({
    mutationFn: (format: 'csv' | 'pdf') => analyticsService.exportReport(format),
  });
}

// User Hooks
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'admin' | 'staff' }) => 
      userService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
