
import React, { useEffect, useRef, useState } from 'react';
import { storeSections, StoreSection, findPathToProduct, Product } from '@/utils/storeData';

interface StoreMapProps {
  selectedProduct: Product | null;
  userLocation: { x: number, y: number };
}

interface NavigationStep {
  instruction: string;
  distance: number;
  direction: 'left' | 'right' | 'forward' | 'destination';
  location?: string;
}

const StoreMap: React.FC<StoreMapProps> = ({ selectedProduct, userLocation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [path, setPath] = useState<{x: number, y: number}[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [navigationSteps, setNavigationSteps] = useState<NavigationStep[]>([]);
  
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
  
  // Generate navigation steps based on path and product location
  const generateNavigationSteps = (
    pathPoints: {x: number, y: number}[], 
    product: Product
  ): NavigationStep[] => {
    if (pathPoints.length < 2) return [];
    
    const steps: NavigationStep[] = [];
    
    // Generate steps for each path segment
    for (let i = 1; i < pathPoints.length; i++) {
      const prev = pathPoints[i-1];
      const current = pathPoints[i];
      
      // Calculate distance
      const distance = Math.sqrt(
        Math.pow(current.x - prev.x, 2) + 
        Math.pow(current.y - prev.y, 2)
      );
      
      // Convert to meters (rough approximation for the UI)
      const distanceInMeters = Math.round(distance / 10);
      
      // Determine direction based on angle
      const angle = Math.atan2(current.y - prev.y, current.x - prev.x) * 180 / Math.PI;
      let direction: 'left' | 'right' | 'forward' | 'destination';
      
      if (angle > -45 && angle < 45) {
        direction = 'right';
      } else if (angle >= 45 && angle < 135) {
        direction = 'forward';
      } else if (angle >= -135 && angle <= -45) {
        direction = 'forward';
      } else {
        direction = 'left';
      }
      
      // For the final step, use 'destination'
      if (i === pathPoints.length - 1) {
        direction = 'destination';
        
        // Find the section that the product is in
        const sectionId = `section-${product.category.toLowerCase().replace(/\s+&\s+|\s+/g, '-')}`;
        const section = storeSections.find(s => s.id === sectionId);
        
        steps.push({
          instruction: `Look for ${product.name}`,
          distance: distanceInMeters,
          direction,
          location: `Aisle ${product.location.aisle}, Rack ${product.location.section}, Shelf ${product.location.shelf}`
        });
      } else {
        // Regular navigation step
        steps.push({
          instruction: `Turn ${direction} and continue for ${distanceInMeters}m`,
          distance: distanceInMeters,
          direction
        });
      }
    }
    
    return steps;
  };
  
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
      
      // Generate navigation steps
      const steps = generateNavigationSteps(newPath, selectedProduct);
      setNavigationSteps(steps);
      
      // Reset animation counter
      setAnimationFrame(0);
    } else {
      setHighlight(null);
      setPath([]);
      setNavigationSteps([]);
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
    
    // Draw vertical and horizontal grid lines
    for (let i = 0; i < 1000; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 600);
      ctx.stroke();
    }
    
    for (let i = 0; i < 600; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1000, i);
      ctx.stroke();
    }
    
    // Draw all sections with improved color scheme
    storeSections.forEach((section) => {
      const { x, y, width, height } = section.coordinates;
      
      // Determine fill color - use improved contrast colors
      let fillColor = section.color || '#333';
      const baseOpacity = 0.7;
      
      // If this section is highlighted, make it glow
      if (highlight === section.id) {
        const pulseIntensity = Math.sin(animationFrame * 0.1) * 0.2 + 0.8; // Value between 0.6 and 1.0
        
        // Create a glow effect with improved visibility
        const gradient = ctx.createRadialGradient(
          x + width / 2, y + height / 2, 5,
          x + width / 2, y + height / 2, Math.max(width, height) * 0.7
        );
        
        gradient.addColorStop(0, fillColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.4 * pulseIntensity; // Increased opacity for better visibility
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
      
      // Draw the section with improved opacity for better contrast
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = baseOpacity;
      ctx.fillRect(x, y, width, height);
      ctx.globalAlpha = 1;
      
      // Draw border with increased width for better visibility
      ctx.strokeStyle = section.color || '#fff';
      ctx.lineWidth = highlight === section.id ? 3 : 1.5; // Increased border width
      ctx.strokeRect(x, y, width, height);
      
      // Add label with improved visibility
      ctx.font = 'bold 14px sans-serif'; // Made font bold
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      
      // Add text shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.fillText(section.name, x + width / 2, y + height / 2);
      
      // Reset shadow
      ctx.shadowBlur = 0;
    });
    
    // Draw path to product with brighter neon yellow
    if (path.length > 0 && highlight) {
      // Brighter neon yellow with better visibility
      ctx.strokeStyle = '#ffff00'; // Pure bright yellow
      ctx.lineWidth = 5; // Increased width
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([15, 10]); // Adjusted dash pattern
      
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
      
      // Add a stronger glow effect to the path
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)'; // Brighter glow
      ctx.lineWidth = 10;
      ctx.setLineDash([15, 10]);
      ctx.stroke();
      
      ctx.setLineDash([]);
      
      // Add direction arrows along the path
      for (let i = 1; i < path.length; i++) {
        const start = path[i-1];
        const end = path[i];
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        
        // Calculate angle for the arrow
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        
        // Draw arrow
        ctx.fillStyle = '#ffff00'; // Bright yellow
        ctx.beginPath();
        ctx.translate(midX, midY);
        ctx.rotate(angle);
        
        // Arrow shape
        ctx.moveTo(0, 0);
        ctx.lineTo(-10, -5);
        ctx.lineTo(-7, 0);
        ctx.lineTo(-10, 5);
        ctx.closePath();
        
        ctx.fill();
        
        // Reset transformations
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
      }
      
      // Draw pulsing circle at destination with improved visibility
      if (pathProgress === 1) {
        const pulseSize = Math.sin(animationFrame * 0.2) * 5 + 15; // Larger pulse (10-20)
        
        // Add outer glow
        const gradientDest = ctx.createRadialGradient(
          path[path.length - 1].x, 
          path[path.length - 1].y, 
          pulseSize * 0.3,
          path[path.length - 1].x, 
          path[path.length - 1].y, 
          pulseSize * 1.5
        );
        
        gradientDest.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
        gradientDest.addColorStop(1, 'rgba(255, 255, 0, 0)');
        
        ctx.fillStyle = gradientDest;
        ctx.beginPath();
        ctx.arc(
          path[path.length - 1].x, 
          path[path.length - 1].y, 
          pulseSize * 1.5, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
        
        // Inner circle
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(
          path[path.length - 1].x, 
          path[path.length - 1].y, 
          pulseSize * 0.5, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
        
        // Add "Product Location" text
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(
          'Product Location', 
          path[path.length - 1].x, 
          path[path.length - 1].y - 25
        );
      }
    }
    
    // Draw user location as a pulsing dot with improved visibility
    const pulseSize = Math.sin(animationFrame * 0.1) * 3 + 10; // Value between 7 and 13
    
    // Draw outer glow with better visibility
    const gradientUser = ctx.createRadialGradient(
      userLocation.x, userLocation.y, 0,
      userLocation.x, userLocation.y, pulseSize * 2.5
    );
    gradientUser.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradientUser.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
    gradientUser.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradientUser;
    ctx.beginPath();
    ctx.arc(userLocation.x, userLocation.y, pulseSize * 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw user point with improved visibility
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(userLocation.x, userLocation.y, pulseSize * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    // Add "You are here" label with improved visibility
    ctx.font = 'bold 14px sans-serif'; // Increased size and made bold
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    
    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.fillText('You are here', userLocation.x, userLocation.y - 20);
    
    // Reset the transformation and shadow
    ctx.shadowBlur = 0;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [scale, highlight, animationFrame, path, userLocation]);
  
  return (
    <div className="w-full relative overflow-hidden rounded-lg neon-border-cyan animate-fade-in glass-morphism" style={{ animationDelay: '0.4s' }}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto cursor-move"
        style={{ maxWidth: '100%' }}
      />
      
      {/* Navigation instructions panel */}
      {navigationSteps.length > 0 && (
        <div className="absolute top-4 right-4 glass-morphism p-4 rounded-md text-white max-w-xs w-full neon-border-yellow animate-fade-in-left">
          <h3 className="text-lg font-bold mb-2 neon-text-yellow">Navigation Instructions</h3>
          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto scrollbar-none">
            {navigationSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 border-b border-white/10 pb-2">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-yellow/20 flex items-center justify-center text-xs font-bold text-neon-yellow">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{step.instruction}</p>
                  {step.location && (
                    <p className="text-xs text-neon-yellow mt-1">{step.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Map legend with improved contrast */}
      <div className="absolute bottom-4 left-4 glass-morphism p-3 rounded-md text-xs">
        <h4 className="text-white font-bold mb-2">Store Sections</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="block w-4 h-4 bg-neon-cyan rounded" />
            <span className="text-white font-medium">Produce/Beverages</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block w-4 h-4 bg-neon-yellow rounded" />
            <span className="text-white font-medium">Bakery/Pantry</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block w-4 h-4 bg-neon-pink rounded" />
            <span className="text-white font-medium">Meat & Seafood</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block w-4 h-4 bg-neon-blue rounded" />
            <span className="text-white font-medium">Dairy/Frozen</span>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
            <span className="block w-4 h-4 rounded-full bg-white" />
            <span className="text-white font-medium">Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreMap;
