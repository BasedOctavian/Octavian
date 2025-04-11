import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Avatar,
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
  IconButton,
} from '@chakra-ui/react';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import React from 'react'

const Profile = () => {
  const { userData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    jobTitle: userData?.jobTitle || '',
    bio: userData?.bio || 'No bio available',
  });
  const toast = useToast();
  const bgColor = useColorModeValue('brand.800', 'brand.700');
  const borderColor = useColorModeValue('brand.700', 'brand.600');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically update the user data in Firestore
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || '',
      email: userData?.email || '',
      jobTitle: userData?.jobTitle || '',
      bio: userData?.bio || 'No bio available',
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
    <Box maxW="800px" mx="auto">
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="xl">Profile</Heading>
          {!isEditing ? (
            <Button
              leftIcon={<FiEdit2 />}
              onClick={handleEdit}
              colorScheme="blue"
            >
              Edit Profile
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

        <Box
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          bg={bgColor}
        >
          <VStack spacing={6} align="stretch">
            <HStack spacing={6}>
              <Avatar
                size="xl"
                src={userData?.profilePicture}
                name={formData.name}
              />
              <VStack align="start" spacing={1}>
                {isEditing ? (
                  <FormControl>
                    <FormLabel>Name</FormLabel>
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
                    <FormLabel>Job Title</FormLabel>
                    <Input
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                    />
                  </FormControl>
                ) : (
                  <Text color="gray.400">{formData.jobTitle}</Text>
                )}
              </VStack>
            </HStack>

            <Divider />

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Email</FormLabel>
                {isEditing ? (
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                  />
                ) : (
                  <Text>{formData.email}</Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Bio</FormLabel>
                {isEditing ? (
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                  />
                ) : (
                  <Text>{formData.bio}</Text>
                )}
              </FormControl>
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Profile; 