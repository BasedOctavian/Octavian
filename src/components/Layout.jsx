import React from 'react';
import { Box, Flex, Text, VStack, HStack, useColorModeValue, Avatar, Button, Menu, MenuButton, MenuList, MenuItem, IconButton, useColorMode, Image, MenuDivider } from '@chakra-ui/react'
import { FiHome, FiSettings, FiLock, FiTrendingUp, FiShield, FiLink, FiShoppingCart, FiLogOut, FiUser, FiBriefcase, FiChevronDown, FiSun, FiMoon, FiShare2 } from 'react-icons/fi'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import CompanySwitcher from './CompanySwitcher'

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
  const { currentUser, userData, companies, selectedCompanyId, switchCompany } = useAuth()
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
            <Box as="img" src="/src/assets/logo.png" alt="Octavian Logo" h="32px" />
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
                    bg={useColorModeValue('brand.500', 'brand.300')}
                    color="white"
                  />
                }
                rightIcon={<FiChevronDown />}
                w="100%"
                justifyContent="flex-start"
                p={3}
                borderRadius="lg"
                bg={useColorModeValue('gray.50', 'brand.800')}
                _hover={{ bg: useColorModeValue('gray.100', 'brand.700') }}
                color={useColorModeValue('gray.800', 'white')}
              >
                <Box textAlign="left" overflow="hidden">
                  <Text fontSize="sm" fontWeight="bold" isTruncated>
                    {userData?.name || currentUser.email}
                  </Text>
                  <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} isTruncated>
                    {companies?.find(company => company.id === selectedCompanyId)?.name || 'Select Company'}
                  </Text>
                </Box>
              </MenuButton>
              <MenuList
                minW="240px"
                py={2}
                bg={useColorModeValue('white', 'brand.800')}
                borderColor={useColorModeValue('gray.200', 'brand.700')}
                boxShadow="lg"
              >
                <MenuItem
                  icon={<FiUser size={16} />}
                  onClick={() => navigate('/profile')}
                  py={2}
                  px={4}
                  _hover={{ bg: useColorModeValue('gray.50', 'brand.700') }}
                >
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">View Profile</Text>
                    <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>Manage your account</Text>
                  </Box>
                </MenuItem>
                <MenuItem
                  icon={<FiBriefcase size={16} />}
                  onClick={() => navigate(`/company/${selectedCompanyId}`)}
                  py={2}
                  px={4}
                  _hover={{ bg: useColorModeValue('gray.50', 'brand.700') }}
                >
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">View Company</Text>
                    <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>Manage company settings</Text>
                  </Box>
                </MenuItem>
                {companies?.length > 1 && (
                  <>
                    <MenuDivider borderColor={useColorModeValue('gray.200', 'brand.700')} />
                    <Box px={4} py={2}>
                      <Text fontSize="xs" fontWeight="bold" color={useColorModeValue('gray.500', 'gray.400')} mb={2}>
                        SWITCH COMPANY
                      </Text>
                      {companies.map((company) => (
                        <MenuItem
                          key={company.id}
                          onClick={() => switchCompany(company.id)}
                          py={2}
                          px={4}
                          bg={company.id === selectedCompanyId ? useColorModeValue('gray.50', 'brand.700') : 'transparent'}
                          _hover={{ bg: useColorModeValue('gray.50', 'brand.700') }}
                        >
                          <HStack spacing={3}>
                            <Box
                              w="32px"
                              h="32px"
                              borderRadius="md"
                              overflow="hidden"
                              bg={useColorModeValue('gray.100', 'brand.700')}
                            >
                              {company.picture && (
                                <Image
                                  src={company.picture}
                                  alt={company.name}
                                  w="100%"
                                  h="100%"
                                  objectFit="cover"
                                />
                              )}
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="medium">{company.name}</Text>
                              <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
                                {company.address}
                              </Text>
                            </Box>
                          </HStack>
                        </MenuItem>
                      ))}
                    </Box>
                  </>
                )}
                <MenuDivider borderColor={useColorModeValue('gray.200', 'brand.700')} />
                <MenuItem
                  icon={<FiLogOut size={16} />}
                  onClick={handleSignOut}
                  py={2}
                  px={4}
                  color="red.500"
                  _hover={{ bg: useColorModeValue('red.50', 'red.900') }}
                >
                  <Text fontSize="sm" fontWeight="medium">Sign Out</Text>
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
        <Outlet />
      </Box>
    </Flex>
  )
}

export default Layout 