// import React, { useState, useEffect, useRef } from 'react';
// import { toast } from 'react-hot-toast';
// import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiSearch } from 'react-icons/fi';
// import { NavigationContext } from '../App';
// import { useNavigate } from 'react-router-dom';
// import { useContext } from 'react';


// function AccountManagement() {
//     const navigate = useNavigate();
//     const { goBack } = useContext(NavigationContext);
//     const [accounts, setAccounts] = useState([]);
//     const [filteredAccounts, setFilteredAccounts] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isEditing, setIsEditing] = useState(false);
//     const [currentAccount, setCurrentAccount] = useState({
//         account_name: '',
//         account_name_urdu: '',
//         account_type: 'customer',
//         mobile_number: '',
//         address: '',
//         opening_balance: 0,
//         current_balance: 0,
//         is_active: 1,
//         date_of_joining: new Date().toISOString().split('T')[0]
//     });

//     const nameRef = useRef(null);

//     useEffect(() => {
//         loadAccounts();
//         setupKeyboardShortcuts();
//         return () => cleanupKeyboardShortcuts();
//     }, []);

//     useEffect(() => {
//         filterAccounts();
//     }, [searchTerm, accounts]);

//     const setupKeyboardShortcuts = () => {
//         const handleKeyDown = (e) => {
//             if (e.ctrlKey && e.key === 'n') {
//                 e.preventDefault();
//                 handleNew();
//             }
//             if (e.ctrlKey && e.key === 's') {
//                 e.preventDefault();
//                 handleSave();
//             }
//             if (e.key === 'Escape') {
//                 e.preventDefault();
//                 handleCancel();
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     };

//     const cleanupKeyboardShortcuts = () => {
//         window.removeEventListener('keydown', setupKeyboardShortcuts);
//     };

//     const loadAccounts = async () => {
//         try {
//             const data = await window.electron.database.getAccounts();
//             setAccounts(data || []);
//         } catch (error) {
//             toast.error('Failed to load accounts');
//         }
//     };

//     const filterAccounts = () => {
//         if (!searchTerm) {
//             setFilteredAccounts(accounts);
//         } else {
//             const filtered = accounts.filter(account =>
//                 account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 (account.mobile_number && account.mobile_number.includes(searchTerm))
//             );
//             setFilteredAccounts(filtered);
//         }
//     };

//     const handleNew = () => {
//         setIsEditing(true);
//         setCurrentAccount({
//             account_name: '',
//             account_name_urdu: '',
//             account_type: 'customer',
//             mobile_number: '',
//             address: '',
//             opening_balance: 0,
//             current_balance: 0,
//             is_active: 1,
//             date_of_joining: new Date().toISOString().split('T')[0]
//         });
//         setTimeout(() => nameRef.current?.focus(), 100);
//     };

//     const handleEdit = (account) => {
//         setIsEditing(true);
//         setCurrentAccount({ ...account });
//         setTimeout(() => nameRef.current?.focus(), 100);
//     };

//     const handleSave = async () => {
//         if (!currentAccount.account_name) {
//             toast.error('Account Name is required');
//             return;
//         }

//         try {
//             if (currentAccount.account_id) {
//                 await window.electron.database.updateAccount(currentAccount);
//                 toast.success('Account updated successfully');
//             } else {
//                 await window.electron.database.createAccount(currentAccount);
//                 toast.success('Account created successfully');
//             }
//             await loadAccounts();
//             handleCancel();
//         } catch (error) {
//             toast.error('Failed to save account');
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to delete this account?')) {
//             try {
//                 await window.electron.database.deleteAccount(id);
//                 toast.success('Account deleted successfully');
//                 await loadAccounts();
//                 if (currentAccount.account_id === id) {
//                     handleCancel();
//                 }
//             } catch (error) {
//                 toast.error('Failed to delete account');
//             }
//         }
//     };

