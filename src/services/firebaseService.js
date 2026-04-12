import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

// Initialize collections structure
export const initializeCollections = async () => {
  try {
    const collectionsRef = doc(db, '_metadata', 'collections');
    await setDoc(collectionsRef, {
      initialized: true,
      createdAt: new Date().toISOString(),
    }, { merge: true });
    console.log('✅ Collections initialized');
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
};

// User functions
export const getCurrentUser = () => localStorage.getItem('walletAddress');

export const loginWithWallet = async (walletAddress) => {
  localStorage.setItem('walletAddress', walletAddress);

  const userRef = doc(db, 'users', walletAddress);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      walletAddress,
      createdAt: new Date().toISOString(),
      vaults: [],
    });
  }

  return { success: true, walletAddress };
};

export const logout = () => {
  localStorage.removeItem('walletAddress');
};

// Vault functions
export const getUserVaults = async (userId) => {
  const q = query(collection(db, 'vaults'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const vaults = [];
  snapshot.forEach((docSnap) => vaults.push({ id: docSnap.id, ...docSnap.data() }));
  return vaults;
};

export const createVault = async (userId) => {
  const vaultsRef = collection(db, 'vaults');
  const newVaultRef = doc(vaultsRef);
  
  const vaultData = {
    userId,
    contractAddress: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
    totalValueUSD: 0,
    status: 'active',
    assets: [],
    beneficiaries: [],
    createdAt: new Date().toISOString(),
  };
  
  await setDoc(newVaultRef, vaultData);
  return { id: newVaultRef.id, ...vaultData };
};

export const addAsset = async (vaultId, assetData) => {
  const vaultRef = doc(db, 'vaults', vaultId);
  const vaultSnap = await getDoc(vaultRef);
  
  if (!vaultSnap.exists()) throw new Error('Vault not found');
  
  const vault = vaultSnap.data();
  const newAsset = { id: Date.now().toString(), ...assetData, addedAt: new Date().toISOString() };
  const assets = [...(vault.assets || []), newAsset];

  await updateDoc(vaultRef, { assets });
  return newAsset;
};

export const addBeneficiary = async (vaultId, beneficiaryData) => {
  const vaultRef = doc(db, 'vaults', vaultId);
  const vaultSnap = await getDoc(vaultRef);
  
  if (!vaultSnap.exists()) throw new Error('Vault not found');
  
  const vault = vaultSnap.data();
  const newBeneficiary = { id: Date.now().toString(), ...beneficiaryData, addedAt: new Date().toISOString() };
  const beneficiaries = [...(vault.beneficiaries || []), newBeneficiary];

  await updateDoc(vaultRef, { beneficiaries });
  return newBeneficiary;
};

export const updateBeneficiary = async (vaultId, beneficiaryId, updates) => {
  const vaultRef = doc(db, 'vaults', vaultId);
  const vaultSnap = await getDoc(vaultRef);
  
  if (!vaultSnap.exists()) throw new Error('Vault not found');
  
  const vault = vaultSnap.data();
  const beneficiaries = vault.beneficiaries.map(b => 
    b.id === beneficiaryId ? { ...b, ...updates } : b
  );

  await updateDoc(vaultRef, { beneficiaries });
  return beneficiaries.find(b => b.id === beneficiaryId);
};

export const removeBeneficiary = async (vaultId, beneficiaryId) => {
  const vaultRef = doc(db, 'vaults', vaultId);
  const vaultSnap = await getDoc(vaultRef);
  
  if (!vaultSnap.exists()) throw new Error('Vault not found');
  
  const vault = vaultSnap.data();
  const beneficiaries = vault.beneficiaries.filter(b => b.id !== beneficiaryId);

  await updateDoc(vaultRef, { beneficiaries });
  return true;
};
