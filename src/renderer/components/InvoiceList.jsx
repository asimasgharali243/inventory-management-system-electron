// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { toast } from 'react-hot-toast';
// // // // // import { FiEye, FiPrinter, FiTrash2, FiCalendar, FiSearch } from 'react-icons/fi';
// // // // // import jsPDF from 'jspdf';
// // // // // import 'jspdf-autotable';

// // // // // function InvoiceList() {
// // // // //     const [invoices, setInvoices] = useState([]);
// // // // //     const [filteredInvoices, setFilteredInvoices] = useState([]);
// // // // //     const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
// // // // //     const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
// // // // //     const [searchTerm, setSearchTerm] = useState('');
// // // // //     const [selectedInvoice, setSelectedInvoice] = useState(null);
// // // // //     const [showDetails, setShowDetails] = useState(false);

// // // // //     useEffect(() => {
// // // // //         loadInvoices();
// // // // //     }, []);

// // // // //     useEffect(() => {
// // // // //         filterInvoices();
// // // // //     }, [invoices, startDate, endDate, searchTerm]);

// // // // //     const loadInvoices = async () => {
// // // // //         try {
// // // // //             const data = await window.electron.database.getInvoices();
// // // // //             setInvoices(data || []);
// // // // //         } catch (error) {
// // // // //             toast.error('Failed to load invoices');
// // // // //         }
// // // // //     };

// // // // //     const filterInvoices = () => {
// // // // //         let filtered = [...invoices];

// // // // //         // Filter by date range
// // // // //         filtered = filtered.filter(inv => {
// // // // //             const invDate = inv.invoice_date;
// // // // //             return invDate >= startDate && invDate <= endDate;
// // // // //         });

// // // // //         // Filter by search term
// // // // //         if (searchTerm) {
// // // // //             filtered = filtered.filter(inv =>
// // // // //                 inv.voucher_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //                 inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //                 inv.order_no?.toLowerCase().includes(searchTerm.toLowerCase())
// // // // //             );
// // // // //         }

// // // // //         setFilteredInvoices(filtered);
// // // // //     };

// // // // //     const handleViewDetails = async (invoice) => {
// // // // //         try {
// // // // //             const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // // //             setSelectedInvoice({ ...invoice, details });
// // // // //             setShowDetails(true);
// // // // //         } catch (error) {
// // // // //             toast.error('Failed to load invoice details');
// // // // //         }
// // // // //     };

// // // // //     const handlePrint = async (invoice) => {
// // // // //         try {
// // // // //             const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // // //             generatePDF(invoice, details);
// // // // //         } catch (error) {
// // // // //             toast.error('Failed to generate PDF');
// // // // //         }
// // // // //     };

// // // // //     const generatePDF = (invoice, details) => {
// // // // //         const doc = new jsPDF();

// // // // //         // Header
// // // // //         doc.setFontSize(20);
// // // // //         doc.text('INVENTORY MANAGEMENT SYSTEM', 105, 20, { align: 'center' });
// // // // //         doc.setFontSize(16);
// // // // //         doc.text('SALE INVOICE', 105, 30, { align: 'center' });

// // // // //         // Invoice details
// // // // //         doc.setFontSize(10);
// // // // //         doc.text(`Voucher ID: ${invoice.voucher_id}`, 14, 45);
// // // // //         doc.text(`Date: ${invoice.invoice_date}`, 14, 52);
// // // // //         doc.text(`Order No: ${invoice.order_no || 'N/A'}`, 14, 59);
// // // // //         doc.text(`Customer: ${invoice.customer_name}`, 14, 66);

// // // // //         if (invoice.notes) {
// // // // //             doc.text(`Notes: ${invoice.notes}`, 14, 73);
// // // // //         }

// // // // //         // Items table
// // // // //         const tableData = details.map((item, index) => [
// // // // //             index + 1,
// // // // //             item.item_name,
// // // // //             item.quantity,
// // // // //             item.unit,
// // // // //             item.rate.toLocaleString(),
// // // // //             item.amount.toLocaleString()
// // // // //         ]);

// // // // //         doc.autoTable({
// // // // //             startY: invoice.notes ? 80 : 73,
// // // // //             head: [['Sr.', 'Item', 'Qty', 'Unit', 'Rate', 'Amount']],
// // // // //             body: tableData,
// // // // //             theme: 'grid',
// // // // //             styles: { fontSize: 9 },
// // // // //             headStyles: { fillColor: [76, 175, 80] }
// // // // //         });

// // // // //         // Totals
// // // // //         const finalY = doc.lastAutoTable.finalY + 10;
// // // // //         doc.text(`Total Items: ${invoice.total_weight}`, 140, finalY);
// // // // //         doc.text(`Total Amount: ₨ ${invoice.total_amount.toLocaleString()}`, 140, finalY + 7);
// // // // //         doc.text(`Discount: ₨ ${invoice.discount.toLocaleString()}`, 140, finalY + 14);
// // // // //         doc.setFontSize(12);
// // // // //         doc.setFont('helvetica', 'bold');
// // // // //         doc.text(`Net Amount: ₨ ${invoice.net_amount.toLocaleString()}`, 140, finalY + 21);

// // // // //         // Footer
// // // // //         doc.setFontSize(8);
// // // // //         doc.setFont('helvetica', 'normal');
// // // // //         doc.text('POS Software by Ultimate Solutions', 105, finalY + 35, { align: 'center' });

// // // // //         doc.save(`Invoice_${invoice.voucher_id}.pdf`);
// // // // //         toast.success('Invoice printed successfully');
// // // // //     };

// // // // //     const handleDelete = async (id) => {
// // // // //         if (window.confirm('Are you sure you want to delete this invoice?')) {
// // // // //             try {
// // // // //                 await window.electron.database.deleteInvoice(id);
// // // // //                 toast.success('Invoice deleted successfully');
// // // // //                 loadInvoices();
// // // // //                 setShowDetails(false);
// // // // //             } catch (error) {
// // // // //                 toast.error('Failed to delete invoice');
// // // // //             }
// // // // //         }
// // // // //     };

// // // // //     const getTotalAmount = () => {
// // // // //         return filteredInvoices.reduce((sum, inv) => sum + inv.net_amount, 0);
// // // // //     };

// // // // //     const getTotalWeight = () => {
// // // // //         return filteredInvoices.reduce((sum, inv) => sum + inv.total_weight, 0);
// // // // //     };

// // // // //     return (
// // // // //         <div className="container">
// // // // //             <div className="header">
// // // // //                 <h1>Sale Customer List</h1>
// // // // //                 <button className="btn-primary" onClick={() => window.location.href = '/invoices/new'}>
// // // // //                     Create New Invoice
// // // // //                 </button>
// // // // //             </div>

// // // // //             {/* Date Range Filter */}
// // // // //             <div className="form-panel">
// // // // //                 <div className="form-grid">
// // // // //                     <div className="form-group">
// // // // //                         <label>Date Range</label>
// // // // //                         <div style={{ display: 'flex', gap: '10px' }}>
// // // // //                             <input
// // // // //                                 type="date"
// // // // //                                 value={startDate}
// // // // //                                 onChange={(e) => setStartDate(e.target.value)}
// // // // //                             />
// // // // //                             <span>to</span>
// // // // //                             <input
// // // // //                                 type="date"
// // // // //                                 value={endDate}
// // // // //                                 onChange={(e) => setEndDate(e.target.value)}
// // // // //                             />
// // // // //                         </div>
// // // // //                     </div>
// // // // //                     <div className="form-group">
// // // // //                         <label>Search</label>
// // // // //                         <div className="search-box">
// // // // //                             <FiSearch />
// // // // //                             <input
// // // // //                                 type="text"
// // // // //                                 placeholder="Search by Voucher ID, Customer..."
// // // // //                                 value={searchTerm}
// // // // //                                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // //                             />
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>

// // // // //             {/* Summary Stats */}
// // // // //             <div className="stats-grid" style={{ marginBottom: '20px' }}>
// // // // //                 <div className="stat-card">
// // // // //                     <h3>Total Invoices</h3>
// // // // //                     <div className="stat-value">{filteredInvoices.length}</div>
// // // // //                 </div>
// // // // //                 <div className="stat-card">
// // // // //                     <h3>Total Weight</h3>
// // // // //                     <div className="stat-value">{getTotalWeight().toLocaleString()}</div>
// // // // //                 </div>
// // // // //                 <div className="stat-card">
// // // // //                     <h3>Total Amount</h3>
// // // // //                     <div className="stat-value">₨ {getTotalAmount().toLocaleString()}</div>
// // // // //                 </div>
// // // // //             </div>

// // // // //             {/* Invoices Table */}
// // // // //             <div className="table-container">
// // // // //                 <table className="data-table">
// // // // //                     <thead>
// // // // //                         <tr>
// // // // //                             <th>ID</th>
// // // // //                             <th>Voucher ID</th>
// // // // //                             <th>Order No.</th>
// // // // //                             <th>Date</th>
// // // // //                             <th>Customer</th>
// // // // //                             <th>Total Weight</th>
// // // // //                             <th>Total Amount</th>
// // // // //                             <th>Created By</th>
// // // // //                             <th>Actions</th>
// // // // //                         </tr>
// // // // //                     </thead>
// // // // //                     <tbody>
// // // // //                         {filteredInvoices.map((invoice) => (
// // // // //                             <tr key={invoice.invoice_id}>
// // // // //                                 <td>{invoice.invoice_id}</td>
// // // // //                                 <td><strong>{invoice.voucher_id}</strong></td>
// // // // //                                 <td>{invoice.order_no || '-'}</td>
// // // // //                                 <td>{invoice.invoice_date}</td>
// // // // //                                 <td>{invoice.customer_name}</td>
// // // // //                                 <td>{invoice.total_weight}</td>
// // // // //                                 <td>₨ {invoice.total_amount?.toLocaleString()}</td>
// // // // //                                 <td>{invoice.created_by}</td>
// // // // //                                 <td className="actions">
// // // // //                                     <button className="icon-btn" onClick={() => handleViewDetails(invoice)}>
// // // // //                                         <FiEye />
// // // // //                                     </button>
// // // // //                                     <button className="icon-btn" onClick={() => handlePrint(invoice)}>
// // // // //                                         <FiPrinter />
// // // // //                                     </button>
// // // // //                                     <button className="icon-btn danger" onClick={() => handleDelete(invoice.invoice_id)}>
// // // // //                                         <FiTrash2 />
// // // // //                                     </button>
// // // // //                                 </td>
// // // // //                             </tr>
// // // // //                         ))}
// // // // //                         {filteredInvoices.length === 0 && (
// // // // //                             <tr>
// // // // //                                 <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
// // // // //                                     No invoices found for the selected date range
// // // // //                                 </td>
// // // // //                             </tr>
// // // // //                         )}
// // // // //                     </tbody>
// // // // //                 </table>
// // // // //             </div>

// // // // //             {/* Invoice Details Modal */}
// // // // //             {showDetails && selectedInvoice && (
// // // // //                 <div className="modal-overlay" onClick={() => setShowDetails(false)}>
// // // // //                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
// // // // //                         <div className="modal-header">
// // // // //                             <h2>Invoice Details - {selectedInvoice.voucher_id}</h2>
// // // // //                             <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
// // // // //                         </div>
// // // // //                         <div className="modal-body">
// // // // //                             <div className="invoice-info">
// // // // //                                 <p><strong>Date:</strong> {selectedInvoice.invoice_date}</p>
// // // // //                                 <p><strong>Customer:</strong> {selectedInvoice.customer_name}</p>
// // // // //                                 <p><strong>Order No:</strong> {selectedInvoice.order_no || 'N/A'}</p>
// // // // //                                 <p><strong>Notes:</strong> {selectedInvoice.notes || 'N/A'}</p>
// // // // //                             </div>

// // // // //                             <table className="data-table">
// // // // //                                 <thead>
// // // // //                                     <tr>
// // // // //                                         <th>Sr.</th>
// // // // //                                         <th>Item</th>
// // // // //                                         <th>Qty</th>
// // // // //                                         <th>Unit</th>
// // // // //                                         <th>Rate</th>
// // // // //                                         <th>Amount</th>
// // // // //                                     </tr>
// // // // //                                 </thead>
// // // // //                                 <tbody>
// // // // //                                     {selectedInvoice.details?.map((item, idx) => (
// // // // //                                         <tr key={idx}>
// // // // //                                             <td>{idx + 1}</td>
// // // // //                                             <td>{item.item_name}</td>
// // // // //                                             <td>{item.quantity}</td>
// // // // //                                             <td>{item.unit}</td>
// // // // //                                             <td>₨ {item.rate.toLocaleString()}</td>
// // // // //                                             <td>₨ {item.amount.toLocaleString()}</td>
// // // // //                                         </tr>
// // // // //                                     ))}
// // // // //                                 </tbody>
// // // // //                                 <tfoot>
// // // // //                                     <tr>
// // // // //                                         <td colSpan="5" style={{ textAlign: 'right' }}><strong>Total Weight:</strong></td>
// // // // //                                         <td><strong>{selectedInvoice.total_weight}</strong></td>
// // // // //                                     </tr>
// // // // //                                     <tr>
// // // // //                                         <td colSpan="5" style={{ textAlign: 'right' }}><strong>Total Amount:</strong></td>
// // // // //                                         <td><strong>₨ {selectedInvoice.total_amount?.toLocaleString()}</strong></td>
// // // // //                                     </tr>
// // // // //                                     <tr>
// // // // //                                         <td colSpan="5" style={{ textAlign: 'right' }}><strong>Discount:</strong></td>
// // // // //                                         <td><strong>₨ {selectedInvoice.discount?.toLocaleString()}</strong></td>
// // // // //                                     </tr>
// // // // //                                     <tr>
// // // // //                                         <td colSpan="5" style={{ textAlign: 'right' }}><strong>Net Amount:</strong></td>
// // // // //                                         <td><strong>₨ {selectedInvoice.net_amount?.toLocaleString()}</strong></td>
// // // // //                                     </tr>
// // // // //                                 </tfoot>
// // // // //                             </table>
// // // // //                         </div>
// // // // //                         <div className="modal-footer">
// // // // //                             <button className="btn-primary" onClick={() => handlePrint(selectedInvoice)}>
// // // // //                                 <FiPrinter /> Print
// // // // //                             </button>
// // // // //                             <button className="btn-danger" onClick={() => setShowDetails(false)}>
// // // // //                                 Close
// // // // //                             </button>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             )}

// // // // //             <div className="status-bar">
// // // // //                 <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
// // // // //                 <span className="shortcuts-hint">
// // // // //                     Shortcuts: Click on Eye icon to view details | Print icon for PDF
// // // // //                 </span>
// // // // //             </div>

// // // // //             <style jsx>{`
// // // // //         .modal-overlay {
// // // // //           position: fixed;
// // // // //           top: 0;
// // // // //           left: 0;
// // // // //           right: 0;
// // // // //           bottom: 0;
// // // // //           background: rgba(0,0,0,0.5);
// // // // //           display: flex;
// // // // //           justify-content: center;
// // // // //           align-items: center;
// // // // //           z-index: 1000;
// // // // //         }

// // // // //         .modal-content {
// // // // //           background: white;
// // // // //           border-radius: 8px;
// // // // //           width: 90%;
// // // // //           max-width: 1000px;
// // // // //           max-height: 80vh;
// // // // //           overflow-y: auto;
// // // // //           box-shadow: 0 4px 20px rgba(0,0,0,0.2);
// // // // //         }

// // // // //         .modal-header {
// // // // //           display: flex;
// // // // //           justify-content: space-between;
// // // // //           align-items: center;
// // // // //           padding: 15px 20px;
// // // // //           border-bottom: 1px solid #e0e0e0;
// // // // //           background: #f5f5f5;
// // // // //           border-radius: 8px 8px 0 0;
// // // // //         }

// // // // //         .modal-header h2 {
// // // // //           margin: 0;
// // // // //           color: #4CAF50;
// // // // //         }

// // // // //         .close-btn {
// // // // //           background: none;
// // // // //           border: none;
// // // // //           font-size: 24px;
// // // // //           cursor: pointer;
// // // // //           color: #999;
// // // // //         }

// // // // //         .close-btn:hover {
// // // // //           color: #f44336;
// // // // //         }

// // // // //         .modal-body {
// // // // //           padding: 20px;
// // // // //         }

// // // // //         .invoice-info {
// // // // //           display: grid;
// // // // //           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
// // // // //           gap: 10px;
// // // // //           margin-bottom: 20px;
// // // // //           padding: 15px;
// // // // //           background: #f9f9f9;
// // // // //           border-radius: 4px;
// // // // //         }

// // // // //         .modal-footer {
// // // // //           padding: 15px 20px;
// // // // //           border-top: 1px solid #e0e0e0;
// // // // //           display: flex;
// // // // //           justify-content: flex-end;
// // // // //           gap: 10px;
// // // // //         }
// // // // //       `}</style>
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // // export default InvoiceList;

// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { toast } from 'react-hot-toast';
// // // // // import { FiEye, FiPrinter, FiTrash2, FiCalendar, FiSearch } from 'react-icons/fi';
// // // // // import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// // // // // import { NavigationContext } from '../App';
// // // // // import { useNavigate } from 'react-router-dom';
// // // // // import { useContext } from 'react';

// // // // // function InvoiceList() {

// // // // //     const navigate = useNavigate();
// // // // //     const { goBack } = useContext(NavigationContext);
// // // // //     const [invoices, setInvoices] = useState([]);
// // // // //     const [filteredInvoices, setFilteredInvoices] = useState([]);
// // // // //     const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
// // // // //     const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
// // // // //     const [searchTerm, setSearchTerm] = useState('');
// // // // //     const [selectedInvoice, setSelectedInvoice] = useState(null);
// // // // //     const [showDetails, setShowDetails] = useState(false);

// // // // //     useEffect(() => {
// // // // //         loadInvoices();
// // // // //     }, []);

// // // // //     useEffect(() => {
// // // // //         filterInvoices();
// // // // //     }, [invoices, startDate, endDate, searchTerm]);

// // // // //     const loadInvoices = async () => {
// // // // //         try {
// // // // //             const data = await window.electron.database.getInvoices();
// // // // //             setInvoices(data || []);
// // // // //         } catch (error) {
// // // // //             toast.error('Failed to load invoices');
// // // // //         }
// // // // //     };

// // // // //     const filterInvoices = () => {
// // // // //         let filtered = [...invoices];

// // // // //         filtered = filtered.filter(inv => {
// // // // //             const invDate = inv.invoice_date;
// // // // //             return invDate >= startDate && invDate <= endDate;
// // // // //         });

// // // // //         if (searchTerm) {
// // // // //             filtered = filtered.filter(inv =>
// // // // //                 inv.voucher_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //                 inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //                 inv.order_no?.toLowerCase().includes(searchTerm.toLowerCase())
// // // // //             );
// // // // //         }

// // // // //         setFilteredInvoices(filtered);
// // // // //     };

