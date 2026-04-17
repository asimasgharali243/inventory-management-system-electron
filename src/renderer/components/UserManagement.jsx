import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { FiUser, FiPlus, FiTrash2, FiSave, FiX, FiKey, FiRefreshCw, FiUserPlus } from 'react-icons/fi';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        role: 'user'
    });
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [currentUser, setCurrentUser] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const fullNameRef = useRef(null);
    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    useEffect(() => {
        loadUsers();
        loadCurrentUser();
    }, []);

    const loadCurrentUser = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentUser(user);
            }
        } catch (error) {
            console.error('Error loading current user:', error);
        }
    };

    const loadUsers = async () => {
        setLoading(true);
        try {
            if (window.electron && window.electron.database) {
                const usersList = await window.electron.database.getUsers();
                setUsers(usersList || []);
            }
        } catch (error) {
            console.error('Failed to load users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async () => {
        if (!formData.username || !formData.password) {
            toast.error('Username and password are required');
            if (!formData.username && usernameRef.current) {
                usernameRef.current.focus();
            } else if (!formData.password && passwordRef.current) {
                passwordRef.current.focus();
            }
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            if (passwordRef.current) passwordRef.current.focus();
            return;
        }

        try {
            const result = await window.electron.database.createUser({
                username: formData.username,
                password: formData.password,
                full_name: formData.full_name,
                role: formData.role
            });

            if (result.success) {
                toast.success('User created successfully');
                setShowAddModal(false);
                resetForm();
                loadUsers();
            } else {
                toast.error(result.error || 'Failed to create user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Failed to create user');
        }
    };

    const handleUpdatePassword = async () => {
        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('Please enter new password and confirmation');
            if (!passwordData.newPassword && newPasswordRef.current) {
                newPasswordRef.current.focus();
            } else if (!passwordData.confirmPassword && confirmPasswordRef.current) {
                confirmPasswordRef.current.focus();
            }
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            if (newPasswordRef.current) newPasswordRef.current.focus();
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            setPasswordData(prev => ({ ...prev, confirmPassword: '' }));
            if (confirmPasswordRef.current) confirmPasswordRef.current.focus();
            return;
        }

        setIsUpdating(true);

        try {
            const result = await window.electron.database.updateUserPassword(
                selectedUser.user_id,
                passwordData.newPassword
            );

            if (result.success) {
                toast.success(`Password updated successfully for ${selectedUser.username}`);
                setShowPasswordModal(false);
                setPasswordData({ newPassword: '', confirmPassword: '' });
                setSelectedUser(null);
                // Reload users to refresh the list
                await loadUsers();
            } else {
                toast.error(result.error || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Failed to update password: ' + (error.message || 'Unknown error'));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteUser = async (user) => {
        if (user.role === 'admin') {
            toast.error('Cannot delete admin user');
            return;
        }

        if (currentUser && currentUser.id === user.user_id) {
            toast.error('Cannot delete your own account');
            return;
        }

        if (window.confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
            try {
                const result = await window.electron.database.deleteUser(user.user_id);
                if (result.success && result.changes > 0) {
                    toast.success(`User "${user.username}" deleted successfully`);
                    await loadUsers();
                } else {
                    toast.error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            password: '',
            full_name: '',
            role: 'user'
        });
    };

    const openPasswordModal = (user) => {
        setSelectedUser(user);
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setShowPasswordModal(true);
        // Focus on the new password input after modal opens
        setTimeout(() => {
            if (newPasswordRef.current) {
                newPasswordRef.current.focus();
            }
        }, 100);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setSelectedUser(null);
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setIsUpdating(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getRoleBadgeStyle = (role) => {
        switch (role) {
            case 'admin':
                return { background: '#ef4444', color: 'white' };
            case 'manager':
                return { background: '#f59e0b', color: 'white' };
            default:
                return { background: '#10b981', color: 'white' };
        }
    };

    const styles = {
        container: { padding: '20px', maxWidth: '1400px', margin: '0 auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
        title: { margin: 0, fontSize: '24px', fontWeight: '600', color: '#333', display: 'flex', alignItems: 'center', gap: '12px' },
        addButton: { padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500' },
        refreshButton: { padding: '10px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
        table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
        th: { padding: '16px', textAlign: 'left', background: '#f8f9fa', borderBottom: '2px solid #e0e0e0', fontWeight: '600', color: '#555' },
        td: { padding: '14px 16px', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' },
        actionButtons: { display: 'flex', gap: '8px' },
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
        modal: { background: 'white', borderRadius: '16px', padding: '28px', width: '90%', maxWidth: '500px', animation: 'slideIn 0.3s ease-out' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f0f0f0' },
        modalTitle: { fontSize: '20px', fontWeight: '600', color: '#333', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' },
        closeBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999', padding: '0 8px' },
        formGroup: { marginBottom: '20px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '14px' },
        input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
        select: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', background: 'white', cursor: 'pointer' },
        modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' },
        saveBtn: { padding: '10px 24px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' },
        cancelBtn: { padding: '10px 24px', background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' },
        loadingSpinner: { textAlign: 'center', padding: '40px', color: '#999' },
        statsBar: { marginTop: '20px', padding: '12px 16px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', flexWrap: 'wrap', gap: '10px' },
        disabledButton: { opacity: 0.6, cursor: 'not-allowed' }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingSpinner}>
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateY(-30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .spinner {
                        border: 3px solid #f3f3f3;
                        border-top: 3px solid #667eea;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 16px;
                    }
                    button:hover {
                        opacity: 0.9;
                    }
                `}
            </style>

            <div style={styles.header}>
                <div style={styles.title}>
                    <FiUser size={28} color="#667eea" />
                    <span>User Management</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={styles.refreshButton} onClick={loadUsers}>
                        <FiRefreshCw size={16} /> Refresh
                    </button>
                    <button style={styles.addButton} onClick={() => setShowAddModal(true)}>
                        <FiUserPlus size={16} /> Add New User
                    </button>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>#</th>
                            <th style={styles.th}>Username</th>
                            <th style={styles.th}>Full Name</th>
                            <th style={styles.th}>Role</th>
                            <th style={styles.th}>Created At</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                                    <FiUser size={48} color="#ccc" />
                                    <p>No users found</p>
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user.user_id}>
                                    <td style={styles.td}>{index + 1}</td>
                                    <td style={styles.td}>
                                        <strong>{user.username}</strong>
                                        {currentUser && currentUser.id === user.user_id && (
                                            <span style={{ marginLeft: '8px', fontSize: '11px', color: '#4CAF50' }}>(You)</span>
                                        )}
                                    </td>
                                    <td style={styles.td}>{user.full_name || '-'}</td>
                                    <td style={styles.td}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            ...getRoleBadgeStyle(user.role)
                                        }}>
                                            {user.role === 'admin' ? 'Administrator' : user.role === 'manager' ? 'Manager' : 'User'}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{formatDate(user.created_at)}</td>
                                    <td style={styles.td}>
                                        <div style={styles.actionButtons}>
                                            <button
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#2196F3', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                onClick={() => openPasswordModal(user)}
                                                title="Change Password"
                                            >
                                                <FiKey size={16} /> Change Password
                                            </button>
                                            {user.role !== 'admin' && currentUser && currentUser.id !== user.user_id && (
                                                <button
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#f44336', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                    onClick={() => handleDeleteUser(user)}
                                                    title="Delete User"
                                                >
                                                    <FiTrash2 size={16} /> Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div style={styles.statsBar}>
                <span>Total Users: <strong>{users.length}</strong></span>
                <span>Admins: <strong>{users.filter(u => u.role === 'admin').length}</strong></span>
                <span>Managers: <strong>{users.filter(u => u.role === 'manager').length}</strong></span>
                <span>Regular Users: <strong>{users.filter(u => u.role === 'user').length}</strong></span>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div style={styles.modalOverlay} onClick={() => { setShowAddModal(false); resetForm(); }}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                <FiUserPlus size={20} />
                                Add New User
                            </h3>
                            <button style={styles.closeBtn} onClick={() => { setShowAddModal(false); resetForm(); }}>✕</button>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Username *</label>
                            <input
                                ref={usernameRef}
                                type="text"
                                style={styles.input}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Enter username"
                                onKeyDown={(e) => { if (e.key === 'Enter') passwordRef.current?.focus(); }}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Password *</label>
                            <input
                                ref={passwordRef}
                                type="password"
                                style={styles.input}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter password (min 6 characters)"
                                onKeyDown={(e) => { if (e.key === 'Enter') fullNameRef.current?.focus(); }}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input
                                ref={fullNameRef}
                                type="text"
                                style={styles.input}
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="Enter full name"
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddUser(); }}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Role</label>
                            <select
                                style={styles.select}
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="user">User</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div style={styles.modalButtons}>
                            <button style={styles.cancelBtn} onClick={() => { setShowAddModal(false); resetForm(); }}>
                                <FiX size={16} /> Cancel
                            </button>
                            <button style={styles.saveBtn} onClick={handleAddUser}>
                                <FiSave size={16} /> Create User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal - Fixed Version */}
            {showPasswordModal && selectedUser && (
                <div style={styles.modalOverlay} onClick={closePasswordModal}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                <FiKey size={20} />
                                Change Password for <span style={{ color: '#667eea' }}>{selectedUser.username}</span>
                            </h3>
                            <button style={styles.closeBtn} onClick={closePasswordModal}>✕</button>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>New Password *</label>
                            <input
                                ref={newPasswordRef}
                                type="password"
                                style={styles.input}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                placeholder="Enter new password (min 6 characters)"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isUpdating) {
                                        confirmPasswordRef.current?.focus();
                                    }
                                }}
                            />
                            {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                                <small style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                                    Password must be at least 6 characters
                                </small>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Confirm Password *</label>
                            <input
                                ref={confirmPasswordRef}
                                type="password"
                                style={styles.input}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                placeholder="Confirm new password"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isUpdating) {
                                        handleUpdatePassword();
                                    }
                                }}
                            />
                            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                <small style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                                    Passwords do not match
                                </small>
                            )}
                        </div>

                        <div style={styles.modalButtons}>
                            <button
                                style={styles.cancelBtn}
                                onClick={closePasswordModal}
                                disabled={isUpdating}
                            >
                                <FiX size={16} /> Cancel
                            </button>
                            <button
                                style={{ ...styles.saveBtn, ...(isUpdating ? styles.disabledButton : {}) }}
                                onClick={handleUpdatePassword}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FiSave size={16} /> Update Password
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;