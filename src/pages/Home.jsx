import { Box, Grid, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { FiTrendingUp, FiSettings, FiShield, FiLink, FiShoppingCart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import React from 'react'

const FeatureCard = ({ icon, title, description, isLocked = false, to }) => {
  const bgColor = useColorModeValue('white', 'brand.800')
  const borderColor = useColorModeValue('gray.200', 'brand.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const descriptionColor = useColorModeValue('gray.600', 'gray.400')
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
      }}
      transition="all 0.2s"
      onClick={() => !isLocked && navigate(to)}
    >
      <VStack align="start" spacing={4}>
        {icon}
        <Heading size="md">{title}</Heading>
        <Text color={descriptionColor}>{description}</Text>
        {isLocked && (
          <Text fontSize="sm" color="yellow.400">
            Coming Soon
          </Text>
        )}
      </VStack>
    </Box>
  )
}

const Home = () => {
  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="2xl" mb={2}>
            Welcome to Octavian
          </Heading>
          <Text fontSize="xl" color="gray.400">
            Your all-in-one business management platform
          </Text>
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