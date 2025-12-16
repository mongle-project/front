import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PetProvider } from './contexts/PetContext';
import { ThemeProvider } from './contexts/ThemeContext';
import GlobalStyles from './styles/GlobalStyles';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PetProvider>
          <ThemeProvider>
            <GlobalStyles />
            <div className="App">
              <AppRoutes />
            </div>
          </ThemeProvider>
        </PetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
