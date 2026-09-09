import React, { useEffect, useRef } from 'react';

type GestureState = {
  active: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  path: { x: number; y: number }[];
  action: 'back' | 'forward' | null;
};

export function GestureCanvas({ gesture }: { gesture: GestureState | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match window
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', updateSize);
    updateSize();

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (gesture?.active && gesture.path.length > 2) {
        ctx.beginPath();
        ctx.moveTo(gesture.path[0].x, gesture.path[0].y);
        
        // Draw the path
        for (let i = 1; i < gesture.path.length; i++) {
          // quadratic curve for smoother lines
          const p0 = gesture.path[i - 1];
          const p1 = gesture.path[i];
          ctx.lineTo(p1.x, p1.y);
        }

        // Determine color based on action
        let strokeColor = '#7E78D2'; // Default purple
        if (gesture.action === 'back') strokeColor = '#DDA15E'; // Amber
        else if (gesture.action === 'forward') strokeColor = '#52B788'; // Green

        // Set styles for glowing effect
        ctx.lineWidth = 4;
        ctx.strokeStyle = strokeColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = strokeColor;

        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gesture]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[150]"
      style={{ opacity: gesture?.active ? 1 : 0, transition: 'opacity 0.15s ease-out' }}
    />
  );
}
