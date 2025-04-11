import { Box, Grid, Heading, Text, VStack, Button, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Input, Textarea, HStack, Image, Link, Badge, SimpleGrid, useToast } from '@chakra-ui/react'
import { FiStar, FiCreditCard, FiMenu, FiGift, FiShare2, FiExternalLink } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import React from 'react'
import { addSocialMediaAccount, getSocialMediaAccounts, updateSocialMediaAccount, removeSocialMediaAccount } from '../firebase/socialMedia'
import { useAuth } from '../context/AuthContext'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'
import SocialMedia from '../components/SocialMedia'

const FeatureCard = ({ icon, title, description, actionText, onAction, modalContent }) => {
  const bgColor = useColorModeValue('white', 'brand.800')
  const borderColor = useColorModeValue('gray.200', 'brand.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const descriptionColor = useColorModeValue('gray.600', 'gray.400')
  const iconColor = useColorModeValue('brand.600', 'brand.400')
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
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
        onClick={onOpen}
      >
        <VStack align="start" spacing={4}>
          <Box color={iconColor} _hover={{ color: 'accent.500' }}>
            {icon}
          </Box>
          <Heading size="md">{title}</Heading>
          <Text color={descriptionColor}>{description}</Text>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            {actionText}
          </Button>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={bgColor} color={textColor}>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {modalContent}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const SocialMediaCard = () => {
  const [socialPost, setSocialPost] = useState('')
  const [connectedAccounts, setConnectedAccounts] = useState([])
  const [contentCalendar, setContentCalendar] = useState([])
  const [postMetrics, setPostMetrics] = useState({})
  const { currentUser } = useAuth()
  const [companyId, setCompanyId] = useState('')
  const [loading, setLoading] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    const fetchSocialMediaData = async () => {
      if (currentUser) {
        try {
          // Get the company ID from the user's profile
          const userDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.companyIDs && userData.companyIDs.length > 0) {
              setCompanyId(userData.companyIDs[0]); // Using first company for now
              
              // Fetch social media accounts
              const accounts = await getSocialMediaAccounts(userData.companyIDs[0]);
              setConnectedAccounts(Object.entries(accounts).map(([platform, data]) => ({
                platform,
                handle: data.handle,
                lastPost: data.lastUpdated,
                status: data.status
              })));
            }
          }
        } catch (error) {
          console.error('Error fetching social media data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSocialMediaData();
  }, [currentUser]);

  const handleConnectAccount = async (platform, handle, token) => {
    if (!companyId) return;
    
    const success = await addSocialMediaAccount(companyId, platform, handle, token);
    if (success) {
      setConnectedAccounts(prev => [...prev, {
        platform,
        handle,
        lastPost: new Date().toISOString(),
        status: 'connected'
      }]);
      toast({
        title: "Account Connected",
        description: `${platform} account connected successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to connect account",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDisconnectAccount = async (platform) => {
    if (!companyId) return;
    
    const success = await removeSocialMediaAccount(companyId, platform);
    if (success) {
      setConnectedAccounts(prev => prev.filter(account => account.platform !== platform));
      toast({
        title: "Account Disconnected",
        description: `${platform} account disconnected successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to disconnect account",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
    let password = ""
    for (let i = 0; i < 16; i++) {
      const randomChar = charset[Math.floor(Math.random() * charset.length)]
      password += randomChar
    }
    return password
  }

  const handleSocialMedia = () => {
    const post = `🍔 New at Juicy Burger! Try our limited-time Spicy BBQ Burger, featuring our signature blend of beef, house-made BBQ sauce, and jalapeños. Available this week only! #JuicyBurger #NewMenu #Foodie`
    setSocialPost(post)
  }

  return (
    <>
      <FeatureCard
        icon={<FiShare2 size={24} />}
        title="Social Media Management"
        description="Manage your social media presence with content calendar, performance tracking, and account management"
        actionText="Open Social Hub"
        onAction={handleSocialMedia}
        modalContent={
          <VStack spacing={6} align="stretch">
            {/* Connected Accounts Section */}
            <Box>
              <Heading size="md" mb={4}>Connected Accounts</Heading>
              {loading ? (
                <Text>Loading accounts...</Text>
              ) : (
                <VStack spacing={3} align="stretch">
                  {connectedAccounts.map((account, index) => (
                    <Box
                      key={index}
                      p={3}
                      border="1px"
                      borderColor="gray.600"
                      borderRadius="md"
                    >
                      <HStack justify="space-between">
                        <Text fontWeight="bold">{account.platform}</Text>
                        <Text color="gray.400">{account.handle}</Text>
                        <Badge colorScheme={account.status === 'connected' ? 'green' : 'red'}>
                          {account.status === 'connected' ? 'Connected' : 'Needs Update'}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.400">
                        Last Post: {new Date(account.lastPost).toLocaleDateString()}
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDisconnectAccount(account.platform)}
                      >
                        Disconnect
                      </Button>
                    </Box>
                  ))}
                  <Button
                    colorScheme="blue"
                    onClick={onOpen}
                  >
                    Connect New Account
                  </Button>
                </VStack>
              )}
            </Box>

            {/* Content Calendar Section */}
            <Box>
              <Heading size="md" mb={4}>Content Calendar</Heading>
              <SimpleGrid columns={7} spacing={2}>
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date()
                  date.setDate(date.getDate() + i)
                  const dayEvents = contentCalendar.filter(
                    event => new Date(event.date).toDateString() === date.toDateString()
                  )
                  return (
                    <Box
                      key={i}
                      p={2}
                      border="1px"
                      borderColor="gray.600"
                      borderRadius="md"
                      minH="100px"
                    >
                      <Text fontSize="sm" fontWeight="bold">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                      {dayEvents.map((event, idx) => (
                        <Text key={idx} fontSize="xs" color="blue.400">
                          {event.platform}: {event.content}
                        </Text>
                      ))}
                    </Box>
                  )
                })}
              </SimpleGrid>
            </Box>

            {/* Performance Metrics Section */}
            <Box>
              <Heading size="md" mb={4}>Performance Snapshot</Heading>
              <SimpleGrid columns={3} spacing={4}>
                {Object.entries(postMetrics).map(([platform, metrics]) => (
                  <Box
                    key={platform}
                    p={3}
                    border="1px"
                    borderColor="gray.600"
                    borderRadius="md"
                  >
                    <Text fontWeight="bold" textTransform="capitalize">{platform}</Text>
                    <Text fontSize="sm">Posts: {metrics.posts}</Text>
                    <Text fontSize="sm">Avg Likes: {metrics.avgLikes}</Text>
                    <Text fontSize="sm">Comments: {metrics.comments}</Text>
                    <Text fontSize="sm">Engagement: {metrics.engagement}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            {/* Password Management Section */}
            <Box>
              <Heading size="md" mb={4}>Password Management</Heading>
              <VStack spacing={3} align="stretch">
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    const newPassword = generatePassword()
                    navigator.clipboard.writeText(newPassword)
                    toast({
                      title: "Password Generated",
                      description: "New password copied to clipboard",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    })
                  }}
                >
                  Generate Secure Password
                </Button>
                <Text fontSize="sm" color="gray.400">
                  Last password refresh: {new Date().toLocaleDateString()}
                </Text>
              </VStack>
            </Box>

            {/* Social Post Generator */}
            <Box>
              <Heading size="md" mb={4}>Post Generator</Heading>
              <Textarea
                value={socialPost}
                readOnly
                rows={4}
                fontFamily="monospace"
              />
              <HStack mt={2}>
                <Button colorScheme="blue" onClick={() => navigator.clipboard.writeText(socialPost)}>
                  Copy Post
                </Button>
                <Link href="https://later.com" isExternal>
                  <Button rightIcon={<FiExternalLink />}>
                    Schedule on Later
                  </Button>
                </Link>
              </HStack>
            </Box>
          </VStack>
        }
      />

      <SocialMediaConnectModal
        isOpen={isOpen}
        onClose={onClose}
        onConnect={handleConnectAccount}
      />
    </>
  )
}

const GiftCardLoyaltyCard = () => {
  const [giftCardAmount, setGiftCardAmount] = useState('')
  const [loyaltyPoints, setLoyaltyPoints] = useState(140)
  const [selectedOption, setSelectedOption] = useState('custom') // 'custom' or 'square' or 'toast'
  const [giftCardCode, setGiftCardCode] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  const generateGiftCard = () => {
    const amount = '$25'
    const code = `OCTA-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    const expiry = new Date()
    expiry.setFullYear(expiry.getFullYear() + 1)
    
    setGiftCardAmount(amount)
    setGiftCardCode(code)
    setExpiryDate(expiry.toISOString().split('T')[0])
  }

  const handleGiftCard = () => {
    generateGiftCard()
  }

  return (
    <FeatureCard
      icon={<FiGift size={24} />}
      title="Gift Card & Loyalty Program"
      description="Launch your gift card and loyalty program with custom or integrated solutions"
      actionText="Manage Gift Cards"
      onAction={handleGiftCard}
      modalContent={
        <VStack spacing={6} align="stretch">
          {/* Integration Options */}
          <Box>
            <Heading size="md" mb={4}>Choose Your Solution</Heading>
            <SimpleGrid columns={3} spacing={4}>
              <Button
                colorScheme={selectedOption === 'custom' ? 'blue' : 'gray'}
                onClick={() => setSelectedOption('custom')}
              >
                Custom Solution
              </Button>
              <Button
                colorScheme={selectedOption === 'square' ? 'blue' : 'gray'}
                onClick={() => setSelectedOption('square')}
              >
                Square Integration
              </Button>
              <Button
                colorScheme={selectedOption === 'toast' ? 'blue' : 'gray'}
                onClick={() => setSelectedOption('toast')}
              >
                Toast Integration
              </Button>
            </SimpleGrid>
          </Box>

          {/* Gift Card Section */}
          <Box>
            <Heading size="md" mb={4}>Gift Card Management</Heading>
            {giftCardAmount && (
              <VStack spacing={4} align="stretch">
                <Box textAlign="center" p={4} border="1px" borderColor="gray.600" borderRadius="md">
                  <Text fontSize="2xl" fontWeight="bold">OctaCard</Text>
                  <Text fontSize="4xl" color="blue.400">{giftCardAmount}</Text>
                  <Text fontSize="sm" color="gray.400">Code: {giftCardCode}</Text>
                  <Text fontSize="sm" color="gray.400">Expires: {new Date(expiryDate).toLocaleDateString()}</Text>
                </Box>
                <HStack>
                  <Button colorScheme="blue" onClick={generateGiftCard}>
                    Generate New Card
                  </Button>
                  <Button colorScheme="green">
                    Send as Gift
                  </Button>
                </HStack>
              </VStack>
            )}
          </Box>

          {/* Loyalty Program Section */}
          <Box>
            <Heading size="md" mb={4}>Loyalty Program</Heading>
            <VStack spacing={4} align="stretch">
              <Box p={4} border="1px" borderColor="gray.600" borderRadius="md">
                <Text fontSize="xl" fontWeight="bold">⭐ {loyaltyPoints} Points</Text>
                <Text fontSize="sm" color="gray.400">Earn 1 point per $1 spent</Text>
              </Box>
              
              <SimpleGrid columns={2} spacing={4}>
                <Box p={3} border="1px" borderColor="gray.600" borderRadius="md">
                  <Text fontWeight="bold">Available Rewards</Text>
                  <Text fontSize="sm">🎁 100 pts = Free Coffee</Text>
                  <Text fontSize="sm">🍔 200 pts = $10 Off</Text>
                  <Text fontSize="sm">🎂 500 pts = Free Meal</Text>
                </Box>
                <Box p={3} border="1px" borderColor="gray.600" borderRadius="md">
                  <Text fontWeight="bold">Special Perks</Text>
                  <Text fontSize="sm">🎂 Birthday Reward</Text>
                  <Text fontSize="sm">💸 Referral Bonus</Text>
                  <Text fontSize="sm">🔁 Double Points Days</Text>
                </Box>
              </SimpleGrid>

              <Button colorScheme="blue">
                Share Referral Link
              </Button>
            </VStack>
          </Box>

          {/* Admin Tools Section */}
          <Box>
            <Heading size="md" mb={4}>Admin Tools</Heading>
            <SimpleGrid columns={2} spacing={4}>
              <Button colorScheme="blue">
                Create New Cards
              </Button>
              <Button colorScheme="blue">
                View Performance
              </Button>
              <Button colorScheme="blue">
                Configure Rewards
              </Button>
              <Button colorScheme="blue">
                Export Data
              </Button>
            </SimpleGrid>
          </Box>

          {/* Integration Links */}
          <HStack justify="center" spacing={4}>
            {selectedOption === 'square' && (
              <Link href="https://squareup.com" isExternal>
                <Button rightIcon={<FiExternalLink />}>
                  Go to Square
                </Button>
              </Link>
            )}
            {selectedOption === 'toast' && (
              <Link href="https://toasttab.com" isExternal>
                <Button rightIcon={<FiExternalLink />}>
                  Go to Toast
                </Button>
              </Link>
            )}
          </HStack>
        </VStack>
      }
    />
  )
}

const Launchpad = () => {
  const [reviewScript, setReviewScript] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [menuContent, setMenuContent] = useState('')
  const [giftCardAmount, setGiftCardAmount] = useState('')

  const handleGoogleReviews = () => {
    const script = `Hi [Customer Name],

Thank you for choosing Juicy Burger! We hope you enjoyed your meal. If you have a moment, we'd love to hear about your experience.

Click here to leave a review: [Google Review Link]

Your feedback helps us improve and serve you better. Thank you for your support!

Best regards,
The Juicy Burger Team`
    setReviewScript(script)
  }

  const handleQRPayment = () => {
    // Generate a QR code for Venmo
    const venmoUrl = 'https://venmo.com/code?user_id=your_venmo_id'
    setQrCodeUrl(venmoUrl)
  }

  const handleQRMenu = () => {
    const menu = `# Juicy Burger Menu

## Burgers
- Classic Burger - $8.99
- Double Cheeseburger - $10.99
- Bacon Burger - $9.99

## Sides
- Fries - $3.99
- Onion Rings - $4.99
- Sweet Potato Fries - $4.99

## Drinks
- Soda - $2.49
- Milkshake - $5.99
- Craft Beer - $6.99`
    setMenuContent(menu)
  }

  const handleGiftCard = () => {
    // Generate a gift card code
    const amount = '$25'
    setGiftCardAmount(amount)
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="2xl" mb={2}>
            Launchpad
          </Heading>
          <Text fontSize="xl" color="gray.400">
            Quick wins and instant value with no/low-code tools
          </Text>
        </Box>

        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
          <FeatureCard
            icon={<FiStar size={24} />}
            title="Google Reviews & Local SEO"
            description="Optimize your Google Business Profile and boost your online presence"
            actionText="Generate Review Script"
            onAction={handleGoogleReviews}
            modalContent={
              <VStack spacing={4} align="stretch">
                <Text>Copy and paste this review request script:</Text>
                <Textarea
                  value={reviewScript}
                  readOnly
                  rows={8}
                  fontFamily="monospace"
                />
                <HStack>
                  <Button colorScheme="blue" onClick={() => navigator.clipboard.writeText(reviewScript)}>
                    Copy Script
                  </Button>
                  <Link href="https://business.google.com" isExternal>
                    <Button rightIcon={<FiExternalLink />}>
                      Go to Google Business
                    </Button>
                  </Link>
                </HStack>
              </VStack>
            }
          />

          <FeatureCard
            icon={<FiCreditCard size={24} />}
            title="Smart Tip Jar & QR Payments"
            description="Set up QR code payments and tipping options for your business"
            actionText="Generate QR Code"
            onAction={handleQRPayment}
            modalContent={
              <VStack spacing={4} align="stretch">
                {qrCodeUrl && (
                  <Box textAlign="center">
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                      alt="Venmo QR Code"
                    />
                    <Text mt={2}>Scan to tip via Venmo</Text>
                  </Box>
                )}
                <HStack>
                  <Link href="https://venmo.com" isExternal>
                    <Button rightIcon={<FiExternalLink />}>
                      Go to Venmo
                    </Button>
                  </Link>
                  <Link href="https://cash.app" isExternal>
                    <Button rightIcon={<FiExternalLink />}>
                      Go to Cash App
                    </Button>
                  </Link>
                </HStack>
              </VStack>
            }
          />

          <FeatureCard
            icon={<FiMenu size={24} />}
            title="QR Code Menus & Flyers"
            description="Create mobile-friendly digital menus with QR code access"
            actionText="Generate Menu"
            onAction={handleQRMenu}
            modalContent={
              <VStack spacing={4} align="stretch">
                <Textarea
                  value={menuContent}
                  readOnly
                  rows={12}
                  fontFamily="monospace"
                />
                <HStack>
                  <Button colorScheme="blue" onClick={() => navigator.clipboard.writeText(menuContent)}>
                    Copy Menu
                  </Button>
                  <Link href="https://canva.com" isExternal>
                    <Button rightIcon={<FiExternalLink />}>
                      Design in Canva
                    </Button>
                  </Link>
                </HStack>
              </VStack>
            }
          />

          <GiftCardLoyaltyCard />

          <FeatureCard
            icon={<FiShare2 size={24} />}
            title="Social Media Management"
            description="Manage your social media presence with content calendar, performance tracking, and account management"
            actionText="Open Social Hub"
            onAction={() => {}}
            modalContent={<SocialMedia />}
          />
        </Grid>
      </VStack>
    </Box>
  )
}

export default Launchpad 