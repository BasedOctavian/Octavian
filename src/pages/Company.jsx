import { useState } from 'react';
import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Divider,
  Heading,
  useColorModeValue,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { FiEdit2, FiSave, FiX, FiUsers, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Company = () => {
  const { userData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.companyName || 'Juicy Burger',
    description: userData?.companyDescription || 'A premium burger restaurant serving the best quality ingredients.',
    address: userData?.companyAddress || '123 Main St, Buffalo, NY 14201',
    phone: userData?.companyPhone || '(716) 555-0123',
    website: userData?.companyWebsite || 'www.juicyburger.com',
  });
  const toast = useToast();
  const bgColor = useColorModeValue('brand.800', 'brand.700');
  const borderColor = useColorModeValue('brand.700', 'brand.600');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically update the company data in Firestore
    toast({
      title: 'Company updated',
      description: 'Your company information has been updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.companyName || 'Juicy Burger',
      description: userData?.companyDescription || 'A premium burger restaurant serving the best quality ingredients.',
      address: userData?.companyAddress || '123 Main St, Buffalo, NY 14201',
      phone: userData?.companyPhone || '(716) 555-0123',
      website: userData?.companyWebsite || 'www.juicyburger.com',
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box maxW="1200px" mx="auto">
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="xl">Company</Heading>
          {!isEditing ? (
            <Button
              leftIcon={<FiEdit2 />}
              onClick={handleEdit}
              colorScheme="blue"
            >
              Edit Company
            </Button>
          ) : (
            <HStack>
              <Button
                leftIcon={<FiSave />}
                onClick={handleSave}
                colorScheme="green"
              >
                Save
              </Button>
              <Button
                leftIcon={<FiX />}
                onClick={handleCancel}
                colorScheme="red"
                variant="ghost"
              >
                Cancel
              </Button>
            </HStack>
          )}
        </HStack>

        {/* Company Stats */}
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem>
            <Stat
              p={6}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              bg={bgColor}
            >
              <StatLabel>Total Employees</StatLabel>
              <StatNumber>24</StatNumber>
              <StatHelpText>
                <FiUsers /> +2 from last month
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat
              p={6}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              bg={bgColor}
            >
              <StatLabel>Monthly Revenue</StatLabel>
              <StatNumber>$45,678</StatNumber>
              <StatHelpText>
                <FiDollarSign /> +12% from last month
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat
              p={6}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              bg={bgColor}
            >
              <StatLabel>Customer Growth</StatLabel>
              <StatNumber>+15%</StatNumber>
              <StatHelpText>
                <FiTrendingUp /> 3.2% above target
              </StatHelpText>
            </Stat>
          </GridItem>
        </Grid>

        {/* Company Information */}
        <Box
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          bg={bgColor}
        >
          <VStack spacing={6} align="stretch">
            <HStack spacing={6}>
              <Image
                src={userData?.companyPicture || "https://bloximages.chicago2.vip.townnews.com/buffalonews.com/content/tncms/assets/v3/editorial/b/11/b113bb84-97d2-11ee-a2aa-5bd60f01c346/65767d66771a1.image.jpg?crop=1662%2C873%2C0%2C187&resize=1200%2C630&order=crop%2Cresize"}
                alt={formData.name}
                borderRadius="lg"
                boxSize="200px"
                objectFit="cover"
              />
              <VStack align="start" spacing={1} flex={1}>
                {isEditing ? (
                  <FormControl>
                    <FormLabel>Company Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </FormControl>
                ) : (
                  <Text fontSize="2xl" fontWeight="bold">
                    {formData.name}
                  </Text>
                )}
                {isEditing ? (
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                    />
                  </FormControl>
                ) : (
                  <Text color="gray.400">{formData.description}</Text>
                )}
              </VStack>
            </HStack>

            <Divider />

            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <FormControl>
                <FormLabel>Address</FormLabel>
                {isEditing ? (
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                ) : (
                  <Text>{formData.address}</Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Phone</FormLabel>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <Text>{formData.phone}</Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Website</FormLabel>
                {isEditing ? (
                  <Input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                ) : (
                  <Text>{formData.website}</Text>
                )}
              </FormControl>
            </Grid>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Company; 