// // // // //     const handleViewDetails = async (invoice) => {
// // // // //         try {
// // // // //             const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // // //             setSelectedInvoice({ ...invoice, details });
// // // // //             setShowDetails(true);
// // // // //         } catch (error) {
// // // // //             toast.error('Failed to load invoice details');
// // // // //         }
// // // // //     };

// // // // //     const generatePDF = async (invoice, details) => {
// // // // //         try {
// // // // //             const pdfDoc = await PDFDocument.create();
// // // // //             const page = pdfDoc.addPage([600, 800]);
// // // // //             const { width, height } = page.getSize();

// // // // //             const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
// // // // //             const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

// // // // //             let yPosition = height - 50;

// // // // //             // Header
// // // // //             page.drawText('INVENTORY MANAGEMENT SYSTEM', {
// // // // //                 x: width / 2 - 150,
// // // // //                 y: yPosition,
// // // // //                 size: 20,
// // // // //                 font: helveticaBold
// // // // //             });

// // // // //             yPosition -= 30;
// // // // //             page.drawText('SALE INVOICE', {
// // // // //                 x: width / 2 - 60,
// // // // //                 y: yPosition,
// // // // //                 size: 16,
// // // // //                 font: helveticaBold
// // // // //             });

// // // // //             yPosition -= 40;

// // // // //             // Invoice details
// // // // //             page.drawText(`Voucher ID: ${invoice.voucher_id}`, {
// // // // //                 x: 50,
// // // // //                 y: yPosition,
// // // // //                 size: 10,
// // // // //                 font: helveticaFont
// // // // //             });

// // // // //             page.drawText(`Date: ${invoice.invoice_date}`, {
// // // // //                 x: 50,
// // // // //                 y: yPosition - 15,
// // // // //                 size: 10,
// // // // //                 font: helveticaFont
// // // // //             });

// // // // //             page.drawText(`Order No: ${invoice.order_no || 'N/A'}`, {
// // // // //                 x: 50,
// // // // //                 y: yPosition - 30,
// // // // //                 size: 10,
// // // // //                 font: helveticaFont
// // // // //             });

// // // // //             page.drawText(`Customer: ${invoice.customer_name}`, {
// // // // //                 x: 50,
// // // // //                 y: yPosition - 45,
// // // // //                 size: 10,
// // // // //                 font: helveticaFont
// // // // //             });

// // // // //             if (invoice.notes) {
// // // // //                 page.drawText(`Notes: ${invoice.notes}`, {
// // // // //                     x: 50,
// // // // //                     y: yPosition - 60,
// // // // //                     size: 10,
// // // // //                     font: helveticaFont
// // // // //                 });
// // // // //             }

// // // // //             // Table header
// // // // //             const startY = invoice.notes ? yPosition - 95 : yPosition - 75;
// // // // //             const headers = ['Sr.', 'Item', 'Qty', 'Unit', 'Rate', 'Amount'];
// // // // //             const columnWidths = [40, 220, 50, 50, 80, 100];
// // // // //             let xPosition = 50;

// // // // //             page.drawRectangle({
// // // // //                 x: 50,
// // // // //                 y: startY - 20,
// // // // //                 width: width - 100,
// // // // //                 height: 25,
// // // // //                 color: rgb(0.3, 0.6, 0.3)
// // // // //             });

// // // // //             headers.forEach((header, index) => {
// // // // //                 page.drawText(header, {
// // // // //                     x: xPosition + 5,
// // // // //                     y: startY - 15,
// // // // //                     size: 10,
// // // // //                     font: helveticaBold,
// // // // //                     color: rgb(1, 1, 1)
// // // // //                 });
// // // // //                 xPosition += columnWidths[index];
// // // // //             });

// // // // //             // Table rows
// // // // //             let currentY = startY - 35;
// // // // //             details.forEach((item, idx) => {
// // // // //                 xPosition = 50;
// // // // //                 const rowData = [
// // // // //                     (idx + 1).toString(),
// // // // //                     item.item_name,
// // // // //                     item.quantity.toString(),
// // // // //                     item.unit,
// // // // //                     `₨ ${item.rate.toLocaleString()}`,
// // // // //                     `₨ ${item.amount.toLocaleString()}`
// // // // //                 ];

// // // // //                 rowData.forEach((data, colIdx) => {
// // // // //                     page.drawText(data, {
// // // // //                         x: xPosition + 5,
// // // // //                         y: currentY,
// // // // //                         size: 9,
// // // // //                         font: helveticaFont
// // // // //                     });
// // // // //                     xPosition += columnWidths[colIdx];
// // // // //                 });
// // // // //                 currentY -= 20;
// // // // //             });

// // // // //             // Totals
// // // // //             const totalsY = currentY - 20;
// // // // //             page.drawText(`Total Items: ${invoice.total_weight}`, {
// // // // //                 x: width - 200,
// // // // //                 y: totalsY,
// // // // //                 size: 10,
// // // // //                 font: helveticaFont
// // // // //             });

// // // // //             page.drawText(`Total Amount: ₨ ${invoice.total_amount.toLocaleString()}`, {
// // // // //                 x: width - 200,
// // // // //                 y: totalsY - 15,
// // // // //                 size: 10,
// // // // //                 font: helveticaFont
// // // // //             });

// // // // //             page.drawText(`Discount: ₨ ${invoice.discount.toLocaleString()}`, {
// // // // //                 x: width - 200,
// // // // //                 y: totalsY - 30,
// // // // //                 size: 10,
// // // // //                 font: helveticaFont
// // // // //             });

// // // // //             page.drawText(`Net Amount: ₨ ${invoice.net_amount.toLocaleString()}`, {
// // // // //                 x: width - 200,
// // // // //                 y: totalsY - 45,
// // // // //                 size: 12,
// // // // //                 font: helveticaBold,
// // // // //                 color: rgb(0, 0.5, 0)
// // // // //             });

// // // // //             // Footer
// // // // //             const finalY = totalsY - 65;
// // // // //             page.drawText('POS Software by Ultimate Solutions', {
// // // // //                 x: width / 2 - 100,
// // // // //                 y: finalY,
// // // // //                 size: 8,
// // // // //                 font: helveticaFont,
// // // // //                 color: rgb(0.5, 0.5, 0.5)
// // // // //             });

// // // // //             const pdfBytes = await pdfDoc.save();
// // // // //             const blob = new Blob([pdfBytes], { type: 'application/pdf' });
// // // // //             const link = document.createElement('a');
// // // // //             link.href = URL.createObjectURL(blob);
// // // // //             link.download = `Invoice_${invoice.voucher_id}.pdf`;
// // // // //             link.click();
// // // // //             URL.revokeObjectURL(link.href);

// // // // //             toast.success('Invoice printed successfully');
// // // // //         } catch (error) {
// // // // //             console.error('PDF generation error:', error);
// // // // //             toast.error('Failed to generate PDF');
// // // // //         }
// // // // //     };

// // // // //     const handlePrint = async (invoice) => {
// // // // //         try {
// // // // //             const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // // //             await generatePDF(invoice, details);
// // // // //         } catch (error) {
// // // // //             toast.error('Failed to generate PDF');
// // // // //         }
// // // // //     };

// // // // //     const handleDelete = async (id) => {
// // // // //         if (window.confirm('Are you sure you want to delete this invoice?')) {
// // // // //             try {
// // // // //                 await window.electron.database.deleteInvoice(id);
// // // // //                 toast.success('Invoice deleted successfully');
// // // // //                 loadInvoices();
// // // // //                 setShowDetails(false);
// // // // //             } catch (error) {
// // // // //                 toast.error('Failed to delete invoice');
// // // // //             }
// // // // //         }
// // // // //     };

// // // // //     const getTotalAmount = () => {
// // // // //         return filteredInvoices.reduce((sum, inv) => sum + inv.net_amount, 0);
// // // // //     };

// // // // //     const getTotalWeight = () => {
// // // // //         return filteredInvoices.reduce((sum, inv) => sum + inv.total_weight, 0);
// // // // //     };

// // // // //     return (
// // // // //         <div className="container">
// // // // //             <div className="header">
// // // // //                 <h1>Sale Customer List</h1>
// // // // //                 <button className="btn-primary" onClick={() => window.location.href = '/invoices/new'}>
// // // // //                     Create New Invoice
// // // // //                 </button>
// // // // //             </div>

// // // // //             {/* Date Range Filter */}
// // // // //             <div className="form-panel">
// // // // //                 <div className="form-grid">
// // // // //                     <div className="form-group">
// // // // //                         <label>Date Range</label>
// // // // //                         <div style={{ display: 'flex', gap: '10px' }}>
// // // // //                             <input
// // // // //                                 type="date"
// // // // //                                 value={startDate}
// // // // //                                 onChange={(e) => setStartDate(e.target.value)}
// // // // //                             />
// // // // //                             <span>to</span>
// // // // //                             <input
// // // // //                                 type="date"
// // // // //                                 value={endDate}
// // // // //                                 onChange={(e) => setEndDate(e.target.value)}
// // // // //                             />
// // // // //                         </div>
// // // // //                     </div>
// // // // //                     <div className="form-group">
// // // // //                         <label>Search</label>
// // // // //                         <div className="search-box">
// // // // //                             <FiSearch />
// // // // //                             <input
// // // // //                                 type="text"
// // // // //                                 placeholder="Search by Voucher ID, Customer..."
// // // // //                                 value={searchTerm}
// // // // //                                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // //                             />
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>

// // // // //             {/* Summary Stats */}
// // // // //             <div className="stats-grid" style={{ marginBottom: '20px' }}>
// // // // //                 <div className="stat-card">
// // // // //                     <h3>Total Invoices</h3>
// // // // //                     <div className="stat-value">{filteredInvoices.length}</div>
// // // // //                 </div>
// // // // //                 <div className="stat-card">
// // // // //                     <h3>Total Weight</h3>
// // // // //                     <div className="stat-value">{getTotalWeight().toLocaleString()}</div>
// // // // //                 </div>
// // // // //                 <div className="stat-card">
// // // // //                     <h3>Total Amount</h3>
// // // // //                     <div className="stat-value">₨ {getTotalAmount().toLocaleString()}</div>
// // // // //                 </div>
// // // // //             </div>

// // // // //             {/* Invoices Table */}
// // // // //             <div className="table-container">
// // // // //                 <table className="data-table">
// // // // //                     <thead>
// // // // //                         <tr>
// // // // //                             <th>ID</th>
// // // // //                             <th>Voucher ID</th>
// // // // //                             <th>Order No.</th>
// // // // //                             <th>Date</th>
// // // // //                             <th>Customer</th>
// // // // //                             <th>Total Weight</th>
// // // // //                             <th>Total Amount</th>
// // // // //                             <th>Created By</th>
// // // // //                             <th>Actions</th>
// // // // //                         </tr>
// // // // //                     </thead>
// // // // //                     <tbody>
// // // // //                         {filteredInvoices.map((invoice) => (
// // // // //                             <tr key={invoice.invoice_id}>
// // // // //                                 <td>{invoice.invoice_id}</td>
// // // // //                                 <td><strong>{invoice.voucher_id}</strong></td>
// // // // //                                 <td>{invoice.order_no || '-'}</td>
// // // // //                                 <td>{invoice.invoice_date}</td>
// // // // //                                 <td>{invoice.customer_name}</td>
// // // // //                                 <td>{invoice.total_weight}</td>
// // // // //                                 <td>₨ {invoice.total_amount?.toLocaleString()}</td>
// // // // //                                 <td>{invoice.created_by}</td>
// // // // //                                 <td className="actions">
// // // // //                                     <button className="icon-btn" onClick={() => handleViewDetails(invoice)}>
// // // // //                                         <FiEye />
// // // // //                                     </button>
// // // // //                                     <button className="icon-btn" onClick={() => handlePrint(invoice)}>
// // // // //                                         <FiPrinter />
// // // // //                                     </button>
// // // // //                                     <button className="icon-btn danger" onClick={() => handleDelete(invoice.invoice_id)}>
// // // // //                                         <FiTrash2 />
// // // // //                                     </button>
// // // // //                                 </td>
// // // // //                             </tr>
// // // // //                         ))}
// // // // //                         {filteredInvoices.length === 0 && (
// // // // //                             <tr>
// // // // //                                 <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
// // // // //                                     No invoices found for the selected date range
// // // // //                                 </td>
// // // // //                             </tr>
// // // // //                         )}
// // // // //                     </tbody>
// // // // //                 </table>
// // // // //             </div>

// // // // //             {/* Invoice Details Modal - Keep same as before */}
// // // // //             {showDetails && selectedInvoice && (
// // // // //                 <div className="modal-overlay" onClick={() => setShowDetails(false)}>
// // // // //                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
// // // // //                         <div className="modal-header">
// // // // //                             <h2>Invoice Details - {selectedInvoice.voucher_id}</h2>
// // // // //                             <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
// // // // //                         </div>
// // // // //                         <div className="modal-body">
// // // // //                             <div className="invoice-info">
// // // // //                                 <p><strong>Date:</strong> {selectedInvoice.invoice_date}</p>
// // // // //                                 <p><strong>Customer:</strong> {selectedInvoice.customer_name}</p>
// // // // //                                 <p><strong>Order No:</strong> {selectedInvoice.order_no || 'N/A'}</p>
// // // // //                                 <p><strong>Notes:</strong> {selectedInvoice.notes || 'N/A'}</p>
// // // // //                             </div>

// // // // //                             <table className="data-table">
// // // // //                                 <thead>
// // // // //                                     <tr>
// // // // //                                         <th>Sr.</th>
// // // // //                                         <th>Item</th>
// // // // //                                         <th>Qty</th>
// // // // //                                         <th>Unit</th>
// // // // //                                         <th>Rate</th>
// // // // //                                         <th>Amount</th>
// // // // //                                     </tr>
// // // // //                                 </thead>
// // // // //                                 <tbody>
// // // // //                                     {selectedInvoice.details?.map((item, idx) => (
// // // // //                                         <tr key={idx}>
// // // // //                                             <td>{idx + 1}</td>
// // // // //                                             <td>{item.item_name}</td>
// // // // //                                             <td>{item.quantity}</td>
// // // // //                                             <td>{item.unit}</td>
// // // // //                                             <td>₨ {item.rate.toLocaleString()}</td>
// // // // //                                             <td>₨ {item.amount.toLocaleString()}</td>
// // // // //                                         </tr>
// // // // //                                     ))}
// // // // //                                 </tbody>
// // // // //                                 <tfoot>
// // // // //                                     <tr>
// // // // //                                         <td colSpan="5" style={{ textAlign: 'right' }}><strong>Total Weight:</strong></td>
// // // // //                                         <td><strong>{selectedInvoice.total_weight}</strong></td>
// // // // //                                     </tr>
// // // // //                                     <tr>
// // // // //                                         <td colSpan="5" style={{ textAlign: 'right' }}><strong>Total Amount:</strong></td>
// // // // //                                         <td><strong>₨ {selectedInvoice.total_amount?.toLocaleString()}</strong></td>
// // // // //                                     </tr>
// // // // //                                     <tr>
// // // // //                                         <td colSpan="5" style={{ textAlign: 'right' }}><strong>Discount:</strong></td>
// // // // //                                         <td><strong>₨ {selectedInvoice.discount?.toLocaleString()}</strong></td>
// // // // //                                     </tr>
// // // // //                                     <tr>
// // // // //                                         <td colSpan="5" style={{ textAlign: 'right' }}><strong>Net Amount:</strong></td>
// // // // //                                         <td><strong>₨ {selectedInvoice.net_amount?.toLocaleString()}</strong></td>
// // // // //                                     </tr>
// // // // //                                 </tfoot>
// // // // //                             </table>
// // // // //                         </div>
// // // // //                         <div className="modal-footer">
// // // // //                             <button className="btn-primary" onClick={() => handlePrint(selectedInvoice)}>
// // // // //                                 <FiPrinter /> Print
// // // // //                             </button>
// // // // //                             <button className="btn-danger" onClick={() => setShowDetails(false)}>
// // // // //                                 Close
// // // // //                             </button>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             )}

// // // // //             <div className="status-bar">
// // // // //                 <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
// // // // //                 <span className="shortcuts-hint">
// // // // //                     Shortcuts: Click on Eye icon to view details | Print icon for PDF
// // // // //                 </span>
// // // // //             </div>

// // // // //             <style jsx>{`
// // // // //                 .modal-overlay {
// // // // //                     position: fixed;
// // // // //                     top: 0;
// // // // //                     left: 0;
// // // // //                     right: 0;
// // // // //                     bottom: 0;
// // // // //                     background: rgba(0,0,0,0.5);
// // // // //                     display: flex;
// // // // //                     justify-content: center;
// // // // //                     align-items: center;
// // // // //                     z-index: 1000;
// // // // //                 }

// // // // //                 .modal-content {
// // // // //                     background: white;
// // // // //                     border-radius: 8px;
// // // // //                     width: 90%;
// // // // //                     max-width: 1000px;
// // // // //                     max-height: 80vh;
// // // // //                     overflow-y: auto;
// // // // //                     box-shadow: 0 4px 20px rgba(0,0,0,0.2);
// // // // //                 }

// // // // //                 .modal-header {
// // // // //                     display: flex;
// // // // //                     justify-content: space-between;
// // // // //                     align-items: center;
// // // // //                     padding: 15px 20px;
// // // // //                     border-bottom: 1px solid #e0e0e0;
// // // // //                     background: #f5f5f5;
// // // // //                     border-radius: 8px 8px 0 0;
// // // // //                 }

// // // // //                 .modal-header h2 {
// // // // //                     margin: 0;
// // // // //                     color: #4CAF50;
// // // // //                 }

// // // // //                 .close-btn {
// // // // //                     background: none;
// // // // //                     border: none;
// // // // //                     font-size: 24px;
// // // // //                     cursor: pointer;
// // // // //                     color: #999;
// // // // //                 }

// // // // //                 .close-btn:hover {
// // // // //                     color: #f44336;
// // // // //                 }

// // // // //                 .modal-body {
// // // // //                     padding: 20px;
// // // // //                 }

// // // // //                 .invoice-info {
// // // // //                     display: grid;
// // // // //                     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
// // // // //                     gap: 10px;
// // // // //                     margin-bottom: 20px;
// // // // //                     padding: 15px;
// // // // //                     background: #f9f9f9;
// // // // //                     border-radius: 4px;
// // // // //                 }

// // // // //                 .modal-footer {
// // // // //                     padding: 15px 20px;
// // // // //                     border-top: 1px solid #e0e0e0;
// // // // //                     display: flex;
// // // // //                     justify-content: flex-end;
// // // // //                     gap: 10px;
// // // // //                 }
// // // // //             `}</style>
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // // export default InvoiceList;


// // // // import React, { useState, useEffect } from 'react';
// // // // import { toast } from 'react-hot-toast';
// // // // import { FiEye, FiPrinter, FiTrash2, FiCalendar, FiSearch } from 'react-icons/fi';
// // // // import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// // // // import { NavigationContext } from '../App';
// // // // import { useNavigate } from 'react-router-dom';
// // // // import { useContext } from 'react';

