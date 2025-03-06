import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

// Import pages
import Boxdle from './pages/Boxdle';
import TCGTourney from './pages/TCGTourney';
import MagnetPoetry from './pages/MagnetPoetry';
import ComingSoon from './pages/ComingSoon';

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
    name: 'TCGTourney',
    description: 'Tournament management system for trading card games',
    path: '/tcg-tourney',
    status: 'coming-soon'
  },
  {
    name: 'Magnet Poetry',
    description: 'Create poetry by dragging and arranging words, just like magnetic poetry on your fridge!',
    path: '/magnet-poetry',
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
}

const AppContainer = styled.div<{ $isBoxdle?: boolean }>`
  background: #008080;
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
    color: #000080;
    margin: 0;
    font-size: 3rem;
    white-space: nowrap;
    animation: bounce-text 4s linear infinite alternate;
    display: inline-block;
  }

  @keyframes bounce-text {
    from { transform: translateX(50%); }
    to { transform: translateX(-50%); }
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
`;

const StatusButton = styled.div<{ $status: AppStatus; $isBoxdle?: boolean }>`
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
  transition: background-color 0.2s;
  
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
    switch (props.$status) {
      case 'ready':
        return props.$isBoxdle ? `
          background: #ff8000;
          color: #fff;
          &:hover {
            background: #ff9020;
          }
        ` : `
          background: #c0c0c0;
          color: #000;
        `;
      case 'development':
        return `
          background: #c0c0c0;
          color: #000;
        `;
      case 'coming-soon':
        return `
          background: #c0c0c0;
          color: #000;
        `;
      default:
        return `
          background: #c0c0c0;
          color: #000;
        `;
    }
  }}
`;

function App() {
  return (
    <Router>
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
                >
                  <div>
                    <h2>{app.name}</h2>
                    <p>{app.description}</p>
                  </div>
                  <StatusButton 
                    $status={app.status} 
                    $isBoxdle={app.name === 'Boxdle'}
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
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;
