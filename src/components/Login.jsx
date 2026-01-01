import React from 'react';
import { users } from '../data/mockData';
import { Zap } from 'lucide-react';

export default function Login({ onLogin }) {
  const [selectedUser, setSelectedUser] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.id === selectedUser);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FAFBFC 0%, #E0E7F1 50%, #FFE5E5 100%)',
      padding: '20px',
      fontFamily: "'Noto Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating decorative circles */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(206, 17, 38, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255, 107, 53, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
      `}</style>

      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px 40px',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)',
        position: 'relative'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img 
            src="/platypus-fox-logo.png" 
            alt="Platypus & Fox" 
            style={{ 
              width: '100px',
              height: '100px',
              marginBottom: '24px',
              animation: 'float 3s ease-in-out infinite'
            }} 
          />
          
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #CE1126 0%, #FF6B35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px',
            letterSpacing: '-1px'
          }}>
            VAHC Jamboree
          </h1>
          <p style={{ 
            color: '#6B7280', 
            fontSize: '14px',
            margin: 0,
            fontWeight: '600',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            National Jamboree 2025
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '10px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Select Account
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px 18px',
                background: '#F9FAFB',
                border: '2px solid #E5E7EB',
                borderRadius: '14px',
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: '600',
                color: '#111827',
                outline: 'none'
              }}
            >
              <option value="">Choose your account...</option>
              <optgroup label="🎖️ Adult Leaders">
                {users.filter(u => u.role === 'adult').map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} • {user.unit}
                  </option>
                ))}
              </optgroup>
              <optgroup label="⚡ Scouts">
                {users.filter(u => u.role === 'youth').map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} • {user.unit}
                  </option>
                ))}
              </optgroup>
              <optgroup label="👥 Parents">
                {users.filter(u => u.role === 'parent').map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} • {user.unit}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedUser}
            style={{
              width: '100%',
              padding: '18px',
              background: selectedUser 
                ? 'linear-gradient(135deg, #CE1126 0%, #FF6B35 100%)' 
                : '#E5E7EB',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '800',
              cursor: selectedUser ? 'pointer' : 'not-allowed',
              boxShadow: selectedUser 
                ? '0 8px 20px rgba(206, 17, 38, 0.3)'
                : 'none',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            Launch Hub 🚀
          </button>
        </form>

        {/* Demo Notice */}
        <div style={{ 
          marginTop: '32px', 
          padding: '18px', 
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', 
          borderRadius: '12px',
          border: '1px solid #FCD34D'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px', flexShrink: 0 }}>⚡</span>
            <div>
              <p style={{ 
                fontSize: '12px', 
                color: '#92400E', 
                margin: '0 0 6px 0',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Demo Mode
              </p>
              <p style={{ 
                fontSize: '13px', 
                color: '#78350F', 
                margin: 0,
                lineHeight: '1.6'
              }}>
                Try different roles to see YPT-compliant access control. Each account has unique permissions!
              </p>
            </div>
          </div>
        </div>

        {/* Platypus & Fox Footer */}
        <div style={{
          marginTop: '32px',
          textAlign: 'center',
          paddingTop: '28px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <p style={{
            fontSize: '10px',
            color: '#9CA3AF',
            margin: '0 0 8px 0',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            Powered by
          </p>
          <img 
            src="/platypus-fox-logo.png" 
            alt="Platypus & Fox" 
            style={{ 
              height: '32px',
              marginBottom: '8px'
            }} 
          />
          <p style={{
            fontSize: '12px',
            color: '#6B7280',
            margin: 0,
            fontStyle: 'italic'
          }}>
            Building tools for Scouting excellence
          </p>
        </div>
      </div>
    </div>
  );
}
