import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { PetProvider } from './contexts/PetContext';
import { ThemeProvider } from './contexts/ThemeContext';
import GlobalStyles from './styles/GlobalStyles';
import AppRoutes from './routes/AppRoutes';
import theme from './styles/theme';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PetProvider>
          <ThemeProvider>
            <StyledThemeProvider theme={theme}>
              <GlobalStyles />
              <div className="App">
                <AppRoutes />
              </div>
            </StyledThemeProvider>
          </ThemeProvider>
        </PetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
