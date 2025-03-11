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
import DndGenerator from './pages/DndGenerator';

type AppStatus = 'ready' | 'development' | 'maintenance' | 'coming-soon';

interface AppCardProps {
  backgroundColor?: string;
  titleColor?: string;
  textColor?: string;
  fontFamily?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

interface App {
  name: string;
  description: string;
  path: string;
  status: AppStatus;
  buttonText?: string;
  backgroundColor?: string;
  titleColor?: string;
  textColor?: string;
  fontFamily?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  icon: string;
}

interface StatusButtonProps extends AppCardProps {
  status: AppStatus;
}



const AppContainer = styled.div`
  background-image: url(${process.env.PUBLIC_URL}/images/stars.gif);
  background-repeat: repeat;
  min-height: 100vh;
  padding: 1rem;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  overflow: hidden;
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;

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
  height: 100%;
  justify-content: space-between;
  
  /* Standard Windows 98-style borders */
  background: ${props => props.backgroundColor || '#c0c0c0'};
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
    font-family: ${props => props.fontFamily || "'MS Sans Serif', sans-serif"};
    font-size: 1.2rem;
    color: ${props => props.titleColor || '#000080'};
    text-decoration: none;
  }

  p {
    margin: 0;
    font-family: ${props => props.fontFamily || "'MS Sans Serif', sans-serif"};
    color: ${props => props.textColor || '#000'};
  }
`;

const StatusButton = styled.div<StatusButtonProps>`
  margin-top: 1rem;
  padding: 0.5rem;
  text-align: center;
  font-family: ${props => props.fontFamily || "'MS Sans Serif', sans-serif"};
  font-size: 0.9rem;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
  background: ${props => props.buttonBgColor || '#c0c0c0'};
  color: ${props => props.buttonTextColor || '#000'};
  
  &:hover {
    filter: brightness(110%);
  }

  &:active {
    border-top: 2px solid #808080;
    border-left: 2px solid #808080;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
  }
`;

const IconButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  font-size: 1.2rem;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
  box-shadow: 1px 1px 0px #000;
  margin-right: 0.5rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  h2 {
    margin: 0;
    display: flex;
    align-items: center;
    height: 2rem;
  }
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

  // Define the apps array
  const apps: App[] = [
    {
      name: 'Boxdle',
      description: 'A Letterboxd-themed movie guessing game',
      path: '/boxdle',
      status: 'ready',
      buttonText: 'Play',
      backgroundColor: '#c0c0c0',
      titleColor: '#000080',
      textColor: '#000000',
      buttonBgColor: '#c0c0c0',
      buttonTextColor: '#000000',
      icon: '🎬'
    },
    {
      name: 'Magnet Poetry',
      description: 'Create poetry by dragging and arranging words, just like magnetic poetry on your fridge!',
      path: '/magnet-poetry',
      status: 'ready',
      buttonText: 'Enter',
      backgroundColor: '#c0c0c0',
      titleColor: '#000080',
      textColor: '#000000',
      buttonBgColor: '#c0c0c0',
      buttonTextColor: '#000000',
      icon: '📝'
    },
    {
      name: 'D&D One-Shot',
      description: 'Generate random D&D adventures complete with plot hooks, NPCs, and encounters!',
      path: '/dnd-generator',
      status: 'ready',
      buttonText: 'Generate',
      backgroundColor: '#c0c0c0',
      titleColor: '#000080',
      textColor: '#000000',
      buttonBgColor: '#c0c0c0',
      buttonTextColor: '#000000',
      icon: '🎲'
    },
    {
      name: 'TCGTourney',
      description: 'Tournament management system for trading card games',
      path: '/tcg-tourney',
      status: 'coming-soon',
      backgroundColor: '#c0c0c0',
      titleColor: '#000080',
      textColor: '#000000',
      icon: '🃏'
    },
    {
      name: 'More Coming Soon',
      description: 'Stay tuned for more experimental web apps!',
      path: '/coming-soon',
      status: 'coming-soon',
      backgroundColor: '#c0c0c0',
      titleColor: '#000080',
      textColor: '#000000',
      icon: '✨'
    }
  ];

  return (
    <AppContainer>
      <ContentWrapper>
        <Header>
          <h1>Dev's Web Zone</h1>
          <p>Welcome to my collection of web experiments and games!</p>
        </Header>
        <Routes>
          <Route path="/" element={
            <AppGrid>
              {apps.map((app) => (
                <AppCard 
                  key={app.path}
                  to={app.path}
                  backgroundColor={app.backgroundColor}
                  titleColor={app.titleColor}
                  textColor={app.textColor}
                  fontFamily={app.fontFamily}
                  buttonBgColor={app.buttonBgColor}
                  buttonTextColor={app.buttonTextColor}
                >
                  <div>
                    <TitleRow>
                      <IconButton>{app.icon}</IconButton>
                      <h2>{app.name}</h2>
                    </TitleRow>
                    <p>{app.description}</p>
                  </div>
                  <StatusButton 
                    status={app.status}
                    backgroundColor={app.buttonBgColor}
                    fontFamily={app.fontFamily}
                    buttonBgColor={app.buttonBgColor}
                    buttonTextColor={app.buttonTextColor}
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
          <Route path="/dnd-generator" element={<DndGenerator />} />  
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;
