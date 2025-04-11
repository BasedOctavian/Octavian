import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useAdmin = (adminId) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminDoc = await getDoc(doc(db, 'admins', adminId));
        if (adminDoc.exists()) {
          setAdmin(adminDoc.data());
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (adminId) {
      fetchAdmin();
    }
  }, [adminId]);

  return { admin, loading, error };
};

export const useCompanies = (companyIds) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await Promise.all(
          companyIds.map(async (companyId) => {
            const companyDoc = await getDoc(doc(db, 'companies', companyId));
            return companyDoc.exists() ? { id: companyId, ...companyDoc.data() } : null;
          })
        );
        setCompanies(companiesData.filter(Boolean));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (companyIds?.length > 0) {
      fetchCompanies();
    }
  }, [companyIds]);

  return { companies, loading, error };
};

export const useCustomers = (companyId) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersQuery = query(
          collection(db, 'customers'),
          where('pastActivity', 'array-contains', companyId)
        );
        const querySnapshot = await getDocs(customersQuery);
        const customersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCustomers(customersData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCustomers();
    }
  }, [companyId]);

  return { customers, loading, error };
}; 