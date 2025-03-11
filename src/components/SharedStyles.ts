import styled from 'styled-components';

export const AppPageContainer = styled.div`
  padding: 2rem;
  background: white;
  color: black;
  width: calc(100% - 8rem); // Adjusted to account for new outer margin
  max-width: calc(1200px - 8rem); // Adjusted to account for new outer margin
  min-width: 320px;
  margin: 2rem 4rem; // Added consistent margin on all sides
  height: fit-content;
  box-sizing: border-box;

  /* Windows 98-style borders */
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
  box-shadow: 2px 2px 0px #000;

  // Add a consistent inner container for content
  .app-content {
    width: 100%;
    margin: 0 auto;
  }
`;

// Also update the AppContainer in App.tsx to show the grey background
export const AppContainer = styled.div`
  background: #c0c0c0; // Windows 98 grey
  background-image: url(${process.env.PUBLIC_URL}/images/stars.gif);
  background-repeat: repeat;
  min-height: 100vh;
  padding: 1rem;
`;