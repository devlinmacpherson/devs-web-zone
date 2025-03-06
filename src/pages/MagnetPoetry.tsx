import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MagnetPoetryContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #f8f8f8; // Very light grey, almost white
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden; // Prevent scrolling
  font-family: 'Times New Roman', Times, serif;
`;

const Header = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .back-link {
    text-decoration: none;
    color: #000000;
    display: inline-block;
    background: #ffffff;
    padding: 4px 8px;
    border: 1px solid #000000;
    box-shadow: 2px 2px 0 #000000;
    font-family: 'Times New Roman', Times, serif;
    
    &:hover {
      text-decoration: none;
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0 #000000;
    }
  }
`;

const Title = styled.div`
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 9;
  font-family: 'Times New Roman', Times, serif;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #000000;
    font-family: 'Times New Roman', Times, serif;
    font-weight: normal;
    font-style: italic;
  }

  p {
    color: #000000;
    font-family: 'Times New Roman', Times, serif;
    font-size: 1.1rem;
  }
`;

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
  
  &:active {
    cursor: grabbing;
    box-shadow: 1px 1px 0 #000000;
    transform: translate(1px, 1px);
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

const MagnetPoetry = () => {
  const [words, setWords] = useState<WordPosition[]>(() => 
    SAMPLE_WORDS.map((word, index) => ({
      id: index,
      text: word,
      x: Math.random() * (window.innerWidth - 100),
      y: HEADER_HEIGHT + Math.random() * (window.innerHeight - HEADER_HEIGHT - 40),
      width: 0,
      height: 0
    }))
  );
  
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
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    setDraggedWord({
      id: wordId,
      startX: currentX,
      startY: currentY,
      offsetX,
      offsetY
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!draggedWord) return;

    const newX = event.clientX - draggedWord.offsetX;
    const newY = Math.max(HEADER_HEIGHT, event.clientY - draggedWord.offsetY);

    // Find snap position
    const { x: snapX, y: snapY } = findSnapPosition(draggedWord.id, newX, newY);

    setWords(words.map(word => 
      word.id === draggedWord.id
        ? { ...word, x: snapX, y: snapY }
        : word
    ));
  };

  return (
    <MagnetPoetryContainer
      onMouseMove={handleMouseMove}
      onMouseUp={() => setDraggedWord(null)}
      onMouseLeave={() => setDraggedWord(null)}
    >
      <Header>
        <Link to="/" className="back-link">← Home</Link>
      </Header>
      <Title>
        <h1>Magnet Poetry</h1>
        <p>Drag words to create your poem</p>
      </Title>

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
    </MagnetPoetryContainer>
  );
};

export default MagnetPoetry;