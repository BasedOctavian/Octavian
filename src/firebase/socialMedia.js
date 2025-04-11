import { db } from './config';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Add a new social media account to a company
export const addSocialMediaAccount = async (companyId, platform, handle) => {
  try {
    const companyRef = doc(db, 'companies', companyId);
    const socialMediaRef = collection(companyRef, 'SocialMedia');
    
    await setDoc(doc(socialMediaRef, platform), {
      handle,
      lastUpdated: serverTimestamp(),
      status: 'connected',
      password: '',
      passwordExpiry: null
    });
    
    return true;
  } catch (error) {
    console.error('Error adding social media account:', error);
    return false;
  }
};

// Get all social media accounts for a company
export const getSocialMediaAccounts = async (companyId) => {
  try {
    const companyRef = doc(db, 'companies', companyId);
    const socialMediaRef = collection(companyRef, 'SocialMedia');
    const snapshot = await getDocs(socialMediaRef);
    
    const accounts = {};
    snapshot.forEach((doc) => {
      accounts[doc.id] = doc.data();
    });
    
    return accounts;
  } catch (error) {
    console.error('Error getting social media accounts:', error);
    return {};
  }
};

// Update a social media account
export const updateSocialMediaAccount = async (companyId, platform, updates) => {
  try {
    const companyRef = doc(db, 'companies', companyId);
    const socialMediaRef = doc(collection(companyRef, 'SocialMedia'), platform);
    
    await updateDoc(socialMediaRef, {
      ...updates,
      lastUpdated: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating social media account:', error);
    return false;
  }
};

// Remove a social media account
export const removeSocialMediaAccount = async (companyId, platform) => {
  try {
    const companyRef = doc(db, 'companies', companyId);
    const socialMediaRef = doc(collection(companyRef, 'SocialMedia'), platform);
    
    await deleteDoc(socialMediaRef);
    
    return true;
  } catch (error) {
    console.error('Error removing social media account:', error);
    return false;
  }
};

// Generate and update password for a social media account
export const updateSocialMediaPassword = async (companyId, platform) => {
  try {
    const companyRef = doc(db, 'companies', companyId);
    const socialMediaRef = doc(collection(companyRef, 'SocialMedia'), platform);
    
    const newPassword = generateSecurePassword();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now
    
    await updateDoc(socialMediaRef, {
      password: newPassword,
      passwordExpiry: expiryDate.toISOString(),
      lastUpdated: serverTimestamp()
    });
    
    return newPassword;
  } catch (error) {
    console.error('Error updating password:', error);
    return null;
  }
};

// Helper function to generate secure password
const generateSecurePassword = () => {
  const length = 16;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}; 