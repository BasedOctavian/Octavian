import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Input,
  Button,
  Select,
  Text,
  useToast,
  HStack,
  Progress,
  Box,
  Icon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { updateSocialMediaPassword } from '../firebase/socialMedia';
import { FiCopy, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

const SocialMediaConnectModal = ({ isOpen, onClose, onConnect }) => {
  const [platform, setPlatform] = useState('');
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordExpiry, setPasswordExpiry] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const toast = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCompanyId = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.companyIDs && userData.companyIDs.length > 0) {
              setCompanyId(userData.companyIDs[0]);
            }
          }
        } catch (error) {
          console.error('Error fetching company ID:', error);
        }
      }
    };

    fetchCompanyId();
  }, [currentUser]);

  const handleSubmit = async () => {
    if (!platform || !handle) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!companyId) {
      toast({
        title: 'Error',
        description: 'No company ID found',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await onConnect(platform, handle);
      toast({
        title: 'Success',
        description: 'Account connected successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect account',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePassword = async () => {
    if (!platform) {
      toast({
        title: 'Error',
        description: 'Please select a platform first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const newPassword = await updateSocialMediaPassword(platform);
      if (newPassword) {
        setPassword(newPassword);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        setPasswordExpiry(expiryDate);
        toast({
          title: 'Success',
          description: 'New password generated and copied to clipboard',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigator.clipboard.writeText(newPassword);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast({
        title: 'Success',
        description: 'Password copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const getDaysRemaining = () => {
    if (!passwordExpiry) return 0;
    const now = new Date();
    const expiry = new Date(passwordExpiry);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgressValue = () => {
    const daysRemaining = getDaysRemaining();
    return (daysRemaining / 30) * 100;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect Social Media Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Select
              placeholder="Select platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
            </Select>

            <Input
              placeholder="Handle (e.g., @username)"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />

            {password && (
              <Box w="100%">
                <Text fontSize="sm" mb={2}>Password Status</Text>
                <Progress
                  value={getProgressValue()}
                  colorScheme={getDaysRemaining() > 7 ? 'green' : 'red'}
                  size="sm"
                  mb={2}
                />
                <Text fontSize="xs" color="gray.500">
                  {getDaysRemaining()} days remaining
                </Text>
                <HStack mt={2}>
                  <Button
                    leftIcon={<Icon as={FiRefreshCw} />}
                    onClick={handleGeneratePassword}
                    isLoading={loading}
                    size="sm"
                  >
                    Generate New Password
                  </Button>
                  <Button
                    leftIcon={<Icon as={FiCopy} />}
                    onClick={handleCopyPassword}
                    size="sm"
                  >
                    Copy Password
                  </Button>
                </HStack>
              </Box>
            )}

            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={loading}
              width="full"
            >
              Connect Account
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SocialMediaConnectModal; 