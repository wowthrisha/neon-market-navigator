
export interface Product {
  id: string;
  name: string;
  category: string;
  location: {
    aisle: number;
    section: string;
    shelf: string;
  };
  price: number;
  inStock: boolean;
}

export interface StoreSection {
  id: string;
  name: string;
  type: 'aisle' | 'checkout' | 'entrance' | 'exit' | 'section';
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color?: string;
}

// Store layout data
export const storeSections: StoreSection[] = [
  { 
    id: 'entrance', 
    name: 'Entrance', 
    type: 'entrance',
    coordinates: { x: 10, y: 490, width: 60, height: 40 },
    color: '#39ff14' // Green
  },
  { 
    id: 'exit', 
    name: 'Exit', 
    type: 'exit',
    coordinates: { x: 930, y: 490, width: 60, height: 40 },
    color: '#ff36f7' // Pink
  },
  { 
    id: 'checkout1', 
    name: 'Checkout 1', 
    type: 'checkout',
    coordinates: { x: 100, y: 490, width: 100, height: 40 }
  },
  { 
    id: 'checkout2', 
    name: 'Checkout 2', 
    type: 'checkout',
    coordinates: { x: 230, y: 490, width: 100, height: 40 }
  },
  { 
    id: 'checkout3', 
    name: 'Checkout 3', 
    type: 'checkout',
    coordinates: { x: 360, y: 490, width: 100, height: 40 }
  },
  { 
    id: 'checkout4', 
    name: 'Checkout 4', 
    type: 'checkout',
    coordinates: { x: 490, y: 490, width: 100, height: 40 }
  },
  { 
    id: 'checkout5', 
    name: 'Checkout 5', 
    type: 'checkout',
    coordinates: { x: 620, y: 490, width: 100, height: 40 }
  },
  { 
    id: 'checkout6', 
    name: 'Checkout 6', 
    type: 'checkout',
    coordinates: { x: 750, y: 490, width: 100, height: 40 }
  },
  // Produce Section
  { 
    id: 'section-produce', 
    name: 'Produce', 
    type: 'section',
    coordinates: { x: 50, y: 50, width: 200, height: 200 },
    color: '#0affe9' // Cyan
  },
  // Bakery Section
  { 
    id: 'section-bakery', 
    name: 'Bakery', 
    type: 'section',
    coordinates: { x: 300, y: 50, width: 150, height: 150 },
    color: '#f6fa70' // Yellow
  },
  // Meat & Seafood
  { 
    id: 'section-meat', 
    name: 'Meat & Seafood', 
    type: 'section',
    coordinates: { x: 500, y: 50, width: 200, height: 150 },
    color: '#ff36f7' // Pink
  },
  // Dairy
  { 
    id: 'section-dairy', 
    name: 'Dairy', 
    type: 'section',
    coordinates: { x: 750, y: 50, width: 180, height: 150 },
    color: '#4cc9f0' // Blue
  },
  // Frozen Foods
  { 
    id: 'section-frozen', 
    name: 'Frozen Foods', 
    type: 'section',
    coordinates: { x: 750, y: 250, width: 180, height: 180 },
    color: '#4cc9f0' // Blue
  },
  // Pantry
  { 
    id: 'section-pantry', 
    name: 'Pantry', 
    type: 'section',
    coordinates: { x: 300, y: 250, width: 400, height: 180 },
    color: '#f6fa70' // Yellow
  },
  // Beverages
  { 
    id: 'section-beverages', 
    name: 'Beverages', 
    type: 'section',
    coordinates: { x: 50, y: 300, width: 200, height: 130 },
    color: '#0affe9' // Cyan
  },
];

