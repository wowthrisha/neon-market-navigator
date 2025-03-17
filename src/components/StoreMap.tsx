
import React, { useEffect, useRef, useState } from 'react';
import { storeSections, StoreSection, findPathToProduct, Product } from '@/utils/storeData';

interface StoreMapProps {
  selectedProduct: Product | null;
  userLocation: { x: number, y: number };
}

const StoreMap: React.FC<StoreMapProps> = ({ selectedProduct, userLocation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [path, setPath] = useState<{x: number, y: number}[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Calculate the scale for the map based on window size
  useEffect(() => {
    const updateScale = () => {
      const maxWidth = Math.min(window.innerWidth - 40, 1000);
      setScale(maxWidth / 1000);
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    
    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, []);
  
  // Set highlight and path when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      // Find section that matches the product category
      const sectionId = `section-${selectedProduct.category.toLowerCase().replace(/\s+&\s+|\s+/g, '-')}`;
      setHighlight(sectionId);
      
      // Calculate path to product with user's current location as starting point
      let newPath = [
        { x: userLocation.x, y: userLocation.y }, 
        ...findPathToProduct(selectedProduct)
      ];
      setPath(newPath);
      
      // Reset animation counter
      setAnimationFrame(0);
    } else {
      setHighlight(null);
      setPath([]);
    }
  }, [selectedProduct, userLocation]);
  
  // Animation loop for pulsing effects
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 60);
    }, 50);
    
    return () => clearInterval(animationInterval);
  }, []);
  
  // Draw the store map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match scaled size
    canvas.width = 1000 * scale;
    canvas.height = 600 * scale;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    
    // Draw store background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 1000, 600);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // Draw vertical grid lines
    for (let i = 0; i < 1000; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 600);
      ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let i = 0; i < 600; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1000, i);
      ctx.stroke();
    }
    
    // Draw all sections
    storeSections.forEach((section) => {
      const { x, y, width, height } = section.coordinates;
      
      // Determine fill color
      let fillColor = section.color || '#333';
      
      // If this section is highlighted, make it glow
      if (highlight === section.id) {
        const pulseIntensity = Math.sin(animationFrame * 0.1) * 0.2 + 0.8; // Value between 0.6 and 1.0
        
        // Create a glow effect
        const gradient = ctx.createRadialGradient(
          x + width / 2, y + height / 2, 5,
          x + width / 2, y + height / 2, Math.max(width, height) * 0.7
        );
        
        gradient.addColorStop(0, fillColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3 * pulseIntensity;
        ctx.beginPath();
        ctx.ellipse(
          x + width / 2, 
          y + height / 2, 
          width * 0.7, 
          height * 0.7, 
          0, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Make the highlighted section brighter
        fillColor = section.color || '#666';
      }
      
      // Draw the section
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(x, y, width, height);
      ctx.globalAlpha = 1;
      
      // Draw border
      ctx.strokeStyle = section.color || '#fff';
      ctx.lineWidth = highlight === section.id ? 2 : 1;
      ctx.strokeRect(x, y, width, height);
      
      // Add label
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(section.name, x + width / 2, y + height / 2);
    });
    
    // Draw path to product
    if (path.length > 0 && highlight) {
      ctx.strokeStyle = '#f6fa70'; // Neon yellow path
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([10, 10]);
      
      const pathProgress = Math.min(1, animationFrame / 30); // Animation takes 30 frames
      
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      
      // Animate the path drawing
      for (let i = 1; i < path.length; i++) {
        const segment = {
          startX: path[i-1].x,
          startY: path[i-1].y,
          endX: path[i].x,
          endY: path[i].y
        };
        
        // Calculate current point on this segment
        if (i === 1) {
          const segmentLength = Math.sqrt(
            Math.pow(segment.endX - segment.startX, 2) + 
            Math.pow(segment.endY - segment.startY, 2)
          );
          
          const progress = pathProgress * segmentLength;
          const angle = Math.atan2(segment.endY - segment.startY, segment.endX - segment.startX);
          
          const currentX = segment.startX + Math.cos(angle) * progress;
          const currentY = segment.startY + Math.sin(angle) * progress;
          
          ctx.lineTo(currentX, currentY);
        } else {
          ctx.lineTo(segment.endX, segment.endY);
        }
      }
      ctx.stroke();
      
      // Add a subtle glow effect to the path
      ctx.strokeStyle = 'rgba(246, 250, 112, 0.3)';
      ctx.lineWidth = 8;
      ctx.setLineDash([10, 10]);
      ctx.stroke();
      
      ctx.setLineDash([]);
      
      // Draw pulsing circle at destination
      if (pathProgress === 1) {
        const pulseSize = Math.sin(animationFrame * 0.2) * 5 + 10; // Value between 5 and 15
        ctx.fillStyle = '#f6fa70'; // Neon yellow
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(path[path.length - 1].x, path[path.length - 1].y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Draw user location as a pulsing dot
    const pulseSize = Math.sin(animationFrame * 0.1) * 2 + 8; // Value between 6 and 10
    
    // Draw outer glow
    const gradientUser = ctx.createRadialGradient(
      userLocation.x, userLocation.y, 0,
      userLocation.x, userLocation.y, pulseSize * 2
    );
    gradientUser.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    gradientUser.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradientUser.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradientUser;
    ctx.beginPath();
    ctx.arc(userLocation.x, userLocation.y, pulseSize * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw user point
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(userLocation.x, userLocation.y, pulseSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // Add "You are here" label
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('You are here', userLocation.x, userLocation.y - 15);
    
    // Reset the transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
  }, [scale, highlight, animationFrame, path, userLocation]);
  
  return (
    <div className="w-full relative overflow-hidden rounded-lg neon-border-cyan animate-fade-in glass-morphism" style={{ animationDelay: '0.4s' }}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto cursor-move"
        style={{ maxWidth: '100%' }}
      />
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 glass-morphism p-2 rounded-md text-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="block w-3 h-3 bg-neon-cyan" />
            <span className="text-white">Produce/Beverages</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block w-3 h-3 bg-neon-yellow" />
            <span className="text-white">Bakery/Pantry</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block w-3 h-3 bg-neon-pink" />
            <span className="text-white">Meat & Seafood</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block w-3 h-3 bg-neon-blue" />
            <span className="text-white">Dairy/Frozen</span>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
            <span className="block w-3 h-3 rounded-full bg-white" />
            <span className="text-white">Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreMap;
