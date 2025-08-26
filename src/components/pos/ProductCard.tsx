import { Product } from "@/types/pos";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToOrder: () => void;
}

export function ProductCard({ product, onAddToOrder }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-card transition-shadow duration-200 group cursor-pointer" onClick={onAddToOrder}>
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.options && product.options.length > 0 && (
                <p className="text-xs text-muted-foreground">{product.options.length} options available</p>
              )}
            </div>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToOrder();
              }}
              className="bg-gradient-accent hover:bg-accent-hover text-accent-foreground"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}