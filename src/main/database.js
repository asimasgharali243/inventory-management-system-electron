// // const sqlite3 = require('sqlite3');
// // const path = require('path');
// // const fs = require('fs');

// // const dbPath = path.join(__dirname, '../../data/inventory.db');
// // const dataDir = path.join(__dirname, '../../data');

// // // Ensure data directory exists
// // if (!fs.existsSync(dataDir)) {
// //     fs.mkdirSync(dataDir, { recursive: true });
// // }

// // const db = new sqlite3.Database(dbPath, (err) => {
// //     if (err) {
// //         console.error('Error opening database:', err);
// //     } else {
// //         console.log('Database connected successfully');
// //     }
// // });

// // function initDatabase() {
// //     // Users table
// //     db.run(`CREATE TABLE IF NOT EXISTS tbl_user (
// //     user_id INTEGER PRIMARY KEY AUTOINCREMENT,
// //     username TEXT UNIQUE NOT NULL,
// //     password TEXT NOT NULL,
// //     full_name TEXT,
// //     role TEXT DEFAULT 'user',
// //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// //   )`);

// //     // Products table
// //     db.run(`CREATE TABLE IF NOT EXISTS tbl_product (
// //     item_id INTEGER PRIMARY KEY AUTOINCREMENT,
// //     item_code TEXT UNIQUE NOT NULL,
// //     item_name TEXT NOT NULL,
// //     item_name_urdu TEXT,
// //     price DECIMAL(10,2) DEFAULT 0,
// //     created_by TEXT,
// //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
// //     modified_by TEXT,
// //     modified_at DATETIME
// //   )`);

// //     // Accounts table
// //     db.run(`CREATE TABLE IF NOT EXISTS tbl_account (
// //     account_id INTEGER PRIMARY KEY AUTOINCREMENT,
// //     customer_name TEXT,
// //     customer_name_urdu TEXT,
// //     mobile_number TEXT,
// //     address TEXT,
// //     created_by TEXT,
// //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
// //     modified_by TEXT,
// //     modified_at DATETIME
// //   )`);

// //     // Invoice Master table
// //     db.run(`CREATE TABLE IF NOT EXISTS tbl_invoice_master (
// //     invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
// //     voucher_id TEXT UNIQUE NOT NULL,
// //     order_no TEXT,
// //     invoice_date DATE NOT NULL,
// //     account_id INTEGER,
// //     customer_name TEXT,
// //     notes TEXT,
// //     total_weight DECIMAL(10,2) DEFAULT 0,
// //     total_amount DECIMAL(10,2) DEFAULT 0,
// //     discount DECIMAL(10,2) DEFAULT 0,
// //     net_amount DECIMAL(10,2) DEFAULT 0,
// //     created_by TEXT,
// //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
// //     modified_by TEXT,
// //     modified_at DATETIME,
// //     FOREIGN KEY (account_id) REFERENCES tbl_account(account_id)
// //   )`);

// //     // Invoice Details table
// //     db.run(`CREATE TABLE IF NOT EXISTS tbl_invoice_details (
// //     detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
// //     invoice_id INTEGER,
// //     item_id INTEGER,
// //     item_name TEXT,
// //     quantity DECIMAL(10,2),
// //     unit TEXT,
// //     rate DECIMAL(10,2),
// //     amount DECIMAL(10,2),
// //     FOREIGN KEY (invoice_id) REFERENCES tbl_invoice_master(invoice_id),
// //     FOREIGN KEY (item_id) REFERENCES tbl_product(item_id)
// //   )`);

// //     // Insert default admin user if not exists
// //     db.get("SELECT * FROM tbl_user WHERE username = 'admin'", (err, row) => {
// //         if (!row) {
// //             db.run("INSERT INTO tbl_user (username, password, full_name, role) VALUES (?, ?, ?, ?)",
// //                 ['admin', 'admin123', 'Administrator', 'admin']);
// //         }
// //     });

