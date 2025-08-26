import { useState } from "react";
import { Product, ProductOption } from "@/types/pos";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export function ProductManagementModal({ isOpen, onClose, products, onUpdateProducts }: ProductManagementModalProps) {
  const [activeTab, setActiveTab] = useState("add");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
    options: [] as ProductOption[]
  });

  const categories = ["Main Course", "Pizza", "Salads", "Sides", "Beverages", "Desserts"];

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      image: "",
      category: "",
      description: "",
      options: []
    });
    setEditingProduct(null);
  };

  const loadProductForEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      description: product.description || "",
      options: product.options || []
    });
    setEditingProduct(product);
    setActiveTab("add");
  };

  const addOption = () => {
    const newOption: ProductOption = {
      id: `option-${Date.now()}`,
      name: "",
      priceModifier: 0
    };
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, newOption]
    }));
  };

  const updateOption = (index: number, field: keyof ProductOption, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || `product-${Date.now()}`,
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image || "/placeholder.svg",
      category: formData.category,
      description: formData.description,
      options: formData.options.filter(opt => opt.name.trim() !== "")
    };

    let updatedProducts: Product[];
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p);
      toast({
        title: "Product updated",
        description: `${productData.name} has been updated`
      });
    } else {
      updatedProducts = [...products, productData];
      toast({
        title: "Product added",
        description: `${productData.name} has been added to the menu`
      });
    }

    onUpdateProducts(updatedProducts);
    resetForm();
  };

  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    onUpdateProducts(updatedProducts);
    toast({
      title: "Product deleted",
      description: "Product has been removed from the menu"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Product Management</DialogTitle>
          <DialogDescription>
            Add new products or edit existing ones with customizable options
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">
              {editingProduct ? "Edit Product" : "Add Product"}
            </TabsTrigger>
            <TabsTrigger value="manage">Manage Products</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4">
            <ScrollArea className="h-[500px] pr-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Base Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Product description"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Product Options</Label>
                    <Button type="button" onClick={addOption} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                  {formData.options.map((option, index) => (
                    <Card key={option.id} className="p-3">
                      <div className="grid grid-cols-5 gap-2 items-center">
                        <div className="col-span-2">
                          <Input
                            placeholder="Option name (e.g., Size, Sauce)"
                            value={option.name}
                            onChange={(e) => updateOption(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Price modifier (+/-)"
                            value={option.priceModifier}
                            onChange={(e) => updateOption(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <Button type="button" onClick={() => removeOption(index)} size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  {editingProduct && (
                    <Button type="button" onClick={resetForm} variant="outline">
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="manage">
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {products.map(product => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {product.category} • ${product.price.toFixed(2)}
                              {product.options && product.options.length > 0 && (
                                <span> • {product.options.length} options</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadProductForEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}