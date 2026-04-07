/* ── Shared UI building blocks ── */

import { useState } from 'react';

/* ── Nav bar ── */
export function Nav({ left, title, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px', borderBottom: '1px solid var(--cv-border)',
      background: 'var(--cv-surface)', flexShrink: 0,
    }}>
      <div style={{ minWidth: 56 }}>{left}</div>
      <Logo small />
      <div style={{ minWidth: 56, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

/* ── Logo ── */
export function Logo({ small }) {
  return (
    <span style={{ fontFamily: 'var(--cv-mono)', fontSize: small ? 15 : 22, letterSpacing: '0.05em', color: 'var(--cv-accent)' }}>
      Chain<span style={{ color: 'var(--cv-text)' }}>Vault</span>
    </span>
  );
}

/* ── Back button ── */
export function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', color: 'var(--cv-muted)',
      fontSize: 13, fontFamily: 'var(--cv-sans)', display: 'flex',
      alignItems: 'center', gap: 4, cursor: 'pointer', padding: '4px 0',
      transition: 'color .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--cv-text)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--cv-muted)'}
    >← Back</button>
  );
}

/* ── Network badge ── */
export function NetBadge({ label = 'Ethereum' }) {
  return (
    <span style={{
      fontFamily: 'var(--cv-mono)', fontSize: 11, padding: '4px 10px',
      border: '1px solid var(--cv-accent)', color: 'var(--cv-accent)',
      borderRadius: 20, background: 'var(--cv-accent-dim)',
    }}>{label}</span>
  );
}

/* ── Section label ── */
export function SectionLabel({ children, style }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--cv-muted)', letterSpacing: '.08em', textTransform: 'uppercase', ...style }}>
      {children}
    </p>
  );
}

/* ── Primary button ── */
export function BtnPrimary({ children, onClick, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', padding: '13px 20px', borderRadius: 10,
        background: hover ? '#00c98a' : 'var(--cv-accent)',
        color: '#050708', fontSize: 14, fontWeight: 600,
        transition: 'background .15s, transform .1s',
        transform: hover ? 'translateY(-1px)' : 'none',
        ...style,
      }}>{children}</button>
  );
}

/* ── Secondary button ── */
export function BtnSecondary({ children, onClick, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', padding: '12px 20px', borderRadius: 10,
        background: 'transparent',
        border: `1px solid ${hover ? 'var(--cv-accent)' : 'var(--cv-border)'}`,
        color: hover ? 'var(--cv-accent)' : 'var(--cv-text)',
        fontSize: 14, fontWeight: 500, transition: 'all .15s',
        ...style,
      }}>{children}</button>
  );
}

/* ── Card ── */
export function Card({ children, style, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => onClick && setHover(true)}
      onMouseLeave={() => onClick && setHover(false)}
      style={{
        background: hover ? 'var(--cv-card-hover)' : 'var(--cv-card)',
        border: `1px solid ${hover ? 'var(--cv-border-hover)' : 'var(--cv-border)'}`,
        borderRadius: 10, padding: '14px 16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all .15s',
        ...style,
      }}>{children}</div>
  );
}

/* ── Form input ── */
export function Input({ label, ...props }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 12, color: 'var(--cv-muted)', fontWeight: 500 }}>{label}</label>}
      <input
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%', background: 'var(--cv-card)',
          border: `1px solid ${focus ? 'var(--cv-accent)' : 'var(--cv-border)'}`,
          borderRadius: 8, padding: '11px 14px', color: 'var(--cv-text)',
          fontSize: 14, transition: 'border .15s',
        }}
        {...props}
      />
    </div>
  );
}

/* ── Form select ── */
export function Select({ label, children, ...props }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 12, color: 'var(--cv-muted)', fontWeight: 500 }}>{label}</label>}
      <select
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%', background: 'var(--cv-card)',
          border: `1px solid ${focus ? 'var(--cv-accent)' : 'var(--cv-border)'}`,
          borderRadius: 8, padding: '11px 14px', color: 'var(--cv-text)',
          fontSize: 14, appearance: 'none', transition: 'border .15s', cursor: 'pointer',
        }}
        {...props}
      >{children}</select>
    </div>
  );
}

/* ── Status dot ── */
export function StatusBar({ text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 14px', background: 'rgba(0,229,160,.06)',
      border: '1px solid rgba(0,229,160,.18)', borderRadius: 8,
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%', background: 'var(--cv-accent)',
        animation: 'pulse 2s ease-in-out infinite',
        flexShrink: 0,
      }} />
      <span style={{ fontFamily: 'var(--cv-mono)', fontSize: 12, color: 'var(--cv-accent)' }}>{text}</span>
    </div>
  );
}

/* ── Scrollable content area ── */
export function ScrollContent({ children, style }) {
  return (
    <div style={{
      flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
      gap: 14, padding: '16px 18px',
      scrollbarWidth: 'thin',
      scrollbarColor: 'var(--cv-border) transparent',
      ...style,
    }}>{children}</div>
  );
}
