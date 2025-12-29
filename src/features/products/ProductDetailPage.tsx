import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { CardSkeleton } from '@/components/shared/SkeletonLoader';
import { useProduct, useDeleteProduct, useUpdateProduct } from '@/hooks/useDataHooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { formatCurrency, formatDate } from '@/utils/helpers';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Smartphone,
  CheckCircle,
  XCircle,
  Package,
  DollarSign,
  Calendar,
  RefreshCw,
  Database,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductFormModal from './ProductFormModal';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: product, isLoading } = useProduct(id || '');
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteProduct.mutateAsync(id);
      toast({
        title: 'Product deleted',
        description: 'The product has been removed successfully.',
      });
      navigate('/products');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleRAGIndex = async () => {
    if (!id || !product) return;
    
    setIsIndexing(true);
    try {
      await updateProduct.mutateAsync({
        id,
        data: { ragIndexed: !product.ragIndexed },
      });
      toast({
        title: product.ragIndexed ? 'Removed from RAG index' : 'Added to RAG index',
        description: product.ragIndexed 
          ? 'Product removed from the AI knowledge base.' 
          : 'Product added to the AI knowledge base.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update RAG index status.',
        variant: 'destructive',
      });
    } finally {
      setIsIndexing(false);
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return <Badge variant="success" className="text-sm">In Stock</Badge>;
      case 'low_stock':
        return <Badge variant="warning" className="text-sm">Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive" className="text-sm">Out of Stock</Badge>;
      default:
        return <Badge variant="ghost" className="text-sm">{availability}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <Smartphone className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={product.model}
        description={product.brand}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="outline" onClick={() => setEditModalOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div 
                      key={index}
                      className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border"
                    >
                      <img 
                        src={image} 
                        alt={`${product.model} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full aspect-video rounded-lg bg-muted flex items-center justify-center">
                    <Smartphone className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {product.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <dt className="text-sm font-medium text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="text-foreground mt-1">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Price</span>
                </div>
                <span className="font-semibold text-foreground">{formatCurrency(product.price)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">Stock</span>
                </div>
                <span className="font-semibold text-foreground">{product.stock} units</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">Status</span>
                </div>
                {getAvailabilityBadge(product.availability)}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Added</span>
                </div>
                <span className="text-sm text-foreground">{formatDate(product.createdAt)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm">Updated</span>
                </div>
                <span className="text-sm text-foreground">{formatDate(product.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* RAG Index Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5" />
                RAG Index
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {product.ragIndexed ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium text-foreground">Indexed</p>
                      <p className="text-sm text-muted-foreground">Available for AI responses</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Not Indexed</p>
                      <p className="text-sm text-muted-foreground">Not available for AI</p>
                    </div>
                  </>
                )}
              </div>
              <Button 
                variant={product.ragIndexed ? 'outline' : 'default'} 
                className="w-full"
                onClick={handleToggleRAGIndex}
                disabled={isIndexing}
              >
                {isIndexing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : product.ragIndexed ? (
                  'Remove from Index'
                ) : (
                  'Add to RAG Index'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{product.model}"? This action cannot be undone.
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

      {/* Edit Modal */}
      <ProductFormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        product={product}
      />
    </DashboardLayout>
  );
}
