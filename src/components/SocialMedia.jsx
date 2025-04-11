import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Icon,
  useDisclosure,
  useToast,
  Badge,
  Progress,
  Tooltip,
  Divider,
  IconButton,
} from '@chakra-ui/react';
import { FiPlus, FiRefreshCw, FiCopy, FiLock, FiTrash2 } from 'react-icons/fi';
import { FaInstagram, FaFacebook, FaTiktok, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import SocialMediaConnectModal from './SocialMediaConnectModal';
import { getSocialMediaAccounts, updateSocialMediaPassword, removeSocialMediaAccount, addSocialMediaAccount } from '../firebase/socialMedia';
import { useAuth } from '../context/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

const getPlatformIcon = (platform) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return FaInstagram;
    case 'facebook':
      return FaFacebook;
    case 'tiktok':
      return FaTiktok;
    case 'twitter':
      return FaTwitter;
    case 'linkedin':
      return FaLinkedin;
    case 'youtube':
      return FaYoutube;
    default:
      return null;
  }
};

const getPlatformColor = (platform) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return 'pink.500';
    case 'facebook':
      return 'blue.500';
    case 'tiktok':
      return 'black';
    case 'twitter':
      return 'blue.400';
    case 'linkedin':
      return 'blue.600';
    case 'youtube':
      return 'red.500';
    default:
      return 'gray.500';
  }
};

const getPlatformResetUrl = (platform) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return 'https://www.instagram.com/accounts/password/reset/';
    case 'facebook':
      return 'https://www.facebook.com/login/identify/';
    case 'tiktok':
      return 'https://www.tiktok.com/reset-password';
    case 'twitter':
      return 'https://twitter.com/account/begin_password_reset';
    case 'linkedin':
      return 'https://www.linkedin.com/uas/request-password-reset';
    case 'youtube':
      return 'https://accounts.google.com/signin/recovery';
    default:
      return '#';
  }
};

const SocialMedia = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const fetchAccounts = async () => {
    if (!companyId) return;
    
    setLoading(true);
    try {
      const data = await getSocialMediaAccounts(companyId);
      // Convert the object to an array of accounts
      const accountsArray = Object.entries(data).map(([platform, accountData]) => ({
        id: platform,
        platform,
        ...accountData
      }));
      setAccounts(accountsArray);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch social media accounts',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchAccounts();
    }
  }, [companyId]);

  const handleConnect = async (platform, handle) => {
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

    try {
      const success = await addSocialMediaAccount(companyId, platform, handle);
      if (success) {
        toast({
          title: 'Success',
          description: `${platform} account connected successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchAccounts();
        onClose();
      } else {
        throw new Error('Failed to connect account');
      }
    } catch (error) {
      console.error('Error connecting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect account',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGeneratePassword = async (platform) => {
    if (!companyId) return;
    
    try {
      const newPassword = await updateSocialMediaPassword(companyId, platform);
      if (newPassword) {
        toast({
          title: 'Success',
          description: 'New password generated and copied to clipboard',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigator.clipboard.writeText(newPassword);
        await fetchAccounts();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCopyPassword = async (platform) => {
    const account = accounts.find(acc => acc.platform === platform);
    if (account?.password) {
      navigator.clipboard.writeText(account.password);
      toast({
        title: 'Success',
        description: 'Password copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleRemoveAccount = async (platform) => {
    if (!companyId) return;
    
    try {
      const success = await removeSocialMediaAccount(companyId, platform);
      if (success) {
        toast({
          title: 'Success',
          description: `${platform} account removed successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchAccounts();
      } else {
        throw new Error('Failed to remove account');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove account',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return 0;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgressValue = (expiryDate) => {
    const daysRemaining = getDaysRemaining(expiryDate);
    return (daysRemaining / 30) * 100;
  };

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="bold">Social Media Accounts</Text>
        <Button
          leftIcon={<Icon as={FiPlus} />}
          colorScheme="blue"
          onClick={onOpen}
        >
          Add Account
        </Button>
      </HStack>

      <VStack spacing={4} align="stretch">
        {accounts.map((account) => {
          const PlatformIcon = getPlatformIcon(account.platform);
          const daysRemaining = getDaysRemaining(account.passwordExpiry);
          const progressValue = getProgressValue(account.passwordExpiry);
          const isExpired = daysRemaining === 0;
          const resetUrl = getPlatformResetUrl(account.platform);

          return (
            <Box
              key={account.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              position="relative"
              borderColor={isExpired ? 'red.500' : 'inherit'}
              boxShadow={isExpired ? '0 0 0 1px var(--chakra-colors-red-500)' : 'none'}
            >
              <VStack align="stretch" spacing={3}>
                <HStack spacing={4}>
                  <Icon
                    as={PlatformIcon}
                    color={getPlatformColor(account.platform)}
                    boxSize={6}
                  />
                  <VStack align="start" flex={1}>
                    <Text fontWeight="bold">{account.platform}</Text>
                    <Text color="gray.500">{account.handle}</Text>
                  </VStack>
                  <Tooltip label="Remove Account">
                    <IconButton
                      icon={<Icon as={FiTrash2} />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAccount(account.platform)}
                    />
                  </Tooltip>
                </HStack>

                <Divider />

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Password Management</Text>
                  {isExpired ? (
                    <VStack spacing={3} align="stretch">
                      <Box
                        p={3}
                        bg="red.50"
                        borderWidth="1px"
                        borderColor="red.200"
                        borderRadius="md"
                      >
                        <Text color="red.600" fontWeight="bold" mb={1}>
                          ⚠️ Password Expired
                        </Text>
                        <Text fontSize="sm" color="red.600" mb={2}>
                          Your password has expired. Please reset it immediately to maintain account security.
                        </Text>
                        <Button
                          as="a"
                          href={resetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          colorScheme="red"
                          size="sm"
                          width="full"
                          leftIcon={<Icon as={FiLock} />}
                        >
                          Reset Password on {account.platform}
                        </Button>
                      </Box>
                    </VStack>
                  ) : (
                    <HStack spacing={4} align="center">
                      <Tooltip label="Generate New Password">
                        <Button
                          leftIcon={<Icon as={FiRefreshCw} />}
                          onClick={() => handleGeneratePassword(account.platform)}
                          size="sm"
                          colorScheme="blue"
                        >
                          Generate
                        </Button>
                      </Tooltip>
                      <Tooltip label="Copy Current Password">
                        <Button
                          leftIcon={<Icon as={FiCopy} />}
                          onClick={() => handleCopyPassword(account.platform)}
                          size="sm"
                          variant="outline"
                        >
                          Copy
                        </Button>
                      </Tooltip>
                      <Box flex={1}>
                        <HStack justify="space-between" mb={1}>
                          <Text fontSize="xs" color="gray.500">Expires in</Text>
                          <Badge
                            colorScheme={daysRemaining > 7 ? 'green' : 'red'}
                            fontSize="xs"
                          >
                            {daysRemaining} days
                          </Badge>
                        </HStack>
                        <Progress
                          value={progressValue}
                          colorScheme={daysRemaining > 7 ? 'green' : 'red'}
                          size="sm"
                        />
                      </Box>
                    </HStack>
                  )}
                </Box>
              </VStack>
            </Box>
          );
        })}

        {accounts.length === 0 && !loading && (
          <Text color="gray.500" textAlign="center">
            No social media accounts connected yet
          </Text>
        )}
      </VStack>

      <SocialMediaConnectModal
        isOpen={isOpen}
        onClose={onClose}
        onConnect={handleConnect}
      />
    </Box>
  );
};

export default SocialMedia; 