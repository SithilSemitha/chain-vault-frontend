import { useEffect, useState } from 'react';
import { Logo, BtnPrimary, BtnSecondary } from './UI';

const CONFETTI_COLORS = ['#00e5a0', '#7c3aed', '#f59e0b', '#627eea', '#ef4444', '#00e5a0'];

function randomHex() {
  return '0x' + [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') + '...' +
    [...Array(4)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

export default function TxSuccessScreen({ go, action = 'Vault updated' }) {
  const [txHash] = useState(randomHex());
  const [blockNum] = useState((19_000_000 + Math.floor(Math.random() * 900_000)).toLocaleString());
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '680px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 20px', borderBottom: '1px solid var(--cv-border)' }}>
        <Logo />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '32px 28px', gap: 18, textAlign: 'center',
        opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all .5s ease',
      }}>

        {/* Confetti dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
          {CONFETTI_COLORS.map((c, i) => (
            <div key={i} style={{
              width: 9, height: 9, borderRadius: '50%', background: c,
              animation: `pulse ${1 + i * 0.2}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>

        {/* Success ring */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          border: '2px solid var(--cv-accent)',
          background: 'rgba(0,229,160,.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 34,
          boxShadow: '0 0 32px rgba(0,229,160,.15)',
        }}>✓</div>

        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{action || 'Vault updated'}</h2>
          <p style={{ fontSize: 14, color: 'var(--cv-muted)', lineHeight: 1.75, maxWidth: 280 }}>
            Your assets are secured on-chain. Beneficiaries will be notified when the trigger condition is met.
          </p>
        </div>

        {/* Tx hash */}
        <div style={{
          fontFamily: 'var(--cv-mono)', fontSize: 11, color: 'var(--cv-accent)',
          background: 'rgba(0,229,160,.06)', padding: '10px 16px', borderRadius: 8,
          border: '1px solid rgba(0,229,160,.18)', lineHeight: 1.8,
          wordBreak: 'break-all', maxWidth: 290,
        }}>
          <span style={{ color: 'var(--cv-muted)' }}>Tx: </span>{txHash}<br />
          <span style={{ color: 'var(--cv-muted)' }}>Block </span>#{blockNum} · <span style={{ color: 'var(--cv-accent)' }}>Confirmed</span>
        </div>

        {/* Gas saved badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--cv-muted)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cv-accent)', display: 'inline-block' }} />
          Settled on Ethereum Mainnet
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 290, marginTop: 6 }}>
          <BtnPrimary onClick={() => go('dashboard')}>Back to Dashboard</BtnPrimary>
          <BtnSecondary onClick={() => go('beneficiary')}>View beneficiaries</BtnSecondary>
        </div>
      </div>
    </div>
  );
}
