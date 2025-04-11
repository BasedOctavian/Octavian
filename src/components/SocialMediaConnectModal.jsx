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
} from '@chakra-ui/react';
import { useState } from 'react';

const SocialMediaConnectModal = ({ isOpen, onClose, onConnect }) => {
  const [platform, setPlatform] = useState('');
  const [handle, setHandle] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!platform || !handle || !token) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await onConnect(platform, handle, token);
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
            </Select>

            <Input
              placeholder="Handle (e.g., @username)"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />

            <Input
              placeholder="Access Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
            />

            <Text fontSize="sm" color="gray.500">
              Note: You'll need to generate an access token from the platform's developer console.
            </Text>

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