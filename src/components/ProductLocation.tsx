
import React from 'react';
import { Product } from '@/utils/storeData';
import { MapPin, ShoppingCart, Tag } from 'lucide-react';

interface ProductLocationProps {
  product: Product;
}

const ProductLocation: React.FC<ProductLocationProps> = ({ product }) => {
  return (
    <div className="glass-morphism rounded-lg p-6 mb-6 max-w-md mx-auto neon-border-pink animate-fade-in-right" style={{ animationDelay: '0.6s' }}>
      <h2 className="text-xl font-bold mb-4 neon-text-pink flex items-center gap-2">
        <Tag className="h-5 w-5" />
        Product Details
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-white/70">Product ID:</span>
          <span className="text-neon-yellow font-mono">{product.id}</span>
        </div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-white/70">Name:</span>
          <span className="text-white text-right font-medium">{product.name}</span>
        </div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-white/70">Category:</span>
          <span className="text-white text-right">{product.category}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-white/70">Price:</span>
          <span className="text-neon-cyan font-medium">${product.price.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="glass-morphism p-4 rounded-lg mb-4 neon-border-cyan">
        <h3 className="text-lg font-medium mb-3 neon-text-cyan flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location
        </h3>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col">
            <span className="text-white/70 text-sm mb-1">Aisle</span>
            <span className="text-white font-bold text-xl">{product.location.aisle}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/70 text-sm mb-1">Section</span>
            <span className="text-white font-bold text-xl">{product.location.section}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/70 text-sm mb-1">Shelf</span>
            <span className="text-white font-bold text-xl">{product.location.shelf}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button className="flex items-center gap-2 py-2 px-4 rounded-md bg-neon-pink/20 hover:bg-neon-pink/30 text-neon-pink transition-all duration-300 neon-glow-pink">
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductLocation;
