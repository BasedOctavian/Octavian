import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Launchpad from './pages/Launchpad'
import Ops from './pages/Ops'
import Intelligence from './pages/Intelligence'
import Pulse from './pages/Pulse'
import Secure from './pages/Secure'
import Connect from './pages/Connect'
import Commerce from './pages/Commerce'
import Profile from './pages/Profile'
import Company from './pages/Company'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      1000: '#0a0a0a',
      900: '#121212',
      800: '#1a1a1a',
      700: '#2a2a2a',
      600: '#3a3a3a',
      500: '#4a4a4a',
      400: '#5a5a5a',
      300: '#6a6a6a',
      200: '#7a7a7a',
      100: '#8a8a8a',
    },
    accent: {
      500: '#3182ce',
      600: '#2b6cb0',
    }
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'brand.1000' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      variants: {
        solid: (props) => ({
          bg: 'accent.500',
          color: 'white',
          _hover: {
            bg: 'accent.600',
          },
        }),
      },
    },
    Card: {
      baseStyle: (props) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'brand.800' : 'white',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          borderColor: props.colorMode === 'dark' ? 'brand.700' : 'gray.200',
        },
      }),
    },
    Menu: {
      baseStyle: (props) => ({
        list: {
          bg: props.colorMode === 'dark' ? 'brand.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'brand.700' : 'gray.200',
        },
        item: {
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.700' : 'gray.100',
          },
        },
      }),
    },
    NavItem: {
      baseStyle: (props) => ({
        bg: props.colorMode === 'dark' ? 'brand.800' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.700' : 'gray.100',
        },
      }),
    },
  },
})

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/signin" />;
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/launchpad"
              element={
                <PrivateRoute>
                  <Layout>
                    <Launchpad />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/ops"
              element={
                <PrivateRoute>
                  <Layout>
                    <Ops />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/intelligence"
              element={
                <PrivateRoute>
                  <Layout>
                    <Intelligence />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/pulse"
              element={
                <PrivateRoute>
                  <Layout>
                    <Pulse />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/secure"
              element={
                <PrivateRoute>
                  <Layout>
                    <Secure />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/connect"
              element={
                <PrivateRoute>
                  <Layout>
                    <Connect />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/commerce"
              element={
                <PrivateRoute>
                  <Layout>
                    <Commerce />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/company"
              element={
                <PrivateRoute>
                  <Layout>
                    <Company />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App 