// //     // Insert sample products
// //     db.get("SELECT * FROM tbl_product LIMIT 1", (err, row) => {
// //         if (!row) {
// //             const sampleProducts = [
// //                 ['1', 'APPLE GAJA', 'سیب گچا', 4000, 'Pcs', 'Fruits', 'Local', 'Large', 10, 215],
// //                 ['2', 'SAIB GOLDEN', 'سیب کالا گوڼل', 3500, 'Pcs', 'Fruits', 'Local', 'Medium', 10, 101],
// //                 ['3', 'SAIB KALA KOLO', 'سیب کالا کولو', 3800, 'Pcs', 'Fruits', 'Local', 'Large', 10, 195],
// //                 ['4', 'SAIB MSHADI', 'سیب مشدی', 3300, 'Pcs', 'Fruits', 'Local', 'Medium', 10, 495],
// //                 ['5', 'SAIB BOLI WALA', 'سیب بولی والا', 3200, 'Pcs', 'Fruits', 'Local', 'Small', 10, 40],
// //                 ['6', 'SAIB GOLA', 'سیب گولا', 3600, 'Pcs', 'Fruits', 'Local', 'Large', 10, 205]
// //             ];

// //             sampleProducts.forEach(product => {
// //                 db.run(`INSERT INTO tbl_product (item_code, item_name, item_name_urdu, price, unit, category, company, size, minimum_level, current_stock, created_by) 
// //                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// //                     [...product, 'admin']);
// //             });
// //         }
// //     });
// // }

// // function backupDatabase(backupPath) {
// //     return new Promise((resolve, reject) => {
// //         db.close((err) => {
// //             if (err) {
// //                 reject({ success: false, error: err.message });
// //                 return;
// //             }

// //             fs.copyFile(dbPath, backupPath, (err) => {
// //                 if (err) {
// //                     reject({ success: false, error: err.message });
// //                 } else {
// //                     resolve({ success: true, path: backupPath });
// //                 }

// //                 // Reconnect database
// //                 const newDb = new sqlite3.Database(dbPath);
// //                 Object.assign(db, newDb);
// //             });
// //         });
// //     });
// // }

// // function restoreDatabase(restorePath) {
// //     return new Promise((resolve, reject) => {
// //         db.close((err) => {
// //             if (err) {
// //                 reject({ success: false, error: err.message });
// //                 return;
// //             }

// //             fs.copyFile(restorePath, dbPath, (err) => {
// //                 if (err) {
// //                     reject({ success: false, error: err.message });
// //                 } else {
// //                     resolve({ success: true, path: restorePath });
// //                 }

// //                 // Reconnect database
// //                 const newDb = new sqlite3.Database(dbPath);
// //                 Object.assign(db, newDb);
// //             });
// //         });
// //     });
// // }

// // module.exports = {
// //     db,
// //     initDatabase,
// //     backupDatabase,
// //     restoreDatabase
// // };


// const sqlite3 = require('sqlite3');
// const path = require('path');
// const fs = require('fs');

// const dbPath = path.join(__dirname, '../../data/inventory.db');
// const dataDir = path.join(__dirname, '../../data');

// // Ensure data directory exists
// if (!fs.existsSync(dataDir)) {
//     fs.mkdirSync(dataDir, { recursive: true });
// }

// const db = new sqlite3.Database(dbPath, (err) => {
//     if (err) {
//         console.error('Error opening database:', err);
//     } else {
//         console.log('Database connected successfully');
//     }
// });

