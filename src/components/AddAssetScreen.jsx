import { useState } from 'react';
import { Nav, BackBtn, Input, Select, BtnPrimary, ScrollContent, SectionLabel } from './UI';
import { addAsset as firebaseAddAsset } from '../services/firebaseService';

const ASSET_TYPES = [
  'Cryptocurrency (ERC-20)',
  'NFT (ERC-721)',
  'NFT Collection (ERC-1155)',
  'Encrypted Document',
  'Stablecoin (USDC / DAI)',
];

const TRIGGERS = [
  'Inactivity trigger (180 days)',
  'Fixed date — Jan 1, 2035',
  'Multi-sig approval from beneficiaries',
  'Oracle-based (on-chain event)',
];

const PRESETS = [
  { sym: 'ETH', label: 'Ethereum', addr: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
  { sym: 'BTC', label: 'Wrapped BTC', addr: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
  { sym: 'USDC', label: 'USD Coin', addr: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
];

export default function AddAssetScreen({ go, vault }) {
  const [assetType, setAssetType] = useState(ASSET_TYPES[0]);
  const [address, setAddress]   = useState('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599');
  const [amount, setAmount]     = useState('0.25');
  const [trigger, setTrigger]   = useState(TRIGGERS[0]);
  const [submitting, setSubmitting] = useState(false);

  const estUsd = parseFloat(amount || 0) * 36800;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const newAsset = {
        id: Date.now(),
        type: assetType,
        address,
        amount,
        trigger,
        sym: assetType.includes('NFT') ? 'NFT' : assetType.includes('Stable') ? 'USDC' : 'ETH',
        name: assetType.includes('NFT') ? 'New NFT Asset' : assetType.includes('Stable') ? 'Stablecoin' : 'New Token',
        amountDisplay: `${amount} units`,
        usd: `$${estUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
        pct: '+0.0%', 
        up: true,
        bg: 'rgba(124,58,237,.15)', 
        color: '#a78bfa',
      };
      
      await firebaseAddAsset(vault.id, newAsset);
      go('txSuccess', { txAction: 'Asset locked in vault' });
    } catch (error) {
      console.error('Error adding asset:', error);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '680px', animation: 'fadeSlideUp .35s ease both' }}>
      <Nav left={<BackBtn onClick={() => go('dashboard')} />} />

      <div style={{ padding: '18px 18px 12px', borderBottom: '1px solid var(--cv-border)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 3 }}>Lock an asset</h2>
        <p style={{ fontSize: 13, color: 'var(--cv-muted)' }}>Add crypto or NFTs to your inheritance vault.</p>
      </div>

      <ScrollContent>
        {/* Quick presets */}
        <SectionLabel>Quick select</SectionLabel>
        <div style={{ display: 'flex', gap: 8 }}>
          {PRESETS.map(p => (
            <PresetChip key={p.sym} preset={p} active={address === p.addr} onClick={() => setAddress(p.addr)} />
          ))}
        </div>

        <Select label="Asset type" value={assetType} onChange={e => setAssetType(e.target.value)}>
          {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
        </Select>

        <Input
          label="Token or contract address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="0x... or ENS name"
        />

        <Input
          label="Amount to lock"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          type="number"
          min="0"
        />

        <Select label="Release condition" value={trigger} onChange={e => setTrigger(e.target.value)}>
          {TRIGGERS.map(t => <option key={t}>{t}</option>)}
        </Select>

        {/* Fee summary */}
        <div style={{ background: 'var(--cv-bg)', border: '1px solid var(--cv-border)', borderRadius: 10, padding: 14 }}>
          <p style={{ fontSize: 11, color: 'var(--cv-muted)', fontWeight: 500, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 10 }}>Transaction summary</p>
          {[
            { label: 'Asset value',       val: `~$${estUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}` },
            { label: 'Protocol fee (0.1%)', val: `$${(estUsd * 0.001).toFixed(2)}` },
            { label: 'Gas estimate',      val: '0.004 ETH' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', color: 'var(--cv-muted)' }}>
              <span>{r.label}</span>
              <span style={{ fontFamily: 'var(--cv-mono)', color: 'var(--cv-text)' }}>{r.val}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--cv-border)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 500 }}>
            <span>You deposit</span>
            <span style={{ fontFamily: 'var(--cv-mono)', color: 'var(--cv-accent)' }}>{amount || 0} + gas</span>
          </div>
        </div>

        <BtnPrimary onClick={handleConfirm} style={{ opacity: submitting ? .6 : 1 }}>
          {submitting ? 'Submitting...' : 'Confirm & Lock Asset'}
        </BtnPrimary>
      </ScrollContent>
    </div>
  );
}

function PresetChip({ preset, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '8px 6px', borderRadius: 8, fontSize: 12, fontWeight: 500,
      background: active ? 'rgba(0,229,160,.12)' : 'var(--cv-card)',
      border: `1px solid ${active ? 'rgba(0,229,160,.4)' : 'var(--cv-border)'}`,
      color: active ? 'var(--cv-accent)' : 'var(--cv-muted)',
      cursor: 'pointer', transition: 'all .15s',
    }}>
      <div style={{ fontFamily: 'var(--cv-mono)', fontSize: 11 }}>{preset.sym}</div>
      <div style={{ fontSize: 10, marginTop: 2, color: active ? 'var(--cv-accent)' : 'var(--cv-muted2)' }}>{preset.label}</div>
    </button>
  );
}
