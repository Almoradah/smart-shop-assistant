// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Product Types
export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>; // e.g., { storage: '256GB', color: 'Black' }
  price: number;
  stock: number;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Product {
  id: string;
  brand: string;
  model: string;
  basePrice: number;
  description?: string;
  specifications?: Record<string, string>;
  images: string[];
  variants: ProductVariant[];
  ragIndexed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  brand?: string;
  availability?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Knowledge Base Types
export type KnowledgeType = 'faq' | 'policy' | 'promotion' | 'manual';

export interface KnowledgeEntry {
  id: string;
  type: KnowledgeType;
  title: string;
  content: string;
  chunks?: string[];
  embeddingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  enabled: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeVersion {
  id: string;
  entryId: string;
  version: number;
  content: string;
  createdAt: string;
}

// Conversation Types
export type Channel = 'web' | 'whatsapp' | 'telegram';

export interface RetrievedChunk {
  id: string;
  content: string;
  source: string;
  score: number;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  retrievedChunks?: RetrievedChunk[];
  confidenceScore?: number;
}

export interface Conversation {
  id: string;
  channel: Channel;
  messages: ConversationMessage[];
  confidenceScore: number;
  feedback?: {
    isCorrect: boolean;
    note?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ConversationFilters {
  channel?: Channel;
  startDate?: string;
  endDate?: string;
  minConfidence?: number;
  maxConfidence?: number;
}

// Analytics Types
export interface DailyStats {
  date: string;
  conversations: number;
  accuracy: number;
  avgConfidence: number;
}

export interface TopIntent {
  intent: string;
  count: number;
  avgConfidence: number;
}

export interface FailedQuery {
  id: string;
  query: string;
  timestamp: string;
  reason: string;
}

export interface AnalyticsData {
  dailyStats: DailyStats[];
  topIntents: TopIntent[];
  failedQueries: FailedQuery[];
  overallAccuracy: number;
  totalConversations: number;
}

// AI Settings Types
export interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  promptTemplate: string;
  fallbackResponse: string;
  confidenceThreshold: number;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  variantSku: string;
  variantAttributes: Record<string, string>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// Dashboard Types
export interface DashboardKPIs {
  totalProducts: number;
  totalConversations: number;
  aiAccuracy: number;
  topSearchedPhones: { model: string; count: number }[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