// // // // function InvoiceList() {
// // // //     const navigate = useNavigate();
// // // //     const { goBack } = useContext(NavigationContext);
// // // //     const [invoices, setInvoices] = useState([]);
// // // //     const [filteredInvoices, setFilteredInvoices] = useState([]);
// // // //     const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
// // // //     const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
// // // //     const [searchTerm, setSearchTerm] = useState('');
// // // //     const [selectedInvoice, setSelectedInvoice] = useState(null);
// // // //     const [showDetails, setShowDetails] = useState(false);

// // // //     useEffect(() => {
// // // //         loadInvoices();
// // // //     }, []);

// // // //     useEffect(() => {
// // // //         filterInvoices();
// // // //     }, [invoices, startDate, endDate, searchTerm]);

// // // //     const loadInvoices = async () => {
// // // //         try {
// // // //             const data = await window.electron.database.getInvoices();
// // // //             setInvoices(data || []);
// // // //         } catch (error) {
// // // //             console.error('Failed to load invoices:', error);
// // // //             toast.error('Failed to load invoices');
// // // //         }
// // // //     };

// // // //     const filterInvoices = () => {
// // // //         let filtered = [...invoices];

// // // //         filtered = filtered.filter(inv => {
// // // //             const invDate = inv.invoice_date;
// // // //             return invDate >= startDate && invDate <= endDate;
// // // //         });

// // // //         if (searchTerm.trim()) {
// // // //             filtered = filtered.filter(inv =>
// // // //                 inv.voucher_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //                 inv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //                 inv.order_no?.toLowerCase().includes(searchTerm.toLowerCase())
// // // //             );
// // // //         }

// // // //         setFilteredInvoices(filtered);
// // // //     };

// // // //     const handleViewDetails = async (invoice) => {
// // // //         try {
// // // //             const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // //             setSelectedInvoice({ ...invoice, details });
// // // //             setShowDetails(true);
// // // //         } catch (error) {
// // // //             console.error('Failed to load invoice details:', error);
// // // //             toast.error('Failed to load invoice details');
// // // //         }
// // // //     };

// // // //     const generatePDF = async (invoice, details) => {
// // // //         try {
// // // //             const pdfDoc = await PDFDocument.create();
// // // //             const page = pdfDoc.addPage([600, 800]);
// // // //             const { width, height } = page.getSize();

// // // //             const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
// // // //             const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

// // // //             let yPosition = height - 50;

// // // //             // Header
// // // //             page.drawText('INVENTORY MANAGEMENT SYSTEM', {
// // // //                 x: width / 2 - 150,
// // // //                 y: yPosition,
// // // //                 size: 20,
// // // //                 font: helveticaBold
// // // //             });

// // // //             yPosition -= 30;
// // // //             page.drawText('SALE INVOICE', {
// // // //                 x: width / 2 - 60,
// // // //                 y: yPosition,
// // // //                 size: 16,
// // // //                 font: helveticaBold
// // // //             });

// // // //             yPosition -= 40;

// // // //             // Invoice details
// // // //             page.drawText(`Voucher ID: ${invoice.voucher_id}`, {
// // // //                 x: 50,
// // // //                 y: yPosition,
// // // //                 size: 10,
// // // //                 font: helveticaFont
// // // //             });

// // // //             page.drawText(`Date: ${invoice.invoice_date}`, {
// // // //                 x: 50,
// // // //                 y: yPosition - 15,
// // // //                 size: 10,
// // // //                 font: helveticaFont
// // // //             });

// // // //             page.drawText(`Order No: ${invoice.order_no || 'N/A'}`, {
// // // //                 x: 50,
// // // //                 y: yPosition - 30,
// // // //                 size: 10,
// // // //                 font: helveticaFont
// // // //             });

// // // //             page.drawText(`Customer: ${invoice.customer_name}`, {
// // // //                 x: 50,
// // // //                 y: yPosition - 45,
// // // //                 size: 10,
// // // //                 font: helveticaFont
// // // //             });

// // // //             if (invoice.notes) {
// // // //                 page.drawText(`Notes: ${invoice.notes}`, {
// // // //                     x: 50,
// // // //                     y: yPosition - 60,
// // // //                     size: 10,
// // // //                     font: helveticaFont
// // // //                 });
// // // //             }

// // // //             // Table header
// // // //             const startY = invoice.notes ? yPosition - 95 : yPosition - 75;
// // // //             const headers = ['Sr.', 'Item', 'Qty', 'Rate', 'Amount'];
// // // //             const columnWidths = [40, 280, 80, 100, 120];
// // // //             let xPosition = 50;

// // // //             page.drawRectangle({
// // // //                 x: 50,
// // // //                 y: startY - 20,
// // // //                 width: width - 100,
// // // //                 height: 25,
// // // //                 color: rgb(0.3, 0.6, 0.3)
// // // //             });

// // // //             headers.forEach((header, index) => {
// // // //                 page.drawText(header, {
// // // //                     x: xPosition + 5,
// // // //                     y: startY - 15,
// // // //                     size: 10,
// // // //                     font: helveticaBold,
// // // //                     color: rgb(1, 1, 1)
// // // //                 });
// // // //                 xPosition += columnWidths[index];
// // // //             });

// // // //             // Table rows
// // // //             let currentY = startY - 35;
// // // //             details.forEach((item, idx) => {
// // // //                 if (currentY < 50) {
// // // //                     const newPage = pdfDoc.addPage([600, 800]);
// // // //                     currentY = height - 50;
// // // //                 }

// // // //                 xPosition = 50;
// // // //                 const rowData = [
// // // //                     (idx + 1).toString(),
// // // //                     item.item_name,
// // // //                     item.quantity.toString(),
// // // //                     `₨ ${item.rate?.toLocaleString() || 0}`,
// // // //                     `₨ ${item.amount?.toLocaleString() || 0}`
// // // //                 ];

// // // //                 rowData.forEach((data, colIdx) => {
// // // //                     page.drawText(data, {
// // // //                         x: xPosition + 5,
// // // //                         y: currentY,
// // // //                         size: 9,
// // // //                         font: helveticaFont
// // // //                     });
// // // //                     xPosition += columnWidths[colIdx];
// // // //                 });
// // // //                 currentY -= 20;
// // // //             });

// // // //             // Totals
// // // //             currentY -= 20;
// // // //             page.drawText(`Total Items: ${invoice.total_weight || 0}`, {
// // // //                 x: width - 200,
// // // //                 y: currentY,
// // // //                 size: 10,
// // // //                 font: helveticaFont
// // // //             });

// // // //             page.drawText(`Total Amount: ₨ ${(invoice.total_amount || 0).toLocaleString()}`, {
// // // //                 x: width - 200,
// // // //                 y: currentY - 15,
// // // //                 size: 10,
// // // //                 font: helveticaFont
// // // //             });

// // // //             page.drawText(`Discount: ₨ ${(invoice.discount || 0).toLocaleString()}`, {
// // // //                 x: width - 200,
// // // //                 y: currentY - 30,
// // // //                 size: 10,
// // // //                 font: helveticaFont
// // // //             });

// // // //             page.drawText(`Net Amount: ₨ ${(invoice.net_amount || 0).toLocaleString()}`, {
// // // //                 x: width - 200,
// // // //                 y: currentY - 45,
// // // //                 size: 12,
// // // //                 font: helveticaBold,
// // // //                 color: rgb(0, 0.5, 0)
// // // //             });

// // // //             // Footer
// // // //             const finalY = currentY - 65;
// // // //             page.drawText('Generated by Inventory Management System', {
// // // //                 x: width / 2 - 120,
// // // //                 y: finalY,
// // // //                 size: 8,
// // // //                 font: helveticaFont,
// // // //                 color: rgb(0.5, 0.5, 0.5)
// // // //             });

// // // //             const pdfBytes = await pdfDoc.save();
// // // //             const blob = new Blob([pdfBytes], { type: 'application/pdf' });
// // // //             const link = document.createElement('a');
// // // //             link.href = URL.createObjectURL(blob);
// // // //             link.download = `Invoice_${invoice.voucher_id}.pdf`;
// // // //             link.click();
// // // //             URL.revokeObjectURL(link.href);

// // // //             toast.success('Invoice printed successfully');
// // // //         } catch (error) {
// // // //             console.error('PDF generation error:', error);
// // // //             toast.error('Failed to generate PDF');
// // // //         }
// // // //     };

// // // //     const handlePrint = async (invoice) => {
// // // //         try {
// // // //             const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // //             await generatePDF(invoice, details);
// // // //         } catch (error) {
// // // //             console.error('Failed to generate PDF:', error);
// // // //             toast.error('Failed to generate PDF');
// // // //         }
// // // //     };

// // // //     const handleDelete = async (id) => {
// // // //         if (window.confirm('Are you sure you want to delete this invoice?')) {
// // // //             try {
// // // //                 await window.electron.database.deleteInvoice(id);
// // // //                 toast.success('Invoice deleted successfully');
// // // //                 loadInvoices();
// // // //                 setShowDetails(false);
// // // //             } catch (error) {
// // // //                 console.error('Failed to delete invoice:', error);
// // // //                 toast.error('Failed to delete invoice');
// // // //             }
// // // //         }
// // // //     };

// // // //     const getTotalAmount = () => {
// // // //         return filteredInvoices.reduce((sum, inv) => sum + (inv.net_amount || 0), 0);
// // // //     };

// // // //     const getTotalWeight = () => {
// // // //         return filteredInvoices.reduce((sum, inv) => sum + (inv.total_weight || 0), 0);
// // // //     };

// // // //     return (
// // // //         <div className="container">
// // // //             <div className="header">
// // // //                 <h1>Sale Customer List</h1>
// // // //                 <button className="btn-primary" onClick={() => navigate('/invoices/new')}>
// // // //                     Create New Invoice
// // // //                 </button>
// // // //             </div>

// // // //             {/* Date Range Filter */}
// // // //             <div className="form-panel">
// // // //                 <div className="form-grid">
// // // //                     <div className="form-group">
// // // //                         <label>Date Range</label>
// // // //                         <div style={{ display: 'flex', gap: '10px' }}>
// // // //                             <input
// // // //                                 type="date"
// // // //                                 value={startDate}
// // // //                                 onChange={(e) => setStartDate(e.target.value)}
// // // //                             />
// // // //                             <span>to</span>
// // // //                             <input
// // // //                                 type="date"
// // // //                                 value={endDate}
// // // //                                 onChange={(e) => setEndDate(e.target.value)}
// // // //                             />
// // // //                         </div>
// // // //                     </div>
// // // //                     <div className="form-group">
// // // //                         <label>Search</label>
// // // //                         <div className="search-box">
// // // //                             <FiSearch />
// // // //                             <input
// // // //                                 type="text"
// // // //                                 placeholder="Search by Voucher ID, Customer..."
// // // //                                 value={searchTerm}
// // // //                                 onChange={(e) => setSearchTerm(e.target.value)}
// // // //                             />
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>
// // // //             </div>

// // // //             {/* Summary Stats */}
// // // //             <div className="stats-grid" style={{ marginBottom: '20px' }}>
// // // //                 <div className="stat-card">
// // // //                     <h3>Total Invoices</h3>
// // // //                     <div className="stat-value">{filteredInvoices.length}</div>
// // // //                 </div>
// // // //                 <div className="stat-card">
// // // //                     <h3>Total Items</h3>
// // // //                     <div className="stat-value">{getTotalWeight().toLocaleString()}</div>
// // // //                 </div>
// // // //                 <div className="stat-card">
// // // //                     <h3>Total Amount</h3>
// // // //                     <div className="stat-value">₨ {getTotalAmount().toLocaleString()}</div>
// // // //                 </div>
// // // //             </div>

// // // //             {/* Invoices Table */}
// // // //             <div className="table-container">
// // // //                 <table className="data-table">
// // // //                     <thead>
// // // //                         <tr>
// // // //                             <th>ID</th>
// // // //                             <th>Voucher ID</th>
// // // //                             <th>Order No.</th>
// // // //                             <th>Date</th>
// // // //                             <th>Customer</th>
// // // //                             <th>Total Items</th>
// // // //                             <th>Total Amount</th>
// // // //                             <th>Created By</th>
// // // //                             <th>Actions</th>
// // // //                         </tr>
// // // //                     </thead>
// // // //                     <tbody>
// // // //                         {filteredInvoices.map((invoice) => (
// // // //                             <tr key={invoice.invoice_id}>
// // // //                                 <td>{invoice.invoice_id}</td>
// // // //                                 <td><strong>{invoice.voucher_id}</strong></td>
// // // //                                 <td>{invoice.order_no || '-'}</td>
// // // //                                 <td>{invoice.invoice_date}</td>
// // // //                                 <td>{invoice.customer_name}</td>
// // // //                                 <td>{invoice.total_weight}</td>
// // // //                                 <td>₨ {invoice.total_amount?.toLocaleString()}</td>
// // // //                                 <td>{invoice.created_by}</td>
// // // //                                 <td className="actions">
// // // //                                     <button className="icon-btn" onClick={() => handleViewDetails(invoice)} title="View Details">
// // // //                                         <FiEye />
// // // //                                     </button>
// // // //                                     <button className="icon-btn" onClick={() => handlePrint(invoice)} title="Print">
// // // //                                         <FiPrinter />
// // // //                                     </button>
// // // //                                     <button className="icon-btn danger" onClick={() => handleDelete(invoice.invoice_id)} title="Delete">
// // // //                                         <FiTrash2 />
// // // //                                     </button>
// // // //                                 </td>
// // // //                             </tr>
// // // //                         ))}
// // // //                         {filteredInvoices.length === 0 && (
// // // //                             <tr>
// // // //                                 <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
// // // //                                     No invoices found for the selected date range
// // // //                                 </td>
// // // //                             </tr>
// // // //                         )}
// // // //                     </tbody>
// // // //                 </table>
// // // //             </div>

// // // //             {/* Invoice Details Modal */}
// // // //             {showDetails && selectedInvoice && (
// // // //                 <div className="modal-overlay" onClick={() => setShowDetails(false)}>
// // // //                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
// // // //                         <div className="modal-header">
// // // //                             <h2>Invoice Details - {selectedInvoice.voucher_id}</h2>
// // // //                             <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
// // // //                         </div>
// // // //                         <div className="modal-body">
// // // //                             <div className="invoice-info">
// // // //                                 <p><strong>Date:</strong> {selectedInvoice.invoice_date}</p>
// // // //                                 <p><strong>Customer:</strong> {selectedInvoice.customer_name}</p>
// // // //                                 <p><strong>Order No:</strong> {selectedInvoice.order_no || 'N/A'}</p>
// // // //                                 <p><strong>Notes:</strong> {selectedInvoice.notes || 'N/A'}</p>
// // // //                             </div>

// // // //                             <table className="data-table">
// // // //                                 <thead>
// // // //                                     <tr>
// // // //                                         <th>Sr.</th>
// // // //                                         <th>Item</th>
// // // //                                         <th>Qty</th>
// // // //                                         <th>Rate</th>
// // // //                                         <th>Amount</th>
// // // //                                     </tr>
// // // //                                 </thead>
// // // //                                 <tbody>
// // // //                                     {selectedInvoice.details?.map((item, idx) => (
// // // //                                         <tr key={idx}>
// // // //                                             <td>{idx + 1}</td>
// // // //                                             <td>{item.item_name}</td>
// // // //                                             <td>{item.quantity}</td>
// // // //                                             <td>₨ {item.rate?.toLocaleString()}</td>
// // // //                                             <td>₨ {item.amount?.toLocaleString()}</td>
// // // //                                         </tr>
// // // //                                     ))}
// // // //                                 </tbody>
// // // //                                 <tfoot>
// // // //                                     <tr>
// // // //                                         <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total Items:</strong></td>
// // // //                                         <td><strong>{selectedInvoice.total_weight}</strong></td>
// // // //                                     </tr>
// // // //                                     <tr>
// // // //                                         <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total Amount:</strong></td>
// // // //                                         <td><strong>₨ {selectedInvoice.total_amount?.toLocaleString()}</strong></td>
// // // //                                     </tr>
// // // //                                     <tr>
// // // //                                         <td colSpan="4" style={{ textAlign: 'right' }}><strong>Discount:</strong></td>
// // // //                                         <td><strong>₨ {selectedInvoice.discount?.toLocaleString()}</strong></td>
// // // //                                     </tr>
// // // //                                     <tr>
// // // //                                         <td colSpan="4" style={{ textAlign: 'right' }}><strong>Net Amount:</strong></td>
// // // //                                         <td><strong>₨ {selectedInvoice.net_amount?.toLocaleString()}</strong></td>
// // // //                                     </tr>
// // // //                                 </tfoot>
// // // //                             </table>
// // // //                         </div>
// // // //                         <div className="modal-footer">
// // // //                             <button className="btn-primary" onClick={() => handlePrint(selectedInvoice)}>
// // // //                                 <FiPrinter /> Print
// // // //                             </button>
// // // //                             <button className="btn-danger" onClick={() => setShowDetails(false)}>
// // // //                                 Close
// // // //                             </button>
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>
// // // //             )}

// // // //             <div className="status-bar">
// // // //                 <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
// // // //                 <span className="shortcuts-hint">
// // // //                     Shortcuts: Click on Eye icon to view details | Print icon for PDF
// // // //                 </span>
// // // //             </div>

// // // //             <style jsx>{`
// // // //                 .modal-overlay {
// // // //                     position: fixed;
// // // //                     top: 0;
// // // //                     left: 0;
// // // //                     right: 0;
// // // //                     bottom: 0;
// // // //                     background: rgba(0,0,0,0.5);
// // // //                     display: flex;
// // // //                     justify-content: center;
// // // //                     align-items: center;
// // // //                     z-index: 1000;
// // // //                 }

// // // //                 .modal-content {
// // // //                     background: white;
// // // //                     border-radius: 8px;
// // // //                     width: 90%;
// // // //                     max-width: 1000px;
// // // //                     max-height: 80vh;
// // // //                     overflow-y: auto;
// // // //                     box-shadow: 0 4px 20px rgba(0,0,0,0.2);
// // // //                 }

// // // //                 .modal-header {
// // // //                     display: flex;
// // // //                     justify-content: space-between;
// // // //                     align-items: center;
// // // //                     padding: 15px 20px;
// // // //                     border-bottom: 1px solid #e0e0e0;
// // // //                     background: #f5f5f5;
// // // //                     border-radius: 8px 8px 0 0;
// // // //                 }

// // // //                 .modal-header h2 {
// // // //                     margin: 0;
// // // //                     color: #4CAF50;
// // // //                 }

// // // //                 .close-btn {
// // // //                     background: none;
// // // //                     border: none;
// // // //                     font-size: 24px;
// // // //                     cursor: pointer;
// // // //                     color: #999;
// // // //                 }

// // // //                 .close-btn:hover {
// // // //                     color: #f44336;
// // // //                 }

// // // //                 .modal-body {
// // // //                     padding: 20px;
// // // //                 }

// // // //                 .invoice-info {
// // // //                     display: grid;
// // // //                     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
// // // //                     gap: 10px;
// // // //                     margin-bottom: 20px;
// // // //                     padding: 15px;
// // // //                     background: #f9f9f9;
// // // //                     border-radius: 4px;
// // // //                 }

