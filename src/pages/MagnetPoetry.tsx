import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AppPageContainer } from '../components/SharedStyles';

const Word = styled.div`
  position: absolute;
  background: #ffffff;
  color: #000000;
  padding: 4px 8px;
  cursor: move;
  user-select: none;
  font-family: 'Times New Roman', Times, serif;
  border: 1px solid #000000;
  box-shadow: 2px 2px 0 #000000;
  max-width: calc(100% - 4rem);
  
  &:active {
    cursor: grabbing;
    box-shadow: 1px 1px 0 #000000;
    transform: translate(1px, 1px);
  }
`;

const MagnetPoetryContainer = styled(AppPageContainer)`
  background: #f8f8f8;
  min-height: 600px;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  height: auto;
`;

const Title = styled.p`
  background: #ffffff;
  color: #000000;
  padding: 4px 8px;
  cursor: move;
  user-select: none;
  font-family: 'Times New Roman', Times, serif;
  border: 1px solid #000000;
  box-shadow: 2px 2px 0 #000000;
  max-width: calc(100% - 4rem);
`;

const BackLink = styled(Link)`
  background: white;
  padding: 8px 16px;
  border: 2px solid black;
  box-shadow: 2px 2px 0 black;
  font-family: Arial, sans-serif;
  font-size: 18px;
  font-weight: normal;
  text-decoration: none;
  color: black;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: #eee;
  }
  
  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 black;
  }
`;

// Sample words - we can expand this list later
const SAMPLE_WORDS = [
  // Nouns
  'love', 'heart', 'life', 'time', 'dream', 'night', 'day', 'sun', 'moon',
  'water', 'air', 'earth', 'fire', 'wind', 'rain', 'storm', 'cloud',
  'flower', 'tree', 'star', 'sky', 'sea', 'ocean', 'mountain', 'river',
  'bird', 'cat', 'dog', 'fish', 'butterfly',
  'music', 'song', 'poetry', 'dance', 'story',
  'soul', 'spirit', 'mind', 'body', 'blood',
  'woman', 'man', 'child', 'girl', 'boy',
  'friend', 'lover', 'angel', 'devil',
  'home', 'door', 'window', 'room', 'wall',
  
  // Verbs
  'is', 'are', 'was', 'were',
  'love', 'dance', 'sing', 'cry', 'laugh', 'smile',
  'dream', 'sleep', 'wake', 'breathe', 'sigh',
  'run', 'walk', 'jump', 'fly', 'swim',
  'kiss', 'touch', 'feel', 'hold', 'embrace',
  'want', 'need', 'desire', 'wish', 'hope',
  'create', 'make', 'build', 'break', 'destroy',
  'live', 'die', 'grow', 'change', 'become',
  
  // Adjectives
  'beautiful', 'dark', 'light', 'bright', 'soft',
  'sweet', 'bitter', 'warm', 'cold', 'cool',
  'wild', 'gentle', 'quiet', 'loud', 'silent',
  'happy', 'sad', 'angry', 'peaceful', 'calm',
  'new', 'old', 'young', 'ancient', 'eternal',
  'deep', 'shallow', 'high', 'low', 'far',
  'strange', 'familiar', 'lost', 'found', 'hidden',
  
  // Pronouns & Articles
  'I', 'you', 'he', 'she', 'we', 'they',
  'my', 'your', 'our', 'their',
  'a', 'the', 'this', 'that',
  
  // Prepositions & Conjunctions
  'in', 'on', 'at', 'by', 'to', 'from',
  'with', 'without', 'through', 'between',
  'and', 'or', 'but', 'yet', 'so',
  'because', 'if', 'when', 'while', 'where',
  
  // Time & Space
  'now', 'then', 'always', 'never', 'forever',
  'here', 'there', 'everywhere', 'nowhere',
  'today', 'tomorrow', 'yesterday',
  
  // Common Phrases
  'like', 'as', 'than',
  'could', 'would', 'should',
  'will', 'can', 'must',
  
  // Punctuation (as separate magnets)
  '.', ',', '!', '?', ';', ':'
];

