import { Table, OrderItem } from "@/types/pos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, Receipt, X } from "lucide-react";

interface OrderPanelProps {
  selectedTable: Table | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onAddCustomerName: (name: string) => void;
  onGenerateBill: () => void;
  onClose: () => void;
}

export function OrderPanel({
  selectedTable,
  onUpdateQuantity,
  onRemoveItem,
  onAddCustomerName,
  onGenerateBill,
  onClose
}: OrderPanelProps) {
  if (!selectedTable) {
    return (
      <Card className="w-80 h-fit">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Select a table to manage orders</p>
        </CardContent>
      </Card>
    );
  }

  const subtotal = selectedTable.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <Card className="w-80 h-fit max-h-[80vh] overflow-hidden flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Table {selectedTable.number}
            <Badge className={
              selectedTable.status === 'occupied' 
                ? 'bg-pos-table-occupied text-warning-foreground'
                : 'bg-muted text-muted-foreground'
            }>
              {selectedTable.status}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <Input
            placeholder="Customer name (optional)"
            value={selectedTable.customerName || ''}
            onChange={(e) => onAddCustomerName(e.target.value)}
            className="text-sm"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-3">
          {selectedTable.items.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No items added yet
            </p>
          ) : (
            selectedTable.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.productId, Math.max(0, item.quantity - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(item.productId)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {selectedTable.items.length > 0 && (
        <div className="p-4 border-t">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total:</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <Button
            className="w-full mt-4 bg-gradient-primary hover:bg-primary-hover"
            onClick={onGenerateBill}
          >
            <Receipt className="h-4 w-4 mr-2" />
            Generate Bill
          </Button>
        </div>
      )}
    </Card>
  );
}