// // // //                 .modal-footer {
// // // //                     padding: 15px 20px;
// // // //                     border-top: 1px solid #e0e0e0;
// // // //                     display: flex;
// // // //                     justify-content: flex-end;
// // // //                     gap: 10px;
// // // //                 }
// // // //             `}</style>
// // // //         </div>
// // // //     );
// // // // }

// // // // export default InvoiceList;

// // // import React, { useState, useEffect } from 'react';
// // // import { toast } from 'react-hot-toast';
// // // import { FiEye, FiPrinter, FiTrash2, FiCalendar, FiEdit, FiSearch, FiPlus, FiFileText, FiDownload } from 'react-icons/fi';
// // // import { NavigationContext } from '../App';
// // // import { useNavigate } from 'react-router-dom';
// // // import { useContext } from 'react';

// // // function InvoiceList() {
// // //     const navigate = useNavigate();
// // //     const { goBack } = useContext(NavigationContext);
// // //     const [invoices, setInvoices] = useState([]);
// // //     const [filteredInvoices, setFilteredInvoices] = useState([]);
// // //     const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
// // //     const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
// // //     const [searchTerm, setSearchTerm] = useState('');
// // //     const [selectedInvoice, setSelectedInvoice] = useState(null);
// // //     const [showDetails, setShowDetails] = useState(false);
// // //     const [loading, setLoading] = useState(false);

// // //     useEffect(() => {
// // //         loadInvoices();
// // //     }, []);

// // //     useEffect(() => {
// // //         filterInvoices();
// // //     }, [invoices, startDate, endDate, searchTerm]);



// // //     useEffect(() => {
// // //         const handleKeyDown = (event) => {
// // //             if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
// // //                 event.preventDefault();
// // //                 navigate('/invoices/new');
// // //                 toast.success('Opening new invoice form...');
// // //             }
// // //         };

// // //         window.addEventListener('keydown', handleKeyDown);
// // //         return () => {
// // //             window.removeEventListener('keydown', handleKeyDown);
// // //         };
// // //     }, [navigate]);



// // //     const loadInvoices = async () => {
// // //         try {
// // //             const data = await window.electron.database.getInvoices();
// // //             setInvoices(data || []);
// // //         } catch (error) {
// // //             console.error('Failed to load invoices:', error);
// // //             toast.error('Failed to load invoices');
// // //         }
// // //     };

// // //     const handleEdit = (invoice) => {
// // //         // Navigate to invoice management with the invoice data
// // //         navigate('/invoices/edit', { state: { invoice } });
// // //     };




// // //     const filterInvoices = () => {
// // //         let filtered = [...invoices];

// // //         filtered = filtered.filter(inv => {
// // //             const invDate = inv.invoice_date;
// // //             return invDate >= startDate && invDate <= endDate;
// // //         });

// // //         if (searchTerm.trim()) {
// // //             filtered = filtered.filter(inv =>
// // //                 inv.voucher_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //                 inv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //                 inv.order_no?.toLowerCase().includes(searchTerm.toLowerCase())
// // //             );
// // //         }

// // //         setFilteredInvoices(filtered);
// // //     };

// // //     const handleViewDetails = async (invoice) => {
// // //         try {
// // //             const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // //             setSelectedInvoice({ ...invoice, details });
// // //             setShowDetails(true);
// // //         } catch (error) {
// // //             console.error('Failed to load invoice details:', error);
// // //             toast.error('Failed to load invoice details');
// // //         }
// // //     };

// // //     // const generateReportHTML = async () => {
// // //     //     setLoading(true);
// // //     //     try {
// // //     //         // Get all invoices in date range with their details
// // //     //         const invoicesInRange = invoices.filter(inv => {
// // //     //             const invDate = inv.invoice_date;
// // //     //             return invDate >= startDate && invDate <= endDate;
// // //     //         });

// // //     //         // Group invoices by customer
// // //     //         const customerGroups = {};
// // //     //         for (const invoice of invoicesInRange) {
// // //     //             const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // //     //             if (!customerGroups[invoice.customer_name]) {
// // //     //                 customerGroups[invoice.customer_name] = {
// // //     //                     customerName: invoice.customer_name,
// // //     //                     customerId: invoice.account_id,
// // //     //                     invoices: [],
// // //     //                     totalItems: 0,
// // //     //                     totalAmount: 0,
// // //     //                     discount: 0,
// // //     //                     netAmount: 0
// // //     //                 };
// // //     //             }

// // //     //             customerGroups[invoice.customer_name].invoices.push({
// // //     //                 ...invoice,
// // //     //                 details
// // //     //             });
// // //     //             customerGroups[invoice.customer_name].totalItems += invoice.total_weight || 0;
// // //     //             customerGroups[invoice.customer_name].totalAmount += invoice.total_amount || 0;
// // //     //             customerGroups[invoice.customer_name].discount += invoice.discount || 0;
// // //     //             customerGroups[invoice.customer_name].netAmount += invoice.net_amount || 0;
// // //     //         }

// // //     //         // Prepare items summary per customer
// // //     //         const customerItemsSummary = {};
// // //     //         for (const [customerName, customerData] of Object.entries(customerGroups)) {
// // //     //             const itemsSummary = {};
// // //     //             for (const invoice of customerData.invoices) {
// // //     //                 for (const item of invoice.details) {
// // //     //                     const itemKey = item.item_id;
// // //     //                     if (!itemsSummary[itemKey]) {
// // //     //                         itemsSummary[itemKey] = {
// // //     //                             itemName: item.item_name,
// // //     //                             itemNameUrdu: item.item_name_urdu || '',
// // //     //                             totalQuantity: 0,
// // //     //                             totalAmount: 0,
// // //     //                             avgRate: 0
// // //     //                         };
// // //     //                     }
// // //     //                     itemsSummary[itemKey].totalQuantity += item.quantity;
// // //     //                     itemsSummary[itemKey].totalAmount += item.amount;
// // //     //                 }
// // //     //             }

// // //     //             // Calculate average rate for each item
// // //     //             for (const item of Object.values(itemsSummary)) {
// // //     //                 item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
// // //     //             }

// // //     //             customerItemsSummary[customerName] = Object.values(itemsSummary);
// // //     //         }

// // //     //         // Generate HTML for PDF
// // //     //         const formattedStartDate = formatDateForDisplay(startDate);
// // //     //         const formattedEndDate = formatDateForDisplay(endDate);
// // //     //         const currentDate = formatDateForDisplay(new Date().toISOString().split('T')[0]);

// // //     //         const html = `
// // //     //         <!DOCTYPE html>
// // //     //         <html dir="rtl">
// // //     //         <head>
// // //     //             <meta charset="UTF-8">
// // //     //             <title>تقرير المبيعات ${formattedStartDate} إلى ${formattedEndDate}</title>
// // //     //             <style>
// // //     //                 * {
// // //     //                     margin: 0;
// // //     //                     padding: 0;
// // //     //                     box-sizing: border-box;
// // //     //                 }

// // //     //                 body {
// // //     //                     font-family: 'Segoe UI', 'Arial', 'Noto Nastaliq Urdu', 'Urdu Typesetting', sans-serif;
// // //     //                     padding: 20px;
// // //     //                     background: white;
// // //     //                     color: #333;
// // //     //                 }

// // //     //                 .report-container {
// // //     //                     max-width: 1200px;
// // //     //                     margin: 0 auto;
// // //     //                 }

// // //     //                 /* Header Section */
// // //     //                 .header {
// // //     //                     text-align: center;
// // //     //                     margin-bottom: 30px;
// // //     //                     padding-bottom: 20px;
// // //     //                     border-bottom: 3px solid #4CAF50;
// // //     //                 }

// // //     //                 .company-name {
// // //     //                     font-size: 28px;
// // //     //                     font-weight: bold;
// // //     //                     color: #2c3e50;
// // //     //                     margin-bottom: 5px;
// // //     //                 }

// // //     //                 .report-title {
// // //     //                     font-size: 24px;
// // //     //                     font-weight: bold;
// // //     //                     color: #4CAF50;
// // //     //                     margin-top: 10px;
// // //     //                 }

// // //     //                 .date-range {
// // //     //                     font-size: 14px;
// // //     //                     color: #666;
// // //     //                     margin-top: 10px;
// // //     //                 }

// // //     //                 /* Customer Section */
// // //     //                 .customer-section {
// // //     //                     margin-bottom: 40px;
// // //     //                     page-break-after: always;
// // //     //                 }

// // //     //                 .customer-section:last-child {
// // //     //                     page-break-after: auto;
// // //     //                 }

// // //     //                 .customer-header {
// // //     //                     text-align: center;
// // //     //                     margin-bottom: 20px;
// // //     //                     padding: 10px;
// // //     //                     border-bottom: 2px solid #4CAF50;
// // //     //                 }

// // //     //                 .customer-name {
// // //     //                     font-size: 24px;
// // //     //                     font-weight: bold;
// // //     //                     color: #2c3e50;
// // //     //                     margin-bottom: 5px;
// // //     //                 }

// // //     //                 .customer-date {
// // //     //                     font-size: 12px;
// // //     //                     color: #666;
// // //     //                     margin-top: 5px;
// // //     //                 }

// // //     //                 /* Items Table */
// // //     //                 .items-table {
// // //     //                     width: 100%;
// // //     //                     border-collapse: collapse;
// // //     //                     margin-bottom: 20px;
// // //     //                     font-family: monospace;
// // //     //                 }

// // //     //                 .items-table th {
// // //     //                     background: #f5f5f5;
// // //     //                     border: 1px solid #ddd;
// // //     //                     padding: 12px;
// // //     //                     text-align: center;
// // //     //                     font-size: 14px;
// // //     //                     font-weight: bold;
// // //     //                 }

// // //     //                 .items-table td {
// // //     //                     border: 1px solid #ddd;
// // //     //                     padding: 10px 12px;
// // //     //                     text-align: center;
// // //     //                     font-size: 13px;
// // //     //                 }

// // //     //                 .items-table td:first-child {
// // //     //                     font-weight: bold;
// // //     //                 }

// // //     //                 .text-right {
// // //     //                     text-align: right;
// // //     //                 }

// // //     //                 .text-left {
// // //     //                     text-align: left;
// // //     //                 }

// // //     //                 /* Totals Row */
// // //     //                 .totals-row {
// // //     //                     margin-top: 20px;
// // //     //                     border-top: 2px solid #ddd;
// // //     //                     padding-top: 15px;
// // //     //                     text-align: right;
// // //     //                 }

// // //     //                 .totals-row table {
// // //     //                     width: 100%;
// // //     //                     border-collapse: collapse;
// // //     //                 }

// // //     //                 .totals-row td {
// // //     //                     padding: 8px;
// // //     //                     font-size: 14px;
// // //     //                 }

// // //     //                 .totals-label {
// // //     //                     font-weight: bold;
// // //     //                 }

// // //     //                 .grand-total {
// // //     //                     font-size: 16px;
// // //     //                     font-weight: bold;
// // //     //                     color: #4CAF50;
// // //     //                 }

// // //     //                 /* Footer */
// // //     //                 .footer {
// // //     //                     margin-top: 40px;
// // //     //                     padding-top: 20px;
// // //     //                     text-align: center;
// // //     //                     border-top: 1px solid #e0e0e0;
// // //     //                     font-size: 10px;
// // //     //                     color: #999;
// // //     //                 }

// // //     //                 .footer-phone {
// // //     //                     font-size: 12px;
// // //     //                     color: #4CAF50;
// // //     //                     margin-top: 5px;
// // //     //                 }

// // //     //                 @media print {
// // //     //                     body {
// // //     //                         padding: 10px;
// // //     //                     }
// // //     //                     .customer-section {
// // //     //                         page-break-after: always;
// // //     //                     }
// // //     //                     .items-table th,
// // //     //                     .items-table td {
// // //     //                         border-color: #000;
// // //     //                     }
// // //     //                 }
// // //     //             </style>
// // //     //         </head>
// // //     //         <body>
// // //     //             <div class="report-container">
// // //     //                 ${Object.entries(customerGroups).map(([customerName, customerData]) => {
// // //     //             const itemsSummary = customerItemsSummary[customerName] || [];
// // //     //             const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
// // //     //             const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);

// // //     //             // Get the most recent invoice date for this customer
// // //     //             const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
// // //     //             const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());

// // //     //             return `
// // //     //                         <div class="customer-section">
// // //     //                             <div class="customer-header">
// // //     //                                 <div class="customer-name" style="font-weight: bold;font-size: 40px; direction: rtl; color: #2c3e50; margin-bottom: 5px; height: 150px; line-height: 20px; background: #dedbdb; width: 100%; display: flex; align-items: center; justify-content: center; justify-content: center;">${customerName}</div>
// // //     //                                 <div class="customer-date" style="direction: rtl; display: flex; align-items: center; justify-content: start; font-size: 18px;"><span style="font-weight: bold; marginBottom:'5px';"> تاریخ :<span/>         ${invoiceDate}</div>
// // //     //                             </div>

// // //     //                             <table class="items-table">
// // //     //                                 <thead>
// // //     //                                     <tr>
// // //     //                                     <th style="font-weight: 700;font-size: 20px;">تعداد </th>
// // //     //                                     <th style="font-weight: 700;font-size: 20px;" > آئٹم</th>
// // //     //                                     <th style="font-weight: 700;font-size: 20px;">ریٹ</th>
// // //     //                                     <th style="font-weight: 700;font-size: 20px;">رقم </th>
// // //     //                                     </tr>
// // //     //                                 </thead>
// // //     //                                 <tbody>
// // //     //                                     ${itemsSummary.map((item) => `
// // //     //                                         <tr>
// // //     //                                         <td style=";font-size: 16px;" >${item.totalQuantity.toLocaleString()}</td>
// // //     //                                         <td style=";font-size: 16px;">${item.itemNameUrdu || item.itemName}</td>
// // //     //                                         <td style=";font-size: 16px;"> ${Math.round(item.avgRate).toLocaleString()}</td>
// // //     //                                         <td style=";font-size: 16px;"> ${item.totalAmount.toLocaleString()}</td>
// // //     //                                         </tr>
// // //     //                                     `).join('')}
// // //     //                                     <tr style="border-top: 2px solid #ddd; font-weight: bold; background: #f9f9f9;">
// // //     //                                     <td style="font-weight: bold;font-size: 18px;" >${totalItems.toLocaleString()}</td>
// // //     //                                     <td>-</td>
// // //     //                                     <td>-</td>
// // //     //                                     <td style="font-weight: bold;font-size: 18px;" > ${totalAmount.toLocaleString()}</td>
// // //     //                                     </tr>
// // //     //                                 </tbody>
// // //     //                             </table>
// // //     //                         </div>
// // //     //                     `;
// // //     //         }).join('')}

// // //     //             </div>
// // //     //         </body>
// // //     //         </html>
// // //     //     `;

// // //     //         return html;
// // //     //     } catch (error) {
// // //     //         console.error('Error generating report HTML:', error);
// // //     //         toast.error('Failed to generate report');
// // //     //         return null;
// // //     //     } finally {
// // //     //         setLoading(false);
// // //     //     }
// // //     // };


// // //     const generateReportHTML = async () => {
// // //         setLoading(true);
// // //         try {
// // //             // Get all invoices in date range with their details
// // //             const invoicesInRange = invoices.filter(inv => {
// // //                 const invDate = inv.invoice_date;
// // //                 return invDate >= startDate && invDate <= endDate;
// // //             });

// // //             // Group invoices by customer and fetch customer Urdu names
// // //             const customerGroups = {};
// // //             for (const invoice of invoicesInRange) {
// // //                 // Fetch customer details including Urdu name
// // //                 let customerUrduName = '';
// // //                 if (invoice.account_id) {
// // //                     const account = await window.electron.database.getAccountById(invoice.account_id);
// // //                     customerUrduName = account?.customer_name_urdu || '';
// // //                 }

// // //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);

// // //                 // Fetch product details including Urdu name for each item
// // //                 const enrichedDetails = await Promise.all(details.map(async (item) => {
// // //                     if (item.item_id) {
// // //                         const product = await window.electron.database.getProductById(item.item_id);
// // //                         return {
// // //                             ...item,
// // //                             item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
// // //                         };
// // //                     }
// // //                     return item;
// // //                 }));

// // //                 const customerKey = invoice.customer_name;
// // //                 if (!customerGroups[customerKey]) {
// // //                     customerGroups[customerKey] = {
// // //                         customerName: invoice.customer_name,
// // //                         customerNameUrdu: customerUrduName,
// // //                         customerId: invoice.account_id,
// // //                         invoices: [],
// // //                         totalItems: 0,
// // //                         totalAmount: 0,
// // //                         discount: 0,
// // //                         netAmount: 0
// // //                     };
// // //                 } else if (customerUrduName && !customerGroups[customerKey].customerNameUrdu) {
// // //                     // Update Urdu name if found later
// // //                     customerGroups[customerKey].customerNameUrdu = customerUrduName;
// // //                 }

// // //                 customerGroups[customerKey].invoices.push({
// // //                     ...invoice,
// // //                     details: enrichedDetails
// // //                 });
// // //                 customerGroups[customerKey].totalItems += invoice.total_weight || 0;
// // //                 customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
// // //                 customerGroups[customerKey].discount += invoice.discount || 0;
// // //                 customerGroups[customerKey].netAmount += invoice.net_amount || 0;
// // //             }

// // //             // Prepare items summary per customer with Urdu names
// // //             const customerItemsSummary = {};
// // //             for (const [customerName, customerData] of Object.entries(customerGroups)) {
// // //                 const itemsSummary = {};
// // //                 for (const invoice of customerData.invoices) {
// // //                     for (const item of invoice.details) {
// // //                         const itemKey = item.item_id;
// // //                         if (!itemsSummary[itemKey]) {
// // //                             itemsSummary[itemKey] = {
// // //                                 itemName: item.item_name,
// // //                                 itemNameUrdu: item.item_name_urdu || '',
// // //                                 totalQuantity: 0,
// // //                                 totalAmount: 0,
// // //                                 avgRate: 0
// // //                             };
// // //                         }
// // //                         itemsSummary[itemKey].totalQuantity += item.quantity;
// // //                         itemsSummary[itemKey].totalAmount += item.amount;
// // //                     }
// // //                 }

// // //                 // Calculate average rate for each item
// // //                 for (const item of Object.values(itemsSummary)) {
// // //                     item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
// // //                 }

// // //                 customerItemsSummary[customerName] = Object.values(itemsSummary);
// // //             }

// // //             // Generate HTML for PDF
// // //             const formattedStartDate = formatDateForDisplay(startDate);
// // //             const formattedEndDate = formatDateForDisplay(endDate);
// // //             const currentDate = formatDateForDisplay(new Date().toISOString().split('T')[0]);
// // //             console.log("customerGroups", customerGroups)
// // //             const html = `
// // //         <!DOCTYPE html>
// // //         <html dir="rtl">
// // //         <head>
// // //             <meta charset="UTF-8">
// // //             <title>تقرير المبيعات ${formattedStartDate} إلى ${formattedEndDate}</title>
// // //             <style>
// // //                 * {
// // //                     margin: 0;
// // //                     padding: 0;
// // //                     box-sizing: border-box;
// // //                 }
                
