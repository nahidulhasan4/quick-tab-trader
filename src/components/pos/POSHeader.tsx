import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Settings, BarChart3, Users } from "lucide-react";

interface POSHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalTables: number;
  occupiedTables: number;
  onManageProducts: () => void;
}

export function POSHeader({ 
  searchTerm, 
  onSearchChange, 
  totalTables, 
  occupiedTables,
  onManageProducts 
}: POSHeaderProps) {
  return (
    <header className="bg-gradient-header text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">POS System</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Tables: {occupiedTables}/{totalTables}</span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Active: {occupiedTables}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10"
            onClick={onManageProducts}
          >
            <Settings className="h-4 w-4 mr-2" />
            Products
          </Button>
          
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>
      </div>
    </header>
  );
}