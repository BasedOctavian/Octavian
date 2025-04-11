import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, HStack, Image, Text, Box } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const CompanySwitcher = () => {
  const { companies, selectedCompanyId, switchCompany } = useAuth();

  const selectedCompany = companies?.find(company => company.id === selectedCompanyId);

  if (!selectedCompany) return null;

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        rightIcon={<FiChevronDown />}
        w="100%"
        justifyContent="flex-start"
        p={3}
        borderRadius="lg"
      >
        <HStack spacing={3}>
          <Box
            w="32px"
            h="32px"
            borderRadius="md"
            overflow="hidden"
            bg="gray.100"
          >
            {selectedCompany.picture && (
              <Image
                src={selectedCompany.picture}
                alt={selectedCompany.name}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            )}
          </Box>
          <Box textAlign="left" overflow="hidden">
            <Text fontSize="sm" fontWeight="bold" isTruncated>
              {selectedCompany.name}
            </Text>
            <Text fontSize="xs" color="gray.500" isTruncated>
              {selectedCompany.address}
            </Text>
          </Box>
        </HStack>
      </MenuButton>
      <MenuList>
        {companies.map((company) => (
          <MenuItem
            key={company.id}
            onClick={() => switchCompany(company.id)}
          >
            <HStack spacing={3}>
              <Box
                w="24px"
                h="24px"
                borderRadius="sm"
                overflow="hidden"
                bg="gray.100"
              >
                {company.picture && (
                  <Image
                    src={company.picture}
                    alt={company.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                )}
              </Box>
              <Box>
                <Text fontSize="sm">{company.name}</Text>
                <Text fontSize="xs" color="gray.500">
                  {company.address}
                </Text>
              </Box>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default CompanySwitcher; 