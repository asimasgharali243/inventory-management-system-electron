
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import AccountManagement from './components/AccountManagement';
import InvoiceManagement from './components/InvoiceManagement';
import InvoiceList from './components/InvoiceList';
import Reports from './components/Reports';
import BackupRestore from './components/BackupRestore';
import UserManagement from './components/UserManagement';
import './styles.css';

// Create navigation context
export const NavigationContext = createContext();

function NavigationProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setHistory(prev => [...prev, location.pathname]);
    }, [location.pathname]);

    const goBack = () => {
        if (history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <NavigationContext.Provider value={{ goBack, history, currentPath: location.pathname }}>
            {children}
        </NavigationContext.Provider>
    );
}

// Protected Route component
function ProtectedRoute({ children, allowedRoles }) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function AppContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = localStorage.getItem('user');
                if (user) {
                    const userData = JSON.parse(user);
                    setCurrentUser(userData);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Setup global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl+Shift+B for backup
            if (e.ctrlKey && e.shiftKey && e.key === 'B') {
                e.preventDefault();
                if (window.electron && window.electron.database && window.electron.database.backup) {
                    window.electron.database.backup().then(result => {
                        if (result.success) {
                            toast.success('Database backup successful!');
                        } else {
                            toast.error('Backup failed: ' + result.error);
                        }
                    });
                }
            }

            // Ctrl+Shift+R for restore
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                if (window.electron && window.electron.database && window.electron.database.restore) {
                    window.electron.database.restore().then(result => {
                        if (result.success) {
                            toast.success('Database restore successful!');
                            setTimeout(() => window.location.reload(), 1000);
                        } else {
                            toast.error('Restore failed: ' + result.error);
                        }
                    });
                }
            }

            // Backspace for navigation (only if not in input field)
            if (e.key === 'Backspace') {
                const activeElement = document.activeElement;
                const isInput = activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.isContentEditable;

                if (!isInput) {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent('navigateBack'));
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success(`Welcome back, ${user.full_name || user.username}!`);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <NavigationProvider>
            <div className="app">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#4ade80',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                <Dashboard user={currentUser} onLogout={handleLogout}>
                    <Routes>
                        <Route path="/" element={<div className="dashboard-home"></div>} />
                        <Route path="/products" element={<ProductManagement />} />
                        <Route path="/accounts" element={<AccountManagement />} />
                        <Route path="/invoices/new" element={<InvoiceManagement />} />
                        <Route path="/invoices/edit" element={<InvoiceManagement />} />
                        <Route path="/invoices" element={<InvoiceList />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/backup" element={<BackupRestore />} />
                        <Route
                            path="/user-management"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <UserManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Dashboard>
            </div>
        </NavigationProvider>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;