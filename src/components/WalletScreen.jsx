import { useState } from 'react';
import { Nav, BackBtn, SectionLabel, ScrollContent } from './UI';

const wallets = [
  { id: 'MetaMask',       icon: '🦊', bg: 'rgba(246,133,27,.15)', desc: 'Browser extension wallet' },
  { id: 'WalletConnect',  icon: '🔗', bg: 'rgba(59,153,252,.15)', desc: 'Scan with your mobile wallet' },
  { id: 'Coinbase Wallet',icon: '🔵', bg: 'rgba(0,82,255,.15)',   desc: 'Connect via Coinbase app' },
  { id: 'Ledger',         icon: '🔑', bg: 'rgba(255,255,255,.06)',desc: 'Cold wallet — most secure' },
];

export default function WalletScreen({ go }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '680px', animation: 'fadeSlideUp .35s ease both' }}>
      <Nav left={<BackBtn onClick={() => go('landing')} />} right={null} />

      <div style={{ padding: '22px 18px 10px', borderBottom: '1px solid var(--cv-border)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Connect a wallet</h2>
        <p style={{ fontSize: 13, color: 'var(--cv-muted)' }}>Choose your preferred Web3 wallet to access your vault.</p>
      </div>

      <ScrollContent>
        <SectionLabel>Available wallets</SectionLabel>
        {wallets.map(w => <WalletOption key={w.id} wallet={w} go={go} />)}
        <p style={{ fontSize: 11, color: 'var(--cv-muted2)', textAlign: 'center', marginTop: 'auto', lineHeight: 1.8, paddingTop: 12 }}>
          By connecting you agree to the ChainVault protocol terms.<br />
          Your keys, your vault. Non-custodial.
        </p>
      </ScrollContent>
    </div>
  );
}

function WalletOption({ wallet, go }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => go('connecting', { walletName: wallet.id })}
      style={{
        background: hover ? 'var(--cv-card-hover)' : 'var(--cv-card)',
        border: `1px solid ${hover ? 'rgba(0,229,160,.3)' : 'var(--cv-border)'}`,
        borderRadius: 10, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer', transition: 'all .15s',
        transform: hover ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 10, background: wallet.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
        {wallet.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{wallet.id}</div>
        <div style={{ fontSize: 12, color: 'var(--cv-muted)', marginTop: 2 }}>{wallet.desc}</div>
      </div>
      <div style={{ color: 'var(--cv-muted)', fontSize: 20, transition: 'transform .15s', transform: hover ? 'translateX(3px)' : 'none' }}>›</div>
    </div>
  );
}
