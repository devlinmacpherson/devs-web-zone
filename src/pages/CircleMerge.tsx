import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface Circle {
  id: number;
  level: number;
  x: number;
  y: number;
  radius: number;
  velocity: { x: number; y: number };
}

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: #2C3E50;
  padding: 20px;
  box-sizing: border-box;
`;

const GameCanvas = styled.canvas`
  border: 3px solid #34495E;
  background: #ECF0F1;
  max-height: 85vh;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const ScoreDisplay = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #ECF0F1;
  margin: 20px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-family: 'MS Sans Serif', sans-serif;
`;

// Circle properties for each level
const CIRCLES = [
  { radius: 20, color: '#FF6B6B' },   // Level 1 (smallest)
  { radius: 28, color: '#4ECDC4' },   // Level 2
  { radius: 36, color: '#45B7D1' },   // Level 3
  { radius: 44, color: '#96CEB4' },   // Level 4
  { radius: 52, color: '#FFEEAD' },   // Level 5
  { radius: 60, color: '#D4A5A5' },   // Level 6
  { radius: 68, color: '#9B59B6' },   // Level 7
  { radius: 76, color: '#3498DB' },   // Level 8
];

const CircleMerge: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [nextLevel, setNextLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Handle physics and collisions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Add resize handler
    const resizeCanvas = () => {
      const maxWidth = 600;
      const maxHeight = window.innerHeight * 0.85;
      const width = Math.min(window.innerWidth - 40, maxWidth);
      const height = Math.min(window.innerHeight * 0.85, maxHeight);
      
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const update = () => {
      if (!ctx || gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setCircles(prevCircles => {
        const updatedCircles = [...prevCircles];
        const mergedCircles: Circle[] = [];
        const removedIds = new Set<number>();

        // First pass: Update positions and apply gravity
        for (let i = 0; i < updatedCircles.length; i++) {
          const circle = updatedCircles[i];
          if (removedIds.has(circle.id)) continue;

          circle.velocity.y += 0.1;
          circle.velocity.x *= 0.98;
          circle.velocity.y *= 0.98;

          circle.x += circle.velocity.x;
          circle.y += circle.velocity.y;

          // Bounds checking
          circle.x = Math.max(circle.radius, Math.min(canvas.width - circle.radius, circle.x));
          if (circle.y + circle.radius > canvas.height) {
            circle.y = canvas.height - circle.radius;
            circle.velocity.y = 0;
            circle.velocity.x *= 0.8;
          }
        }

        // Second pass: Handle collisions with mass
        for (let i = 0; i < updatedCircles.length; i++) {
          const circle1 = updatedCircles[i];
          if (removedIds.has(circle1.id)) continue;

          for (let j = i + 1; j < updatedCircles.length; j++) {
            const circle2 = updatedCircles[j];
            if (removedIds.has(circle2.id)) continue;

            const dx = circle2.x - circle1.x;
            const dy = circle2.y - circle1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = circle1.radius + circle2.radius;

            if (distance < minDistance) {
              // Calculate masses based on radius (area)
              const mass1 = circle1.radius * circle1.radius;
              const mass2 = circle2.radius * circle2.radius;
              const totalMass = mass1 + mass2;

              // Mass ratios for position correction
              const ratio1 = mass2 / totalMass;
              const ratio2 = mass1 / totalMass;

              const nx = dx / distance;
              const ny = dy / distance;

              // Check for merge condition
              if (circle1.level === circle2.level) {
                removedIds.add(circle1.id);
                removedIds.add(circle2.id);

                if (circle1.level < CIRCLES.length - 1) {
                  mergedCircles.push({
                    id: Date.now() + Math.random(),
                    level: circle1.level + 1,
                    x: (circle1.x + circle2.x) / 2,
                    y: (circle1.y + circle2.y) / 2,
                    radius: CIRCLES[circle1.level + 1].radius,
                    velocity: {
                      x: (circle1.velocity.x * mass1 + circle2.velocity.x * mass2) / totalMass,
                      y: (circle1.velocity.y * mass1 + circle2.velocity.y * mass2) / totalMass
                    }
                  });
                  setScore(prev => prev + (circle1.level + 1) * 10);
                }
              } else {
                // Separate circles based on their masses
                const overlap = minDistance - distance;
                
                if (circle1.y + circle1.radius < canvas.height) {
                  circle1.x -= overlap * nx * ratio1;
                  circle1.y -= overlap * ny * ratio1;
                }
                if (circle2.y + circle2.radius < canvas.height) {
                  circle2.x += overlap * nx * ratio2;
                  circle2.y += overlap * ny * ratio2;
                }

                // Calculate velocity changes based on mass
                const restitution = 0.3;
                
                const dvx = circle2.velocity.x - circle1.velocity.x;
                const dvy = circle2.velocity.y - circle1.velocity.y;
                const normalVelocity = dvx * nx + dvy * ny;

                if (normalVelocity < 0) {
                  const impulse = -(1 + restitution) * normalVelocity;
                  
                  if (circle1.y + circle1.radius < canvas.height) {
                    circle1.velocity.x -= (impulse * nx * ratio1) * 0.3;
                    circle1.velocity.y -= (impulse * ny * ratio1) * 0.3;
                  }
                  if (circle2.y + circle2.radius < canvas.height) {
                    circle2.velocity.x += (impulse * nx * ratio2) * 0.3;
                    circle2.velocity.y += (impulse * ny * ratio2) * 0.3;
                  }
                }
              }
            }
          }
        }

        return [
          ...updatedCircles.filter(circle => !removedIds.has(circle.id)),
          ...mergedCircles
        ];
      });

      // Draw circles
      circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = CIRCLES[circle.level].color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [circles, gameOver]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Add new circle at click position
    const newCircle: Circle = {
      id: Date.now(),
      level: nextLevel,
      x: x,
      y: 50,
      radius: CIRCLES[nextLevel].radius,
      velocity: { x: 0, y: 0 }
    };

    setCircles(prev => [...prev, newCircle]);
    setNextLevel(Math.floor(Math.random() * 3)); // Only spawn small circles (levels 0-2)
  };

  return (
    <GameContainer>
      <ScoreDisplay>Score: {score}</ScoreDisplay>
      <GameCanvas 
        ref={canvasRef}
        width={400}
        height={600}
        onClick={handleClick}
      />
    </GameContainer>
  );
};

export default CircleMerge;