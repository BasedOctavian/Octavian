import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Divider,
  Icon,
  Link,
  useColorModeValue,
  SimpleGrid,
  Badge,
  Button,
  useToast
} from '@chakra-ui/react';
import { FiMapPin, FiPhone, FiGlobe, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Company = () => {
  const { companyId } = useParams();
  const { companies } = useAuth();
  const toast = useToast();

  const company = companies?.find(company => company.id === companyId);

  if (!company) {
    return (
      <Box p={8}>
        <Text>Company not found</Text>
      </Box>
    );
  }

  const bgColor = useColorModeValue('white', 'brand.800');
  const borderColor = useColorModeValue('gray.200', 'brand.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        {/* Header Section */}
        <Box
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
        >
          <Box h="200px" position="relative">
            <Image
              src={company.picture}
              alt={company.name}
              w="100%"
              h="100%"
              objectFit="cover"
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              p={6}
              bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
            >
              <Heading size="2xl" color="white">
                {company.name}
              </Heading>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Contact Information */}
          <Box
            borderRadius="lg"
            p={6}
            bg={bgColor}
            border="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6} align="stretch">
              <Heading size="lg">Contact Information</Heading>
              <Divider />
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Icon as={FiMapPin} color={secondaryTextColor} />
                  <Text color={textColor}>{company.address}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiPhone} color={secondaryTextColor} />
                  <Text color={textColor}>{company.contactInfo?.phone}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiGlobe} color={secondaryTextColor} />
                  <Link
                    href={`https://${company.contactInfo?.website}`}
                    isExternal
                    color="accent.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {company.contactInfo?.website}
                  </Link>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Quick Actions */}
          <Box
            borderRadius="lg"
            p={6}
            bg={bgColor}
            border="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6} align="stretch">
              <Heading size="lg">Quick Actions</Heading>
              <Divider />
              <SimpleGrid columns={2} spacing={4}>
                <Button
                  leftIcon={<FiEdit2 />}
                  variant="outline"
                  colorScheme="accent"
                  onClick={() => toast({
                    title: 'Feature Coming Soon',
                    description: 'Company editing will be available in a future update.',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                  })}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  colorScheme="accent"
                  onClick={() => toast({
                    title: 'Feature Coming Soon',
                    description: 'Analytics dashboard will be available in a future update.',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                  })}
                >
                  View Analytics
                </Button>
              </SimpleGrid>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default Company; 