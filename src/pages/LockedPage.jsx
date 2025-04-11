import { Box, VStack, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react'
import { FiLock } from 'react-icons/fi'
import React from 'react'

const LockedPage = ({ title, description }) => {
  const bgColor = useColorModeValue('brand.800', 'brand.700')
  const borderColor = useColorModeValue('brand.700', 'brand.600')

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="70vh"
    >
      <Box
        p={8}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        bg={bgColor}
        textAlign="center"
        maxW="500px"
        w="100%"
      >
        <VStack spacing={6}>
          <FiLock size={48} color="#ECC94B" />
          <Heading size="xl">{title}</Heading>
          <Text color="gray.400" fontSize="lg">
            {description}
          </Text>
          <Text color="yellow.400">
            This feature will be available in a future release
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}

export default LockedPage 