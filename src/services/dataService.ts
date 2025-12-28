import type { 
  User, 
  LoginCredentials, 
  Product, 
  ProductFilters, 
  KnowledgeEntry, 
  Conversation, 
  ConversationFilters, 
  AISettings, 
  DashboardKPIs, 
  AnalyticsData,
  PaginatedResponse 
} from '@/types';
import { 
  mockUsers, 
  mockProducts, 
  mockKnowledgeEntries, 
  mockConversations, 
  mockAISettings, 
  mockDashboardKPIs, 
  mockAnalyticsData 
} from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth Services
export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    await delay(800);
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user || credentials.password !== 'password123') {
      throw new Error('Invalid email or password');
    }
    return { user, token: 'mock-jwt-token-' + user.id };
  },
  
  logout: async (): Promise<void> => {
    await delay(300);
  },
  
  getCurrentUser: async (): Promise<User> => {
    await delay(300);
    return mockUsers[0];
  },
};

// Product Services
export const productService = {
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    await delay(500);
    let products = [...mockProducts];
    
    if (filters?.brand) {
      products = products.filter(p => p.brand.toLowerCase() === filters.brand?.toLowerCase());
    }
    if (filters?.availability) {
      products = products.filter(p => p.availability === filters.availability);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.brand.toLowerCase().includes(search) || 
        p.model.toLowerCase().includes(search)
      );
    }
    
    return {
      data: products,
      total: products.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    };
  },
  
  getById: async (id: string): Promise<Product> => {
    await delay(300);
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },
  
  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await delay(500);
    const newProduct: Product = {
      ...product,
      id: String(mockProducts.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return newProduct;
  },
  
  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    mockProducts[index] = { ...mockProducts[index], ...data, updatedAt: new Date().toISOString() };
    return mockProducts[index];
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) mockProducts.splice(index, 1);
  },
};

// Knowledge Base Services
export const knowledgeService = {
  getAll: async (type?: string): Promise<KnowledgeEntry[]> => {
    await delay(500);
    if (type) {
      return mockKnowledgeEntries.filter(k => k.type === type);
    }
    return mockKnowledgeEntries;
  },
  
  getById: async (id: string): Promise<KnowledgeEntry> => {
    await delay(300);
    const entry = mockKnowledgeEntries.find(k => k.id === id);
    if (!entry) throw new Error('Knowledge entry not found');
    return entry;
  },
  
  create: async (entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'chunks' | 'embeddingStatus'>): Promise<KnowledgeEntry> => {
    await delay(500);
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: String(mockKnowledgeEntries.length + 1),
      version: 1,
      chunks: [],
      embeddingStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockKnowledgeEntries.push(newEntry);
    return newEntry;
  },
  
  update: async (id: string, data: Partial<KnowledgeEntry>): Promise<KnowledgeEntry> => {
    await delay(500);
    const index = mockKnowledgeEntries.findIndex(k => k.id === id);
    if (index === -1) throw new Error('Knowledge entry not found');
    mockKnowledgeEntries[index] = { 
      ...mockKnowledgeEntries[index], 
      ...data, 
      version: mockKnowledgeEntries[index].version + 1,
      updatedAt: new Date().toISOString() 
    };
    return mockKnowledgeEntries[index];
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockKnowledgeEntries.findIndex(k => k.id === id);
    if (index !== -1) mockKnowledgeEntries.splice(index, 1);
  },
  
  reindex: async (): Promise<void> => {
    await delay(2000);
  },
};

// Conversation Services
export const conversationService = {
  getAll: async (filters?: ConversationFilters): Promise<PaginatedResponse<Conversation>> => {
    await delay(500);
    let conversations = [...mockConversations];
    
    if (filters?.channel) {
      conversations = conversations.filter(c => c.channel === filters.channel);
    }
    if (filters?.minConfidence) {
      conversations = conversations.filter(c => c.confidenceScore >= (filters.minConfidence ?? 0));
    }
    
    return {
      data: conversations,
      total: conversations.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    };
  },
  
  getById: async (id: string): Promise<Conversation> => {
    await delay(300);
    const conversation = mockConversations.find(c => c.id === id);
    if (!conversation) throw new Error('Conversation not found');
    return conversation;
  },
  
  addFeedback: async (id: string, feedback: { isCorrect: boolean; note?: string }): Promise<Conversation> => {
    await delay(300);
    const index = mockConversations.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Conversation not found');
    mockConversations[index].feedback = feedback;
    return mockConversations[index];
  },
};

// AI Settings Services
export const aiSettingsService = {
  get: async (): Promise<AISettings> => {
    await delay(300);
    return mockAISettings;
  },
  
  update: async (settings: Partial<AISettings>): Promise<AISettings> => {
    await delay(500);
    Object.assign(mockAISettings, settings);
    return mockAISettings;
  },
};

// Dashboard Services
export const dashboardService = {
  getKPIs: async (): Promise<DashboardKPIs> => {
    await delay(500);
    return mockDashboardKPIs;
  },
};

// Analytics Services
export const analyticsService = {
  getData: async (startDate?: string, endDate?: string): Promise<AnalyticsData> => {
    await delay(500);
    return mockAnalyticsData;
  },
  
  exportReport: async (format: 'csv' | 'pdf'): Promise<Blob> => {
    await delay(1000);
    const data = 'Date,Conversations,Accuracy\n2024-12-28,150,94.2';
    return new Blob([data], { type: 'text/csv' });
  },
};

// User Services
export const userService = {
  getAll: async (): Promise<User[]> => {
    await delay(500);
    return mockUsers;
  },
  
  getById: async (id: string): Promise<User> => {
    await delay(300);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },
  
  updateRole: async (id: string, role: 'admin' | 'staff'): Promise<User> => {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers[index].role = role;
    return mockUsers[index];
  },
};
