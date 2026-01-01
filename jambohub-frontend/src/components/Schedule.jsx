import React from 'react';
import { Calendar } from 'lucide-react';

export default function Schedule() {
  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Calendar size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Schedule</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Jamboree activities and events</p>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        textAlign: 'center',
        color: '#9ca3af',
        border: '2px dashed #e5e7eb'
      }}>
        <Calendar size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
        <p style={{ fontSize: '16px', margin: 0 }}>
          Schedule coming soon...
        </p>
      </div>
    </div>
  );
}
