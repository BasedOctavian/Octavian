import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAdmin, useCompanies, useCustomers } from '../hooks/useData';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // Fetch admin data
  const { admin, loading: adminLoading, error: adminError } = useAdmin(currentUser?.uid);
  
  // Fetch companies data
  const { companies, loading: companiesLoading, error: companiesError } = useCompanies(admin?.companyIDs || []);
  
  // Fetch customers data for selected company
  const { customers, loading: customersLoading, error: customersError } = useCustomers(selectedCompanyId);

  // Set initial selected company
  useEffect(() => {
    if (companies?.length > 0 && !selectedCompanyId) {
      const lastSelectedCompany = localStorage.getItem('selectedCompanyId');
      if (lastSelectedCompany && companies.some(company => company.id === lastSelectedCompany)) {
        setSelectedCompanyId(lastSelectedCompany);
      } else {
        setSelectedCompanyId(companies[0].id);
        localStorage.setItem('selectedCompanyId', companies[0].id);
      }
    }
  }, [companies, selectedCompanyId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const switchCompany = async (companyId) => {
    if (companies.some(company => company.id === companyId)) {
      setSelectedCompanyId(companyId);
      localStorage.setItem('selectedCompanyId', companyId);
      
      // Update the admin's last selected company in Firestore
      if (currentUser?.uid) {
        try {
          await updateDoc(doc(db, 'admins', currentUser.uid), {
            lastSelectedCompany: companyId
          });
        } catch (error) {
          console.error('Error updating last selected company:', error);
        }
      }
    }
  };

  const value = {
    currentUser,
    admin,
    companies,
    selectedCompanyId,
    customers,
    switchCompany,
    loading: loading || adminLoading || companiesLoading || customersLoading,
    error: adminError || companiesError || customersError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 