// Product database
export const products: Product[] = [
  {
    id: "P001",
    name: "Organic Apples",
    category: "Produce",
    location: { aisle: 1, section: "A", shelf: "Top" },
    price: 4.99,
    inStock: true
  },
  {
    id: "P002",
    name: "Whole Wheat Bread",
    category: "Bakery",
    location: { aisle: 2, section: "B", shelf: "Middle" },
    price: 3.49,
    inStock: true
  },
  {
    id: "P003",
    name: "Grass-Fed Ground Beef",
    category: "Meat & Seafood",
    location: { aisle: 3, section: "C", shelf: "Bottom" },
    price: 8.99,
    inStock: true
  },
  {
    id: "P004",
    name: "Organic Milk",
    category: "Dairy",
    location: { aisle: 4, section: "A", shelf: "Middle" },
    price: 5.49,
    inStock: true
  },
  {
    id: "P005",
    name: "Frozen Pizza",
    category: "Frozen Foods",
    location: { aisle: 5, section: "B", shelf: "Middle" },
    price: 6.99,
    inStock: true
  },
  {
    id: "P006",
    name: "Pasta Sauce",
    category: "Pantry",
    location: { aisle: 6, section: "C", shelf: "Bottom" },
    price: 2.99,
    inStock: true
  },
  {
    id: "P007",
    name: "Craft Beer 6-Pack",
    category: "Beverages",
    location: { aisle: 7, section: "A", shelf: "Bottom" },
    price: 12.99,
    inStock: true
  },
  {
    id: "P008",
    name: "Fresh Bananas",
    category: "Produce",
    location: { aisle: 1, section: "B", shelf: "Middle" },
    price: 1.99,
    inStock: true
  },
  {
    id: "P009",
    name: "Artisan Sourdough",
    category: "Bakery",
    location: { aisle: 2, section: "A", shelf: "Top" },
    price: 5.99,
    inStock: true
  },
  {
    id: "P010",
    name: "Fresh Salmon Fillet",
    category: "Meat & Seafood",
    location: { aisle: 3, section: "B", shelf: "Top" },
    price: 14.99,
    inStock: true
  },
  {
    id: "P011",
    name: "Greek Yogurt",
    category: "Dairy",
    location: { aisle: 4, section: "C", shelf: "Top" },
    price: 3.99,
    inStock: true
  },
  {
    id: "P012",
    name: "Ice Cream",
    category: "Frozen Foods",
    location: { aisle: 5, section: "A", shelf: "Bottom" },
    price: 5.49,
    inStock: true
  },
  {
    id: "P013",
    name: "Quinoa",
    category: "Pantry",
    location: { aisle: 6, section: "B", shelf: "Middle" },
    price: 6.99,
    inStock: true
  },
  {
    id: "P014",
    name: "Sparkling Water",
    category: "Beverages",
    location: { aisle: 7, section: "C", shelf: "Middle" },
    price: 1.49,
    inStock: true
  },
  {
    id: "P015",
    name: "Fresh Avocados",
    category: "Produce",
    location: { aisle: 1, section: "C", shelf: "Bottom" },
    price: 2.49,
    inStock: true
  },
];

// Function to find a product by ID
export const findProductById = (id: string): Product | undefined => {
  return products.find(product => product.id.toLowerCase() === id.toLowerCase());
};

// Function to find a product by name (case insensitive partial match)
export const findProductsByName = (name: string): Product[] => {
  const searchTerm = name.toLowerCase().trim();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm)
  );
};

// Function to get a section by category name
export const getSectionByCategory = (category: string): StoreSection | undefined => {
  const sectionId = `section-${category.toLowerCase().replace(/\s+&\s+|\s+/g, '-')}`;
  return storeSections.find(section => section.id === sectionId);
};

// Function to find closest path to a product
export const findPathToProduct = (product: Product) => {
  // This would be a pathfinding algorithm in a real app
  // For now, we'll just return some points to simulate a path
  
  const section = getSectionByCategory(product.category);
  if (!section) return [];
  
  const entrance = storeSections.find(s => s.id === 'entrance');
  if (!entrance) return [];
  
  // Simple path: entrance -> product section
  return [
    { x: entrance.coordinates.x + entrance.coordinates.width/2, y: entrance.coordinates.y + entrance.coordinates.height/2 },
    { x: section.coordinates.x + section.coordinates.width/2, y: section.coordinates.y + section.coordinates.height/2 }
  ];
};
