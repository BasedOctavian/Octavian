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
      1000: '#091721',
      900: '#0d1f2e',
      800: '#12273b',
      700: '#162f48',
      600: '#1b3755',
      500: '#1f3f62',
      400: '#24476f',
      300: '#284f7c',
      200: '#2d5789',
      100: '#315f96',
    },
    accent: {
      500: '#EBBF5D',
      600: '#d9b155',
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
          bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.600',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.500',
            borderColor: 'accent.500',
            borderWidth: '1px',
          },
        }),
        outline: (props) => ({
          borderColor: 'accent.500',
          color: 'accent.500',
          _hover: {
            bg: 'accent.500',
            color: 'brand.1000',
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
          _hover: {
            borderColor: 'accent.500',
          },
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
            color: 'accent.500',
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
          color: 'accent.500',
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