// // //                 body {
// // //                     font-family: 'Segoe UI', 'Arial', 'Noto Nastaliq Urdu', 'Urdu Typesetting', 'Times New Roman', sans-serif;
// // //                     padding: 20px;
// // //                     background: white;
// // //                     color: #333;
// // //                 }
                
// // //                 .report-container {
// // //                     max-width: 1200px;
// // //                     margin: 0 auto;
// // //                 }
                
// // //                 /* Customer Section */
// // //                 .customer-section {
// // //                     margin-bottom: 40px;
// // //                     page-break-after: always;
// // //                 }
                
// // //                 .customer-section:last-child {
// // //                     page-break-after: auto;
// // //                 }
                
// // //                 .customer-header {
// // //                     text-align: center;
// // //                     margin-bottom: 20px;
// // //                     background: #f0f0f0;
// // //                     border-radius: 8px;
// // //                     overflow: hidden;
// // //                 }
                
// // //                 .customer-name {
// // //                     font-size: 32px;
// // //                     font-weight: bold;
// // //                     color: #2c3e50;
// // //                     padding: 20px;
// // //                     background: #e0e0e0;
// // //                     margin: 0;
// // //                     text-align: center;
// // //                     font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;
// // //                 }
                
// // //                 .customer-date {
// // //                     font-size: 16px;
// // //                     color: #555;
// // //                     padding: 12px 20px;
// // //                     background: #f5f5f5;
// // //                     text-align: right;
// // //                     border-top: 1px solid #ddd;
// // //                 }
                
// // //                 .customer-date span {
// // //                     font-weight: bold;
// // //                     margin-left: 8px;
// // //                 }
                
// // //                 /* Items Table */
// // //                 .items-table {
// // //                     width: 100%;
// // //                     border-collapse: collapse;
// // //                     margin-top: 20px;
// // //                     margin-bottom: 20px;
// // //                 }
                
// // //                 .items-table th {
// // //                     background: #4CAF50;
// // //                     color: white;
// // //                     border: 1px solid #ddd;
// // //                     padding: 12px;
// // //                     text-align: center;
// // //                     font-size: 18px;
// // //                     font-weight: bold;
// // //                 }
                
// // //                 .items-table td {
// // //                     border: 1px solid #ddd;
// // //                     padding: 10px 12px;
// // //                     text-align: center;
// // //                     font-size: 16px;
// // //                 }
                
// // //                 .items-table td:first-child,
// // //                 .items-table td:last-child {
// // //                     font-weight: bold;
// // //                 }
                
// // //                 .total-row {
// // //                     background: #f9f9f9;
// // //                     font-weight: bold;
// // //                     border-top: 2px solid #ddd;
// // //                 }
                
// // //                 .total-row td {
// // //                     font-weight: bold;
// // //                     font-size: 18px;
// // //                     padding: 12px;
// // //                 }
                
// // //                 /* Footer */
// // //                 .footer {
// // //                     margin-top: 40px;
// // //                     padding-top: 20px;
// // //                     text-align: center;
// // //                     border-top: 1px solid #e0e0e0;
// // //                     font-size: 12px;
// // //                     color: #999;
// // //                 }
                
// // //                 .footer-phone {
// // //                     font-size: 14px;
// // //                     color: #4CAF50;
// // //                     margin-top: 5px;
// // //                     font-weight: bold;
// // //                 }
                
// // //                 @media print {
// // //                     body {
// // //                         padding: 10px;
// // //                     }
// // //                     .customer-section {
// // //                         page-break-after: always;
// // //                     }
// // //                     .items-table th,
// // //                     .items-table td {
// // //                         border-color: #000;
// // //                     }
// // //                 }
// // //             </style>
// // //         </head>
// // //         <body>
// // //             <div class="report-container">
// // //                 ${Object.entries(customerGroups).map(([customerName, customerData]) => {
// // //                 const itemsSummary = customerItemsSummary[customerName] || [];
// // //                 const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
// // //                 const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);

// // //                 // Get the most recent invoice date for this customer
// // //                 const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
// // //                 const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());

// // //                 // Display customer name in Urdu if available, otherwise English
// // //                 const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== ''
// // //                     ? customerData.customerNameUrdu
// // //                     : customerData.customerName;

// // //                 return `
// // //                         <div class="customer-section">
// // //                             <div class="customer-header">
// // //                                 <div class="customer-name" style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// // //                                     ${displayCustomerName}
// // //                                 </div>
// // //                                 <div class="customer-date">
// // //                                     <span>تاریخ:</span> ${invoiceDate}
// // //                                 </div>
// // //                             </div>
                            
// // //                             <table class="items-table">
// // //                                 <thead>
// // //                                     <tr>
// // //                                         <th>تعداد </th>
// // //                                         <th>آئٹم </th>
// // //                                         <th>ریٹ </th>
// // //                                         <th>رقم </th>
// // //                                     </thead>
// // //                                 <tbody>
// // //                                     ${itemsSummary.map((item) => {
// // //                     // Use Urdu name first for items, fallback to English
// // //                     const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
// // //                         ? item.itemNameUrdu
// // //                         : item.itemName;

// // //                     return `
// // //                                             <tr>
// // //                                                 <td style="font-size: 16px;">${item.totalQuantity.toLocaleString()}</td>
// // //                                                 <td style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif; font-size: 16px;">
// // //                                                     ${displayItemName}
// // //                                                 </td>
// // //                                                 <td style="font-size: 16px;"> ${Math.round(item.avgRate).toLocaleString()}</td>
// // //                                                 <td style="font-size: 16px;"> ${item.totalAmount.toLocaleString()}</td>
// // //                                             </tr>
// // //                                         `;
// // //                 }).join('')}
// // //                                     <tr class="total-row">
// // //                                         <td style="font-size: 18px; font-weight: bold;">${totalItems.toLocaleString()}</td>
// // //                                         <td style="font-size: 18px; font-weight: bold; font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// // //                                             وطن (Total)
// // //                                         </td>
// // //                                         <td style="font-size: 18px; font-weight: bold;">-</td>
// // //                                         <td style="font-size: 18px; font-weight: bold; color: #4CAF50;">
// // //                                              ${totalAmount.toLocaleString()}
// // //                                         </td>
// // //                                     </tr>
// // //                                 </tbody>
// // //                             </table>
// // //                         </div>
// // //                     `;
// // //             }).join('')}
                
            
// // //             </div>
// // //         </body>
// // //         </html>
// // //     `;

