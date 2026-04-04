import { useState } from 'react';
import LandingScreen    from './components/LandingScreen';
import WalletScreen     from './components/WalletScreen';
import ConnectingScreen from './components/ConnectingScreen';
import DashboardScreen  from './components/DashboardScreen';
import AddAssetScreen   from './components/AddAssetScreen';
import BeneficiaryScreen from './components/BeneficiaryScreen';
import TxSuccessScreen  from './components/TxSuccessScreen';

export default function App() {
  const [screen, setScreen]       = useState('landing');
  const [walletName, setWalletName] = useState('');
  const [lastTxAction, setLastTxAction] = useState('');
  const [assets, setAssets] = useState([
    { id: 1, sym: 'BTC', name: 'Bitcoin',         amount: '0.42 BTC',   usd: '$31,200', pct: '+2.4%', up: true,  bg: 'rgba(247,147,26,.15)', color: '#f7931a' },
    { id: 2, sym: 'ETH', name: 'Ethereum',         amount: '4.80 ETH',   usd: '$14,400', pct: '-0.8%', up: false, bg: 'rgba(98,126,234,.15)',  color: '#627eea' },
    { id: 3, sym: 'NFT', name: 'CryptoPunk #3892', amount: 'ERC-721 · 1',usd: '$2,650',  pct: '+5.1%', up: true,  bg: 'rgba(0,229,160,.1)',   color: '#00e5a0' },
  ]);

  const go = (s, meta = {}) => {
    if (meta.walletName) setWalletName(meta.walletName);
    if (meta.txAction)   setLastTxAction(meta.txAction);
    setScreen(s);
  };

  const addAsset = (asset) => setAssets(prev => [...prev, asset]);

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
        {screen === 'dashboard'   && <DashboardScreen  go={go} assets={assets} />}
        {screen === 'addAsset'    && <AddAssetScreen   go={go} addAsset={addAsset} />}
        {screen === 'beneficiary' && <BeneficiaryScreen go={go} />}
        {screen === 'txSuccess'   && <TxSuccessScreen  go={go} action={lastTxAction} />}
      </div>
    </div>
  );
}
