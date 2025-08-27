import { useState, useMemo } from "react";
import { Product, Table, OrderItem, Bill, ProductOption } from "@/types/pos";
import { sampleProducts, initialTables } from "@/data/sampleData";
import { POSHeader } from "@/components/pos/POSHeader";
import { ProductCard } from "@/components/pos/ProductCard";
import { TableCard } from "@/components/pos/TableCard";
import { OrderPanel } from "@/components/pos/OrderPanel";
import { BillModal } from "@/components/pos/BillModal";
import { ProductManagementModal } from "@/components/pos/ProductManagementModal";
import { ProductOptionsModal } from "@/components/pos/ProductOptionsModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export default function POSDashboard() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isProductManagementOpen, setIsProductManagementOpen] = useState(false);
  const [selectedProductForOptions, setSelectedProductForOptions] = useState<Product | null>(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const { toast } = useToast();

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const occupiedTables = tables.filter(t => t.status === 'occupied').length;

  const handleProductClick = (product: Product) => {
    if (product.options && product.options.length > 0) {
      setSelectedProductForOptions(product);
      setIsOptionsModalOpen(true);
    } else {
      addProductToTable(product, [], product.price);
    }
  };

  const addProductToTable = (product: Product, selectedOptions: ProductOption[] = [], finalPrice?: number, tableId?: string) => {
    const targetTableId = tableId || selectedTable?.id;
    if (!targetTableId) {
      toast({
        title: "No table selected",
        description: "Please select a table first",
        variant: "destructive"
      });
      return;
    }

    const price = finalPrice || product.price;
    const optionsKey = selectedOptions.map(opt => opt.id).sort().join(',');
    const uniqueItemId = `${product.id}-${optionsKey}`;

    setTables(prev => prev.map(table => {
      if (table.id === targetTableId) {
        const existingItem = table.items.find(item => 
          item.productId === product.id && 
          (item.selectedOptions?.map(opt => opt.id).sort().join(',') || '') === optionsKey
        );
        
        let updatedItems: OrderItem[];
        if (existingItem) {
          updatedItems = table.items.map(item =>
            item.productId === product.id && 
            (item.selectedOptions?.map(opt => opt.id).sort().join(',') || '') === optionsKey
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedItems = [...table.items, {
            productId: product.id,
            product,
            quantity: 1,
            selectedOptions,
            finalPrice: price
          }];
        }

        const total = updatedItems.reduce((sum, item) => 
          sum + (item.finalPrice * item.quantity), 0
        );

        return {
          ...table,
          items: updatedItems,
          status: 'occupied' as const,
          total
        };
      }
      return table;
    }));

    // Update selected table if it's the same
    if (selectedTable?.id === targetTableId) {
      const updatedTable = tables.find(t => t.id === targetTableId);
      if (updatedTable) {
        setSelectedTable(prev => prev ? { ...prev, items: updatedTable.items, total: updatedTable.total } : null);
      }
    }

    const optionsText = selectedOptions.length > 0 
      ? ` with ${selectedOptions.map(opt => opt.name).join(', ')}`
      : '';
    
    toast({
      title: "Item added",
      description: `${product.name}${optionsText} added to the order`
    });
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (!selectedTable) return;

    if (quantity === 0) {
      removeItemFromOrder(productId);
      return;
    }

    setTables(prev => prev.map(table => {
      if (table.id === selectedTable.id) {
        const updatedItems = table.items.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        const total = updatedItems.reduce((sum, item) => 
          sum + (item.finalPrice * item.quantity), 0
        );

        const updatedTable = { ...table, items: updatedItems, total };
        setSelectedTable(updatedTable);
        return updatedTable;
      }
      return table;
    }));
  };

  const removeItemFromOrder = (productId: string) => {
    if (!selectedTable) return;

    setTables(prev => prev.map(table => {
      if (table.id === selectedTable.id) {
        const updatedItems = table.items.filter(item => item.productId !== productId);
        const total = updatedItems.reduce((sum, item) => 
          sum + (item.finalPrice * item.quantity), 0
        );

        const status: Table['status'] = updatedItems.length === 0 ? 'available' : 'occupied';
        
        const updatedTable = { ...table, items: updatedItems, total, status };
        setSelectedTable(updatedTable);
        return updatedTable;
      }
      return table;
    }));

    toast({
      title: "Item removed",
      description: "Item removed from order"
    });
  };

  const updateCustomerName = (name: string) => {
    if (!selectedTable) return;

    setTables(prev => prev.map(table => {
      if (table.id === selectedTable.id) {
        const updatedTable = { ...table, customerName: name };
        setSelectedTable(updatedTable);
        return updatedTable;
      }
      return table;
    }));
  };

  const generateBill = (table?: Table) => {
    const targetTable = table || selectedTable;
    if (!targetTable || targetTable.items.length === 0) return;

    const subtotal = targetTable.items.reduce((sum, item) => 
      sum + (item.finalPrice * item.quantity), 0
    );
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const bill: Bill = {
      id: `bill-${Date.now()}`,
      tableId: targetTable.id,
      tableNumber: targetTable.number,
      customerName: targetTable.customerName,
      items: targetTable.items,
      subtotal,
      tax,
      total,
      createdAt: new Date(),
      paymentStatus: 'pending'
    };

    setCurrentBill(bill);
    setIsBillModalOpen(true);

    // Update table status to billing
    setTables(prev => prev.map(t => 
      t.id === targetTable.id 
        ? { ...t, status: 'billing' as Table['status'] }
        : t
    ));

    toast({
      title: "Bill generated",
      description: `Bill created for Table ${targetTable.number}`
    });
  };

  const markBillPaid = (billId: string) => {
    if (!currentBill) return;

    // Clear the table
    setTables(prev => prev.map(table => {
      if (table.id === currentBill.tableId) {
        return {
          ...table,
          status: 'available' as Table['status'],
          items: [],
          total: 0,
          customerName: undefined
        };
      }
      return table;
    }));

    setCurrentBill({ ...currentBill, paymentStatus: 'paid' });
    setSelectedTable(null);
    setIsBillModalOpen(false);

    toast({
      title: "Payment received",
      description: "Table cleared and ready for next customer",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <POSHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalTables={tables.length}
        occupiedTables={occupiedTables}
        onManageProducts={() => setIsProductManagementOpen(true)}
      />

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tables Section */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Tables</h2>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid gap-3">
                  {tables.map(table => (
                    <TableCard
                      key={table.id}
                      table={table}
                      onSelectTable={setSelectedTable}
                      onGenerateBill={generateBill}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Products Section */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="All" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Products</h2>
                  <TabsList>
                    {categories.map(category => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {categories.map(category => (
                  <TabsContent key={category} value={category}>
                    <ScrollArea className="h-[calc(100vh-250px)]">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts
                          .filter(product => category === 'All' || product.category === category)
                          .map(product => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              onAddToOrder={() => handleProductClick(product)}
                            />
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>

        {/* Order Panel */}
        <div className="w-80 p-6 border-l bg-pos-sidebar">
          <OrderPanel
            selectedTable={selectedTable}
            onUpdateQuantity={updateItemQuantity}
            onRemoveItem={removeItemFromOrder}
            onAddCustomerName={updateCustomerName}
            onGenerateBill={() => generateBill()}
            onClose={() => setSelectedTable(null)}
          />
        </div>
      </div>

      <BillModal
        bill={currentBill}
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        onMarkPaid={markBillPaid}
      />

      <ProductManagementModal
        isOpen={isProductManagementOpen}
        onClose={() => setIsProductManagementOpen(false)}
        products={products}
        onUpdateProducts={setProducts}
      />

      <ProductOptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        product={selectedProductForOptions}
        onAddToOrder={addProductToTable}
      />
    </div>
  );
}