// function initDatabase() {
//     // Users table
//     db.run(`CREATE TABLE IF NOT EXISTS tbl_user (
//         user_id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT UNIQUE NOT NULL,
//         password TEXT NOT NULL,
//         full_name TEXT,
//         role TEXT DEFAULT 'user',
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )`);

//     // Products table - simplified version without commented fields
//     db.run(`CREATE TABLE IF NOT EXISTS tbl_product (
//         item_id INTEGER PRIMARY KEY AUTOINCREMENT,
//         item_code TEXT UNIQUE NOT NULL,
//         item_name TEXT NOT NULL,
//         item_name_urdu TEXT,
//         price DECIMAL(10,2) DEFAULT 0,
//         created_by TEXT,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         modified_by TEXT,
//         modified_at DATETIME
//     )`);

//     // Accounts table
//     db.run(`CREATE TABLE IF NOT EXISTS tbl_account (
//         account_id INTEGER PRIMARY KEY AUTOINCREMENT,
//         customer_name TEXT,
//         customer_name_urdu TEXT,
//         mobile_number TEXT,
//         address TEXT,
//         created_by TEXT,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         modified_by TEXT,
//         modified_at DATETIME
//     )`);

//     // Invoice Master table
//     db.run(`CREATE TABLE IF NOT EXISTS tbl_invoice_master (
//         invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
//         voucher_id TEXT UNIQUE NOT NULL,
//         order_no TEXT,
//         invoice_date DATE NOT NULL,
//         account_id INTEGER,
//         customer_name TEXT,
//         notes TEXT,
//         total_weight DECIMAL(10,2) DEFAULT 0,
//         total_amount DECIMAL(10,2) DEFAULT 0,
//         discount DECIMAL(10,2) DEFAULT 0,
//         net_amount DECIMAL(10,2) DEFAULT 0,
//         created_by TEXT,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         modified_by TEXT,
//         modified_at DATETIME,
//         FOREIGN KEY (account_id) REFERENCES tbl_account(account_id)
//     )`);

//     // Invoice Details table
//     db.run(`CREATE TABLE IF NOT EXISTS tbl_invoice_details (
//         detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
//         invoice_id INTEGER,
//         item_id INTEGER,
//         item_name TEXT,
//         quantity DECIMAL(10,2),
//         unit TEXT,
//         rate DECIMAL(10,2),
//         amount DECIMAL(10,2),
//         FOREIGN KEY (invoice_id) REFERENCES tbl_invoice_master(invoice_id),
//         FOREIGN KEY (item_id) REFERENCES tbl_product(item_id)
//     )`);

//     // Insert default admin user if not exists
//     db.get("SELECT * FROM tbl_user WHERE username = 'admin'", (err, row) => {
//         if (err) {
//             console.error('Error checking admin user:', err);
//         } else if (!row) {
//             db.run("INSERT INTO tbl_user (username, password, full_name, role) VALUES (?, ?, ?, ?)",
//                 ['admin', 'admin123', 'Administrator', 'admin'], (err) => {
//                     if (err) console.error('Error creating admin user:', err);
//                 });
//         }
//     });

//     // Insert sample products if no products exist
//     db.get("SELECT COUNT(*) as count FROM tbl_product", (err, row) => {
//         if (err) {
//             console.error('Error checking products:', err);
//         } else if (row.count === 0) {
//             const sampleProducts = [
//                 ['P001', 'Apple Gaja', 'سیب گچا', 400.00, 'admin'],
//                 ['P002', 'Saib Golden', 'سیب کالا گوڼل', 350.00, 'admin'],
//                 ['P003', 'Saib Kala Kolo', 'سیب کالا کولو', 380.00, 'admin'],
//                 ['P004', 'Saib Mshadi', 'سیب مشدی', 330.00, 'admin'],
//                 ['P005', 'Saib Boli Wala', 'سیب بولی والا', 320.00, 'admin'],
//                 ['P006', 'Saib Gola', 'سیب گولا', 360.00, 'admin']
//             ];

//             sampleProducts.forEach(product => {
//                 db.run(`INSERT INTO tbl_product (item_code, item_name, item_name_urdu, price, created_by) 
//                         VALUES (?, ?, ?, ?, ?)`, product, (err) => {
//                     if (err) console.error('Error inserting sample product:', err);
//                 });
//             });
//         }
//     });
// }

// function backupDatabase(backupPath) {
//     return new Promise((resolve, reject) => {
//         db.close((err) => {
//             if (err) {
//                 reject({ success: false, error: err.message });
//                 return;
//             }

//             fs.copyFile(dbPath, backupPath, (err) => {
//                 if (err) {
//                     reject({ success: false, error: err.message });
//                 } else {
//                     resolve({ success: true, path: backupPath });
//                 }

//                 // Reconnect database
//                 const newDb = new sqlite3.Database(dbPath);
//                 Object.assign(db, newDb);
//             });
//         });
//     });
// }

// function restoreDatabase(restorePath) {
//     return new Promise((resolve, reject) => {
//         db.close((err) => {
//             if (err) {
//                 reject({ success: false, error: err.message });
//                 return;
//             }

//             fs.copyFile(restorePath, dbPath, (err) => {
//                 if (err) {
//                     reject({ success: false, error: err.message });
//                 } else {
//                     resolve({ success: true, path: restorePath });
//                 }

//                 // Reconnect database
//                 const newDb = new sqlite3.Database(dbPath);
//                 Object.assign(db, newDb);
//             });
//         });
//     });
// }

// module.exports = {
//     db,
//     initDatabase,
//     backupDatabase,
//     restoreDatabase
// };

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