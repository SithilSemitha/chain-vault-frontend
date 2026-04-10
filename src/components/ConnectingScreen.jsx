import { useEffect, useState } from 'react';
import { Logo } from './UI';

const STEPS = [
  { label: 'Requesting connection...', addr: '' },
  { label: 'Awaiting wallet approval...', addr: '0x3f8a...c12b' },
  { label: 'Verifying signature...', addr: '0x3f8a...c12b' },
  { label: 'Syncing vault data...', addr: '0x3f8a...c12b' },
];

export default function ConnectingScreen({ go, walletName }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => go('dashboard'), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [go]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '680px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 20px', borderBottom: '1px solid var(--cv-border)' }}>
        <Logo />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '40px 28px', textAlign: 'center', animation: 'fadeIn .3s ease both' }}>

        {/* Spinner rings */}
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid var(--cv-border)' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: 'var(--cv-accent)', animation: 'spin 0.9s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '1px solid transparent', borderTopColor: 'rgba(0,229,160,.4)', animation: 'spin 1.4s linear infinite reverse' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            {walletName === 'MetaMask' ? '🦊' : walletName === 'Ledger' ? '🔑' : walletName === 'Coinbase Wallet' ? '🔵' : '🔗'}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--cv-mono)', fontSize: 13, color: 'var(--cv-accent)', marginBottom: 6, transition: 'all .3s', minHeight: 20 }}>
            {STEPS[step].label}
          </div>
          {STEPS[step].addr && (
            <div style={{ fontFamily: 'var(--cv-mono)', fontSize: 11, color: 'var(--cv-muted)', animation: 'fadeIn .3s ease both' }}>
              {STEPS[step].addr}
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 8, height: 8, borderRadius: 4,
              background: i <= step ? 'var(--cv-accent)' : 'var(--cv-border)',
              transition: 'all .3s ease',
            }} />
          ))}
        </div>

        <p style={{ fontSize: 13, color: 'var(--cv-muted)', lineHeight: 1.7, maxWidth: 260 }}>
          Connecting to <strong style={{ color: 'var(--cv-text)' }}>{walletName}</strong>.<br />
          Check your wallet app to approve.
        </p>
      </div>
    </div>
  );
}
