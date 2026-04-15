import { useState, useEffect } from 'react';
import { getCurrentUser, getUserVaults, createVault, initializeCollections } from './services/firebaseService';
import LandingScreen from './components/LandingScreen';
import WalletScreen from './components/WalletScreen';
import ConnectingScreen from './components/ConnectingScreen';
import DashboardScreen from './components/DashboardScreen';
import AddAssetScreen from './components/AddAssetScreen';
import BeneficiaryScreen from './components/BeneficiaryScreen';
import TxSuccessScreen from './components/TxSuccessScreen';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [walletName, setWalletName] = useState('');
  const [lastTxAction, setLastTxAction] = useState('');
  const [user, setUser] = useState(null);
  const [vault, setVault] = useState(null);
  const [assets, setAssets] = useState([]);

  // Initialize Firebase collections and check user
  useEffect(() => {
    const initializeApp = async () => {
      await initializeCollections();
      
      const walletAddress = getCurrentUser();
      if (walletAddress) {
        setUser({ walletAddress });
        let vaults = await getUserVaults(walletAddress);
        
        if (vaults.length === 0) {
          const newVault = await createVault(walletAddress);
          vaults = [newVault];
        }
        
        if (vaults.length > 0) {
          setVault(vaults[0]);
          setAssets(vaults[0].assets || []);
        }
        setScreen('dashboard');
      }
    };
    initializeApp();
  }, []);

  const go = (s, meta = {}) => {
    if (meta.walletName) setWalletName(meta.walletName);
    if (meta.txAction) setLastTxAction(meta.txAction);
    if (meta.user) setUser(meta.user);
    if (meta.vault) setVault(meta.vault);
    setScreen(s);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,160,.04) 0%, var(--cv-bg) 60%)',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', minHeight: '680px',
        background: 'var(--cv-surface)', borderRadius: '20px',
        border: '1px solid var(--cv-border)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 40px 80px rgba(0,0,0,.6)',
      }}>
        {screen === 'landing'     && <LandingScreen    go={go} />}
        {screen === 'wallet'      && <WalletScreen     go={go} />}
        {screen === 'connecting'  && <ConnectingScreen go={go} walletName={walletName} />}
        {screen === 'dashboard'   && <DashboardScreen  go={go} assets={assets} vault={vault} user={user} />}
        {screen === 'addAsset'    && <AddAssetScreen   go={go} vault={vault} />}
        {screen === 'beneficiary' && <BeneficiaryScreen go={go} vault={vault} />}
        {screen === 'txSuccess'   && <TxSuccessScreen  go={go} action={lastTxAction} />}
      </div>
    </div>
  );
}