// // //             return html;
// // //         } catch (error) {
// // //             console.error('Error generating report HTML:', error);
// // //             toast.error('Failed to generate report');
// // //             return null;
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     const formatDateForDisplay = (dateString) => {
// // //         if (!dateString) return '';
// // //         const date = new Date(dateString);
// // //         if (isNaN(date.getTime())) return '';
// // //         const day = String(date.getDate()).padStart(2, '0');
// // //         const month = String(date.getMonth() + 1).padStart(2, '0');
// // //         const year = date.getFullYear();
// // //         return `${day}/${month}/${year}`;
// // //     };

// // //     const handleGenerateReport = async () => {
// // //         setLoading(true);
// // //         try {
// // //             const html = await generateReportHTML();
// // //             if (html && window.electron && window.electron.printToPDF) {
// // //                 const pdfPath = await window.electron.printToPDF(html);
// // //                 if (pdfPath) {
// // //                     toast.success(`Report saved successfully`);
// // //                 } else {
// // //                     toast.error('Report generation cancelled');
// // //                 }
// // //             } else if (html) {
// // //                 const printWindow = window.open('', '_blank');
// // //                 printWindow.document.write(html);
// // //                 printWindow.document.close();
// // //                 printWindow.print();
// // //                 toast.success('Report opened for printing');
// // //             }
// // //         } catch (error) {
// // //             console.error('Error generating report:', error);
// // //             toast.error('Failed to generate report');
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     // const generatePDF = async (invoice, details) => {
// // //     //     try {
// // //     //         const formattedDate = formatDateForDisplay(invoice.invoice_date);
// // //     //         const html = `
// // //     //             <!DOCTYPE html>
// // //     //             <html>
// // //     //             <head>
// // //     //                 <meta charset="UTF-8">
// // //     //                 <title>Invoice ${invoice.voucher_id}</title>
// // //     //                 <style>
// // //     //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// // //     //                     body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: white; color: #333; }
// // //     //                     .invoice-container { max-width: 1100px; margin: 0 auto; background: white; }
// // //     //                     .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #4CAF50; }
// // //     //                     .company-name { font-size: 28px; font-weight: bold; color: #2c3e50; }
// // //     //                     .invoice-title { font-size: 24px; font-weight: bold; color: #4CAF50; margin-top: 10px; }
// // //     //                     .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
// // //     //                     .details-section p { margin: 8px 0; font-size: 12px; }
// // //     //                     .customer-section { margin-bottom: 30px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; }
// // //     //                     .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
// // //     //                     .items-table th { background: #4CAF50; color: white; padding: 12px; text-align: left; font-size: 12px; }
// // //     //                     .items-table td { padding: 10px 12px; border-bottom: 1px solid #e0e0e0; font-size: 11px; }
// // //     //                     .text-right { text-align: right; }
// // //     //                     .totals-section { margin-top: 20px; text-align: right; }
// // //     //                     .totals-line { margin: 8px 0; font-size: 12px; }
// // //     //                     .grand-total { font-size: 16px; font-weight: bold; color: #4CAF50; margin-top: 10px; padding-top: 10px; border-top: 2px solid #4CAF50; }
// // //     //                     .footer { margin-top: 40px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 10px; color: #999; }
// // //     //                 </style>
// // //     //             </head>
// // //     //             <body>
// // //     //                 <div class="invoice-container">
// // //     //                     <div class="header">
// // //     //                         <div class="company-name">INVENTORY MANAGEMENT SYSTEM</div>
// // //     //                         <div class="invoice-title">SALE INVOICE</div>
// // //     //                     </div>
// // //     //                     <div class="invoice-details">
// // //     //                         <div class="details-section">
// // //     //                             <p><strong>Voucher No:</strong> ${invoice.voucher_id}</p>
// // //     //                             <p><strong>Invoice Date:</strong> ${formattedDate}</p>
// // //     //                         </div>
// // //     //                         <div class="details-section">
// // //     //                             <p><strong>Ref No:</strong> ${invoice.order_no || 'N/A'}</p>
// // //     //                             <p><strong>Print Date:</strong> ${formatDateForDisplay(new Date().toISOString().split('T')[0])}</p>
// // //     //                         </div>
// // //     //                     </div>
// // //     //                     <div class="customer-section">
// // //     //                         <h3>BILL TO:</h3>
// // //     //                         <p><strong>Customer Name:</strong> ${invoice.customer_name}</p>
// // //     //                         ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
// // //     //                     </div>
// // //     //                     <table class="items-table">
// // //     //                         <thead><tr><th>#</th><th>Item Description</th><th class="text-right">Quantity</th><th class="text-right">Rate (₨)</th><th class="text-right">Amount (₨)</th></tr></thead>
// // //     //                         <tbody>${details.map((item, idx) => `
// // //     //                             <tr>
// // //     //                                 <td>${idx + 1}</td>
// // //     //                                 <td><strong>${item.item_name}</strong></td>
// // //     //                                 <td class="text-right">${item.quantity}</td>
// // //     //                                 <td class="text-right">₨ ${item.rate?.toLocaleString() || 0}</td>
// // //     //                                 <td class="text-right">₨ ${item.amount?.toLocaleString() || 0}</td>
// // //     //                             </tr>
// // //     //                         `).join('')}</tbody>
// // //     //                     </table>
// // //     //                     <div class="totals-section">
// // //     //                         <div class="totals-line"><strong>Total Items:</strong> ${invoice.total_weight || 0}</div>
// // //     //                         <div class="totals-line"><strong>Sub Total:</strong> ₨ ${(invoice.total_amount || 0).toLocaleString()}</div>
// // //     //                         <div class="totals-line"><strong>Discount:</strong> ₨ ${(invoice.discount || 0).toLocaleString()}</div>
// // //     //                         <div class="grand-total"><strong>Grand Total:</strong> ₨ ${(invoice.net_amount || 0).toLocaleString()}</div>
// // //     //                     </div>
// // //     //                     <div class="footer"><p>Thank you for your business!</p></div>
// // //     //                 </div>
// // //     //             </body>
// // //     //             </html>
// // //     //         `;

// // //     //         if (window.electron && window.electron.printToPDF) {
// // //     //             const pdfPath = await window.electron.printToPDF(html);
// // //     //             if (pdfPath) {
// // //     //                 toast.success(`Invoice saved successfully`);
// // //     //             }
// // //     //         } else {
// // //     //             const printWindow = window.open('', '_blank');
// // //     //             printWindow.document.write(html);
// // //     //             printWindow.document.close();
// // //     //             printWindow.print();
// // //     //             toast.success('Invoice opened for printing');
// // //     //         }
// // //     //     } catch (error) {
// // //     //         console.error('PDF generation error:', error);
// // //     //         toast.error('Failed to generate PDF');
// // //     //     }
// // //     // };



// // //     // const generatePDF = async (invoice, details) => {
// // //     //     try {
// // //     //         const formattedDate = formatDateForDisplay(invoice.invoice_date);
// // //     //         const html = `
// // //     //         <!DOCTYPE html>
// // //     //         <html>
// // //     //         <head>
// // //     //             <meta charset="UTF-8">
// // //     //             <title>Invoice ${invoice.voucher_id}</title>
// // //     //             <style>
// // //     //                 * { margin: 0; padding: 0; box-sizing: border-box; }
// // //     //                 body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: white; color: #333; }
// // //     //                 .invoice-container { max-width: 1100px; margin: 0 auto; background: white; }
// // //     //                 .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #4CAF50; }
// // //     //                 .company-name { font-size: 28px; font-weight: bold; color: #2c3e50; }
// // //     //                 .invoice-title { font-size: 24px; font-weight: bold; color: #4CAF50; margin-top: 10px; }
// // //     //                 .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
// // //     //                 .details-section p { margin: 8px 0; font-size: 12px; }
// // //     //                 .customer-section { margin-bottom: 30px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; }
// // //     //                 .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
// // //     //                 .items-table th { background: #4CAF50; color: white; padding: 12px; text-align: left; font-size: 12px; }
// // //     //                 .items-table td { padding: 10px 12px; border-bottom: 1px solid #e0e0e0; font-size: 11px; }
// // //     //                 .text-right { text-align: right; }
// // //     //                 .totals-section { margin-top: 20px; text-align: right; }
// // //     //                 .totals-line { margin: 8px 0; font-size: 12px; }
// // //     //                 .grand-total { font-size: 16px; font-weight: bold; color: #4CAF50; margin-top: 10px; padding-top: 10px; border-top: 2px solid #4CAF50; }
// // //     //                 .footer { margin-top: 40px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 10px; color: #999; }
// // //     //             </style>
// // //     //         </head>
// // //     //         <body>
// // //     //             <div class="invoice-container">
// // //     //                 <div class="header">
// // //     //                     <div class="company-name">INVENTORY MANAGEMENT SYSTEM</div>
// // //     //                     <div class="invoice-title">SALE INVOICE</div>
// // //     //                 </div>
// // //     //                 <div class="invoice-details">
// // //     //                     <div class="details-section">
// // //     //                         <p><strong>Voucher No:</strong> ${invoice.voucher_id}</p>
// // //     //                         <p><strong>Invoice Date:</strong> ${formattedDate}</p>
// // //     //                     </div>
// // //     //                     <div class="details-section">
// // //     //                         <p><strong>Ref No:</strong> ${invoice.order_no || 'N/A'}</p>
// // //     //                         <p><strong>Print Date:</strong> ${formatDateForDisplay(new Date().toISOString().split('T')[0])}</p>
// // //     //                     </div>
// // //     //                 </div>
// // //     //                 <div class="customer-section">
// // //     //                     <h3>BILL TO:</h3>
// // //     //                     <p><strong>Customer Name:</strong> ${invoice.customer_name}</p>
// // //     //                     ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
// // //     //                 </div>
// // //     //                 <table class="items-table">
// // //     //                     <thead><tr><th>#</th><th>Item Description</th><th class="text-right">Quantity</th><th class="text-right">Rate (₨)</th><th class="text-right">Amount (₨)</th></tr></thead>
// // //     //                     <tbody>${details.map((item, idx) => `
// // //     //                         <tr>
// // //     //                             <td>${idx + 1}</td>
// // //     //                             <td><strong>${item.item_name}</strong></td>
// // //     //                             <td class="text-right">${item.quantity}</td>
// // //     //                             <td class="text-right">₨ ${item.rate?.toLocaleString() || 0}</td>
// // //     //                             <td class="text-right">₨ ${item.amount?.toLocaleString() || 0}</td>
// // //     //                         </tr>
// // //     //                     `).join('')}</tbody>
// // //     //                 </table>
// // //     //                 <div class="totals-section">
// // //     //                     <div class="totals-line"><strong>Total Items:</strong> ${invoice.total_weight || 0}</div>
// // //     //                     <div class="totals-line"><strong>Sub Total:</strong> ₨ ${(invoice.total_amount || 0).toLocaleString()}</div>
// // //     //                     <div class="totals-line"><strong>Discount:</strong> ₨ ${(invoice.discount || 0).toLocaleString()}</div>
// // //     //                     <div class="grand-total"><strong>Grand Total:</strong> ₨ ${(invoice.net_amount || 0).toLocaleString()}</div>
// // //     //                 </div>
// // //     //                 <div class="footer"><p>Thank you for your business!</p></div>
// // //     //             </div>
// // //     //         </body>
// // //     //         </html>
// // //     //     `;

// // //     //         if (window.electron && window.electron.printToPDFAndOpen) {
// // //     //             await window.electron.printToPDFAndOpen(html);
// // //     //             toast.success('PDF opened successfully');
// // //     //         } else {
// // //     //             const printWindow = window.open('', '_blank');
// // //     //             printWindow.document.write(html);
// // //     //             printWindow.document.close();
// // //     //             printWindow.print();
// // //     //             toast.success('Print dialog opened');
// // //     //         }
// // //     //     } catch (error) {
// // //     //         console.error('PDF generation error:', error);
// // //     //         toast.error('Failed to generate PDF');
// // //     //     }
// // //     // };



// // //     const generatePDF = async (invoice, details) => {
// // //         try {
// // //             const formattedDate = formatDateForDisplay(invoice.invoice_date);
// // //             const html = `
// // //             <!DOCTYPE html>
// // //             <html>
// // //             <head>
// // //                 <meta charset="UTF-8">
// // //                 <title>Invoice ${invoice.voucher_id}</title>
// // //                 <style>
// // //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// // //                     body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: white; color: #333; }
// // //                     .invoice-container { max-width: 1100px; margin: 0 auto; background: white; }
// // //                     .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #4CAF50; }
// // //                     .company-name { font-size: 28px; font-weight: bold; color: #2c3e50; }
// // //                     .invoice-title { font-size: 24px; font-weight: bold; color: #4CAF50; margin-top: 10px; }
// // //                     .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
// // //                     .details-section p { margin: 8px 0; font-size: 12px; }
// // //                     .customer-section { margin-bottom: 30px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; }
// // //                     .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
// // //                     .items-table th { background: #4CAF50; color: white; padding: 12px; text-align: left; font-size: 12px; }
// // //                     .items-table td { padding: 10px 12px; border-bottom: 1px solid #e0e0e0; font-size: 11px; }
// // //                     .text-right { text-align: right; }
// // //                     .totals-section { margin-top: 20px; text-align: right; }
// // //                     .totals-line { margin: 8px 0; font-size: 12px; }
// // //                     .grand-total { font-size: 16px; font-weight: bold; color: #4CAF50; margin-top: 10px; padding-top: 10px; border-top: 2px solid #4CAF50; }
// // //                     .footer { margin-top: 40px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 10px; color: #999; }
// // //                 </style>
// // //             </head>
// // //             <body>
// // //                 <div class="invoice-container">
// // //                     <div class="header">
// // //                         <div class="company-name">INVENTORY MANAGEMENT SYSTEM</div>
// // //                         <div class="invoice-title">SALE INVOICE</div>
// // //                     </div>
// // //                     <div class="invoice-details">
// // //                         <div class="details-section">
// // //                             <p><strong>Voucher No:</strong> ${invoice.voucher_id}</p>
// // //                             <p><strong>Invoice Date:</strong> ${formattedDate}</p>
// // //                         </div>
// // //                         <div class="details-section">
// // //                             <p><strong>Ref No:</strong> ${invoice.order_no || 'N/A'}</p>
// // //                             <p><strong>Print Date:</strong> ${formatDateForDisplay(new Date().toISOString().split('T')[0])}</p>
// // //                         </div>
// // //                     </div>
// // //                     <div class="customer-section">
// // //                         <h3>BILL TO:</h3>
// // //                         <p><strong>Customer Name:</strong> ${invoice.customer_name}</p>
// // //                         ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
// // //                     </div>
// // //                     <table class="items-table">
// // //                         <thead><tr><th>#</th><th>Item Description</th><th class="text-right">Quantity</th><th class="text-right">Rate (₨)</th><th class="text-right">Amount (₨)</th></tr></thead>
// // //                         <tbody>${details.map((item, idx) => `
// // //                             <tr>
// // //                                 <td>${idx + 1}</td>
// // //                                 <td><strong>${item.item_name}</strong></td>
// // //                                 <td class="text-right">${item.quantity}</td>
// // //                                 <td class="text-right">₨ ${item.rate?.toLocaleString() || 0}</td>
// // //                                 <td class="text-right">₨ ${item.amount?.toLocaleString() || 0}</td>
// // //                             </tr>
// // //                         `).join('')}</tbody>
// // //                     </table>
// // //                     <div class="totals-section">
// // //                         <div class="totals-line"><strong>Total Items:</strong> ${invoice.total_weight || 0}</div>
// // //                         <div class="totals-line"><strong>Sub Total:</strong> ₨ ${(invoice.total_amount || 0).toLocaleString()}</div>
// // //                         <div class="totals-line"><strong>Discount:</strong> ₨ ${(invoice.discount || 0).toLocaleString()}</div>
// // //                         <div class="grand-total"><strong>Grand Total:</strong> ₨ ${(invoice.net_amount || 0).toLocaleString()}</div>
// // //                     </div>
// // //                     <div class="footer"><p>Thank you for your business!</p></div>
// // //                 </div>
// // //             </body>
// // //             </html>
// // //         `;

// // //             if (window.electron && window.electron.openHTMLInBrowser) {
// // //                 await window.electron.openHTMLInBrowser(html);
// // //                 toast.success('Invoice opened in your browser');
// // //             } else if (window.electron && window.electron.printToPDFAndOpen) {
// // //                 await window.electron.printToPDFAndOpen(html);
// // //                 toast.success('Invoice opened successfully');
// // //             } else {
// // //                 const printWindow = window.open('', '_blank');
// // //                 printWindow.document.write(html);
// // //                 printWindow.document.close();
// // //                 printWindow.print();
// // //                 toast.success('Print dialog opened');
// // //             }
// // //         } catch (error) {
// // //             console.error('PDF generation error:', error);
// // //             toast.error('Failed to generate PDF');
// // //         }
// // //     };
// // //     const handlePrint = async (invoice) => {
// // //         try {
// // //             const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // //             await generatePDF(invoice, details);
// // //         } catch (error) {
// // //             console.error('Failed to generate PDF:', error);
// // //             toast.error('Failed to generate PDF');
// // //         }
// // //     };

// // //     const handleDelete = async (id) => {
// // //         if (window.confirm('Are you sure you want to delete this invoice?')) {
// // //             try {
// // //                 await window.electron.database.deleteInvoice(id);
// // //                 toast.success('Invoice deleted successfully');
// // //                 loadInvoices();
// // //                 setShowDetails(false);
// // //             } catch (error) {
// // //                 console.error('Failed to delete invoice:', error);
// // //                 toast.error('Failed to delete invoice');
// // //             }
// // //         }
// // //     };

// // //     const getTotalAmount = () => {
// // //         return filteredInvoices.reduce((sum, inv) => sum + (inv.net_amount || 0), 0);
// // //     };

// // //     const getTotalWeight = () => {
// // //         return filteredInvoices.reduce((sum, inv) => sum + (inv.total_weight || 0), 0);
// // //     };

// // //     return (
// // //         <div className="container">
// // //             <div className="header">
// // //                 <h1>Invioce List</h1>
// // //                 <div style={{ display: 'flex', gap: '10px' }}>
// // //                     <button className="btn-primary" onClick={() => navigate('/invoices/new')}>
// // //                         <FiPlus /> New Invoice  (CTR + N)
// // //                     </button>

// // //                 </div>
// // //             </div>

// // //             {/* Date Range Filter */}
// // //             <div className="form-panel">
// // //                 <div className="form-grid">
// // //                     <div className="form-group">
// // //                         <label>Date Range</label>
// // //                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
// // //                             <input
// // //                                 type="date"
// // //                                 value={startDate}
// // //                                 onChange={(e) => setStartDate(e.target.value)}
// // //                             />
// // //                             <span>to</span>
// // //                             <input
// // //                                 type="date"
// // //                                 value={endDate}
// // //                                 onChange={(e) => setEndDate(e.target.value)}
// // //                             />
// // //                         </div>
// // //                     </div>
// // //                     <div className="form-group">
// // //                         <label>Search</label>
// // //                         <div className="search-box">
// // //                             <FiSearch />
// // //                             <input
// // //                                 type="text"
// // //                                 placeholder="Search by Voucher ID, Customer..."
// // //                                 value={searchTerm}
// // //                                 style={{ width: '100%' }}
// // //                                 onChange={(e) => setSearchTerm(e.target.value)}
// // //                             />
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //             </div>

// // //             {/* Summary Stats */}
// // //             {/* <div className="stats-grid" style={{ marginBottom: '20px' }}>
// // //                 <div className="stat-card">
// // //                     <h3>Total Invoices</h3>
// // //                     <div className="stat-value">{filteredInvoices.length}</div>
// // //                 </div>
// // //                 <div className="stat-card">
// // //                     <h3>Total Items</h3>
// // //                     <div className="stat-value">{getTotalWeight().toLocaleString()}</div>
// // //                 </div>
// // //                 <div className="stat-card">
// // //                     <h3>Total Amount</h3>
// // //                     <div className="stat-value">₨ {getTotalAmount().toLocaleString()}</div>
// // //                 </div>
// // //             </div> */}

// // //             {/* Invoices Table */}
// // //             <div className="table-container">
// // //                 <table className="data-table">
// // //                     <thead style={{ background: '#e5e3e3' }}>
// // //                         <tr style={{ background: '#4CAF50', color: 'white' }}>
// // //                             <th style={{ background: '#4CAF50', color: 'white' }}>ID</th>
// // //                             <th style={{ background: '#4CAF50', color: 'white' }}>Voucher ID</th>
// // //                             <th style={{ background: '#4CAF50', color: 'white' }}>Ref No.</th>
// // //                             <th style={{ background: '#4CAF50', color: 'white' }}>Date</th>
// // //                             <th style={{ background: '#4CAF50', color: 'white' }}>Customer</th>
// // //                             <th style={{ background: '#4CAF50', color: 'white' }}>Total Items</th>
// // //                             <th style={{ background: '#4CAF50', color: 'white' }}>Total Amount</th>
// // //                             <th style={{ background: '#4CAF50', color: 'white' }}>Created By</th>
// // //                             <th style={{ background: '#4CAF50', color: 'white' }}>Actions</th>
// // //                         </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                         {filteredInvoices.map((invoice) => (
// // //                             <tr key={invoice.invoice_id}>
// // //                                 <td>{invoice.invoice_id}</td>
// // //                                 <td><strong>{invoice.voucher_id}</strong></td>
// // //                                 <td>{invoice.order_no || '-'}</td>
// // //                                 <td>{formatDateForDisplay(invoice.invoice_date)}</td>
// // //                                 <td>{invoice.customer_name}</td>
// // //                                 <td>{invoice.total_weight}</td>
// // //                                 <td>₨ {invoice.total_amount?.toLocaleString()}</td>
// // //                                 <td>{invoice.created_by}</td>
// // //                                 {/* <td className="actions">
// // //                                     <button className="icon-btn" onClick={() => handleViewDetails(invoice)} title="View Details">
// // //                                         <FiEye />
// // //                                     </button>
// // //                                     <button className="icon-btn" onClick={() => handlePrint(invoice)} title="Print">
// // //                                         <FiPrinter />
// // //                                     </button>
// // //                                     <button className="icon-btn danger" onClick={() => handleDelete(invoice.invoice_id)} title="Delete">
// // //                                         <FiTrash2 />
// // //                                     </button>
// // //                                 </td>
// // //                                  */}

// // //                                 <td className="actions">
// // //                                     <button className="icon-btn" onClick={() => handleEdit(invoice)} title="Edit">
// // //                                         <FiEdit />
// // //                                     </button>
// // //                                     <button className="icon-btn" onClick={() => handleViewDetails(invoice)} title="View Details">
// // //                                         <FiEye />
// // //                                     </button>
// // //                                     <button className="icon-btn" onClick={() => handlePrint(invoice)} title="Print">
// // //                                         <FiPrinter />
// // //                                     </button>
// // //                                     <button className="icon-btn danger" onClick={() => handleDelete(invoice.invoice_id)} title="Delete">
// // //                                         <FiTrash2 />
// // //                                     </button>
// // //                                 </td>
// // //                             </tr>
// // //                         ))}
// // //                         {filteredInvoices.length === 0 && (
// // //                             <tr>
// // //                                 <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
// // //                                     No invoices found for the selected date range
// // //                                 </td>
// // //                             </tr>
// // //                         )}
// // //                     </tbody>
// // //                 </table>
// // //             </div>

// // //             {/* Invoice Details Modal */}
// // //             {showDetails && selectedInvoice && (
// // //                 <div className="modal-overlay" onClick={() => setShowDetails(false)}>
// // //                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
// // //                         <div className="modal-header">
// // //                             <h2>Invoice Details - {selectedInvoice.voucher_id}</h2>
// // //                             <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
// // //                         </div>
// // //                         <div className="modal-body">
// // //                             <div className="invoice-info">
// // //                                 <p><strong>Date:</strong> {formatDateForDisplay(selectedInvoice.invoice_date)}</p>
// // //                                 <p><strong>Customer:</strong> {selectedInvoice.customer_name}</p>
// // //                                 <p><strong>Ref NO:</strong> {selectedInvoice.order_no || 'N/A'}</p>
// // //                                 <p><strong>Notes:</strong> {selectedInvoice.notes || 'N/A'}</p>
// // //                             </div>

// // //                             <table className="data-table">
// // //                                 <thead>
// // //                                     <tr>
// // //                                         <th>Sr.</th>
// // //                                         <th>Item</th>
// // //                                         <th>Qty</th>
// // //                                         <th>Rate</th>
// // //                                         <th>Amount</th>
// // //                                     </tr>
// // //                                 </thead>
// // //                                 <tbody>
// // //                                     {selectedInvoice.details?.map((item, idx) => (
// // //                                         <tr key={idx}>
// // //                                             <td>{idx + 1}</td>
// // //                                             <td>{item.item_name}</td>
// // //                                             <td>{item.quantity}</td>
// // //                                             <td>₨ {item.rate?.toLocaleString()}</td>
// // //                                             <td>₨ {item.amount?.toLocaleString()}</td>
// // //                                         </tr>
// // //                                     ))}
// // //                                 </tbody>
// // //                                 <tfoot>
// // //                                     <tr>
// // //                                         <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total Items:</strong></td>
// // //                                         <td><strong>{selectedInvoice.total_weight}</strong></td>
// // //                                     </tr>
// // //                                     <tr>
// // //                                         <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total Amount:</strong></td>
// // //                                         <td><strong>₨ {selectedInvoice.total_amount?.toLocaleString()}</strong></td>
// // //                                     </tr>
// // //                                     <tr>
// // //                                         <td colSpan="4" style={{ textAlign: 'right' }}><strong>Discount:</strong></td>
// // //                                         <td><strong>₨ {selectedInvoice.discount?.toLocaleString()}</strong></td>
// // //                                     </tr>
// // //                                     <tr>
// // //                                         <td colSpan="4" style={{ textAlign: 'right' }}><strong>Net Amount:</strong></td>
// // //                                         <td><strong>₨ {selectedInvoice.net_amount?.toLocaleString()}</strong></td>
// // //                                     </tr>
// // //                                 </tfoot>
// // //                             </table>
// // //                         </div>
// // //                         <div className="modal-footer">
// // //                             <button className="btn-primary" onClick={() => handlePrint(selectedInvoice)}>
// // //                                 <FiPrinter /> Print
// // //                             </button>
// // //                             <button className="btn-danger" onClick={() => setShowDetails(false)}>
// // //                                 Close
// // //                             </button>
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //             )}

// // //             {/* <div className="status-bar">
// // //                 <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
// // //                 <span className="shortcuts-hint">
// // //                     Shortcuts: Click on Eye icon to view details | Print icon for PDF | Generate Report for summary
// // //                 </span>
// // //             </div> */}

// // //             <style jsx>{`
// // //                 .modal-overlay {
// // //                     position: fixed;
// // //                     top: 0;
// // //                     left: 0;
// // //                     right: 0;
// // //                     bottom: 0;
// // //                     background: rgba(0,0,0,0.5);
// // //                     display: flex;
// // //                     justify-content: center;
// // //                     align-items: center;
// // //                     z-index: 1000;
// // //                 }
                
// // //                 .modal-content {
// // //                     background: white;
// // //                     border-radius: 8px;
// // //                     width: 90%;
// // //                     max-width: 1000px;
// // //                     max-height: 80vh;
// // //                     overflow-y: auto;
// // //                     box-shadow: 0 4px 20px rgba(0,0,0,0.2);
// // //                 }
                
// // //                 .modal-header {
// // //                     display: flex;
// // //                     justify-content: space-between;
// // //                     align-items: center;
// // //                     padding: 15px 20px;
// // //                     border-bottom: 1px solid #e0e0e0;
// // //                     background: #f5f5f5;
// // //                     border-radius: 8px 8px 0 0;
// // //                 }
                
// // //                 .modal-header h2 {
// // //                     margin: 0;
// // //                     color: #4CAF50;
// // //                 }
                
// // //                 .close-btn {
// // //                     background: none;
// // //                     border: none;
// // //                     font-size: 24px;
// // //                     cursor: pointer;
// // //                     color: #999;
// // //                 }
                
// // //                 .close-btn:hover {
// // //                     color: #f44336;
// // //                 }
                
// // //                 .modal-body {
// // //                     padding: 20px;
// // //                 }
                
// // //                 .invoice-info {
// // //                     display: grid;
// // //                     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
// // //                     gap: 10px;
// // //                     margin-bottom: 20px;
// // //                     padding: 15px;
// // //                     background: #f9f9f9;
// // //                     border-radius: 4px;
// // //                 }
                
// // //                 .modal-footer {
// // //                     padding: 15px 20px;
// // //                     border-top: 1px solid #e0e0e0;
// // //                     display: flex;
// // //                     justify-content: flex-end;
// // //                     gap: 10px;
// // //                 }
                
// // //                 .btn-secondary {
// // //                     padding: 8px 16px;
// // //                     background: #2196F3;
// // //                     color: white;
// // //                     border: none;
// // //                     border-radius: 4px;
// // //                     cursor: pointer;
// // //                     display: flex;
// // //                     align-items: center;
// // //                     gap: 6px;
// // //                     font-size: 14px;
// // //                 }
                
// // //                 .btn-secondary:disabled {
// // //                     opacity: 0.5;
// // //                     cursor: not-allowed;
// // //                 }
// // //             `}</style>
// // //         </div>
// // //     );
// // // }

// // // export default InvoiceList;

// // import React, { useState, useEffect } from 'react';
// // import { toast } from 'react-hot-toast';
// // import { FiEye, FiPrinter, FiTrash2, FiCalendar, FiEdit, FiSearch, FiPlus, FiFileText, FiDownload } from 'react-icons/fi';
// // import { NavigationContext } from '../App';
// // import { useNavigate } from 'react-router-dom';
// // import { useContext } from 'react';

// // function InvoiceList() {
// //     const navigate = useNavigate();
// //     const { goBack } = useContext(NavigationContext);
// //     const [invoices, setInvoices] = useState([]);
// //     const [filteredInvoices, setFilteredInvoices] = useState([]);
// //     const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
// //     const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [selectedInvoice, setSelectedInvoice] = useState(null);
// //     const [showDetails, setShowDetails] = useState(false);
// //     const [loading, setLoading] = useState(false);
// //     const [invoiceDetails, setInvoiceDetails] = useState({});

// //     useEffect(() => {
// //         loadInvoices();
// //     }, []);

// //     useEffect(() => {
// //         filterInvoices();
// //     }, [invoices, startDate, endDate, searchTerm]);

// //     useEffect(() => {
// //         const handleKeyDown = (event) => {
// //             if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
// //                 event.preventDefault();
// //                 navigate('/invoices/new');
// //                 toast.success('Opening new invoice form...');
// //             }
// //         };

// //         window.addEventListener('keydown', handleKeyDown);
// //         return () => {
// //             window.removeEventListener('keydown', handleKeyDown);
// //         };
// //     }, [navigate]);

// //     const loadInvoices = async () => {
// //         try {
// //             const data = await window.electron.database.getInvoices();
// //             setInvoices(data || []);
// //             console.log("data",data)
// //             // Load details for each invoice to get customer information
// //             for (const invoice of (data || [])) {
// //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// //                 console.log("details",details)
// //                 setInvoiceDetails(prev => ({
// //                     ...prev,
// //                     [invoice.invoice_id]: details
// //                 }));
// //             }

// //         } catch (error) {
// //             console.error('Failed to load invoices:', error);
// //             toast.error('Failed to load invoices');
// //         }
// //     };

// //     const handleEdit = (invoice) => {
// // console.log("invoice",invoice)

// //         navigate('/invoices/edit', { state: { invoice } });
// //     };

// //     const filterInvoices = () => {
// //         let filtered = [...invoices];

// //         filtered = filtered.filter(inv => {
// //             const invDate = inv.invoice_date;
// //             return invDate >= startDate && invDate <= endDate;
// //         });

// //         if (searchTerm.trim()) {
// //             filtered = filtered.filter(inv =>
// //                 inv.voucher_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                 inv.order_no?.toLowerCase().includes(searchTerm.toLowerCase())
// //             );
// //         }

// //         setFilteredInvoices(filtered);
// //     };

// //     const handleViewDetails = async (invoice) => {
// //         try {
// //             const details = invoiceDetails[invoice.invoice_id] || await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// //             setSelectedInvoice({ ...invoice, details });
// //             setShowDetails(true);
// //         } catch (error) {
// //             console.error('Failed to load invoice details:', error);
// //             toast.error('Failed to load invoice details');
// //         }
// //     };

// //     const formatDateForDisplay = (dateString) => {
// //         if (!dateString) return '';
// //         const date = new Date(dateString);
// //         if (isNaN(date.getTime())) return '';
// //         const day = String(date.getDate()).padStart(2, '0');
// //         const month = String(date.getMonth() + 1).padStart(2, '0');
// //         const year = date.getFullYear();
// //         return `${day}/${month}/${year}`;
// //     };

// //     const generatePDF = async (invoice, details) => {
// //         try {
// //             const formattedDate = formatDateForDisplay(invoice.invoice_date);
            
// //             // Group items by customer for display
// //             const itemsByCustomer = {};
// //             details.forEach(item => {
// //                 const customerKey = item.customer_id || item.customer_name;
// //                 if (!itemsByCustomer[customerKey]) {
// //                     itemsByCustomer[customerKey] = {
// //                         customerName: item.customer_name,
// //                         customerNameUrdu: item.customer_name_urdu || '',
// //                         items: []
// //                     };
// //                 }
// //                 itemsByCustomer[customerKey].items.push(item);
// //             });

// //             let customerSectionsHtml = '';
// //             for (const [_, customerData] of Object.entries(itemsByCustomer)) {
// //                 customerSectionsHtml += `
// //                     <div class="customer-section">
// //                         <h3>Customer: ${customerData.customerName} ${customerData.customerNameUrdu ? `(${customerData.customerNameUrdu})` : ''}</h3>
// //                         <table class="items-table">
// //                             <thead>
// //                                 <tr>
// //                                     <th>#</th>
// //                                     <th>Item Description</th>
// //                                     <th class="text-right">Quantity</th>
// //                                     <th class="text-right">Rate (₨)</th>
// //                                     <th class="text-right">Amount (₨)</th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody>
// //                                 ${customerData.items.map((item, idx) => `
// //                                     <tr>
// //                                         <td>${idx + 1}</td>
// //                                         <td><strong>${item.item_name}${item.item_name_urdu ? ` (${item.item_name_urdu})` : ''}</strong></td>
// //                                         <td class="text-right">${item.quantity}</td>
// //                                         <td class="text-right">₨ ${item.rate?.toLocaleString() || 0}</td>
// //                                         <td class="text-right">₨ ${item.amount?.toLocaleString() || 0}</td>
// //                                     </tr>
// //                                 `).join('')}
// //                             </tbody>
// //                         </table>
// //                     </div>
// //                 `;
// //             }

// //             const html = `
// //             <!DOCTYPE html>
// //             <html>
// //             <head>
// //                 <meta charset="UTF-8">
// //                 <title>Invoice ${invoice.voucher_id}</title>
// //                 <style>
// //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// //                     body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: white; color: #333; }
// //                     .invoice-container { max-width: 1100px; margin: 0 auto; background: white; }
// //                     .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #4CAF50; }
// //                     .company-name { font-size: 28px; font-weight: bold; color: #2c3e50; }
// //                     .invoice-title { font-size: 24px; font-weight: bold; color: #4CAF50; margin-top: 10px; }
// //                     .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
// //                     .details-section p { margin: 8px 0; font-size: 12px; }
// //                     .customer-section { margin-bottom: 30px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; }
// //                     .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
// //                     .items-table th { background: #4CAF50; color: white; padding: 12px; text-align: left; font-size: 12px; }
// //                     .items-table td { padding: 10px 12px; border-bottom: 1px solid #e0e0e0; font-size: 11px; }
// //                     .text-right { text-align: right; }
// //                     .totals-section { margin-top: 20px; text-align: right; }
// //                     .totals-line { margin: 8px 0; font-size: 12px; }
// //                     .grand-total { font-size: 16px; font-weight: bold; color: #4CAF50; margin-top: 10px; padding-top: 10px; border-top: 2px solid #4CAF50; }
// //                     .footer { margin-top: 40px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 10px; color: #999; }
// //                 </style>
// //             </head>
// //             <body>
// //                 <div class="invoice-container">
// //                     <div class="header">
// //                         <div class="company-name">INVENTORY MANAGEMENT SYSTEM</div>
// //                         <div class="invoice-title">SALE INVOICE</div>
// //                     </div>
// //                     <div class="invoice-details">
// //                         <div class="details-section">
// //                             <p><strong>Voucher No:</strong> ${invoice.voucher_id}</p>
// //                             <p><strong>Invoice Date:</strong> ${formattedDate}</p>
// //                         </div>
// //                         <div class="details-section">
// //                             <p><strong>Ref No:</strong> ${invoice.order_no || 'N/A'}</p>
// //                             <p><strong>Print Date:</strong> ${formatDateForDisplay(new Date().toISOString().split('T')[0])}</p>
// //                         </div>
// //                     </div>
// //                     ${customerSectionsHtml}
// //                     <div class="totals-section">
// //                         <div class="totals-line"><strong>Total Items:</strong> ${invoice.total_weight || 0}</div>
// //                         <div class="totals-line"><strong>Sub Total:</strong> ₨ ${(invoice.total_amount || 0).toLocaleString()}</div>
// //                         <div class="totals-line"><strong>Discount:</strong> ₨ ${(invoice.discount || 0).toLocaleString()}</div>
// //                         <div class="grand-total"><strong>Grand Total:</strong> ₨ ${(invoice.net_amount || 0).toLocaleString()}</div>
// //                     </div>
// //                     <div class="footer"><p>Thank you for your business!</p></div>
// //                 </div>
// //             </body>
// //             </html>
// //         `;

// //             if (window.electron && window.electron.openHTMLInBrowser) {
// //                 await window.electron.openHTMLInBrowser(html);
// //                 toast.success('Invoice opened in your browser');
// //             } else if (window.electron && window.electron.printToPDFAndOpen) {
// //                 await window.electron.printToPDFAndOpen(html);
// //                 toast.success('Invoice opened successfully');
// //             } else {
// //                 const printWindow = window.open('', '_blank');
// //                 printWindow.document.write(html);
// //                 printWindow.document.close();
// //                 printWindow.print();
// //                 toast.success('Print dialog opened');
// //             }
// //         } catch (error) {
// //             console.error('PDF generation error:', error);
// //             toast.error('Failed to generate PDF');
// //         }
// //     };

// //     const handlePrint = async (invoice) => {
// //         try {
// //             const details = invoiceDetails[invoice.invoice_id] || await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// //             await generatePDF(invoice, details);
// //         } catch (error) {
// //             console.error('Failed to generate PDF:', error);
// //             toast.error('Failed to generate PDF');
// //         }
// //     };

// //     const handleDelete = async (id) => {
// //         if (window.confirm('Are you sure you want to delete this invoice?')) {
// //             try {
// //                 await window.electron.database.deleteInvoice(id);
// //                 toast.success('Invoice deleted successfully');
// //                 loadInvoices();
// //                 setShowDetails(false);
// //             } catch (error) {
// //                 console.error('Failed to delete invoice:', error);
// //                 toast.error('Failed to delete invoice');
// //             }
// //         }
// //     };

// //     const getTotalAmount = () => {
// //         return filteredInvoices.reduce((sum, inv) => sum + (inv.net_amount || 0), 0);
// //     };

// //     const getTotalWeight = () => {
// //         return filteredInvoices.reduce((sum, inv) => sum + (inv.total_weight || 0), 0);
// //     };

// //     // Get unique customers for an invoice
// //     const getInvoiceCustomers = (invoiceId) => {
// //         const details = invoiceDetails[invoiceId] || [];
// //         const uniqueCustomers = [...new Set(details.map(d => d.customer_name).filter(Boolean))];
// //         return uniqueCustomers.join(', ');
// //     };

// //     return (
// //         <div className="container">
// //             <div className="header">
// //                 <h1>Invoice List</h1>
// //                 <div style={{ display: 'flex', gap: '10px' }}>
// //                     <button className="btn-primary" onClick={() => navigate('/invoices/new')}>
// //                         <FiPlus /> New Invoice (CTRL + N)
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* Date Range Filter */}
// //             <div className="form-panel">
// //                 <div className="form-grid">
// //                     <div className="form-group">
// //                         <label>Date Range</label>
// //                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
// //                             <input
// //                                 type="date"
// //                                 value={startDate}
// //                                 onChange={(e) => setStartDate(e.target.value)}
// //                             />
// //                             <span>to</span>
// //                             <input
// //                                 type="date"
// //                                 value={endDate}
// //                                 onChange={(e) => setEndDate(e.target.value)}
// //                             />
// //                         </div>
// //                     </div>
// //                     <div className="form-group">
// //                         <label>Search</label>
// //                         <div className="search-box">
// //                             <FiSearch />
// //                             <input
// //                                 type="text"
// //                                 placeholder="Search by Voucher ID, Ref No..."
// //                                 value={searchTerm}
// //                                 style={{ width: '100%' }}
// //                                 onChange={(e) => setSearchTerm(e.target.value)}
// //                             />
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Invoices Table - Customer column removed */}
// //             <div className="table-container">
// //                 <table className="data-table">
// //                     <thead>
// //                         <tr style={{ background: '#4CAF50', color: 'white' }}>
// //                             <th style={{ background: '#4CAF50', color: 'white' }}>ID</th>
// //                             <th style={{ background: '#4CAF50', color: 'white' }}>Voucher ID</th>
// //                             <th style={{ background: '#4CAF50', color: 'white' }}>Ref No.</th>
// //                             <th style={{ background: '#4CAF50', color: 'white' }}>Date</th>
// //                             <th style={{ background: '#4CAF50', color: 'white' }}>Total Items</th>
// //                             <th style={{ background: '#4CAF50', color: 'white' }}>Total Amount</th>
// //                             <th style={{ background: '#4CAF50', color: 'white' }}>Created By</th>
// //                             <th style={{ background: '#4CAF50', color: 'white' }}>Actions</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {filteredInvoices.map((invoice) => (
// //                             <tr key={invoice.invoice_id}>
// //                                 <td>{invoice.invoice_id}</td>
// //                                 <td><strong>{invoice.voucher_id}</strong></td>
// //                                 <td>{invoice.order_no || '-'}</td>
// //                                 <td>{formatDateForDisplay(invoice.invoice_date)}</td>
// //                                 <td>{invoice.total_weight}</td>
// //                                 <td>₨ {invoice.total_amount?.toLocaleString()}</td>
// //                                 <td>{invoice.created_by}</td>
// //                                 <td className="actions">
// //                                     <button className="icon-btn" onClick={() => handleEdit(invoice)} title="Edit">
// //                                         <FiEdit />
// //                                     </button>
// //                                     <button className="icon-btn" onClick={() => handleViewDetails(invoice)} title="View Details">
// //                                         <FiEye />
// //                                     </button>
// //                                     <button className="icon-btn" onClick={() => handlePrint(invoice)} title="Print">
// //                                         <FiPrinter />
// //                                     </button>
// //                                     <button className="icon-btn danger" onClick={() => handleDelete(invoice.invoice_id)} title="Delete">
// //                                         <FiTrash2 />
// //                                     </button>
// //                                 </td>
// //                             </tr>
// //                         ))}
// //                         {filteredInvoices.length === 0 && (
// //                             <tr>
// //                                 <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
// //                                     No invoices found for the selected date range
// //                                 </td>
// //                             </tr>
// //                         )}
// //                     </tbody>
// //                 </table>
// //             </div>

