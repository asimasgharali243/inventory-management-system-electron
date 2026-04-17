
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
        invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    },

    database: {
        login: (username, password) => ipcRenderer.invoke('db:login', { username, password }),

        getUsers: () => ipcRenderer.invoke('db:getUsers'),
        createUser: (user) => ipcRenderer.invoke('db:createUser', user),
        deleteUser: (userId) => ipcRenderer.invoke('db:deleteUser', userId),
        updateUserPassword: (userId, newPassword) =>
            ipcRenderer.invoke('db:updateUserPassword', { userId, newPassword }),
        resetAdmin: () => ipcRenderer.invoke('db:resetAdmin'),

        getProducts: () => ipcRenderer.invoke('db:getProducts'),
        getProductById: (id) => ipcRenderer.invoke('db:getProductById', id),
        createProduct: (product) => ipcRenderer.invoke('db:createProduct', product),
        updateProduct: (product) => ipcRenderer.invoke('db:updateProduct', product),
        deleteProduct: (id) => ipcRenderer.invoke('db:deleteProduct', id),

        getAccounts: () => ipcRenderer.invoke('db:getAccounts'),
        getAccountById: (id) => ipcRenderer.invoke('db:getAccountById', id),
        createAccount: (account) => ipcRenderer.invoke('db:createAccount', account),
        updateAccount: (account) => ipcRenderer.invoke('db:updateAccount', account),
        deleteAccount: (id) => ipcRenderer.invoke('db:deleteAccount', id),

        getInvoices: () => ipcRenderer.invoke('db:getInvoices'),
        getInvoiceById: (id) => ipcRenderer.invoke('db:getInvoiceById', id),
        createInvoice: (invoice) => ipcRenderer.invoke('db:createInvoice', invoice),
        updateInvoice: (invoice) => ipcRenderer.invoke('db:updateInvoice', invoice),
        deleteInvoice: (id) => ipcRenderer.invoke('db:deleteInvoice', id),
        getInvoiceDetails: (id) => ipcRenderer.invoke('db:getInvoiceDetails', id),

        getSalesReport: (startDate, endDate) =>
            ipcRenderer.invoke('db:getSalesReport', { startDate, endDate }),

        getItemWiseSummary: (startDate, endDate) =>
            ipcRenderer.invoke('db:getItemWiseSummary', { startDate, endDate }),

        backup: () => ipcRenderer.invoke('db:backup'),
        restore: () => ipcRenderer.invoke('db:restore'),
    },

    printToPDF: (html) => ipcRenderer.invoke('print-to-pdf', html),
    printToPDFAndOpen: (html) => ipcRenderer.invoke('print-to-pdf-and-open', html),
    openHTMLInBrowser: (html) => ipcRenderer.invoke('open-html-in-browser', html),

    onTriggerBackup: (callback) => ipcRenderer.on('trigger-backup', callback),
    onTriggerRestore: (callback) => ipcRenderer.on('trigger-restore', callback),

    app: {
        getPath: (name) => ipcRenderer.invoke('app:getPath', name),
        getAppPath: () => ipcRenderer.invoke('app:getAppPath'),
    },
});