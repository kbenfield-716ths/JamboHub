import { useState, useEffect } from 'react';
import { 
  Shield, UserPlus, Search, Edit2, Trash2, 
  KeyRound, X, Users, Loader2 
} from 'lucide-react';
import * as api from '../lib/api';

export default function Admin({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'youth',
    unit: ''
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        unit: user.unit || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: 'Jambo2026!',
        role: 'youth',
        unit: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'youth',
      unit: ''
    });
  };

  const handleSaveUser = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      setError('Name, email, and role are required');
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          unit: formData.unit || null
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await api.updateUser(editingUser.id, updateData);
      } else {
        // Create new user
        await api.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password || 'Jambo2026!',
          role: formData.role,
          unit: formData.unit || null
        });
      }
      
      await fetchUsers();
      handleCloseModal();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.deleteUser(userId);
      await fetchUsers();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleResetPassword = async (userId) => {
    if (!confirm('Reset password to Jambo2026!?')) return;
    
    try {
      await api.resetUserPassword(userId);
      alert('Password reset to Jambo2026!');
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const badges = {
      admin: { label: 'Admin', color: '#DC2626', bg: '#FEE2E2' },
      adult: { label: 'Leader', color: '#7C3AED', bg: '#EDE9FE' },
      youth: { label: 'Scout', color: '#059669', bg: '#D1FAE5' },
      parent: { label: 'Parent', color: '#D97706', bg: '#FEF3C7' }
    };
    return badges[role] || badges.youth;
  };

  const getRoleGradient = (role) => {
    switch(role) {
      case 'admin': return 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)';
      case 'adult': return 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)';
      case 'youth': return 'linear-gradient(135deg, #059669 0%, #10B981 100%)';
      case 'parent': return 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)';
      default: return 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#6b7280'
      }}>
        <Loader2 size={24} className="spin" />
        <span style={{ marginLeft: '8px' }}>Loading users...</span>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin { animation: spin 1s linear infinite; }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={24} color="white" />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              margin: 0,
              color: '#1a1a1a'
            }}>
              Admin Panel
            </h1>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              margin: '2px 0 0 0'
            }}>
              Manage users and permissions
            </p>
          </div>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '8px',
          marginBottom: '16px',
          color: '#DC2626',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: 1,
          minWidth: '200px',
          position: 'relative'
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              fontSize: '14px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              outline: 'none',
              background: '#F3F4F6',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            fontSize: '14px',
            border: '2px solid #e5e7eb',
            borderRadius: '10px',
            background: 'white',
            cursor: 'pointer',
            minWidth: '140px'
          }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="adult">Adult</option>
          <option value="youth">Youth</option>
          <option value="parent">Parent</option>
        </select>
      </div>

      {/* User List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredUsers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 20px',
            color: '#9ca3af'
          }}>
            <Users size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ fontSize: '16px', fontWeight: '500' }}>No users found</p>
          </div>
        ) : (
          filteredUsers.map(user => {
            const badge = getRoleBadge(user.role);
            const isCurrentUser = user.id === currentUser?.id;
            
            return (
              <div
                key={user.id}
                style={{
                  background: 'white',
                  borderRadius: '14px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: getRoleGradient(user.role),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  {user.role === 'admin' ? <Shield size={20} /> : user.name.charAt(0)}
                </div>
                
                {/* User info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      fontSize: '15px',
                      color: '#1a1a1a'
                    }}>
                      {user.name}
                    </span>
                    {isCurrentUser && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: '#7C3AED',
                        background: '#EDE9FE',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        YOU
                      </span>
                    )}
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: badge.color,
                      background: badge.bg,
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {badge.label}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {user.email}
                  </div>
                  {user.unit && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#9ca3af',
                      marginTop: '2px'
                    }}>
                      {user.unit}
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleResetPassword(user.id)}
                    title="Reset Password"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#F3F4F6',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b7280'
                    }}
                  >
                    <KeyRound size={16} />
                  </button>
                  <button
                    onClick={() => handleOpenModal(user)}
                    title="Edit User"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#EDE9FE',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#7C3AED'
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    title="Delete User"
                    disabled={isCurrentUser}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isCurrentUser ? '#F3F4F6' : '#FEE2E2',
                      cursor: isCurrentUser ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCurrentUser ? '#D1D5DB' : '#DC2626',
                      opacity: isCurrentUser ? 0.5 : 1
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '700',
                margin: 0
              }}>
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: '#6b7280'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Password {editingUser && '(leave blank to keep current)'}
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={editingUser ? '••••••••' : 'Jambo2026!'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="adult">Adult Leader</option>
                  <option value="youth">Youth</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., Troop 123, Crew 22"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            
            <button
              onClick={handleSaveUser}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '24px',
                fontSize: '15px',
                fontWeight: '600',
                color: 'white',
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              {editingUser ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
