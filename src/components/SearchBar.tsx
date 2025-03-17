import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { findProductById, findProductsByName, products } from '@/utils/storeData';
import { toast } from '@/hooks/use-toast';

interface SearchBarProps {
  onProductSelect: (productId: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onProductSelect }) => {
  const [search, setSearch] = useState('');
  const [isIdSearch, setIsIdSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    const isIdPattern = /^P\d+$/i.test(value);
    setIsIdSearch(isIdPattern);
    
    if (value.length > 1) {
      let results;
      if (isIdPattern) {
        const product = findProductById(value);
        results = product ? [{ id: product.id, name: product.name }] : [];
      } else {
        results = findProductsByName(value).map(p => ({ id: p.id, name: p.name }));
      }
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (search.trim() === '') {
      toast("Please enter a product ID or name");
      return;
    }
    
    if (isIdSearch) {
      const product = findProductById(search);
      if (product) {
        onProductSelect(product.id);
        setShowResults(false);
      } else {
        toast(`Product ID ${search} not found`);
      }
    } else if (searchResults.length > 0) {
      onProductSelect(searchResults[0].id);
      setShowResults(false);
    } else {
      toast("No products match your search");
    }
  };
  
  const handleResultClick = (productId: string) => {
    onProductSelect(productId);
    setSearch('');
    setSearchResults([]);
    setShowResults(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const clearSearch = () => {
    setSearch('');
    setSearchResults([]);
    setShowResults(false);
  };
  
  return (
    <div 
      ref={searchRef}
      className="w-full max-w-2xl mx-auto mb-8 relative animate-fade-in" 
      style={{ animationDelay: '0.2s' }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
            <Search className="h-5 w-5" />
          </div>
          
          <input 
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Enter product ID or name..."
            className="w-full py-3 pl-10 pr-10 rounded-md glass-morphism text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan transition-all duration-300 neon-border-cyan"
          />
          
          {search && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <button 
          type="submit"
          className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan px-4 py-1 rounded text-sm transition-all duration-300 neon-glow-cyan"
        >
          Find
        </button>
      </form>
      
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-20 mt-2 w-full glass-morphism rounded-md shadow-md neon-border-cyan animate-fade-in overflow-hidden">
          <ul className="py-1 max-h-60 overflow-y-auto scrollbar-none">
            {searchResults.map((result) => (
              <li 
                key={result.id}
                className="px-4 py-2 hover:bg-white/10 cursor-pointer transition-all duration-200"
                onClick={() => handleResultClick(result.id)}
              >
                <span className="text-neon-yellow font-mono mr-2">{result.id}</span>
                <span className="text-white">{result.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        <p className="text-white/70 text-sm">Examples:</p>
        <button 
          onClick={() => handleResultClick('P001')}
          className="text-neon-cyan hover:text-white text-sm transition-colors duration-200"
        >
          P001
        </button>
        <button 
          onClick={() => handleResultClick('P005')}
          className="text-neon-pink hover:text-white text-sm transition-colors duration-200"
        >
          P005
        </button>
        <button 
          onClick={() => handleResultClick('P007')}
          className="text-neon-yellow hover:text-white text-sm transition-colors duration-200"
        >
          P007
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
