import React from 'react';
import { Box, Flex, Text, VStack, HStack, useColorModeValue, Avatar, Button, Menu, MenuButton, MenuList, MenuItem, IconButton, useColorMode } from '@chakra-ui/react'
import { FiHome, FiSettings, FiLock, FiTrendingUp, FiShield, FiLink, FiShoppingCart, FiLogOut, FiUser, FiBriefcase, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'

const NavItem = ({ icon, children, to, isLocked = false }) => {
  const location = useLocation()
  const isActive = location.pathname === to
  const bgColor = useColorModeValue('gray.100', 'brand.800')
  const hoverBg = useColorModeValue('gray.200', 'brand.700')
  const textColor = useColorModeValue('gray.800', 'white')

  return (
    <Link to={to}>
      <HStack
        p={3}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? bgColor : 'transparent'}
        color={textColor}
        _hover={{
          bg: hoverBg,
        }}
        position="relative"
      >
        {icon}
        <Text>{children}</Text>
        {isLocked && (
          <Box position="absolute" right={2}>
            <FiLock size={14} />
          </Box>
        )}
      </HStack>
    </Link>
  )
}

const Layout = ({ children }) => {
  const { currentUser, userData } = useAuth()
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()
  const sidebarBg = useColorModeValue('white', 'brand.900')
  const borderColor = useColorModeValue('gray.200', 'brand.700')
  const mainBg = useColorModeValue('gray.50', 'brand.1000')

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/signin')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box
        w="250px"
        borderRight="1px"
        borderColor={borderColor}
        p={4}
        position="fixed"
        h="100vh"
        bg={sidebarBg}
        boxShadow={colorMode === 'light' ? 'sm' : 'none'}
      >
        <VStack spacing={4} align="stretch" h="100%">
          <HStack justify="space-between" align="center">
            <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
              Octavian
            </Text>
            <IconButton
              icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
              color={useColorModeValue('gray.800', 'white')}
            />
          </HStack>

          {/* User Profile */}
          {currentUser && (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                leftIcon={
                  <Avatar
                    size="sm"
                    src={userData?.profilePicture}
                    name={userData?.name || currentUser.email}
                  />
                }
                rightIcon={<FiChevronDown />}
                w="100%"
                justifyContent="flex-start"
                p={3}
                borderRadius="lg"
                bg={useColorModeValue('gray.100', 'brand.800')}
                _hover={{ bg: useColorModeValue('gray.200', 'brand.700') }}
                color={useColorModeValue('gray.800', 'white')}
              >
                <Box textAlign="left" overflow="hidden">
                  <Text fontSize="sm" fontWeight="bold" isTruncated>
                    {userData?.name || currentUser.email}
                  </Text>
                  <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} isTruncated>
                    {userData?.jobTitle || 'User'}
                  </Text>
                </Box>
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<FiUser />}
                  onClick={() => navigate('/profile')}
                >
                  View Profile
                </MenuItem>
                <MenuItem
                  icon={<FiBriefcase />}
                  onClick={() => navigate('/company')}
                >
                  View Company
                </MenuItem>
                <MenuItem
                  icon={<FiLogOut />}
                  onClick={handleSignOut}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          
          <VStack spacing={2} align="stretch" flex={1} overflowY="auto">
            <NavItem icon={<FiHome />} to="/">
              Home
            </NavItem>
            
            <NavItem icon={<FiTrendingUp />} to="/launchpad">
              Launchpad
            </NavItem>
            
            <NavItem icon={<FiSettings />} to="/ops" isLocked>
              Ops
            </NavItem>
            
            <NavItem icon={<FiTrendingUp />} to="/intelligence" isLocked>
              Intelligence
            </NavItem>
            
            <NavItem icon={<FiTrendingUp />} to="/pulse" isLocked>
              Pulse
            </NavItem>
            
            <NavItem icon={<FiShield />} to="/secure" isLocked>
              Secure
            </NavItem>
            
            <NavItem icon={<FiLink />} to="/connect" isLocked>
              Connect
            </NavItem>
            
            <NavItem icon={<FiShoppingCart />} to="/commerce" isLocked>
              Commerce
            </NavItem>
          </VStack>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} ml="250px" p={8} bg={mainBg}>
        {children}
      </Box>
    </Flex>
  )
}

export default Layout 