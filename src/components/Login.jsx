import React from 'react';
import { users } from '../data/mockData';
import { LogIn, Sparkles } from 'lucide-react';

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
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
      fontFamily: "'Nunito Sans', -apple-system, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '100px',
        left: '-80px',
        width: '200px',
        height: '200px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%'
      }} />

      {/* Hero Section */}
      <div style={{
        padding: '60px 24px 40px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ 
          fontSize: '72px',
          marginBottom: '20px'
        }}>
          🏕️
        </div>
        
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '800', 
          color: 'white',
          marginBottom: '12px',
          letterSpacing: '-0.5px'
        }}>
          JamboHub
        </h1>
        <p style={{ 
          color: 'rgba(255,255,255,0.9)', 
          fontSize: '16px',
          margin: 0,
          fontWeight: '600'
        }}>
          VAHC Contingent • 2025
        </p>
      </div>

      {/* Login Card */}
      <div style={{
        flex: 1,
        background: 'white',
        borderRadius: '32px 32px 0 0',
        padding: '36px 24px 40px',
        boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#1F2937',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Welcome! 👋
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#6B7280',
            marginBottom: '32px',
            textAlign: 'center',
            lineHeight: '1.5'
          }}>
            Select your account to get started
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '10px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Your Account
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: '#F8F7FC',
                  border: '2px solid #E5E7EB',
                  borderRadius: '16px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: '600',
                  color: '#1F2937',
                  outline: 'none',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center'
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
                <optgroup label="👨‍👩‍👧 Parents">
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
                  ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' 
                  : '#E5E7EB',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '17px',
                fontWeight: '700',
                cursor: selectedUser ? 'pointer' : 'not-allowed',
                boxShadow: selectedUser 
                  ? '0 8px 24px rgba(124, 58, 237, 0.35)'
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <LogIn size={20} />
              Sign In
            </button>
          </form>

          {/* Demo Notice */}
          <div style={{ 
            marginTop: '28px', 
            padding: '20px', 
            background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)', 
            borderRadius: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={20} color="white" />
              </div>
              <div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#5B21B6', 
                  margin: '0 0 6px 0',
                  fontWeight: '700'
                }}>
                  Demo Mode
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6D28D9', 
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Try different roles to see YPT-compliant access control. Each account has unique permissions!
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '32px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#9CA3AF',
              margin: 0,
              fontWeight: '600'
            }}>
              🛡️ YPT Compliant Communication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
