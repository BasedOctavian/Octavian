import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react'

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('brand.800', 'brand.700');
  const borderColor = useColorModeValue('brand.700', 'brand.600');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box
        p={8}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        bg={bgColor}
      >
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <Heading size="xl">Sign In</Heading>
          <Text color="gray.400">Welcome back to Octavian</Text>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
          >
            Sign In
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default SignIn; 