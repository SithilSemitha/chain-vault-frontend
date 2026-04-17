import { useState, useEffect } from 'react';
import { Nav, BackBtn, SectionLabel, BtnPrimary, ScrollContent } from './UI';
import { addBeneficiary as firebaseAddBeneficiary, removeBeneficiary as firebaseRemoveBeneficiary, updateBeneficiary as firebaseUpdateBeneficiary } from '../services/firebaseService';

const INITIAL_BENE = [
  { id: 1, name: 'Sara Ramirez', addr: '0x4ab…c3d1', pct: 65, initials: 'SR', bg: 'rgba(0,229,160,.12)', color: 'var(--cv-accent)' },
  { id: 2, name: 'James Kim',    addr: '0x9ff…12e7', pct: 35, initials: 'JK', bg: 'rgba(124,58,237,.15)', color: '#a78bfa' },
];

const TRIGGERS = [
  { id: 'inactivity', label: 'Inactivity period',  desc: 'Release if wallet inactive for 180 days' },
  { id: 'date',       label: 'Scheduled date',      desc: 'Release on a specific calendar date' },
  { id: 'multisig',   label: 'Multi-sig vote',       desc: 'Heirs must collectively approve' },
  { id: 'oracle',     label: 'Chainlink oracle',     desc: 'Trigger on verified real-world event' },
];

