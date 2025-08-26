import { Table } from "@/types/pos";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Receipt, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableCardProps {
  table: Table;
  onSelectTable: (table: Table) => void;
  onGenerateBill: (table: Table) => void;
}

export function TableCard({ table, onSelectTable, onGenerateBill }: TableCardProps) {
  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-muted text-muted-foreground';
      case 'occupied':
        return 'bg-pos-table-occupied text-warning-foreground';
      case 'billing':
        return 'bg-pos-table-active text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTableStyle = (status: Table['status']) => {
    switch (status) {
      case 'occupied':
        return 'border-pos-table-occupied shadow-table hover:shadow-lg';
      case 'billing':
        return 'border-pos-table-active shadow-table hover:shadow-lg';
      default:
        return 'border-border hover:shadow-card';
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer",
        getTableStyle(table.status)
      )}
      onClick={() => onSelectTable(table)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-lg">Table {table.number}</span>
          </div>
          <Badge className={getStatusColor(table.status)}>
            {table.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {table.customerName && (
          <p className="text-sm text-muted-foreground">
            Customer: {table.customerName}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {table.items.length} items
          </div>
          {table.total > 0 && (
            <span className="font-semibold text-primary">
              ${table.total.toFixed(2)}
            </span>
          )}
        </div>

        {table.status === 'occupied' && table.items.length > 0 && (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onGenerateBill(table);
            }}
            className="w-full bg-gradient-primary hover:bg-primary-hover"
          >
            <Receipt className="h-4 w-4 mr-2" />
            Generate Bill
          </Button>
        )}
      </CardContent>
    </Card>
  );
}