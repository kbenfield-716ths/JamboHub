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

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'adult': return '#CE1126';
      case 'youth': return '#003F87';
      case 'parent': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #003F87 0%, #CE1126 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#1F2937',
            marginBottom: '8px'
          }}>
            VAHC Jamboree Hub
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Jamboree 2025 • Demo Version
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Select Demo User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">Choose a user...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role.charAt(0).toUpperCase() + user.role.slice(1)} ({user.unit})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedUser}
            style={{
              width: '100%',
              padding: '14px',
              background: selectedUser ? '#CE1126' : '#D1D5DB',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: selectedUser ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            Enter Hub
          </button>
        </form>

        <div style={{ 
          marginTop: '30px', 
          padding: '16px', 
          background: '#FEF3C7', 
          borderRadius: '8px',
          border: '1px solid #FCD34D'
        }}>
          <p style={{ 
            fontSize: '13px', 
            color: '#92400E', 
            margin: 0,
            lineHeight: '1.5'
          }}>
            <strong>MVP Demo:</strong> This demonstrates the app's concept with mock data. 
            Try different user roles to see how YPT-compliant access control works.
          </p>
        </div>
      </div>
    </div>
  );
}
