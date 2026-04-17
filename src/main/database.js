
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../data/inventory.db');
const dataDir = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('Database connected successfully');

function initDatabase() {
    // Users table
    db.exec(`CREATE TABLE IF NOT EXISTS tbl_user (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Products table - simplified version without commented fields
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

    // Accounts table
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

    // Invoice Master table
    db.exec(`CREATE TABLE IF NOT EXISTS tbl_invoice_master (
        invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
        voucher_id TEXT UNIQUE NOT NULL,
        order_no TEXT,
        invoice_date DATE NOT NULL,
        account_id INTEGER,
        customer_name TEXT,
        notes TEXT,
        total_weight DECIMAL(10,2) DEFAULT 0,
        total_amount DECIMAL(10,2) DEFAULT 0,
        discount DECIMAL(10,2) DEFAULT 0,
        net_amount DECIMAL(10,2) DEFAULT 0,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        modified_by TEXT,
        modified_at DATETIME,
        FOREIGN KEY (account_id) REFERENCES tbl_account(account_id)
    )`);

    // Invoice Details table
    db.exec(`CREATE TABLE IF NOT EXISTS tbl_invoice_details (
        detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER,
        item_id INTEGER,
        item_name TEXT,
        quantity DECIMAL(10,2),
        unit TEXT,
        rate DECIMAL(10,2),
        amount DECIMAL(10,2),
        FOREIGN KEY (invoice_id) REFERENCES tbl_invoice_master(invoice_id),
        FOREIGN KEY (item_id) REFERENCES tbl_product(item_id)
    )`);

    // Insert default admin user if not exists
    const adminCheck = db.prepare("SELECT * FROM tbl_user WHERE username = ?").get('admin');
    if (!adminCheck) {
        db.prepare("INSERT INTO tbl_user (username, password, full_name, role) VALUES (?, ?, ?, ?)")
            .run('admin', 'admin123', 'Administrator', 'admin');
        console.log('Admin user created');
    }

    // Insert sample products if no products exist
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
}

function backupDatabase(backupPath) {
    try {
        // Close current connection
        db.close();

        // Copy file
        fs.copyFileSync(dbPath, backupPath);

        // Reconnect database
        const newDb = new Database(dbPath);
        Object.assign(db, newDb);

        return { success: true, path: backupPath };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function restoreDatabase(restorePath) {
    try {
        // Close current connection
        db.close();

        // Restore file
        fs.copyFileSync(restorePath, dbPath);

        // Reconnect database
        const newDb = new Database(dbPath);
        Object.assign(db, newDb);

        return { success: true, path: restorePath };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    db,
    initDatabase,
    backupDatabase,
    restoreDatabase
};