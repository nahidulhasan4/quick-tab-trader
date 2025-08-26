import { Product } from "@/types/pos";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToOrder: (product: Product) => void;
}

export function ProductCard({ product, onAddToOrder }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-card transition-shadow duration-200 group">
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
            <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
            <Button
              size="sm"
              onClick={() => onAddToOrder(product)}
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