//     const handleCancel = () => {
//         setIsEditing(false);
//         setCurrentAccount({
//             account_name: '',
//             account_name_urdu: '',
//             account_type: 'customer',
//             mobile_number: '',
//             address: '',
//             opening_balance: 0,
//             current_balance: 0,
//             is_active: 1,
//             date_of_joining: new Date().toISOString().split('T')[0]
//         });
//     };

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setCurrentAccount(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? (checked ? 1 : 0) :
//                 (name === 'opening_balance' || name === 'current_balance') ?
//                     parseFloat(value) || 0 : value
//         }));
//     };

//     return (
//         <div className="container">
//             <div className="header">
//                 <h1>Account Management</h1>
//                 <div className="header-actions">
//                     <div className="search-box">
//                         <FiSearch />
//                         <input
//                             type="text"
//                             placeholder="Search accounts..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                     <button className="btn-primary" onClick={handleNew}>
//                         <FiPlus /> New Account (Ctrl+N)
//                     </button>
//                 </div>
//             </div>

//             {isEditing && (
//                 <div className="form-panel">
//                     <h2>{currentAccount.account_id ? 'Edit Account' : 'New Account'}</h2>
//                     <div className="form-grid">
//                         <div className="form-group">
//                             <label>Account Name *</label>
//                             <input
//                                 ref={nameRef}
//                                 type="text"
//                                 name="account_name"
//                                 value={currentAccount.account_name}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter account name"
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label>Account Name (Urdu)</label>
//                             <input
//                                 type="text"
//                                 name="account_name_urdu"
//                                 value={currentAccount.account_name_urdu}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter account name in Urdu"
//                                 dir="rtl"
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label>Account Type</label>
//                             <select name="account_type" value={currentAccount.account_type} onChange={handleInputChange}>
//                                 <option value="customer">Customer</option>
//                                 <option value="supplier">Supplier</option>
//                                 <option value="other">Other</option>
//                             </select>
//                         </div>
//                         <div className="form-group">
//                             <label>Mobile Number</label>
//                             <input
//                                 type="text"
//                                 name="mobile_number"
//                                 value={currentAccount.mobile_number}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter mobile number"
//                             />
//                         </div>
//                         <div className="form-group full-width">
//                             <label>Address</label>
//                             <textarea
//                                 name="address"
//                                 value={currentAccount.address}
//                                 onChange={handleInputChange}
//                                 rows="2"
//                                 placeholder="Enter address"
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label>Opening Balance</label>
//                             <input
//                                 type="number"
//                                 name="opening_balance"
//                                 value={currentAccount.opening_balance}
//                                 onChange={handleInputChange}
//                                 placeholder="Opening balance"
//                                 step="0.01"
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label>Date of Joining</label>
//                             <input
//                                 type="date"
//                                 name="date_of_joining"
//                                 value={currentAccount.date_of_joining}
//                                 onChange={handleInputChange}
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label>
//                                 <input
//                                     type="checkbox"
//                                     name="is_active"
//                                     checked={currentAccount.is_active === 1}
//                                     onChange={handleInputChange}
//                                 />
//                                 Active Account
//                             </label>
//                         </div>
//                     </div>
//                     <div className="form-actions">
//                         <button className="btn-success" onClick={handleSave}>
//                             <FiSave /> Save (Ctrl+S)
//                         </button>
//                         <button className="btn-danger" onClick={handleCancel}>
//                             <FiX /> Cancel (Esc)
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <div className="table-container">
//                 <table className="data-table">
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Account Name</th>
//                             <th>Account Name (Urdu)</th>
//                             <th>Mobile</th>
//                             <th>Balance</th>
//                             <th>Status</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredAccounts.map((account) => (
//                             <tr key={account.account_id}>
//                                 <td>{account.account_id}</td>
//                                 <td>{account.account_name}</td>
//                                 <td dir="rtl">{account.account_name_urdu}</td>
//                                 <td>{account.mobile_number}</td>
//                                 <td>₨ {account.current_balance?.toLocaleString() || 0}</td>
//                                 <td>{account.is_active ? 'Active' : 'Inactive'}</td>
//                                 <td className="actions">
//                                     <button className="icon-btn" onClick={() => handleEdit(account)}>
//                                         <FiEdit2 />
//                                     </button>
//                                     <button className="icon-btn danger" onClick={() => handleDelete(account.account_id)}>
//                                         <FiTrash2 />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="status-bar">
//                 <span>Total Accounts: {accounts.length}</span>
//                 <span className="shortcuts-hint">
//                     Shortcuts: Ctrl+N New | Ctrl+S Save | Esc Cancel
//                 </span>
//             </div>
//         </div>
//     );
// }

// export default AccountManagement;

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiSearch } from 'react-icons/fi';
import { NavigationContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

function AccountManagement() {
    const navigate = useNavigate();
    const { goBack } = useContext(NavigationContext);
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentAccount, setCurrentAccount] = useState({
        account_id: null,
        customer_name: '',
        customer_name_urdu: '',
        mobile_number: '',
        address: '',
        created_by: '',
        created_at: '',
        modified_by: '',
        modified_at: ''
    });

    const nameRef = useRef(null);

    useEffect(() => {
        loadAccounts();
        setupKeyboardShortcuts();
        return () => cleanupKeyboardShortcuts();
    }, []);

    useEffect(() => {
        filterAccounts();
    }, [searchTerm, accounts]);

    const setupKeyboardShortcuts = () => {
        const handleKeyDown = (e) => {
            // Ctrl+N for new account
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                handleNew();
            }
            // Ctrl+S for save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            // Ctrl+D for delete
            if (e.ctrlKey && e.key === 'd' && currentAccount.account_id) {
                e.preventDefault();
                handleDelete(currentAccount.account_id);
            }
            // Escape to cancel edit
            if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    };

    const cleanupKeyboardShortcuts = () => {
        window.removeEventListener('keydown', setupKeyboardShortcuts);
    };

    const loadAccounts = async () => {
        try {
            const data = await window.electron.database.getAccounts();
            console.log('Loaded accounts:', data);
            setAccounts(data || []);
        } catch (error) {
            console.error('Failed to load accounts:', error);
            toast.error('Failed to load accounts');
        }
    };

    const filterAccounts = () => {
        if (!searchTerm.trim()) {
            setFilteredAccounts(accounts);
        } else {
            const filtered = accounts.filter(account =>
                account.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (account.customer_name_urdu && account.customer_name_urdu.includes(searchTerm)) ||
                (account.mobile_number && account.mobile_number.includes(searchTerm))
            );
            setFilteredAccounts(filtered);
        }
    };

    const handleNew = () => {
        setIsEditing(true);
        setCurrentAccount({
            account_id: null,
            customer_name: '',
            customer_name_urdu: '',
            mobile_number: '',
            address: ''
        });
        setTimeout(() => nameRef.current?.focus(), 100);
    };

    const handleEdit = (account) => {
        setIsEditing(true);
        setCurrentAccount({ ...account });
        setTimeout(() => nameRef.current?.focus(), 100);
    };

    const handleSave = async () => {
        if (!currentAccount.customer_name) {
            toast.error('Account Name is required');
            return;
        }

        try {
            if (currentAccount.account_id) {
                // Update existing account
                await window.electron.database.updateAccount(currentAccount);
                toast.success('Account updated successfully');
            } else {
                // Create new account
                await window.electron.database.createAccount(currentAccount);
                toast.success('Account created successfully');
            }
            await loadAccounts();
            handleCancel();
        } catch (error) {
            console.error('Failed to save account:', error);
            toast.error(error.message || 'Failed to save account');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
            try {
                await window.electron.database.deleteAccount(id);
                toast.success('Account deleted successfully');
                await loadAccounts();
                if (currentAccount.account_id === id) {
                    handleCancel();
                }
            } catch (error) {
                console.error('Failed to delete account:', error);
                toast.error('Failed to delete account. Make sure it has no linked invoices.');
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentAccount({
            account_id: null,
            customer_name: '',
            customer_name_urdu: '',
            mobile_number: '',
            address: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentAccount(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Account Management</h1>
                <div className="header-actions">
                    <div className="search-box">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search by name, Urdu name, or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary" onClick={handleNew}>
                        <FiPlus /> New Account (Ctrl+N)
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="form-panel">
                    <h2>{currentAccount.account_id ? 'Edit Account' : 'New Account'}</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Account Name *</label>
                            <input
                                ref={nameRef}
                                type="text"
                                name="customer_name"
                                value={currentAccount.customer_name}
                                onChange={handleInputChange}
                                placeholder="Enter account name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Account Name (Urdu)</label>
                            <input
                                type="text"
                                name="customer_name_urdu"
                                value={currentAccount.customer_name_urdu || ''}
                                onChange={handleInputChange}
                                placeholder="Enter account name in Urdu"
                                dir="rtl"
                            />
                        </div>
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input
                                type="tel"
                                name="mobile_number"
                                value={currentAccount.mobile_number || ''}
                                onChange={handleInputChange}
                                placeholder="Enter mobile number"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Address</label>
                            <textarea
                                name="address"
                                value={currentAccount.address || ''}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Enter address"
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="btn-success" onClick={handleSave}>
                            <FiSave /> Save (Ctrl+S)
                        </button>
                        <button className="btn-danger" onClick={handleCancel}>
                            <FiX /> Cancel (Esc)
                        </button>
                    </div>
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr style={{ background: '#4CAF50', color: 'white' }}>
                            <th style={{ background: '#4CAF50', color: 'white' }}>ID</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Account Name</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Account Name (Urdu)</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Mobile Number</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Address</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Created Date</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAccounts.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                    No accounts found. Click "New Account" to create one.
                                </td>
                            </tr>
                        ) : (
                            filteredAccounts.map((account) => (
                                <tr key={account.account_id}>
                                    <td>{account.account_id}</td>
                                    <td>{account.customer_name}</td>
                                    <td dir="rtl" style={{ fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif" }}>{account.customer_name_urdu || '-'}</td>
                                    <td>{account.mobile_number || '-'}</td>
                                    <td>{account.address || '-'}</td>
                                    <td>{account.created_at ? new Date(account.created_at).toLocaleDateString() : '-'}</td>
                                    <td className="actions">
                                        <button
                                            className="icon-btn"
                                            onClick={() => handleEdit(account)}
                                            title="Edit Account"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            className="icon-btn danger"
                                            onClick={() => handleDelete(account.account_id)}
                                            title="Delete Account"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="status-bar">
                <span>Total Accounts: {accounts.length}</span>
                <span className="shortcuts-hint">
                    Shortcuts: Ctrl+N New | Ctrl+S Save | Ctrl+D Delete | Esc Cancel
                </span>
            </div>
        </div>
    );
}

export default AccountManagement;