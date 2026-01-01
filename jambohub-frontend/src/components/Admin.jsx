import React, { useState, useEffect } from 'react';
import { 
  Shield, UserPlus, Search, Edit2, Trash2, 
  KeyRound, X, Users, Loader2, Upload, Download,
  Hash, Plus, FileText, Copy, Check, ChevronDown, ChevronUp,
  MessageSquare, Mail, Bell
} from 'lucide-react';
import * as api from '../lib/api';

export default function Admin({ currentUser }) {
  const [activeTab, setActiveTab] = useState('roster');
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [unitFilter, setUnitFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);

  const emptyForm = {
    username: '', firstName: '', lastName: '', email: '', phone: '',
    age: '', gender: '', role: 'youth', position: '', unit: '', patrol: '',
    emergencyContactName: '', emergencyContactPhone: '', password: ''
  };
  const [formData, setFormData] = useState(emptyForm);
  const [unitFormData, setUnitFormData] = useState({ name: '' });
  const [bulkData, setBulkData] = useState('');

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'adult_leader', label: 'Adult Leader' },
    { value: 'youth', label: 'Youth' },
    { value: 'parent', label: 'Parent' }
  ];

  const positions = [
    'Scoutmaster', 'Assistant Scoutmaster', 'Senior Patrol Leader', 'Assistant Senior Patrol Leader',
    'Patrol Leader', 'Assistant Patrol Leader', 'Troop Guide', 'Quartermaster', 'Scribe',
    'Librarian', 'Historian', 'Chaplain Aide', 'OA Representative', 'Leave No Trace Trainer',
    'Instructor', 'Den Chief', 'Webmaster', 'Bugler', 'Outdoor Ethics Guide', 'Committee Chair',
    'Committee Member', 'Treasurer', 'Charter Rep', 'Advancement Chair', 'Parent/Guardian', 'Scout'
  ];

  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [usersData, unitsData, channelsData] = await Promise.all([
        api.getAllUsers(),
        api.getUnits().catch(() => []),
        api.getChannels().catch(() => [])
      ]);
      setUsers(usersData);
      setUnits(unitsData);
      setChannels(channelsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        gender: user.gender || '',
        role: user.role || 'youth',
        position: user.position || '',
        unit: user.unit || '',
        patrol: user.patrol || '',
        emergencyContactName: user.emergencyContactName || '',
        emergencyContactPhone: user.emergencyContactPhone || '',
        password: ''
      });
    } else {
      setEditingUser(null);
      setFormData(emptyForm);
    }
    setShowModal(true);
  };

  const getDefaultPassword = (role) => role === 'admin' ? 'The3Bears' : 'Jambo2026!';

  const handleSaveUser = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.role) {
      setError('First name, last name, email, and role are required');
      return;
    }
    try {
      const userData = {
        username: formData.username || null,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        role: formData.role,
        position: formData.position || null,
        unit: formData.unit || null,
        patrol: formData.patrol || null,
        emergencyContactName: formData.emergencyContactName || null,
        emergencyContactPhone: formData.emergencyContactPhone || null
      };
      
      if (editingUser) {
        if (formData.password) userData.password = formData.password;
        await api.updateUser(editingUser.id, userData);
      } else {
        userData.password = formData.password || getDefaultPassword(formData.role);
        await api.createUser(userData);
      }
      await fetchData();
      setShowModal(false);
      setEditingUser(null);
      setSuccess(editingUser ? 'User updated!' : 'User created!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.deleteUser(userId);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (user) => {
    const defaultPw = getDefaultPassword(user.role);
    if (!confirm(`Reset password to ${defaultPw}?`)) return;
    try {
      await api.resetUserPassword(user.id);
      setSuccess(`Password reset to ${defaultPw}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveUnit = async () => {
    if (!unitFormData.name) { setError('Unit name required'); return; }
    try {
      if (editingUnit) {
        await api.updateUnit(editingUnit.id, unitFormData);
      } else {
        await api.createUnit(unitFormData);
      }
      await fetchData();
      setShowUnitModal(false);
      setEditingUnit(null);
      setSuccess(editingUnit ? 'Unit updated!' : 'Unit created!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (!confirm('Delete this unit?')) return;
    try {
      await api.deleteUnit(unitId);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleChannelNotification = async (channelId, field, currentValue) => {
    try {
      await api.updateChannel(channelId, { [field]: !currentValue });
      setChannels(prev => prev.map(ch => 
        ch.id === channelId ? { ...ch, [field]: !currentValue } : ch
      ));
      setSuccess(`Channel updated!`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message || 'Failed to update channel');
    }
  };

  const handleBulkUpload = async () => {
    const lines = bulkData.trim().split('\n').filter(l => l.trim() && !l.toLowerCase().startsWith('username,'));
    if (!lines.length) { setError('No data'); return; }
    let created = 0, errors = [];
    for (const line of lines) {
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      if (parts.length < 4) { errors.push(`Invalid: ${line}`); continue; }
      const [username, firstName, lastName, email, role, position, unit, patrol, phone, age, gender, emergencyContactName, emergencyContactPhone] = parts.map(p => p.trim());
      const userRole = role || 'youth';
      try {
        await api.createUser({
          username: username || null,
          firstName,
          lastName,
          email,
          phone: phone || null,
          age: age ? parseInt(age) : null,
          gender: gender || null,
          role: userRole,
          position: position || null,
          unit: unit || null,
          patrol: patrol || null,
          emergencyContactName: emergencyContactName || null,
          emergencyContactPhone: emergencyContactPhone || null,
          password: getDefaultPassword(userRole)
        });
        created++;
      } catch (err) {
        errors.push(`${username || email}: ${err.message}`);
      }
    }
    await fetchData();
    setShowBulkModal(false);
    setBulkData('');
    if (errors.length) setError(`Created ${created}. Errors: ${errors.slice(0,3).join('; ')}`);
    else { setSuccess(`Created ${created} users!`); setTimeout(() => setSuccess(''), 3000); }
  };

  const downloadTemplate = () => {
    const csv = `Username,First Name,Last Name,Email,Role,Position,Unit,Patrol,Phone,Age,Gender,Emergency Contact,Emergency Phone
kyle.e,Kyle,Enfield,kyle@email.com,admin,Scoutmaster,VAHC Leadership,,555-123-4567,45,Male,Jane Enfield,555-987-6543
john.s,John,Smith,john@email.com,adult_leader,Assistant Scoutmaster,Troop 123,,555-234-5678,38,Male,Mary Smith,555-876-5432
jane.d,Jane,Doe,jane@email.com,youth,Senior Patrol Leader,Troop 123,Eagle Patrol,555-345-6789,16,Female,Bob Doe,555-765-4321
bob.p,Bob,Parent,bob@email.com,parent,Parent/Guardian,Troop 123,,555-456-7890,42,Male,Sue Parent,555-654-3210`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'jambohub-users-template.csv';
    a.click();
  };

  const copyEmailList = () => {
    const emails = filteredUsers.map(u => u.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportRoster = () => {
    const csv = ['Username,First Name,Last Name,Email,Role,Position,Unit,Patrol,Phone,Age,Gender,Emergency Contact,Emergency Phone',
      ...filteredUsers.map(u => 
        `"${u.username || ''}","${u.firstName}","${u.lastName}","${u.email}","${u.role}","${u.position || ''}","${u.unit || ''}","${u.patrol || ''}","${u.phone || ''}","${u.age || ''}","${u.gender || ''}","${u.emergencyContactName || ''}","${u.emergencyContactPhone || ''}"`
      )
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'jambohub-roster.csv';
    a.click();
  };

  const allUnits = [...new Set(users.map(u => u.unit).filter(Boolean))];

  const filteredUsers = users.filter(u => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = 
      (u.firstName?.toLowerCase() || '').includes(searchLower) ||
      (u.lastName?.toLowerCase() || '').includes(searchLower) ||
      (u.email?.toLowerCase() || '').includes(searchLower) ||
      (u.username?.toLowerCase() || '').includes(searchLower);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchUnit = unitFilter === 'all' || u.unit === unitFilter;
    return matchSearch && matchRole && matchUnit;
  });

  const getRoleBadge = (role) => ({
    admin: { label: 'Admin', color: '#DC2626', bg: '#FEE2E2' },
    adult_leader: { label: 'Adult Leader', color: '#7C3AED', bg: '#EDE9FE' },
    youth: { label: 'Youth', color: '#059669', bg: '#D1FAE5' },
    parent: { label: 'Parent', color: '#D97706', bg: '#FEF3C7' }
  }[role] || { label: role, color: '#6B7280', bg: '#F3F4F6' });

  const getRoleGradient = (role) => ({
    admin: 'linear-gradient(135deg, #DC2626, #EF4444)',
    adult_leader: 'linear-gradient(135deg, #7C3AED, #A855F7)',
    youth: 'linear-gradient(135deg, #059669, #10B981)',
    parent: 'linear-gradient(135deg, #D97706, #F59E0B)'
  }[role] || 'linear-gradient(135deg, #6B7280, #9CA3AF)');

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
      <Loader2 size={24} className="spin" /><span style={{ marginLeft: 8 }}>Loading...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );

  const inputStyle = { width: '100%', padding: 10, fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#374151' };

  return (
    <div style={{ padding: '20px 20px 100px 20px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #7C3AED, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Admin Panel</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>{users.length} registered users</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #e5e7eb', paddingBottom: 12, overflowX: 'auto' }}>
        {[
          { id: 'roster', icon: <FileText size={18} />, label: 'Roster' },
          { id: 'users', icon: <Users size={18} />, label: 'Manage Users' },
          { id: 'units', icon: <Hash size={18} />, label: 'Units' },
          { id: 'channels', icon: <MessageSquare size={18} />, label: 'Channels' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '10px 20px', background: activeTab === tab.id ? '#7C3AED' : 'transparent',
            color: activeTab === tab.id ? 'white' : '#6b7280', border: 'none', borderRadius: 8,
            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'
          }}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {error && <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, marginBottom: 16, color: '#DC2626', fontSize: 14 }}>{error}<button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button></div>}
      {success && <div style={{ padding: '12px 16px', background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 8, marginBottom: 16, color: '#059669', fontSize: 14 }}>{success}</div>}

      {/* CHANNELS TAB */}
      {activeTab === 'channels' && <>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 16px 0' }}>
            Control which channels send email and push notifications when new messages are posted.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {channels.map(channel => (
            <div key={channel.id} style={{ background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #7C3AED, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {channel.icon || '📢'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{channel.name}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{channel.description || channel.type}</div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <button
                  onClick={() => handleToggleChannelNotification(channel.id, 'emailNotifications', channel.emailNotifications)}
                  title={channel.emailNotifications ? 'Email notifications ON' : 'Email notifications OFF'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
                    background: channel.emailNotifications ? '#D1FAE5' : '#F3F4F6',
                    color: channel.emailNotifications ? '#059669' : '#9ca3af',
                    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500
                  }}
                >
                  <Mail size={16} />
                  Email {channel.emailNotifications ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => handleToggleChannelNotification(channel.id, 'pushNotifications', channel.pushNotifications)}
                  title={channel.pushNotifications ? 'Push notifications ON' : 'Push notifications OFF'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
                    background: channel.pushNotifications ? '#D1FAE5' : '#F3F4F6',
                    color: channel.pushNotifications ? '#059669' : '#9ca3af',
                    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500
                  }}
                >
                  <Bell size={16} />
                  Push {channel.pushNotifications ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          ))}
          {channels.length === 0 && (
            <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>
              <MessageSquare size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ fontSize: 16, fontWeight: 500 }}>No channels found</p>
            </div>
          )}
        </div>
      </>}

      {/* ROSTER TAB */}
      {activeTab === 'roster' && <>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." style={{ width: '100%', padding: '12px 12px 12px 44px', fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 10, background: '#F3F4F6', boxSizing: 'border-box' }} />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '12px 16px', fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 10, background: 'white' }}>
            <option value="all">All Roles</option>
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} style={{ padding: '12px 16px', fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 10, background: 'white' }}>
            <option value="all">All Units</option>
            {allUnits.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <button onClick={copyEmailList} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            {copied ? <Check size={16} color="#059669" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Emails'}
          </button>
          <button onClick={exportRoster} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <Download size={16} />Export CSV
          </button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 13, color: '#6b7280', alignSelf: 'center' }}>{filteredUsers.length} people</span>
        </div>

        {/* Roster Table */}
        <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 800 }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Username</th>
                  <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Name</th>
                  <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Email</th>
                  <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Phone</th>
                  <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Role</th>
                  <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Position</th>
                  <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Unit</th>
                  <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Patrol</th>
                  <th style={{ padding: '12px 12px', textAlign: 'center', fontWeight: 600, color: '#374151', width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => {
                  const badge = getRoleBadge(user.role);
                  const isExpanded = expandedUser === user.id;
                  return (
                    <React.Fragment key={user.id}>
                      <tr style={{ borderBottom: '1px solid #E5E7EB', background: isExpanded ? '#F9FAFB' : 'white' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#7C3AED' }}>{user.username || '—'}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 500 }}>{user.lastName}, {user.firstName}</td>
                        <td style={{ padding: '10px 12px', color: '#6b7280' }}>{user.email}</td>
                        <td style={{ padding: '10px 12px', color: '#6b7280' }}>{user.phone || '—'}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: badge.color, background: badge.bg, padding: '3px 8px', borderRadius: 10 }}>{badge.label}</span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#6b7280' }}>{user.position || '—'}</td>
                        <td style={{ padding: '10px 12px', color: '#6b7280' }}>{user.unit || '—'}</td>
                        <td style={{ padding: '10px 12px', color: '#6b7280' }}>{user.patrol || '—'}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button onClick={() => setExpandedUser(isExpanded ? null : user.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr style={{ background: '#F9FAFB' }}>
                          <td colSpan={9} style={{ padding: '12px 20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, fontSize: 13 }}>
                              <div><strong>Age:</strong> {user.age || '—'}</div>
                              <div><strong>Gender:</strong> {user.gender || '—'}</div>
                              <div><strong>Emergency Contact:</strong> {user.emergencyContactName || '—'}</div>
                              <div><strong>Emergency Phone:</strong> {user.emergencyContactPhone || '—'}</div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No users found</div>
          )}
        </div>
      </>}

      {/* USERS TAB */}
      {activeTab === 'users' && <>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <button onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
            <UserPlus size={18} />Add User
          </button>
          <button onClick={() => setShowBulkModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: '#059669', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
            <Upload size={18} />Bulk Import
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." style={{ width: '100%', padding: '12px 12px 12px 44px', fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 10, background: '#F3F4F6', boxSizing: 'border-box' }} />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '12px 16px', fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 10, background: 'white', minWidth: 140 }}>
            <option value="all">All Roles</option>
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredUsers.map(user => {
            const badge = getRoleBadge(user.role);
            const isMe = user.id === currentUser?.id;
            return (
              <div key={user.id} style={{ background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: getRoleGradient(user.role), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                  {user.role === 'admin' ? <Shield size={20} /> : (user.firstName?.charAt(0) || '?')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{user.lastName}, {user.firstName}</span>
                    {user.username && <span style={{ fontSize: 12, color: '#7C3AED', fontWeight: 500 }}>@{user.username}</span>}
                    {isMe && <span style={{ fontSize: 10, fontWeight: 700, color: '#7C3AED', background: '#EDE9FE', padding: '2px 6px', borderRadius: 4 }}>YOU</span>}
                    <span style={{ fontSize: 11, fontWeight: 600, color: badge.color, background: badge.bg, padding: '2px 8px', borderRadius: 10 }}>{badge.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{[user.position, user.unit, user.patrol].filter(Boolean).join(' • ') || '—'}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleResetPassword(user)} title="Reset Password" style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#F3F4F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}><KeyRound size={16} /></button>
                  <button onClick={() => handleOpenModal(user)} title="Edit" style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#EDE9FE', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteUser(user.id)} disabled={isMe} title="Delete" style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: isMe ? '#F3F4F6' : '#FEE2E2', cursor: isMe ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isMe ? '#D1D5DB' : '#DC2626', opacity: isMe ? 0.5 : 1 }}><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {/* UNITS TAB */}
      {activeTab === 'units' && <>
        <button onClick={() => { setEditingUnit(null); setUnitFormData({ name: '' }); setShowUnitModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', marginBottom: 20 }}>
          <Plus size={18} />Add Unit
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {units.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>
              <Hash size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ fontSize: 16, fontWeight: 500 }}>No units yet</p>
            </div>
          ) : units.map(unit => (
            <div key={unit.id} style={{ background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #06B6D4, #22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🏕️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{unit.name}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{users.filter(u => u.unit === unit.name).length} members</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setEditingUnit(unit); setUnitFormData({ name: unit.name }); setShowUnitModal(true); }} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#EDE9FE', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}><Edit2 size={16} /></button>
                <button onClick={() => handleDeleteUnit(unit.id)} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#FEE2E2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* USER MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => { setShowModal(false); setEditingUser(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Username (for login)</label>
                <input type="text" value={formData.username} onChange={e => setFormData(p => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, '') }))} placeholder="e.g., kyle.e" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>First Name *</label>
                <input type="text" value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input type="text" value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="555-123-4567" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Age</label>
                <input type="number" value={formData.age} onChange={e => setFormData(p => ({ ...p, age: e.target.value }))} min="5" max="99" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Gender</label>
                <select value={formData.gender} onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))} style={inputStyle}>
                  <option value="">Select...</option>
                  {genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Role *</label>
                <select value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} style={inputStyle}>
                  {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Position</label>
                <select value={formData.position} onChange={e => setFormData(p => ({ ...p, position: e.target.value }))} style={inputStyle}>
                  <option value="">Select...</option>
                  {positions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Unit</label>
                <select value={formData.unit} onChange={e => setFormData(p => ({ ...p, unit: e.target.value }))} style={inputStyle}>
                  <option value="">No Unit</option>
                  {units.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Patrol</label>
                <input type="text" value={formData.patrol} onChange={e => setFormData(p => ({ ...p, patrol: e.target.value }))} placeholder="e.g., Eagle Patrol" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Password {editingUser ? '(blank = keep)' : `(default: ${getDefaultPassword(formData.role)})`}</label>
                <input type="text" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} placeholder={editingUser ? '••••••••' : getDefaultPassword(formData.role)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Emergency Contact Name</label>
                <input type="text" value={formData.emergencyContactName} onChange={e => setFormData(p => ({ ...p, emergencyContactName: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Emergency Contact Phone</label>
                <input type="tel" value={formData.emergencyContactPhone} onChange={e => setFormData(p => ({ ...p, emergencyContactPhone: e.target.value }))} placeholder="555-123-4567" style={inputStyle} />
              </div>
            </div>

            {formData.role === 'admin' && (
              <p style={{ fontSize: 12, color: '#DC2626', marginTop: 12, background: '#FEE2E2', padding: 10, borderRadius: 8 }}>⚠️ Admins have full access to manage all users and settings</p>
            )}

            <button onClick={handleSaveUser} style={{ width: '100%', padding: 14, marginTop: 20, fontSize: 15, fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #7C3AED, #A855F7)', border: 'none', borderRadius: 10, cursor: 'pointer' }}>{editingUser ? 'Save Changes' : 'Create User'}</button>
          </div>
        </div>
      )}

      {/* UNIT MODAL */}
      {showUnitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{editingUnit ? 'Edit Unit' : 'Add Unit'}</h2>
              <button onClick={() => { setShowUnitModal(false); setEditingUnit(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Unit Name *</label>
              <input type="text" value={unitFormData.name} onChange={e => setUnitFormData({ name: e.target.value })} placeholder="Troop 123, Crew 22" style={inputStyle} />
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>This will create a dedicated channel for this unit.</p>
            </div>
            <button onClick={handleSaveUnit} style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #7C3AED, #A855F7)', border: 'none', borderRadius: 10, cursor: 'pointer' }}>{editingUnit ? 'Save Changes' : 'Create Unit'}</button>
          </div>
        </div>
      )}

      {/* BULK MODAL */}
      {showBulkModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 700, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Bulk Import</h2>
              <button onClick={() => { setShowBulkModal(false); setBulkData(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <button onClick={downloadTemplate} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 16 }}>
              <Download size={16} />Download Template
            </button>
            <textarea value={bulkData} onChange={e => setBulkData(e.target.value)} placeholder="Username,First Name,Last Name,Email,Role,Position,Unit,Patrol,Phone,Age,Gender,Emergency Contact,Emergency Phone" rows={10} style={{ width: '100%', padding: 12, fontSize: 12, fontFamily: 'monospace', border: '2px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box', resize: 'vertical' }} />
            <div style={{ fontSize: 11, color: '#6b7280', margin: '12px 0 16px', background: '#F9FAFB', padding: 12, borderRadius: 8 }}>
              <strong>13 Columns:</strong> Username, First Name, Last Name, Email, Role, Position, Unit, Patrol, Phone, Age, Gender, Emergency Contact, Emergency Phone<br/>
              <strong>Roles:</strong> admin, adult_leader, youth, parent<br/>
              <strong>Passwords:</strong> Admins get "The3Bears", others get "Jambo2026!"
            </div>
            <button onClick={handleBulkUpload} disabled={!bulkData.trim()} style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 600, color: 'white', background: bulkData.trim() ? '#059669' : '#9CA3AF', border: 'none', borderRadius: 10, cursor: bulkData.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Upload size={18} />Import Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
