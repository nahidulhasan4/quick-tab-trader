import { Bill } from "@/types/pos";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, Download, Check } from "lucide-react";

interface BillModalProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkPaid: (billId: string) => void;
}

export function BillModal({ bill, isOpen, onClose, onMarkPaid }: BillModalProps) {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    console.log("Downloading bill...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Bill #{bill.id.slice(-6)}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Restaurant Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-xl font-bold">Your Restaurant</h2>
            <p className="text-sm text-muted-foreground">123 Main Street</p>
            <p className="text-sm text-muted-foreground">Phone: (555) 123-4567</p>
          </div>

          {/* Bill Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Table:</span>
              <span>#{bill.tableNumber}</span>
            </div>
            {bill.customerName && (
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{bill.customerName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{bill.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{bill.createdAt.toLocaleTimeString()}</span>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-2">
            {bill.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="flex-1">
                  <div>{item.product.name}</div>
                  <div className="text-muted-foreground">
                    ${item.product.price.toFixed(2)} x {item.quantity}
                  </div>
                </div>
                <div className="font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${bill.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${bill.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-1">
              <span>Total:</span>
              <span className="text-primary">${bill.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Status */}
          <div className="text-center py-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              bill.paymentStatus === 'paid' 
                ? 'bg-success/10 text-success' 
                : 'bg-warning/10 text-warning'
            }`}>
              {bill.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handlePrint} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
            {bill.paymentStatus === 'pending' && (
              <Button 
                onClick={() => onMarkPaid(bill.id)}
                className="flex-1 bg-gradient-accent hover:bg-accent-hover"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Paid
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}