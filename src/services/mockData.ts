import type { 
  User, 
  Product, 
  KnowledgeEntry, 
  Conversation, 
  AISettings, 
  DashboardKPIs, 
  AnalyticsData,
  DailyStats,
  TopIntent
} from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@ragshop.com',
    name: 'Alex Johnson',
    role: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    lastLoginAt: '2024-12-28T08:30:00Z',
  },
  {
    id: '2',
    email: 'staff@ragshop.com',
    name: 'Sarah Chen',
    role: 'staff',
    createdAt: '2024-02-20T14:00:00Z',
    lastLoginAt: '2024-12-27T16:45:00Z',
  },
  {
    id: '3',
    email: 'john@ragshop.com',
    name: 'John Smith',
    role: 'staff',
    createdAt: '2024-03-10T09:00:00Z',
    lastLoginAt: '2024-12-26T11:20:00Z',
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    price: 1199,
    stock: 45,
    availability: 'in_stock',
    description: 'The most advanced iPhone ever with A17 Pro chip',
    specifications: {
      'Display': '6.7" Super Retina XDR',
      'Chip': 'A17 Pro',
      'Storage': '256GB',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
    },
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569'],
    ragIndexed: true,
    createdAt: '2024-09-20T00:00:00Z',
    updatedAt: '2024-12-28T00:00:00Z',
  },
  {
    id: '2',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    price: 1299,
    stock: 38,
    availability: 'in_stock',
    description: 'Galaxy AI powered flagship smartphone',
    specifications: {
      'Display': '6.8" Dynamic AMOLED 2X',
      'Chip': 'Snapdragon 8 Gen 3',
      'Storage': '256GB',
      'Camera': '200MP Main + 12MP Ultra Wide + 50MP Telephoto',
    },
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf'],
    ragIndexed: true,
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-12-28T00:00:00Z',
  },
  {
    id: '3',
    brand: 'Google',
    model: 'Pixel 8 Pro',
    price: 999,
    stock: 5,
    availability: 'low_stock',
    description: 'The best of Google AI in a smartphone',
    specifications: {
      'Display': '6.7" LTPO OLED',
      'Chip': 'Google Tensor G3',
      'Storage': '128GB',
      'Camera': '50MP Main + 48MP Ultra Wide + 48MP Telephoto',
    },
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97'],
    ragIndexed: true,
    createdAt: '2023-10-12T00:00:00Z',
    updatedAt: '2024-12-28T00:00:00Z',
  },
  {
    id: '4',
    brand: 'OnePlus',
    model: 'OnePlus 12',
    price: 799,
    stock: 0,
    availability: 'out_of_stock',
    description: 'Performance flagship with Hasselblad camera',
    specifications: {
      'Display': '6.82" LTPO AMOLED',
      'Chip': 'Snapdragon 8 Gen 3',
      'Storage': '256GB',
      'Camera': '50MP Main + 64MP Ultra Wide + 48MP Telephoto',
    },
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'],
    ragIndexed: false,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-12-28T00:00:00Z',
  },
  {
    id: '5',
    brand: 'Xiaomi',
    model: 'Xiaomi 14 Ultra',
    price: 1099,
    stock: 22,
    availability: 'in_stock',
    description: 'Leica camera system with pro-grade photography',
    specifications: {
      'Display': '6.73" LTPO AMOLED',
      'Chip': 'Snapdragon 8 Gen 3',
      'Storage': '512GB',
      'Camera': '50MP Quad Camera with Leica',
    },
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab'],
    ragIndexed: true,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-12-28T00:00:00Z',
  },
];

