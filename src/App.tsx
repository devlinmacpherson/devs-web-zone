import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import starsBackground from './images/stars.gif';

// Import pages
import Boxdle from './pages/Boxdle';
import TCGTourney from './pages/TCGTourney';
import MagnetPoetry from './pages/MagnetPoetry';
import ComingSoon from './pages/ComingSoon';
import CircleMerge from './pages/CircleMerge';

type AppStatus = 'ready' | 'development' | 'maintenance' | 'coming-soon';

interface App {
  name: string;
  description: string;
  path: string;
  status: AppStatus;
  buttonText?: string;
}

const apps: App[] = [
  {
    name: 'Boxdle',
    description: 'A Letterboxd-themed movie guessing game',
    path: '/boxdle',
    status: 'ready',
    buttonText: 'Play'
  },
  {
    name: 'Magnet Poetry',
    description: 'Create poetry by dragging and arranging words, just like magnetic poetry on your fridge!',
    path: '/magnet-poetry',
    status: 'ready',
    buttonText: 'Enter'
  },
  // {
  //   name: 'Circle Merge',
  //   description: 'Combine circles to create bigger ones! This is currently broken, but I will fix it soon.',
  //   path: '/circle-merge',
  //   status: 'development',
  //   buttonText: 'Test'
  // },
 
  {
    name: 'TCGTourney',
    description: 'Tournament management system for trading card games',
    path: '/tcg-tourney',
    status: 'coming-soon'
  },

  {
    name: 'More Coming Soon',
    description: 'Stay tuned for more experimental web apps!',
    path: '/coming-soon',
    status: 'coming-soon'
  }
];

interface AppCardProps {
  $isBoxdle?: boolean;
  $isMagnetPoetry?: boolean;
  $isCircleMerge?: boolean;
}

const AppContainer = styled.div<{ $isBoxdle?: boolean }>`
  background-image: url(${process.env.PUBLIC_URL}/images/stars.gif);
  background-repeat: repeat;
  min-height: 100vh;
  padding: ${props => props.$isBoxdle ? '0' : '1rem'};
`;

const ContentWrapper = styled.div<{ $isBoxdle?: boolean }>`
  max-width: ${props => props.$isBoxdle ? '100%' : '1200px'};
  margin: 0 auto;
`;

const Header = styled.header`
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  overflow: hidden;

  h1 {
    font-family: 'MS Sans Serif', sans-serif;
    color:rgb(255, 50, 50);
    margin: 0;
    font-size: 3rem;
    white-space: nowrap;
    display: inline-block;
    animation: 
      rotate3d 4s linear infinite,
      glow 2s ease-in-out infinite alternate;
    
    text-shadow:
      0 0 7px #fff,
      0 0 10px #fff,
      0 0 21px #fff,
      0 0 42px #0fa,
      0 0 82px #0fa;

    @keyframes rotate3d {
      from { transform: perspective(500px) rotateY(0deg); }
      to { transform: perspective(500px) rotateY(360deg); }
    }

    @keyframes glow {
      from {
        text-shadow:
          0 0 7px #fff,
          0 0 10px #fff,
          0 0 21px #fff,
          0 0 42px #0fa;
      }
      to {
        text-shadow:
          0 0 7px #fff,
          0 0 10px #fff,
          0 0 21px #fff,
          0 0 42px #0fa,
          0 0 82px #0fa,
          0 0 92px #0fa;
      }
    }
  }

  p {
    font-family: 'Brush Script MT', cursive;
    color: #fff;
    font-size: 1.5rem;
    margin-top: 1rem;
    text-shadow:
      0 0 7px #fff,
      0 0 10px #fff,
      0 0 21px #fff,
      0 0 42px #0fa,
      0 0 82px #0fa;
    animation: glow 2s ease-in-out infinite alternate;
  }
`;

const AppGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
 

