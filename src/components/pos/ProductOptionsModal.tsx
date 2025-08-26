import { useState } from "react";
import { Product, ProductOption } from "@/types/pos";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToOrder: (product: Product, selectedOptions: ProductOption[], finalPrice: number) => void;
}

export function ProductOptionsModal({ isOpen, onClose, product, onAddToOrder }: ProductOptionsModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<ProductOption[]>([]);

  if (!product) return null;

  const basePrice = product.price;
  const optionsPrice = selectedOptions.reduce((sum, option) => sum + option.priceModifier, 0);
  const finalPrice = basePrice + optionsPrice;

  const handleOptionToggle = (option: ProductOption, checked: boolean) => {
    if (checked) {
      setSelectedOptions(prev => [...prev, option]);
    } else {
      setSelectedOptions(prev => prev.filter(opt => opt.id !== option.id));
    }
  };

  const handleAddToOrder = () => {
    onAddToOrder(product, selectedOptions, finalPrice);
    setSelectedOptions([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedOptions([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            Customize your order with available options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <p className="text-lg font-bold text-primary">Base: ${basePrice.toFixed(2)}</p>
            </div>
          </div>

          {product.options && product.options.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Available Options:</h4>
              <ScrollArea className="max-h-48">
                <div className="space-y-2">
                  {product.options.map(option => (
                    <Card key={option.id} className="border">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={option.id}
                              checked={selectedOptions.some(opt => opt.id === option.id)}
                              onCheckedChange={(checked) => 
                                handleOptionToggle(option, checked as boolean)
                              }
                            />
                            <label htmlFor={option.id} className="font-medium cursor-pointer">
                              {option.name}
                            </label>
                          </div>
                          <span className="text-sm font-semibold">
                            {option.priceModifier >= 0 ? '+' : ''}${option.priceModifier.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total Price:</span>
              <span className="text-xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
            </div>
            
            {selectedOptions.length > 0 && (
              <div className="mb-4 text-sm text-muted-foreground">
                <p>Selected options:</p>
                <ul className="list-disc list-inside">
                  {selectedOptions.map(option => (
                    <li key={option.id}>
                      {option.name} (+${option.priceModifier.toFixed(2)})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddToOrder} className="flex-1">
                Add to Order
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}