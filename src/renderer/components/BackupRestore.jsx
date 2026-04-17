import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiDownload, FiUpload, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { NavigationContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

function BackupRestore() {
    const navigate = useNavigate();
    const { goBack } = useContext(NavigationContext);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const handleBackup = async () => {
        setIsBackingUp(true);
        const loadingToast = toast.loading('Creating backup...');

        try {
            if (!window.electron || !window.electron.database) {
                throw new Error('Database service not available');
            }

            const result = await window.electron.database.backup();
            toast.dismiss(loadingToast);

            if (result.success) {
                toast.success(`✅ Backup created successfully!\n📁 Location: ${result.path}`, {
                    duration: 5000,
                    position: 'top-center'
                });
            } else if (result.cancelled) {
                toast.info('Backup cancelled', { duration: 2000 });
            } else {
                toast.error(`❌ Backup failed: ${result.error}`);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(`Backup failed: ${error.message}`);
            console.error('Backup error:', error);
        } finally {
            setIsBackingUp(false);
        }
    };

    const handleRestore = async () => {
        // Show warning dialog with more details
        const userConfirmed = window.confirm(
            '⚠️ WARNING: Restoring Database ⚠️\n\n' +
            'This action will:\n' +
            '• Replace your current database completely\n' +
            '• Overwrite all existing data\n' +
            '• Cannot be undone\n\n' +
            'Make sure you have a current backup before proceeding.\n\n' +
            'Click OK to continue or Cancel to abort.'
        );

        if (!userConfirmed) return;

        // Second confirmation for safety
        const finalConfirmation = window.confirm(
            'Are you ABSOLUTELY sure you want to restore?\n\n' +
            'This will replace ALL current data with the backup data.'
        );

        if (!finalConfirmation) return;

        setIsRestoring(true);
        const loadingToast = toast.loading('Restoring database... Please wait');

        try {
            if (!window.electron || !window.electron.database) {
                throw new Error('Database service not available');
            }

            const result = await window.electron.database.restore();
            toast.dismiss(loadingToast);

            if (result.success) {
                toast.success(
                    '✅ Database restored successfully!\n\nThe application will now reload.',
                    { duration: 3000, position: 'top-center' }
                );

                // Give time for toast to show before reload
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (result.cancelled) {
                toast.info('Restore cancelled', { duration: 2000 });
            } else {
                toast.error(`❌ Restore failed: ${result.error}\n\nPlease check the backup file and try again.`, {
                    duration: 7000,
                    position: 'top-center'
                });
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(`Restore failed: ${error.message}\n\nPlease ensure the backup file is valid.`);
            console.error('Restore error:', error);
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <button className="back-btn" onClick={goBack}>
                    ← Back
                </button>
                <h1>Backup & Restore</h1>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <FiDownload size={48} color="#4CAF50" />
                    <h3>Backup Database</h3>
                    <p>Create a backup of your current database</p>
                    <button
                        className="btn-primary"
                        onClick={handleBackup}
                        disabled={isBackingUp}
                        style={{ marginTop: '15px' }}
                    >
                        {isBackingUp ? '⏳ Backing up...' : '💾 Backup Now (Ctrl+B)'}
                    </button>
                </div>

                <div className="stat-card">
                    <FiUpload size={48} color="#ff9800" />
                    <h3>Restore Database</h3>
                    <p>Restore from a previous backup</p>
                    <button
                        className="btn-warning"
                        onClick={handleRestore}
                        disabled={isRestoring}
                        style={{ marginTop: '15px' }}
                    >
                        {isRestoring ? '⏳ Restoring...' : '🔄 Restore (Ctrl+R)'}
                    </button>
                </div>
            </div>

            <div className="form-panel">
                <h3><FiInfo /> Information</h3>
                <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                    <li>✅ Backup files are saved as .db files with timestamp</li>
                    <li>⚠️ Regular backups are recommended to prevent data loss</li>
                    <li>⚠️ Restoring will replace current data - ensure you have a backup</li>
                    <li>⌨️ Keyboard shortcuts: Ctrl+B for Backup, Ctrl+R for Restore</li>
                    <li>💾 Backup files can be stored externally for safekeeping</li>
                    <li>🔒 A safety backup is automatically created before restore</li>
                </ul>
            </div>

            <div className="alert-panel" style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '20px'
            }}>
                <h4 style={{ color: '#856404', marginTop: 0 }}>
                    <FiAlertTriangle /> Important Notes
                </h4>
                <ul style={{ color: '#856404', marginBottom: 0 }}>
                    <li>Always verify your backup file exists before restoring</li>
                    <li>Keep multiple backup copies in different locations</li>
                    <li>Test restore on a different system if possible</li>
                    <li>Contact support if you encounter persistent issues</li>
                </ul>
            </div>

            <div className="status-bar">
                <span>📁 Database Location: App Data/inventory.db</span>
                <span className="shortcuts-hint">
                    ⌨️ Shortcuts: Ctrl+B Backup | Ctrl+R Restore
                </span>
            </div>
        </div>
    );
}

export default BackupRestore;