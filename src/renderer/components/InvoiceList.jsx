import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiEye, FiPrinter, FiTrash2, FiCalendar, FiEdit, FiSearch, FiPlus, FiFileText, FiDownload } from 'react-icons/fi';
import { NavigationContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

function InvoiceList() {
    const navigate = useNavigate();
    const { goBack } = useContext(NavigationContext);
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState({});

    useEffect(() => {
        loadInvoices();
    }, []);

    useEffect(() => {
        filterInvoices();
    }, [invoices, startDate, endDate, searchTerm]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
                event.preventDefault();
                navigate('/invoices/new');
                toast.success('Opening new invoice form...');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [navigate]);

    const loadInvoices = async () => {
        try {
            const data = await window.electron.database.getInvoices();
            setInvoices(data || []);
            console.log("data",data)
            // Load details for each invoice to get customer information
            for (const invoice of (data || [])) {
                const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
                console.log("details",details)
                setInvoiceDetails(prev => ({
                    ...prev,
                    [invoice.invoice_id]: details
                }));
            }

        } catch (error) {
            console.error('Failed to load invoices:', error);
            toast.error('Failed to load invoices');
        }
    };

    const handleEdit = (invoice) => {
        console.log("invoice",invoice)
        navigate('/invoices/edit', { state: { invoice } });
    };

    const filterInvoices = () => {
        let filtered = [...invoices];

        filtered = filtered.filter(inv => {
            const invDate = inv.invoice_date;
            return invDate >= startDate && invDate <= endDate;
        });

        if (searchTerm.trim()) {
            filtered = filtered.filter(inv =>
                inv.voucher_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.order_no?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredInvoices(filtered);
    };

    const handleViewDetails = async (invoice) => {
        try {
            const details = invoiceDetails[invoice.invoice_id] || await window.electron.database.getInvoiceDetails(invoice.invoice_id);
            setSelectedInvoice({ ...invoice, details });
            setShowDetails(true);
        } catch (error) {
            console.error('Failed to load invoice details:', error);
            toast.error('Failed to load invoice details');
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

    // Convert UTC datetime string to Pakistan Time (UTC+5)
    const convertToPakistanTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        
        try {
            // Parse the datetime string as UTC
            // Format: "2026-04-08 11:05:34"
            let year, month, day, hour, minute, second;
            
            if (typeof dateTimeString === 'string') {
                // Check if it has date and time parts
                const parts = dateTimeString.split(' ');
                const dateParts = parts[0].split('-');
                const timeParts = parts[1] ? parts[1].split(':') : ['00', '00', '00'];
                
                year = parseInt(dateParts[0]);
                month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
                day = parseInt(dateParts[2]);
                hour = parseInt(timeParts[0]);
                minute = parseInt(timeParts[1]);
                second = parseInt(timeParts[2]) || 0;
            } else if (dateTimeString instanceof Date) {
                year = dateTimeString.getUTCFullYear();
                month = dateTimeString.getUTCMonth();
                day = dateTimeString.getUTCDate();
                hour = dateTimeString.getUTCHours();
                minute = dateTimeString.getUTCMinutes();
                second = dateTimeString.getUTCSeconds();
            } else {
                return '';
            }
            
            // Create UTC date
            const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second));
            
            // Pakistan is UTC+5 (no daylight saving)
            const pakistanTime = new Date(utcDate.getTime() + (5 * 60 * 60 * 1000));
            
            const displayDay = String(pakistanTime.getUTCDate()).padStart(2, '0');
            const displayMonth = String(pakistanTime.getUTCMonth() + 1).padStart(2, '0');
            const displayYear = pakistanTime.getUTCFullYear();
            const displayHour = String(pakistanTime.getUTCHours()).padStart(2, '0');
            const displayMinute = String(pakistanTime.getUTCMinutes()).padStart(2, '0');
            
            return `${displayDay}/${displayMonth}/${displayYear} ${displayHour}:${displayMinute}`;
        } catch (error) {
            console.error('Error converting to Pakistan time:', error);
            return dateTimeString;
        }
    };

    const formatDateTimeForDisplay = (dateString) => {
        if (!dateString) return '';
        return convertToPakistanTime(dateString);
    };

    const generatePDF = async (invoice, details) => {
        try {
            const formattedDate = formatDateForDisplay(invoice.invoice_date);
            
            // Group items by customer for display
            const itemsByCustomer = {};
            details.forEach(item => {
                const customerKey = item.customer_id || item.customer_name;
                if (!itemsByCustomer[customerKey]) {
                    itemsByCustomer[customerKey] = {
                        customerName: item.customer_name,
                        customerNameUrdu: item.customer_name_urdu || '',
                        items: []
                    };
                }
                itemsByCustomer[customerKey].items.push(item);
            });

            let customerSectionsHtml = '';
            for (const [_, customerData] of Object.entries(itemsByCustomer)) {
                customerSectionsHtml += `
                    <div class="customer-section">
                        <h3>Customer: ${customerData.customerName} ${customerData.customerNameUrdu ? `(${customerData.customerNameUrdu})` : ''}</h3>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item Description</th>
                                    <th class="text-right">Quantity</th>
                                    <th class="text-right">Rate (₨)</th>
                                    <th class="text-right">Amount (₨)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${customerData.items.map((item, idx) => `
                                    <tr>
                                        <td>${idx + 1}</td>
                                        <td><strong>${item.item_name}${item.item_name_urdu ? ` (${item.item_name_urdu})` : ''}</strong></td>
                                        <td class="text-right">${item.quantity}</td>
                                        <td class="text-right"> ${item.rate?.toLocaleString() || 0}</td>
                                        <td class="text-right"> ${item.amount?.toLocaleString() || 0}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }

            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Invoice ${invoice.voucher_id}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: white; color: #333; }
                    .invoice-container { max-width: 1100px; margin: 0 auto; background: white; }
                    .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #4CAF50; }
                    .company-name { font-size: 28px; font-weight: bold; color: #2c3e50; }
                    .invoice-title { font-size: 24px; font-weight: bold; color: #4CAF50; margin-top: 10px; }
                    .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                    .details-section p { margin: 8px 0; font-size: 12px; }
                    .customer-section { margin-bottom: 30px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .items-table th { background: #4CAF50; color: white; padding: 12px; text-align: left; font-size: 12px; }
                    .items-table td { padding: 10px 12px; border-bottom: 1px solid #e0e0e0; font-size: 11px; }
                    .text-right { text-align: right; }
                    .totals-section { margin-top: 20px; text-align: right; }
                    .totals-line { margin: 8px 0; font-size: 12px; }
                    .grand-total { font-size: 16px; font-weight: bold; color: #4CAF50; margin-top: 10px; padding-top: 10px; border-top: 2px solid #4CAF50; }
                    .footer { margin-top: 40px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 10px; color: #999; }
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
                            <p><strong>Voucher No:</strong> ${invoice.voucher_id}</p>
                            <p><strong>Invoice Date:</strong> ${formattedDate}</p>
                        </div>
                        <div class="details-section">
                            <p><strong>Ref No:</strong> ${invoice.order_no || 'N/A'}</p>
                            <p><strong>Print Date:</strong> ${formatDateForDisplay(new Date().toISOString().split('T')[0])}</p>
                        </div>
                    </div>
                    ${customerSectionsHtml}
                    <div class="totals-section">
                        <div class="totals-line"><strong>Total Items:</strong> ${invoice.total_weight || 0}</div>
                        <div class="totals-line"><strong>Sub Total:</strong>  ${(invoice.total_amount || 0).toLocaleString()}</div>
                        <div class="totals-line"><strong>Discount:</strong>  ${(invoice.discount || 0).toLocaleString()}</div>
                        <div class="grand-total"><strong>Grand Total:</strong>  ${(invoice.net_amount || 0).toLocaleString()}</div>
                    </div>
                    <div class="footer"><p>Thank you for your business!</p></div>
                </div>
            </body>
            </html>
        `;

            if (window.electron && window.electron.openHTMLInBrowser) {
                await window.electron.openHTMLInBrowser(html);
                toast.success('Invoice opened in your browser');
            } else if (window.electron && window.electron.printToPDFAndOpen) {
                await window.electron.printToPDFAndOpen(html);
                toast.success('Invoice opened successfully');
            } else {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.print();
                toast.success('Print dialog opened');
            }
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Failed to generate PDF');
        }
    };

    const handlePrint = async (invoice) => {
        try {
            const details = invoiceDetails[invoice.invoice_id] || await window.electron.database.getInvoiceDetails(invoice.invoice_id);
            await generatePDF(invoice, details);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            toast.error('Failed to generate PDF');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await window.electron.database.deleteInvoice(id);
                toast.success('Invoice deleted successfully');
                loadInvoices();
                setShowDetails(false);
            } catch (error) {
                console.error('Failed to delete invoice:', error);
                toast.error('Failed to delete invoice');
            }
        }
    };

    const getTotalAmount = () => {
        return filteredInvoices.reduce((sum, inv) => sum + (inv.net_amount || 0), 0);
    };

    const getTotalWeight = () => {
        return filteredInvoices.reduce((sum, inv) => sum + (inv.total_weight || 0), 0);
    };

    // Get unique customers for an invoice
    const getInvoiceCustomers = (invoiceId) => {
        const details = invoiceDetails[invoiceId] || [];
        const uniqueCustomers = [...new Set(details.map(d => d.customer_name).filter(Boolean))];
        return uniqueCustomers.join(', ');
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Invoice List</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" onClick={() => navigate('/invoices/new')}>
                        <FiPlus /> New Invoice (CTRL + N)
                    </button>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="form-panel">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Date Range</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <span>to</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Search</label>
                        <div className="search-box">
                            <FiSearch />
                            <input
                                type="text"
                                placeholder="Search by Voucher ID, Ref No..."
                                value={searchTerm}
                                style={{ width: '100%' }}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr style={{ background: '#4CAF50', color: 'white' }}>
                            <th style={{ background: '#4CAF50', color: 'white' }}>ID</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Voucher ID</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Ref No.</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Date</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Total Items</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Total Amount</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Created</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Modified</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map((invoice) => (
                            <tr key={invoice.invoice_id}>
                                <td>{invoice.invoice_id}</td>
                                <td><strong>{invoice.voucher_id}</strong></td>
                                <td>{invoice.order_no || '-'}</td>
                                <td>{formatDateForDisplay(invoice.invoice_date)}</td>
                                <td>{invoice.total_weight}</td>
                                <td> {invoice.total_amount?.toLocaleString()}</td>
                                <td style={{ fontSize: '12px' }}>
                                    <div><strong>{invoice.created_by || '-'}</strong></div>
                                    <div style={{ color: '#666', fontSize: '11px' }}>
                                        {formatDateTimeForDisplay(invoice.created_at)}
                                    </div>
                                </td>
                                <td style={{ fontSize: '12px' }}>
                                    {invoice.modified_by ? (
                                        <>
                                            <div><strong>{invoice.modified_by}</strong></div>
                                            <div style={{ color: '#666', fontSize: '11px' }}>
                                                {formatDateTimeForDisplay(invoice.modified_at)}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ color: '#999', fontStyle: 'italic' }}>Not modified</div>
                                    )}
                                </td>
                                <td className="actions">
                                    <button className="icon-btn" onClick={() => handleEdit(invoice)} title="Edit">
                                        <FiEdit />
                                    </button>
                                    <button className="icon-btn" onClick={() => handleViewDetails(invoice)} title="View Details">
                                        <FiEye />
                                    </button>
                                    <button className="icon-btn danger" onClick={() => handleDelete(invoice.invoice_id)} title="Delete">
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredInvoices.length === 0 && (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                                    No invoices found for the selected date range
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary Section */}
            {filteredInvoices.length > 0 && (
                <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <div><strong>Total Invoices:</strong> {filteredInvoices.length}</div>
                    <div><strong>Total Weight:</strong> {getTotalWeight().toLocaleString()}</div>
                    <div><strong>Total Amount:</strong>  {getTotalAmount().toLocaleString()}</div>
                </div>
            )}

            {/* Invoice Details Modal */}
            {showDetails && selectedInvoice && (
                <div className="modal-overlay" onClick={() => setShowDetails(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Invoice Details - {selectedInvoice.voucher_id}</h2>
                            <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="invoice-info">
                                <p><strong>Date:</strong> {formatDateForDisplay(selectedInvoice.invoice_date)}</p>
                                <p><strong>Ref NO:</strong> {selectedInvoice.order_no || 'N/A'}</p>
                                <p><strong>Notes:</strong> {selectedInvoice.notes || 'N/A'}</p>
                                <p><strong>Created By:</strong> {selectedInvoice.created_by || '-'} on {formatDateTimeForDisplay(selectedInvoice.created_at)}</p>
                                {selectedInvoice.modified_by && (
                                    <p><strong>Modified By:</strong> {selectedInvoice.modified_by} on {formatDateTimeForDisplay(selectedInvoice.modified_at)}</p>
                                )}
                            </div>

                            {/* Group items by customer in details modal */}
                            {selectedInvoice.details && (() => {
                                const itemsByCustomer = {};
                                selectedInvoice.details.forEach(item => {
                                    const customerKey = item.customer_id || item.customer_name;
                                    if (!itemsByCustomer[customerKey]) {
                                        itemsByCustomer[customerKey] = {
                                            customerName: item.customer_name,
                                            customerNameUrdu: item.customer_name_urdu || '',
                                            items: []
                                        };
                                    }
                                    itemsByCustomer[customerKey].items.push(item);
                                });

                                return Object.entries(itemsByCustomer).map(([_, customerData], idx) => (
                                    <div key={idx} style={{ marginBottom: '30px' }}>
                                        <h3 style={{ color: '#ff9800', marginBottom: '10px' }}>
                                            Customer: {customerData.customerName} 
                                            {customerData.customerNameUrdu && ` (${customerData.customerNameUrdu})`}
                                        </h3>
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Item</th>
                                                    <th>Qty</th>
                                                    <th>Rate</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {customerData.items.map((item, itemIdx) => (
                                                    <tr key={itemIdx}>
                                                        <td>{itemIdx + 1}</td>
                                                        <td>{item.item_name}{item.item_name_urdu && ` (${item.item_name_urdu})`}</td>
                                                        <td>{item.quantity}</td>
                                                        <td> {item.rate?.toLocaleString()}</td>
                                                        <td> {item.amount?.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ));
                            })()}

                            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                <p><strong>Total Items:</strong> {selectedInvoice.total_weight}</p>
                                <p><strong>Total Amount:</strong>  {selectedInvoice.total_amount?.toLocaleString()}</p>
                                <p><strong>Discount:</strong>  {selectedInvoice.discount?.toLocaleString()}</p>
                                <p><strong>Net Amount:</strong>  {selectedInvoice.net_amount?.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-danger" onClick={() => setShowDetails(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 8px;
                    width: 90%;
                    max-width: 1000px;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid #e0e0e0;
                    background: #f5f5f5;
                    border-radius: 8px 8px 0 0;
                }
                
                .modal-header h2 {
                    margin: 0;
                    color: #4CAF50;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                }
                
                .close-btn:hover {
                    color: #f44336;
                }
                
                .modal-body {
                    padding: 20px;
                }
                
                .invoice-info {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                    margin-bottom: 20px;
                    padding: 15px;
                    background: #f9f9f9;
                    border-radius: 4px;
                }
                
                .modal-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                
                .btn-secondary {
                    padding: 8px 16px;
                    background: #2196F3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 14px;
                }
                
                .btn-secondary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}

export default InvoiceList;