import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/SkeletonLoader';
import { useProducts, useDeleteProduct } from '@/hooks/useDataHooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Upload,
  CheckCircle,
  XCircle,
  Smartphone,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helpers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import ProductFormModal from './ProductFormModal';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);

  const { data: products, isLoading } = useProducts({
    search,
    brand: brandFilter || undefined,
    availability: availabilityFilter || undefined,
  });

  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!selectedProductId) return;
    
    try {
      await deleteProduct.mutateAsync(selectedProductId);
      toast({
        title: 'Product deleted',
        description: 'The product has been removed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return <Badge variant="success">In Stock</Badge>;
      case 'low_stock':
        return <Badge variant="warning">Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="ghost">{availability}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Products"
        description="Manage your mobile phone inventory"
        actions={
          <div className="flex gap-3">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button onClick={() => setFormModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search products..."
          className="flex-1 max-w-md"
        />
        <div className="flex gap-3">
          <Select value={brandFilter || "all"} onValueChange={(v) => setBrandFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="samsung">Samsung</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="oneplus">OnePlus</SelectItem>
              <SelectItem value="xiaomi">Xiaomi</SelectItem>
            </SelectContent>
          </Select>
          <Select value={availabilityFilter || "all"} onValueChange={(v) => setAvailabilityFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : products?.data.length === 0 ? (
          <EmptyState
            icon={<Smartphone className="h-8 w-8 text-muted-foreground" />}
            title="No products found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={
              <Button onClick={() => setFormModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Product
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Price
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Stock
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    RAG Index
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Updated
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products?.data.map((product) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.model}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{formatCurrency(product.price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-foreground">{product.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getAvailabilityBadge(product.availability)}
                    </td>
                    <td className="px-6 py-4">
                      {product.ragIndexed ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{formatDate(product.updatedAt)}</span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/products/${product.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/products/${product.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setSelectedProductId(product.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
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

      {/* Product Form Modal */}
      <ProductFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
      />
    </DashboardLayout>
  );
}
