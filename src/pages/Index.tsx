
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import StoreMap from '@/components/StoreMap';
import ProductLocation from '@/components/ProductLocation';
import ProductCard from '@/components/ProductCard';
import { findProductById, products } from '@/utils/storeData';
import { toast } from '@/hooks/use-toast';
import { MapPin } from 'lucide-react';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState({ x: 100, y: 250 });
  
  // Handle product selection
  const handleProductSelect = (productId: string) => {
    const product = findProductById(productId);
    
    if (product) {
      setSelectedProduct(product);
      toast({
        title: `Located ${product.name}`,
        description: `In Aisle ${product.location.aisle}, Section ${product.location.section}, Shelf ${product.location.shelf}`
      });
      
      // Add to recently viewed, avoid duplicates, max 3 items
      setRecentlyViewed(prev => {
        const filtered = prev.filter(id => id !== productId);
        return [productId, ...filtered].slice(0, 3);
      });
    }
  };

  // Simulate a random user movement every 15 seconds (reduced from 20 for more frequent updates)
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random movement to simulate user walking around
      setUserLocation(prev => ({
        x: Math.max(50, Math.min(950, prev.x + (Math.random() - 0.5) * 60)),
        y: Math.max(50, Math.min(550, prev.y + (Math.random() - 0.5) * 60))
      }));
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col">
          {/* Search section */}
          <SearchBar onProductSelect={handleProductSelect} />
          
          {/* Store map */}
          <StoreMap selectedProduct={selectedProduct} userLocation={userLocation} />
          
          {/* Recently viewed products */}
          {recentlyViewed.length > 0 && (
            <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <h2 className="text-lg font-medium mb-3 text-white/90">Recently Viewed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recentlyViewed.map(id => {
                  const product = findProductById(id);
                  if (!product) return null;
                  
                  return (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={() => handleProductSelect(product.id)} 
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Product location details */}
        <div className="lg:col-span-1">
          {selectedProduct ? (
            <ProductLocation product={selectedProduct} />
          ) : (
            <div className="glass-morphism rounded-lg p-6 text-center animate-fade-in-left" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-xl font-medium mb-4 text-white">Welcome to KARTIFY</h2>
              <p className="text-white/70 mb-6">
                Search for a product by ID or name to locate it in the store.
              </p>
              <div className="flex items-center justify-center mb-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10">
                  <MapPin className="text-neon-yellow h-4 w-4" />
                  <p className="text-white text-sm">You are being tracked on the map</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {products.slice(0, 6).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product.id)}
                    className="text-left px-3 py-2 rounded-md hover:bg-white/10 transition-all duration-200"
                  >
                    <p className="text-neon-yellow text-xs font-mono">{product.id}</p>
                    <p className="text-white text-sm truncate">{product.name}</p>
                  </button>
                ))}
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>
              <p className="text-white/50 text-sm">
                Our store map highlights product locations with vibrant neon guides.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
