import { useState } from 'react';
import { Logo, BtnPrimary, BtnSecondary } from './UI';

const features = [
  { icon: '🔐', title: 'Trustless',   desc: 'Smart contract only. No middlemen.' },
  { icon: '⏱',  title: 'Time-lock',  desc: 'Auto-trigger on inactivity or date.' },
  { icon: '👥', title: 'Multi-heir',  desc: 'Split assets across beneficiaries.' },
];

export default function LandingScreen({ go }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '680px', animation: 'fadeSlideUp .4s ease both' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--cv-border)' }}>
        <Logo />
        <span style={{ fontFamily: 'var(--cv-mono)', fontSize: 11, padding: '4px 10px', border: '1px solid rgba(0,229,160,.35)', color: 'var(--cv-accent)', borderRadius: 20, background: 'rgba(0,229,160,.06)' }}>Ethereum</span>
      </div>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center', gap: 22 }}>
        <div style={{ fontFamily: 'var(--cv-mono)', fontSize: 11, color: 'var(--cv-accent)', letterSpacing: '.12em', textTransform: 'uppercase', border: '1px solid rgba(0,229,160,.25)', padding: '5px 16px', borderRadius: 20, background: 'rgba(0,229,160,.05)' }}>
          Web3 Inheritance Protocol
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.25, maxWidth: 320, color: 'var(--cv-text)' }}>
          Your digital legacy,{' '}
          <em style={{ fontStyle: 'normal', color: 'var(--cv-accent)' }}>secured forever</em>
        </h1>

        <p style={{ fontSize: 14, color: 'var(--cv-muted)', lineHeight: 1.75, maxWidth: 300 }}>
          Lock crypto, NFTs and digital documents in a trustless smart contract vault. Set beneficiaries. Let the blockchain handle the rest.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 290 }}>
          <BtnPrimary onClick={() => go('wallet')}>Connect Wallet</BtnPrimary>
          <BtnSecondary onClick={() => go('dashboard')}>View Demo Vault</BtnSecondary>
        </div>
      </div>

      {/* Feature pills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '0 16px 24px' }}>
        {features.map(f => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--cv-card)' : 'var(--cv-bg)',
        border: `1px solid ${hover ? 'rgba(0,229,160,.25)' : 'var(--cv-border)'}`,
        borderRadius: 10, padding: '12px 10px', textAlign: 'center',
        transition: 'all .2s',
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 11, color: 'var(--cv-muted)', lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}
