import { useState, useEffect } from 'react';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useDataHooks';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, Loader2 } from 'lucide-react';
import type { Product } from '@/types';

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
}

interface SpecificationField {
  key: string;
  value: string;
}

export default function ProductFormModal({ open, onOpenChange, product }: ProductFormModalProps) {
  const { toast } = useToast();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: 0,
    stock: 0,
    availability: 'in_stock' as 'in_stock' | 'low_stock' | 'out_of_stock',
    description: '',
    ragIndexed: false,
  });

  const [specifications, setSpecifications] = useState<SpecificationField[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        brand: product.brand,
        model: product.model,
        price: product.price,
        stock: product.stock,
        availability: product.availability,
        description: product.description || '',
        ragIndexed: product.ragIndexed,
      });
      setSpecifications(
        Object.entries(product.specifications || {}).map(([key, value]) => ({ key, value }))
      );
      setImages(product.images || []);
    } else {
      setFormData({
        brand: '',
        model: '',
        price: 0,
        stock: 0,
        availability: 'in_stock',
        description: '',
        ragIndexed: false,
      });
      setSpecifications([]);
      setImages([]);
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const specs = specifications.reduce((acc, { key, value }) => {
      if (key.trim() && value.trim()) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    const productData = {
      ...formData,
      specifications: specs,
      images,
    };

    try {
      if (isEditing && product) {
        await updateProduct.mutateAsync({ id: product.id, data: productData });
        toast({
          title: 'Product updated',
          description: 'The product has been updated successfully.',
        });
      } else {
        await createProduct.mutateAsync(productData);
        toast({
          title: 'Product created',
          description: 'The product has been added successfully.',
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} product.`,
        variant: 'destructive',
      });
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select
                value={formData.brand}
                onValueChange={(v) => setFormData({ ...formData, brand: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apple">Apple</SelectItem>
                  <SelectItem value="Samsung">Samsung</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="OnePlus">OnePlus</SelectItem>
                  <SelectItem value="Xiaomi">Xiaomi</SelectItem>
                  <SelectItem value="Huawei">Huawei</SelectItem>
                  <SelectItem value="Sony">Sony</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., iPhone 15 Pro"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(v: 'in_stock' | 'low_stock' | 'out_of_stock') => 
                  setFormData({ ...formData, availability: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description..."
              rows={3}
            />
          </div>

          {/* Specifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Specifications</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                <Plus className="h-4 w-4 mr-1" />
                Add Spec
              </Button>
            </div>
            
            {specifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No specifications added.</p>
            ) : (
              <div className="space-y-2">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Key (e.g., Display)"
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value (e.g., 6.1 inch OLED)"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpecification(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="space-y-3">
            <Label>Images</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addImage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((url, index) => (
                  <div 
                    key={index} 
                    className="relative group w-16 h-16 rounded-lg bg-muted overflow-hidden border border-border"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-destructive/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-destructive-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RAG Index Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label>Add to RAG Index</Label>
              <p className="text-sm text-muted-foreground">
                Make this product available for AI responses
              </p>
            </div>
            <Switch
              checked={formData.ragIndexed}
              onCheckedChange={(checked) => setFormData({ ...formData, ragIndexed: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