// Mock Knowledge Entries
export const mockKnowledgeEntries: KnowledgeEntry[] = [
  {
    id: '1',
    type: 'faq',
    title: 'Return Policy',
    content: 'We offer a 30-day return policy for all unopened products. Opened products can be returned within 14 days with a 15% restocking fee.',
    chunks: ['30-day return policy', 'unopened products', '14 days opened', '15% restocking fee'],
    embeddingStatus: 'completed',
    enabled: true,
    version: 2,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z',
  },
  {
    id: '2',
    type: 'faq',
    title: 'Warranty Information',
    content: 'All phones come with manufacturer warranty. Extended warranty options are available at checkout.',
    chunks: ['manufacturer warranty', 'extended warranty', 'checkout options'],
    embeddingStatus: 'completed',
    enabled: true,
    version: 1,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Holiday Sale 2024',
    content: 'Get up to 20% off on select flagship phones. Use code HOLIDAY24 at checkout. Valid until December 31st.',
    chunks: ['20% off', 'HOLIDAY24', 'December 31st', 'flagship phones'],
    embeddingStatus: 'completed',
    enabled: true,
    version: 1,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: '4',
    type: 'policy',
    title: 'Price Match Guarantee',
    content: 'We match any competitor price within 7 days of purchase. Show us the competitor listing and we will refund the difference.',
    chunks: ['price match', '7 days', 'competitor price', 'refund difference'],
    embeddingStatus: 'completed',
    enabled: true,
    version: 1,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
  },
  {
    id: '5',
    type: 'manual',
    title: 'iPhone Setup Guide',
    content: 'Complete guide to setting up your new iPhone including iCloud backup, data transfer, and Face ID configuration.',
    chunks: ['iPhone setup', 'iCloud backup', 'data transfer', 'Face ID'],
    embeddingStatus: 'processing',
    enabled: true,
    version: 3,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-12-28T00:00:00Z',
  },
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: '1',
    channel: 'web',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'What is the best phone for photography?',
        timestamp: '2024-12-28T10:30:00Z',
      },
      {
        id: 'm2',
        role: 'assistant',
        content: 'Based on our current inventory, I recommend the Samsung Galaxy S24 Ultra with its 200MP main camera or the Xiaomi 14 Ultra with Leica optics. Both offer exceptional photography capabilities.',
        timestamp: '2024-12-28T10:30:05Z',
        retrievedChunks: [
          { id: 'c1', content: 'Galaxy S24 Ultra - 200MP Main Camera', source: 'products', score: 0.95 },
          { id: 'c2', content: 'Xiaomi 14 Ultra - Leica camera system', source: 'products', score: 0.92 },
        ],
        confidenceScore: 0.94,
      },
    ],
    confidenceScore: 0.94,
    createdAt: '2024-12-28T10:30:00Z',
    updatedAt: '2024-12-28T10:30:05Z',
  },
  {
    id: '2',
    channel: 'whatsapp',
    messages: [
      {
        id: 'm3',
        role: 'user',
        content: 'Do you have iPhone 15 in stock?',
        timestamp: '2024-12-28T09:15:00Z',
      },
      {
        id: 'm4',
        role: 'assistant',
        content: 'Yes! We have the iPhone 15 Pro Max in stock with 45 units available. It is priced at $1,199. Would you like to know more about its features?',
        timestamp: '2024-12-28T09:15:03Z',
        retrievedChunks: [
          { id: 'c3', content: 'iPhone 15 Pro Max - Stock: 45 - Price: $1199', source: 'products', score: 0.98 },
        ],
        confidenceScore: 0.97,
      },
    ],
    confidenceScore: 0.97,
    feedback: { isCorrect: true },
    createdAt: '2024-12-28T09:15:00Z',
    updatedAt: '2024-12-28T09:15:03Z',
  },
  {
    id: '3',
    channel: 'telegram',
    messages: [
      {
        id: 'm5',
        role: 'user',
        content: 'What is your return policy?',
        timestamp: '2024-12-27T16:45:00Z',
      },
      {
        id: 'm6',
        role: 'assistant',
        content: 'We offer a 30-day return policy for all unopened products. Opened products can be returned within 14 days with a 15% restocking fee.',
        timestamp: '2024-12-27T16:45:02Z',
        retrievedChunks: [
          { id: 'c4', content: 'Return Policy - 30 days unopened, 14 days opened with 15% fee', source: 'faq', score: 0.99 },
        ],
        confidenceScore: 0.99,
      },
    ],
    confidenceScore: 0.99,
    feedback: { isCorrect: true },
    createdAt: '2024-12-27T16:45:00Z',
    updatedAt: '2024-12-27T16:45:02Z',
  },
  {
    id: '4',
    channel: 'web',
    messages: [
      {
        id: 'm7',
        role: 'user',
        content: 'Can I trade in my old phone?',
        timestamp: '2024-12-27T14:20:00Z',
      },
      {
        id: 'm8',
        role: 'assistant',
        content: 'I apologize, but I do not have specific information about trade-in programs at the moment. Please contact our customer service team for assistance with trade-ins.',
        timestamp: '2024-12-27T14:20:04Z',
        retrievedChunks: [],
        confidenceScore: 0.35,
      },
    ],
    confidenceScore: 0.35,
    feedback: { isCorrect: false, note: 'Need to add trade-in policy to knowledge base' },
    createdAt: '2024-12-27T14:20:00Z',
    updatedAt: '2024-12-27T14:20:04Z',
  },
];

// Mock AI Settings
export const mockAISettings: AISettings = {
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 1024,
  promptTemplate: `You are a helpful mobile phone shop assistant. Use the following context to answer customer questions:

{context}

If you cannot find relevant information in the context, politely say so and suggest contacting customer service.

Customer Question: {question}`,
  fallbackResponse: 'I apologize, but I am unable to find information about that. Please contact our customer service team at support@ragshop.com for assistance.',
  confidenceThreshold: 0.6,
};

// Mock Dashboard KPIs
export const mockDashboardKPIs: DashboardKPIs = {
  totalProducts: 156,
  totalConversations: 2847,
  aiAccuracy: 94.2,
  topSearchedPhones: [
    { model: 'iPhone 15 Pro Max', count: 342 },
    { model: 'Samsung Galaxy S24 Ultra', count: 289 },
    { model: 'Google Pixel 8 Pro', count: 156 },
    { model: 'OnePlus 12', count: 124 },
    { model: 'Xiaomi 14 Ultra', count: 98 },
  ],
};

// Mock Analytics Data
export const mockAnalyticsData: AnalyticsData = {
  dailyStats: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      conversations: Math.floor(Math.random() * 150) + 50,
      accuracy: Math.random() * 10 + 88,
      avgConfidence: Math.random() * 0.15 + 0.82,
    };
  }) as DailyStats[],
  topIntents: [
    { intent: 'Product Inquiry', count: 845, avgConfidence: 0.94 },
    { intent: 'Price Check', count: 623, avgConfidence: 0.96 },
    { intent: 'Stock Availability', count: 512, avgConfidence: 0.92 },
    { intent: 'Return Policy', count: 334, avgConfidence: 0.98 },
    { intent: 'Warranty Info', count: 289, avgConfidence: 0.95 },
    { intent: 'Promotions', count: 244, avgConfidence: 0.91 },
  ] as TopIntent[],
  failedQueries: [
    { id: 'f1', query: 'Can I trade in my phone?', timestamp: '2024-12-28T10:00:00Z', reason: 'No trade-in policy in knowledge base' },
    { id: 'f2', query: 'Do you offer financing?', timestamp: '2024-12-27T15:30:00Z', reason: 'Financing info not indexed' },
    { id: 'f3', query: 'Store hours for Brooklyn location', timestamp: '2024-12-27T12:15:00Z', reason: 'Store location data missing' },
  ],
  overallAccuracy: 94.2,
  totalConversations: 2847,
};
