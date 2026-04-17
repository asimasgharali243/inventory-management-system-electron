
// ============ MAIN PROCESS SETUP ============
const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('node:path');
const fs = require('fs');
const Database = require('better-sqlite3');

// Handle creating/removing shortcuts on Windows
if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow;
let db;

// Database setup
// const dbPath = path.join(app.getPath('userData'), 'inventory.db');
// console.log('Database path:', dbPath);

const dbPath = path.join(path.dirname(app.getPath('exe')), 'inventory.db');
console.log('Database path:', dbPath);

function initDatabase() {
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');

    // Create tables
    db.exec(`CREATE TABLE IF NOT EXISTS tbl_user (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.exec(`CREATE TABLE IF NOT EXISTS tbl_product (
        item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_code TEXT UNIQUE NOT NULL,
        item_name TEXT NOT NULL,
        item_name_urdu TEXT,
        price DECIMAL(10,2) DEFAULT 0,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        modified_by TEXT,
        modified_at DATETIME
    )`);

    db.exec(`CREATE TABLE IF NOT EXISTS tbl_account (
        account_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT,
        customer_name_urdu TEXT,
        mobile_number TEXT,
        address TEXT,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        modified_by TEXT,
        modified_at DATETIME
    )`);

    db.exec(`CREATE TABLE IF NOT EXISTS tbl_invoice_master (
        invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
        voucher_id TEXT UNIQUE NOT NULL,
        order_no TEXT,
        invoice_date DATE NOT NULL,
        notes TEXT,
        total_weight DECIMAL(10,2) DEFAULT 0,
        total_amount DECIMAL(10,2) DEFAULT 0,
        discount DECIMAL(10,2) DEFAULT 0,
        net_amount DECIMAL(10,2) DEFAULT 0,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        modified_by TEXT,
        modified_at DATETIME
    )`);

    // Updated invoice details table with customer_id and customer_name per item
    db.exec(`CREATE TABLE IF NOT EXISTS tbl_invoice_details (
        detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER,
        item_id INTEGER,
        item_name TEXT,
        item_name_urdu TEXT,
        customer_id INTEGER,
        customer_name TEXT,
        customer_name_urdu TEXT,
        quantity DECIMAL(10,2),
        unit TEXT,
        rate DECIMAL(10,2),
        amount DECIMAL(10,2),
        FOREIGN KEY (invoice_id) REFERENCES tbl_invoice_master(invoice_id),
        FOREIGN KEY (item_id) REFERENCES tbl_product(item_id),
        FOREIGN KEY (customer_id) REFERENCES tbl_account(account_id)
    )`);

    // Insert default admin user if not exists
    const adminCheck = db.prepare("SELECT * FROM tbl_user WHERE username = ?").get('admin');
    if (!adminCheck) {
        db.prepare("INSERT INTO tbl_user (username, password, full_name, role) VALUES (?, ?, ?, ?)")
            .run('admin', 'admin123', 'Administrator', 'admin');
        console.log('Admin user created');
    }

    // Insert sample products if empty
    const productCount = db.prepare("SELECT COUNT(*) as count FROM tbl_product").get();
    if (productCount.count === 0) {
        const sampleProducts = [
            ['P001', 'Apple Gaja', 'سیب گچا', 400.00, 'admin'],
            ['P002', 'Saib Golden', 'سیب کالا گوڼل', 350.00, 'admin'],
            ['P003', 'Saib Kala Kolo', 'سیب کالا کولو', 380.00, 'admin'],
            ['P004', 'Saib Mshadi', 'سیب مشدی', 330.00, 'admin'],
            ['P005', 'Saib Boli Wala', 'سیب بولی والا', 320.00, 'admin'],
            ['P006', 'Saib Gola', 'سیب گولا', 360.00, 'admin']
        ];

        const insertProduct = db.prepare(`INSERT INTO tbl_product (item_code, item_name, item_name_urdu, price, created_by) 
                        VALUES (?, ?, ?, ?, ?)`);

        const insertMany = db.transaction((products) => {
            for (const product of products) {
                insertProduct.run(product);
            }
        });

        insertMany(sampleProducts);
        console.log('Sample products inserted');
    }

    // Insert sample accounts if empty
    const accountCount = db.prepare("SELECT COUNT(*) as count FROM tbl_account").get();
    if (accountCount.count === 0) {
        const sampleAccounts = [
            ['Ahmed Traders', 'احمد ٹریڈرز', '03001234567', 'Lahore', 'admin'],
            ['Khan Enterprises', 'خان انٹرپرائزز', '03007654321', 'Karachi', 'admin'],
            ['Raza Store', 'رضا اسٹور', '03005555555', 'Islamabad', 'admin']
        ];

        const insertAccount = db.prepare(`INSERT INTO tbl_account (customer_name, customer_name_urdu, mobile_number, address, created_by) 
                        VALUES (?, ?, ?, ?, ?)`);

        const insertMany = db.transaction((accounts) => {
            for (const account of accounts) {
                insertAccount.run(account);
            }
        });

        insertMany(sampleAccounts);
        console.log('Sample accounts inserted');
    }
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        show: false
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.maximize();
    });

    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }

    // Menu template
    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                { type: 'separator' },
                { label: 'Exit', accelerator: 'Alt+F4', role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'Ctrl+Z', role: 'undo' },
                { label: 'Redo', accelerator: 'Ctrl+Y', role: 'redo' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'Ctrl+X', role: 'cut' },
                { label: 'Copy', accelerator: 'Ctrl+C', role: 'copy' },
                { label: 'Paste', accelerator: 'Ctrl+V', role: 'paste' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { label: 'Reload', accelerator: 'Ctrl+R', role: 'reload' },
                { label: 'Toggle DevTools', accelerator: 'F12', role: 'toggleDevTools' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Shortcuts',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Keyboard Shortcuts',
                            message: 'Keyboard Shortcuts',
                            detail: 'Ctrl+S - Save\nCtrl+N - New\nCtrl+U - Save and New\nCtrl+D - Delete\nCtrl+F - Search\nF1 - Help\nCtrl+B - Backup\nCtrl+R - Restore\nEnter - Submit/Save\nEscape - Cancel'
                        });
                    }
                },
                {
                    label: 'About',
                    click: () => {
                        createAboutWindow();
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
};

function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        width: 1000,
        height: 500,
        parent: mainWindow,
        modal: true,
        show: false,
        resizable: false,
        minimizable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: false
        },
        backgroundColor: '#f5f5f5'
    });

    const aboutHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>About - Inventory Management System</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .about-container {
                    background: white;
                    border-radius: 20px;
                    margin-top:400px;

                    padding: 40px;
                    
                    max-width: 500px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center;
                    animation: slideIn 0.5s ease-out;
                    position: relative;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .logo {
                    font-size: 64px;
                    margin-bottom: 20px;
                }

                .app-title {
                    font-size: 28px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                }

                .version {
                    color: #667eea;
                    font-size: 14px;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #f0f0f0;
                }

                .company-name {
                    font-size: 24px;
                    font-weight: bold;
                    color: #764ba2;
                    margin-bottom: 10px;
                }

                .tagline {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 20px;
                }

                .info-section {
                    text-align: left;
                    margin: 20px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }

                .info-item {
                    margin: 12px 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .info-icon {
                    font-size: 20px;
                    min-width: 30px;
                }

                .info-label {
                    font-weight: bold;
                    color: #555;
                    min-width: 80px;
                }

                .info-value {
                    color: #333;
                    word-break: break-all;
                }

                .info-value a {
                    color: #667eea;
                    text-decoration: none;
                    transition: color 0.3s;
                }

                .info-value a:hover {
                    color: #764ba2;
                    text-decoration: underline;
                }

                .social-links {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin: 20px 0;
                    flex-wrap: wrap;
                }

                .social-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: #f0f0f0;
                    border-radius: 25px;
                    color: #333;
                    text-decoration: none;
                    font-size: 14px;
                    transition: all 0.3s;
                    cursor: pointer;
                }

                .social-link:hover {
                    background: #667eea;
                    color: white;
                    transform: translateY(-2px);
                }

                .copyright {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #e0e0e0;
                    font-size: 12px;
                    color: #999;
                }

                .close-button {
                    margin-top: 20px;
                    padding: 10px 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: transform 0.2s;
                }

                .close-button:hover {
                    transform: scale(1.05);
                }

                .developer {
                    margin-top: 15px;
                    font-size: 12px;
                    color: #888;
                }

                .reset-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 12px;
                    color: #ccc;
                    margin-top: 10px;
                    transition: color 0.3s;
                    opacity: 0.5;
                }

                .reset-btn:hover {
                    color: #ff6b6b;
                    opacity: 1;
                }

                .modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                }

                .modal-content h3 {
                    margin-bottom: 15px;
                    color: #333;
                }

                .modal-content p {
                    margin-bottom: 20px;
                    color: #666;
                }

                .modal-buttons {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }

                .modal-buttons button {
                    padding: 8px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: transform 0.2s;
                }

                .modal-buttons button:hover {
                    transform: scale(1.05);
                }

                .confirm-btn {
                    background: #ff6b6b;
                    color: white;
                }

                .cancel-btn {
                    background: #ddd;
                    color: #333;
                }

                .success-msg {
                    background: #4CAF50;
                    color: white;
                    padding: 10px;
                    border-radius: 8px;
                    margin-top: 10px;
                    display: none;
                }
            </style>
        </head>
        <body>
            <div class="about-container">
                <div class="logo">🏢</div>
                <div class="app-title">Inventory Management System</div>
                <div class="version">Version 1.0.0</div>

                <div class="company-name">Ultimate Solutions (UltSol)</div>
                <div class="tagline">"Empowering Businesses Through Technology"</div>

                <div class="info-section">
                    <div class="info-item">
                        <span class="info-icon">🌐</span>
                        <span class="info-label">Website:</span>
                        <span class="info-value">
                            <a id="websiteLink" href="#">ultsol.cloud</a>
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">📞</span>
                        <span class="info-label">Phone:</span>
                        <span class="info-value">+92 300 6468177</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">📱</span>
                        <span class="info-label">WhatsApp:</span>
                        <span class="info-value">+92 300 6468177</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">📧</span>
                        <span class="info-label">Email:</span>
                        <span class="info-value">
                            <a id="emailLink" href="#">info@ultsol.cloud</a>
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">📍</span>
                        <span class="info-label">Address:</span>
                        <span class="info-value">Sheikhupura Road, near Sadiq Hospital, Gujranwala</span>
                    </div>

                </div>

                <div class="copyright">
                    © 2024 Ultimate Solutions (UltSol). All rights reserved.<br>
                    This software is protected by copyright law.
                </div>

                <button class="close-button" onclick="window.close()">Close</button>

                <button class="reset-btn" id="resetBtn" title="Triple click to reset admin credentials">🔧</button>
            </div>

            <div id="resetModal" class="modal">
                <div class="modal-content">
                    <h3>⚠️ Reset Admin Credentials</h3>
                    <p>Are you sure you want to reset admin username and password to default?</p>
                    <p style="font-size: 12px; color: #999;">Username: <strong>admin</strong><br>Password: <strong>admin123</strong></p>
                    <div class="modal-buttons">
                        <button class="confirm-btn" onclick="confirmReset()">Yes, Reset</button>
                        <button class="cancel-btn" onclick="closeModal()">Cancel</button>
                    </div>
                </div>
            </div>

            <div id="successMsg" class="success-msg"></div>

            <script>
                const { shell } = require('electron');
                const { ipcRenderer } = require('electron');

                document.getElementById('websiteLink').addEventListener('click', (e) => {
                    e.preventDefault();
                    shell.openExternal('https://ultsol.cloud');
                });

                document.getElementById('emailLink').addEventListener('click', (e) => {
                    e.preventDefault();
                    shell.openExternal('mailto:info@ultsol.cloud');
                });

                let clickCount = 0;
                let clickTimer = null;

                document.getElementById('resetBtn').addEventListener('click', () => {
                    clickCount++;

                    if (clickTimer) {
                        clearTimeout(clickTimer);
                    }

                    clickTimer = setTimeout(() => {
                        if (clickCount >= 3) {
                            showModal();
                        }
                        clickCount = 0;
                    }, 500);
                });

                function showModal() {
                    document.getElementById('resetModal').style.display = 'flex';
                }

                function closeModal() {
                    document.getElementById('resetModal').style.display = 'none';
                }

                async function confirmReset() {
                    closeModal();

                    try {
                        const result = await ipcRenderer.invoke('db:resetAdmin');

                        if (result.success) {
                            const successMsg = document.getElementById('successMsg');
                            successMsg.textContent = '✅ Admin credentials reset successfully! Username: admin, Password: admin123';
                            successMsg.style.display = 'block';

                            setTimeout(() => {
                                successMsg.style.display = 'none';
                            }, 5000);
                        } else {
                            alert('Failed to reset credentials: ' + result.error);
                        }
                    } catch (error) {
                        alert('Error: ' + error.message);
                    }
                }

                window.closeModal = closeModal;
                window.confirmReset = confirmReset;
            </script>
        </body>
        </html>
    `;

    aboutWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(aboutHTML)}`);

    aboutWindow.once('ready-to-show', () => {
        aboutWindow.show();
    });
}

app.whenReady().then(() => {
    initDatabase();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// ============ IPC HANDLERS ============

// Auth handlers
ipcMain.handle('db:login', async (event, { username, password }) => {
    try {
        const stmt = db.prepare("SELECT * FROM tbl_user WHERE username = ? AND password = ?");
        const user = stmt.get(username, password);

        if (user) {
            return {
                success: true,
                user: {
                    id: user.user_id,
                    username: user.username,
                    full_name: user.full_name,
                    role: user.role
                }
            };
        }
        return { success: false, error: 'Invalid credentials' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Database error' };
    }
});

// User Management handlers
ipcMain.handle('db:getUsers', async () => {
    const stmt = db.prepare("SELECT user_id, username, full_name, role, created_at FROM tbl_user ORDER BY created_at DESC");
    return stmt.all();
});

ipcMain.handle('db:createUser', async (event, user) => {
    try {
        const checkStmt = db.prepare("SELECT user_id FROM tbl_user WHERE username = ?");
        const existing = checkStmt.get(user.username);

        if (existing) {
            return { success: false, error: 'Username already exists' };
        }

        const stmt = db.prepare("INSERT INTO tbl_user (username, password, full_name, role) VALUES (?, ?, ?, ?)");
        const info = stmt.run(user.username, user.password, user.full_name, user.role || 'user');
        return { success: true, id: info.lastInsertRowid };
    } catch (error) {
        console.error('Create user error:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('db:updateUserPassword', async (event, { userId, newPassword }) => {
    try {
        const stmt = db.prepare("UPDATE tbl_user SET password = ? WHERE user_id = ?");
        const info = stmt.run(newPassword, userId);
        return { success: true, changes: info.changes };
    } catch (error) {
        console.error('Update password error:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('db:deleteUser', async (event, userId) => {
    try {
        const stmt = db.prepare("DELETE FROM tbl_user WHERE user_id = ? AND role != 'admin'");
        const info = stmt.run(userId);
        return { success: true, changes: info.changes };
    } catch (error) {
        console.error('Delete user error:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('db:resetAdmin', async () => {
    console.log('=== db:resetAdmin handler called ===');
    try {
        const allUsers = db.prepare("SELECT user_id, username, role, password FROM tbl_user").all();
        console.log('Current users in database:', allUsers);

        const updateStmt = db.prepare("UPDATE tbl_user SET username = ?, password = ? WHERE role = 'admin'");
        const updateResult = updateStmt.run('admin', 'admin123');
        console.log('Update result (by role):', updateResult);

        let success = false;

        if (updateResult.changes === 0) {
            console.log('No user with role=admin found, trying by username');
            const updateByUsername = db.prepare("UPDATE tbl_user SET username = ?, password = ?, role = 'admin' WHERE username = 'admin'");
            const usernameResult = updateByUsername.run('admin', 'admin123');
            console.log('Update result (by username):', usernameResult);

            if (usernameResult.changes === 0) {
                console.log('No admin user found, creating new one');
                const insertStmt = db.prepare("INSERT INTO tbl_user (username, password, full_name, role) VALUES (?, ?, ?, ?)");
                const insertResult = insertStmt.run('admin', 'admin123', 'Administrator', 'admin');
                console.log('Insert result:', insertResult);
                success = insertResult.changes > 0;
            } else {
                success = true;
            }
        } else {
            success = true;
        }

        const verifyAdmin = db.prepare("SELECT user_id, username, role FROM tbl_user WHERE username = 'admin'").get();
        console.log('Admin after reset:', verifyAdmin);

        if (success && verifyAdmin) {
            console.log('Reset successful');
            return { success: true, message: 'Admin credentials reset successfully' };
        } else {
            console.log('Reset failed');
            return { success: false, error: 'Failed to reset admin credentials' };
        }
    } catch (error) {
        console.error('Reset admin error:', error);
        return { success: false, error: error.message };
    }
});

// Product handlers
ipcMain.handle('db:getProducts', async () => {
    const stmt = db.prepare("SELECT * FROM tbl_product ORDER BY item_id");
    return stmt.all();
});

ipcMain.handle('db:getProductById', async (event, id) => {
    const stmt = db.prepare("SELECT * FROM tbl_product WHERE item_id = ?");
    return stmt.get(id);
});

ipcMain.handle('db:createProduct', async (event, product) => {
    const stmt = db.prepare(
        `INSERT INTO tbl_product (item_code, item_name, item_name_urdu, price, created_by) 
         VALUES (?, ?, ?, ?, ?)`
    );
    const info = stmt.run(product.item_code, product.item_name, product.item_name_urdu, product.price, 'admin');
    return { id: info.lastInsertRowid };
});

ipcMain.handle('db:updateProduct', async (event, product) => {
    const stmt = db.prepare(
        `UPDATE tbl_product SET item_code=?, item_name=?, item_name_urdu=?, price=?, modified_by=?, modified_at=CURRENT_TIMESTAMP 
         WHERE item_id=?`
    );
    const info = stmt.run(product.item_code, product.item_name, product.item_name_urdu, product.price,
        'admin', product.item_id);
    return { changes: info.changes };
});

ipcMain.handle('db:deleteProduct', async (event, id) => {
    const stmt = db.prepare("DELETE FROM tbl_product WHERE item_id = ?");
    const info = stmt.run(id);
    return { changes: info.changes };
});

// Account handlers
ipcMain.handle('db:getAccounts', async () => {
    const stmt = db.prepare("SELECT * FROM tbl_account ORDER BY account_id");
    return stmt.all();
});

ipcMain.handle('db:getAccountById', async (event, id) => {
    const stmt = db.prepare("SELECT * FROM tbl_account WHERE account_id = ?");
    return stmt.get(id);
});

ipcMain.handle('db:createAccount', async (event, account) => {
    const stmt = db.prepare(
        `INSERT INTO tbl_account (customer_name, customer_name_urdu, mobile_number, address, created_by) 
         VALUES (?, ?, ?, ?, ?)`
    );
    const info = stmt.run(account.customer_name, account.customer_name_urdu, account.mobile_number, account.address, 'admin');
    return { id: info.lastInsertRowid };
});

ipcMain.handle('db:updateAccount', async (event, account) => {
    const stmt = db.prepare(
        `UPDATE tbl_account SET customer_name=?, customer_name_urdu=?, mobile_number=?, address=?, 
         modified_by=?, modified_at=CURRENT_TIMESTAMP WHERE account_id=?`
    );
    const info = stmt.run(account.customer_name, account.customer_name_urdu, account.mobile_number, account.address, 'admin', account.account_id);
    return { changes: info.changes };
});

ipcMain.handle('db:deleteAccount', async (event, id) => {
    const stmt = db.prepare("DELETE FROM tbl_account WHERE account_id = ?");
    const info = stmt.run(id);
    return { changes: info.changes };
});

// Updated Invoice handlers - supports multiple customers per invoice
ipcMain.handle('db:getInvoices', async () => {
    const stmt = db.prepare(`
        SELECT DISTINCT m.*, 
            GROUP_CONCAT(DISTINCT d.customer_name) as customers_list
        FROM tbl_invoice_master m
        LEFT JOIN tbl_invoice_details d ON m.invoice_id = d.invoice_id
        GROUP BY m.invoice_id
        ORDER BY m.invoice_id DESC
    `);
    return stmt.all();
});

ipcMain.handle('db:getInvoiceById', async (event, id) => {
    const stmt = db.prepare("SELECT * FROM tbl_invoice_master WHERE invoice_id = ?");
    return stmt.get(id);
});

ipcMain.handle('db:createInvoice', async (event, invoice) => {
    const insertMaster = db.prepare(
        `INSERT INTO tbl_invoice_master (voucher_id, order_no, invoice_date, notes, 
         total_weight, total_amount, discount, net_amount, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const insertDetail = db.prepare(
        `INSERT INTO tbl_invoice_details (invoice_id, item_id, item_name, item_name_urdu, 
         customer_id, customer_name, customer_name_urdu, quantity, unit, rate, amount) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const transaction = db.transaction((invoiceData) => {
        const info = insertMaster.run(
            invoiceData.voucher_id, invoiceData.order_no, invoiceData.invoice_date,
            invoiceData.notes, invoiceData.total_weight, invoiceData.total_amount,
            invoiceData.discount, invoiceData.net_amount, 'admin'
        );

        const invoiceId = info.lastInsertRowid;

        for (const item of invoiceData.items) {
            insertDetail.run(
                invoiceId, item.item_id, item.item_name, item.item_name_urdu || '',
                item.customer_id || null, item.customer_name, item.customer_name_urdu || '',
                item.quantity, item.unit, item.rate, item.amount
            );
        }

        return { id: invoiceId };
    });

    return transaction(invoice);
});

ipcMain.handle('db:updateInvoice', async (event, invoice) => {
    const updateMaster = db.prepare(
        `UPDATE tbl_invoice_master SET 
         order_no = ?, 
         invoice_date = ?, 
         notes = ?, 
         total_weight = ?, 
         total_amount = ?, 
         discount = ?, 
         net_amount = ?, 
         modified_by = ?, 
         modified_at = CURRENT_TIMESTAMP 
         WHERE invoice_id = ?`
    );

    const deleteDetails = db.prepare("DELETE FROM tbl_invoice_details WHERE invoice_id = ?");
    const insertDetail = db.prepare(
        `INSERT INTO tbl_invoice_details (invoice_id, item_id, item_name, item_name_urdu, 
         customer_id, customer_name, customer_name_urdu, quantity, unit, rate, amount) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const transaction = db.transaction((invoiceData) => {
        updateMaster.run(
            invoiceData.order_no,
            invoiceData.invoice_date,
            invoiceData.notes,
            invoiceData.total_weight,
            invoiceData.total_amount,
            invoiceData.discount,
            invoiceData.net_amount,
            'admin',
            invoiceData.invoice_id
        );

        deleteDetails.run(invoiceData.invoice_id);

        for (const item of invoiceData.items) {
            insertDetail.run(
                invoiceData.invoice_id,
                item.item_id,
                item.item_name,
                item.item_name_urdu || '',
                item.customer_id || null,
                item.customer_name,
                item.customer_name_urdu || '',
                item.quantity,
                item.unit,
                item.rate,
                item.amount
            );
        }

        return { id: invoiceData.invoice_id };
    });

    return transaction(invoice);
});

ipcMain.handle('db:deleteInvoice', async (event, id) => {
    const transaction = db.transaction((invoiceId) => {
        db.prepare("DELETE FROM tbl_invoice_details WHERE invoice_id = ?").run(invoiceId);
        const info = db.prepare("DELETE FROM tbl_invoice_master WHERE invoice_id = ?").run(invoiceId);
        return { changes: info.changes };
    });

    return transaction(id);
});

ipcMain.handle('db:getInvoiceDetails', async (event, id) => {
    const stmt = db.prepare("SELECT * FROM tbl_invoice_details WHERE invoice_id = ?");
    return stmt.all(id);
});

// Report handlers
ipcMain.handle('db:getSalesReport', async (event, { startDate, endDate }) => {
    try {
        if (!startDate || !endDate) return [];
        const stmt = db.prepare(`
            SELECT m.*, GROUP_CONCAT(DISTINCT d.customer_name) as customers_list
            FROM tbl_invoice_master m
            LEFT JOIN tbl_invoice_details d ON m.invoice_id = d.invoice_id
            WHERE m.invoice_date BETWEEN ? AND ?
            GROUP BY m.invoice_id
            ORDER BY m.invoice_date
        `);
        return stmt.all(startDate, endDate);
    } catch (error) {
        console.error('Sales report error:', error);
        return [];
    }
});

ipcMain.handle('db:getItemWiseSummary', async (event, { startDate, endDate }) => {
    try {
        if (!startDate || !endDate) return [];
        const stmt = db.prepare(
            `SELECT d.item_id, d.item_name, d.item_name_urdu, 
                    SUM(d.quantity) as total_quantity, SUM(d.amount) as total_amount,
                    COUNT(DISTINCT d.customer_name) as unique_customers
             FROM tbl_invoice_details d
             INNER JOIN tbl_invoice_master m ON d.invoice_id = m.invoice_id
             WHERE m.invoice_date BETWEEN ? AND ?
             GROUP BY d.item_id, d.item_name, d.item_name_urdu
             ORDER BY total_amount DESC`
        );
        return stmt.all(startDate, endDate);
    } catch (error) {
        console.error('Item summary error:', error);
        return [];
    }
});

// Backup and Restore handlers
ipcMain.handle('db:backup', async () => {
    const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Backup Database',
        defaultPath: `backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.db`,
        filters: [{ name: 'Database Files', extensions: ['db'] }]
    });

    if (!result.canceled) {
        try {
            db.close();
            fs.copyFileSync(dbPath, result.filePath);
            db = new Database(dbPath);
            db.pragma('foreign_keys = ON');
            return { success: true, path: result.filePath };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    return { success: false, cancelled: true };
});

ipcMain.handle('db:restore', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Restore Database',
        properties: ['openFile'],
        filters: [{ name: 'Database Files', extensions: ['db'] }]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const restorePath = result.filePaths[0];

        try {
            db.close();
            fs.copyFileSync(restorePath, dbPath);
            db = new Database(dbPath);
            db.pragma('foreign_keys = ON');
            return { success: true, path: restorePath };
        } catch (error) {
            try {
                db = new Database(dbPath);
                db.pragma('foreign_keys = ON');
            } catch (e) {
                console.error('Failed to reopen database:', e);
            }
            return { success: false, error: error.message };
        }
    }
    return { success: false, cancelled: true };
});