interface WordPosition {
  id: number;
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

const SNAP_DISTANCE = 10; // Distance in pixels when words will snap together
const HEADER_HEIGHT = 150; // Space to reserve for header in pixels

// First, create a function to get a random subset of words
const getRandomWords = (count: number) => {
  const shuffled = [...SAMPLE_WORDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const MagnetPoetry = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [words, setWords] = useState<WordPosition[]>(() => {
    // Increase to 80 words
    const selectedWords = getRandomWords(80);
    
    // Define safe area for initial word placement
    const safeWidth = 700; // Wider area
    const safeHeight = 400; // Taller area
    const margin = 30; // Slightly smaller margin to accommodate more words
    
    return selectedWords.map((word, index) => ({
      id: index,
      text: word,
      // Random position within safe area
      x: margin + Math.random() * safeWidth,
      y: HEADER_HEIGHT + margin + Math.random() * safeHeight,
      width: 0,
      height: 0
    }));
  });
  
  const [draggedWord, setDraggedWord] = useState<{
    id: number;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const wordRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Measure words after render
  useEffect(() => {
    const newWords = [...words];
    let hasUpdates = false;

    words.forEach((word) => {
      const element = wordRefs.current[word.id];
      if (element) {
        const rect = element.getBoundingClientRect();
        if (word.width !== rect.width || word.height !== rect.height) {
          const index = newWords.findIndex(w => w.id === word.id);
          newWords[index] = {
            ...word,
            width: rect.width,
            height: rect.height
          };
          hasUpdates = true;
        }
      }
    });

    if (hasUpdates) {
      setWords(newWords);
    }
  }, [words.length]); // Only re-run if number of words changes

  const measureWord = (id: number, element: HTMLDivElement | null) => {
    wordRefs.current[id] = element;
  };

  // Add effect to reposition words if they're outside bounds
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width - 100; // Leave room for word width
    const maxY = containerRect.height - 40; // Leave room for word height

    setWords(words.map(word => ({
      ...word,
      x: Math.min(Math.max(20, word.x), maxX),
      y: Math.min(Math.max(HEADER_HEIGHT, word.y), maxY)
    })));
  }, [containerRef.current]);

  const findSnapPosition = (
    currentId: number,
    x: number,
    y: number
  ): { x: number; y: number } => {
    const currentWord = words.find(w => w.id === currentId);
    if (!currentWord?.width || !currentWord?.height) return { x, y };

    let bestSnap = { x, y };
    let minDistance = SNAP_DISTANCE;

    words.forEach(word => {
      if (word.id === currentId || !word.width || !word.height) return;

      // Check horizontal alignment (words next to each other)
      if (Math.abs(y - word.y) < SNAP_DISTANCE) {
        // Snap to left
        const leftDistance = Math.abs((word.x - (currentWord.width || 0)) - x);
        if (leftDistance < minDistance) {
          minDistance = leftDistance;
          bestSnap = { 
            x: word.x - (currentWord.width || 0), 
            y: word.y 
          };
        }
        // Snap to right
        const rightDistance = Math.abs((word.x + (word.width || 0)) - x);
        if (rightDistance < minDistance) {
          minDistance = rightDistance;
          bestSnap = { 
            x: word.x + (word.width || 0), 
            y: word.y 
          };
        }
      }

      // Check vertical alignment (words above/below)
      if (Math.abs(x - word.x) < SNAP_DISTANCE) {
        // Snap to top
        const topDistance = Math.abs((word.y - (currentWord.height || 0)) - y);
        if (topDistance < minDistance) {
          minDistance = topDistance;
          bestSnap = { 
            x: word.x, 
            y: word.y - (currentWord.height || 0) 
          };
        }
        // Snap to bottom
        const bottomDistance = Math.abs((word.y + (word.height || 0)) - y);
        if (bottomDistance < minDistance) {
          minDistance = bottomDistance;
          bestSnap = { 
            x: word.x, 
            y: word.y + (word.height || 0) 
          };
        }
      }
    });

    return bestSnap;
  };

  const handleMouseDown = (
    event: React.MouseEvent,
    wordId: number,
    currentX: number,
    currentY: number
  ) => {
    const wordElement = event.target as HTMLElement;
    const wordRect = wordElement.getBoundingClientRect();
    
    setDraggedWord({
      id: wordId,
      startX: currentX,
      startY: currentY,
      offsetX: event.clientX - wordRect.left,
      offsetY: event.clientY - wordRect.top
    });
  };

  // Update handleMouseMove to keep words within bounds
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!draggedWord || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const maxX = containerRect.width - 100;
    const maxY = containerRect.height - 40;
    
    const newX = event.clientX - containerRect.left - draggedWord.offsetX;
    const newY = event.clientY - containerRect.top - draggedWord.offsetY;

    // Constrain position within bounds
    const boundedX = Math.min(Math.max(20, newX), maxX);
    const boundedY = Math.min(Math.max(HEADER_HEIGHT, newY), maxY);

    setWords(words.map(word => 
      word.id === draggedWord.id
        ? { ...word, x: boundedX, y: boundedY }
        : word
    ));
  };

  return (
    <MagnetPoetryContainer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setDraggedWord(null)}
      onMouseLeave={() => setDraggedWord(null)}
    >
      <div className="app-content">
        <Header>
          <BackLink to="/">← Home</BackLink>
          <Title>Magnet Poetry</Title>
        </Header>

        {words.map((word) => (
          <Word
            key={word.id}
            ref={(el) => measureWord(word.id, el)}
            style={{
              left: word.x,
              top: word.y,
            }}
            onMouseDown={(e) => handleMouseDown(e, word.id, word.x, word.y)}
          >
            {word.text}
          </Word>
        ))}
      </div>
    </MagnetPoetryContainer>
  );
};

export default MagnetPoetry;