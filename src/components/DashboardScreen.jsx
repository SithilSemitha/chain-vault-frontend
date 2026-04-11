import { useState } from 'react';
import { Nav, NetBadge, SectionLabel, StatusBar, ScrollContent } from './UI';

export default function DashboardScreen({ go, assets }) {
  const total = assets.reduce((acc, a) => acc + parseFloat(a.usd.replace(/[$,]/g, '')), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '680px', animation: 'fadeSlideUp .35s ease both' }}>
      <Nav right={<NetBadge label="0x3f…a72c" />} />

      <ScrollContent>
        <StatusBar text="Vault active · Smart contract deployed" />

        {/* Vault hero card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,229,160,.07) 0%, rgba(124,58,237,.07) 100%)',
          border: '1px solid rgba(0,229,160,.18)', borderRadius: 14, padding: 20,
        }}>
          <p style={{ fontSize: 12, color: 'var(--cv-muted)', marginBottom: 4 }}>Total vault value</p>
          <p style={{ fontFamily: 'var(--cv-mono)', fontSize: 30, fontWeight: 700 }}>
            ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p style={{ fontSize: 12, color: 'var(--cv-muted)', marginTop: 6 }}>
            {assets.length} assets locked · 2 beneficiaries set
          </p>
          <p style={{ fontFamily: 'var(--cv-mono)', fontSize: 11, color: 'var(--cv-accent)', marginTop: 10, opacity: .8 }}>
            0x7a3b...f291c · Ethereum Mainnet
          </p>
        </div>

        {/* Assets */}
        <SectionLabel>Locked assets</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {assets.map((a, i) => <AssetRow key={a.id ?? i} asset={a} />)}
        </div>

        {/* Quick actions */}
        <SectionLabel>Quick actions</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <QuickAction icon="➕" label="Add asset"       desc="Lock more funds"       onClick={() => go('addAsset')} />
          <QuickAction icon="👥" label="Beneficiaries"   desc="Manage heirs & splits"  onClick={() => go('beneficiary')} />
          <QuickAction icon="📄" label="Will document"   desc="Upload encrypted doc"   onClick={() => go('txSuccess', { txAction: 'Document uploaded on-chain' })} />
          <QuickAction icon="⚙️" label="Trigger rules"   desc="Set inactivity period"  onClick={() => go('beneficiary')} />
        </div>

        <div style={{ height: 4 }} />
      </ScrollContent>
    </div>
  );
}

function AssetRow({ asset }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
        background: hover ? 'var(--cv-card-hover)' : 'var(--cv-card)',
        border: `1px solid ${hover ? 'var(--cv-border-hover)' : 'var(--cv-border)'}`,
        borderRadius: 10, transition: 'all .15s',
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: asset.bg, color: asset.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cv-mono)', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
        {asset.sym}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{asset.name}</div>
        <div style={{ fontSize: 11, color: 'var(--cv-muted)', marginTop: 2 }}>{asset.amount}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{asset.usd}</div>
        <div style={{ fontSize: 11, color: asset.up ? 'var(--cv-accent)' : 'var(--cv-danger)', marginTop: 2 }}>{asset.pct}</div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, desc, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        background: hover ? 'var(--cv-card-hover)' : 'var(--cv-card)',
        border: `1px solid ${hover ? 'rgba(0,229,160,.3)' : 'var(--cv-border)'}`,
        borderRadius: 10, padding: '14px 14px', textAlign: 'left',
        transition: 'all .15s', cursor: 'pointer',
        transform: hover ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 7 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cv-text)' }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--cv-muted)', marginTop: 3 }}>{desc}</div>
    </button>
  );
}