`;

const AppCard = styled(Link)<AppCardProps>`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  text-decoration: none;
  color: #000;
  height: 100%;
  justify-content: space-between;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
  box-shadow: 2px 2px 0px #000;

  &:active {
    border-top: 2px solid #808080;
    border-left: 2px solid #808080;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    box-shadow: 1px 1px 0px #000;
  }

  h2 {
    margin: 0 0 1rem 0;
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 1.2rem;
    color: #000080;
    text-decoration: none;
  }

  p {
    margin: 0;
    font-family: 'MS Sans Serif', sans-serif;
    color: #000;
  }

  ${(props: AppCardProps) => props.$isBoxdle && `
    background: #14181c;
    color: #fff;

    h2 {
      color: #00E054;
      font-weight: 600;
    }

    p {
      color: #99AABB;
    }
  `}

  ${(props: AppCardProps) => props.$isMagnetPoetry && `
    background: #f8f8f8;
    border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
    
    h2, p {
      font-family: 'Times New Roman', Times, serif, cursive;
      color: #000;
    }
  `}

  ${(props: AppCardProps) => props.$isCircleMerge && `
    background:rgb(235, 58, 73);
    border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
    box-shadow: 
      2px 2px 0px #000,
      inset 2px 2px 10px rgba(255, 255, 255, 0.3);
    
    h2 {
      color: #fff;
      text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3);
      font-weight: bold;
      font-size: 1.4rem;
    }

    p {
      color: #fff;
      text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.3);
    }

   
  `}
`;

const StatusButton = styled.div<{ 
  $status: AppStatus; 
  $isBoxdle?: boolean; 
  $isMagnetPoetry?: boolean;
  $isCircleMerge?: boolean;
}>`
  margin-top: 1rem;
  padding: 0.5rem;
  text-align: center;
  font-family: 'MS Sans Serif', sans-serif;
  font-size: 0.9rem;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
  background: #c0c0c0;
  
  &:hover {
    background: #d4d4d4;
  }

  &:active {
    border-top: 2px solid #808080;
    border-left: 2px solid #808080;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
  }
  
  ${props => {
    if (props.$isCircleMerge) {
      return `
        background:rgb(123, 238, 123);
        color: #000000;
      
        border: 1px solidrgb(136, 136, 136);
        box-shadow: 2px 2px 0rgb(145, 145, 145);
        padding: 4px 8px;
        
        &:hover {
          background: #ffffff;
        }
        
        &:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0 #000000;
        }
      `;
    }
    if (props.$isMagnetPoetry) {
      return `
        background: #ffffff;
        color: #000000;
        font-family: 'Times New Roman', Times, serif;
        border: 1px solid #000000;
        box-shadow: 2px 2px 0 #000000;
        padding: 4px 8px;
        
        &:hover {
          background: #ffffff;
        }
        
        &:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0 #000000;
        }
      `;
    }
    if (props.$isBoxdle) {
      return `
        background:rgb(255, 125, 3);
        color: #000000;
      
        border: 1px solidrgb(136, 136, 136);
        box-shadow: 2px 2px 0rgb(145, 145, 145);
        padding: 4px 8px;
        
        &:hover {
          background: #ffffff;
        }
        
        &:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0 #000000;
        }
      `;
    }
    
  }}
`;

function App() {
  return (
    <Router basename="/devs-web-zone">
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isBoxdle = location.pathname === '/boxdle';

  return (
    <AppContainer $isBoxdle={isBoxdle}>
      <ContentWrapper $isBoxdle={isBoxdle}>
        {!isBoxdle && (
          <Header>
            <h1>Dev's Web Zone</h1>
            <p>Welcome to my collection of web experiments and games!</p>
          </Header>
        )}
        <Routes>
          <Route path="/" element={
            <AppGrid>
              {apps.map((app) => (
                <AppCard 
                  key={app.path}
                  to={app.path}
                  $isBoxdle={app.name === 'Boxdle'}
                  $isMagnetPoetry={app.name === 'Magnet Poetry'}
                  $isCircleMerge={app.name === 'Circle Merge'}
                >
                  <div>
                    <h2>{app.name}</h2>
                    <p>{app.description}</p>
                  </div>
                  <StatusButton 
                    $status={app.status} 
                    $isBoxdle={app.name === 'Boxdle'}
                    $isMagnetPoetry={app.name === 'Magnet Poetry'}
                    $isCircleMerge={app.name === 'Circle Merge'}
                  >
                    {app.status === 'ready' ? app.buttonText :
                     app.status === 'development' ? 'In development' :
                     app.status === 'coming-soon' ? 'Coming soon' :
                     'Under maintenance'}
                  </StatusButton>
                </AppCard>
              ))}
            </AppGrid>
          } />
          <Route path="/boxdle" element={<Boxdle />} />
          <Route path="/tcg-tourney" element={<TCGTourney />} />
          <Route path="/magnet-poetry" element={<MagnetPoetry />} />
          <Route path="/circle-merge" element={<CircleMerge />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;