// PDF and HTML handlers
ipcMain.handle('open-html-in-browser', async (event, html) => {
    try {
        const tempDir = app.getPath('temp');
        const timestamp = Date.now();
        const tempFile = path.join(tempDir, `report_${timestamp}.html`);

        fs.writeFileSync(tempFile, html, 'utf8');
        await shell.openPath(tempFile);

        setTimeout(() => {
            try {
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
            } catch (err) {
                console.error('Error deleting temp file:', err);
            }
        }, 120000);

        return tempFile;
    } catch (error) {
        console.error('Error opening HTML in browser:', error);
        throw error;
    }
});

ipcMain.handle('print-to-pdf-and-open', async (event, html) => {
    try {
        const win = new BrowserWindow({
            show: false,
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pdfBuffer = await win.webContents.printToPDF({
            printBackground: true,
            pageSize: 'A6',
            margins: {
                top: 0.5,
                bottom: 0.5,
                left: 0.5,
                right: 0.5
            }
        });

        win.close();

        const tempPath = path.join(app.getPath('temp'), `report_${Date.now()}.pdf`);
        fs.writeFileSync(tempPath, pdfBuffer);
        await shell.openPath(tempPath);

        setTimeout(() => {
            try {
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                }
            } catch (err) {
                console.error('Error deleting temp file:', err);
            }
        }, 120000);

        return tempPath;
    } catch (error) {
        console.error('PDF generation error:', error);
        throw error;
    }
});

ipcMain.handle('print-to-pdf', async (event, html) => {
    try {
        const win = new BrowserWindow({
            show: false,
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pdfBuffer = await win.webContents.printToPDF({
            printBackground: true,
            pageSize: 'A6',
            margins: {
                top: 0.5,
                bottom: 0.5,
                left: 0.5,
                right: 0.5
            }
        });

        win.close();

        const { filePath } = await dialog.showSaveDialog({
            title: 'Save PDF',
            defaultPath: path.join(app.getPath('documents'), `document_${Date.now()}.pdf`),
            filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
        });

        if (filePath) {
            fs.writeFileSync(filePath, pdfBuffer);
            return filePath;
        }

        return null;
    } catch (error) {
        console.error('PDF generation error:', error);
        throw error;
    }
});