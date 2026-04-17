import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiSave, FiPrinter, FiTrash2, FiEdit2, FiCheck, FiSearch, FiPackage, FiX, FiCalendar } from 'react-icons/fi';
import { NavigationContext } from '../App';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';

function InvoiceManagement() {
    const navigate = useNavigate();
    const location = useLocation();
    const { goBack } = useContext(NavigationContext);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentInvoiceId, setCurrentInvoiceId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastVoucherNumber, setLastVoucherNumber] = useState(0);

    const [invoice, setInvoice] = useState({
        voucher_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        order_no: '',
        account_id: '',
        customer_name: '',
        notes: '',
        items: [],
        total_weight: 0,
        total_amount: 0
    });

    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [tempItem, setTempItem] = useState(null);
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [showItemDropdown, setShowItemDropdown] = useState(null);
    const [focusedDropdownIndex, setFocusedDropdownIndex] = useState(-1);
    const [focusedCustomerIndex, setFocusedCustomerIndex] = useState(-1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDate, setTempDate] = useState('');
    const [editingCustomerRow, setEditingCustomerRow] = useState(null);
    const [rowCustomers, setRowCustomers] = useState({});
    const [currentEditingRow, setCurrentEditingRow] = useState(null);
    const [cachedItem, setCachedItem] = useState(null);
    const [initialized, setInitialized] = useState(false);

    // Refs for keyboard navigation and state
    const voucherRef = useRef(null);
    const dateRef = useRef(null);
    const orderNoRef = useRef(null);
    const notesRef = useRef(null);
    const saveButtonRef = useRef(null);
    const printButtonRef = useRef(null);
    const newButtonRef = useRef(null);
    const addItemRowButtonRef = useRef(null);
    const customerDropdownRef = useRef(null);
    const itemDropdownRefs = useRef({});
    const datePickerRef = useRef(null);
    const tableContainerRef = useRef(null);
    const customerInputRefs = useRef({});
    const itemInputRefs = useRef({});
    const invoiceRef = useRef(invoice);
    const rowCustomersRef = useRef(rowCustomers);
    const qtyInputRefs = useRef({});
    const rateInputRefs = useRef({});
    const isEditModeRef = useRef(isEditMode);
    const currentInvoiceIdRef = useRef(currentInvoiceId);

    // Keep refs updated
    useEffect(() => {
        invoiceRef.current = invoice;
    }, [invoice]);

    useEffect(() => {
        rowCustomersRef.current = rowCustomers;
    }, [rowCustomers]);

    useEffect(() => {
        isEditModeRef.current = isEditMode;
    }, [isEditMode]);

    useEffect(() => {
        currentInvoiceIdRef.current = currentInvoiceId;
    }, [currentInvoiceId]);

    // Helper function to get valid items (exclude empty last item)
    const getValidItems = () => {
        const items = invoiceRef.current.items;
        const validItems = items.filter((item, index) => {
            const isEmpty = !item.item_id || item.item_id === '' || item.quantity <= 0;
            const isLastItem = index === items.length - 1;

            if (isLastItem && isEmpty) {
                return false;
            }
            return item.item_id && item.item_id !== '' && item.quantity > 0;
        });
        return validItems;
    };

    // Helper function to get customer for a specific item
    const getItemCustomer = (itemId) => {
        const customer = rowCustomersRef.current[itemId];
        if (customer && typeof customer === 'object') {
            return customer.name;
        }
        return customer || '';
    };

    // Helper function to get full customer object for an item
    const getItemCustomerObject = (itemId) => {
        const customer = rowCustomersRef.current[itemId];
        if (customer && typeof customer === 'object') {
            return customer;
        }
        return { name: customer || '', nameUrdu: '', mobile: '' };
    };

    // Group items by customer
    const groupItemsByCustomer = () => {
        const validItems = getValidItems();
        const grouped = {};

        validItems.forEach(item => {
            const customerData = rowCustomersRef.current[item.id];
            const customer = customerData && typeof customerData === 'object' ? customerData.name : customerData;
            if (!customer) return;

            if (!grouped[customer]) {
                grouped[customer] = [];
            }
            grouped[customer].push(item);
        });

        return grouped;
    };

    // Get next voucher number
    const getNextVoucherNumber = async () => {
        try {
            const invoices = await window.electron.database.getInvoices();
            let maxNumber = 0;

            invoices.forEach(inv => {
                const match = inv.voucher_id.match(/S-(\d+)/);
                if (match) {
                    const num = parseInt(match[1]);
                    if (num > maxNumber) maxNumber = num;
                }
            });

            const nextNumber = maxNumber + 1;
            setLastVoucherNumber(nextNumber);
            return nextNumber;
        } catch (error) {
            console.error('Error getting next voucher number:', error);
            return lastVoucherNumber + 1;
        }
    };

    const generateVoucherIdSync = (number) => {
        return `S-${number}`;
    };

    useEffect(() => {
        const editInvoice = location.state?.invoice;
        if (editInvoice) {
            loadInvoiceForEdit(editInvoice);
        } else if (!initialized) {
            loadData();
            setInitialized(true);
        }
        setupKeyboardShortcuts();
        setTimeout(() => orderNoRef.current?.focus(), 100);
        return () => cleanupKeyboardShortcuts();
    }, []);

    const loadInvoiceForEdit = async (editInvoice) => {
        try {
            setIsEditMode(true);
            setCurrentInvoiceId(editInvoice.invoice_id);

            const details = await window.electron.database.getInvoiceDetails(editInvoice.invoice_id);
            const accountsData = await window.electron.database.getAccounts();
            setAccounts(accountsData || []);
            const productsData = await window.electron.database.getProducts();
            setProducts(productsData || []);

            const mappedItems = details.map((item, index) => ({
                id: Date.now() + index,
                item_id: item.item_id.toString(),
                item_name: item.item_name,
                item_name_urdu: item.item_name_urdu || '',
                quantity: item.quantity,
                unit: item.unit || 'Pcs',
                rate: item.rate,
                amount: item.amount,
                isNew: false
            }));

            const customersMap = {};
            details.forEach((item, index) => {
                const itemId = mappedItems[index].id;
                if (item.customer_name && item.customer_name !== 'null') {
                    customersMap[itemId] = {
                        name: item.customer_name,
                        nameUrdu: item.customer_name_urdu || '',
                        mobile: ''
                    };
                }
            });

            const newInvoice = {
                voucher_id: editInvoice.voucher_id,
                invoice_date: editInvoice.invoice_date,
                order_no: editInvoice.order_no || '',
                account_id: editInvoice.account_id || '',
                customer_name: editInvoice.customer_name || '',
                notes: editInvoice.notes || '',
                items: mappedItems,
                total_weight: editInvoice.total_weight,
                total_amount: editInvoice.total_amount
            };

            setInvoice(newInvoice);
            invoiceRef.current = newInvoice;
            setRowCustomers(customersMap);
            rowCustomersRef.current = customersMap;
            setTempDate(formatDateForDisplay(editInvoice.invoice_date));
            
            toast.success('Invoice loaded for editing');
        } catch (error) {
            console.error('Failed to load invoice for edit:', error);
            toast.error('Failed to load invoice data');
            loadData();
        }
    };

    useEffect(() => {
        calculateTotals();
    }, [invoice.items]);

    useEffect(() => {
        if (tempItem && tempItem.searchTerm !== undefined && tempItem.searchTerm.length > 0) {
            setFilteredProducts(
                products.filter(product =>
                    product.item_name.toLowerCase().includes(tempItem.searchTerm.toLowerCase()) ||
                    (product.item_code && product.item_code.toLowerCase().includes(tempItem.searchTerm.toLowerCase()))
                )
            );
            setFocusedDropdownIndex(-1);
        } else {
            setFilteredProducts([]);
        }
    }, [tempItem?.searchTerm, products]);

    useEffect(() => {
        const searchTerm = editingCustomerRow !== null ?
            (typeof rowCustomers[editingCustomerRow] === 'object' ? rowCustomers[editingCustomerRow]?.name || '' : rowCustomers[editingCustomerRow] || '') : '';

        if (searchTerm.length > 0) {
            setFilteredAccounts(
                accounts.filter(account =>
                    account.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (account.mobile_number && account.mobile_number.includes(searchTerm))
                )
            );
            setFocusedCustomerIndex(-1);
        } else {
            setFilteredAccounts([]);
        }
    }, [rowCustomers, editingCustomerRow, accounts]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
            if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target)) {
                const activeCustomerInput = document.querySelector(`[data-customer-edit="${editingCustomerRow}"]`);
                if (activeCustomerInput && !activeCustomerInput.contains(event.target)) {
                    setShowCustomerDropdown(false);
                    setEditingCustomerRow(null);
                }
            }
            Object.keys(itemDropdownRefs.current).forEach(itemId => {
                if (itemDropdownRefs.current[itemId] && !itemDropdownRefs.current[itemId].contains(event.target)) {
                    const itemInput = document.querySelector(`[data-row-id="${itemId}"]`);
                    if (itemInput && !itemInput.contains(event.target)) {
                        setShowItemDropdown(null);
                    }
                }
            });
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [editingCustomerRow]);

    const loadData = async () => {
        try {
            const accountsData = await window.electron.database.getAccounts();
            setAccounts(accountsData || []);
            setFilteredAccounts([]);
            const productsData = await window.electron.database.getProducts();
            setProducts(productsData || []);
            setFilteredProducts([]);

            const nextNumber = await getNextVoucherNumber();
            const newVoucherId = generateVoucherIdSync(nextNumber);

            const newItemId = Date.now();
            const initialItem = {
                id: newItemId,
                item_id: '',
                item_name: '',
                item_name_urdu: '',
                quantity: 0,
                unit: 'Pcs',
                rate: 0,
                amount: 0,
                isNew: true
            };

            const newInvoice = {
                voucher_id: newVoucherId,
                invoice_date: new Date().toISOString().split('T')[0],
                order_no: '',
                account_id: '',
                customer_name: '',
                notes: '',
                items: [initialItem],
                total_weight: 0,
                total_amount: 0
            };

            setInvoice(newInvoice);
            invoiceRef.current = newInvoice;

            setRowCustomers({});
            rowCustomersRef.current = {};
            setCurrentEditingRow(newItemId);
            setEditingItemId(newItemId);
            setTempItem({
                id: newItemId,
                item_id: '',
                item_name: '',
                quantity: 0,
                rate: 0,
                amount: 0,
                searchTerm: ''
            });
            setShowItemDropdown(newItemId);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load data');
        }
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
        return null;
    };

    const handleDateSelect = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const storageDate = `${year}-${month}-${day}`;
        setInvoice(prev => ({ ...prev, invoice_date: storageDate }));
        setTempDate(formatDateForDisplay(storageDate));
        setShowDatePicker(false);
        setTimeout(() => orderNoRef.current?.focus(), 100);
    };

    const handleDateInputChange = (e) => {
        const value = e.target.value;
        setTempDate(value);

        let formatted = value.replace(/[^0-9]/g, '');
        if (formatted.length >= 2 && formatted.length < 4) {
            formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
        } else if (formatted.length >= 4 && formatted.length < 6) {
            formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4);
        } else if (formatted.length >= 6) {
            formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4, 8);
        }

        setTempDate(formatted);

        if (formatted.length === 10) {
            const [day, month, year] = formatted.split('/');
            if (day && month && year && day >= 1 && day <= 31 && month >= 1 && month <= 12 && year.length === 4) {
                const storageDate = `${year}-${month}-${day}`;
                setInvoice(prev => ({ ...prev, invoice_date: storageDate }));
            }
        }
    };

    const handleDateBlur = () => {
        if (tempDate.length === 10) {
            const [day, month, year] = tempDate.split('/');
            if (day && month && year && day >= 1 && day <= 31 && month >= 1 && month <= 12 && year.length === 4) {
                const storageDate = `${year}-${month}-${day}`;
                setInvoice(prev => ({ ...prev, invoice_date: storageDate }));
            } else {
                const currentDate = new Date();
                const storageDate = currentDate.toISOString().split('T')[0];
                setInvoice(prev => ({ ...prev, invoice_date: storageDate }));
                setTempDate(formatDateForDisplay(storageDate));
                toast.error('Invalid date format. Using current date.');
            }
        } else if (tempDate) {
            const currentDate = new Date();
            const storageDate = currentDate.toISOString().split('T')[0];
            setInvoice(prev => ({ ...prev, invoice_date: storageDate }));
            setTempDate(formatDateForDisplay(storageDate));
            toast.error('Invalid date. Using current date.');
        }
        setShowDatePicker(false);
    };

    const handleDateFocus = () => {
        setTempDate(formatDateForDisplay(invoice.invoice_date));
        setShowDatePicker(true);
    };

    const handleNew = async () => {
        setIsEditMode(false);
        setCurrentInvoiceId(null);
        const currentDate = new Date();
        const storageDate = currentDate.toISOString().split('T')[0];

        const nextNumber = await getNextVoucherNumber();
        const newVoucherId = generateVoucherIdSync(nextNumber);

        const newItemId = Date.now();
        const initialItemId = cachedItem ? cachedItem.item_id.toString() : '';
        const initialItemName = cachedItem ? cachedItem.item_name : '';
        const initialRate = cachedItem ? (cachedItem.price || 0) : 0;

        const newItem = {
            id: newItemId,
            item_id: initialItemId,
            item_name: initialItemName,
            item_name_urdu: cachedItem?.item_name_urdu || '',
            quantity: 0,
            unit: 'Pcs',
            rate: initialRate,
            amount: initialRate,
            isNew: !cachedItem
        };

        const newInvoice = {
            voucher_id: newVoucherId,
            invoice_date: storageDate,
            order_no: '',
            account_id: '',
            customer_name: '',
            notes: '',
            items: [newItem],
            total_weight: 0,
            total_amount: 0
        };

        setInvoice(newInvoice);
        invoiceRef.current = newInvoice;

        setRowCustomers({});
        rowCustomersRef.current = {};
        setEditingItemId(newItemId);
        setTempItem({
            id: newItemId,
            item_id: initialItemId,
            item_name: initialItemName,
            quantity: 0,
            rate: initialRate,
            amount: initialRate,
            searchTerm: ''
        });

        if (cachedItem) {
            setShowItemDropdown(null);
            setEditingCustomerRow(newItemId);
            setShowCustomerDropdown(true);
            setTimeout(() => {
                const customerInput = customerInputRefs.current[newItemId];
                if (customerInput) {
                    customerInput.focus();
                }
            }, 100);
        } else {
            setShowItemDropdown(newItemId);
            setTimeout(() => {
                const input = document.querySelector(`[data-row-id="${newItemId}"]`);
                if (input) input.focus();
            }, 100);
        }

        setShowDatePicker(false);
        setTempDate(formatDateForDisplay(storageDate));
        setCurrentEditingRow(newItemId);
        toast.success('New invoice form ready');
    };

    const handleAddNewRow = () => {
        const newItemId = Date.now();

        const itemId = cachedItem ? cachedItem.item_id.toString() : '';
        const itemName = cachedItem ? cachedItem.item_name : '';
        const itemNameUrdu = cachedItem ? cachedItem.item_name_urdu : '';
        const rate = cachedItem ? (cachedItem.price || 0) : 0;
        const amount = cachedItem ? (cachedItem.price || 0) : 0;

        const newItem = {
            id: newItemId,
            item_id: itemId,
            item_name: itemName,
            item_name_urdu: itemNameUrdu,
            quantity: 0,
            unit: 'Pcs',
            rate: rate,
            amount: amount,
            isNew: !cachedItem
        };

        // Add new row at the TOP of the list
        setInvoice(prev => {
            const updatedItems = [newItem, ...prev.items];
            const newInvoice = { ...prev, items: updatedItems };
            invoiceRef.current = newInvoice;
            return newInvoice;
        });

        setCurrentEditingRow(newItemId);
        setEditingItemId(newItemId);
        setTempItem({
            id: newItemId,
            item_id: itemId,
            item_name: itemName,
            quantity: 0,
            rate: rate,
            amount: amount,
            searchTerm: ''
        });

        if (cachedItem) {
            setShowItemDropdown(null);
            setEditingCustomerRow(newItemId);
            setShowCustomerDropdown(true);
            setTimeout(() => {
                const customerInput = customerInputRefs.current[newItemId];
                if (customerInput) {
                    customerInput.focus();
                }
            }, 100);
        } else {
            setShowItemDropdown(newItemId);
            setTimeout(() => {
                const input = document.querySelector(`[data-row-id="${newItemId}"]`);
                if (input) input.focus();
            }, 100);
        }
    };

    const handleUpdateItem = (itemId) => {
        if (!tempItem || !tempItem.item_id) {
            toast.error('Please select an item');
            return;
        }

        if (tempItem.quantity <= 0) {
            toast.error('Quantity must be greater than 0');
            return;
        }

        if (tempItem.rate <= 0) {
            toast.error('Rate must be greater than 0');
            return;
        }

        const amount = tempItem.quantity * tempItem.rate;
        const product = products.find(p => p.item_id === parseInt(tempItem.item_id));

        if (product) {
            setCachedItem({
                item_id: product.item_id,
                item_name: product.item_name,
                item_name_urdu: product.item_name_urdu,
                price: tempItem.rate
            });
        }

        // Find the item and update it, then move it to the top
        setInvoice(prev => {
            // Find the item to update
            let updatedItems = prev.items.map(item => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        item_id: tempItem.item_id,
                        item_name: tempItem.item_name,
                        item_name_urdu: product?.item_name_urdu || '',
                        quantity: tempItem.quantity,
                        rate: tempItem.rate,
                        amount: amount,
                        isNew: false
                    };
                }
                return item;
            });

            // Find the updated item and move it to the top
            const updatedItemIndex = updatedItems.findIndex(item => item.id === itemId);
            if (updatedItemIndex !== -1) {
                const [updatedItem] = updatedItems.splice(updatedItemIndex, 1);
                updatedItems = [updatedItem, ...updatedItems];
            }

            const newInvoice = { ...prev, items: updatedItems };
            invoiceRef.current = newInvoice;
            return newInvoice;
        });

        setEditingItemId(null);
        setTempItem(null);
        setShowItemDropdown(null);
        toast.success('Item added successfully');

        // Add a new empty row at the top
        const newItemId = Date.now();
        const newItem = {
            id: newItemId,
            item_id: cachedItem ? cachedItem.item_id.toString() : '',
            item_name: cachedItem ? cachedItem.item_name : '',
            item_name_urdu: cachedItem?.item_name_urdu || '',
            quantity: 0,
            unit: 'Pcs',
            rate: cachedItem ? (cachedItem.price || 0) : 0,
            amount: cachedItem ? (cachedItem.price || 0) : 0,
            isNew: false
        };

        setInvoice(prev => {
            // Add new row at the top
            const updatedItems = [newItem, ...prev.items];
            const newInvoice = { ...prev, items: updatedItems };
            invoiceRef.current = newInvoice;
            return newInvoice;
        });

        setEditingItemId(newItemId);
        setTempItem({
            id: newItemId,
            item_id: cachedItem ? cachedItem.item_id.toString() : '',
            item_name: cachedItem ? cachedItem.item_name : '',
            quantity: 0,
            rate: cachedItem ? (cachedItem.price || 0) : 0,
            amount: cachedItem ? (cachedItem.price || 0) : 0,
            searchTerm: ''
        });

        if (cachedItem) {
            setShowItemDropdown(null);
            setEditingCustomerRow(newItemId);
            setShowCustomerDropdown(true);
            setTimeout(() => {
                const customerInput = customerInputRefs.current[newItemId];
                if (customerInput) {
                    customerInput.focus();
                }
            }, 100);
        } else {
            setShowItemDropdown(newItemId);
            setTimeout(() => {
                const input = document.querySelector(`[data-row-id="${newItemId}"]`);
                if (input) input.focus();
            }, 100);
        }
    };

    const handleEditItem = (item) => {
        setEditingItemId(item.id);
        setEditingCustomerRow(null);
        setShowCustomerDropdown(false);
        setCurrentEditingRow(item.id);
        setTempItem({
            id: item.id,
            item_id: item.item_id.toString(),
            item_name: item.item_name,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
            searchTerm: ''
        });
        setShowItemDropdown(item.id);
        setTimeout(() => {
            const input = document.querySelector(`[data-row-id="${item.id}"]`);
            if (input) input.focus();
        }, 100);
    };

    const handleEditCustomer = (rowId) => {
        setEditingCustomerRow(rowId);
        setShowCustomerDropdown(true);
        setTimeout(() => {
            const input = customerInputRefs.current[rowId];
            if (input) input.focus();
        }, 100);
    };

    const handleRemoveItem = (itemId) => {
        if (invoice.items.length === 1) {
            toast.error('At least one item row is required');
            return;
        }

        setInvoice(prev => {
            const updatedItems = prev.items.filter(item => item.id !== itemId);
            const newInvoice = { ...prev, items: updatedItems };
            invoiceRef.current = newInvoice;
            return newInvoice;
        });
        setRowCustomers(prev => {
            const newState = { ...prev };
            delete newState[itemId];
            rowCustomersRef.current = newState;
            return newState;
        });

        if (editingItemId === itemId) {
            setEditingItemId(null);
            setTempItem(null);
            setShowItemDropdown(null);
        }
        toast.success('Item removed');
        setTimeout(() => addItemRowButtonRef.current?.focus(), 100);
    };

    const handleCancelEdit = () => {
        const emptyNewRows = invoice.items.filter(item => item.isNew && !item.item_id);
        if (emptyNewRows.length > 0 && invoice.items.length > 1) {
            setInvoice(prev => {
                const updatedItems = prev.items.filter(item => !(item.isNew && !item.item_id));
                const newInvoice = { ...prev, items: updatedItems };
                invoiceRef.current = newInvoice;
                return newInvoice;
            });
        }
        setEditingItemId(null);
        setEditingCustomerRow(null);
        setTempItem(null);
        setShowItemDropdown(null);
        setShowCustomerDropdown(false);
        setTimeout(() => addItemRowButtonRef.current?.focus(), 100);
    };

    const calculateTotals = () => {
        const validItems = getValidItems();
        const totalWeight = validItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalAmount = validItems.reduce((sum, item) => sum + (item.amount || 0), 0);
        setInvoice(prev => ({ ...prev, total_weight: totalWeight, total_amount: totalAmount }));
    };

    const handleSave = async () => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            const validItems = getValidItems();

            if (validItems.length === 0) {
                toast.error('Please add at least one valid item');
                setIsSaving(false);
                return;
            }

            const itemsWithoutCustomer = validItems.filter(item => {
                const customer = getItemCustomer(item.id);
                return !customer || customer.trim() === '';
            });
            
            if (itemsWithoutCustomer.length > 0) {
                toast.error(`Please add customer for: ${itemsWithoutCustomer.map(i => i.item_name).join(', ')}`);
                setIsSaving(false);
                return;
            }

            // Prepare items with customer information - each item keeps its own customer
            const itemsWithCustomers = validItems.map(item => {
                const customerObj = getItemCustomerObject(item.id);
                return {
                    item_id: parseInt(item.item_id),
                    item_name: item.item_name,
                    item_name_urdu: item.item_name_urdu || '',
                    quantity: item.quantity,
                    unit: item.unit || 'Pcs',
                    rate: item.rate,
                    amount: item.amount,
                    customer_name: customerObj.name,
                    customer_name_urdu: customerObj.nameUrdu || ''
                };
            });

            const totalWeight = validItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = validItems.reduce((sum, item) => sum + item.amount, 0);

            // Use refs to get latest values
            const isEdit = isEditModeRef.current;
            const invoiceId = currentInvoiceIdRef.current;

            if (isEdit === true && invoiceId !== null && invoiceId !== undefined) {
                // UPDATE EXISTING INVOICE - Keep the same voucher_id and invoice_id
                const invoiceToUpdate = {
                    invoice_id: invoiceId,
                    voucher_id: invoiceRef.current.voucher_id,
                    invoice_date: invoiceRef.current.invoice_date,
                    order_no: invoiceRef.current.order_no,
                    notes: invoiceRef.current.notes,
                    total_weight: totalWeight,
                    total_amount: totalAmount,
                    discount: 0,
                    net_amount: totalAmount,
                    items: itemsWithCustomers
                };

                await window.electron.database.updateInvoice(invoiceToUpdate);
                toast.success('Invoice updated successfully');
                navigate('/invoices');
            } else {
                // CREATE NEW INVOICE - Generate new voucher number
                let currentMaxNumber = lastVoucherNumber;
                if (currentMaxNumber === 0) {
                    const invoices = await window.electron.database.getInvoices();
                    let maxNumber = 0;
                    invoices.forEach(inv => {
                        const match = inv.voucher_id.match(/S-(\d+)/);
                        if (match) {
                            const num = parseInt(match[1]);
                            if (num > maxNumber) maxNumber = num;
                        }
                    });
                    currentMaxNumber = maxNumber;
                }

                currentMaxNumber++;
                const voucherId = generateVoucherIdSync(currentMaxNumber);
                setLastVoucherNumber(currentMaxNumber);

                const invoiceToSave = {
                    voucher_id: voucherId,
                    invoice_date: invoiceRef.current.invoice_date,
                    order_no: invoiceRef.current.order_no,
                    notes: invoiceRef.current.notes,
                    total_weight: totalWeight,
                    total_amount: totalAmount,
                    discount: 0,
                    net_amount: totalAmount,
                    items: itemsWithCustomers
                };

                await window.electron.database.createInvoice(invoiceToSave);
                toast.success('Invoice saved successfully');
                handleNew();
            }
        } catch (error) {
            console.error('Failed to save invoice:', error);
            toast.error('Failed to save invoice: ' + (error.message || 'Unknown error'));
        } finally {
            setIsSaving(false);
        }
    };

    const generateInvoiceHTML = () => {
        const validItems = getValidItems();
        const formattedDate = formatDateForDisplay(invoice.invoice_date);
        const voucherId = invoice.voucher_id;

        // Group items by customer for display within the same invoice
        const itemsByCustomer = {};
        validItems.forEach(item => {
            const customerName = getItemCustomer(item.id);
            if (!customerName) return;
            
            if (!itemsByCustomer[customerName]) {
                itemsByCustomer[customerName] = {
                    items: [],
                    nameUrdu: getItemCustomerObject(item.id).nameUrdu
                };
            }
            itemsByCustomer[customerName].items.push(item);
        });

        let customersHTML = '';
        let sectionIndex = 0;

        for (const [customerName, customerData] of Object.entries(itemsByCustomer)) {
            const items = customerData.items;
            const totalWeight = items.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
            
            customersHTML += `
                <div class="customer-section" style="margin-bottom: 30px; ${sectionIndex > 0 ? 'margin-top: 30px; border-top: 2px dashed #ccc; padding-top: 20px;' : ''}">
                    <div style="background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px; padding: 12px 15px; margin-bottom: 15px;">
                        <h3 style="color: #ff9800; margin-bottom: 8px; font-size: 14px;">BILL TO:</h3>
                        <p><strong>Customer Name:</strong> ${customerName}</p>
                        ${customerData.nameUrdu ? `<p style="font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif; font-size: 18px; direction: rtl;"><strong>نام:</strong> ${customerData.nameUrdu}</p>` : ''}
                    </div>
                    <table class="items-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="background: #4CAF50; color: white;">
                                <th style="padding: 10px; text-align: left;">#</th>
                                <th style="padding: 10px; text-align: left;">Item Description</th>
                                <th style="padding: 10px; text-align: right;">Quantity</th>
                                <th style="padding: 10px; text-align: right;">Rate (₨)</th>
                                <th style="padding: 10px; text-align: right;">Amount (₨)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map((item, idx) => `
                                <tr style="border-bottom: 1px solid #e0e0e0;">
                                    <td style="padding: 8px 10px; text-align: center;">${idx + 1}</td>
                                    <td style="padding: 8px 10px;">
                                        <strong>${item.item_name}</strong>
                                        ${item.item_name_urdu ? `<br><small style="color: #666; direction: rtl; font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif; font-size: 14px;">${item.item_name_urdu}</small>` : ''}
                                    </td>
                                    <td style="padding: 8px 10px; text-align: right;">${item.quantity}</td>
                                    <td style="padding: 8px 10px; text-align: right;"> ${item.rate.toLocaleString()}</td>
                                    <td style="padding: 8px 10px; text-align: right;"> ${item.amount.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                            <tr style="background: #f5f5f5;">
                                <td colspan="2" style="padding: 8px 10px;"><strong>Subtotal for ${customerName}</strong></td>
                                <td style="padding: 8px 10px; text-align: right;"><strong>${totalWeight}</strong></td>
                                <td style="padding: 8px 10px; text-align: right;"></td>
                                <td style="padding: 8px 10px; text-align: right;"><strong> ${totalAmount.toLocaleString()}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            sectionIndex++;
        }

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Invoice ${voucherId}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: white; color: #333; }
                    .invoice-container { max-width: 1100px; margin: 0 auto; background: white; }
                    .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #4CAF50; }
                    .company-name { font-size: 28px; font-weight: bold; color: #2c3e50; margin-bottom: 5px; }
                    .invoice-title { font-size: 24px; font-weight: bold; color: #4CAF50; margin-top: 10px; }
                    .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                    .details-section { flex: 1; }
                    .details-section p { margin: 8px 0; font-size: 12px; }
                    .details-section strong { color: #2c3e50; min-width: 80px; display: inline-block; }
                    .totals-section { margin-top: 20px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: right; }
                    .grand-total { font-size: 18px; font-weight: bold; color: #4CAF50; margin-top: 10px; padding-top: 10px; border-top: 2px solid #4CAF50; }
                    .footer { margin-top: 40px; padding-top: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 10px; color: #999; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <div class="company-name">INVENTORY MANAGEMENT SYSTEM</div>
                        <div class="invoice-title">SALE INVOICE</div>
                    </div>
                    <div class="invoice-details">
                        <div class="details-section">
                            <p><strong>Voucher No:</strong> ${voucherId}</p>
                            <p><strong>Invoice Date:</strong> ${formattedDate}</p>
                        </div>
                        <div class="details-section">
                            <p><strong>Ref No:</strong> ${invoice.order_no || 'N/A'}</p>
                            <p><strong>Print Date:</strong> ${formatDateForDisplay(new Date().toISOString().split('T')[0])}</p>
                        </div>
                    </div>
                    
                    ${customersHTML}
                    
                    <div class="totals-section">
                        <div class="grand-total"><strong>GRAND TOTAL:</strong>  ${invoice.total_amount.toLocaleString()}</div>
                    </div>
                    <div class="footer">
                        <p>Thank you for your business!</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    };

    const handlePrint = async () => {
        const validItems = getValidItems();
        if (validItems.length === 0) {
            toast.error('No items to print');
            return;
        }

        const itemsWithoutCustomer = validItems.filter(item => {
            const customer = getItemCustomer(item.id);
            return !customer || customer.trim() === '';
        });
        
        if (itemsWithoutCustomer.length > 0) {
            toast.error(`Please add customer for all items before printing`);
            return;
        }

        try {
            const html = generateInvoiceHTML();
            if (window.electron && window.electron.printToPDF) {
                const pdfPath = await window.electron.printToPDF(html);
                if (pdfPath) toast.success(`PDF saved successfully`);
                else toast.error('Print cancelled');
            } else {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.print();
                toast.success('Print dialog opened');
            }
        } catch (error) {
            console.error('Print error:', error);
            toast.error('Failed to generate PDF');
        }
    };

    const handleCustomerSelect = (account, rowId) => {
        setRowCustomers(prev => ({
            ...prev,
            [rowId]: {
                name: account.customer_name,
                nameUrdu: account.customer_name_urdu || '',
                mobile: account.mobile_number || ''
            }
        }));
        setShowCustomerDropdown(false);
        setEditingCustomerRow(null);
        setFilteredAccounts([]);

        if (editingItemId === rowId) {
            setTimeout(() => {
                const qtyInput = qtyInputRefs.current[rowId];
                if (qtyInput) {
                    qtyInput.focus();
                    qtyInput.select();
                }
            }, 100);
        }
    };

    const handleCustomerChange = (rowId, value) => {
        setRowCustomers(prev => ({
            ...prev,
            [rowId]: {
                name: value,
                nameUrdu: '',
                mobile: ''
            }
        }));
        setShowCustomerDropdown(true);
        setEditingCustomerRow(rowId);
    };

    const handleProductSelect = (product, itemId) => {
        setCachedItem({
            item_id: product.item_id,
            item_name: product.item_name,
            item_name_urdu: product.item_name_urdu,
            price: product.price || 0
        });

        setTempItem(prev => ({
            ...prev,
            item_id: product.item_id.toString(),
            item_name: product.item_name,
            item_name_urdu: product.item_name_urdu || '',
            rate: product.price || 0,
            amount: (prev?.quantity || 0) * (product.price || 0),
            searchTerm: ''
        }));
        setShowItemDropdown(null);

        setTimeout(() => {
            const customerInput = customerInputRefs.current[itemId];
            if (customerInput) {
                customerInput.focus();
            }
        }, 100);
    };

    const handleQuantityChange = (itemId, value) => {
        const quantity = parseFloat(value) || 0;
        const amount = quantity * (tempItem?.rate || 0);
        setTempItem(prev => ({ ...prev, quantity, amount }));
    };

    const handleRateChange = (itemId, value) => {
        const rate = parseFloat(value) || 0;
        const amount = (tempItem?.quantity || 0) * rate;

        if (tempItem?.item_id) {
            const product = products.find(p => p.item_id === parseInt(tempItem.item_id));
            if (product) {
                setCachedItem({
                    item_id: product.item_id,
                    item_name: product.item_name,
                    item_name_urdu: product.item_name_urdu,
                    price: rate
                });
            }
        }

        setTempItem(prev => ({ ...prev, rate, amount }));
    };

    const handleQuantityFocus = (e) => {
        e.target.select();
    };

    const handleRateFocus = (e) => {
        e.target.select();
    };

    const setupKeyboardShortcuts = () => {
        const handleGlobalKeyDown = (e) => {
            const isInputFocused = document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA';

            if (e.ctrlKey && e.altKey && e.key === 'n') {
                e.preventDefault();
                handleAddNewRow();
            } else if (e.ctrlKey && e.key === 'n' && !e.altKey && !isInputFocused) {
                e.preventDefault();
                handleNew();
            } else if ((e.ctrlKey && e.key === 's') || (e.ctrlKey && e.key === 'S')) {
                e.preventDefault();
                e.stopPropagation();
                // Directly call handleSave - it will use the refs to get latest state
                handleSave();
            } else if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                handlePrint();
            } else if (e.altKey && e.key === '1') {
                e.preventDefault();
                dateRef.current?.focus();
            } else if (e.altKey && e.key === '2') {
                e.preventDefault();
                orderNoRef.current?.focus();
            } else if (e.altKey && e.key === '3') {
                e.preventDefault();
                const firstItemSearch = document.querySelector('[data-item-search]');
                if (firstItemSearch) firstItemSearch.focus();
            } else if (e.altKey && e.key === '4') {
                e.preventDefault();
                notesRef.current?.focus();
            } else if (e.altKey && e.key === '6') {
                e.preventDefault();
                saveButtonRef.current?.focus();
            } else if (e.altKey && e.key === 'a') {
                e.preventDefault();
                addItemRowButtonRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        window._globalKeyDownHandler = handleGlobalKeyDown;
    };

    const cleanupKeyboardShortcuts = () => {
        if (window._globalKeyDownHandler) {
            window.removeEventListener('keydown', window._globalKeyDownHandler);
        }
    };

    const getDropdownPosition = (elementId) => {
        const element = document.querySelector(`[data-row-id="${elementId}"]`);
        if (element) {
            const rect = element.getBoundingClientRect();
            return { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX };
        }
        return { top: 0, left: 0 };
    };

    const DatePickerCalendar = () => {
        const [currentDate, setCurrentDate] = useState(() => {
            const parsed = parseDate(formatDateForDisplay(invoice.invoice_date));
            return parsed || new Date();
        });

        const getDaysInMonth = (date) => {
            const year = date.getFullYear();
            const month = date.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const days = [];
            for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
            for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
            return days;
        };

        const days = getDaysInMonth(currentDate);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const isSelectedDate = (date) => {
            if (!date) return false;
            const selectedDate = parseDate(formatDateForDisplay(invoice.invoice_date));
            return selectedDate && date.toDateString() === selectedDate.toDateString();
        };

        return (
            <div style={calendarStyles.container} ref={datePickerRef}>
                <div style={calendarStyles.header}>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} style={calendarStyles.navButton}>←</button>
                    <span style={calendarStyles.monthYear}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} style={calendarStyles.navButton}>→</button>
                </div>
                <div style={calendarStyles.weekdays}>{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} style={calendarStyles.weekday}>{day}</div>)}</div>
                <div style={calendarStyles.days}>
                    {days.map((date, idx) => (
                        <div key={idx} onClick={() => date && handleDateSelect(date)} style={{
                            ...calendarStyles.day,
                            ...(date ? calendarStyles.dayCell : {}),
                            ...(date && isSelectedDate(date) ? calendarStyles.selectedDay : {}),
                            ...(date && date.toDateString() === new Date().toDateString() ? calendarStyles.today : {})
                        }}>
                            {date ? date.getDate() : ''}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const calendarStyles = {
        container: { position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '12px', zIndex: 9999, marginTop: '4px', width: '280px' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
        navButton: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', color: '#666' },
        monthYear: { fontWeight: 'bold', fontSize: '14px' },
        weekdays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' },
        weekday: { textAlign: 'center', fontSize: '11px', color: '#666', padding: '4px' },
        days: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' },
        dayCell: { textAlign: 'center', padding: '6px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' },
        day: { color: '#333' },
        selectedDay: { background: '#4CAF50', color: 'white' },
        today: { border: '1px solid #4CAF50', fontWeight: 'bold' }
    };

    const styles = {
        container: { padding: '16px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' },
        headerTitle: { margin: 0, fontSize: '20px', fontWeight: '600' },
        buttonGroup: { display: 'flex', gap: '8px' },
        buttonPrimary: { padding: '6px 14px', background: 'white', color: '#667eea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
        buttonSuccess: { padding: '6px 14px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
        card: { background: 'white', borderRadius: '8px', padding: '16px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
        row: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
        formGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px' },
        label: { fontSize: '11px', fontWeight: '500', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
        input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
        inputWithIcon: { padding: '8px 12px', paddingRight: '32px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
        inputDisabled: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', background: '#f5f5f5', color: '#666', width: '100%', boxSizing: 'border-box' },
        textarea: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' },
        dropdown: { position: 'relative', width: '100%' },
        dropdownList: { position: 'fixed', maxHeight: '300px', overflowY: 'auto', background: 'white', border: '1px solid #ddd', borderRadius: '6px', zIndex: 10000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', minWidth: '300px' },
        dropdownItem: { padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '13px', transition: 'background 0.2s, color 0.2s' },
        table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
        tableHeader: { background: '#4CAF50', borderBottom: '2px solid #e0e0e0', fontWeight: '600' },
        tableCell: { padding: '10px 12px', textAlign: 'left', verticalAlign: 'top' },
        tableCellRight: { padding: '10px 12px', textAlign: 'right', verticalAlign: 'top' },
        tableCellCenter: { padding: '10px 12px', textAlign: 'center', verticalAlign: 'top', color: 'white' },
        actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', margin: '0 4px', borderRadius: '4px', fontSize: '14px' },
        totalsBar: { marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #e0e0e0', display: 'flex', justifyContent: 'flex-end', gap: '24px', alignItems: 'center', flexWrap: 'wrap' },
        statusBar: { marginTop: '16px', padding: '8px 12px', background: '#f5f5f5', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', flexWrap: 'wrap', gap: '8px' },
        addButton: { marginBottom: '12px', padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
        smallInput: { padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', textAlign: 'right', width: '100%', boxSizing: 'border-box' },
        dateInputWrapper: { position: 'relative', width: '100%' },
        calendarIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', cursor: 'pointer', fontSize: '16px' },
        customerDisplay: { padding: '8px 12px', background: '#f5f5f5', borderRadius: '6px', fontSize: '13px', color: '#333', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        editIcon: { color: '#2196F3', fontSize: '12px', marginLeft: '8px' }
    };

    const getCustomerGroups = () => {
        const grouped = groupItemsByCustomer();
        return Object.keys(grouped).map(customer => {
            let urduName = '';
            for (const item of grouped[customer]) {
                const customerData = rowCustomersRef.current[item.id];
                if (customerData && typeof customerData === 'object' && customerData.nameUrdu) {
                    urduName = customerData.nameUrdu;
                    break;
                }
            }
            return {
                customer,
                customerUrdu: urduName,
                items: grouped[customer],
                total: grouped[customer].reduce((sum, item) => sum + item.amount, 0)
            };
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.headerTitle}>{isEditMode ? '✏️ Edit Invoice' : '🧾 Sale Invoice'}</h1>
                <div style={styles.buttonGroup}>
                    <button onClick={handleNew} ref={newButtonRef} style={styles.buttonPrimary}><FiPlus size={14} /> New (Ctrl+N)</button>
                    <button onClick={handlePrint} disabled={getValidItems().length === 0} ref={printButtonRef} style={{ ...styles.buttonSuccess, opacity: getValidItems().length === 0 ? 0.5 : 1 }}><FiPrinter size={14} /> Print (Ctrl+P)</button>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.row}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Voucher ID (Preview)</label>
                        <input type="text" value={invoice.voucher_id} disabled style={styles.inputDisabled} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Date (Alt+1)</label>
                        <div style={styles.dateInputWrapper}>
                            <input ref={dateRef} type="text" placeholder="DD/MM/YYYY" value={tempDate || formatDateForDisplay(invoice.invoice_date)} onChange={handleDateInputChange} onFocus={handleDateFocus} onBlur={handleDateBlur} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); orderNoRef.current?.focus(); } }} style={styles.inputWithIcon} />
                            <FiCalendar style={styles.calendarIcon} onClick={() => setShowDatePicker(!showDatePicker)} />
                            {showDatePicker && <DatePickerCalendar />}
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Ref No. (Alt+2)</label>
                        <input
                            ref={orderNoRef}
                            type="text"
                            value={invoice.order_no}
                            onChange={(e) => setInvoice(prev => ({ ...prev, order_no: e.target.value }))}
                            placeholder="Reference"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const firstItemSearch = document.querySelector('[data-item-search]');
                                    if (firstItemSearch) firstItemSearch.focus();
                                }
                            }}
                            style={styles.input}
                        />
                    </div>
                </div>
            </div>

            <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><FiPackage size={16} /> Items</h3>
                    <button ref={addItemRowButtonRef} onClick={handleAddNewRow} style={styles.addButton} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNewRow(); } }}><FiPlus size={14} /> Add Item Row (Ctrl+Alt+N)</button>
                </div>

                <div style={{ overflowX: 'auto' }} ref={tableContainerRef}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={{ ...styles.tableHeader, background: '#4CAF50', color: 'white', borderBottom: '2px solid #e0e0e0', fontWeight: '600' }}>
                                <th style={{ ...styles.tableCell, color: 'white' }}>#</th>
                                <th style={{ ...styles.tableCell, color: 'white' }}>Item</th>
                                <th style={{ ...styles.tableCell, color: 'white' }}>Customer *</th>
                                <th style={{ ...styles.tableCellRight, color: 'white' }}>Qty</th>
                                <th style={{ ...styles.tableCellRight, color: 'white' }}>Rate</th>
                                <th style={{ ...styles.tableCellRight, color: 'white' }}>Amount</th>
                                <th style={{ ...styles.tableCellCenter, color: 'white' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => {
                                const isEditing = editingItemId === item.id;
                                const validItem = item.item_id && item.quantity > 0;
                                const currentCustomer = rowCustomers[item.id] || '';

                                if (isEditing && tempItem) {
                                    const dropdownPosition = getDropdownPosition(item.id);
                                    return (
                                        <tr key={item.id} style={{ background: '#f9f9f9', borderTop: '2px solid #2196F3' }} data-item-row>
                                            <td style={styles.tableCell}>{index + 1}</td>
                                            <td style={styles.tableCell}>
                                                <div style={styles.dropdown}>
                                                    <div style={{ position: 'relative' }}>
                                                        <FiSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '14px' }} />
                                                        <input
                                                            ref={el => itemInputRefs.current[item.id] = el}
                                                            data-row-id={item.id}
                                                            data-item-search
                                                            type="text"
                                                            placeholder="Search item by name or code..."
                                                            value={tempItem.searchTerm || ''}
                                                            onChange={(e) => { setTempItem(prev => ({ ...prev, searchTerm: e.target.value })); setShowItemDropdown(item.id); }}
                                                            onFocus={() => setShowItemDropdown(item.id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'ArrowDown' && showItemDropdown === item.id && filteredProducts.length > 0) {
                                                                    e.preventDefault();
                                                                    setFocusedDropdownIndex(prev => prev < filteredProducts.length - 1 ? prev + 1 : 0);
                                                                } else if (e.key === 'ArrowUp' && showItemDropdown === item.id && focusedDropdownIndex > 0) {
                                                                    e.preventDefault();
                                                                    setFocusedDropdownIndex(prev => prev - 1);
                                                                } else if (e.key === 'Escape') {
                                                                    setShowItemDropdown(null);
                                                                } else if (e.key === 'Enter' && showItemDropdown === item.id && focusedDropdownIndex >= 0) {
                                                                    e.preventDefault();
                                                                    const selected = filteredProducts[focusedDropdownIndex];
                                                                    if (selected) handleProductSelect(selected, item.id);
                                                                }
                                                            }}
                                                            style={{ ...styles.input, paddingLeft: '32px' }}
                                                        />
                                                    </div>
                                                    {showItemDropdown === item.id && filteredProducts.length > 0 && (
                                                        <div ref={el => itemDropdownRefs.current[item.id] = el} style={{ ...styles.dropdownList, position: 'fixed', top: dropdownPosition.top, left: dropdownPosition.left, width: '300px' }}>
                                                            {filteredProducts.map((product, idx) => (
                                                                <div 
                                                                    key={product.item_id} 
                                                                    onClick={() => handleProductSelect(product, item.id)} 
                                                                    style={{ 
                                                                        ...styles.dropdownItem, 
                                                                        backgroundColor: focusedDropdownIndex === idx ? '#2196F3' : 'white',
                                                                        color: focusedDropdownIndex === idx ? 'white' : '#333'
                                                                    }} 
                                                                    onMouseEnter={() => setFocusedDropdownIndex(idx)}
                                                                >
                                                                    <div>
                                                                        <strong style={{ color: focusedDropdownIndex === idx ? 'white' : '#333' }}>{product.item_name}</strong>
                                                                    </div>
                                                                    {product.item_name_urdu && (
                                                                        <div style={{ 
                                                                            fontSize: '12px', 
                                                                            color: focusedDropdownIndex === idx ? '#e0e0e0' : '#666', 
                                                                            fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif", 
                                                                            direction: 'rtl' 
                                                                        }}>
                                                                            {product.item_name_urdu}
                                                                        </div>
                                                                    )}
                                                                    <small style={{ color: focusedDropdownIndex === idx ? '#e0e0e0' : '#666' }}>
                                                                        Code: {product.item_code} | ₨ {product.price?.toLocaleString()}
                                                                    </small>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {tempItem.item_name && <div style={{ marginTop: '4px', fontSize: '11px', color: '#4CAF50' }}>✓ {tempItem.item_name}</div>}
                                            </td>
                                            <td style={styles.tableCell}>
                                                <div style={styles.dropdown}>
                                                    <input
                                                        ref={el => customerInputRefs.current[item.id] = el}
                                                        data-customer-edit={item.id}
                                                        type="text"
                                                        placeholder="Search customer..."
                                                        value={typeof currentCustomer === 'object' ? currentCustomer.name : currentCustomer}
                                                        onChange={(e) => handleCustomerChange(item.id, e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'ArrowDown' && showCustomerDropdown && filteredAccounts.length > 0) {
                                                                e.preventDefault();
                                                                setFocusedCustomerIndex(prev => prev < filteredAccounts.length - 1 ? prev + 1 : 0);
                                                            } else if (e.key === 'ArrowUp' && showCustomerDropdown && focusedCustomerIndex > 0) {
                                                                e.preventDefault();
                                                                setFocusedCustomerIndex(prev => prev - 1);
                                                            } else if (e.key === 'Enter' && showCustomerDropdown && focusedCustomerIndex >= 0) {
                                                                e.preventDefault();
                                                                const selected = filteredAccounts[focusedCustomerIndex];
                                                                if (selected) handleCustomerSelect(selected, item.id);
                                                            } else if (e.key === 'Enter' && !showCustomerDropdown && (typeof currentCustomer === 'object' ? currentCustomer.name : currentCustomer).trim()) {
                                                                e.preventDefault();
                                                                setShowCustomerDropdown(false);
                                                                setEditingCustomerRow(null);
                                                                setTimeout(() => {
                                                                    const qtyInput = qtyInputRefs.current[item.id];
                                                                    if (qtyInput) qtyInput.focus();
                                                                }, 50);
                                                            } else if (e.key === 'Escape') {
                                                                setShowCustomerDropdown(false);
                                                                setEditingCustomerRow(null);
                                                            }
                                                        }}
                                                        style={styles.input}
                                                    />
                                                    {showCustomerDropdown && editingCustomerRow === item.id && filteredAccounts.length > 0 && (
                                                        <div ref={customerDropdownRef} style={{ ...styles.dropdownList, position: 'fixed', top: (customerInputRefs.current[item.id]?.getBoundingClientRect().bottom + window.scrollY) || 0, left: (customerInputRefs.current[item.id]?.getBoundingClientRect().left + window.scrollX) || 0, width: '300px' }}>
                                                            {filteredAccounts.map((account, idx) => (
                                                                <div 
                                                                    key={account.account_id} 
                                                                    onClick={() => handleCustomerSelect(account, item.id)} 
                                                                    style={{ 
                                                                        ...styles.dropdownItem, 
                                                                        backgroundColor: focusedCustomerIndex === idx ? '#2196F3' : 'white',
                                                                        color: focusedCustomerIndex === idx ? 'white' : '#333'
                                                                    }} 
                                                                    onMouseEnter={() => setFocusedCustomerIndex(idx)}
                                                                >
                                                                    <div>
                                                                        <strong style={{ color: focusedCustomerIndex === idx ? 'white' : '#333' }}>{account.customer_name}</strong>
                                                                        {account.customer_name_urdu && (
                                                                            <div style={{ 
                                                                                fontSize: '13px', 
                                                                                color: focusedCustomerIndex === idx ? '#e0e0e0' : '#666', 
                                                                                fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif", 
                                                                                marginTop: '2px', 
                                                                                direction: 'rtl' 
                                                                            }}>
                                                                                {account.customer_name_urdu}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {account.mobile_number && (
                                                                        <small style={{ color: focusedCustomerIndex === idx ? '#e0e0e0' : '#666' }}>
                                                                            {account.mobile_number}
                                                                        </small>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={styles.tableCellRight}>
                                                <input
                                                    ref={el => qtyInputRefs.current[item.id] = el}
                                                    data-qty-input={item.id}
                                                    type="number"
                                                    value={tempItem.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                    onFocus={handleQuantityFocus}
                                                    min="0"
                                                    step="1"
                                                    style={styles.smallInput}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const rateInput = rateInputRefs.current[item.id];
                                                            if (rateInput) rateInput.focus();
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td style={styles.tableCellRight}>
                                                <input
                                                    ref={el => rateInputRefs.current[item.id] = el}
                                                    data-rate-input={item.id}
                                                    type="number"
                                                    value={tempItem.rate}
                                                    onChange={(e) => handleRateChange(item.id, e.target.value)}
                                                    onFocus={handleRateFocus}
                                                    min="0"
                                                    step="0.01"
                                                    style={styles.smallInput}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleUpdateItem(item.id);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td style={styles.tableCellRight}><strong> {tempItem.amount.toLocaleString()}</strong></td>
                                            <td style={styles.tableCellCenter}>
                                                <button onClick={() => handleUpdateItem(item.id)} style={{ ...styles.actionButton, color: '#4CAF50' }}><FiCheck size={14} /></button>
                                                <button onClick={handleCancelEdit} style={{ ...styles.actionButton, color: '#f44336' }}><FiX size={14} /></button>
                                            </td>
                                        </tr>
                                    );
                                }

                                return (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #eee', opacity: validItem ? 1 : 0.6 }} data-item-row>
                                        <td style={styles.tableCell}>{index + 1}</td>
                                        <td style={{ ...styles.tableCell }}>
                                            {item.item_name ? <><strong>{item.item_name}</strong>{item.item_name_urdu && <div style={{ fontSize: '14px', color: '#666', fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif", direction: 'rtl', marginTop: '4px' }}>{item.item_name_urdu}</div>}</> : <span style={{ color: '#999', fontStyle: 'italic' }}>Click edit to select item</span>}
                                        </td>
                                        <td style={styles.tableCell}>
                                            {editingCustomerRow === item.id ? (
                                                <div style={styles.dropdown}>
                                                    <input
                                                        ref={el => customerInputRefs.current[item.id] = el}
                                                        data-customer-edit={item.id}
                                                        type="text"
                                                        placeholder="Search customer..."
                                                        value={typeof currentCustomer === 'object' ? currentCustomer.name : currentCustomer}
                                                        onChange={(e) => handleCustomerChange(item.id, e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'ArrowDown' && showCustomerDropdown && filteredAccounts.length > 0) {
                                                                e.preventDefault();
                                                                setFocusedCustomerIndex(prev => prev < filteredAccounts.length - 1 ? prev + 1 : 0);
                                                            } else if (e.key === 'ArrowUp' && showCustomerDropdown && focusedCustomerIndex > 0) {
                                                                e.preventDefault();
                                                                setFocusedCustomerIndex(prev => prev - 1);
                                                            } else if (e.key === 'Enter' && showCustomerDropdown && focusedCustomerIndex >= 0) {
                                                                e.preventDefault();
                                                                const selected = filteredAccounts[focusedCustomerIndex];
                                                                if (selected) handleCustomerSelect(selected, item.id);
                                                            } else if (e.key === 'Enter' && !showCustomerDropdown && (typeof currentCustomer === 'object' ? currentCustomer.name : currentCustomer).trim()) {
                                                                e.preventDefault();
                                                                setShowCustomerDropdown(false);
                                                                setEditingCustomerRow(null);
                                                                setTimeout(() => {
                                                                    const editBtn = document.querySelector(`[data-edit-btn="${item.id}"]`);
                                                                    if (editBtn) editBtn.focus();
                                                                }, 50);
                                                            } else if (e.key === 'Escape') {
                                                                setShowCustomerDropdown(false);
                                                                setEditingCustomerRow(null);
                                                            }
                                                        }}
                                                        style={styles.input}
                                                    />
                                                    {showCustomerDropdown && editingCustomerRow === item.id && filteredAccounts.length > 0 && (
                                                        <div ref={customerDropdownRef} style={{ ...styles.dropdownList, position: 'fixed', top: (customerInputRefs.current[item.id]?.getBoundingClientRect().bottom + window.scrollY) || 0, left: (customerInputRefs.current[item.id]?.getBoundingClientRect().left + window.scrollX) || 0, width: '300px' }}>
                                                            {filteredAccounts.map((account, idx) => (
                                                                <div 
                                                                    key={account.account_id} 
                                                                    onClick={() => handleCustomerSelect(account, item.id)} 
                                                                    style={{ 
                                                                        ...styles.dropdownItem, 
                                                                        backgroundColor: focusedCustomerIndex === idx ? '#2196F3' : 'white',
                                                                        color: focusedCustomerIndex === idx ? 'white' : '#333'
                                                                    }} 
                                                                    onMouseEnter={() => setFocusedCustomerIndex(idx)}
                                                                >
                                                                    <div>
                                                                        <strong style={{ color: focusedCustomerIndex === idx ? 'white' : '#333' }}>{account.customer_name}</strong>
                                                                        {account.customer_name_urdu && (
                                                                            <div style={{ 
                                                                                fontSize: '11px', 
                                                                                color: focusedCustomerIndex === idx ? '#e0e0e0' : '#666', 
                                                                                fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif", 
                                                                                marginTop: '2px', 
                                                                                direction: 'rtl' 
                                                                            }}>
                                                                                {account.customer_name_urdu}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {account.mobile_number && (
                                                                        <small style={{ color: focusedCustomerIndex === idx ? '#e0e0e0' : '#666' }}>
                                                                            {account.mobile_number}
                                                                        </small>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={styles.customerDisplay} onClick={() => handleEditCustomer(item.id)} onKeyDown={(e) => { if (e.key === 'Enter') handleEditCustomer(item.id); }} tabIndex={0} data-customer-edit-btn={item.id}>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold' }}>
                                                            {currentCustomer ? (typeof currentCustomer === 'object' ? currentCustomer.name : currentCustomer) : <span style={{ color: '#999' }}>Click to add customer</span>}
                                                        </div>
                                                        {currentCustomer && typeof currentCustomer === 'object' && currentCustomer.nameUrdu && (
                                                            <div style={{ fontSize: '14px', color: '#666', fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif", marginTop: '2px', direction: 'rtl' }}>
                                                                {currentCustomer.nameUrdu}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <FiEdit2 style={styles.editIcon} size={12} />
                                                </div>
                                            )}
                                        </td>
                                        <td style={{...styles.tableCellRight,fontSize:"16px"}}>{item.quantity || 0}</td>
                                        <td style={{...styles.tableCellRight,fontSize:"16px"}}>{item.rate ? ` ${item.rate.toLocaleString()}` : '-'}</td>
                                        <td style={{...styles.tableCellRight,fontSize:"16px"}}>{item.amount ? ` ${item.amount.toLocaleString()}` : '-'}</td>
                                        <td style={styles.tableCellCenter}>
                                            <button data-edit-btn={item.id} onClick={() => handleEditItem(item)} style={{ ...styles.actionButton, color: '#2196F3' }}><FiEdit2 size={14} /></button>
                                            <button onClick={() => handleRemoveItem(item.id)} style={{ ...styles.actionButton, color: '#f44336' }} disabled={invoice.items.length === 1}><FiTrash2 size={14} /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div style={styles.totalsBar}>
                    <div><span style={{ color: '#666' }}>Total Quantity:</span><strong style={{ marginLeft: '8px' }}>{invoice.total_weight}</strong></div>
                    <div><span style={{ color: '#666' }}>Total Amount:</span><strong style={{ marginLeft: '8px', color: '#4CAF50' }}>{invoice.total_amount.toLocaleString()}</strong></div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                {isEditMode && (
                    <button onClick={() => navigate('/invoices')} style={{ ...styles.buttonPrimary, background: '#666', color: 'white' }}>
                        Cancel Edit
                    </button>
                )}
                <button ref={saveButtonRef} onClick={handleSave} disabled={isSaving} style={{ ...styles.buttonSuccess, padding: '10px 28px', fontSize: '14px', opacity: isSaving ? 0.5 : 1 }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } }}>
                    <FiSave size={16} /> {isSaving ? 'Saving...' : (isEditMode ? 'Update Invoice' : 'Save Invoice (Ctrl+S)')} 
                </button>
            </div>

            <div style={styles.statusBar}>
                <span>📄 Valid Items: {getValidItems().length} / Total: {invoice.items.length}</span>
                <span>👤 Customers: {Object.keys(rowCustomers).filter(key => {
                    const cust = rowCustomers[key];
                    return cust && (typeof cust === 'object' ? cust.name : cust);
                }).length} assigned</span>
                <span>⌨️ Shortcuts: Ctrl+N New | Ctrl+S Save | Ctrl+P Print | Ctrl+Alt+N Add Row | Alt+1-6 Quick Focus | ↑↓ Navigate Dropdowns | Enter Select</span>
                {cachedItem && <span>💾 Cached: {cachedItem.item_name} @ ₨{cachedItem.price}</span>}
            </div>
        </div>
    );
}

export default InvoiceManagement;