// //             {/* Invoice Details Modal */}
// //             {showDetails && selectedInvoice && (
// //                 <div className="modal-overlay" onClick={() => setShowDetails(false)}>
// //                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
// //                         <div className="modal-header">
// //                             <h2>Invoice Details - {selectedInvoice.voucher_id}</h2>
// //                             <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
// //                         </div>
// //                         <div className="modal-body">
// //                             <div className="invoice-info">
// //                                 <p><strong>Date:</strong> {formatDateForDisplay(selectedInvoice.invoice_date)}</p>
// //                                 <p><strong>Ref NO:</strong> {selectedInvoice.order_no || 'N/A'}</p>
// //                                 <p><strong>Notes:</strong> {selectedInvoice.notes || 'N/A'}</p>
// //                             </div>

// //                             {/* Group items by customer in details modal */}
// //                             {selectedInvoice.details && (() => {
// //                                 const itemsByCustomer = {};
// //                                 selectedInvoice.details.forEach(item => {
// //                                     const customerKey = item.customer_id || item.customer_name;
// //                                     if (!itemsByCustomer[customerKey]) {
// //                                         itemsByCustomer[customerKey] = {
// //                                             customerName: item.customer_name,
// //                                             customerNameUrdu: item.customer_name_urdu || '',
// //                                             items: []
// //                                         };
// //                                     }
// //                                     itemsByCustomer[customerKey].items.push(item);
// //                                 });

// //                                 return Object.entries(itemsByCustomer).map(([_, customerData], idx) => (
// //                                     <div key={idx} style={{ marginBottom: '30px' }}>
// //                                         <h3 style={{ color: '#ff9800', marginBottom: '10px' }}>
// //                                             Customer: {customerData.customerName} 
// //                                             {customerData.customerNameUrdu && ` (${customerData.customerNameUrdu})`}
// //                                         </h3>
// //                                         <table className="data-table">
// //                                             <thead>
// //                                                 <tr>
// //                                                     <th>Sr.</th>
// //                                                     <th>Item</th>
// //                                                     <th>Qty</th>
// //                                                     <th>Rate</th>
// //                                                     <th>Amount</th>
// //                                                 </tr>
// //                                             </thead>
// //                                             <tbody>
// //                                                 {customerData.items.map((item, itemIdx) => (
// //                                                     <tr key={itemIdx}>
// //                                                         <td>{itemIdx + 1}</td>
// //                                                         <td>{item.item_name}{item.item_name_urdu && ` (${item.item_name_urdu})`}</td>
// //                                                         <td>{item.quantity}</td>
// //                                                         <td>₨ {item.rate?.toLocaleString()}</td>
// //                                                         <td>₨ {item.amount?.toLocaleString()}</td>
// //                                                     </tr>
// //                                                 ))}
// //                                             </tbody>
// //                                         </table>
// //                                     </div>
// //                                 ));
// //                             })()}

// //                             <div style={{ marginTop: '20px', textAlign: 'right' }}>
// //                                 <p><strong>Total Items:</strong> {selectedInvoice.total_weight}</p>
// //                                 <p><strong>Total Amount:</strong> ₨ {selectedInvoice.total_amount?.toLocaleString()}</p>
// //                                 <p><strong>Discount:</strong> ₨ {selectedInvoice.discount?.toLocaleString()}</p>
// //                                 <p><strong>Net Amount:</strong> ₨ {selectedInvoice.net_amount?.toLocaleString()}</p>
// //                             </div>
// //                         </div>
// //                         <div className="modal-footer">
// //                             <button className="btn-primary" onClick={() => handlePrint(selectedInvoice)}>
// //                                 <FiPrinter /> Print
// //                             </button>
// //                             <button className="btn-danger" onClick={() => setShowDetails(false)}>
// //                                 Close
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             <style jsx>{`
// //                 .modal-overlay {
// //                     position: fixed;
// //                     top: 0;
// //                     left: 0;
// //                     right: 0;
// //                     bottom: 0;
// //                     background: rgba(0,0,0,0.5);
// //                     display: flex;
// //                     justify-content: center;
// //                     align-items: center;
// //                     z-index: 1000;
// //                 }
                
// //                 .modal-content {
// //                     background: white;
// //                     border-radius: 8px;
// //                     width: 90%;
// //                     max-width: 1000px;
// //                     max-height: 80vh;
// //                     overflow-y: auto;
// //                     box-shadow: 0 4px 20px rgba(0,0,0,0.2);
// //                 }
                
// //                 .modal-header {
// //                     display: flex;
// //                     justify-content: space-between;
// //                     align-items: center;
// //                     padding: 15px 20px;
// //                     border-bottom: 1px solid #e0e0e0;
// //                     background: #f5f5f5;
// //                     border-radius: 8px 8px 0 0;
// //                 }
                
// //                 .modal-header h2 {
// //                     margin: 0;
// //                     color: #4CAF50;
// //                 }
                
// //                 .close-btn {
// //                     background: none;
// //                     border: none;
// //                     font-size: 24px;
// //                     cursor: pointer;
// //                     color: #999;
// //                 }
                
// //                 .close-btn:hover {
// //                     color: #f44336;
// //                 }
                
// //                 .modal-body {
// //                     padding: 20px;
// //                 }
                
// //                 .invoice-info {
// //                     display: grid;
// //                     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
// //                     gap: 10px;
// //                     margin-bottom: 20px;
// //                     padding: 15px;
// //                     background: #f9f9f9;
// //                     border-radius: 4px;
// //                 }
                
// //                 .modal-footer {
// //                     padding: 15px 20px;
// //                     border-top: 1px solid #e0e0e0;
// //                     display: flex;
// //                     justify-content: flex-end;
// //                     gap: 10px;
// //                 }
                
// //                 .btn-secondary {
// //                     padding: 8px 16px;
// //                     background: #2196F3;
// //                     color: white;
// //                     border: none;
// //                     border-radius: 4px;
// //                     cursor: pointer;
// //                     display: flex;
// //                     align-items: center;
// //                     gap: 6px;
// //                     font-size: 14px;
// //                 }
                
// //                 .btn-secondary:disabled {
// //                     opacity: 0.5;
// //                     cursor: not-allowed;
// //                 }
// //             `}</style>
// //         </div>
// //     );
// // }

// // export default InvoiceList;

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { FiEye, FiPrinter, FiTrash2, FiCalendar, FiEdit, FiSearch, FiPlus, FiFileText, FiDownload } from 'react-icons/fi';
// import { NavigationContext } from '../App';
// import { useNavigate } from 'react-router-dom';
// import { useContext } from 'react';

// function InvoiceList() {
//     const navigate = useNavigate();
//     const { goBack } = useContext(NavigationContext);
//     const [invoices, setInvoices] = useState([]);
//     const [filteredInvoices, setFilteredInvoices] = useState([]);
//     const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
//     const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedInvoice, setSelectedInvoice] = useState(null);
//     const [showDetails, setShowDetails] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [invoiceDetails, setInvoiceDetails] = useState({});

