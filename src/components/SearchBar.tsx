
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { findProductById, findProductsByName, products } from '@/utils/storeData';
import { toast } from '@/hooks/use-toast';

interface SearchBarProps {
  onProductSelect: (productId: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onProductSelect }) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isIdSearch, setIsIdSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    const isIdPattern = /^P\d+$/i.test(value);
    setIsIdSearch(isIdPattern);
    
    if (value.length > 2) {
      if (isIdPattern) {
        const product = findProductById(value);
        if (product) {
          setSearchResults([product]);
        } else {
          setSearchResults([]);
        }
      } else {
        const results = findProductsByName(value);
        setSearchResults(results);
      }
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!search.trim()) {
      toast({
        title: "Please enter a product ID or name",
        variant: "destructive",
      });
      return;
    }
    
    if (isIdSearch) {
      const product = findProductById(search);
      if (product) {
        onProductSelect(product.id);
        setShowResults(false);
      } else {
        toast({
          title: `Product ID ${search} not found`,
          variant: "destructive",
        });
      }
    } else if (searchResults.length > 0) {
      onProductSelect(searchResults[0].id);
      setShowResults(false);
    } else {
      toast({
        title: "No products match your search",
        variant: "destructive",
      });
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
    <div ref={searchRef} className="mb-6 relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <form onSubmit={handleSubmit} className="relative flex items-stretch">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search products by ID or name..."
          className="w-full h-12 glass-morphism text-white px-4 py-2 rounded-l-md focus:outline-none focus:neon-border-cyan"
        />
        
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <button 
          type="submit"
          className="flex items-center justify-center px-4 bg-neon-yellow text-black font-medium rounded-r-md hover:bg-opacity-90 transition-all duration-200"
        >
          <Search className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>
      
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-20 mt-2 w-full glass-morphism rounded-md shadow-md neon-border-cyan animate-fade-in overflow-hidden">
          <ul className="py-1 max-h-60 overflow-y-auto scrollbar-none">
            {searchResults.map((product) => (
              <li key={product.id}>
                <button 
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors flex justify-between items-center"
                  onClick={() => handleResultClick(product.id)}
                >
                  <span>{product.name}</span>
                  <span className="text-neon-yellow text-xs">Aisle {product.location.aisle}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        <p className="text-white/70 text-sm">Examples:</p>
        <button 
          type="button" 
          className="text-neon-yellow text-sm hover:text-white transition-colors"
          onClick={() => {
            setSearch("P105");
            handleResultClick("P105");
          }}
        >
          P105
        </button>
        <button 
          type="button" 
          className="text-neon-yellow text-sm hover:text-white transition-colors"
          onClick={() => {
            setSearch("Milk");
            const results = findProductsByName("Milk");
            if (results.length > 0) {
              handleResultClick(results[0].id);
            }
          }}
        >
          Milk
        </button>
        <button 
          type="button" 
          className="text-neon-yellow text-sm hover:text-white transition-colors"
          onClick={() => {
            setSearch("Apple");
            const results = findProductsByName("Apple");
            if (results.length > 0) {
              handleResultClick(results[0].id);
            }
          }}
        >
          Apple
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
