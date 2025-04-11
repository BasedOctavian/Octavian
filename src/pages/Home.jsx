import { Box, Grid, Heading, Text, VStack, useColorModeValue, HStack, Image, Spinner, Center } from '@chakra-ui/react'
import { FiTrendingUp, FiSettings, FiShield, FiLink, FiShoppingCart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../hooks/useData'

const FeatureCard = ({ icon, title, description, isLocked = false, to }) => {
  const bgColor = useColorModeValue('white', 'brand.800')
  const borderColor = useColorModeValue('gray.200', 'brand.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const descriptionColor = useColorModeValue('gray.600', 'gray.400')
  const iconColor = useColorModeValue('brand.600', 'brand.400')
  const navigate = useNavigate()

  return (
    <Box
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      bg={bgColor}
      color={textColor}
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
        cursor: 'pointer',
        borderColor: 'accent.500',
        color: 'accent.500',
      }}
      transition="all 0.2s"
      onClick={() => !isLocked && navigate(to)}
    >
      <VStack align="start" spacing={4}>
        <Box color={iconColor} _hover={{ color: 'accent.500' }}>
          {icon}
        </Box>
        <Heading size="md">{title}</Heading>
        <Text color={descriptionColor}>{description}</Text>
        {isLocked && (
          <Text fontSize="sm" color="accent.500">
            Coming Soon
          </Text>
        )}
      </VStack>
    </Box>
  )
}

const Home = () => {
  const { currentUser, companies, selectedCompanyId, loading: authLoading } = useAuth();
  const { admin, loading: adminLoading } = useAdmin(currentUser?.uid);
  const selectedCompany = companies?.find(company => company.id === selectedCompanyId);

  const isLoading = authLoading || adminLoading || !currentUser || !admin || !selectedCompany;

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    if (hour < 22) return 'Good evening';
    return 'Good night';
  };

  if (isLoading) {
    return (
      <Center h="100%">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <HStack spacing={4} align="center">
            <Box
              w="48px"
              h="48px"
              borderRadius="lg"
              overflow="hidden"
              bg={useColorModeValue('gray.100', 'brand.700')}
            >
              {selectedCompany?.picture ? (
                <Image
                  src={selectedCompany.picture}
                  alt={selectedCompany.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              ) : (
                <Image
                  src="/src/assets/logo.png"
                  alt="Octavian Logo"
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              )}
            </Box>
            <VStack align="start" spacing={0}>
              <Heading size="2xl" mb={2}>
                {getTimeBasedGreeting()}, {admin?.name}!
              </Heading>
              <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')}>
                Welcome to {selectedCompany?.name || 'Octavian'}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
          <FeatureCard
            icon={<FiTrendingUp size={24} />}
            title="Launchpad"
            description="Quick wins and instant value with no/low-code tools"
            to="/launchpad"
          />
          <FeatureCard
            icon={<FiSettings size={24} />}
            title="Ops"
            description="Streamline operations and automate workflows"
            isLocked
            to="/ops"
          />
          <FeatureCard
            icon={<FiTrendingUp size={24} />}
            title="Intelligence"
            description="Data-driven insights and analytics"
            isLocked
            to="/intelligence"
          />
          <FeatureCard
            icon={<FiTrendingUp size={24} />}
            title="Pulse"
            description="Real-time monitoring and alerts"
            isLocked
            to="/pulse"
          />
          <FeatureCard
            icon={<FiShield size={24} />}
            title="Secure"
            description="Enterprise-grade security and compliance"
            isLocked
            to="/secure"
          />
          <FeatureCard
            icon={<FiLink size={24} />}
            title="Connect"
            description="Seamless integration and connectivity"
            isLocked
            to="/connect"
          />
          <FeatureCard
            icon={<FiShoppingCart size={24} />}
            title="Commerce"
            description="E-commerce and payment solutions"
            isLocked
            to="/commerce"
          />
        </Grid>
      </VStack>
    </Box>
  )
}

export default Home 