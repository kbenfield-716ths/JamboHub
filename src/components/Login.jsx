import React from 'react';
import { users } from '../data/mockData';

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
      background: 'linear-gradient(135deg, #003F87 0%, #CE1126 100%)',
      padding: '20px',
      fontFamily: "'Noto Sans', sans-serif"
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px 32px',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
      }}>
        {/* Logo Area */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontSize: '56px',
            marginBottom: '16px'
          }}>
            🏕️
          </div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#111827',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            VAHC Jamboree Hub
          </h1>
          <p style={{ 
            color: '#6B7280', 
            fontSize: '14px',
            margin: 0,
            fontWeight: '500'
          }}>
            National Jamboree 2025
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Select Your Account
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '15px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: '500',
                color: '#111827',
                transition: 'border-color 0.2s'
              }}
            >
              <option value="">Choose a user...</option>
              <optgroup label="Adult Leaders">
                {users.filter(u => u.role === 'adult').map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} • {user.unit}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Youth">
                {users.filter(u => u.role === 'youth').map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} • {user.unit}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Parents">
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
              padding: '16px',
              background: selectedUser ? 'linear-gradient(135deg, #CE1126 0%, #A00F1E 100%)' : '#D1D5DB',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: selectedUser ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: selectedUser ? '0 4px 12px rgba(206, 17, 38, 0.3)' : 'none',
              letterSpacing: '0.3px'
            }}
          >
            Sign In to Hub
          </button>
        </form>

        {/* Demo Notice */}
        <div style={{ 
          marginTop: '32px', 
          padding: '16px', 
          background: '#FEF3C7', 
          borderRadius: '10px',
          border: '1px solid #FCD34D'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>ℹ️</span>
            <div>
              <p style={{ 
                fontSize: '13px', 
                color: '#92400E', 
                margin: '0 0 6px 0',
                fontWeight: '600'
              }}>
                Demo Version
              </p>
              <p style={{ 
                fontSize: '12px', 
                color: '#92400E', 
                margin: 0,
                lineHeight: '1.6'
              }}>
                Try different user roles to see how YPT-compliant access control works. 
                Each role has different permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Powered By */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          paddingTop: '24px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <p style={{
            fontSize: '11px',
            color: '#9CA3AF',
            margin: '0 0 6px 0',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Powered by
          </p>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#374151',
            letterSpacing: '-0.3px'
          }}>
            🦆 Platypus & Fox 🦊
          </div>
        </div>
      </div>
    </div>
  );
}

