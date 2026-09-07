import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Lock, 
  X, 
  Save, 
  AlertTriangle,
  KeyRound,
  Shield,
  Check
} from 'lucide-react';
import axios from 'axios';
import { formatText } from '../../utils/textUtils';

export const GovtOfficersManagementTab = ({ currentUser, onRefresh }) => {
  const { t } = useTranslation();
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Department Officer',
    department: 'Public Health Department',
    organization: 'Government of Maharashtra',
    phone: '+91 98200 12345',
    password: 'GovInnovate@2026',
    isActive: true
  });

  const availableRoles = [
    { value: 'Department Officer', label: 'Department Officer (Nodal Desk)' },
    { value: 'Procurement Officer', label: 'Procurement Officer (Legal & Finance)' },
    { value: 'Government Admin', label: 'Government Admin (MSInS / State Cell)' }
  ];

  const defaultDepartments = [
    'Public Health Department',
    'Department of Agriculture',
    'School Education & Sports Department',
    'Maharashtra State Innovation Society (MSInS)',
    'Water Resources Department',
    'State IT & Innovation Cell',
    'Urban Development Department'
  ];

  useEffect(() => {
    fetchOfficersAndDepts();
  }, []);

  const fetchOfficersAndDepts = async () => {
    setLoading(true);
    try {
      const [resOff, resDept] = await Promise.all([
        axios.get('/api/users/officers'),
        axios.get('/api/departments')
      ]);
      setOfficers(resOff.data || []);
      
      const deptList = (resDept.data || []).map(d => d.name);
      const combinedDepts = Array.from(new Set([...defaultDepartments, ...deptList]));
      setDepartments(combinedDepts);
    } catch (err) {
      console.error('Failed to load officers:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleOpenCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Department Officer',
      department: departments[0] || 'Public Health Department',
      organization: 'Government of Maharashtra',
      phone: '+91 98200 12345',
      password: 'GovInnovate@2026',
      isActive: true
    });
    setFormError('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (officer) => {
    setSelectedOfficer(officer);
    setFormData({
      name: officer.name || '',
      email: officer.email || '',
      role: officer.role || 'Department Officer',
      department: officer.department || departments[0],
      organization: officer.organization || 'Government of Maharashtra',
      phone: officer.phone || '',
      password: '',
      isActive: officer.isActive !== false
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (officer) => {
    setSelectedOfficer(officer);
    setFormError('');
    setIsDeleteModalOpen(true);
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setFormError('Officer Name and Official Email are required.');
      return;
    }

    if (!formData.email.includes('@')) {
      setFormError('Please provide a valid government email address.');
      return;
    }

    setActionLoading(true);
    setFormError('');

    try {
      const res = await axios.post('/api/users/officers', {
        ...formData,
        adminName: currentUser?.name || 'Government Admin'
      });

      showToast(`Officer ${formData.name} successfully registered.`);
      setIsCreateModalOpen(false);
      fetchOfficersAndDepts();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.error || err.message || 'Failed to create officer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateOfficer = async (e) => {
    e.preventDefault();
    if (!selectedOfficer) return;

    if (!formData.name || !formData.email) {
      setFormError('Officer Name and Email are required.');
      return;
    }

    setActionLoading(true);
    setFormError('');

    try {
      await axios.put(`/api/users/officers/${selectedOfficer._id}`, {
        ...formData,
        adminName: currentUser?.name || 'Government Admin'
      });

      showToast(`Officer ${formData.name} profile updated successfully.`);
      setIsEditModalOpen(false);
      setSelectedOfficer(null);
      fetchOfficersAndDepts();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.error || err.message || 'Failed to update officer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOfficer = async () => {
    if (!selectedOfficer) return;

    if (currentUser && currentUser.email === selectedOfficer.email) {
      setFormError('You cannot delete your own active administrator account.');
      return;
    }

    setActionLoading(true);
    setFormError('');

    try {
      await axios.delete(`/api/users/officers/${selectedOfficer._id}?adminName=${encodeURIComponent(currentUser?.name || 'Government Admin')}`);
      showToast(`Officer account ${selectedOfficer.name} permanently removed.`);
      setIsDeleteModalOpen(false);
      setSelectedOfficer(null);
      fetchOfficersAndDepts();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.error || err.message || 'Failed to delete officer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (officer) => {
    try {
      const nextStatus = !officer.isActive;
      await axios.patch(`/api/users/officers/${officer._id}/status`, {
        isActive: nextStatus,
        adminName: currentUser?.name || 'Government Admin'
      });
      
      showToast(`${officer.name} account is now ${nextStatus ? 'Active' : 'Suspended'}.`);
      fetchOfficersAndDepts();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update officer status.');
    }
  };

  const filteredOfficers = officers.filter(o => {
    const matchesSearch = 
      (o.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.department || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === 'All' || o.department === deptFilter;
    const matchesRole = roleFilter === 'All' || o.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Active' ? o.isActive !== false : o.isActive === false);

    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  const totalOfficers = officers.length;
  const activeOfficers = officers.filter(o => o.isActive !== false).length;
  const uniqueDepts = new Set(officers.map(o => o.department).filter(Boolean)).size;

  return (
    <div>
      {/* Toast Notification */}
      {successToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#065F46',
          color: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 9999,
          fontWeight: 600,
          fontSize: '0.875rem'
        }}>
          <CheckCircle2 size={18} color="#34D399" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-navy">Administrative Governance</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
              Government Officer Directory & Role Access Management
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
            Provision nodal departmental officers, manage access credentials, audit permissions, and configure administrative roles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={fetchOfficersAndDepts} 
            className="btn-secondary"
            style={{ padding: '0.6rem 1rem' }}
            title="Refresh Officer Directory"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={handleOpenCreateModal} 
            className="btn-emerald"
            style={{ padding: '0.6rem 1.25rem', boxShadow: '0 4px 12px rgba(5,150,105,0.25)' }}
          >
            <UserPlus size={16} />
            <span>Add Government Officer</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="gov-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #0A2540' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Total Officers</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0A2540', margin: '0.25rem 0 0 0' }}>{totalOfficers}</h3>
            </div>
            <div style={{ backgroundColor: '#EFF6FF', padding: '0.65rem', borderRadius: '8px' }}>
              <Users size={24} color="#1E3A8A" />
            </div>
          </div>
        </div>

        <div className="gov-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Active In Service</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0 0 0' }}>{activeOfficers}</h3>
            </div>
            <div style={{ backgroundColor: '#ECFDF5', padding: '0.65rem', borderRadius: '8px' }}>
              <CheckCircle2 size={24} color="#059669" />
            </div>
          </div>
        </div>

        <div className="gov-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #D97706' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Departments Represented</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#D97706', margin: '0.25rem 0 0 0' }}>{uniqueDepts}</h3>
            </div>
            <div style={{ backgroundColor: '#FFFBEB', padding: '0.65rem', borderRadius: '8px' }}>
              <Building2 size={24} color="#D97706" />
            </div>
          </div>
        </div>

        <div className="gov-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #7C3AED' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Governance Protocol</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#7C3AED', margin: '0.4rem 0 0 0' }}>Maha-RBAC v2.4</h3>
            </div>
            <div style={{ backgroundColor: '#F5F3FF', padding: '0.65rem', borderRadius: '8px' }}>
              <ShieldCheck size={24} color="#7C3AED" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="gov-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search officer name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '40px', fontSize: '0.875rem' }}
            />
          </div>

          {/* Department Filter */}
          <div style={{ minWidth: '200px' }}>
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="form-input"
              style={{ height: '40px', fontSize: '0.85rem' }}
            >
              <option value="All">All Departments</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div style={{ minWidth: '180px' }}>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-input"
              style={{ height: '40px', fontSize: '0.85rem' }}
            >
              <option value="All">All Roles</option>
              <option value="Department Officer">Department Officer</option>
              <option value="Procurement Officer">Procurement Officer</option>
              <option value="Government Admin">Government Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '140px' }}>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
              style={{ height: '40px', fontSize: '0.85rem' }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Officers Table */}
      <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A2540' }}>
            Designated Government Officers ({filteredOfficers.length})
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Encrypted Single-Sign-On & Audit Log Tracking Active
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748B', fontWeight: 600 }}>Loading Officer Registry...</p>
          </div>
        ) : filteredOfficers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Users size={40} color="#94A3B8" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ color: '#1E293B', fontWeight: 700, margin: 0 }}>No Officers Found</h4>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0.25rem 0 1rem 0' }}>
              No government officer records matched your search criteria.
            </p>
            <button onClick={handleOpenCreateModal} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <UserPlus size={14} /> Add First Officer
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1', color: '#334155', fontWeight: 700 }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Officer & Designation</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Department / Wing</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Contact & Email</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Role Permission</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficers.map((officer, index) => {
                  const isActive = officer.isActive !== false;
                  return (
                    <tr 
                      key={officer._id || index}
                      style={{ 
                        borderBottom: '1px solid #E2E8F0',
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFCFF',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      {/* Officer Name & Avatar */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: officer.role === 'Government Admin' ? '#0A2540' : '#1E3A8A',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            border: '2px solid #BFDBFE'
                          }}>
                            {officer.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>
                              {officer.name}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                              {officer.organization || 'Government of Maharashtra'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td style={{ padding: '1rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155', fontWeight: 600 }}>
                          <Building2 size={15} color="#D97706" />
                          <span>{officer.department || 'State Innovation Wing'}</span>
                        </div>
                      </td>

                      {/* Contact & Email */}
                      <td style={{ padding: '1rem 1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1E293B', fontSize: '0.8rem' }}>
                            <Mail size={13} color="#2563EB" />
                            <span>{officer.email}</span>
                          </div>
                          {officer.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.75rem' }}>
                              <Phone size={13} color="#64748B" />
                              <span>{officer.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role Permission */}
                      <td style={{ padding: '1rem 1rem' }}>
                        <span className={`badge ${
                          officer.role === 'Government Admin' || officer.role === 'Super Admin' 
                            ? 'badge-saffron' 
                            : officer.role === 'Procurement Officer' 
                            ? 'badge-emerald' 
                            : 'badge-navy'
                        }`}>
                          <Shield size={12} />
                          {officer.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem 1rem' }}>
                        <button
                          onClick={() => handleToggleStatus(officer)}
                          style={{
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: isActive ? '#ECFDF5' : '#FEF2F2',
                            color: isActive ? '#059669' : '#DC2626',
                            border: `1px solid ${isActive ? '#A7F3D0' : '#FECACA'}`
                          }}
                          title={`Click to ${isActive ? 'Suspend' : 'Activate'} Officer`}
                        >
                          {isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                          <span>{isActive ? 'Active' : 'Suspended'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenEditModal(officer)}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                            title="Edit Officer Profile & Role"
                          >
                            <Edit3 size={13} color="#2563EB" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleOpenDeleteModal(officer)}
                            className="btn-secondary"
                            style={{ 
                              padding: '0.35rem 0.65rem', 
                              fontSize: '0.775rem',
                              borderColor: '#FECACA',
                              backgroundColor: '#FFF5F5',
                              color: '#DC2626'
                            }}
                            title="Remove Officer"
                          >
                            <Trash2 size={13} color="#DC2626" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE OFFICER MODAL */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)} style={{ zIndex: 1100 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', width: '95%', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Modal Header */}
            <div style={{ backgroundColor: '#0A2540', color: '#FFFFFF', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #FF9933' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.4rem', borderRadius: '8px' }}>
                  <UserPlus size={20} color="#FF9933" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Add New Government Officer</h3>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Provision departmental nodal officer credentials & portal roles</span>
                </div>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateOfficer} style={{ padding: '1.5rem' }}>
              {formError && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Officer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh K. Patil"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Official Government Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="officer@maharashtra.gov.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Assigned Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="form-input"
                  >
                    {departments.map((dept, idx) => (
                      <option key={idx} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Administrative Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="form-input"
                  >
                    {availableRoles.map((r, idx) => (
                      <option key={idx} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98200 XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Initial Temporary Password
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <input
                  type="checkbox"
                  id="createIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="createIsActive" style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 600, cursor: 'pointer' }}>
                  Enable Instant Portal Access (Account Active)
                </label>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-secondary"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-emerald"
                  disabled={actionLoading}
                  style={{ padding: '0.65rem 1.5rem' }}
                >
                  <Check size={16} />
                  <span>{actionLoading ? 'Creating Officer...' : 'Create Officer Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT OFFICER MODAL */}
      {isEditModalOpen && selectedOfficer && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)} style={{ zIndex: 1100 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', width: '95%', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Modal Header */}
            <div style={{ backgroundColor: '#0A2540', color: '#FFFFFF', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #FF9933' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.4rem', borderRadius: '8px' }}>
                  <Edit3 size={20} color="#FF9933" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Edit Government Officer</h3>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Update administrative profile, department assignment & credentials</span>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateOfficer} style={{ padding: '1.5rem' }}>
              {formError && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Officer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Official Government Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Assigned Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="form-input"
                  >
                    {departments.map((dept, idx) => (
                      <option key={idx} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Administrative Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="form-input"
                  >
                    {availableRoles.map((r, idx) => (
                      <option key={idx} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Reset Password (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep unchanged"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="editIsActive" style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 600, cursor: 'pointer' }}>
                  Account Active (Uncheck to Suspend Portal Access)
                </label>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={actionLoading}
                  style={{ padding: '0.65rem 1.5rem' }}
                >
                  <Save size={16} />
                  <span>{actionLoading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE OFFICER MODAL */}
      {isDeleteModalOpen && selectedOfficer && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)} style={{ zIndex: 1100 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', width: '95%', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#DC2626', color: '#FFFFFF', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <AlertTriangle size={22} color="#FFFFFF" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Confirm Officer Account Removal</h3>
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {formError && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  {formError}
                </div>
              )}

              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, marginTop: 0 }}>
                Are you sure you want to permanently delete the officer account for <strong>{selectedOfficer.name}</strong> ({selectedOfficer.email})?
              </p>

              <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
                <div><strong>Department:</strong> {selectedOfficer.department}</div>
                <div><strong>Designation Role:</strong> {selectedOfficer.role}</div>
                <div><strong>Audit Consequence:</strong> Account deletion will be permanently logged in the Maharashtra Governance Transparency Trail.</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="btn-secondary"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteOfficer}
                  disabled={actionLoading}
                  className="btn-secondary"
                  style={{ backgroundColor: '#DC2626', color: '#FFFFFF', borderColor: '#B91C1C', padding: '0.65rem 1.25rem' }}
                >
                  <Trash2 size={16} />
                  <span>{actionLoading ? 'Deleting...' : 'Confirm Permanent Deletion'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovtOfficersManagementTab;