export default function BeneficiaryScreen({ go, vault }) {
  const [benes, setBenes]       = useState(vault?.beneficiaries || INITIAL_BENE);
  const [trigger, setTrigger]   = useState('inactivity');
  const [saving, setSaving]     = useState(false);
  
  useEffect(() => {
    if (vault?.beneficiaries) {
      setBenes(vault.beneficiaries);
    }
  }, [vault]);

  const totalPct = benes.reduce((s, b) => s + b.pct, 0);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      go('txSuccess', { txAction: 'Beneficiary configuration saved on-chain' });
    } catch (error) {
      console.error('Error saving beneficiaries:', error);
      setSaving(false);
    }
  };

  const removeBene = async (id) => {
    try {
      await firebaseRemoveBeneficiary(vault.id, id);
      setBenes(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error removing beneficiary:', error);
    }
  };

  const addBene = async () => {
    const colors = [
      { bg: 'rgba(245,158,11,.15)', color: '#f59e0b' },
      { bg: 'rgba(239,68,68,.15)',  color: '#ef4444' },
    ];
    const c = colors[benes.length % colors.length];
    const newBeneficiary = {
      id: Date.now(), 
      name: 'New Beneficiary', 
      addr: '0x000…0000',
      pct: Math.max(0, 100 - totalPct), 
      initials: 'NB', 
      ...c,
    };
    try {
      await firebaseAddBeneficiary(vault.id, newBeneficiary);
      setBenes(prev => [...prev, newBeneficiary]);
    } catch (error) {
      console.error('Error adding beneficiary:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '680px', animation: 'fadeSlideUp .35s ease both' }}>
      <Nav left={<BackBtn onClick={() => go('dashboard')} />} />

      <div style={{ padding: '18px 18px 12px', borderBottom: '1px solid var(--cv-border)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 3 }}>Beneficiaries</h2>
        <p style={{ fontSize: 13, color: 'var(--cv-muted)' }}>Manage heirs and asset distribution rules.</p>
      </div>

      <ScrollContent>
        {/* Allocation bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--cv-muted)' }}>Total allocation</span>
            <span style={{ fontFamily: 'var(--cv-mono)', fontSize: 12, color: totalPct === 100 ? 'var(--cv-accent)' : 'var(--cv-warn)' }}>{totalPct}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--cv-border)', borderRadius: 3, overflow: 'hidden' }}>
            {benes.map((b, i) => {
              const left = benes.slice(0, i).reduce((s, x) => s + x.pct, 0);
              return (
                <div key={b.id} style={{ position: 'relative', display: 'inline-block', width: `${b.pct}%`, height: '100%', background: b.color, marginLeft: i === 0 ? 0 : '1px' }} />
              );
            })}
          </div>
        </div>

        <SectionLabel>Heirs ({benes.length} of 5 slots)</SectionLabel>

        {benes.map(b => (
          <BeneCard key={b.id} bene={b} vault={vault} onRemove={removeBene} onEditPct={(id, p) => {
            setBenes(prev => prev.map(x => x.id === id ? { ...x, pct: Number(p) } : x));
            firebaseUpdateBeneficiary(vault.id, id, { pct: Number(p) }).catch(e => console.error('Error updating percentage:', e));
          }} />
        ))}

        {benes.length < 5 && (
          <button onClick={addBene} style={{
            background: 'transparent', border: '1px dashed var(--cv-border)',
            borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8, cursor: 'pointer',
            color: 'var(--cv-muted)', fontSize: 13, fontFamily: 'var(--cv-sans)',
            width: '100%', transition: 'all .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,229,160,.4)'; e.currentTarget.style.color = 'var(--cv-accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cv-border)'; e.currentTarget.style.color = 'var(--cv-muted)'; }}
          >
            + Add beneficiary
          </button>
        )}

        <SectionLabel>Release trigger</SectionLabel>
        <div style={{ background: 'var(--cv-bg)', border: '1px solid var(--cv-border)', borderRadius: 10, overflow: 'hidden' }}>
          {TRIGGERS.map((t, i) => (
            <label key={t.id} onClick={() => setTrigger(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderBottom: i < TRIGGERS.length - 1 ? '1px solid var(--cv-border)' : 'none',
              cursor: 'pointer', background: trigger === t.id ? 'rgba(0,229,160,.04)' : 'transparent',
              transition: 'background .15s',
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${trigger === t.id ? 'var(--cv-accent)' : 'var(--cv-border)'}`,
                background: trigger === t.id ? 'var(--cv-accent)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s',
              }}>
                {trigger === t.id && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#050708' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: 'var(--cv-muted)', marginTop: 1 }}>{t.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <BtnPrimary onClick={handleSave} style={{ opacity: saving ? .6 : 1 }}>
          {saving ? 'Saving on-chain...' : 'Save changes on-chain'}
        </BtnPrimary>
      </ScrollContent>
    </div>
  );
}

function BeneCard({ bene, onRemove, onEditPct }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--cv-card-hover)' : 'var(--cv-card)',
        border: '1px solid var(--cv-border)', borderRadius: 10, padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 12, transition: 'all .15s',
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: bene.bg, color: bene.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
        {bene.initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{bene.name}</div>
        <div style={{ fontFamily: 'var(--cv-mono)', fontSize: 10, color: 'var(--cv-muted)', marginTop: 2 }}>{bene.addr} · Verified</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ textAlign: 'right' }}>
          <input
            type="number" min="0" max="100" value={bene.pct}
            onChange={e => onEditPct(bene.id, e.target.value)}
            style={{
              width: 48, background: 'var(--cv-bg)', border: '1px solid var(--cv-border)',
              borderRadius: 6, padding: '4px 6px', color: bene.color,
              fontFamily: 'var(--cv-mono)', fontSize: 14, fontWeight: 700,
              textAlign: 'center', outline: 'none',
            }}
          />
          <div style={{ fontSize: 10, color: 'var(--cv-muted)', marginTop: 2, textAlign: 'center' }}>share %</div>
        </div>
        <button onClick={() => onRemove(bene.id)} style={{
          background: 'transparent', border: '1px solid var(--cv-border)', borderRadius: 6,
          color: 'var(--cv-muted)', fontSize: 12, padding: '4px 7px', cursor: 'pointer',
          transition: 'all .15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cv-danger)'; e.currentTarget.style.color = 'var(--cv-danger)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cv-border)'; e.currentTarget.style.color = 'var(--cv-muted)'; }}
        >✕</button>
      </div>
    </div>
  );
}
