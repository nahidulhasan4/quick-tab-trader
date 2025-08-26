import { Product, Table } from "@/types/pos";
import burgerImage from "@/assets/burger-deluxe.jpg";
import saladImage from "@/assets/caesar-salad.jpg";
import pizzaImage from "@/assets/margherita-pizza.jpg";
import colaImage from "@/assets/coca-cola.jpg";
import chickenImage from "@/assets/grilled-chicken.jpg";
import friesImage from "@/assets/french-fries.jpg";

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Burger Deluxe",
    price: 12.99,
    image: burgerImage,
    category: "Main Course",
    description: "Beef burger with cheese, lettuce, tomato"
  },
  {
    id: "2", 
    name: "Caesar Salad",
    price: 8.99,
    image: saladImage,
    category: "Salads",
    description: "Fresh romaine with caesar dressing"
  },
  {
    id: "3",
    name: "Margherita Pizza",
    price: 14.99,
    image: pizzaImage, 
    category: "Pizza",
    description: "Classic tomato, mozzarella, basil"
  },
  {
    id: "4",
    name: "Coca Cola",
    price: 2.99,
    image: colaImage,
    category: "Beverages",
    description: "330ml can"
  },
  {
    id: "5",
    name: "Grilled Chicken",
    price: 16.99,
    image: chickenImage,
    category: "Main Course", 
    description: "Grilled chicken breast with vegetables"
  },
  {
    id: "6",
    name: "French Fries",
    price: 4.99,
    image: friesImage,
    category: "Sides",
    description: "Crispy golden fries"
  }
];

export const initialTables: Table[] = [
  {
    id: "table-1",
    number: 1,
    status: 'available',
    items: [],
    createdAt: new Date(),
    total: 0
  },
  {
    id: "table-2", 
    number: 2,
    status: 'available',
    items: [],
    createdAt: new Date(),
    total: 0
  },
  {
    id: "table-3",
    number: 3,
    status: 'available', 
    items: [],
    createdAt: new Date(),
    total: 0
  },
  {
    id: "table-4",
    number: 4,
    status: 'available',
    items: [],
    createdAt: new Date(),
    total: 0
  },
  {
    id: "table-5",
    number: 5,
    status: 'available',
    items: [],
    createdAt: new Date(),
    total: 0
  },
  {
    id: "table-6",
    number: 6,
    status: 'available',
    items: [],
    createdAt: new Date(),
    total: 0
  }
];