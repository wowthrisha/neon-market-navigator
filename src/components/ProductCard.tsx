
import React from 'react';
import { Product } from '@/utils/storeData';
import { MapPin, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="glass-morphism rounded-lg p-4 cursor-pointer hover:neon-border-cyan transition-all duration-300 animate-fade-in"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-white">{product.name}</h3>
        <span className="text-neon-yellow text-sm font-mono">{product.id}</span>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <span className="text-white/70 text-sm">{product.category}</span>
        <span className="text-neon-cyan">${product.price.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-white/80 text-sm">
          <MapPin className="h-3 w-3 text-neon-pink" />
          <span>Aisle {product.location.aisle}</span>
        </div>
        
        <button 
          className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200 text-white/70 hover:text-neon-pink"
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart functionality would go here
          }}
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