//     useEffect(() => {
//         loadInvoices();
//     }, []);

//     useEffect(() => {
//         filterInvoices();
//     }, [invoices, startDate, endDate, searchTerm]);

//     useEffect(() => {
//         const handleKeyDown = (event) => {
//             if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
//                 event.preventDefault();
//                 navigate('/invoices/new');
//                 toast.success('Opening new invoice form...');
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);
//         return () => {
//             window.removeEventListener('keydown', handleKeyDown);
//         };
//     }, [navigate]);

//     const loadInvoices = async () => {
//         try {
//             const data = await window.electron.database.getInvoices();
//             setInvoices(data || []);
//             console.log("data",data)
//             // Load details for each invoice to get customer information
//             for (const invoice of (data || [])) {
//                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//                 console.log("details",details)
//                 setInvoiceDetails(prev => ({
//                     ...prev,
//                     [invoice.invoice_id]: details
//                 }));
//             }

//         } catch (error) {
//             console.error('Failed to load invoices:', error);
//             toast.error('Failed to load invoices');
//         }
//     };

//     const handleEdit = (invoice) => {
//         console.log("invoice",invoice)
//         navigate('/invoices/edit', { state: { invoice } });
//     };

//     const filterInvoices = () => {
//         let filtered = [...invoices];

//         filtered = filtered.filter(inv => {
//             const invDate = inv.invoice_date;
//             return invDate >= startDate && invDate <= endDate;
//         });

//         if (searchTerm.trim()) {
//             filtered = filtered.filter(inv =>
//                 inv.voucher_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 inv.order_no?.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }

//         setFilteredInvoices(filtered);
//     };

//     const handleViewDetails = async (invoice) => {
//         try {
//             const details = invoiceDetails[invoice.invoice_id] || await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//             setSelectedInvoice({ ...invoice, details });
//             setShowDetails(true);
//         } catch (error) {
//             console.error('Failed to load invoice details:', error);
//             toast.error('Failed to load invoice details');
//         }
//     };

//     const formatDateForDisplay = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) return '';
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//     };

//     const formatDateTimeForDisplay = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) return '';
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = date.getFullYear();
//         const hours = String(date.getHours()).padStart(2, '0');
//         const minutes = String(date.getMinutes()).padStart(2, '0');
//         return `${day}/${month}/${year} ${hours}:${minutes}`;
//     };

//     const generatePDF = async (invoice, details) => {
//         try {
//             const formattedDate = formatDateForDisplay(invoice.invoice_date);
            
//             // Group items by customer for display
//             const itemsByCustomer = {};
//             details.forEach(item => {
//                 const customerKey = item.customer_id || item.customer_name;
//                 if (!itemsByCustomer[customerKey]) {
//                     itemsByCustomer[customerKey] = {
//                         customerName: item.customer_name,
//                         customerNameUrdu: item.customer_name_urdu || '',
//                         items: []
//                     };
//                 }
//                 itemsByCustomer[customerKey].items.push(item);
//             });

//             let customerSectionsHtml = '';
//             for (const [_, customerData] of Object.entries(itemsByCustomer)) {
//                 customerSectionsHtml += `
//                     <div class="customer-section">
//                         <h3>Customer: ${customerData.customerName} ${customerData.customerNameUrdu ? `(${customerData.customerNameUrdu})` : ''}</h3>
//                         <table class="items-table">
//                             <thead>
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Item Description</th>
//                                     <th class="text-right">Quantity</th>
//                                     <th class="text-right">Rate (₨)</th>
//                                     <th class="text-right">Amount (₨)</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 ${customerData.items.map((item, idx) => `
//                                     <tr>
//                                         <td>${idx + 1}</td>
//                                         <td><strong>${item.item_name}${item.item_name_urdu ? ` (${item.item_name_urdu})` : ''}</strong></td>
//                                         <td class="text-right">${item.quantity}</td>
//                                         <td class="text-right">₨ ${item.rate?.toLocaleString() || 0}</td>
//                                         <td class="text-right">₨ ${item.amount?.toLocaleString() || 0}</td>
//                                     </tr>
//                                 `).join('')}
//                             </tbody>
//                         </table>
//                     </div>
//                 `;
//             }

//             const html = `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta charset="UTF-8">
//                 <title>Invoice ${invoice.voucher_id}</title>
//                 <style>
//                     * { margin: 0; padding: 0; box-sizing: border-box; }
//                     body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: white; color: #333; }
//                     .invoice-container { max-width: 1100px; margin: 0 auto; background: white; }
//                     .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #4CAF50; }
//                     .company-name { font-size: 28px; font-weight: bold; color: #2c3e50; }
//                     .invoice-title { font-size: 24px; font-weight: bold; color: #4CAF50; margin-top: 10px; }
//                     .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
//                     .details-section p { margin: 8px 0; font-size: 12px; }
//                     .customer-section { margin-bottom: 30px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; }
//                     .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
//                     .items-table th { background: #4CAF50; color: white; padding: 12px; text-align: left; font-size: 12px; }
//                     .items-table td { padding: 10px 12px; border-bottom: 1px solid #e0e0e0; font-size: 11px; }
//                     .text-right { text-align: right; }
//                     .totals-section { margin-top: 20px; text-align: right; }
//                     .totals-line { margin: 8px 0; font-size: 12px; }
//                     .grand-total { font-size: 16px; font-weight: bold; color: #4CAF50; margin-top: 10px; padding-top: 10px; border-top: 2px solid #4CAF50; }
//                     .footer { margin-top: 40px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 10px; color: #999; }
//                 </style>
//             </head>
//             <body>
//                 <div class="invoice-container">
//                     <div class="header">
//                         <div class="company-name">INVENTORY MANAGEMENT SYSTEM</div>
//                         <div class="invoice-title">SALE INVOICE</div>
//                     </div>
//                     <div class="invoice-details">
//                         <div class="details-section">
//                             <p><strong>Voucher No:</strong> ${invoice.voucher_id}</p>
//                             <p><strong>Invoice Date:</strong> ${formattedDate}</p>
//                         </div>
//                         <div class="details-section">
//                             <p><strong>Ref No:</strong> ${invoice.order_no || 'N/A'}</p>
//                             <p><strong>Print Date:</strong> ${formatDateForDisplay(new Date().toISOString().split('T')[0])}</p>
//                         </div>
//                     </div>
//                     ${customerSectionsHtml}
//                     <div class="totals-section">
//                         <div class="totals-line"><strong>Total Items:</strong> ${invoice.total_weight || 0}</div>
//                         <div class="totals-line"><strong>Sub Total:</strong> ₨ ${(invoice.total_amount || 0).toLocaleString()}</div>
//                         <div class="totals-line"><strong>Discount:</strong> ₨ ${(invoice.discount || 0).toLocaleString()}</div>
//                         <div class="grand-total"><strong>Grand Total:</strong> ₨ ${(invoice.net_amount || 0).toLocaleString()}</div>
//                     </div>
//                     <div class="footer"><p>Thank you for your business!</p></div>
//                 </div>
//             </body>
//             </html>
//         `;

//             if (window.electron && window.electron.openHTMLInBrowser) {
//                 await window.electron.openHTMLInBrowser(html);
//                 toast.success('Invoice opened in your browser');
//             } else if (window.electron && window.electron.printToPDFAndOpen) {
//                 await window.electron.printToPDFAndOpen(html);
//                 toast.success('Invoice opened successfully');
//             } else {
//                 const printWindow = window.open('', '_blank');
//                 printWindow.document.write(html);
//                 printWindow.document.close();
//                 printWindow.print();
//                 toast.success('Print dialog opened');
//             }
//         } catch (error) {
//             console.error('PDF generation error:', error);
//             toast.error('Failed to generate PDF');
//         }
//     };

//     const handlePrint = async (invoice) => {
//         try {
//             const details = invoiceDetails[invoice.invoice_id] || await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//             await generatePDF(invoice, details);
//         } catch (error) {
//             console.error('Failed to generate PDF:', error);
//             toast.error('Failed to generate PDF');
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to delete this invoice?')) {
//             try {
//                 await window.electron.database.deleteInvoice(id);
//                 toast.success('Invoice deleted successfully');
//                 loadInvoices();
//                 setShowDetails(false);
//             } catch (error) {
//                 console.error('Failed to delete invoice:', error);
//                 toast.error('Failed to delete invoice');
//             }
//         }
//     };

//     const getTotalAmount = () => {
//         return filteredInvoices.reduce((sum, inv) => sum + (inv.net_amount || 0), 0);
//     };

//     const getTotalWeight = () => {
//         return filteredInvoices.reduce((sum, inv) => sum + (inv.total_weight || 0), 0);
//     };

//     // Get unique customers for an invoice
//     const getInvoiceCustomers = (invoiceId) => {
//         const details = invoiceDetails[invoiceId] || [];
//         const uniqueCustomers = [...new Set(details.map(d => d.customer_name).filter(Boolean))];
//         return uniqueCustomers.join(', ');
//     };

//     return (
//         <div className="container">
//             <div className="header">
//                 <h1>Invoice List</h1>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                     <button className="btn-primary" onClick={() => navigate('/invoices/new')}>
//                         <FiPlus /> New Invoice (CTRL + N)
//                     </button>
//                 </div>
//             </div>

//             {/* Date Range Filter */}
//             <div className="form-panel">
//                 <div className="form-grid">
//                     <div className="form-group">
//                         <label>Date Range</label>
//                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//                             <input
//                                 type="date"
//                                 value={startDate}
//                                 onChange={(e) => setStartDate(e.target.value)}
//                             />
//                             <span>to</span>
//                             <input
//                                 type="date"
//                                 value={endDate}
//                                 onChange={(e) => setEndDate(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="form-group">
//                         <label>Search</label>
//                         <div className="search-box">
//                             <FiSearch />
//                             <input
//                                 type="text"
//                                 placeholder="Search by Voucher ID, Ref No..."
//                                 value={searchTerm}
//                                 style={{ width: '100%' }}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Invoices Table */}
//             <div className="table-container">
//                 <table className="data-table">
//                     <thead>
//                         <tr style={{ background: '#4CAF50', color: 'white' }}>
//                             <th style={{ background: '#4CAF50', color: 'white' }}>ID</th>
//                             <th style={{ background: '#4CAF50', color: 'white' }}>Voucher ID</th>
//                             <th style={{ background: '#4CAF50', color: 'white' }}>Ref No.</th>
//                             <th style={{ background: '#4CAF50', color: 'white' }}>Date</th>
//                             <th style={{ background: '#4CAF50', color: 'white' }}>Total Items</th>
//                             <th style={{ background: '#4CAF50', color: 'white' }}>Total Amount</th>
//                             <th style={{ background: '#4CAF50', color: 'white' }}>Created </th>
//                             <th style={{ background: '#4CAF50', color: 'white' }}>Modified</th>
//                             <th style={{ background: '#4CAF50', color: 'white' }}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredInvoices.map((invoice) => (
//                             <tr key={invoice.invoice_id}>
//                                 <td>{invoice.invoice_id}</td>
//                                 <td><strong>{invoice.voucher_id}</strong></td>
//                                 <td>{invoice.order_no || '-'}</td>
//                                 <td>{formatDateForDisplay(invoice.invoice_date)}</td>
//                                 <td>{invoice.total_weight}</td>
//                                 <td>₨ {invoice.total_amount?.toLocaleString()}</td>
//                                 <td style={{ fontSize: '12px' }}>
//                                     <div><strong>{invoice.created_by || '-'}</strong></div>
//                                     <div style={{ color: '#666', fontSize: '11px' }}>
//                                         {formatDateTimeForDisplay(invoice.created_at)}
//                                     </div>
//                                 </td>
//                                 <td style={{ fontSize: '12px' }}>
//                                     {invoice.modified_by ? (
//                                         <>
//                                             <div><strong>{invoice.modified_by}</strong></div>
//                                             <div style={{ color: '#666', fontSize: '11px' }}>
//                                                 {formatDateTimeForDisplay(invoice.modified_at)}
//                                             </div>
//                                         </>
//                                     ) : (
//                                         <div style={{ color: '#999', fontStyle: 'italic' }}>Not modified</div>
//                                     )}
//                                 </td>
//                                 <td className="actions">
//                                     <button className="icon-btn" onClick={() => handleEdit(invoice)} title="Edit">
//                                         <FiEdit />
//                                     </button>
//                                     <button className="icon-btn" onClick={() => handleViewDetails(invoice)} title="View Details">
//                                         <FiEye />
//                                     </button>
//                                     {/* <button className="icon-btn" onClick={() => handlePrint(invoice)} title="Print">
//                                         <FiPrinter />
//                                     </button> */}
//                                     <button className="icon-btn danger" onClick={() => handleDelete(invoice.invoice_id)} title="Delete">
//                                         <FiTrash2 />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                         {filteredInvoices.length === 0 && (
//                             <tr>
//                                 <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
//                                     No invoices found for the selected date range
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Summary Section */}
//             {filteredInvoices.length > 0 && (
//                 <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
//                     <div><strong>Total Invoices:</strong> {filteredInvoices.length}</div>
//                     <div><strong>Total Weight:</strong> {getTotalWeight().toLocaleString()}</div>
//                     <div><strong>Total Amount:</strong> ₨ {getTotalAmount().toLocaleString()}</div>
//                 </div>
//             )}

//             {/* Invoice Details Modal */}
//             {showDetails && selectedInvoice && (
//                 <div className="modal-overlay" onClick={() => setShowDetails(false)}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-header">
//                             <h2>Invoice Details - {selectedInvoice.voucher_id}</h2>
//                             <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
//                         </div>
//                         <div className="modal-body">
//                             <div className="invoice-info">
//                                 <p><strong>Date:</strong> {formatDateForDisplay(selectedInvoice.invoice_date)}</p>
//                                 <p><strong>Ref NO:</strong> {selectedInvoice.order_no || 'N/A'}</p>
//                                 <p><strong>Notes:</strong> {selectedInvoice.notes || 'N/A'}</p>
//                                 <p><strong>Created By:</strong> {selectedInvoice.created_by || '-'} on {formatDateTimeForDisplay(selectedInvoice.created_at)}</p>
//                                 {selectedInvoice.modified_by && (
//                                     <p><strong>Modified By:</strong> {selectedInvoice.modified_by} on {formatDateTimeForDisplay(selectedInvoice.modified_at)}</p>
//                                 )}
//                             </div>

//                             {/* Group items by customer in details modal */}
//                             {selectedInvoice.details && (() => {
//                                 const itemsByCustomer = {};
//                                 selectedInvoice.details.forEach(item => {
//                                     const customerKey = item.customer_id || item.customer_name;
//                                     if (!itemsByCustomer[customerKey]) {
//                                         itemsByCustomer[customerKey] = {
//                                             customerName: item.customer_name,
//                                             customerNameUrdu: item.customer_name_urdu || '',
//                                             items: []
//                                         };
//                                     }
//                                     itemsByCustomer[customerKey].items.push(item);
//                                 });

//                                 return Object.entries(itemsByCustomer).map(([_, customerData], idx) => (
//                                     <div key={idx} style={{ marginBottom: '30px' }}>
//                                         <h3 style={{ color: '#ff9800', marginBottom: '10px' }}>
//                                             Customer: {customerData.customerName} 
//                                             {customerData.customerNameUrdu && ` (${customerData.customerNameUrdu})`}
//                                         </h3>
//                                         <table className="data-table">
//                                             <thead>
//                                                 <tr>
//                                                     <th>Sr.</th>
//                                                     <th>Item</th>
//                                                     <th>Qty</th>
//                                                     <th>Rate</th>
//                                                     <th>Amount</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {customerData.items.map((item, itemIdx) => (
//                                                     <tr key={itemIdx}>
//                                                         <td>{itemIdx + 1}</td>
//                                                         <td>{item.item_name}{item.item_name_urdu && ` (${item.item_name_urdu})`}</td>
//                                                         <td>{item.quantity}</td>
//                                                         <td>₨ {item.rate?.toLocaleString()}</td>
//                                                         <td>₨ {item.amount?.toLocaleString()}</td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 ));
//                             })()}

//                             <div style={{ marginTop: '20px', textAlign: 'right' }}>
//                                 <p><strong>Total Items:</strong> {selectedInvoice.total_weight}</p>
//                                 <p><strong>Total Amount:</strong> ₨ {selectedInvoice.total_amount?.toLocaleString()}</p>
//                                 <p><strong>Discount:</strong> ₨ {selectedInvoice.discount?.toLocaleString()}</p>
//                                 <p><strong>Net Amount:</strong> ₨ {selectedInvoice.net_amount?.toLocaleString()}</p>
//                             </div>
//                         </div>
//                         <div className="modal-footer">
//                             {/* <button className="btn-primary" onClick={() => handlePrint(selectedInvoice)}>
//                                 <FiPrinter /> Print
//                             </button> */}
//                             <button className="btn-danger" onClick={() => setShowDetails(false)}>
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <style jsx>{`
//                 .modal-overlay {
//                     position: fixed;
//                     top: 0;
//                     left: 0;
//                     right: 0;
//                     bottom: 0;
//                     background: rgba(0,0,0,0.5);
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     z-index: 1000;
//                 }
                
//                 .modal-content {
//                     background: white;
//                     border-radius: 8px;
//                     width: 90%;
//                     max-width: 1000px;
//                     max-height: 80vh;
//                     overflow-y: auto;
//                     box-shadow: 0 4px 20px rgba(0,0,0,0.2);
//                 }
                
//                 .modal-header {
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     padding: 15px 20px;
//                     border-bottom: 1px solid #e0e0e0;
//                     background: #f5f5f5;
//                     border-radius: 8px 8px 0 0;
//                 }
                
//                 .modal-header h2 {
//                     margin: 0;
//                     color: #4CAF50;
//                 }
                
//                 .close-btn {
//                     background: none;
//                     border: none;
//                     font-size: 24px;
//                     cursor: pointer;
//                     color: #999;
//                 }
                
//                 .close-btn:hover {
//                     color: #f44336;
//                 }
                
//                 .modal-body {
//                     padding: 20px;
//                 }
                
//                 .invoice-info {
//                     display: grid;
//                     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//                     gap: 10px;
//                     margin-bottom: 20px;
//                     padding: 15px;
//                     background: #f9f9f9;
//                     border-radius: 4px;
//                 }
                
//                 .modal-footer {
//                     padding: 15px 20px;
//                     border-top: 1px solid #e0e0e0;
//                     display: flex;
//                     justify-content: flex-end;
//                     gap: 10px;
//                 }
                
//                 .btn-secondary {
//                     padding: 8px 16px;
//                     background: #2196F3;
//                     color: white;
//                     border: none;
//                     border-radius: 4px;
//                     cursor: pointer;
//                     display: flex;
//                     align-items: center;
//                     gap: 6px;
//                     font-size: 14px;
//                 }
                
//                 .btn-secondary:disabled {
//                     opacity: 0.5;
//                     cursor: not-allowed;
//                 }
//             `}</style>
//         </div>
//     );
// }

// export default InvoiceList;
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