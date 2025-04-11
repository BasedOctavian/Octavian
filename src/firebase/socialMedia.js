import { db } from './config';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

// Add a new social media account to a company
export const addSocialMediaAccount = async (companyId, platform, handle, token) => {
  try {
    const companyRef = doc(db, 'companies', companyId);
    const socialMediaRef = collection(companyRef, 'SocialMedia');
    
    await setDoc(doc(socialMediaRef, platform), {
      handle,
      token,
      lastUpdated: new Date().toISOString(),
      status: 'connected'
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
      lastUpdated: new Date().toISOString()
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