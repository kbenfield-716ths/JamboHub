import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import * as api from '../lib/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await api.login(email, password);
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #7C3AED 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img 
            src="/jambo-icon-512.png" 
            alt="JamboHub" 
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'contain',
              marginBottom: '16px',
              borderRadius: '20px'
            }}
            onError={(e) => {
              // Fallback if logo doesn't load
              e.target.style.display = 'none';
            }}
          />
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '800', 
            color: '#1a1a1a',
            margin: '0 0 4px 0',
            letterSpacing: '-0.5px'
          }}>
            JamboHub
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            margin: 0
          }}>
            VAHC Contingent • 2026 National Jamboree
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            marginBottom: '16px',
            color: '#DC2626',
            fontSize: '14px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., kyle.e"
              required
              autoCapitalize="none"
              autoCorrect="off"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                background: '#f9fafb',
                outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7C3AED';
                e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                background: '#f9fafb',
                outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7C3AED';
                e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              background: loading 
                ? '#9CA3AF' 
                : 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.1s, box-shadow 0.1s',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(124, 58, 237, 0.4)'
            }}
            onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Help text */}
        <p style={{
          marginTop: '20px',
          fontSize: '13px',
          color: '#6b7280',
          textAlign: 'center',
          lineHeight: 1.5
        }}>
          Use your assigned username and password.<br/>
          Contact your unit leader if you need help.
        </p>

        {/* Powered by */}
        <p style={{
          marginTop: '20px',
          fontSize: '11px',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          Powered by <strong style={{ color: '#7C3AED' }}>Platypus & Fox</strong></p><p>
           <center><img 
            src="/platypus-fox-logo.png" 
            alt="Palatypus&Fox Logo" class="center-image" 
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'contain',
              marginBottom: '16px',
              borderRadius: '20px'
            }}
            onError={(e) => {
              // Fallback if logo doesn't load
              e.target.style.display = 'none';
            }}
          /></center>
        </p>
      </div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
