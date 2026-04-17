// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { toast } from 'react-hot-toast';
// // // // // import { FiPrinter, FiDownload, FiCalendar } from 'react-icons/fi';
// // // // // import jsPDF from 'jspdf';
// // // // // import 'jspdf-autotable';

// // // // // function Reports() {
// // // // //     const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
// // // // //     const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
// // // // //     const [salesData, setSalesData] = useState([]);
// // // // //     const [itemSummary, setItemSummary] = useState([]);
// // // // //     const [loading, setLoading] = useState(false);
// // // // //     const [reportType, setReportType] = useState('sales');

// // // // //     useEffect(() => {
// // // // //         loadReports();
// // // // //     }, [startDate, endDate]);

// // // // //     const loadReports = async () => {
// // // // //         setLoading(true);
// // // // //         try {
// // // // //             const sales = await window.electron.database.getSalesReport({ startDate, endDate });
// // // // //             setSalesData(sales || []);

// // // // //             const items = await window.electron.database.getItemWiseSummary({ startDate, endDate });
// // // // //             setItemSummary(items || []);
// // // // //         } catch (error) {
// // // // //             toast.error('Failed to load reports');
// // // // //         } finally {
// // // // //             setLoading(false);
// // // // //         }
// // // // //     };

// // // // //     const getTotalSales = () => {
// // // // //         return salesData.reduce((sum, inv) => sum + inv.net_amount, 0);
// // // // //     };

// // // // //     const getTotalInvoices = () => {
// // // // //         return salesData.length;
// // // // //     };

// // // // //     const getTotalItems = () => {
// // // // //         return salesData.reduce((sum, inv) => sum + inv.total_weight, 0);
// // // // //     };

// // // // //     const getAverageInvoice = () => {
// // // // //         if (salesData.length === 0) return 0;
// // // // //         return getTotalSales() / salesData.length;
// // // // //     };

// // // // //     const printSalesReport = () => {
// // // // //         const doc = new jsPDF();

// // // // //         // Header
// // // // //         doc.setFontSize(20);
// // // // //         doc.text('INVENTORY MANAGEMENT SYSTEM', 105, 20, { align: 'center' });
// // // // //         doc.setFontSize(16);
// // // // //         doc.text('SALES REPORT', 105, 30, { align: 'center' });
// // // // //         doc.setFontSize(10);
// // // // //         doc.text(`Date Range: ${startDate} to ${endDate}`, 105, 38, { align: 'center' });

// // // // //         // Summary
// // // // //         doc.setFontSize(11);
// // // // //         doc.text(`Total Invoices: ${getTotalInvoices()}`, 14, 50);
// // // // //         doc.text(`Total Items Sold: ${getTotalItems()}`, 14, 57);
// // // // //         doc.text(`Total Sales: ₨ ${getTotalSales().toLocaleString()}`, 14, 64);
// // // // //         doc.text(`Average Invoice: ₨ ${getAverageInvoice().toLocaleString()}`, 14, 71);

// // // // //         // Sales Table
// // // // //         const tableData = salesData.map((inv, index) => [
// // // // //             index + 1,
// // // // //             inv.voucher_id,
// // // // //             inv.invoice_date,
// // // // //             inv.customer_name,
// // // // //             inv.total_weight,
// // // // //             `₨ ${inv.net_amount.toLocaleString()}`
// // // // //         ]);

// // // // //         doc.autoTable({
// // // // //             startY: 80,
// // // // //             head: [['Sr.', 'Voucher ID', 'Date', 'Customer', 'Weight', 'Amount']],
// // // // //             body: tableData,
// // // // //             theme: 'grid',
// // // // //             styles: { fontSize: 9 },
// // // // //             headStyles: { fillColor: [76, 175, 80] }
// // // // //         });

// // // // //         // Footer
// // // // //         const finalY = doc.lastAutoTable.finalY + 10;
// // // // //         doc.setFontSize(8);
// // // // //         doc.text('POS Software by Ultimate Solutions', 105, finalY, { align: 'center' });

// // // // //         doc.save(`Sales_Report_${startDate}_to_${endDate}.pdf`);
// // // // //         toast.success('Report printed successfully');
// // // // //     };

// // // // //     const printItemSummary = () => {
// // // // //         const doc = new jsPDF();

// // // // //         // Header
// // // // //         doc.setFontSize(20);
// // // // //         doc.text('INVENTORY MANAGEMENT SYSTEM', 105, 20, { align: 'center' });
// // // // //         doc.setFontSize(16);
// // // // //         doc.text('ITEM WISE SUMMARY', 105, 30, { align: 'center' });
// // // // //         doc.setFontSize(10);
// // // // //         doc.text(`Date Range: ${startDate} to ${endDate}`, 105, 38, { align: 'center' });

// // // // //         // Summary
// // // // //         const totalQty = itemSummary.reduce((sum, item) => sum + item.total_quantity, 0);
// // // // //         const totalAmount = itemSummary.reduce((sum, item) => sum + item.total_amount, 0);

// // // // //         doc.setFontSize(11);
// // // // //         doc.text(`Total Items Sold: ${totalQty}`, 14, 50);
// // // // //         doc.text(`Total Sales Value: ₨ ${totalAmount.toLocaleString()}`, 14, 57);

// // // // //         // Items Table
// // // // //         const tableData = itemSummary.map((item, index) => [
// // // // //             index + 1,
// // // // //             item.item_name,
// // // // //             item.item_name_urdu || '-',
// // // // //             item.total_quantity,
// // // // //             `₨ ${item.total_amount.toLocaleString()}`
// // // // //         ]);

// // // // //         doc.autoTable({
// // // // //             startY: 70,
// // // // //             head: [['Sr.', 'Item Name', 'Item Name (Urdu)', 'Quantity', 'Total Amount']],
// // // // //             body: tableData,
// // // // //             theme: 'grid',
// // // // //             styles: { fontSize: 9 },
// // // // //             headStyles: { fillColor: [76, 175, 80] }
// // // // //         });

// // // // //         // Footer
// // // // //         const finalY = doc.lastAutoTable.finalY + 10;
// // // // //         doc.setFontSize(8);
// // // // //         doc.text('POS Software by Ultimate Solutions', 105, finalY, { align: 'center' });

// // // // //         doc.save(`Item_Wise_Summary_${startDate}_to_${endDate}.pdf`);
// // // // //         toast.success('Report printed successfully');
// // // // //     };

// // // // //     return (
// // // // //         <div className="container">
// // // // //             <div className="header">
// // // // //                 <h1>Reports & Analytics</h1>
// // // // //             </div>

// // // // //             {/* Date Range Filter */}
// // // // //             <div className="form-panel">
// // // // //                 <div className="form-grid">
// // // // //                     <div className="form-group">
// // // // //                         <label>Date Range</label>
// // // // //                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
// // // // //                             <FiCalendar />
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
// // // // //                             <button className="btn-primary" onClick={loadReports}>
// // // // //                                 Generate Report
// // // // //                             </button>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>

// // // // //             {/* Report Type Tabs */}
// // // // //             <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
// // // // //                 <button
// // // // //                     className={reportType === 'sales' ? 'btn-primary' : 'btn-secondary'}
// // // // //                     onClick={() => setReportType('sales')}
// // // // //                 >
// // // // //                     Sales Report
// // // // //                 </button>
// // // // //                 <button
// // // // //                     className={reportType === 'items' ? 'btn-primary' : 'btn-secondary'}
// // // // //                     onClick={() => setReportType('items')}
// // // // //                 >
// // // // //                     Item Wise Summary
// // // // //                 </button>
// // // // //             </div>

// // // // //             {loading && (
// // // // //                 <div style={{ textAlign: 'center', padding: '40px' }}>
// // // // //                     Loading reports...
// // // // //                 </div>
// // // // //             )}

// // // // //             {!loading && reportType === 'sales' && (
// // // // //                 <>
// // // // //                     {/* Sales Summary Cards */}
// // // // //                     <div className="stats-grid">
// // // // //                         <div className="stat-card">
// // // // //                             <h3>Total Invoices</h3>
// // // // //                             <div className="stat-value">{getTotalInvoices()}</div>
// // // // //                         </div>
// // // // //                         <div className="stat-card">
// // // // //                             <h3>Total Items Sold</h3>
// // // // //                             <div className="stat-value">{getTotalItems().toLocaleString()}</div>
// // // // //                         </div>
// // // // //                         <div className="stat-card">
// // // // //                             <h3>Total Sales</h3>
// // // // //                             <div className="stat-value">₨ {getTotalSales().toLocaleString()}</div>
// // // // //                         </div>
// // // // //                         <div className="stat-card">
// // // // //                             <h3>Average Invoice</h3>
// // // // //                             <div className="stat-value">₨ {getAverageInvoice().toLocaleString()}</div>
// // // // //                         </div>
// // // // //                     </div>

// // // // //                     {/* Sales Table */}
// // // // //                     <div className="table-container">
// // // // //                         <div style={{ padding: '15px', display: 'flex', justifyContent: 'flex-end' }}>
// // // // //                             <button className="btn-success" onClick={printSalesReport}>
// // // // //                                 <FiPrinter /> Print Report
// // // // //                             </button>
// // // // //                         </div>
// // // // //                         <table className="data-table">
// // // // //                             <thead>
// // // // //                                 <tr>
// // // // //                                     <th>Sr.</th>
// // // // //                                     <th>Voucher ID</th>
// // // // //                                     <th>Date</th>
// // // // //                                     <th>Customer</th>
// // // // //                                     <th>Total Weight</th>
// // // // //                                     <th>Total Amount</th>
// // // // //                                     <th>Discount</th>
// // // // //                                     <th>Net Amount</th>
// // // // //                                 </tr>
// // // // //                             </thead>
// // // // //                             <tbody>
// // // // //                                 {salesData.map((invoice, index) => (
// // // // //                                     <tr key={invoice.invoice_id}>
// // // // //                                         <td>{index + 1}</td>
// // // // //                                         <td>{invoice.voucher_id}</td>
// // // // //                                         <td>{invoice.invoice_date}</td>
// // // // //                                         <td>{invoice.customer_name}</td>
// // // // //                                         <td>{invoice.total_weight}</td>
// // // // //                                         <td>₨ {invoice.total_amount?.toLocaleString()}</td>
// // // // //                                         <td>₨ {invoice.discount?.toLocaleString()}</td>
// // // // //                                         <td><strong>₨ {invoice.net_amount?.toLocaleString()}</strong></td>
// // // // //                                     </tr>
// // // // //                                 ))}
// // // // //                                 {salesData.length === 0 && (
// // // // //                                     <tr>
// // // // //                                         <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
// // // // //                                             No sales data found for the selected date range
// // // // //                                         </td>
// // // // //                                     </tr>
// // // // //                                 )}
// // // // //                             </tbody>
// // // // //                             {salesData.length > 0 && (
// // // // //                                 <tfoot>
// // // // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // // // //                                         <td colSpan="4" style={{ textAlign: 'right' }}>Totals:</td>
// // // // //                                         <td>{getTotalItems().toLocaleString()}</td>
// // // // //                                         <td>₨ {getTotalSales().toLocaleString()}</td>
// // // // //                                         <td></td>
// // // // //                                         <td>₨ {getTotalSales().toLocaleString()}</td>
// // // // //                                     </tr>
// // // // //                                 </tfoot>
// // // // //                             )}
// // // // //                         </table>
// // // // //                     </div>
// // // // //                 </>
// // // // //             )}

// // // // //             {!loading && reportType === 'items' && (
// // // // //                 <>
// // // // //                     {/* Item Summary Cards */}
// // // // //                     <div className="stats-grid">
// // // // //                         <div className="stat-card">
// // // // //                             <h3>Total Items Sold</h3>
// // // // //                             <div className="stat-value">
// // // // //                                 {itemSummary.reduce((sum, item) => sum + item.total_quantity, 0).toLocaleString()}
// // // // //                             </div>
// // // // //                         </div>
// // // // //                         <div className="stat-card">
// // // // //                             <h3>Total Sales Value</h3>
// // // // //                             <div className="stat-value">
// // // // //                                 ₨ {itemSummary.reduce((sum, item) => sum + item.total_amount, 0).toLocaleString()}
// // // // //                             </div>
// // // // //                         </div>
// // // // //                         <div className="stat-card">
// // // // //                             <h3>Unique Items</h3>
// // // // //                             <div className="stat-value">{itemSummary.length}</div>
// // // // //                         </div>
// // // // //                     </div>

// // // // //                     {/* Item Summary Table */}
// // // // //                     <div className="table-container">
// // // // //                         <div style={{ padding: '15px', display: 'flex', justifyContent: 'flex-end' }}>
// // // // //                             <button className="btn-success" onClick={printItemSummary}>
// // // // //                                 <FiPrinter /> Print Report
// // // // //                             </button>
// // // // //                         </div>
// // // // //                         <table className="data-table">
// // // // //                             <thead>
// // // // //                                 <tr>
// // // // //                                     <th>Sr.</th>
// // // // //                                     <th>Item Name</th>
// // // // //                                     <th>Item Name (Urdu)</th>
// // // // //                                     <th>Quantity Sold</th>
// // // // //                                     <th>Total Amount</th>
// // // // //                                     <th>Average Price</th>
// // // // //                                 </tr>
// // // // //                             </thead>
// // // // //                             <tbody>
// // // // //                                 {itemSummary.map((item, index) => (
// // // // //                                     <tr key={item.item_id}>
// // // // //                                         <td>{index + 1}</td>
// // // // //                                         <td>{item.item_name}</td>
// // // // //                                         <td dir="rtl">{item.item_name_urdu || '-'}</td>
// // // // //                                         <td>{item.total_quantity}</td>
// // // // //                                         <td>₨ {item.total_amount.toLocaleString()}</td>
// // // // //                                         <td>₨ {(item.total_amount / item.total_quantity).toLocaleString()}</td>
// // // // //                                     </tr>
// // // // //                                 ))}
// // // // //                                 {itemSummary.length === 0 && (
// // // // //                                     <tr>
// // // // //                                         <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
// // // // //                                             No item sales data found for the selected date range
// // // // //                                         </td>
// // // // //                                     </tr>
// // // // //                                 )}
// // // // //                             </tbody>
// // // // //                             {itemSummary.length > 0 && (
// // // // //                                 <tfoot>
// // // // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // // // //                                         <td colSpan="3" style={{ textAlign: 'right' }}>Totals:</td>
// // // // //                                         <td>{itemSummary.reduce((sum, item) => sum + item.total_quantity, 0).toLocaleString()}</td>
// // // // //                                         <td>₨ {itemSummary.reduce((sum, item) => sum + item.total_amount, 0).toLocaleString()}</td>
// // // // //                                         <td></td>
// // // // //                                     </tr>
// // // // //                                 </tfoot>
// // // // //                             )}
// // // // //                         </table>
// // // // //                     </div>
// // // // //                 </>
// // // // //             )}

// // // // //             <div className="status-bar">
// // // // //                 <span>Report generated for {startDate} to {endDate}</span>
// // // // //                 <span className="shortcuts-hint">
// // // // //                     Click Print Report to generate PDF
// // // // //                 </span>
// // // // //             </div>

// // // // //             <style jsx>{`
// // // // //         .btn-secondary {
// // // // //           background: #e0e0e0;
// // // // //           color: #333;
// // // // //           padding: 8px 16px;
// // // // //           border: none;
// // // // //           border-radius: 4px;
// // // // //           cursor: pointer;
// // // // //         }

// // // // //         .btn-secondary:hover {
// // // // //           background: #d0d0d0;
// // // // //         }
// // // // //       `}</style>
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // // export default Reports;

// // // // import React, { useState, useEffect } from 'react';
// // // // import { toast } from 'react-hot-toast';
// // // // import { FiPrinter, FiDownload, FiCalendar } from 'react-icons/fi';
// // // // import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// // // // import { NavigationContext } from '../App';
// // // // import { useNavigate } from 'react-router-dom';
// // // // import { useContext } from 'react';
// // // // function Reports() {
// // // //     const navigate = useNavigate();
// // // //     const { goBack } = useContext(NavigationContext);
// // // //     const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
// // // //     const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
// // // //     const [salesData, setSalesData] = useState([]);
// // // //     const [itemSummary, setItemSummary] = useState([]);
// // // //     const [loading, setLoading] = useState(false);
// // // //     const [reportType, setReportType] = useState('sales');

// // // //     useEffect(() => {
// // // //         loadReports();
// // // //     }, [startDate, endDate]);

// // // //     const loadReports = async () => {
// // // //         setLoading(true);
// // // //         try {
// // // //             const sales = await window.electron.database.getSalesReport({ startDate, endDate });
// // // //             setSalesData(sales || []);

// // // //             const items = await window.electron.database.getItemWiseSummary({ startDate, endDate });
// // // //             setItemSummary(items || []);
// // // //         } catch (error) {
// // // //             toast.error('Failed to load reports');
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     const getTotalSales = () => {
// // // //         return salesData.reduce((sum, inv) => sum + inv.net_amount, 0);
// // // //     };

// // // //     const getTotalInvoices = () => {
// // // //         return salesData.length;
// // // //     };

// // // //     const getTotalItems = () => {
// // // //         return salesData.reduce((sum, inv) => sum + inv.total_weight, 0);
// // // //     };

// // // //     const getAverageInvoice = () => {
// // // //         if (salesData.length === 0) return 0;
// // // //         return getTotalSales() / salesData.length;
// // // //     };

// // // //     const printSalesReport = async () => {
// // // //         try {
// // // //             // Create a new PDF document
// // // //             const pdfDoc = await PDFDocument.create();
// // // //             const page = pdfDoc.addPage([600, 800]);
// // // //             const { width, height } = page.getSize();

// // // //             // Embed fonts
// // // //             const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
// // // //             const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

// // // //             let yPosition = height - 50;

// // // //             // Title
// // // //             page.drawText('INVENTORY MANAGEMENT SYSTEM', {
// // // //                 x: width / 2 - 150,
// // // //                 y: yPosition,
// // // //                 size: 20,
// // // //                 font: helveticaBold,
// // // //                 color: rgb(0, 0, 0)
// // // //             });

// // // //             yPosition -= 30;
// // // //             page.drawText('SALES REPORT', {
// // // //                 x: width / 2 - 60,
// // // //                 y: yPosition,
// // // //                 size: 16,
// // // //                 font: helveticaBold,
// // // //                 color: rgb(0, 0, 0)
// // // //             });

// // // //             yPosition -= 20;
// // // //             page.drawText(`Date Range: ${startDate} to ${endDate}`, {
// // // //                 x: width / 2 - 100,
// // // //                 y: yPosition,
// // // //                 size: 10,
// // // //                 font: helveticaFont,
// // // //                 color: rgb(0.5, 0.5, 0.5)
// // // //             });

// // // //             yPosition -= 30;

// // // //             // Summary
// // // //             const summaryY = yPosition;
// // // //             page.drawText(`Total Invoices: ${getTotalInvoices()}`, {
// // // //                 x: 50,
// // // //                 y: summaryY,
// // // //                 size: 11,
// // // //                 font: helveticaFont
// // // //             });

// // // //             page.drawText(`Total Items Sold: ${getTotalItems().toLocaleString()}`, {
// // // //                 x: 50,
// // // //                 y: summaryY - 15,
// // // //                 size: 11,
// // // //                 font: helveticaFont
// // // //             });

// // // //             page.drawText(`Total Sales: ₨ ${getTotalSales().toLocaleString()}`, {
// // // //                 x: 50,
// // // //                 y: summaryY - 30,
// // // //                 size: 11,
// // // //                 font: helveticaFont
// // // //             });

// // // //             page.drawText(`Average Invoice: ₨ ${getAverageInvoice().toLocaleString()}`, {
// // // //                 x: 50,
// // // //                 y: summaryY - 45,
// // // //                 size: 11,
// // // //                 font: helveticaFont
// // // //             });

// // // //             // Table header
// // // //             yPosition = summaryY - 80;
// // // //             const headers = ['Sr.', 'Voucher ID', 'Date', 'Customer', 'Weight', 'Amount'];
// // // //             const columnWidths = [40, 80, 70, 100, 60, 80];
// // // //             let xPosition = 50;

// // // //             // Draw header background
// // // //             page.drawRectangle({
// // // //                 x: 50,
// // // //                 y: yPosition - 20,
// // // //                 width: width - 100,
// // // //                 height: 25,
// // // //                 color: rgb(0.3, 0.6, 0.3),
// // // //             });

// // // //             // Draw headers
// // // //             headers.forEach((header, index) => {
// // // //                 page.drawText(header, {
// // // //                     x: xPosition + 5,
// // // //                     y: yPosition - 15,
// // // //                     size: 10,
// // // //                     font: helveticaBold,
// // // //                     color: rgb(1, 1, 1)
// // // //                 });
// // // //                 xPosition += columnWidths[index];
// // // //             });

// // // //             // Table rows
// // // //             yPosition -= 35;
// // // //             salesData.forEach((inv, index) => {
// // // //                 xPosition = 50;
// // // //                 const rowData = [
// // // //                     (index + 1).toString(),
// // // //                     inv.voucher_id,
// // // //                     inv.invoice_date,
// // // //                     inv.customer_name.length > 15 ? inv.customer_name.substring(0, 12) + '...' : inv.customer_name,
// // // //                     inv.total_weight.toString(),
// // // //                     `₨ ${inv.net_amount.toLocaleString()}`
// // // //                 ];

// // // //                 rowData.forEach((data, colIdx) => {
// // // //                     page.drawText(data, {
// // // //                         x: xPosition + 5,
// // // //                         y: yPosition,
// // // //                         size: 9,
// // // //                         font: helveticaFont
// // // //                     });
// // // //                     xPosition += columnWidths[colIdx];
// // // //                 });
// // // //                 yPosition -= 20;

// // // //                 // Add new page if needed
// // // //                 if (yPosition < 50 && index < salesData.length - 1) {
// // // //                     const newPage = pdfDoc.addPage([600, 800]);
// // // //                     yPosition = newPage.getSize().height - 50;
// // // //                     // Reset header on new page
// // // //                     newPage.drawText('INVENTORY MANAGEMENT SYSTEM - Continued', {
// // // //                         x: width / 2 - 100,
// // // //                         y: yPosition + 20,
// // // //                         size: 12,
// // // //                         font: helveticaBold
// // // //                     });
// // // //                 }
// // // //             });

// // // //             // Footer
// // // //             const finalY = yPosition - 20;
// // // //             page.drawText('POS Software by Ultimate Solutions', {
// // // //                 x: width / 2 - 100,
// // // //                 y: finalY,
// // // //                 size: 8,
// // // //                 font: helveticaFont,
// // // //                 color: rgb(0.5, 0.5, 0.5)
// // // //             });

// // // //             // Save PDF
// // // //             const pdfBytes = await pdfDoc.save();
// // // //             const blob = new Blob([pdfBytes], { type: 'application/pdf' });
// // // //             const link = document.createElement('a');
// // // //             link.href = URL.createObjectURL(blob);
// // // //             link.download = `Sales_Report_${startDate}_to_${endDate}.pdf`;
// // // //             link.click();
// // // //             URL.revokeObjectURL(link.href);

// // // //             toast.success('Report printed successfully');
// // // //         } catch (error) {
// // // //             console.error('PDF generation error:', error);
// // // //             toast.error('Failed to generate PDF');
// // // //         }
// // // //     };

// // // //     const printItemSummary = async () => {
// // // //         try {
// // // //             const pdfDoc = await PDFDocument.create();
// // // //             const page = pdfDoc.addPage([600, 800]);
// // // //             const { width, height } = page.getSize();

// // // //             const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
// // // //             const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

// // // //             const totalQty = itemSummary.reduce((sum, item) => sum + item.total_quantity, 0);
// // // //             const totalAmount = itemSummary.reduce((sum, item) => sum + item.total_amount, 0);

// // // //             let yPosition = height - 50;

// // // //             // Header
// // // //             page.drawText('INVENTORY MANAGEMENT SYSTEM', {
// // // //                 x: width / 2 - 150,
// // // //                 y: yPosition,
// // // //                 size: 20,
// // // //                 font: helveticaBold
// // // //             });

// // // //             yPosition -= 30;
// // // //             page.drawText('ITEM WISE SUMMARY', {
// // // //                 x: width / 2 - 80,
// // // //                 y: yPosition,
// // // //                 size: 16,
// // // //                 font: helveticaBold
// // // //             });

// // // //             yPosition -= 20;
// // // //             page.drawText(`Date Range: ${startDate} to ${endDate}`, {
// // // //                 x: width / 2 - 100,
// // // //                 y: yPosition,
// // // //                 size: 10,
// // // //                 font: helveticaFont,
// // // //                 color: rgb(0.5, 0.5, 0.5)
// // // //             });

// // // //             yPosition -= 30;

// // // //             // Summary
// // // //             page.drawText(`Total Items Sold: ${totalQty.toLocaleString()}`, {
// // // //                 x: 50,
// // // //                 y: yPosition,
// // // //                 size: 11,
// // // //                 font: helveticaFont
// // // //             });

// // // //             page.drawText(`Total Sales Value: ₨ ${totalAmount.toLocaleString()}`, {
// // // //                 x: 50,
// // // //                 y: yPosition - 15,
// // // //                 size: 11,
// // // //                 font: helveticaFont
// // // //             });

// // // //             // Table header
// // // //             yPosition -= 50;
// // // //             const headers = ['Sr.', 'Item Name', 'Item Name (Urdu)', 'Quantity', 'Total Amount'];
// // // //             const columnWidths = [40, 150, 150, 80, 100];
// // // //             let xPosition = 50;

// // // //             page.drawRectangle({
// // // //                 x: 50,
// // // //                 y: yPosition - 20,
// // // //                 width: width - 100,
// // // //                 height: 25,
// // // //                 color: rgb(0.3, 0.6, 0.3)
// // // //             });

// // // //             headers.forEach((header, index) => {
// // // //                 page.drawText(header, {
// // // //                     x: xPosition + 5,
// // // //                     y: yPosition - 15,
// // // //                     size: 10,
// // // //                     font: helveticaBold,
// // // //                     color: rgb(1, 1, 1)
// // // //                 });
// // // //                 xPosition += columnWidths[index];
// // // //             });

// // // //             // Table rows
// // // //             yPosition -= 35;
// // // //             itemSummary.forEach((item, index) => {
// // // //                 xPosition = 50;
// // // //                 const rowData = [
// // // //                     (index + 1).toString(),
// // // //                     item.item_name,
// // // //                     item.item_name_urdu || '-',
// // // //                     item.total_quantity.toString(),
// // // //                     `₨ ${item.total_amount.toLocaleString()}`
// // // //                 ];

// // // //                 rowData.forEach((data, colIdx) => {
// // // //                     page.drawText(data, {
// // // //                         x: xPosition + 5,
// // // //                         y: yPosition,
// // // //                         size: 9,
// // // //                         font: helveticaFont
// // // //                     });
// // // //                     xPosition += columnWidths[colIdx];
// // // //                 });
// // // //                 yPosition -= 20;
// // // //             });

// // // //             // Footer
// // // //             const finalY = yPosition - 20;
// // // //             page.drawText('POS Software by Ultimate Solutions', {
// // // //                 x: width / 2 - 100,
// // // //                 y: finalY,
// // // //                 size: 8,
// // // //                 font: helveticaFont,
// // // //                 color: rgb(0.5, 0.5, 0.5)
// // // //             });

// // // //             const pdfBytes = await pdfDoc.save();
// // // //             const blob = new Blob([pdfBytes], { type: 'application/pdf' });
// // // //             const link = document.createElement('a');
// // // //             link.href = URL.createObjectURL(blob);
// // // //             link.download = `Item_Wise_Summary_${startDate}_to_${endDate}.pdf`;
// // // //             link.click();
// // // //             URL.revokeObjectURL(link.href);

// // // //             toast.success('Report printed successfully');
// // // //         } catch (error) {
// // // //             console.error('PDF generation error:', error);
// // // //             toast.error('Failed to generate PDF');
// // // //         }
// // // //     };

// // // //     return (
// // // //         <div className="container">
// // // //             <div className="header">
// // // //                 <h1>Reports & Analytics</h1>
// // // //             </div>

// // // //             {/* Date Range Filter */}
// // // //             <div className="form-panel">
// // // //                 <div className="form-grid">
// // // //                     <div className="form-group">
// // // //                         <label>Date Range</label>
// // // //                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
// // // //                             <FiCalendar />
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
// // // //                             <button className="btn-primary" onClick={loadReports}>
// // // //                                 Generate Report
// // // //                             </button>
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>
// // // //             </div>

// // // //             {/* Report Type Tabs */}
// // // //             <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
// // // //                 <button
// // // //                     className={reportType === 'sales' ? 'btn-primary' : 'btn-secondary'}
// // // //                     onClick={() => setReportType('sales')}
// // // //                 >
// // // //                     Sales Report
// // // //                 </button>
// // // //                 <button
// // // //                     className={reportType === 'items' ? 'btn-primary' : 'btn-secondary'}
// // // //                     onClick={() => setReportType('items')}
// // // //                 >
// // // //                     Item Wise Summary
// // // //                 </button>
// // // //             </div>

// // // //             {loading && (
// // // //                 <div style={{ textAlign: 'center', padding: '40px' }}>
// // // //                     Loading reports...
// // // //                 </div>
// // // //             )}

// // // //             {!loading && reportType === 'sales' && (
// // // //                 <>
// // // //                     {/* Sales Summary Cards */}
// // // //                     <div className="stats-grid">
// // // //                         <div className="stat-card">
// // // //                             <h3>Total Invoices</h3>
// // // //                             <div className="stat-value">{getTotalInvoices()}</div>
// // // //                         </div>
// // // //                         <div className="stat-card">
// // // //                             <h3>Total Items Sold</h3>
// // // //                             <div className="stat-value">{getTotalItems().toLocaleString()}</div>
// // // //                         </div>
// // // //                         <div className="stat-card">
// // // //                             <h3>Total Sales</h3>
// // // //                             <div className="stat-value">₨ {getTotalSales().toLocaleString()}</div>
// // // //                         </div>
// // // //                         <div className="stat-card">
// // // //                             <h3>Average Invoice</h3>
// // // //                             <div className="stat-value">₨ {getAverageInvoice().toLocaleString()}</div>
// // // //                         </div>
// // // //                     </div>

// // // //                     {/* Sales Table */}
// // // //                     <div className="table-container">
// // // //                         <div style={{ padding: '15px', display: 'flex', justifyContent: 'flex-end' }}>
// // // //                             <button className="btn-success" onClick={printSalesReport}>
// // // //                                 <FiPrinter /> Print Report
// // // //                             </button>
// // // //                         </div>
// // // //                         <table className="data-table">
// // // //                             <thead>
// // // //                                 <tr>
// // // //                                     <th>Sr.</th>
// // // //                                     <th>Voucher ID</th>
// // // //                                     <th>Date</th>
// // // //                                     <th>Customer</th>
// // // //                                     <th>Total Weight</th>
// // // //                                     <th>Total Amount</th>
// // // //                                     <th>Discount</th>
// // // //                                     <th>Net Amount</th>
// // // //                                 </tr>
// // // //                             </thead>
// // // //                             <tbody>
// // // //                                 {salesData.map((invoice, index) => (
// // // //                                     <tr key={invoice.invoice_id}>
// // // //                                         <td>{index + 1}</td>
// // // //                                         <td>{invoice.voucher_id}</td>
// // // //                                         <td>{invoice.invoice_date}</td>
// // // //                                         <td>{invoice.customer_name}</td>
// // // //                                         <td>{invoice.total_weight}</td>
// // // //                                         <td>₨ {invoice.total_amount?.toLocaleString()}</td>
// // // //                                         <td>₨ {invoice.discount?.toLocaleString()}</td>
// // // //                                         <td><strong>₨ {invoice.net_amount?.toLocaleString()}</strong></td>
// // // //                                     </tr>
// // // //                                 ))}
// // // //                                 {salesData.length === 0 && (
// // // //                                     <tr>
// // // //                                         <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
// // // //                                             No sales data found for the selected date range
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 )}
// // // //                             </tbody>
// // // //                             {salesData.length > 0 && (
// // // //                                 <tfoot>
// // // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // // //                                         <td colSpan="4" style={{ textAlign: 'right' }}>Totals:</td>
// // // //                                         <td>{getTotalItems().toLocaleString()}</td>
// // // //                                         <td>₨ {getTotalSales().toLocaleString()}</td>
// // // //                                         <td></td>
// // // //                                         <td>₨ {getTotalSales().toLocaleString()}</td>
// // // //                                     </tr>
// // // //                                 </tfoot>
// // // //                             )}
// // // //                         </table>
// // // //                     </div>
// // // //                 </>
// // // //             )}

// // // //             {!loading && reportType === 'items' && (
// // // //                 <>
// // // //                     {/* Item Summary Cards */}
// // // //                     <div className="stats-grid">
// // // //                         <div className="stat-card">
// // // //                             <h3>Total Items Sold</h3>
// // // //                             <div className="stat-value">
// // // //                                 {itemSummary.reduce((sum, item) => sum + item.total_quantity, 0).toLocaleString()}
// // // //                             </div>
// // // //                         </div>
// // // //                         <div className="stat-card">
// // // //                             <h3>Total Sales Value</h3>
// // // //                             <div className="stat-value">
// // // //                                 ₨ {itemSummary.reduce((sum, item) => sum + item.total_amount, 0).toLocaleString()}
// // // //                             </div>
// // // //                         </div>
// // // //                         <div className="stat-card">
// // // //                             <h3>Unique Items</h3>
// // // //                             <div className="stat-value">{itemSummary.length}</div>
// // // //                         </div>
// // // //                     </div>

// // // //                     {/* Item Summary Table */}
// // // //                     <div className="table-container">
// // // //                         <div style={{ padding: '15px', display: 'flex', justifyContent: 'flex-end' }}>
// // // //                             <button className="btn-success" onClick={printItemSummary}>
// // // //                                 <FiPrinter /> Print Report
// // // //                             </button>
// // // //                         </div>
// // // //                         <table className="data-table">
// // // //                             <thead>
// // // //                                 <tr>
// // // //                                     <th>Sr.</th>
// // // //                                     <th>Item Name</th>
// // // //                                     <th>Item Name (Urdu)</th>
// // // //                                     <th>Quantity Sold</th>
// // // //                                     <th>Total Amount</th>
// // // //                                     <th>Average Price</th>
// // // //                                 </tr>
// // // //                             </thead>
// // // //                             <tbody>
// // // //                                 {itemSummary.map((item, index) => (
// // // //                                     <tr key={item.item_id}>
// // // //                                         <td>{index + 1}</td>
// // // //                                         <td>{item.item_name}</td>
// // // //                                         <td dir="rtl">{item.item_name_urdu || '-'}</td>
// // // //                                         <td>{item.total_quantity}</td>
// // // //                                         <td>₨ {item.total_amount.toLocaleString()}</td>
// // // //                                         <td>₨ {(item.total_amount / item.total_quantity).toLocaleString()}</td>
// // // //                                     </tr>
// // // //                                 ))}
// // // //                                 {itemSummary.length === 0 && (
// // // //                                     <tr>
// // // //                                         <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
// // // //                                             No item sales data found for the selected date range
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 )}
// // // //                             </tbody>
// // // //                             {itemSummary.length > 0 && (
// // // //                                 <tfoot>
// // // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // // //                                         <td colSpan="3" style={{ textAlign: 'right' }}>Totals:</td>
// // // //                                         <td>{itemSummary.reduce((sum, item) => sum + item.total_quantity, 0).toLocaleString()}</td>
// // // //                                         <td>₨ {itemSummary.reduce((sum, item) => sum + item.total_amount, 0).toLocaleString()}</td>
// // // //                                         <td></td>
// // // //                                     </tr>
// // // //                                 </tfoot>
// // // //                             )}
// // // //                         </table>
// // // //                     </div>
// // // //                 </>
// // // //             )}

// // // //             <div className="status-bar">
// // // //                 <span>Report generated for {startDate} to {endDate}</span>
// // // //                 <span className="shortcuts-hint">
// // // //                     Click Print Report to generate PDF
// // // //                 </span>
// // // //             </div>

// // // //             <style jsx>{`
// // // //                 .btn-secondary {
// // // //                     background: #e0e0e0;
// // // //                     color: #333;
// // // //                     padding: 8px 16px;
// // // //                     border: none;
// // // //                     border-radius: 4px;
// // // //                     cursor: pointer;
// // // //                 }

// // // //                 .btn-secondary:hover {
// // // //                     background: #d0d0d0;
// // // //                 }
// // // //             `}</style>
// // // //         </div>
// // // //     );
// // // // }

// // // // export default Reports;

// // // // import React, { useState, useEffect, useRef, useContext } from 'react';
// // // // import { toast } from 'react-hot-toast';
// // // // import { FiPrinter, FiSearch, FiCalendar, FiFileText, FiDownload, FiUser, FiPackage } from 'react-icons/fi';
// // // // import { NavigationContext } from '../App';

// // // // function Reports() {
// // // //     const { goBack } = useContext(NavigationContext);
// // // //     const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
// // // //     const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
// // // //     const [invoices, setInvoices] = useState([]);
// // // //     const [loading, setLoading] = useState(false);
// // // //     const [customerSummary, setCustomerSummary] = useState([]);
// // // //     const [itemWiseSummary, setItemWiseSummary] = useState([]);
// // // //     const [tempStartDate, setTempStartDate] = useState('');
// // // //     const [tempEndDate, setTempEndDate] = useState('');
// // // //     const [showStartDatePicker, setShowStartDatePicker] = useState(false);
// // // //     const [showEndDatePicker, setShowEndDatePicker] = useState(false);
// // // //     const [activeTab, setActiveTab] = useState('customer');

// // // //     const startDateRef = useRef(null);
// // // //     const endDateRef = useRef(null);
// // // //     const searchButtonRef = useRef(null);

// // // //     useEffect(() => {
// // // //         loadData();
// // // //         setTempStartDate(formatDateForDisplay(startDate));
// // // //         setTempEndDate(formatDateForDisplay(endDate));
// // // //         return () => { };
// // // //     }, []);

// // // //     const loadData = async () => {
// // // //         try {
// // // //             const invoicesData = await window.electron.database.getInvoices();
// // // //             setInvoices(invoicesData || []);
// // // //             await loadSummaries(invoicesData || []);
// // // //         } catch (error) {
// // // //             console.error('Failed to load data:', error);
// // // //             toast.error('Failed to load data');
// // // //         }
// // // //     };

// // // //     const loadSummaries = async (invoicesData = null) => {
// // // //         setLoading(true);
// // // //         try {
// // // //             const data = invoicesData || invoices;

// // // //             const filteredInvoices = data.filter(inv => {
// // // //                 const invDate = inv.invoice_date;
// // // //                 return invDate >= startDate && invDate <= endDate;
// // // //             });

// // // //             // Group by customer for customer summary
// // // //             const customerMap = new Map();
// // // //             for (const invoice of filteredInvoices) {
// // // //                 const customerName = invoice.customer_name;
// // // //                 if (!customerMap.has(customerName)) {
// // // //                     let customerUrduName = '';
// // // //                     if (invoice.account_id) {
// // // //                         const account = await window.electron.database.getAccountById(invoice.account_id);
// // // //                         customerUrduName = account?.customer_name_urdu || '';
// // // //                     }
// // // //                     customerMap.set(customerName, {
// // // //                         customer_name: customerName,
// // // //                         customer_name_urdu: customerUrduName,
// // // //                         total_amount: 0,
// // // //                         invoice_date: invoice.invoice_date,
// // // //                         invoice_id: invoice.invoice_id,
// // // //                         voucher_id: invoice.voucher_id
// // // //                     });
// // // //                 }
// // // //                 const customer = customerMap.get(customerName);
// // // //                 customer.total_amount += invoice.net_amount || 0;
// // // //                 if (invoice.invoice_date > customer.invoice_date) {
// // // //                     customer.invoice_date = invoice.invoice_date;
// // // //                     customer.invoice_id = invoice.invoice_id;
// // // //                     customer.voucher_id = invoice.voucher_id;
// // // //                 }
// // // //             }

// // // //             const customerList = Array.from(customerMap.values()).map((customer, index) => ({
// // // //                 sr_no: index + 1,
// // // //                 ...customer
// // // //             }));
// // // //             setCustomerSummary(customerList);

// // // //             // Get item-wise summary
// // // //             const itemSummary = await window.electron.database.getItemWiseSummary({ startDate, endDate });
// // // //             const enrichedItemSummary = await Promise.all(itemSummary.map(async (item, index) => {
// // // //                 let itemNameUrdu = item.item_name_urdu;
// // // //                 if (item.item_id && !itemNameUrdu) {
// // // //                     const product = await window.electron.database.getProductById(item.item_id);
// // // //                     itemNameUrdu = product?.item_name_urdu || '';
// // // //                 }
// // // //                 return {
// // // //                     sr_no: index + 1,
// // // //                     item_name: item.item_name,
// // // //                     item_name_urdu: itemNameUrdu || item.item_name_urdu || '',
// // // //                     total_quantity: item.total_quantity || 0,
// // // //                     total_amount: item.total_amount || 0
// // // //                 };
// // // //             }));
// // // //             setItemWiseSummary(enrichedItemSummary);
// // // //         } catch (error) {
// // // //             console.error('Failed to load summaries:', error);
// // // //             toast.error('Failed to load summaries');
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     const formatDateForDisplay = (dateString) => {
// // // //         if (!dateString) return '';
// // // //         const date = new Date(dateString);
// // // //         if (isNaN(date.getTime())) return '';
// // // //         const day = String(date.getDate()).padStart(2, '0');
// // // //         const month = String(date.getMonth() + 1).padStart(2, '0');
// // // //         const year = date.getFullYear();
// // // //         return `${day}/${month}/${year}`;
// // // //     };

// // // //     const formatDateForStorage = (dateStr) => {
// // // //         if (!dateStr) return null;
// // // //         const parts = dateStr.split('/');
// // // //         if (parts.length === 3) {
// // // //             const day = parseInt(parts[0], 10);
// // // //             const month = parseInt(parts[1], 10);
// // // //             const year = parseInt(parts[2], 10);
// // // //             if (day && month && year && day >= 1 && day <= 31 && month >= 1 && month <= 12 && year.toString().length === 4) {
// // // //                 return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
// // // //             }
// // // //         }
// // // //         return null;
// // // //     };

// // // //     const handleDateInputChange = (setter, value, isStartDate) => {
// // // //         setter(value);
// // // //         let formatted = value.replace(/[^0-9]/g, '');
// // // //         if (formatted.length >= 2 && formatted.length < 4) {
// // // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
// // // //         } else if (formatted.length >= 4 && formatted.length < 6) {
// // // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4);
// // // //         } else if (formatted.length >= 6) {
// // // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4, 8);
// // // //         }
// // // //         setter(formatted);
// // // //         if (formatted.length === 10) {
// // // //             const storageDate = formatDateForStorage(formatted);
// // // //             if (storageDate) {
// // // //                 if (isStartDate) {
// // // //                     setStartDate(storageDate);
// // // //                 } else {
// // // //                     setEndDate(storageDate);
// // // //                 }
// // // //             }
// // // //         }
// // // //     };

// // // //     const handleDateBlur = (value, isStartDate) => {
// // // //         if (value.length === 10) {
// // // //             const storageDate = formatDateForStorage(value);
// // // //             if (storageDate) {
// // // //                 if (isStartDate) {
// // // //                     setStartDate(storageDate);
// // // //                 } else {
// // // //                     setEndDate(storageDate);
// // // //                 }
// // // //             } else {
// // // //                 const currentDate = new Date();
// // // //                 const storageDate = currentDate.toISOString().split('T')[0];
// // // //                 if (isStartDate) {
// // // //                     setStartDate(storageDate);
// // // //                     setTempStartDate(formatDateForDisplay(storageDate));
// // // //                 } else {
// // // //                     setEndDate(storageDate);
// // // //                     setTempEndDate(formatDateForDisplay(storageDate));
// // // //                 }
// // // //                 toast.error('Invalid date format. Using current date.');
// // // //             }
// // // //         } else if (value) {
// // // //             const currentDate = new Date();
// // // //             const storageDate = currentDate.toISOString().split('T')[0];
// // // //             if (isStartDate) {
// // // //                 setStartDate(storageDate);
// // // //                 setTempStartDate(formatDateForDisplay(storageDate));
// // // //             } else {
// // // //                 setEndDate(storageDate);
// // // //                 setTempEndDate(formatDateForDisplay(storageDate));
// // // //             }
// // // //             toast.error('Invalid date. Using current date.');
// // // //         }
// // // //         if (isStartDate) {
// // // //             setShowStartDatePicker(false);
// // // //         } else {
// // // //             setShowEndDatePicker(false);
// // // //         }
// // // //     };

// // // //     const handleDateSelect = (date, isStartDate) => {
// // // //         const year = date.getFullYear();
// // // //         const month = String(date.getMonth() + 1).padStart(2, '0');
// // // //         const day = String(date.getDate()).padStart(2, '0');
// // // //         const storageDate = `${year}-${month}-${day}`;
// // // //         const displayDate = formatDateForDisplay(storageDate);
// // // //         if (isStartDate) {
// // // //             setStartDate(storageDate);
// // // //             setTempStartDate(displayDate);
// // // //             setShowStartDatePicker(false);
// // // //         } else {
// // // //             setEndDate(storageDate);
// // // //             setTempEndDate(displayDate);
// // // //             setShowEndDatePicker(false);
// // // //         }
// // // //     };

// // // //     const handleSearch = async () => {
// // // //         await loadSummaries();
// // // //         toast.success('Reports updated');
// // // //     };

// // // //     const generateReportHTML = async (singleCustomer = null) => {
// // // //         try {
// // // //             const filteredInvoices = invoices.filter(inv => {
// // // //                 const invDate = inv.invoice_date;
// // // //                 return invDate >= startDate && invDate <= endDate;
// // // //             });

// // // //             let customerGroups = {};

// // // //             if (singleCustomer) {
// // // //                 const customerInvoices = filteredInvoices.filter(inv => inv.customer_name === singleCustomer.customer_name);

// // // //                 for (const invoice of customerInvoices) {
// // // //                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // //                     const enrichedDetails = await Promise.all(details.map(async (item) => {
// // // //                         if (item.item_id) {
// // // //                             const product = await window.electron.database.getProductById(item.item_id);
// // // //                             return {
// // // //                                 ...item,
// // // //                                 item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
// // // //                             };
// // // //                         }
// // // //                         return item;
// // // //                     }));

// // // //                     const customerKey = invoice.customer_name;
// // // //                     if (!customerGroups[customerKey]) {
// // // //                         customerGroups[customerKey] = {
// // // //                             customerName: invoice.customer_name,
// // // //                             customerNameUrdu: singleCustomer.customer_name_urdu || '',
// // // //                             customerId: invoice.account_id,
// // // //                             invoices: [],
// // // //                             totalItems: 0,
// // // //                             totalAmount: 0,
// // // //                             discount: 0,
// // // //                             netAmount: 0
// // // //                         };
// // // //                     }

// // // //                     customerGroups[customerKey].invoices.push({
// // // //                         ...invoice,
// // // //                         details: enrichedDetails
// // // //                     });
// // // //                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
// // // //                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
// // // //                     customerGroups[customerKey].discount += invoice.discount || 0;
// // // //                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
// // // //                 }
// // // //             } else {
// // // //                 for (const invoice of filteredInvoices) {
// // // //                     let customerUrduName = '';
// // // //                     if (invoice.account_id) {
// // // //                         const account = await window.electron.database.getAccountById(invoice.account_id);
// // // //                         customerUrduName = account?.customer_name_urdu || '';
// // // //                     }

// // // //                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // //                     const enrichedDetails = await Promise.all(details.map(async (item) => {
// // // //                         if (item.item_id) {
// // // //                             const product = await window.electron.database.getProductById(item.item_id);
// // // //                             return {
// // // //                                 ...item,
// // // //                                 item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
// // // //                             };
// // // //                         }
// // // //                         return item;
// // // //                     }));

// // // //                     const customerKey = invoice.customer_name;
// // // //                     if (!customerGroups[customerKey]) {
// // // //                         customerGroups[customerKey] = {
// // // //                             customerName: invoice.customer_name,
// // // //                             customerNameUrdu: customerUrduName,
// // // //                             customerId: invoice.account_id,
// // // //                             invoices: [],
// // // //                             totalItems: 0,
// // // //                             totalAmount: 0,
// // // //                             discount: 0,
// // // //                             netAmount: 0
// // // //                         };
// // // //                     } else if (customerUrduName && !customerGroups[customerKey].customerNameUrdu) {
// // // //                         customerGroups[customerKey].customerNameUrdu = customerUrduName;
// // // //                     }

// // // //                     customerGroups[customerKey].invoices.push({
// // // //                         ...invoice,
// // // //                         details: enrichedDetails
// // // //                     });
// // // //                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
// // // //                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
// // // //                     customerGroups[customerKey].discount += invoice.discount || 0;
// // // //                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
// // // //                 }
// // // //             }

// // // //             // Prepare items summary per customer
// // // //             const customerItemsSummary = {};
// // // //             for (const [customerName, customerData] of Object.entries(customerGroups)) {
// // // //                 const itemsSummary = {};
// // // //                 for (const invoice of customerData.invoices) {
// // // //                     for (const item of invoice.details) {
// // // //                         const itemKey = item.item_id;
// // // //                         if (!itemsSummary[itemKey]) {
// // // //                             itemsSummary[itemKey] = {
// // // //                                 itemName: item.item_name,
// // // //                                 itemNameUrdu: item.item_name_urdu || '',
// // // //                                 totalQuantity: 0,
// // // //                                 totalAmount: 0,
// // // //                                 avgRate: 0
// // // //                             };
// // // //                         }
// // // //                         itemsSummary[itemKey].totalQuantity += item.quantity;
// // // //                         itemsSummary[itemKey].totalAmount += item.amount;
// // // //                     }
// // // //                 }
// // // //                 for (const item of Object.values(itemsSummary)) {
// // // //                     item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
// // // //                 }
// // // //                 customerItemsSummary[customerName] = Object.values(itemsSummary);
// // // //             }

// // // //             const formattedStartDate = formatDateForDisplay(startDate);
// // // //             const formattedEndDate = formatDateForDisplay(endDate);
// // // //             const currentDate = formatDateForDisplay(new Date().toISOString().split('T')[0]);

// // // //             const html = `
// // // //                 <!DOCTYPE html>
// // // //                 <html>
// // // //                 <head>
// // // //                     <meta charset="UTF-8">
// // // //                     <title>Sales Report ${formattedStartDate} to ${formattedEndDate}</title>
// // // //                     <style>
// // // //                         * {
// // // //                             margin: 0;
// // // //                             padding: 0;
// // // //                             box-sizing: border-box;
// // // //                         }

// // // //                         body {
// // // //                             font-family: 'Segoe UI', 'Arial', sans-serif;
// // // //                             padding: 40px;
// // // //                             background: white;
// // // //                             color: #333;
// // // //                         }

// // // //                         .report-container {
// // // //                             max-width: 1200px;
// // // //                             margin: 0 auto;
// // // //                         }

// // // //                         .header {
// // // //                             text-align: center;
// // // //                             margin-bottom: 40px;
// // // //                             padding-bottom: 20px;
// // // //                             border-bottom: 3px solid #4CAF50;
// // // //                         }

// // // //                         .company-name {
// // // //                             font-size: 28px;
// // // //                             font-weight: bold;
// // // //                             color: #2c3e50;
// // // //                             margin-bottom: 10px;
// // // //                         }

// // // //                         .report-title {
// // // //                             font-size: 24px;
// // // //                             font-weight: bold;
// // // //                             color: #4CAF50;
// // // //                             margin: 10px 0;
// // // //                         }

// // // //                         .date-range {
// // // //                             font-size: 14px;
// // // //                             color: #666;
// // // //                             margin-top: 10px;
// // // //                         }

// // // //                         .customer-section {
// // // //                             margin-bottom: 50px;
// // // //                             page-break-after: always;
// // // //                         }

// // // //                         .customer-section:last-child {
// // // //                             page-break-after: auto;
// // // //                         }

// // // //                         .customer-header {
// // // //                             text-align: center;
// // // //                             margin-bottom: 20px;
// // // //                             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // //                             border-radius: 12px;
// // // //                             overflow: hidden;
// // // //                             box-shadow: 0 4px 15px rgba(0,0,0,0.1);
// // // //                         }

// // // //                         .customer-name {
// // // //                             font-size: 32px;
// // // //                             font-weight: bold;
// // // //                             color: white;
// // // //                             padding: 20px;
// // // //                             margin: 0;
// // // //                             text-align: center;
// // // //                             font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;
// // // //                             text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
// // // //                         }

// // // //                         .customer-date {
// // // //                             font-size: 14px;
// // // //                             color: rgba(255,255,255,0.9);
// // // //                             padding: 10px 20px;
// // // //                             background: rgba(0,0,0,0.1);
// // // //                             text-align: center;
// // // //                         }

// // // //                         .items-table {
// // // //                             width: 100%;
// // // //                             border-collapse: collapse;
// // // //                             margin-top: 20px;
// // // //                             box-shadow: 0 2px 8px rgba(0,0,0,0.05);
// // // //                         }

// // // //                         .items-table th {
// // // //                             background: #4CAF50;
// // // //                             color: white;
// // // //                             border: 1px solid #ddd;
// // // //                             padding: 14px;
// // // //                             text-align: center;
// // // //                             font-size: 16px;
// // // //                             font-weight: bold;
// // // //                         }

// // // //                         .items-table td {
// // // //                             border: 1px solid #ddd;
// // // //                             padding: 12px;
// // // //                             text-align: center;
// // // //                             font-size: 14px;
// // // //                         }

// // // //                         .total-row {
// // // //                             background: #f9f9f9;
// // // //                             font-weight: bold;
// // // //                             border-top: 2px solid #4CAF50;
// // // //                         }

// // // //                         .total-row td {
// // // //                             font-weight: bold;
// // // //                             font-size: 16px;
// // // //                             padding: 14px;
// // // //                         }

// // // //                         .footer {
// // // //                             margin-top: 40px;
// // // //                             padding-top: 20px;
// // // //                             text-align: center;
// // // //                             border-top: 1px solid #e0e0e0;
// // // //                             font-size: 12px;
// // // //                             color: #999;
// // // //                         }

// // // //                         .footer-developer {
// // // //                             font-size: 14px;
// // // //                             color: #4CAF50;
// // // //                             margin-top: 10px;
// // // //                             font-weight: bold;
// // // //                         }
// // // //                     </style>
// // // //                 </head>
// // // //                 <body>
// // // //                     <div class="report-container">
// // // //                         <div class="header">
// // // //                             <div class="company-name">INVENTORY MANAGEMENT SYSTEM</div>
// // // //                             <div class="report-title">SALES REPORT</div>
// // // //                             <div class="date-range">Period: ${formattedStartDate} to ${formattedEndDate}</div>
// // // //                         </div>

// // // //                         ${Object.entries(customerGroups).map(([customerName, customerData]) => {
// // // //                 const itemsSummary = customerItemsSummary[customerName] || [];
// // // //                 const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
// // // //                 const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);
// // // //                 const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
// // // //                 const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());
// // // //                 // Use Urdu name for PDF only
// // // //                 const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== ''
// // // //                     ? customerData.customerNameUrdu
// // // //                     : customerData.customerName;

// // // //                 return `
// // // //                             <div class="customer-section">
// // // //                                 <div class="customer-header">
// // // //                                     <div class="customer-name" style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// // // //                                         ${displayCustomerName}
// // // //                                     </div>
// // // //                                     <div class="customer-date">
// // // //                                         Date: ${invoiceDate}
// // // //                                     </div>
// // // //                                 </div>

// // // //                                 <table class="items-table">
// // // //                                     <thead>
// // // //                                         <tr>
// // // //                                             <th>#</th>
// // // //                                             <th>Item</th>
// // // //                                             <th>Quantity</th>
// // // //                                             <th>Rate</th>
// // // //                                             <th>Amount</th>
// // // //                                         </thead>
// // // //                                     <tbody>
// // // //                                         ${itemsSummary.map((item, idx) => {
// // // //                     // Use Urdu name for items in PDF only
// // // //                     const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
// // // //                         ? item.itemNameUrdu
// // // //                         : item.itemName;

// // // //                     return `
// // // //                                                 <tr>
// // // //                                                     <td>${idx + 1}</td>
// // // //                                                     <td style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// // // //                                                         ${displayItemName}
// // // //                                                     </td>
// // // //                                                     <td>${item.totalQuantity.toLocaleString()}</td>
// // // //                                                     <td>${Math.round(item.avgRate).toLocaleString()}</td>
// // // //                                                     <td style="color: #4CAF50; font-weight: bold;">
// // // //                                                         ${item.totalAmount.toLocaleString()}
// // // //                                                     </td>
// // // //                                                 </tr>
// // // //                                             `;
// // // //                 }).join('')}
// // // //                                         <tr class="total-row">
// // // //                                             <td colspan="2"><strong>GRAND TOTAL</strong></td>
// // // //                                             <td><strong>${totalItems.toLocaleString()}</strong></td>
// // // //                                             <td>-</td>
// // // //                                             <td style="color: #4CAF50; font-size: 18px;">
// // // //                                                 <strong>${totalAmount.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                         </tr>
// // // //                                     </tbody>
// // // //                                 </table>
// // // //                             </div>
// // // //                         `;
// // // //             }).join('')}

// // // //                         <div class="footer">
// // // //                             <p>This report was generated by Inventory Management System</p>
// // // //                             <p class="footer-developer">Developed By Ultimate Solutions</p>
// // // //                             <p>${new Date().toLocaleString()}</p>
// // // //                         </div>
// // // //                     </div>
// // // //                 </body>
// // // //                 </html>
// // // //             `;

// // // //             return html;
// // // //         } catch (error) {
// // // //             console.error('Error generating report HTML:', error);
// // // //             toast.error('Failed to generate report');
// // // //             return null;
// // // //         }
// // // //     };

// // // //     const generateAllCustomersPDF = async () => {
// // // //         setLoading(true);
// // // //         try {
// // // //             const html = await generateReportHTML();
// // // //             if (html) {
// // // //                 const pdfPath = await window.electron.printToPDF(html);
// // // //                 if (pdfPath) {
// // // //                     toast.success('PDF saved successfully for all customers');
// // // //                 } else {
// // // //                     toast.error('PDF generation cancelled');
// // // //                 }
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('Error generating PDF:', error);
// // // //             toast.error('Failed to generate PDF');
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     const generateSingleCustomerPDF = async (customer) => {
// // // //         setLoading(true);
// // // //         try {
// // // //             const html = await generateReportHTML(customer);
// // // //             if (html) {
// // // //                 const pdfPath = await window.electron.printToPDF(html);
// // // //                 if (pdfPath) {
// // // //                     toast.success(`PDF saved successfully for ${customer.customer_name}`);
// // // //                 } else {
// // // //                     toast.error('PDF generation cancelled');
// // // //                 }
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('Error generating PDF:', error);
// // // //             toast.error('Failed to generate PDF');
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     const DatePickerCalendar = ({ currentDate, onSelect, onClose }) => {
// // // //         const [displayDate, setDisplayDate] = useState(currentDate || new Date());

// // // //         const getDaysInMonth = (date) => {
// // // //             const year = date.getFullYear();
// // // //             const month = date.getMonth();
// // // //             const firstDay = new Date(year, month, 1);
// // // //             const lastDay = new Date(year, month + 1, 0);
// // // //             const days = [];
// // // //             const startOffset = firstDay.getDay();
// // // //             for (let i = 0; i < startOffset; i++) days.push(null);
// // // //             for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
// // // //             return days;
// // // //         };

// // // //         const days = getDaysInMonth(displayDate);
// // // //         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// // // //         return (
// // // //             <div style={calendarStyles.container}>
// // // //                 <div style={calendarStyles.header}>
// // // //                     <button onClick={() => setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1))} style={calendarStyles.navButton}>←</button>
// // // //                     <span style={calendarStyles.monthYear}>{monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}</span>
// // // //                     <button onClick={() => setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1))} style={calendarStyles.navButton}>→</button>
// // // //                 </div>
// // // //                 <div style={calendarStyles.weekdays}>
// // // //                     {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} style={calendarStyles.weekday}>{day}</div>)}
// // // //                 </div>
// // // //                 <div style={calendarStyles.days}>
// // // //                     {days.map((date, idx) => (
// // // //                         <div
// // // //                             key={idx}
// // // //                             onClick={() => date && onSelect(date)}
// // // //                             style={{
// // // //                                 ...calendarStyles.day,
// // // //                                 ...(date ? calendarStyles.dayCell : {}),
// // // //                                 ...(date && date.toDateString() === new Date().toDateString() ? calendarStyles.today : {})
// // // //                             }}
// // // //                         >
// // // //                             {date ? date.getDate() : ''}
// // // //                         </div>
// // // //                     ))}
// // // //                 </div>
// // // //             </div>
// // // //         );
// // // //     };

// // // //     const calendarStyles = {
// // // //         container: {
// // // //             position: 'absolute',
// // // //             top: '100%',
// // // //             left: 0,
// // // //             background: 'white',
// // // //             border: '1px solid #ddd',
// // // //             borderRadius: '8px',
// // // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // // //             padding: '12px',
// // // //             zIndex: 9999,
// // // //             marginTop: '4px',
// // // //             width: '280px'
// // // //         },
// // // //         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
// // // //         navButton: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', color: '#666' },
// // // //         monthYear: { fontWeight: 'bold', fontSize: '14px' },
// // // //         weekdays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' },
// // // //         weekday: { textAlign: 'center', fontSize: '11px', color: '#666', padding: '4px' },
// // // //         days: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' },
// // // //         dayCell: { textAlign: 'center', padding: '6px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' },
// // // //         day: { color: '#333' },
// // // //         today: { border: '1px solid #4CAF50', fontWeight: 'bold', backgroundColor: '#e8f5e9' }
// // // //     };

// // // //     const styles = {
// // // //         container: { padding: '16px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' },
// // // //         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' },
// // // //         headerTitle: { margin: 0, fontSize: '20px', fontWeight: '600' },
// // // //         buttonGroup: { display: 'flex', gap: '8px' },
// // // //         buttonPrimary: { padding: '6px 14px', background: 'white', color: '#667eea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
// // // //         buttonSuccess: { padding: '6px 14px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
// // // //         buttonSecondary: { padding: '6px 14px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
// // // //         card: { background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
// // // //         row: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
// // // //         formGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px' },
// // // //         label: { fontSize: '11px', fontWeight: '500', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
// // // //         dateInputWrapper: { position: 'relative', width: '100%' },
// // // //         input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
// // // //         calendarIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', cursor: 'pointer', fontSize: '16px' },
// // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
// // // //         tableHeader: { background: '#f5f5f5', borderBottom: '2px solid #e0e0e0', fontWeight: '600' },
// // // //         tableCell: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' },
// // // //         tableCellRight: { padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' },
// // // //         tableCellCenter: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' },
// // // //         actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', fontSize: '16px', color: '#2196F3', transition: 'all 0.2s' },
// // // //         tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' },
// // // //         tab: { padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', border: 'none', background: 'none', color: '#666', transition: 'all 0.2s' },
// // // //         activeTab: { color: '#4CAF50', borderBottom: '2px solid #4CAF50', marginBottom: '-2px' },
// // // //         loadingOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
// // // //         loadingSpinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #4CAF50', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }
// // // //     };

// // // //     if (loading) {
// // // //         return (
// // // //             <div style={styles.loadingOverlay}>
// // // //                 <div style={styles.loadingSpinner}></div>
// // // //             </div>
// // // //         );
// // // //     }

// // // //     return (
// // // //         <div style={styles.container}>
// // // //             <div style={styles.header}>
// // // //                 <h1 style={styles.headerTitle}>📊 Sales Reports</h1>
// // // //                 <div style={styles.buttonGroup}>
// // // //                     <button onClick={generateAllCustomersPDF} style={styles.buttonSuccess}>
// // // //                         <FiPrinter size={14} /> Print All Report
// // // //                     </button>
// // // //                 </div>
// // // //             </div>

// // // //             {/* Tabs */}
// // // //             <div style={styles.tabContainer}>
// // // //                 <button
// // // //                     onClick={() => setActiveTab('customer')}
// // // //                     style={{ ...styles.tab, ...(activeTab === 'customer' ? styles.activeTab : {}) }}
// // // //                 >
// // // //                     <FiUser size={14} style={{ marginRight: '6px' }} /> Customer Summary
// // // //                 </button>
// // // //                 <button
// // // //                     onClick={() => setActiveTab('item')}
// // // //                     style={{ ...styles.tab, ...(activeTab === 'item' ? styles.activeTab : {}) }}
// // // //                 >
// // // //                     <FiPackage size={14} style={{ marginRight: '6px' }} /> Item Summary
// // // //                 </button>
// // // //             </div>

// // // //             {/* Date Range Filter */}
// // // //             <div style={styles.card}>
// // // //                 <div style={styles.row}>
// // // //                     <div style={styles.formGroup}>
// // // //                         <label style={styles.label}>FROM DATE</label>
// // // //                         <div style={styles.dateInputWrapper}>
// // // //                             <input
// // // //                                 ref={startDateRef}
// // // //                                 type="text"
// // // //                                 placeholder="DD/MM/YYYY"
// // // //                                 value={tempStartDate}
// // // //                                 onChange={(e) => handleDateInputChange(setTempStartDate, e.target.value, true)}
// // // //                                 onFocus={() => setShowStartDatePicker(true)}
// // // //                                 onBlur={() => handleDateBlur(tempStartDate, true)}
// // // //                                 style={styles.input}
// // // //                             />
// // // //                             <FiCalendar style={styles.calendarIcon} onClick={() => setShowStartDatePicker(!showStartDatePicker)} />
// // // //                             {showStartDatePicker && (
// // // //                                 <DatePickerCalendar
// // // //                                     currentDate={new Date(startDate)}
// // // //                                     onSelect={(date) => handleDateSelect(date, true)}
// // // //                                     onClose={() => setShowStartDatePicker(false)}
// // // //                                 />
// // // //                             )}
// // // //                         </div>
// // // //                     </div>
// // // //                     <div style={styles.formGroup}>
// // // //                         <label style={styles.label}>TO DATE</label>
// // // //                         <div style={styles.dateInputWrapper}>
// // // //                             <input
// // // //                                 ref={endDateRef}
// // // //                                 type="text"
// // // //                                 placeholder="DD/MM/YYYY"
// // // //                                 value={tempEndDate}
// // // //                                 onChange={(e) => handleDateInputChange(setTempEndDate, e.target.value, false)}
// // // //                                 onFocus={() => setShowEndDatePicker(true)}
// // // //                                 onBlur={() => handleDateBlur(tempEndDate, false)}
// // // //                                 style={styles.input}
// // // //                             />
// // // //                             <FiCalendar style={styles.calendarIcon} onClick={() => setShowEndDatePicker(!showEndDatePicker)} />
// // // //                             {showEndDatePicker && (
// // // //                                 <DatePickerCalendar
// // // //                                     currentDate={new Date(endDate)}
// // // //                                     onSelect={(date) => handleDateSelect(date, false)}
// // // //                                     onClose={() => setShowEndDatePicker(false)}
// // // //                                 />
// // // //                             )}
// // // //                         </div>
// // // //                     </div>
// // // //                     <div style={styles.formGroup}>
// // // //                         <button ref={searchButtonRef} onClick={handleSearch} style={styles.buttonPrimary}>
// // // //                             <FiSearch size={14} /> Search
// // // //                         </button>
// // // //                     </div>
// // // //                 </div>
// // // //             </div>

// // // //             {/* Customer Summary Table */}
// // // //             {activeTab === 'customer' && (
// // // //                 <div style={styles.card}>
// // // //                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>📋 Customer Summary</h3>
// // // //                     <div style={{ overflowX: 'auto' }}>
// // // //                         <table style={styles.table}>
// // // //                             <thead>
// // // //                                 <tr style={styles.tableHeader}>
// // // //                                     <th style={styles.tableCell}>#</th>
// // // //                                     <th style={styles.tableCell}>Customer Name</th>
// // // //                                     <th style={styles.tableCellRight}>Total Amount</th>
// // // //                                     <th style={styles.tableCell}>Date</th>
// // // //                                     <th style={styles.tableCellCenter}>Actions</th>
// // // //                                 </tr>
// // // //                             </thead>
// // // //                             <tbody>
// // // //                                 {customerSummary.length === 0 ? (
// // // //                                     <tr>
// // // //                                         <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
// // // //                                             No data found for selected period
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 ) : (
// // // //                                     customerSummary.map((customer) => (
// // // //                                         <tr key={customer.sr_no}>
// // // //                                             <td style={styles.tableCell}>{customer.sr_no}</td>
// // // //                                             <td style={styles.tableCell}>
// // // //                                                 <strong>{customer.customer_name}</strong>
// // // //                                                 {customer.customer_name_urdu && (
// // // //                                                     <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif" }}>
// // // //                                                         {customer.customer_name_urdu}
// // // //                                                     </div>
// // // //                                                 )}
// // // //                                             </td>
// // // //                                             <td style={styles.tableCellRight}>
// // // //                                                 <strong style={{ color: '#4CAF50' }}>₨ {customer.total_amount.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                             <td style={styles.tableCell}>{formatDateForDisplay(customer.invoice_date)}</td>
// // // //                                             <td style={styles.tableCellCenter}>
// // // //                                                 <button
// // // //                                                     onClick={() => generateSingleCustomerPDF(customer)}
// // // //                                                     style={styles.actionButton}
// // // //                                                     title="Print Report"
// // // //                                                 >
// // // //                                                     <FiFileText size={18} />
// // // //                                                 </button>
// // // //                                             </td>
// // // //                                         </tr>
// // // //                                     ))
// // // //                                 )}
// // // //                             </tbody>
// // // //                             {customerSummary.length > 0 && (
// // // //                                 <tfoot>
// // // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // // //                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
// // // //                                         <td style={styles.tableCellRight}>
// // // //                                             <strong style={{ color: '#4CAF50' }}>
// // // //                                                 ₨ {customerSummary.reduce((sum, c) => sum + c.total_amount, 0).toLocaleString()}
// // // //                                             </strong>
// // // //                                         </td>
// // // //                                         <td colSpan="2"></td>
// // // //                                     </tr>
// // // //                                 </tfoot>
// // // //                             )}
// // // //                         </table>
// // // //                     </div>
// // // //                 </div>
// // // //             )}

// // // //             {/* Item Wise Summary Table */}
// // // //             {activeTab === 'item' && (
// // // //                 <div style={styles.card}>
// // // //                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>📦 Item Summary</h3>
// // // //                     <div style={{ overflowX: 'auto' }}>
// // // //                         <table style={styles.table}>
// // // //                             <thead>
// // // //                                 <tr style={styles.tableHeader}>
// // // //                                     <th style={styles.tableCell}>#</th>
// // // //                                     <th style={styles.tableCell}>Item Name</th>
// // // //                                     <th style={styles.tableCellRight}>Quantity</th>
// // // //                                     <th style={styles.tableCellRight}>Total Amount</th>
// // // //                                 </tr>
// // // //                             </thead>
// // // //                             <tbody>
// // // //                                 {itemWiseSummary.length === 0 ? (
// // // //                                     <tr>
// // // //                                         <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
// // // //                                             No data found for selected period
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 ) : (
// // // //                                     itemWiseSummary.map((item) => (
// // // //                                         <tr key={item.sr_no}>
// // // //                                             <td style={styles.tableCell}>{item.sr_no}</td>
// // // //                                             <td style={styles.tableCell}>
// // // //                                                 <div>{item.item_name}</div>
// // // //                                                 {item.item_name_urdu && (
// // // //                                                     <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif", marginTop: '4px' }}>
// // // //                                                         {item.item_name_urdu}
// // // //                                                     </div>
// // // //                                                 )}
// // // //                                             </td>
// // // //                                             <td style={styles.tableCellRight}>
// // // //                                                 <strong>{item.total_quantity.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                             <td style={styles.tableCellRight}>
// // // //                                                 <strong style={{ color: '#4CAF50' }}>₨ {item.total_amount.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                         </tr>
// // // //                                     ))
// // // //                                 )}
// // // //                             </tbody>
// // // //                             {itemWiseSummary.length > 0 && (
// // // //                                 <tfoot>
// // // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // // //                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
// // // //                                         <td style={styles.tableCellRight}>
// // // //                                             <strong>{itemWiseSummary.reduce((sum, i) => sum + (i.total_quantity || 0), 0).toLocaleString()}</strong>
// // // //                                         </td>
// // // //                                         <td style={styles.tableCellRight}>
// // // //                                             <strong style={{ color: '#4CAF50' }}>
// // // //                                                 ₨ {itemWiseSummary.reduce((sum, i) => sum + (i.total_amount || 0), 0).toLocaleString()}
// // // //                                             </strong>
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 </tfoot>
// // // //                             )}
// // // //                         </table>
// // // //                     </div>
// // // //                 </div>
// // // //             )}

// // // //             <style>{`
// // // //                 @keyframes spin {
// // // //                     0% { transform: rotate(0deg); }
// // // //                     100% { transform: rotate(360deg); }
// // // //                 }
// // // //             `}</style>
// // // //         </div>
// // // //     );
// // // // }

// // // // export default Reports;

// // // // import React, { useState, useEffect, useRef, useContext } from 'react';
// // // // import { toast } from 'react-hot-toast';
// // // // import { FiPrinter, FiSearch, FiCalendar, FiFileText, FiUser, FiPackage } from 'react-icons/fi';
// // // // import { NavigationContext } from '../App';

// // // // function Reports() {
// // // //     const { goBack } = useContext(NavigationContext);
// // // //     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
// // // //     const [invoices, setInvoices] = useState([]);
// // // //     const [loading, setLoading] = useState(false);
// // // //     const [customerSummary, setCustomerSummary] = useState([]);
// // // //     const [itemWiseSummary, setItemWiseSummary] = useState([]);
// // // //     const [tempDate, setTempDate] = useState('');
// // // //     const [showDatePicker, setShowDatePicker] = useState(false);
// // // //     const [activeTab, setActiveTab] = useState('customer');

// // // //     const dateInputRef = useRef(null);

// // // //     useEffect(() => {
// // // //         loadData();
// // // //         setTempDate(formatDateForDisplay(selectedDate));
// // // //         return () => { };
// // // //     }, []);

// // // //     const loadData = async () => {
// // // //         try {
// // // //             const invoicesData = await window.electron.database.getInvoices();
// // // //             setInvoices(invoicesData || []);
// // // //             await loadSummaries(invoicesData || []);
// // // //         } catch (error) {
// // // //             console.error('Failed to load data:', error);
// // // //             toast.error('Failed to load data');
// // // //         }
// // // //     };

// // // //     const loadSummaries = async (invoicesData = null) => {
// // // //         setLoading(true);
// // // //         try {
// // // //             const data = invoicesData || invoices;

// // // //             // Filter invoices by selected date (exact match)
// // // //             const filteredInvoices = data.filter(inv => {
// // // //                 const invDate = inv.invoice_date;
// // // //                 return invDate === selectedDate;
// // // //             });

// // // //             console.log('Selected Date:', selectedDate);
// // // //             console.log('Filtered Invoices:', filteredInvoices);

// // // //             // Group by customer for customer summary
// // // //             const customerMap = new Map();
// // // //             for (const invoice of filteredInvoices) {
// // // //                 const customerName = invoice.customer_name;
// // // //                 if (!customerMap.has(customerName)) {
// // // //                     let customerUrduName = '';
// // // //                     if (invoice.account_id) {
// // // //                         const account = await window.electron.database.getAccountById(invoice.account_id);
// // // //                         customerUrduName = account?.customer_name_urdu || '';
// // // //                     }
// // // //                     customerMap.set(customerName, {
// // // //                         customer_name: customerName,
// // // //                         customer_name_urdu: customerUrduName,
// // // //                         total_amount: 0,
// // // //                         invoice_date: invoice.invoice_date,
// // // //                         invoice_id: invoice.invoice_id,
// // // //                         voucher_id: invoice.voucher_id
// // // //                     });
// // // //                 }
// // // //                 const customer = customerMap.get(customerName);
// // // //                 customer.total_amount += invoice.net_amount || 0;
// // // //                 if (invoice.invoice_date > customer.invoice_date) {
// // // //                     customer.invoice_date = invoice.invoice_date;
// // // //                     customer.invoice_id = invoice.invoice_id;
// // // //                     customer.voucher_id = invoice.voucher_id;
// // // //                 }
// // // //             }

// // // //             const customerList = Array.from(customerMap.values()).map((customer, index) => ({
// // // //                 sr_no: index + 1,
// // // //                 ...customer
// // // //             }));
// // // //             setCustomerSummary(customerList);

// // // //             // Get item-wise summary for selected date
// // // //             const itemSummary = await window.electron.database.getItemWiseSummary({
// // // //                 startDate: selectedDate,
// // // //                 endDate: selectedDate
// // // //             });

// // // //             console.log('Item-wise Summary:', itemSummary);

// // // //             const enrichedItemSummary = await Promise.all(itemSummary.map(async (item, index) => {
// // // //                 let itemNameUrdu = item.item_name_urdu;
// // // //                 if (item.item_id && !itemNameUrdu) {
// // // //                     const product = await window.electron.database.getProductById(item.item_id);
// // // //                     itemNameUrdu = product?.item_name_urdu || '';
// // // //                 }
// // // //                 return {
// // // //                     sr_no: index + 1,
// // // //                     item_name: item.item_name,
// // // //                     item_name_urdu: itemNameUrdu || item.item_name_urdu || '',
// // // //                     total_quantity: item.total_quantity || 0,
// // // //                     total_amount: item.total_amount || 0
// // // //                 };
// // // //             }));
// // // //             setItemWiseSummary(enrichedItemSummary);
// // // //         } catch (error) {
// // // //             console.error('Failed to load summaries:', error);
// // // //             toast.error('Failed to load summaries');
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     const formatDateForDisplay = (dateString) => {
// // // //         if (!dateString) return '';
// // // //         const date = new Date(dateString);
// // // //         if (isNaN(date.getTime())) return '';
// // // //         const day = String(date.getDate()).padStart(2, '0');
// // // //         const month = String(date.getMonth() + 1).padStart(2, '0');
// // // //         const year = date.getFullYear();
// // // //         return `${day}/${month}/${year}`;
// // // //     };

// // // //     const formatDateForStorage = (dateStr) => {
// // // //         if (!dateStr) return null;
// // // //         const parts = dateStr.split('/');
// // // //         if (parts.length === 3) {
// // // //             const day = parseInt(parts[0], 10);
// // // //             const month = parseInt(parts[1], 10);
// // // //             const year = parseInt(parts[2], 10);
// // // //             if (day && month && year && day >= 1 && day <= 31 && month >= 1 && month <= 12 && year.toString().length === 4) {
// // // //                 return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
// // // //             }
// // // //         }
// // // //         return null;
// // // //     };

// // // //     const handleDateInputChange = (value) => {
// // // //         setTempDate(value);
// // // //         let formatted = value.replace(/[^0-9]/g, '');
// // // //         if (formatted.length >= 2 && formatted.length < 4) {
// // // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
// // // //         } else if (formatted.length >= 4 && formatted.length < 6) {
// // // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4);
// // // //         } else if (formatted.length >= 6) {
// // // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4, 8);
// // // //         }
// // // //         setTempDate(formatted);

// // // //         if (formatted.length === 10) {
// // // //             const storageDate = formatDateForStorage(formatted);
// // // //             if (storageDate) {
// // // //                 setSelectedDate(storageDate);
// // // //                 loadSummaries();
// // // //             }
// // // //         }
// // // //     };

// // // //     const handleDateBlur = () => {
// // // //         if (tempDate.length === 10) {
// // // //             const storageDate = formatDateForStorage(tempDate);
// // // //             if (storageDate) {
// // // //                 setSelectedDate(storageDate);
// // // //                 loadSummaries();
// // // //             } else {
// // // //                 const currentDate = new Date();
// // // //                 const storageDate = currentDate.toISOString().split('T')[0];
// // // //                 setSelectedDate(storageDate);
// // // //                 setTempDate(formatDateForDisplay(storageDate));
// // // //                 loadSummaries();
// // // //                 toast.error('Invalid date format. Using current date.');
// // // //             }
// // // //         } else if (tempDate) {
// // // //             const currentDate = new Date();
// // // //             const storageDate = currentDate.toISOString().split('T')[0];
// // // //             setSelectedDate(storageDate);
// // // //             setTempDate(formatDateForDisplay(storageDate));
// // // //             loadSummaries();
// // // //             toast.error('Invalid date. Using current date.');
// // // //         }
// // // //         setShowDatePicker(false);
// // // //     };

// // // //     const handleDateSelect = (date) => {
// // // //         const year = date.getFullYear();
// // // //         const month = String(date.getMonth() + 1).padStart(2, '0');
// // // //         const day = String(date.getDate()).padStart(2, '0');
// // // //         const storageDate = `${year}-${month}-${day}`;
// // // //         const displayDate = formatDateForDisplay(storageDate);
// // // //         setSelectedDate(storageDate);
// // // //         setTempDate(displayDate);
// // // //         setShowDatePicker(false);
// // // //         loadSummaries();
// // // //     };

// // // //     const handleSearch = async () => {
// // // //         await loadSummaries();
// // // //         toast.success('Reports updated');
// // // //     };

// // // //     const generateReportHTML = async (singleCustomer = null) => {
// // // //         try {
// // // //             const filteredInvoices = invoices.filter(inv => {
// // // //                 const invDate = inv.invoice_date;
// // // //                 return invDate === selectedDate;
// // // //             });

// // // //             let customerGroups = {};

// // // //             if (singleCustomer) {
// // // //                 const customerInvoices = filteredInvoices.filter(inv => inv.customer_name === singleCustomer.customer_name);

// // // //                 for (const invoice of customerInvoices) {
// // // //                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // //                     const enrichedDetails = await Promise.all(details.map(async (item) => {
// // // //                         if (item.item_id) {
// // // //                             const product = await window.electron.database.getProductById(item.item_id);
// // // //                             return {
// // // //                                 ...item,
// // // //                                 item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
// // // //                             };
// // // //                         }
// // // //                         return item;
// // // //                     }));

// // // //                     const customerKey = invoice.customer_name;
// // // //                     if (!customerGroups[customerKey]) {
// // // //                         customerGroups[customerKey] = {
// // // //                             customerName: invoice.customer_name,
// // // //                             customerNameUrdu: singleCustomer.customer_name_urdu || '',
// // // //                             customerId: invoice.account_id,
// // // //                             invoices: [],
// // // //                             totalItems: 0,
// // // //                             totalAmount: 0,
// // // //                             discount: 0,
// // // //                             netAmount: 0
// // // //                         };
// // // //                     }

// // // //                     customerGroups[customerKey].invoices.push({
// // // //                         ...invoice,
// // // //                         details: enrichedDetails
// // // //                     });
// // // //                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
// // // //                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
// // // //                     customerGroups[customerKey].discount += invoice.discount || 0;
// // // //                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
// // // //                 }
// // // //             } else {
// // // //                 for (const invoice of filteredInvoices) {
// // // //                     let customerUrduName = '';
// // // //                     if (invoice.account_id) {
// // // //                         const account = await window.electron.database.getAccountById(invoice.account_id);
// // // //                         customerUrduName = account?.customer_name_urdu || '';
// // // //                     }

// // // //                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // //                     const enrichedDetails = await Promise.all(details.map(async (item) => {
// // // //                         if (item.item_id) {
// // // //                             const product = await window.electron.database.getProductById(item.item_id);
// // // //                             return {
// // // //                                 ...item,
// // // //                                 item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
// // // //                             };
// // // //                         }
// // // //                         return item;
// // // //                     }));

// // // //                     const customerKey = invoice.customer_name;
// // // //                     if (!customerGroups[customerKey]) {
// // // //                         customerGroups[customerKey] = {
// // // //                             customerName: invoice.customer_name,
// // // //                             customerNameUrdu: customerUrduName,
// // // //                             customerId: invoice.account_id,
// // // //                             invoices: [],
// // // //                             totalItems: 0,
// // // //                             totalAmount: 0,
// // // //                             discount: 0,
// // // //                             netAmount: 0
// // // //                         };
// // // //                     } else if (customerUrduName && !customerGroups[customerKey].customerNameUrdu) {
// // // //                         customerGroups[customerKey].customerNameUrdu = customerUrduName;
// // // //                     }

// // // //                     customerGroups[customerKey].invoices.push({
// // // //                         ...invoice,
// // // //                         details: enrichedDetails
// // // //                     });
// // // //                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
// // // //                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
// // // //                     customerGroups[customerKey].discount += invoice.discount || 0;
// // // //                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
// // // //                 }
// // // //             }

// // // //             // Prepare items summary per customer
// // // //             const customerItemsSummary = {};
// // // //             for (const [customerName, customerData] of Object.entries(customerGroups)) {
// // // //                 const itemsSummary = {};
// // // //                 for (const invoice of customerData.invoices) {
// // // //                     for (const item of invoice.details) {
// // // //                         const itemKey = item.item_id;
// // // //                         if (!itemsSummary[itemKey]) {
// // // //                             itemsSummary[itemKey] = {
// // // //                                 itemName: item.item_name,
// // // //                                 itemNameUrdu: item.item_name_urdu || '',
// // // //                                 totalQuantity: 0,
// // // //                                 totalAmount: 0,
// // // //                                 avgRate: 0
// // // //                             };
// // // //                         }
// // // //                         itemsSummary[itemKey].totalQuantity += item.quantity;
// // // //                         itemsSummary[itemKey].totalAmount += item.amount;
// // // //                     }
// // // //                 }
// // // //                 for (const item of Object.values(itemsSummary)) {
// // // //                     item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
// // // //                 }
// // // //                 customerItemsSummary[customerName] = Object.values(itemsSummary);
// // // //             }

// // // //             const formattedDate = formatDateForDisplay(selectedDate);
// // // //             const currentDate = formatDateForDisplay(new Date().toISOString().split('T')[0]);

// // // //             const html = `
// // // //                 <!DOCTYPE html>
// // // //                 <html>
// // // //                 <head>
// // // //                     <meta charset="UTF-8">
// // // //                     <title>Sales Report ${formattedDate}</title>
// // // //                     <style>
// // // //                         * {
// // // //                             margin: 0;
// // // //                             padding: 0;
// // // //                             box-sizing: border-box;
// // // //                         }

// // // //                         body {
// // // //                             font-family: 'Segoe UI', 'Arial', sans-serif;
// // // //                             padding: 40px;
// // // //                             background: white;
// // // //                             color: #333;
// // // //                         }

// // // //                         .report-container {
// // // //                             max-width: 1200px;
// // // //                             margin: 0 auto;
// // // //                         }

// // // //                         .header {
// // // //                             text-align: center;
// // // //                             margin-bottom: 40px;
// // // //                             padding-bottom: 20px;
// // // //                             border-bottom: 3px solid #4CAF50;
// // // //                         }

// // // //                         .company-name {
// // // //                             font-size: 28px;
// // // //                             font-weight: bold;
// // // //                             color: #2c3e50;
// // // //                             margin-bottom: 10px;
// // // //                         }

// // // //                         .report-title {
// // // //                             font-size: 24px;
// // // //                             font-weight: bold;
// // // //                             color: #4CAF50;
// // // //                             margin: 10px 0;
// // // //                         }

// // // //                         .date-range {
// // // //                             font-size: 14px;
// // // //                             color: #666;
// // // //                             margin-top: 10px;
// // // //                         }

// // // //                         .customer-section {
// // // //                             margin-bottom: 50px;
// // // //                             page-break-after: always;
// // // //                         }

// // // //                         .customer-section:last-child {
// // // //                             page-break-after: auto;
// // // //                         }

// // // //                         .customer-header {
// // // //                             text-align: center;
// // // //                             margin-bottom: 20px;
// // // //                             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // //                             border-radius: 12px;
// // // //                             overflow: hidden;
// // // //                             box-shadow: 0 4px 15px rgba(0,0,0,0.1);
// // // //                         }

// // // //                         .customer-name {
// // // //                             font-size: 32px;
// // // //                             font-weight: bold;
// // // //                             color: white;
// // // //                             padding: 20px;
// // // //                             margin: 0;
// // // //                             text-align: center;
// // // //                             font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;
// // // //                             text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
// // // //                         }

// // // //                         .customer-date {
// // // //                             font-size: 14px;
// // // //                             color: rgba(255,255,255,0.9);
// // // //                             padding: 10px 20px;
// // // //                             background: rgba(0,0,0,0.1);
// // // //                             text-align: center;
// // // //                         }

// // // //                         .items-table {
// // // //                             width: 100%;
// // // //                             border-collapse: collapse;
// // // //                             margin-top: 20px;
// // // //                             box-shadow: 0 2px 8px rgba(0,0,0,0.05);
// // // //                         }

// // // //                         .items-table th {
// // // //                             background: #4CAF50;
// // // //                             color: white;
// // // //                             border: 1px solid #ddd;
// // // //                             padding: 14px;
// // // //                             text-align: center;
// // // //                             font-size: 16px;
// // // //                             font-weight: bold;
// // // //                         }

// // // //                         .items-table td {
// // // //                             border: 1px solid #ddd;
// // // //                             padding: 12px;
// // // //                             text-align: center;
// // // //                             font-size: 14px;
// // // //                         }

// // // //                         .total-row {
// // // //                             background: #f9f9f9;
// // // //                             font-weight: bold;
// // // //                             border-top: 2px solid #4CAF50;
// // // //                         }

// // // //                         .total-row td {
// // // //                             font-weight: bold;
// // // //                             font-size: 16px;
// // // //                             padding: 14px;
// // // //                         }

// // // //                         .footer {
// // // //                             margin-top: 40px;
// // // //                             padding-top: 20px;
// // // //                             text-align: center;
// // // //                             border-top: 1px solid #e0e0e0;
// // // //                             font-size: 12px;
// // // //                             color: #999;
// // // //                         }

// // // //                         .footer-developer {
// // // //                             font-size: 14px;
// // // //                             color: #4CAF50;
// // // //                             margin-top: 10px;
// // // //                             font-weight: bold;
// // // //                         }
// // // //                     </style>
// // // //                 </head>
// // // //                 <body>
// // // //                     <div class="report-container">
// // // //                         <div class="header">
// // // //                             <div class="company-name">INVENTORY MANAGEMENT SYSTEM</div>
// // // //                             <div class="report-title">SALES REPORT</div>
// // // //                             <div class="date-range">Date: ${formattedDate}</div>
// // // //                         </div>

// // // //                         ${Object.entries(customerGroups).map(([customerName, customerData]) => {
// // // //                 const itemsSummary = customerItemsSummary[customerName] || [];
// // // //                 const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
// // // //                 const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);
// // // //                 const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
// // // //                 const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());
// // // //                 const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== ''
// // // //                     ? customerData.customerNameUrdu
// // // //                     : customerData.customerName;

// // // //                 return `
// // // //                             <div class="customer-section">
// // // //                                 <div class="customer-header">
// // // //                                     <div class="customer-name" style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// // // //                                         ${displayCustomerName}
// // // //                                     </div>
// // // //                                     <div class="customer-date">
// // // //                                         Date: ${invoiceDate}
// // // //                                     </div>
// // // //                                 </div>

// // // //                                 <table class="items-table">
// // // //                                     <thead>
// // // //                                         <tr>
// // // //                                             <th>#</th>
// // // //                                             <th>Item</th>
// // // //                                             <th>Quantity</th>
// // // //                                             <th>Rate</th>
// // // //                                             <th>Amount</th>
// // // //                                         </thead>
// // // //                                     <tbody>
// // // //                                         ${itemsSummary.map((item, idx) => {
// // // //                     const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
// // // //                         ? item.itemNameUrdu
// // // //                         : item.itemName;

// // // //                     return `
// // // //                                                 <tr>
// // // //                                                     <td>${idx + 1}</td>
// // // //                                                     <td style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// // // //                                                         ${displayItemName}
// // // //                                                     </td>
// // // //                                                     <td>${item.totalQuantity.toLocaleString()}</td>
// // // //                                                     <td>${Math.round(item.avgRate).toLocaleString()}</td>
// // // //                                                     <td style="color: #4CAF50; font-weight: bold;">
// // // //                                                         ${item.totalAmount.toLocaleString()}
// // // //                                                     </td>
// // // //                                                 </tr>
// // // //                                             `;
// // // //                 }).join('')}
// // // //                                         <tr class="total-row">
// // // //                                             <td colspan="2"><strong>GRAND TOTAL</strong></td>
// // // //                                             <td><strong>${totalItems.toLocaleString()}</strong></td>
// // // //                                             <td>-</td>
// // // //                                             <td style="color: #4CAF50; font-size: 18px;">
// // // //                                                 <strong>${totalAmount.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                         </tr>
// // // //                                     </tbody>
// // // //                                 </table>
// // // //                             </div>
// // // //                         `;
// // // //             }).join('')}

// // // //                         <div class="footer">
// // // //                             <p>This report was generated by Inventory Management System</p>
// // // //                             <p class="footer-developer">Developed By Ultimate Solutions</p>
// // // //                             <p>${new Date().toLocaleString()}</p>
// // // //                         </div>
// // // //                     </div>
// // // //                 </body>
// // // //                 </html>
// // // //             `;

// // // //             return html;
// // // //         } catch (error) {
// // // //             console.error('Error generating report HTML:', error);
// // // //             toast.error('Failed to generate report');
// // // //             return null;
// // // //         }
// // // //     };

// // // //     const generateAllCustomersPDF = async () => {
// // // //         setLoading(true);
// // // //         try {
// // // //             const html = await generateReportHTML();
// // // //             if (html) {
// // // //                 const pdfPath = await window.electron.printToPDF(html);
// // // //                 if (pdfPath) {
// // // //                     toast.success('PDF saved successfully for all customers');
// // // //                 } else {
// // // //                     toast.error('PDF generation cancelled');
// // // //                 }
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('Error generating PDF:', error);
// // // //             toast.error('Failed to generate PDF');
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     const generateSingleCustomerPDF = async (customer) => {
// // // //         setLoading(true);
// // // //         try {
// // // //             const html = await generateReportHTML(customer);
// // // //             if (html) {
// // // //                 const pdfPath = await window.electron.printToPDF(html);
// // // //                 if (pdfPath) {
// // // //                     toast.success(`PDF saved successfully for ${customer.customer_name}`);
// // // //                 } else {
// // // //                     toast.error('PDF generation cancelled');
// // // //                 }
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('Error generating PDF:', error);
// // // //             toast.error('Failed to generate PDF');
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     const DatePickerCalendar = ({ currentDate, onSelect, onClose }) => {
// // // //         const [displayDate, setDisplayDate] = useState(currentDate || new Date());

// // // //         const getDaysInMonth = (date) => {
// // // //             const year = date.getFullYear();
// // // //             const month = date.getMonth();
// // // //             const firstDay = new Date(year, month, 1);
// // // //             const lastDay = new Date(year, month + 1, 0);
// // // //             const days = [];
// // // //             const startOffset = firstDay.getDay();
// // // //             for (let i = 0; i < startOffset; i++) days.push(null);
// // // //             for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
// // // //             return days;
// // // //         };

// // // //         const days = getDaysInMonth(displayDate);
// // // //         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// // // //         return (
// // // //             <div style={calendarStyles.container}>
// // // //                 <div style={calendarStyles.header}>
// // // //                     <button onClick={() => setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1))} style={calendarStyles.navButton}>←</button>
// // // //                     <span style={calendarStyles.monthYear}>{monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}</span>
// // // //                     <button onClick={() => setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1))} style={calendarStyles.navButton}>→</button>
// // // //                 </div>
// // // //                 <div style={calendarStyles.weekdays}>
// // // //                     {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} style={calendarStyles.weekday}>{day}</div>)}
// // // //                 </div>
// // // //                 <div style={calendarStyles.days}>
// // // //                     {days.map((date, idx) => (
// // // //                         <div
// // // //                             key={idx}
// // // //                             onClick={() => date && onSelect(date)}
// // // //                             style={{
// // // //                                 ...calendarStyles.day,
// // // //                                 ...(date ? calendarStyles.dayCell : {}),
// // // //                                 ...(date && date.toDateString() === new Date().toDateString() ? calendarStyles.today : {})
// // // //                             }}
// // // //                         >
// // // //                             {date ? date.getDate() : ''}
// // // //                         </div>
// // // //                     ))}
// // // //                 </div>
// // // //             </div>
// // // //         );
// // // //     };

// // // //     const calendarStyles = {
// // // //         container: {
// // // //             position: 'absolute',
// // // //             top: '100%',
// // // //             left: 0,
// // // //             background: 'white',
// // // //             border: '1px solid #ddd',
// // // //             borderRadius: '8px',
// // // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // // //             padding: '12px',
// // // //             zIndex: 9999,
// // // //             marginTop: '4px',
// // // //             width: '280px'
// // // //         },
// // // //         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
// // // //         navButton: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', color: '#666' },
// // // //         monthYear: { fontWeight: 'bold', fontSize: '14px' },
// // // //         weekdays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' },
// // // //         weekday: { textAlign: 'center', fontSize: '11px', color: '#666', padding: '4px' },
// // // //         days: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' },
// // // //         dayCell: { textAlign: 'center', padding: '6px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' },
// // // //         day: { color: '#333' },
// // // //         today: { border: '1px solid #4CAF50', fontWeight: 'bold', backgroundColor: '#e8f5e9' }
// // // //     };

// // // //     const styles = {
// // // //         container: { padding: '16px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' },
// // // //         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' },
// // // //         headerTitle: { margin: 0, fontSize: '20px', fontWeight: '600' },
// // // //         buttonGroup: { display: 'flex', gap: '8px' },
// // // //         buttonPrimary: { padding: '6px 14px', background: 'white', color: '#667eea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
// // // //         buttonSuccess: { padding: '6px 14px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
// // // //         card: { background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
// // // //         row: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
// // // //         formGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px' },
// // // //         label: { fontSize: '11px', fontWeight: '500', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
// // // //         dateInputWrapper: { position: 'relative', width: '100%' },
// // // //         input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
// // // //         calendarIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', cursor: 'pointer', fontSize: '16px' },
// // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
// // // //         tableHeader: { background: '#f5f5f5', borderBottom: '2px solid #e0e0e0', fontWeight: '600' },
// // // //         tableCell: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' },
// // // //         tableCellRight: { padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' },
// // // //         tableCellCenter: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' },
// // // //         actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', fontSize: '16px', color: '#2196F3', transition: 'all 0.2s' },
// // // //         tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' },
// // // //         tab: { padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', border: 'none', background: 'none', color: '#666', transition: 'all 0.2s' },
// // // //         activeTab: { color: '#4CAF50', borderBottom: '2px solid #4CAF50', marginBottom: '-2px' },
// // // //         loadingOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
// // // //         loadingSpinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #4CAF50', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }
// // // //     };

// // // //     if (loading) {
// // // //         return (
// // // //             <div style={styles.loadingOverlay}>
// // // //                 <div style={styles.loadingSpinner}></div>
// // // //             </div>
// // // //         );
// // // //     }

// // // //     return (
// // // //         <div style={styles.container}>
// // // //             <div style={styles.header}>
// // // //                 <h1 style={styles.headerTitle}>📊 Sales Reports</h1>
// // // //                 <div style={styles.buttonGroup}>
// // // //                     <button onClick={generateAllCustomersPDF} style={styles.buttonSuccess}>
// // // //                         <FiPrinter size={14} /> Print All Report
// // // //                     </button>
// // // //                 </div>
// // // //             </div>

// // // //             {/* Tabs */}
// // // //             <div style={styles.tabContainer}>
// // // //                 <button
// // // //                     onClick={() => setActiveTab('customer')}
// // // //                     style={{ ...styles.tab, ...(activeTab === 'customer' ? styles.activeTab : {}) }}
// // // //                 >
// // // //                     <FiUser size={14} style={{ marginRight: '6px' }} /> Customer Summary
// // // //                 </button>
// // // //                 <button
// // // //                     onClick={() => setActiveTab('item')}
// // // //                     style={{ ...styles.tab, ...(activeTab === 'item' ? styles.activeTab : {}) }}
// // // //                 >
// // // //                     <FiPackage size={14} style={{ marginRight: '6px' }} /> Item Summary
// // // //                 </button>
// // // //             </div>

// // // //             {/* Single Date Picker */}
// // // //             <div style={styles.card}>
// // // //                 <div style={styles.row}>
// // // //                     <div style={styles.formGroup}>
// // // //                         <label style={styles.label}>SELECT DATE</label>
// // // //                         <div style={styles.dateInputWrapper}>
// // // //                             <input
// // // //                                 ref={dateInputRef}
// // // //                                 type="text"
// // // //                                 placeholder="DD/MM/YYYY"
// // // //                                 value={tempDate}
// // // //                                 onChange={(e) => handleDateInputChange(e.target.value)}
// // // //                                 onFocus={() => setShowDatePicker(true)}
// // // //                                 onBlur={handleDateBlur}
// // // //                                 style={styles.input}
// // // //                             />
// // // //                             <FiCalendar style={styles.calendarIcon} onClick={() => setShowDatePicker(!showDatePicker)} />
// // // //                             {showDatePicker && (
// // // //                                 <DatePickerCalendar
// // // //                                     currentDate={new Date(selectedDate)}
// // // //                                     onSelect={(date) => handleDateSelect(date)}
// // // //                                     onClose={() => setShowDatePicker(false)}
// // // //                                 />
// // // //                             )}
// // // //                         </div>
// // // //                     </div>
// // // //                     <div style={styles.formGroup}>
// // // //                         <button onClick={handleSearch} style={styles.buttonPrimary}>
// // // //                             <FiSearch size={14} /> Search
// // // //                         </button>
// // // //                     </div>
// // // //                 </div>
// // // //             </div>

// // // //             {/* Customer Summary Table */}
// // // //             {activeTab === 'customer' && (
// // // //                 <div style={styles.card}>
// // // //                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>📋 Customer Summary</h3>
// // // //                     <div style={{ overflowX: 'auto' }}>
// // // //                         <table style={styles.table}>
// // // //                             <thead>
// // // //                                 <tr style={styles.tableHeader}>
// // // //                                     <th style={styles.tableCell}>#</th>
// // // //                                     <th style={styles.tableCell}>Customer Name</th>
// // // //                                     <th style={styles.tableCellRight}>Total Amount</th>
// // // //                                     <th style={styles.tableCell}>Date</th>
// // // //                                     <th style={styles.tableCellCenter}>Actions</th>
// // // //                                 </tr>
// // // //                             </thead>
// // // //                             <tbody>
// // // //                                 {customerSummary.length === 0 ? (
// // // //                                     <tr>
// // // //                                         <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
// // // //                                             No data found for selected date
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 ) : (
// // // //                                     customerSummary.map((customer) => (
// // // //                                         <tr key={customer.sr_no}>
// // // //                                             <td style={styles.tableCell}>{customer.sr_no}</td>
// // // //                                             <td style={styles.tableCell}>
// // // //                                                 <strong>{customer.customer_name}</strong>
// // // //                                                 {customer.customer_name_urdu && (
// // // //                                                     <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif" }}>
// // // //                                                         {customer.customer_name_urdu}
// // // //                                                     </div>
// // // //                                                 )}
// // // //                                             </td>
// // // //                                             <td style={styles.tableCellRight}>
// // // //                                                 <strong style={{ color: '#4CAF50' }}>₨ {customer.total_amount.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                             <td style={styles.tableCell}>{formatDateForDisplay(customer.invoice_date)}</td>
// // // //                                             <td style={styles.tableCellCenter}>
// // // //                                                 <button
// // // //                                                     onClick={() => generateSingleCustomerPDF(customer)}
// // // //                                                     style={styles.actionButton}
// // // //                                                     title="Print Report"
// // // //                                                 >
// // // //                                                     <FiFileText size={18} />
// // // //                                                 </button>
// // // //                                             </td>
// // // //                                         </tr>
// // // //                                     ))
// // // //                                 )}
// // // //                             </tbody>
// // // //                             {customerSummary.length > 0 && (
// // // //                                 <tfoot>
// // // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // // //                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
// // // //                                         <td style={styles.tableCellRight}>
// // // //                                             <strong style={{ color: '#4CAF50' }}>
// // // //                                                 ₨ {customerSummary.reduce((sum, c) => sum + c.total_amount, 0).toLocaleString()}
// // // //                                             </strong>
// // // //                                         </td>
// // // //                                         <td colSpan="2"></td>
// // // //                                     </tr>
// // // //                                 </tfoot>
// // // //                             )}
// // // //                         </table>
// // // //                     </div>
// // // //                 </div>
// // // //             )}

// // // //             {/* Item Wise Summary Table */}
// // // //             {activeTab === 'item' && (
// // // //                 <div style={styles.card}>
// // // //                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>📦 Item Summary</h3>
// // // //                     <div style={{ overflowX: 'auto' }}>
// // // //                         <table style={styles.table}>
// // // //                             <thead>
// // // //                                 <tr style={styles.tableHeader}>
// // // //                                     <th style={styles.tableCell}>#</th>
// // // //                                     <th style={styles.tableCell}>Item Name</th>
// // // //                                     <th style={styles.tableCellRight}>Quantity</th>
// // // //                                     <th style={styles.tableCellRight}>Total Amount</th>
// // // //                                 </tr>
// // // //                             </thead>
// // // //                             <tbody>
// // // //                                 {itemWiseSummary.length === 0 ? (
// // // //                                     <tr>
// // // //                                         <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
// // // //                                             No data found for selected date
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 ) : (
// // // //                                     itemWiseSummary.map((item) => (
// // // //                                         <tr key={item.sr_no}>
// // // //                                             <td style={styles.tableCell}>{item.sr_no}</td>
// // // //                                             <td style={styles.tableCell}>
// // // //                                                 <div>{item.item_name}</div>
// // // //                                                 {item.item_name_urdu && (
// // // //                                                     <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif", marginTop: '4px' }}>
// // // //                                                         {item.item_name_urdu}
// // // //                                                     </div>
// // // //                                                 )}
// // // //                                             </td>
// // // //                                             <td style={styles.tableCellRight}>
// // // //                                                 <strong>{item.total_quantity.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                             <td style={styles.tableCellRight}>
// // // //                                                 <strong style={{ color: '#4CAF50' }}>₨ {item.total_amount.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                         </tr>
// // // //                                     ))
// // // //                                 )}
// // // //                             </tbody>
// // // //                             {itemWiseSummary.length > 0 && (
// // // //                                 <tfoot>
// // // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // // //                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
// // // //                                         <td style={styles.tableCellRight}>
// // // //                                             <strong>{itemWiseSummary.reduce((sum, i) => sum + (i.total_quantity || 0), 0).toLocaleString()}</strong>
// // // //                                         </td>
// // // //                                         <td style={styles.tableCellRight}>
// // // //                                             <strong style={{ color: '#4CAF50' }}>
// // // //                                                 ₨ {itemWiseSummary.reduce((sum, i) => sum + (i.total_amount || 0), 0).toLocaleString()}
// // // //                                             </strong>
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 </tfoot>
// // // //                             )}
// // // //                         </table>
// // // //                     </div>
// // // //                 </div>
// // // //             )}

// // // //             <style>{`
// // // //                 @keyframes spin {
// // // //                     0% { transform: rotate(0deg); }
// // // //                     100% { transform: rotate(360deg); }
// // // //                 }
// // // //             `}</style>
// // // //         </div>
// // // //     );
// // // // }

// // // // export default Reports;

// // // // import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
// // // // import { toast } from 'react-hot-toast';
// // // // import { FiPrinter, FiCalendar, FiFileText, FiUser, FiPackage, FiSearch } from 'react-icons/fi';
// // // // import { NavigationContext } from '../App';

// // // // function Reports() {
// // // //     const { goBack } = useContext(NavigationContext);
// // // //     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
// // // //     const [invoices, setInvoices] = useState([]);
// // // //     const [loading, setLoading] = useState(false);
// // // //     const [customerSummary, setCustomerSummary] = useState([]);
// // // //     const [itemWiseSummary, setItemWiseSummary] = useState([]);
// // // //     const [tempDate, setTempDate] = useState('');
// // // //     const [showDatePicker, setShowDatePicker] = useState(false);
// // // //     const [activeTab, setActiveTab] = useState('customer');
// // // //     const [searchTerm, setSearchTerm] = useState('');

// // // //     const dateInputRef = useRef(null);
// // // //     const datePickerRef = useRef(null);
// // // //     const isInitialMount = useRef(true);

// // // //     useEffect(() => {
// // // //         loadData();

// // // //         // Handle click outside to close date picker
// // // //         const handleClickOutside = (event) => {
// // // //             if (datePickerRef.current && !datePickerRef.current.contains(event.target) &&
// // // //                 dateInputRef.current && !dateInputRef.current.contains(event.target)) {
// // // //                 setShowDatePicker(false);
// // // //             }
// // // //         };

// // // //         document.addEventListener('mousedown', handleClickOutside);
// // // //         return () => {
// // // //             document.removeEventListener('mousedown', handleClickOutside);
// // // //         };
// // // //     }, []);

// // // //     // Set initial temp date when selectedDate changes
// // // //     useEffect(() => {
// // // //         if (selectedDate) {
// // // //             const displayDate = formatDateForDisplay(selectedDate);
// // // //             setTempDate(displayDate);
// // // //         }
// // // //     }, [selectedDate]);

// // // //     // Auto fetch when selectedDate changes (skip initial mount if needed)
// // // //     useEffect(() => {
// // // //         if (isInitialMount.current) {
// // // //             isInitialMount.current = false;
// // // //             // Load summaries after invoices are loaded
// // // //             if (invoices.length > 0) {
// // // //                 loadSummaries();
// // // //             }
// // // //         } else if (selectedDate && invoices.length > 0) {
// // // //             loadSummaries();
// // // //         }
// // // //     }, [selectedDate, invoices]);

// // // //     const loadData = async () => {
// // // //         try {
// // // //             const invoicesData = await window.electron.database.getInvoices();
// // // //             setInvoices(invoicesData || []);
// // // //         } catch (error) {
// // // //             console.error('Failed to load data:', error);
// // // //             toast.error('Failed to load data');
// // // //         }
// // // //     };

// // // //     const loadSummaries = useCallback(async () => {
// // // //         if (!selectedDate) return;

// // // //         setLoading(true);
// // // //         try {
// // // //             const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();

// // // //             // Filter invoices by selected date (exact match)
// // // //             const filteredInvoices = allInvoices.filter(inv => {
// // // //                 const invDate = inv.invoice_date;
// // // //                 return invDate === selectedDate;
// // // //             });

// // // //             console.log('Selected Date:', selectedDate);
// // // //             console.log('Filtered Invoices:', filteredInvoices.length);

// // // //             // Group by customer for customer summary
// // // //             const customerMap = new Map();
// // // //             for (const invoice of filteredInvoices) {
// // // //                 const customerName = invoice.customer_name;
// // // //                 if (!customerMap.has(customerName)) {
// // // //                     let customerUrduName = '';
// // // //                     if (invoice.account_id) {
// // // //                         try {
// // // //                             const account = await window.electron.database.getAccountById(invoice.account_id);
// // // //                             customerUrduName = account?.customer_name_urdu || '';
// // // //                         } catch (err) {
// // // //                             console.error('Error fetching account:', err);
// // // //                         }
// // // //                     }
// // // //                     customerMap.set(customerName, {
// // // //                         customer_name: customerName,
// // // //                         customer_name_urdu: customerUrduName,
// // // //                         total_amount: 0,
// // // //                         invoice_date: invoice.invoice_date,
// // // //                         invoice_id: invoice.invoice_id,
// // // //                         voucher_id: invoice.voucher_id
// // // //                     });
// // // //                 }
// // // //                 const customer = customerMap.get(customerName);
// // // //                 customer.total_amount += invoice.net_amount || 0;
// // // //                 if (invoice.invoice_date > customer.invoice_date) {
// // // //                     customer.invoice_date = invoice.invoice_date;
// // // //                     customer.invoice_id = invoice.invoice_id;
// // // //                     customer.voucher_id = invoice.voucher_id;
// // // //                 }
// // // //             }

// // // //             const customerList = Array.from(customerMap.values()).map((customer, index) => ({
// // // //                 sr_no: index + 1,
// // // //                 ...customer
// // // //             }));
// // // //             setCustomerSummary(customerList);

// // // //             // Calculate item summary from invoice details
// // // //             const itemsMap = new Map();

// // // //             for (const invoice of filteredInvoices) {
// // // //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // //                 console.log(`Invoice ${invoice.invoice_id} details:`, details.length);

// // // //                 for (const item of details) {
// // // //                     const itemId = item.item_id;
// // // //                     const itemKey = itemId || item.item_name;

// // // //                     if (!itemsMap.has(itemKey)) {
// // // //                         let itemNameUrdu = item.item_name_urdu || '';
// // // //                         if (itemId && !itemNameUrdu) {
// // // //                             try {
// // // //                                 const product = await window.electron.database.getProductById(itemId);
// // // //                                 itemNameUrdu = product?.item_name_urdu || '';
// // // //                             } catch (err) {
// // // //                                 console.error('Error fetching product:', err);
// // // //                             }
// // // //                         }
// // // //                         itemsMap.set(itemKey, {
// // // //                             item_name: item.item_name,
// // // //                             item_name_urdu: itemNameUrdu,
// // // //                             total_quantity: 0,
// // // //                             total_amount: 0
// // // //                         });
// // // //                     }
// // // //                     const itemData = itemsMap.get(itemKey);
// // // //                     itemData.total_quantity += parseFloat(item.quantity) || 0;
// // // //                     itemData.total_amount += parseFloat(item.amount) || 0;
// // // //                 }
// // // //             }

// // // //             const itemList = Array.from(itemsMap.values()).map((item, index) => ({
// // // //                 sr_no: index + 1,
// // // //                 item_name: item.item_name,
// // // //                 item_name_urdu: item.item_name_urdu,
// // // //                 total_quantity: item.total_quantity,
// // // //                 total_amount: item.total_amount
// // // //             }));

// // // //             console.log('Calculated Item Summary:', itemList.length);
// // // //             setItemWiseSummary(itemList);

// // // //             if (filteredInvoices.length === 0 && !isInitialMount.current) {
// // // //                 toast.error('No invoices found for selected date');
// // // //             }

// // // //         } catch (error) {
// // // //             console.error('Failed to load summaries:', error);
// // // //             toast.error('Failed to load summaries: ' + error.message);
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     }, [selectedDate, invoices]);

// // // //     // Filtered data based on search term
// // // //     const filteredCustomerSummary = useMemo(() => {
// // // //         if (!searchTerm.trim()) return customerSummary;
// // // //         const searchLower = searchTerm.toLowerCase();
// // // //         return customerSummary.filter(customer =>
// // // //             customer.customer_name.toLowerCase().includes(searchLower) ||
// // // //             (customer.customer_name_urdu && customer.customer_name_urdu.includes(searchTerm))
// // // //         );
// // // //     }, [customerSummary, searchTerm]);

// // // //     const filteredItemSummary = useMemo(() => {
// // // //         if (!searchTerm.trim()) return itemWiseSummary;
// // // //         const searchLower = searchTerm.toLowerCase();
// // // //         return itemWiseSummary.filter(item =>
// // // //             item.item_name.toLowerCase().includes(searchLower) ||
// // // //             (item.item_name_urdu && item.item_name_urdu.includes(searchTerm))
// // // //         );
// // // //     }, [itemWiseSummary, searchTerm]);

// // // //     const formatDateForDisplay = (dateString) => {
// // // //         if (!dateString) return '';
// // // //         const date = new Date(dateString);
// // // //         if (isNaN(date.getTime())) return '';
// // // //         const day = String(date.getDate()).padStart(2, '0');
// // // //         const month = String(date.getMonth() + 1).padStart(2, '0');
// // // //         const year = date.getFullYear();
// // // //         return `${day}/${month}/${year}`;
// // // //     };

// // // //     const formatDateForStorage = (dateStr) => {
// // // //         if (!dateStr) return null;
// // // //         const parts = dateStr.split('/');
// // // //         if (parts.length === 3) {
// // // //             const day = parseInt(parts[0], 10);
// // // //             const month = parseInt(parts[1], 10);
// // // //             const year = parseInt(parts[2], 10);
// // // //             if (!isNaN(day) && !isNaN(month) && !isNaN(year) &&
// // // //                 day >= 1 && day <= 31 && month >= 1 && month <= 12 && year.toString().length === 4) {
// // // //                 return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
// // // //             }
// // // //         }
// // // //         return null;
// // // //     };

// // // //     const handleDateInputChange = (value) => {
// // // //         setTempDate(value);
// // // //         let formatted = value.replace(/[^0-9]/g, '');
// // // //         if (formatted.length >= 2 && formatted.length < 4) {
// // // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
// // // //         } else if (formatted.length >= 4 && formatted.length < 6) {
// // // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4);
// // // //         } else if (formatted.length >= 6) {
// // // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4, 8);
// // // //         }
// // // //         setTempDate(formatted);

// // // //         if (formatted.length === 10) {
// // // //             const storageDate = formatDateForStorage(formatted);
// // // //             if (storageDate) {
// // // //                 setSelectedDate(storageDate);
// // // //             }
// // // //         }
// // // //     };

// // // //     const handleDateBlur = () => {
// // // //         if (tempDate.length === 10) {
// // // //             const storageDate = formatDateForStorage(tempDate);
// // // //             if (storageDate) {
// // // //                 setSelectedDate(storageDate);
// // // //             } else {
// // // //                 const currentDate = new Date();
// // // //                 const storageDate = currentDate.toISOString().split('T')[0];
// // // //                 setSelectedDate(storageDate);
// // // //                 toast.error('Invalid date format. Using current date.');
// // // //             }
// // // //         } else if (tempDate && tempDate.length > 0) {
// // // //             const currentDate = new Date();
// // // //             const storageDate = currentDate.toISOString().split('T')[0];
// // // //             setSelectedDate(storageDate);
// // // //             toast.error('Invalid date. Using current date.');
// // // //         }
// // // //         setShowDatePicker(false);
// // // //     };

// // // //     const handleDateSelect = useCallback((date) => {
// // // //         const year = date.getFullYear();
// // // //         const month = String(date.getMonth() + 1).padStart(2, '0');
// // // //         const day = String(date.getDate()).padStart(2, '0');
// // // //         const storageDate = `${year}-${month}-${day}`;
// // // //         console.log('Selected date from calendar:', storageDate);
// // // //         setSelectedDate(storageDate);
// // // //         setShowDatePicker(false);
// // // //     }, []);

// // // //     const generateReportHTML = async (singleCustomer = null) => {
// // // //         try {
// // // //             const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();
// // // //             const filteredInvoices = allInvoices.filter(inv => {
// // // //                 const invDate = inv.invoice_date;
// // // //                 return invDate === selectedDate;
// // // //             });

// // // //             let customerGroups = {};

// // // //             if (singleCustomer) {
// // // //                 const customerInvoices = filteredInvoices.filter(inv => inv.customer_name === singleCustomer.customer_name);

// // // //                 for (const invoice of customerInvoices) {
// // // //                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // //                     const enrichedDetails = await Promise.all(details.map(async (item) => {
// // // //                         if (item.item_id) {
// // // //                             try {
// // // //                                 const product = await window.electron.database.getProductById(item.item_id);
// // // //                                 return {
// // // //                                     ...item,
// // // //                                     item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
// // // //                                 };
// // // //                             } catch (err) {
// // // //                                 return item;
// // // //                             }
// // // //                         }
// // // //                         return item;
// // // //                     }));

// // // //                     const customerKey = invoice.customer_name;
// // // //                     if (!customerGroups[customerKey]) {
// // // //                         customerGroups[customerKey] = {
// // // //                             customerName: invoice.customer_name,
// // // //                             customerNameUrdu: singleCustomer.customer_name_urdu || '',
// // // //                             customerId: invoice.account_id,
// // // //                             invoices: [],
// // // //                             totalItems: 0,
// // // //                             totalAmount: 0,
// // // //                             discount: 0,
// // // //                             netAmount: 0
// // // //                         };
// // // //                     }

// // // //                     customerGroups[customerKey].invoices.push({
// // // //                         ...invoice,
// // // //                         details: enrichedDetails
// // // //                     });
// // // //                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
// // // //                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
// // // //                     customerGroups[customerKey].discount += invoice.discount || 0;
// // // //                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
// // // //                 }
// // // //             } else {
// // // //                 for (const invoice of filteredInvoices) {
// // // //                     let customerUrduName = '';
// // // //                     if (invoice.account_id) {
// // // //                         try {
// // // //                             const account = await window.electron.database.getAccountById(invoice.account_id);
// // // //                             customerUrduName = account?.customer_name_urdu || '';
// // // //                         } catch (err) {
// // // //                             console.error('Error fetching account:', err);
// // // //                         }
// // // //                     }

// // // //                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // // //                     const enrichedDetails = await Promise.all(details.map(async (item) => {
// // // //                         if (item.item_id) {
// // // //                             try {
// // // //                                 const product = await window.electron.database.getProductById(item.item_id);
// // // //                                 return {
// // // //                                     ...item,
// // // //                                     item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
// // // //                                 };
// // // //                             } catch (err) {
// // // //                                 return item;
// // // //                             }
// // // //                         }
// // // //                         return item;
// // // //                     }));

// // // //                     const customerKey = invoice.customer_name;
// // // //                     if (!customerGroups[customerKey]) {
// // // //                         customerGroups[customerKey] = {
// // // //                             customerName: invoice.customer_name,
// // // //                             customerNameUrdu: customerUrduName,
// // // //                             customerId: invoice.account_id,
// // // //                             invoices: [],
// // // //                             totalItems: 0,
// // // //                             totalAmount: 0,
// // // //                             discount: 0,
// // // //                             netAmount: 0
// // // //                         };
// // // //                     } else if (customerUrduName && !customerGroups[customerKey].customerNameUrdu) {
// // // //                         customerGroups[customerKey].customerNameUrdu = customerUrduName;
// // // //                     }

// // // //                     customerGroups[customerKey].invoices.push({
// // // //                         ...invoice,
// // // //                         details: enrichedDetails
// // // //                     });
// // // //                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
// // // //                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
// // // //                     customerGroups[customerKey].discount += invoice.discount || 0;
// // // //                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
// // // //                 }
// // // //             }

// // // //             // Prepare items summary per customer
// // // //             const customerItemsSummary = {};
// // // //             for (const [customerName, customerData] of Object.entries(customerGroups)) {
// // // //                 const itemsSummary = {};
// // // //                 for (const invoice of customerData.invoices) {
// // // //                     for (const item of invoice.details) {
// // // //                         const itemKey = item.item_id || item.item_name;
// // // //                         if (!itemsSummary[itemKey]) {
// // // //                             itemsSummary[itemKey] = {
// // // //                                 itemName: item.item_name,
// // // //                                 itemNameUrdu: item.item_name_urdu || '',
// // // //                                 totalQuantity: 0,
// // // //                                 totalAmount: 0,
// // // //                                 avgRate: 0
// // // //                             };
// // // //                         }
// // // //                         itemsSummary[itemKey].totalQuantity += item.quantity;
// // // //                         itemsSummary[itemKey].totalAmount += item.amount;
// // // //                     }
// // // //                 }
// // // //                 for (const item of Object.values(itemsSummary)) {
// // // //                     item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
// // // //                 }
// // // //                 customerItemsSummary[customerName] = Object.values(itemsSummary);
// // // //             }

// // // //             const formattedDate = formatDateForDisplay(selectedDate);

// // // //             const html = `
// // // //                 <!DOCTYPE html>
// // // //                 <html>
// // // //                 <head>
// // // //                     <meta charset="UTF-8">
// // // //                     <title>Sales Report ${formattedDate}</title>
// // // //                     <style>
// // // //                         * {
// // // //                             margin: 0;
// // // //                             padding: 0;
// // // //                             box-sizing: border-box;
// // // //                         }

// // // //                         body {
// // // //                             font-family: 'Segoe UI', 'Arial', sans-serif;
// // // //                             padding: 40px;
// // // //                             background: white;
// // // //                             color: #333;
// // // //                         }

// // // //                         .report-container {
// // // //                             max-width: 1200px;
// // // //                             margin: 0 auto;
// // // //                         }

// // // //                         .header {
// // // //                             text-align: center;
// // // //                             margin-bottom: 40px;
// // // //                             padding-bottom: 20px;
// // // //                             border-bottom: 3px solid #4CAF50;
// // // //                         }

// // // //                         .company-name {
// // // //                             font-size: 28px;
// // // //                             font-weight: bold;
// // // //                             color: #2c3e50;
// // // //                             margin-bottom: 10px;
// // // //                         }

// // // //                         .report-title {
// // // //                             font-size: 24px;
// // // //                             font-weight: bold;
// // // //                             color: #4CAF50;
// // // //                             margin: 10px 0;
// // // //                         }

// // // //                         .date-range {
// // // //                             font-size: 14px;
// // // //                             color: #666;
// // // //                             margin-top: 10px;
// // // //                         }

// // // //                         .customer-section {
// // // //                             margin-bottom: 50px;
// // // //                             page-break-after: always;
// // // //                         }

// // // //                         .customer-section:last-child {
// // // //                             page-break-after: auto;
// // // //                         }

// // // //                         .customer-header {
// // // //                             text-align: center;
// // // //                             margin-bottom: 20px;
// // // //                             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // //                             border-radius: 12px;
// // // //                             overflow: hidden;
// // // //                             box-shadow: 0 4px 15px rgba(0,0,0,0.1);
// // // //                         }

// // // //                         .customer-name {
// // // //                             font-size: 32px;
// // // //                             font-weight: bold;
// // // //                             color: white;
// // // //                             padding: 20px;
// // // //                             margin: 0;
// // // //                             text-align: center;
// // // //                             font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;
// // // //                             text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
// // // //                         }

// // // //                         .customer-date {
// // // //                             font-size: 14px;
// // // //                             color: rgba(255,255,255,0.9);
// // // //                             padding: 10px 20px;
// // // //                             background: rgba(0,0,0,0.1);
// // // //                             text-align: center;
// // // //                         }

// // // //                         .items-table {
// // // //                             width: 100%;
// // // //                             border-collapse: collapse;
// // // //                             margin-top: 20px;
// // // //                             box-shadow: 0 2px 8px rgba(0,0,0,0.05);
// // // //                         }

// // // //                         .items-table th {
// // // //                             background: #4CAF50;
// // // //                             color: white;
// // // //                             border: 1px solid #ddd;
// // // //                             padding: 14px;
// // // //                             text-align: center;
// // // //                             font-size: 16px;
// // // //                             font-weight: bold;
// // // //                         }

// // // //                         .items-table td {
// // // //                             border: 1px solid #ddd;
// // // //                             padding: 12px;
// // // //                             text-align: center;
// // // //                             font-size: 14px;
// // // //                         }

// // // //                         .total-row {
// // // //                             background: #f9f9f9;
// // // //                             font-weight: bold;
// // // //                             border-top: 2px solid #4CAF50;
// // // //                         }

// // // //                         .total-row td {
// // // //                             font-weight: bold;
// // // //                             font-size: 16px;
// // // //                             padding: 14px;
// // // //                         }

// // // //                         .footer {
// // // //                             margin-top: 40px;
// // // //                             padding-top: 20px;
// // // //                             text-align: center;
// // // //                             border-top: 1px solid #e0e0e0;
// // // //                             font-size: 12px;
// // // //                             color: #999;
// // // //                         }

// // // //                         .footer-developer {
// // // //                             font-size: 14px;
// // // //                             color: #4CAF50;
// // // //                             margin-top: 10px;
// // // //                             font-weight: bold;
// // // //                         }
// // // //                     </style>
// // // //                 </head>
// // // //                 <body>
// // // //                     <div class="report-container">
// // // //                         <div class="header">
// // // //                             <div class="company-name">INVENTORY MANAGEMENT SYSTEM</div>
// // // //                             <div class="report-title">SALES REPORT</div>
// // // //                             <div class="date-range">Date: ${formattedDate}</div>
// // // //                         </div>

// // // //                         ${Object.entries(customerGroups).map(([customerName, customerData]) => {
// // // //                 const itemsSummary = customerItemsSummary[customerName] || [];
// // // //                 const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
// // // //                 const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);
// // // //                 const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
// // // //                 const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());
// // // //                 const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== ''
// // // //                     ? customerData.customerNameUrdu
// // // //                     : customerData.customerName;

// // // //                 return `
// // // //                             <div class="customer-section">
// // // //                                 <div class="customer-header">
// // // //                                     <div class="customer-name" style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// // // //                                         ${displayCustomerName}
// // // //                                     </div>
// // // //                                     <div class="customer-date">
// // // //                                         Date: ${invoiceDate}
// // // //                                     </div>
// // // //                                 </div>

// // // //                                 <table class="items-table">
// // // //                                     <thead>
// // // //                                         <tr>
// // // //                                             <th>#</th>
// // // //                                             <th>Item</th>
// // // //                                             <th>Quantity</th>
// // // //                                             <th>Rate</th>
// // // //                                             <th>Amount</th>
// // // //                                         </thead>
// // // //                                     <tbody>
// // // //                                         ${itemsSummary.map((item, idx) => {
// // // //                     const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
// // // //                         ? item.itemNameUrdu
// // // //                         : item.itemName;

// // // //                     return `
// // // //                                                 <tr>
// // // //                                                     <td>${idx + 1}</td>
// // // //                                                     <td style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// // // //                                                         ${displayItemName}
// // // //                                                     </td>
// // // //                                                     <td>${item.totalQuantity.toLocaleString()}</td>
// // // //                                                     <td>${Math.round(item.avgRate).toLocaleString()}</td>
// // // //                                                     <td style="color: #4CAF50; font-weight: bold;">
// // // //                                                         ${item.totalAmount.toLocaleString()}
// // // //                                                     </td>
// // // //                                                 </tr>
// // // //                                             `;
// // // //                 }).join('')}
// // // //                                         <tr class="total-row">
// // // //                                             <td colspan="2"><strong>GRAND TOTAL</strong></td>
// // // //                                             <td><strong>${totalItems.toLocaleString()}</strong></td>
// // // //                                             <td>-</td>
// // // //                                             <td style="color: #4CAF50; font-size: 18px;">
// // // //                                                 <strong>${totalAmount.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                         </tr>
// // // //                                     </tbody>
// // // //                                 </table>
// // // //                             </div>
// // // //                         `;
// // // //             }).join('')}

// // // //                         <div class="footer">
// // // //                             <p>This report was generated by Inventory Management System</p>
// // // //                             <p class="footer-developer">Developed By Ultimate Solutions</p>
// // // //                             <p>${new Date().toLocaleString()}</p>
// // // //                         </div>
// // // //                     </div>
// // // //                 </body>
// // // //                 </html>
// // // //             `;

// // // //             return html;
// // // //         } catch (error) {
// // // //             console.error('Error generating report HTML:', error);
// // // //             toast.error('Failed to generate report');
// // // //             return null;
// // // //         }
// // // //     };

// // // //     const generateAllCustomersPDF = async () => {
// // // //         setLoading(true);
// // // //         try {
// // // //             const html = await generateReportHTML();
// // // //             if (html) {
// // // //                 const pdfPath = await window.electron.printToPDF(html);
// // // //                 if (pdfPath) {
// // // //                     toast.success('PDF saved successfully for all customers');
// // // //                 } else {
// // // //                     toast.error('PDF generation cancelled');
// // // //                 }
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('Error generating PDF:', error);
// // // //             toast.error('Failed to generate PDF');
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     const generateSingleCustomerPDF = async (customer) => {
// // // //         setLoading(true);
// // // //         try {
// // // //             const html = await generateReportHTML(customer);
// // // //             if (html) {
// // // //                 const pdfPath = await window.electron.printToPDF(html);
// // // //                 if (pdfPath) {
// // // //                     toast.success(`PDF saved successfully for ${customer.customer_name}`);
// // // //                 } else {
// // // //                     toast.error('PDF generation cancelled');
// // // //                 }
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('Error generating PDF:', error);
// // // //             toast.error('Failed to generate PDF');
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     const DatePickerCalendar = ({ currentDate, onSelect }) => {
// // // //         const [displayDate, setDisplayDate] = useState(() => {
// // // //             // Initialize with currentDate or default to today
// // // //             if (currentDate && !isNaN(currentDate.getTime())) {
// // // //                 return new Date(currentDate);
// // // //             }
// // // //             return new Date();
// // // //         });

// // // //         // Update displayDate when currentDate prop changes
// // // //         useEffect(() => {
// // // //             if (currentDate && !isNaN(currentDate.getTime())) {
// // // //                 setDisplayDate(new Date(currentDate));
// // // //             }
// // // //         }, [currentDate]);

// // // //         const getDaysInMonth = (date) => {
// // // //             const year = date.getFullYear();
// // // //             const month = date.getMonth();
// // // //             const firstDay = new Date(year, month, 1);
// // // //             const lastDay = new Date(year, month + 1, 0);
// // // //             const days = [];
// // // //             const startOffset = firstDay.getDay();
// // // //             for (let i = 0; i < startOffset; i++) days.push(null);
// // // //             for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
// // // //             return days;
// // // //         };

// // // //         const isSameDay = (date1, date2) => {
// // // //             return date1 && date2 &&
// // // //                 date1.getFullYear() === date2.getFullYear() &&
// // // //                 date1.getMonth() === date2.getMonth() &&
// // // //                 date1.getDate() === date2.getDate();
// // // //         };

// // // //         const days = getDaysInMonth(displayDate);
// // // //         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// // // //         const handlePrevMonth = () => {
// // // //             setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
// // // //         };

// // // //         const handleNextMonth = () => {
// // // //             setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
// // // //         };

// // // //         return (
// // // //             <div ref={datePickerRef} style={calendarStyles.container}>
// // // //                 <div style={calendarStyles.header}>
// // // //                     <button
// // // //                         onClick={handlePrevMonth}
// // // //                         style={calendarStyles.navButton}
// // // //                         type="button"
// // // //                     >←</button>
// // // //                     <span style={calendarStyles.monthYear}>{monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}</span>
// // // //                     <button
// // // //                         onClick={handleNextMonth}
// // // //                         style={calendarStyles.navButton}
// // // //                         type="button"
// // // //                     >→</button>
// // // //                 </div>
// // // //                 <div style={calendarStyles.weekdays}>
// // // //                     {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} style={calendarStyles.weekday}>{day}</div>)}
// // // //                 </div>
// // // //                 <div style={calendarStyles.days}>
// // // //                     {days.map((date, idx) => (
// // // //                         <div
// // // //                             key={idx}
// // // //                             onClick={() => date && onSelect(date)}
// // // //                             style={{
// // // //                                 ...calendarStyles.day,
// // // //                                 ...(date ? calendarStyles.dayCell : {}),
// // // //                                 ...(date && currentDate && isSameDay(date, currentDate) ? calendarStyles.selected : {}),
// // // //                                 ...(date && isSameDay(date, new Date()) && (!currentDate || !isSameDay(date, currentDate)) ? calendarStyles.today : {})
// // // //                             }}
// // // //                         >
// // // //                             {date ? date.getDate() : ''}
// // // //                         </div>
// // // //                     ))}
// // // //                 </div>
// // // //             </div>
// // // //         );
// // // //     };

// // // //     const calendarStyles = {
// // // //         container: {
// // // //             position: 'absolute',
// // // //             top: '100%',
// // // //             left: 0,
// // // //             background: 'white',
// // // //             border: '1px solid #ddd',
// // // //             borderRadius: '8px',
// // // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // // //             padding: '12px',
// // // //             zIndex: 9999,
// // // //             marginTop: '4px',
// // // //             width: '280px',
// // // //             backgroundColor: 'white'
// // // //         },
// // // //         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
// // // //         navButton: {
// // // //             background: 'none',
// // // //             border: 'none',
// // // //             fontSize: '16px',
// // // //             cursor: 'pointer',
// // // //             padding: '4px 8px',
// // // //             borderRadius: '4px',
// // // //             color: '#666',
// // // //             transition: 'background 0.2s'
// // // //         },
// // // //         monthYear: { fontWeight: 'bold', fontSize: '14px' },
// // // //         weekdays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' },
// // // //         weekday: { textAlign: 'center', fontSize: '11px', color: '#666', padding: '4px' },
// // // //         days: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' },
// // // //         dayCell: {
// // // //             textAlign: 'center',
// // // //             padding: '6px',
// // // //             fontSize: '12px',
// // // //             cursor: 'pointer',
// // // //             borderRadius: '4px',
// // // //             transition: 'background 0.2s',
// // // //             backgroundColor: 'white',
// // // //             color: '#333',
// // // //             ':hover': {
// // // //                 backgroundColor: '#f0f0f0'
// // // //             }
// // // //         },
// // // //         day: { color: '#333' },
// // // //         selected: {
// // // //             backgroundColor: '#4CAF50',
// // // //             color: 'white',
// // // //             fontWeight: 'bold'
// // // //         },
// // // //         today: {
// // // //             border: '1px solid #4CAF50',
// // // //             fontWeight: 'bold',
// // // //             backgroundColor: '#e8f5e9'
// // // //         }
// // // //     };

// // // //     const styles = {
// // // //         container: { padding: '16px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' },
// // // //         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' },
// // // //         headerTitle: { margin: 0, fontSize: '20px', fontWeight: '600' },
// // // //         buttonGroup: { display: 'flex', gap: '8px' },
// // // //         buttonPrimary: { padding: '6px 14px', background: 'white', color: '#667eea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
// // // //         buttonSuccess: { padding: '6px 14px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
// // // //         card: { background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
// // // //         row: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
// // // //         formGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px' },
// // // //         formGroupSearch: { flex: 2, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '300px' },
// // // //         label: { fontSize: '11px', fontWeight: '500', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
// // // //         dateInputWrapper: { position: 'relative', width: '100%' },
// // // //         input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
// // // //         searchInput: { padding: '8px 12px 8px 36px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
// // // //         searchIcon: { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '16px' },
// // // //         calendarIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', cursor: 'pointer', fontSize: '16px' },
// // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
// // // //         tableHeader: { background: '#f5f5f5', borderBottom: '2px solid #e0e0e0', fontWeight: '600' },
// // // //         tableCell: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' },
// // // //         tableCellRight: { padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' },
// // // //         tableCellCenter: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' },
// // // //         actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', fontSize: '16px', color: '#2196F3', transition: 'all 0.2s' },
// // // //         tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' },
// // // //         tab: { padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', border: 'none', background: 'none', color: '#666', transition: 'all 0.2s' },
// // // //         activeTab: { color: '#4CAF50', borderBottom: '2px solid #4CAF50', marginBottom: '-2px' },
// // // //         loadingOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
// // // //         loadingSpinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #4CAF50', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' },
// // // //         searchWrapper: { position: 'relative', width: '100%' }
// // // //     };

// // // //     if (loading) {
// // // //         return (
// // // //             <div style={styles.loadingOverlay}>
// // // //                 <div style={styles.loadingSpinner}></div>
// // // //             </div>
// // // //         );
// // // //     }

// // // //     return (
// // // //         <div style={styles.container}>
// // // //             <div style={styles.header}>
// // // //                 <h1 style={styles.headerTitle}>📊 Sales Reports</h1>
// // // //                 <div style={styles.buttonGroup}>
// // // //                     <button onClick={generateAllCustomersPDF} style={styles.buttonSuccess}>
// // // //                         <FiPrinter size={14} /> Print All Report
// // // //                     </button>
// // // //                 </div>
// // // //             </div>

// // // //             {/* Tabs */}
// // // //             <div style={styles.tabContainer}>
// // // //                 <button
// // // //                     onClick={() => {
// // // //                         setActiveTab('customer');
// // // //                         setSearchTerm('');
// // // //                     }}
// // // //                     style={{ ...styles.tab, ...(activeTab === 'customer' ? styles.activeTab : {}) }}
// // // //                 >
// // // //                     <FiUser size={14} style={{ marginRight: '6px' }} /> Customer Summary
// // // //                 </button>
// // // //                 <button
// // // //                     onClick={() => {
// // // //                         setActiveTab('item');
// // // //                         setSearchTerm('');
// // // //                     }}
// // // //                     style={{ ...styles.tab, ...(activeTab === 'item' ? styles.activeTab : {}) }}
// // // //                 >
// // // //                     <FiPackage size={14} style={{ marginRight: '6px' }} /> Item Summary
// // // //                 </button>
// // // //             </div>

// // // //             {/* Date Picker and Search */}
// // // //             <div style={styles.card}>
// // // //                 <div style={styles.row}>
// // // //                     <div style={styles.formGroup}>
// // // //                         <label style={styles.label}>SELECT DATE</label>
// // // //                         <div style={styles.dateInputWrapper}>
// // // //                             <input
// // // //                                 ref={dateInputRef}
// // // //                                 type="text"
// // // //                                 placeholder="DD/MM/YYYY"
// // // //                                 value={tempDate}
// // // //                                 onChange={(e) => handleDateInputChange(e.target.value)}
// // // //                                 onFocus={() => setShowDatePicker(true)}
// // // //                                 onBlur={handleDateBlur}
// // // //                                 style={styles.input}
// // // //                             />
// // // //                             <FiCalendar
// // // //                                 style={styles.calendarIcon}
// // // //                                 onClick={(e) => {
// // // //                                     e.preventDefault();
// // // //                                     e.stopPropagation();
// // // //                                     setShowDatePicker(!showDatePicker);
// // // //                                 }}
// // // //                             />
// // // //                             {showDatePicker && (
// // // //                                 <DatePickerCalendar
// // // //                                     currentDate={new Date(selectedDate)}
// // // //                                     onSelect={handleDateSelect}
// // // //                                 />
// // // //                             )}
// // // //                         </div>
// // // //                     </div>
// // // //                     <div style={styles.formGroupSearch}>
// // // //                         <label style={styles.label}>
// // // //                             {activeTab === 'customer' ? 'SEARCH CUSTOMER' : 'SEARCH ITEM'}
// // // //                         </label>
// // // //                         <div style={styles.searchWrapper}>
// // // //                             <FiSearch style={styles.searchIcon} />
// // // //                             <input
// // // //                                 type="text"
// // // //                                 placeholder={activeTab === 'customer' ? "Search by customer name..." : "Search by item name..."}
// // // //                                 value={searchTerm}
// // // //                                 onChange={(e) => setSearchTerm(e.target.value)}
// // // //                                 style={styles.searchInput}
// // // //                             />
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>
// // // //             </div>

// // // //             {/* Customer Summary Table */}
// // // //             {activeTab === 'customer' && (
// // // //                 <div style={styles.card}>
// // // //                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
// // // //                         📋 Customer Summary
// // // //                         {searchTerm && ` (Filtered: ${filteredCustomerSummary.length} of ${customerSummary.length})`}
// // // //                     </h3>
// // // //                     <div style={{ overflowX: 'auto' }}>
// // // //                         <table style={styles.table}>
// // // //                             <thead>
// // // //                                 <tr style={styles.tableHeader}>
// // // //                                     <th style={styles.tableCell}>#</th>
// // // //                                     <th style={styles.tableCell}>Customer Name</th>
// // // //                                     <th style={styles.tableCellRight}>Total Amount</th>
// // // //                                     <th style={styles.tableCell}>Date</th>
// // // //                                     <th style={styles.tableCellCenter}>Actions</th>
// // // //                                 </tr>
// // // //                             </thead>
// // // //                             <tbody>
// // // //                                 {filteredCustomerSummary.length === 0 ? (
// // // //                                     <tr>
// // // //                                         <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
// // // //                                             {searchTerm ? 'No matching customers found' : 'No data found for selected date'}
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 ) : (
// // // //                                     filteredCustomerSummary.map((customer) => (
// // // //                                         <tr key={customer.sr_no}>
// // // //                                             <td style={styles.tableCell}>{customer.sr_no}</td>
// // // //                                             <td style={styles.tableCell}>
// // // //                                                 <strong>{customer.customer_name}</strong>
// // // //                                                 {customer.customer_name_urdu && (
// // // //                                                     <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif" }}>
// // // //                                                         {customer.customer_name_urdu}
// // // //                                                     </div>
// // // //                                                 )}
// // // //                                             </td>
// // // //                                             <td style={styles.tableCellRight}>
// // // //                                                 <strong style={{ color: '#4CAF50' }}>₨ {customer.total_amount.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                             <td style={styles.tableCell}>{formatDateForDisplay(customer.invoice_date)}</td>
// // // //                                             <td style={styles.tableCellCenter}>
// // // //                                                 <button
// // // //                                                     onClick={() => generateSingleCustomerPDF(customer)}
// // // //                                                     style={styles.actionButton}
// // // //                                                     title="Print Report"
// // // //                                                 >
// // // //                                                     <FiFileText size={18} />
// // // //                                                 </button>
// // // //                                             </td>
// // // //                                         </tr>
// // // //                                     ))
// // // //                                 )}
// // // //                             </tbody>
// // // //                             {filteredCustomerSummary.length > 0 && (
// // // //                                 <tfoot>
// // // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // // //                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
// // // //                                         <td style={styles.tableCellRight}>
// // // //                                             <strong style={{ color: '#4CAF50' }}>
// // // //                                                 ₨ {filteredCustomerSummary.reduce((sum, c) => sum + c.total_amount, 0).toLocaleString()}
// // // //                                             </strong>
// // // //                                         </td>
// // // //                                         <td colSpan="2"></td>
// // // //                                     </tr>
// // // //                                 </tfoot>
// // // //                             )}
// // // //                         </table>
// // // //                     </div>
// // // //                 </div>
// // // //             )}

// // // //             {/* Item Wise Summary Table */}
// // // //             {activeTab === 'item' && (
// // // //                 <div style={styles.card}>
// // // //                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
// // // //                         📦 Item Summary
// // // //                         {searchTerm && ` (Filtered: ${filteredItemSummary.length} of ${itemWiseSummary.length})`}
// // // //                     </h3>
// // // //                     <div style={{ overflowX: 'auto' }}>
// // // //                         <table style={styles.table}>
// // // //                             <thead>
// // // //                                 <tr style={styles.tableHeader}>
// // // //                                     <th style={styles.tableCell}>#</th>
// // // //                                     <th style={styles.tableCell}>Item Name</th>
// // // //                                     <th style={styles.tableCellRight}>Quantity</th>
// // // //                                     <th style={styles.tableCellRight}>Total Amount</th>
// // // //                                 </tr>
// // // //                             </thead>
// // // //                             <tbody>
// // // //                                 {filteredItemSummary.length === 0 ? (
// // // //                                     <tr>
// // // //                                         <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
// // // //                                             {searchTerm ? 'No matching items found' : 'No items found for selected date'}
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 ) : (
// // // //                                     filteredItemSummary.map((item) => (
// // // //                                         <tr key={item.sr_no}>
// // // //                                             <td style={styles.tableCell}>{item.sr_no}</td>
// // // //                                             <td style={styles.tableCell}>
// // // //                                                 <div>{item.item_name}</div>
// // // //                                                 {item.item_name_urdu && (
// // // //                                                     <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif", marginTop: '4px' }}>
// // // //                                                         {item.item_name_urdu}
// // // //                                                     </div>
// // // //                                                 )}
// // // //                                             </td>
// // // //                                             <td style={styles.tableCellRight}>
// // // //                                                 <strong>{item.total_quantity.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                             <td style={styles.tableCellRight}>
// // // //                                                 <strong style={{ color: '#4CAF50' }}>₨ {item.total_amount.toLocaleString()}</strong>
// // // //                                             </td>
// // // //                                         </tr>
// // // //                                     ))
// // // //                                 )}
// // // //                             </tbody>
// // // //                             {filteredItemSummary.length > 0 && (
// // // //                                 <tfoot>
// // // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // // //                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
// // // //                                         <td style={styles.tableCellRight}>
// // // //                                             <strong>{filteredItemSummary.reduce((sum, i) => sum + (i.total_quantity || 0), 0).toLocaleString()}</strong>
// // // //                                         </td>
// // // //                                         <td style={styles.tableCellRight}>
// // // //                                             <strong style={{ color: '#4CAF50' }}>
// // // //                                                 ₨ {filteredItemSummary.reduce((sum, i) => sum + (i.total_amount || 0), 0).toLocaleString()}
// // // //                                             </strong>
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 </tfoot>
// // // //                             )}
// // // //                         </table>
// // // //                     </div>
// // // //                 </div>
// // // //             )}

// // // //             <style>{`
// // // //                 @keyframes spin {
// // // //                     0% { transform: rotate(0deg); }
// // // //                     100% { transform: rotate(360deg); }
// // // //                 }
// // // //             `}</style>
// // // //         </div>
// // // //     );
// // // // }

// // // // export default Reports;

// // // import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
// // // import { toast } from 'react-hot-toast';
// // // import { FiPrinter, FiCalendar, FiFileText, FiUser, FiPackage, FiSearch } from 'react-icons/fi';
// // // import { NavigationContext } from '../App';

// // // function Reports() {
// // //     const { goBack } = useContext(NavigationContext);
// // //     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
// // //     const [invoices, setInvoices] = useState([]);
// // //     const [loading, setLoading] = useState(false);
// // //     const [customerSummary, setCustomerSummary] = useState([]);
// // //     const [itemWiseSummary, setItemWiseSummary] = useState([]);
// // //     const [tempDate, setTempDate] = useState('');
// // //     const [showDatePicker, setShowDatePicker] = useState(false);
// // //     const [activeTab, setActiveTab] = useState('customer');
// // //     const [searchTerm, setSearchTerm] = useState('');

// // //     const dateInputRef = useRef(null);
// // //     const datePickerRef = useRef(null);
// // //     const isInitialMount = useRef(true);

// // //     useEffect(() => {
// // //         loadData();

// // //         // Handle click outside to close date picker
// // //         const handleClickOutside = (event) => {
// // //             if (datePickerRef.current && !datePickerRef.current.contains(event.target) &&
// // //                 dateInputRef.current && !dateInputRef.current.contains(event.target)) {
// // //                 setShowDatePicker(false);
// // //             }
// // //         };

// // //         document.addEventListener('mousedown', handleClickOutside);
// // //         return () => {
// // //             document.removeEventListener('mousedown', handleClickOutside);
// // //         };
// // //     }, []);

// // //     // Set initial temp date when selectedDate changes
// // //     useEffect(() => {
// // //         if (selectedDate) {
// // //             const displayDate = formatDateForDisplay(selectedDate);
// // //             setTempDate(displayDate);
// // //         }
// // //     }, [selectedDate]);

// // //     // Auto fetch when selectedDate changes (skip initial mount if needed)
// // //     useEffect(() => {
// // //         if (isInitialMount.current) {
// // //             isInitialMount.current = false;
// // //             // Load summaries after invoices are loaded
// // //             if (invoices.length > 0) {
// // //                 loadSummaries();
// // //             }
// // //         } else if (selectedDate && invoices.length > 0) {
// // //             loadSummaries();
// // //         }
// // //     }, [selectedDate, invoices]);

// // //     const loadData = async () => {
// // //         try {
// // //             const invoicesData = await window.electron.database.getInvoices();
// // //             setInvoices(invoicesData || []);
// // //         } catch (error) {
// // //             console.error('Failed to load data:', error);
// // //             toast.error('Failed to load data');
// // //         }
// // //     };

// // //     const loadSummaries = useCallback(async () => {
// // //         if (!selectedDate) return;

// // //         setLoading(true);
// // //         try {
// // //             const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();

// // //             // Filter invoices by selected date (exact match)
// // //             const filteredInvoices = allInvoices.filter(inv => {
// // //                 const invDate = inv.invoice_date;
// // //                 return invDate === selectedDate;
// // //             });

// // //             console.log('Selected Date:', selectedDate);
// // //             console.log('Filtered Invoices:', filteredInvoices.length);

// // //             // Group by customer for customer summary
// // //             const customerMap = new Map();
// // //             for (const invoice of filteredInvoices) {
// // //                 const customerName = invoice.customer_name;
// // //                 if (!customerMap.has(customerName)) {
// // //                     let customerUrduName = '';
// // //                     if (invoice.account_id) {
// // //                         try {
// // //                             const account = await window.electron.database.getAccountById(invoice.account_id);
// // //                             customerUrduName = account?.customer_name_urdu || '';
// // //                         } catch (err) {
// // //                             console.error('Error fetching account:', err);
// // //                         }
// // //                     }
// // //                     customerMap.set(customerName, {
// // //                         customer_name: customerName,
// // //                         customer_name_urdu: customerUrduName,
// // //                         total_amount: 0,
// // //                         invoice_date: invoice.invoice_date,
// // //                         invoice_id: invoice.invoice_id,
// // //                         voucher_id: invoice.voucher_id
// // //                     });
// // //                 }
// // //                 const customer = customerMap.get(customerName);
// // //                 customer.total_amount += invoice.net_amount || 0;
// // //                 if (invoice.invoice_date > customer.invoice_date) {
// // //                     customer.invoice_date = invoice.invoice_date;
// // //                     customer.invoice_id = invoice.invoice_id;
// // //                     customer.voucher_id = invoice.voucher_id;
// // //                 }
// // //             }

// // //             const customerList = Array.from(customerMap.values()).map((customer, index) => ({
// // //                 sr_no: index + 1,
// // //                 ...customer
// // //             }));
// // //             setCustomerSummary(customerList);

// // //             // Calculate item summary from invoice details
// // //             const itemsMap = new Map();

// // //             for (const invoice of filteredInvoices) {
// // //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // //                 console.log(`Invoice ${invoice.invoice_id} details:`, details.length);

// // //                 for (const item of details) {
// // //                     const itemId = item.item_id;
// // //                     const itemKey = itemId || item.item_name;

// // //                     if (!itemsMap.has(itemKey)) {
// // //                         let itemNameUrdu = item.item_name_urdu || '';
// // //                         if (itemId && !itemNameUrdu) {
// // //                             try {
// // //                                 const product = await window.electron.database.getProductById(itemId);
// // //                                 itemNameUrdu = product?.item_name_urdu || '';
// // //                             } catch (err) {
// // //                                 console.error('Error fetching product:', err);
// // //                             }
// // //                         }
// // //                         itemsMap.set(itemKey, {
// // //                             item_name: item.item_name,
// // //                             item_name_urdu: itemNameUrdu,
// // //                             total_quantity: 0,
// // //                             total_amount: 0
// // //                         });
// // //                     }
// // //                     const itemData = itemsMap.get(itemKey);
// // //                     itemData.total_quantity += parseFloat(item.quantity) || 0;
// // //                     itemData.total_amount += parseFloat(item.amount) || 0;
// // //                 }
// // //             }

// // //             const itemList = Array.from(itemsMap.values()).map((item, index) => ({
// // //                 sr_no: index + 1,
// // //                 item_name: item.item_name,
// // //                 item_name_urdu: item.item_name_urdu,
// // //                 total_quantity: item.total_quantity,
// // //                 total_amount: item.total_amount
// // //             }));

// // //             console.log('Calculated Item Summary:', itemList.length);
// // //             setItemWiseSummary(itemList);

// // //             if (filteredInvoices.length === 0 && !isInitialMount.current) {
// // //                 toast.error('No invoices found for selected date');
// // //             }

// // //         } catch (error) {
// // //             console.error('Failed to load summaries:', error);
// // //             toast.error('Failed to load summaries: ' + error.message);
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     }, [selectedDate, invoices]);

// // //     // Filtered data based on search term
// // //     const filteredCustomerSummary = useMemo(() => {
// // //         if (!searchTerm.trim()) return customerSummary;
// // //         const searchLower = searchTerm.toLowerCase();
// // //         return customerSummary.filter(customer =>
// // //             customer.customer_name.toLowerCase().includes(searchLower) ||
// // //             (customer.customer_name_urdu && customer.customer_name_urdu.includes(searchTerm))
// // //         );
// // //     }, [customerSummary, searchTerm]);

// // //     const filteredItemSummary = useMemo(() => {
// // //         if (!searchTerm.trim()) return itemWiseSummary;
// // //         const searchLower = searchTerm.toLowerCase();
// // //         return itemWiseSummary.filter(item =>
// // //             item.item_name.toLowerCase().includes(searchLower) ||
// // //             (item.item_name_urdu && item.item_name_urdu.includes(searchTerm))
// // //         );
// // //     }, [itemWiseSummary, searchTerm]);

// // //     const formatDateForDisplay = (dateString) => {
// // //         if (!dateString) return '';
// // //         const date = new Date(dateString);
// // //         if (isNaN(date.getTime())) return '';
// // //         const day = String(date.getDate()).padStart(2, '0');
// // //         const month = String(date.getMonth() + 1).padStart(2, '0');
// // //         const year = date.getFullYear();
// // //         return `${day}/${month}/${year}`;
// // //     };

// // //     const formatDateForStorage = (dateStr) => {
// // //         if (!dateStr) return null;
// // //         const parts = dateStr.split('/');
// // //         if (parts.length === 3) {
// // //             const day = parseInt(parts[0], 10);
// // //             const month = parseInt(parts[1], 10);
// // //             const year = parseInt(parts[2], 10);
// // //             if (!isNaN(day) && !isNaN(month) && !isNaN(year) &&
// // //                 day >= 1 && day <= 31 && month >= 1 && month <= 12 && year.toString().length === 4) {
// // //                 return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
// // //             }
// // //         }
// // //         return null;
// // //     };

// // //     const handleDateInputChange = (value) => {
// // //         setTempDate(value);
// // //         let formatted = value.replace(/[^0-9]/g, '');
// // //         if (formatted.length >= 2 && formatted.length < 4) {
// // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
// // //         } else if (formatted.length >= 4 && formatted.length < 6) {
// // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4);
// // //         } else if (formatted.length >= 6) {
// // //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4, 8);
// // //         }
// // //         setTempDate(formatted);

// // //         if (formatted.length === 10) {
// // //             const storageDate = formatDateForStorage(formatted);
// // //             if (storageDate) {
// // //                 setSelectedDate(storageDate);
// // //             }
// // //         }
// // //     };

// // //     const handleDateBlur = () => {
// // //         if (tempDate.length === 10) {
// // //             const storageDate = formatDateForStorage(tempDate);
// // //             if (storageDate) {
// // //                 setSelectedDate(storageDate);
// // //             } else {
// // //                 const currentDate = new Date();
// // //                 const storageDate = currentDate.toISOString().split('T')[0];
// // //                 setSelectedDate(storageDate);
// // //                 toast.error('Invalid date format. Using current date.');
// // //             }
// // //         } else if (tempDate && tempDate.length > 0) {
// // //             const currentDate = new Date();
// // //             const storageDate = currentDate.toISOString().split('T')[0];
// // //             setSelectedDate(storageDate);
// // //             toast.error('Invalid date. Using current date.');
// // //         }
// // //         setShowDatePicker(false);
// // //     };

// // //     const handleDateSelect = useCallback((date) => {
// // //         const year = date.getFullYear();
// // //         const month = String(date.getMonth() + 1).padStart(2, '0');
// // //         const day = String(date.getDate()).padStart(2, '0');
// // //         const storageDate = `${year}-${month}-${day}`;
// // //         console.log('Selected date from calendar:', storageDate);
// // //         setSelectedDate(storageDate);
// // //         setShowDatePicker(false);
// // //     }, []);

// // //     // New function to open PDF directly in browser
// // //     const openPDFInBrowser = async (html) => {
// // //         try {
// // //             // Use the printToPDFWithoutSave function from electron
// // //             if (window.electron && window.electron.printToPDFAndOpen) {
// // //                 const pdfData = await window.electron.printToPDFAndOpen(html);
// // //                 if (pdfData) {
// // //                     toast.success('PDF opened successfully');
// // //                 } else {
// // //                     toast.error('Failed to generate PDF');
// // //                 }
// // //             } else {
// // //                 // Fallback: Open in new window and print
// // //                 const printWindow = window.open('', '_blank');
// // //                 printWindow.document.write(html);
// // //                 printWindow.document.close();
// // //                 printWindow.print();
// // //                 toast.success('Print dialog opened');
// // //             }
// // //         } catch (error) {
// // //             console.error('Error opening PDF:', error);
// // //             toast.error('Failed to open PDF');
// // //         }
// // //     };

// // //     const generateReportHTML = async (singleCustomer = null) => {
// // //         try {
// // //             const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();
// // //             const filteredInvoices = allInvoices.filter(inv => {
// // //                 const invDate = inv.invoice_date;
// // //                 return invDate === selectedDate;
// // //             });

// // //             let customerGroups = {};

// // //             if (singleCustomer) {
// // //                 const customerInvoices = filteredInvoices.filter(inv => inv.customer_name === singleCustomer.customer_name);

// // //                 for (const invoice of customerInvoices) {
// // //                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // //                     const enrichedDetails = await Promise.all(details.map(async (item) => {
// // //                         if (item.item_id) {
// // //                             try {
// // //                                 const product = await window.electron.database.getProductById(item.item_id);
// // //                                 return {
// // //                                     ...item,
// // //                                     item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
// // //                                 };
// // //                             } catch (err) {
// // //                                 return item;
// // //                             }
// // //                         }
// // //                         return item;
// // //                     }));

// // //                     const customerKey = invoice.customer_name;
// // //                     if (!customerGroups[customerKey]) {
// // //                         customerGroups[customerKey] = {
// // //                             customerName: invoice.customer_name,
// // //                             customerNameUrdu: singleCustomer.customer_name_urdu || '',
// // //                             customerId: invoice.account_id,
// // //                             invoices: [],
// // //                             totalItems: 0,
// // //                             totalAmount: 0,
// // //                             discount: 0,
// // //                             netAmount: 0
// // //                         };
// // //                     }

// // //                     customerGroups[customerKey].invoices.push({
// // //                         ...invoice,
// // //                         details: enrichedDetails
// // //                     });
// // //                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
// // //                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
// // //                     customerGroups[customerKey].discount += invoice.discount || 0;
// // //                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
// // //                 }
// // //             } else {
// // //                 for (const invoice of filteredInvoices) {
// // //                     let customerUrduName = '';
// // //                     if (invoice.account_id) {
// // //                         try {
// // //                             const account = await window.electron.database.getAccountById(invoice.account_id);
// // //                             customerUrduName = account?.customer_name_urdu || '';
// // //                         } catch (err) {
// // //                             console.error('Error fetching account:', err);
// // //                         }
// // //                     }

// // //                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// // //                     const enrichedDetails = await Promise.all(details.map(async (item) => {
// // //                         if (item.item_id) {
// // //                             try {
// // //                                 const product = await window.electron.database.getProductById(item.item_id);
// // //                                 return {
// // //                                     ...item,
// // //                                     item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
// // //                                 };
// // //                             } catch (err) {
// // //                                 return item;
// // //                             }
// // //                         }
// // //                         return item;
// // //                     }));

// // //                     const customerKey = invoice.customer_name;
// // //                     if (!customerGroups[customerKey]) {
// // //                         customerGroups[customerKey] = {
// // //                             customerName: invoice.customer_name,
// // //                             customerNameUrdu: customerUrduName,
// // //                             customerId: invoice.account_id,
// // //                             invoices: [],
// // //                             totalItems: 0,
// // //                             totalAmount: 0,
// // //                             discount: 0,
// // //                             netAmount: 0
// // //                         };
// // //                     } else if (customerUrduName && !customerGroups[customerKey].customerNameUrdu) {
// // //                         customerGroups[customerKey].customerNameUrdu = customerUrduName;
// // //                     }

// // //                     customerGroups[customerKey].invoices.push({
// // //                         ...invoice,
// // //                         details: enrichedDetails
// // //                     });
// // //                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
// // //                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
// // //                     customerGroups[customerKey].discount += invoice.discount || 0;
// // //                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
// // //                 }
// // //             }

// // //             // Prepare items summary per customer
// // //             const customerItemsSummary = {};
// // //             for (const [customerName, customerData] of Object.entries(customerGroups)) {
// // //                 const itemsSummary = {};
// // //                 for (const invoice of customerData.invoices) {
// // //                     for (const item of invoice.details) {
// // //                         const itemKey = item.item_id || item.item_name;
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
// // //                 for (const item of Object.values(itemsSummary)) {
// // //                     item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
// // //                 }
// // //                 customerItemsSummary[customerName] = Object.values(itemsSummary);
// // //             }

// // //             const formattedDate = formatDateForDisplay(selectedDate);

// // //             const html = `
// // //                 <!DOCTYPE html>
// // //                 <html>
// // //                 <head>
// // //                     <meta charset="UTF-8">
// // //                     <title>Sales Report ${formattedDate}</title>
// // //                     <style>
// // //                         * {
// // //                             margin: 0;
// // //                             padding: 0;
// // //                             box-sizing: border-box;
// // //                         }

// // //                         body {
// // //                             font-family: 'Segoe UI', 'Arial', sans-serif;
// // //                             padding: 40px;
// // //                             background: white;
// // //                             color: #333;
// // //                         }

// // //                         .report-container {
// // //                             max-width: 1200px;
// // //                             margin: 0 auto;
// // //                         }

// // //                         .header {
// // //                             text-align: center;
// // //                             margin-bottom: 40px;
// // //                             padding-bottom: 20px;
// // //                             border-bottom: 3px solid #4CAF50;
// // //                         }

// // //                         .company-name {
// // //                             font-size: 28px;
// // //                             font-weight: bold;
// // //                             color: #2c3e50;
// // //                             margin-bottom: 10px;
// // //                         }

// // //                         .report-title {
// // //                             font-size: 24px;
// // //                             font-weight: bold;
// // //                             color: #4CAF50;
// // //                             margin: 10px 0;
// // //                         }

// // //                         .date-range {
// // //                             font-size: 14px;
// // //                             color: #666;
// // //                             margin-top: 10px;
// // //                         }

// // //                         .customer-section {
// // //                             margin-bottom: 50px;
// // //                             page-break-after: always;
// // //                         }

// // //                         .customer-section:last-child {
// // //                             page-break-after: auto;
// // //                         }

// // //                         .customer-header {
// // //                             text-align: center;
// // //                             margin-bottom: 20px;
// // //                             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // //                             border-radius: 12px;
// // //                             overflow: hidden;
// // //                             box-shadow: 0 4px 15px rgba(0,0,0,0.1);
// // //                         }

// // //                         .customer-name {
// // //                             font-size: 32px;
// // //                             font-weight: bold;
// // //                             color: white;
// // //                             padding: 20px;
// // //                             margin: 0;
// // //                             text-align: center;
// // //                             font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;
// // //                             text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
// // //                         }

// // //                         .customer-date {
// // //                             font-size: 14px;
// // //                             color: rgba(255,255,255,0.9);
// // //                             padding: 10px 20px;
// // //                             background: rgba(0,0,0,0.1);
// // //                             text-align: center;
// // //                         }

// // //                         .items-table {
// // //                             width: 100%;
// // //                             border-collapse: collapse;
// // //                             margin-top: 20px;
// // //                             box-shadow: 0 2px 8px rgba(0,0,0,0.05);
// // //                         }

// // //                         .items-table th {
// // //                             background: #4CAF50;
// // //                             color: white;
// // //                             border: 1px solid #ddd;
// // //                             padding: 14px;
// // //                             text-align: center;
// // //                             font-size: 16px;
// // //                             font-weight: bold;
// // //                         }

// // //                         .items-table td {
// // //                             border: 1px solid #ddd;
// // //                             padding: 12px;
// // //                             text-align: center;
// // //                             font-size: 14px;
// // //                         }

// // //                         .total-row {
// // //                             background: #f9f9f9;
// // //                             font-weight: bold;
// // //                             border-top: 2px solid #4CAF50;
// // //                         }

// // //                         .total-row td {
// // //                             font-weight: bold;
// // //                             font-size: 16px;
// // //                             padding: 14px;
// // //                         }

// // //                         .footer {
// // //                             margin-top: 40px;
// // //                             padding-top: 20px;
// // //                             text-align: center;
// // //                             border-top: 1px solid #e0e0e0;
// // //                             font-size: 12px;
// // //                             color: #999;
// // //                         }

// // //                         .footer-developer {
// // //                             font-size: 14px;
// // //                             color: #4CAF50;
// // //                             margin-top: 10px;
// // //                             font-weight: bold;
// // //                         }
// // //                     </style>
// // //                 </head>
// // //                 <body>
// // //                     <div class="report-container">
// // //                         <div class="header">
// // //                             <div class="company-name">INVENTORY MANAGEMENT SYSTEM</div>
// // //                             <div class="report-title">SALES REPORT</div>
// // //                             <div class="date-range">Date: ${formattedDate}</div>
// // //                         </div>

// // //                         ${Object.entries(customerGroups).map(([customerName, customerData]) => {
// // //                 const itemsSummary = customerItemsSummary[customerName] || [];
// // //                 const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
// // //                 const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);
// // //                 const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
// // //                 const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());
// // //                 const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== ''
// // //                     ? customerData.customerNameUrdu
// // //                     : customerData.customerName;

// // //                 return `
// // //                             <div class="customer-section">
// // //                                 <div class="customer-header">
// // //                                     <div class="customer-name" style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// // //                                         ${displayCustomerName}
// // //                                     </div>
// // //                                     <div class="customer-date">
// // //                                         Date: ${invoiceDate}
// // //                                     </div>
// // //                                 </div>

// // //                                 <table class="items-table">
// // //                                     <thead>
// // //                                         <tr>
// // //                                             <th>#</th>
// // //                                             <th>Item</th>
// // //                                             <th>Quantity</th>
// // //                                             <th>Rate</th>
// // //                                             <th>Amount</th>
// // //                                         </thead>
// // //                                     <tbody>
// // //                                         ${itemsSummary.map((item, idx) => {
// // //                     const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
// // //                         ? item.itemNameUrdu
// // //                         : item.itemName;

// // //                     return `
// // //                                                 <tr>
// // //                                                     <td>${idx + 1}</td>
// // //                                                     <td style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// // //                                                         ${displayItemName}
// // //                                                     </td>
// // //                                                     <td>${item.totalQuantity.toLocaleString()}</td>
// // //                                                     <td>${Math.round(item.avgRate).toLocaleString()}</td>
// // //                                                     <td style="color: #4CAF50; font-weight: bold;">
// // //                                                         ${item.totalAmount.toLocaleString()}
// // //                                                     </td>
// // //                                                 </tr>
// // //                                             `;
// // //                 }).join('')}
// // //                                         <tr class="total-row">
// // //                                             <td colspan="2"><strong>GRAND TOTAL</strong></td>
// // //                                             <td><strong>${totalItems.toLocaleString()}</strong></td>
// // //                                             <td>-</td>
// // //                                             <td style="color: #4CAF50; font-size: 18px;">
// // //                                                 <strong>${totalAmount.toLocaleString()}</strong>
// // //                                             </td>
// // //                                         </tr>
// // //                                     </tbody>
// // //                                 </table>
// // //                             </div>
// // //                         `;
// // //             }).join('')}

// // //                         <div class="footer">
// // //                             <p>This report was generated by Inventory Management System</p>
// // //                             <p class="footer-developer">Developed By Ultimate Solutions</p>
// // //                             <p>${new Date().toLocaleString()}</p>
// // //                         </div>
// // //                     </div>
// // //                 </body>
// // //                 </html>
// // //             `;

// // //             return html;
// // //         } catch (error) {
// // //             console.error('Error generating report HTML:', error);
// // //             toast.error('Failed to generate report');
// // //             return null;
// // //         }
// // //     };

// // //     const generateAllCustomersPDF = async () => {
// // //         setLoading(true);
// // //         try {
// // //             const html = await generateReportHTML();
// // //             if (html) {
// // //                 await openPDFInBrowser(html);
// // //             }
// // //         } catch (error) {
// // //             console.error('Error generating PDF:', error);
// // //             toast.error('Failed to generate PDF');
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     const generateSingleCustomerPDF = async (customer) => {
// // //         setLoading(true);
// // //         try {
// // //             const html = await generateReportHTML(customer);
// // //             if (html) {
// // //                 await openPDFInBrowser(html);
// // //             }
// // //         } catch (error) {
// // //             console.error('Error generating PDF:', error);
// // //             toast.error('Failed to generate PDF');
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     const DatePickerCalendar = ({ currentDate, onSelect }) => {
// // //         const [displayDate, setDisplayDate] = useState(() => {
// // //             // Initialize with currentDate or default to today
// // //             if (currentDate && !isNaN(currentDate.getTime())) {
// // //                 return new Date(currentDate);
// // //             }
// // //             return new Date();
// // //         });

// // //         // Update displayDate when currentDate prop changes
// // //         useEffect(() => {
// // //             if (currentDate && !isNaN(currentDate.getTime())) {
// // //                 setDisplayDate(new Date(currentDate));
// // //             }
// // //         }, [currentDate]);

// // //         const getDaysInMonth = (date) => {
// // //             const year = date.getFullYear();
// // //             const month = date.getMonth();
// // //             const firstDay = new Date(year, month, 1);
// // //             const lastDay = new Date(year, month + 1, 0);
// // //             const days = [];
// // //             const startOffset = firstDay.getDay();
// // //             for (let i = 0; i < startOffset; i++) days.push(null);
// // //             for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
// // //             return days;
// // //         };

// // //         const isSameDay = (date1, date2) => {
// // //             return date1 && date2 &&
// // //                 date1.getFullYear() === date2.getFullYear() &&
// // //                 date1.getMonth() === date2.getMonth() &&
// // //                 date1.getDate() === date2.getDate();
// // //         };

// // //         const days = getDaysInMonth(displayDate);
// // //         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// // //         const handlePrevMonth = () => {
// // //             setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
// // //         };

// // //         const handleNextMonth = () => {
// // //             setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
// // //         };

// // //         return (
// // //             <div ref={datePickerRef} style={calendarStyles.container}>
// // //                 <div style={calendarStyles.header}>
// // //                     <button
// // //                         onClick={handlePrevMonth}
// // //                         style={calendarStyles.navButton}
// // //                         type="button"
// // //                     >←</button>
// // //                     <span style={calendarStyles.monthYear}>{monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}</span>
// // //                     <button
// // //                         onClick={handleNextMonth}
// // //                         style={calendarStyles.navButton}
// // //                         type="button"
// // //                     >→</button>
// // //                 </div>
// // //                 <div style={calendarStyles.weekdays}>
// // //                     {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} style={calendarStyles.weekday}>{day}</div>)}
// // //                 </div>
// // //                 <div style={calendarStyles.days}>
// // //                     {days.map((date, idx) => (
// // //                         <div
// // //                             key={idx}
// // //                             onClick={() => date && onSelect(date)}
// // //                             style={{
// // //                                 ...calendarStyles.day,
// // //                                 ...(date ? calendarStyles.dayCell : {}),
// // //                                 ...(date && currentDate && isSameDay(date, currentDate) ? calendarStyles.selected : {}),
// // //                                 ...(date && isSameDay(date, new Date()) && (!currentDate || !isSameDay(date, currentDate)) ? calendarStyles.today : {})
// // //                             }}
// // //                         >
// // //                             {date ? date.getDate() : ''}
// // //                         </div>
// // //                     ))}
// // //                 </div>
// // //             </div>
// // //         );
// // //     };

// // //     const calendarStyles = {
// // //         container: {
// // //             position: 'absolute',
// // //             top: '100%',
// // //             left: 0,
// // //             background: 'white',
// // //             border: '1px solid #ddd',
// // //             borderRadius: '8px',
// // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // //             padding: '12px',
// // //             zIndex: 9999,
// // //             marginTop: '4px',
// // //             width: '280px',
// // //             backgroundColor: 'white'
// // //         },
// // //         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
// // //         navButton: {
// // //             background: 'none',
// // //             border: 'none',
// // //             fontSize: '16px',
// // //             cursor: 'pointer',
// // //             padding: '4px 8px',
// // //             borderRadius: '4px',
// // //             color: '#666',
// // //             transition: 'background 0.2s'
// // //         },
// // //         monthYear: { fontWeight: 'bold', fontSize: '14px' },
// // //         weekdays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' },
// // //         weekday: { textAlign: 'center', fontSize: '11px', color: '#666', padding: '4px' },
// // //         days: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' },
// // //         dayCell: {
// // //             textAlign: 'center',
// // //             padding: '6px',
// // //             fontSize: '12px',
// // //             cursor: 'pointer',
// // //             borderRadius: '4px',
// // //             transition: 'background 0.2s',
// // //             backgroundColor: 'white',
// // //             color: '#333',
// // //             ':hover': {
// // //                 backgroundColor: '#f0f0f0'
// // //             }
// // //         },
// // //         day: { color: '#333' },
// // //         selected: {
// // //             backgroundColor: '#4CAF50',
// // //             color: 'white',
// // //             fontWeight: 'bold'
// // //         },
// // //         today: {
// // //             border: '1px solid #4CAF50',
// // //             fontWeight: 'bold',
// // //             backgroundColor: '#e8f5e9'
// // //         }
// // //     };

// // //     const styles = {
// // //         container: { padding: '16px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' },
// // //         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' },
// // //         headerTitle: { margin: 0, fontSize: '20px', fontWeight: '600' },
// // //         buttonGroup: { display: 'flex', gap: '8px' },
// // //         buttonPrimary: { padding: '6px 14px', background: 'white', color: '#667eea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
// // //         buttonSuccess: { padding: '6px 14px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
// // //         card: { background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
// // //         row: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
// // //         formGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px' },
// // //         formGroupSearch: { flex: 2, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '300px' },
// // //         label: { fontSize: '11px', fontWeight: '500', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
// // //         dateInputWrapper: { position: 'relative', width: '100%' },
// // //         input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
// // //         searchInput: { padding: '8px 12px 8px 36px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
// // //         searchIcon: { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '16px' },
// // //         calendarIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', cursor: 'pointer', fontSize: '16px' },
// // //         table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
// // //         tableHeader: { background: '#f5f5f5', borderBottom: '2px solid #e0e0e0', fontWeight: '600' },
// // //         tableCell: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' },
// // //         tableCellRight: { padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' },
// // //         tableCellCenter: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' },
// // //         actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', fontSize: '16px', color: '#2196F3', transition: 'all 0.2s' },
// // //         tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' },
// // //         tab: { padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', border: 'none', background: 'none', color: '#666', transition: 'all 0.2s' },
// // //         activeTab: { color: '#4CAF50', borderBottom: '2px solid #4CAF50', marginBottom: '-2px' },
// // //         loadingOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
// // //         loadingSpinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #4CAF50', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' },
// // //         searchWrapper: { position: 'relative', width: '100%' }
// // //     };

// // //     if (loading) {
// // //         return (
// // //             <div style={styles.loadingOverlay}>
// // //                 <div style={styles.loadingSpinner}></div>
// // //             </div>
// // //         );
// // //     }

// // //     return (
// // //         <div style={styles.container}>
// // //             <div style={styles.header}>
// // //                 <h1 style={styles.headerTitle}>📊 Sales Reports</h1>
// // //                 <div style={styles.buttonGroup}>
// // //                     <button onClick={generateAllCustomersPDF} style={styles.buttonSuccess}>
// // //                         <FiPrinter size={14} /> Print All Report
// // //                     </button>
// // //                 </div>
// // //             </div>

// // //             {/* Tabs */}
// // //             <div style={styles.tabContainer}>
// // //                 <button
// // //                     onClick={() => {
// // //                         setActiveTab('customer');
// // //                         setSearchTerm('');
// // //                     }}
// // //                     style={{ ...styles.tab, ...(activeTab === 'customer' ? styles.activeTab : {}) }}
// // //                 >
// // //                     <FiUser size={14} style={{ marginRight: '6px' }} /> Customer Summary
// // //                 </button>
// // //                 <button
// // //                     onClick={() => {
// // //                         setActiveTab('item');
// // //                         setSearchTerm('');
// // //                     }}
// // //                     style={{ ...styles.tab, ...(activeTab === 'item' ? styles.activeTab : {}) }}
// // //                 >
// // //                     <FiPackage size={14} style={{ marginRight: '6px' }} /> Item Summary
// // //                 </button>
// // //             </div>

// // //             {/* Date Picker and Search */}
// // //             <div style={styles.card}>
// // //                 <div style={styles.row}>
// // //                     <div style={styles.formGroup}>
// // //                         <label style={styles.label}>SELECT DATE</label>
// // //                         <div style={styles.dateInputWrapper}>
// // //                             <input
// // //                                 ref={dateInputRef}
// // //                                 type="text"
// // //                                 placeholder="DD/MM/YYYY"
// // //                                 value={tempDate}
// // //                                 onChange={(e) => handleDateInputChange(e.target.value)}
// // //                                 onFocus={() => setShowDatePicker(true)}
// // //                                 onBlur={handleDateBlur}
// // //                                 style={styles.input}
// // //                             />
// // //                             <FiCalendar
// // //                                 style={styles.calendarIcon}
// // //                                 onClick={(e) => {
// // //                                     e.preventDefault();
// // //                                     e.stopPropagation();
// // //                                     setShowDatePicker(!showDatePicker);
// // //                                 }}
// // //                             />
// // //                             {showDatePicker && (
// // //                                 <DatePickerCalendar
// // //                                     currentDate={new Date(selectedDate)}
// // //                                     onSelect={handleDateSelect}
// // //                                 />
// // //                             )}
// // //                         </div>
// // //                     </div>
// // //                     <div style={styles.formGroupSearch}>
// // //                         <label style={styles.label}>
// // //                             {activeTab === 'customer' ? 'SEARCH CUSTOMER' : 'SEARCH ITEM'}
// // //                         </label>
// // //                         <div style={styles.searchWrapper}>
// // //                             <FiSearch style={styles.searchIcon} />
// // //                             <input
// // //                                 type="text"
// // //                                 placeholder={activeTab === 'customer' ? "Search by customer name..." : "Search by item name..."}
// // //                                 value={searchTerm}
// // //                                 onChange={(e) => setSearchTerm(e.target.value)}
// // //                                 style={styles.searchInput}
// // //                             />
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //             </div>

// // //             {/* Customer Summary Table */}
// // //             {activeTab === 'customer' && (
// // //                 <div style={styles.card}>
// // //                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
// // //                         📋 Customer Summary
// // //                         {searchTerm && ` (Filtered: ${filteredCustomerSummary.length} of ${customerSummary.length})`}
// // //                     </h3>
// // //                     <div style={{ overflowX: 'auto' }}>
// // //                         <table style={styles.table}>
// // //                             <thead>
// // //                                 <tr style={styles.tableHeader}>
// // //                                     <th style={styles.tableCell}>#</th>
// // //                                     <th style={styles.tableCell}>Customer Name</th>
// // //                                     <th style={styles.tableCellRight}>Total Amount</th>
// // //                                     <th style={styles.tableCell}>Date</th>
// // //                                     <th style={styles.tableCellCenter}>Actions</th>
// // //                                 </tr>
// // //                             </thead>
// // //                             <tbody>
// // //                                 {filteredCustomerSummary.length === 0 ? (
// // //                                     <tr>
// // //                                         <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
// // //                                             {searchTerm ? 'No matching customers found' : 'No data found for selected date'}
// // //                                         </td>
// // //                                     </tr>
// // //                                 ) : (
// // //                                     filteredCustomerSummary.map((customer) => (
// // //                                         <tr key={customer.sr_no}>
// // //                                             <td style={styles.tableCell}>{customer.sr_no}</td>
// // //                                             <td style={styles.tableCell}>
// // //                                                 <strong>{customer.customer_name}</strong>
// // //                                                 {customer.customer_name_urdu && (
// // //                                                     <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif" }}>
// // //                                                         {customer.customer_name_urdu}
// // //                                                     </div>
// // //                                                 )}
// // //                                             </td>
// // //                                             <td style={styles.tableCellRight}>
// // //                                                 <strong style={{ color: '#4CAF50' }}>₨ {customer.total_amount.toLocaleString()}</strong>
// // //                                             </td>
// // //                                             <td style={styles.tableCell}>{formatDateForDisplay(customer.invoice_date)}</td>
// // //                                             <td style={styles.tableCellCenter}>
// // //                                                 <button
// // //                                                     onClick={() => generateSingleCustomerPDF(customer)}
// // //                                                     style={styles.actionButton}
// // //                                                     title="Print Report"
// // //                                                 >
// // //                                                     <FiFileText size={18} />
// // //                                                 </button>
// // //                                             </td>
// // //                                         </tr>
// // //                                     ))
// // //                                 )}
// // //                             </tbody>
// // //                             {filteredCustomerSummary.length > 0 && (
// // //                                 <tfoot>
// // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // //                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
// // //                                         <td style={styles.tableCellRight}>
// // //                                             <strong style={{ color: '#4CAF50' }}>
// // //                                                 ₨ {filteredCustomerSummary.reduce((sum, c) => sum + c.total_amount, 0).toLocaleString()}
// // //                                             </strong>
// // //                                         </td>
// // //                                         <td colSpan="2"></td>
// // //                                     </tr>
// // //                                 </tfoot>
// // //                             )}
// // //                         </table>
// // //                     </div>
// // //                 </div>
// // //             )}

// // //             {/* Item Wise Summary Table */}
// // //             {activeTab === 'item' && (
// // //                 <div style={styles.card}>
// // //                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
// // //                         📦 Item Summary
// // //                         {searchTerm && ` (Filtered: ${filteredItemSummary.length} of ${itemWiseSummary.length})`}
// // //                     </h3>
// // //                     <div style={{ overflowX: 'auto' }}>
// // //                         <table style={styles.table}>
// // //                             <thead>
// // //                                 <tr style={styles.tableHeader}>
// // //                                     <th style={styles.tableCell}>#</th>
// // //                                     <th style={styles.tableCell}>Item Name</th>
// // //                                     <th style={styles.tableCellRight}>Quantity</th>
// // //                                     <th style={styles.tableCellRight}>Total Amount</th>
// // //                                 </tr>
// // //                             </thead>
// // //                             <tbody>
// // //                                 {filteredItemSummary.length === 0 ? (
// // //                                     <tr>
// // //                                         <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
// // //                                             {searchTerm ? 'No matching items found' : 'No items found for selected date'}
// // //                                         </td>
// // //                                     </tr>
// // //                                 ) : (
// // //                                     filteredItemSummary.map((item) => (
// // //                                         <tr key={item.sr_no}>
// // //                                             <td style={styles.tableCell}>{item.sr_no}</td>
// // //                                             <td style={styles.tableCell}>
// // //                                                 <div>{item.item_name}</div>
// // //                                                 {item.item_name_urdu && (
// // //                                                     <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif", marginTop: '4px' }}>
// // //                                                         {item.item_name_urdu}
// // //                                                     </div>
// // //                                                 )}
// // //                                             </td>
// // //                                             <td style={styles.tableCellRight}>
// // //                                                 <strong>{item.total_quantity.toLocaleString()}</strong>
// // //                                             </td>
// // //                                             <td style={styles.tableCellRight}>
// // //                                                 <strong style={{ color: '#4CAF50' }}>₨ {item.total_amount.toLocaleString()}</strong>
// // //                                             </td>
// // //                                         </tr>
// // //                                     ))
// // //                                 )}
// // //                             </tbody>
// // //                             {filteredItemSummary.length > 0 && (
// // //                                 <tfoot>
// // //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// // //                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
// // //                                         <td style={styles.tableCellRight}>
// // //                                             <strong>{filteredItemSummary.reduce((sum, i) => sum + (i.total_quantity || 0), 0).toLocaleString()}</strong>
// // //                                         </td>
// // //                                         <td style={styles.tableCellRight}>
// // //                                             <strong style={{ color: '#4CAF50' }}>
// // //                                                 ₨ {filteredItemSummary.reduce((sum, i) => sum + (i.total_amount || 0), 0).toLocaleString()}
// // //                                             </strong>
// // //                                         </td>
// // //                                     </tr>
// // //                                 </tfoot>
// // //                             )}
// // //                         </table>
// // //                     </div>
// // //                 </div>
// // //             )}

// // //             <style>{`
// // //                 @keyframes spin {
// // //                     0% { transform: rotate(0deg); }
// // //                     100% { transform: rotate(360deg); }
// // //                 }
// // //             `}</style>
// // //         </div>
// // //     );
// // // }

// // // export default Reports;

// // import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
// // import { toast } from 'react-hot-toast';
// // import { FiPrinter, FiCalendar, FiFileText, FiUser, FiPackage, FiSearch } from 'react-icons/fi';
// // import { NavigationContext } from '../App';

// // function Reports() {
// //     const { goBack } = useContext(NavigationContext);
// //     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
// //     const [invoices, setInvoices] = useState([]);
// //     const [loading, setLoading] = useState(false);
// //     const [customerSummary, setCustomerSummary] = useState([]);
// //     const [itemWiseSummary, setItemWiseSummary] = useState([]);
// //     const [tempDate, setTempDate] = useState('');
// //     const [showDatePicker, setShowDatePicker] = useState(false);
// //     const [activeTab, setActiveTab] = useState('customer');
// //     const [searchTerm, setSearchTerm] = useState('');

// //     const dateInputRef = useRef(null);
// //     const datePickerRef = useRef(null);
// //     const isInitialMount = useRef(true);

// //     useEffect(() => {
// //         loadData();

// //         // Handle click outside to close date picker
// //         const handleClickOutside = (event) => {
// //             if (datePickerRef.current && !datePickerRef.current.contains(event.target) &&
// //                 dateInputRef.current && !dateInputRef.current.contains(event.target)) {
// //                 setShowDatePicker(false);
// //             }
// //         };

// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);

// //     // Set initial temp date when selectedDate changes
// //     useEffect(() => {
// //         if (selectedDate) {
// //             const displayDate = formatDateForDisplay(selectedDate);
// //             setTempDate(displayDate);
// //         }
// //     }, [selectedDate]);

// //     // Auto fetch when selectedDate changes (skip initial mount if needed)
// //     useEffect(() => {
// //         if (isInitialMount.current) {
// //             isInitialMount.current = false;
// //             // Load summaries after invoices are loaded
// //             if (invoices.length > 0) {
// //                 loadSummaries();
// //             }
// //         } else if (selectedDate && invoices.length > 0) {
// //             loadSummaries();
// //         }
// //     }, [selectedDate, invoices]);

// //     const loadData = async () => {
// //         try {
// //             const invoicesData = await window.electron.database.getInvoices();
// //             setInvoices(invoicesData || []);
// //         } catch (error) {
// //             console.error('Failed to load data:', error);
// //             toast.error('Failed to load data');
// //         }
// //     };

// //     const loadSummaries = useCallback(async () => {
// //         if (!selectedDate) return;

// //         setLoading(true);
// //         try {
// //             const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();

// //             // Filter invoices by selected date (exact match)
// //             const filteredInvoices = allInvoices.filter(inv => {
// //                 const invDate = inv.invoice_date;
// //                 return invDate === selectedDate;
// //             });

// //             console.log('Selected Date:', selectedDate);
// //             console.log('Filtered Invoices:', filteredInvoices.length);

// //             // Group by customer for customer summary
// //             const customerMap = new Map();
// //             for (const invoice of filteredInvoices) {
// //                 const customerName = invoice.customer_name;
// //                 if (!customerMap.has(customerName)) {
// //                     let customerUrduName = '';
// //                     if (invoice.account_id) {
// //                         try {
// //                             const account = await window.electron.database.getAccountById(invoice.account_id);
// //                             customerUrduName = account?.customer_name_urdu || '';
// //                         } catch (err) {
// //                             console.error('Error fetching account:', err);
// //                         }
// //                     }
// //                     customerMap.set(customerName, {
// //                         customer_name: customerName,
// //                         customer_name_urdu: customerUrduName,
// //                         total_amount: 0,
// //                         invoice_date: invoice.invoice_date,
// //                         invoice_id: invoice.invoice_id,
// //                         voucher_id: invoice.voucher_id
// //                     });
// //                 }
// //                 const customer = customerMap.get(customerName);
// //                 customer.total_amount += invoice.net_amount || 0;
// //                 if (invoice.invoice_date > customer.invoice_date) {
// //                     customer.invoice_date = invoice.invoice_date;
// //                     customer.invoice_id = invoice.invoice_id;
// //                     customer.voucher_id = invoice.voucher_id;
// //                 }
// //             }

// //             const customerList = Array.from(customerMap.values()).map((customer, index) => ({
// //                 sr_no: index + 1,
// //                 ...customer
// //             }));
// //             setCustomerSummary(customerList);

// //             // Calculate item summary from invoice details
// //             const itemsMap = new Map();

// //             for (const invoice of filteredInvoices) {
// //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// //                 console.log(`Invoice ${invoice.invoice_id} details:`, details.length);

// //                 for (const item of details) {
// //                     const itemId = item.item_id;
// //                     const itemKey = itemId || item.item_name;

// //                     if (!itemsMap.has(itemKey)) {
// //                         let itemNameUrdu = item.item_name_urdu || '';
// //                         if (itemId && !itemNameUrdu) {
// //                             try {
// //                                 const product = await window.electron.database.getProductById(itemId);
// //                                 itemNameUrdu = product?.item_name_urdu || '';
// //                             } catch (err) {
// //                                 console.error('Error fetching product:', err);
// //                             }
// //                         }
// //                         itemsMap.set(itemKey, {
// //                             item_name: item.item_name,
// //                             item_name_urdu: itemNameUrdu,
// //                             total_quantity: 0,
// //                             total_amount: 0
// //                         });
// //                     }
// //                     const itemData = itemsMap.get(itemKey);
// //                     itemData.total_quantity += parseFloat(item.quantity) || 0;
// //                     itemData.total_amount += parseFloat(item.amount) || 0;
// //                 }
// //             }

// //             const itemList = Array.from(itemsMap.values()).map((item, index) => ({
// //                 sr_no: index + 1,
// //                 item_name: item.item_name,
// //                 item_name_urdu: item.item_name_urdu,
// //                 total_quantity: item.total_quantity,
// //                 total_amount: item.total_amount
// //             }));

// //             console.log('Calculated Item Summary:', itemList.length);
// //             setItemWiseSummary(itemList);

// //             if (filteredInvoices.length === 0 && !isInitialMount.current) {
// //                 toast.error('No invoices found for selected date');
// //             }

// //         } catch (error) {
// //             console.error('Failed to load summaries:', error);
// //             toast.error('Failed to load summaries: ' + error.message);
// //         } finally {
// //             setLoading(false);
// //         }
// //     }, [selectedDate, invoices]);

// //     // Filtered data based on search term
// //     const filteredCustomerSummary = useMemo(() => {
// //         if (!searchTerm.trim()) return customerSummary;
// //         const searchLower = searchTerm.toLowerCase();
// //         return customerSummary.filter(customer =>
// //             customer.customer_name.toLowerCase().includes(searchLower) ||
// //             (customer.customer_name_urdu && customer.customer_name_urdu.includes(searchTerm))
// //         );
// //     }, [customerSummary, searchTerm]);

// //     const filteredItemSummary = useMemo(() => {
// //         if (!searchTerm.trim()) return itemWiseSummary;
// //         const searchLower = searchTerm.toLowerCase();
// //         return itemWiseSummary.filter(item =>
// //             item.item_name.toLowerCase().includes(searchLower) ||
// //             (item.item_name_urdu && item.item_name_urdu.includes(searchTerm))
// //         );
// //     }, [itemWiseSummary, searchTerm]);

// //     const formatDateForDisplay = (dateString) => {
// //         if (!dateString) return '';
// //         const date = new Date(dateString);
// //         if (isNaN(date.getTime())) return '';
// //         const day = String(date.getDate()).padStart(2, '0');
// //         const month = String(date.getMonth() + 1).padStart(2, '0');
// //         const year = date.getFullYear();
// //         return `${day}/${month}/${year}`;
// //     };

// //     const formatDateForStorage = (dateStr) => {
// //         if (!dateStr) return null;
// //         const parts = dateStr.split('/');
// //         if (parts.length === 3) {
// //             const day = parseInt(parts[0], 10);
// //             const month = parseInt(parts[1], 10);
// //             const year = parseInt(parts[2], 10);
// //             if (!isNaN(day) && !isNaN(month) && !isNaN(year) &&
// //                 day >= 1 && day <= 31 && month >= 1 && month <= 12 && year.toString().length === 4) {
// //                 return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
// //             }
// //         }
// //         return null;
// //     };

// //     const handleDateInputChange = (value) => {
// //         setTempDate(value);
// //         let formatted = value.replace(/[^0-9]/g, '');
// //         if (formatted.length >= 2 && formatted.length < 4) {
// //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
// //         } else if (formatted.length >= 4 && formatted.length < 6) {
// //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4);
// //         } else if (formatted.length >= 6) {
// //             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4, 8);
// //         }
// //         setTempDate(formatted);

// //         if (formatted.length === 10) {
// //             const storageDate = formatDateForStorage(formatted);
// //             if (storageDate) {
// //                 setSelectedDate(storageDate);
// //             }
// //         }
// //     };

// //     const handleDateBlur = () => {
// //         if (tempDate.length === 10) {
// //             const storageDate = formatDateForStorage(tempDate);
// //             if (storageDate) {
// //                 setSelectedDate(storageDate);
// //             } else {
// //                 const currentDate = new Date();
// //                 const storageDate = currentDate.toISOString().split('T')[0];
// //                 setSelectedDate(storageDate);
// //                 toast.error('Invalid date format. Using current date.');
// //             }
// //         } else if (tempDate && tempDate.length > 0) {
// //             const currentDate = new Date();
// //             const storageDate = currentDate.toISOString().split('T')[0];
// //             setSelectedDate(storageDate);
// //             toast.error('Invalid date. Using current date.');
// //         }
// //         setShowDatePicker(false);
// //     };

// //     const handleDateSelect = useCallback((date) => {
// //         const year = date.getFullYear();
// //         const month = String(date.getMonth() + 1).padStart(2, '0');
// //         const day = String(date.getDate()).padStart(2, '0');
// //         const storageDate = `${year}-${month}-${day}`;
// //         console.log('Selected date from calendar:', storageDate);
// //         setSelectedDate(storageDate);
// //         setShowDatePicker(false);
// //     }, []);

// //     // Function to open report directly in browser tab
// //     // const openReportInBrowser = async (html, title = 'Sales Report') => {
// //     //     try {
// //     //         // Open in new browser tab
// //     //         const newWindow = window.open('', '_blank', 'width=1200,height=800,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes');
// //     //         if (newWindow) {
// //     //             newWindow.document.write(html);
// //     //             newWindow.document.title = title;
// //     //             newWindow.document.close();
// //     //             newWindow.focus();
// //     //             toast.success('Report opened in new browser tab');
// //     //         } else {
// //     //             toast.error('Popup blocked. Please allow popups for this site.');
// //     //         }
// //     //     } catch (error) {
// //     //         console.error('Error opening report:', error);
// //     //         toast.error('Failed to open report');
// //     //     }
// //     // };

// //     const openReportInBrowser = async (html, title = 'Sales Report') => {
// //         try {
// //             if (window.electron && window.electron.openHTMLInBrowser) {
// //                 const filePath = await window.electron.openHTMLInBrowser(html);
// //                 if (filePath) {
// //                     toast.success('Report opened in your default browser');
// //                 } else {
// //                     toast.error('Failed to open report');
// //                 }
// //             } else {
// //                 // Fallback: Create blob and open
// //                 const blob = new Blob([html], { type: 'text/html' });
// //                 const url = URL.createObjectURL(blob);
// //                 window.open(url, '_blank');
// //                 setTimeout(() => URL.revokeObjectURL(url), 10000);
// //                 toast.success('Report opened in new tab');
// //             }
// //         } catch (error) {
// //             console.error('Error opening report:', error);
// //             toast.error('Failed to open report');
// //         }
// //     };

// //     const generateReportHTML = async (singleCustomer = null) => {
// //         try {
// //             const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();
// //             const filteredInvoices = allInvoices.filter(inv => {
// //                 const invDate = inv.invoice_date;
// //                 return invDate === selectedDate;
// //             });

// //             let customerGroups = {};

// //             if (singleCustomer) {
// //                 const customerInvoices = filteredInvoices.filter(inv => inv.customer_name === singleCustomer.customer_name);

// //                 for (const invoice of customerInvoices) {
// //                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// //                     const enrichedDetails = await Promise.all(details.map(async (item) => {
// //                         if (item.item_id) {
// //                             try {
// //                                 const product = await window.electron.database.getProductById(item.item_id);
// //                                 return {
// //                                     ...item,
// //                                     item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
// //                                 };
// //                             } catch (err) {
// //                                 return item;
// //                             }
// //                         }
// //                         return item;
// //                     }));

// //                     const customerKey = invoice.customer_name;
// //                     if (!customerGroups[customerKey]) {
// //                         customerGroups[customerKey] = {
// //                             customerName: invoice.customer_name,
// //                             customerNameUrdu: singleCustomer.customer_name_urdu || '',
// //                             customerId: invoice.account_id,
// //                             invoices: [],
// //                             totalItems: 0,
// //                             totalAmount: 0,
// //                             discount: 0,
// //                             netAmount: 0
// //                         };
// //                     }

// //                     customerGroups[customerKey].invoices.push({
// //                         ...invoice,
// //                         details: enrichedDetails
// //                     });
// //                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
// //                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
// //                     customerGroups[customerKey].discount += invoice.discount || 0;
// //                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
// //                 }
// //             } else {
// //                 for (const invoice of filteredInvoices) {
// //                     let customerUrduName = '';
// //                     if (invoice.account_id) {
// //                         try {
// //                             const account = await window.electron.database.getAccountById(invoice.account_id);
// //                             customerUrduName = account?.customer_name_urdu || '';
// //                         } catch (err) {
// //                             console.error('Error fetching account:', err);
// //                         }
// //                     }

// //                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
// //                     const enrichedDetails = await Promise.all(details.map(async (item) => {
// //                         if (item.item_id) {
// //                             try {
// //                                 const product = await window.electron.database.getProductById(item.item_id);
// //                                 return {
// //                                     ...item,
// //                                     item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
// //                                 };
// //                             } catch (err) {
// //                                 return item;
// //                             }
// //                         }
// //                         return item;
// //                     }));

// //                     const customerKey = invoice.customer_name;
// //                     if (!customerGroups[customerKey]) {
// //                         customerGroups[customerKey] = {
// //                             customerName: invoice.customer_name,
// //                             customerNameUrdu: customerUrduName,
// //                             customerId: invoice.account_id,
// //                             invoices: [],
// //                             totalItems: 0,
// //                             totalAmount: 0,
// //                             discount: 0,
// //                             netAmount: 0
// //                         };
// //                     } else if (customerUrduName && !customerGroups[customerKey].customerNameUrdu) {
// //                         customerGroups[customerKey].customerNameUrdu = customerUrduName;
// //                     }

// //                     customerGroups[customerKey].invoices.push({
// //                         ...invoice,
// //                         details: enrichedDetails
// //                     });
// //                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
// //                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
// //                     customerGroups[customerKey].discount += invoice.discount || 0;
// //                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
// //                 }
// //             }

// //             // Prepare items summary per customer
// //             const customerItemsSummary = {};
// //             for (const [customerName, customerData] of Object.entries(customerGroups)) {
// //                 const itemsSummary = {};
// //                 for (const invoice of customerData.invoices) {
// //                     for (const item of invoice.details) {
// //                         const itemKey = item.item_id || item.item_name;
// //                         if (!itemsSummary[itemKey]) {
// //                             itemsSummary[itemKey] = {
// //                                 itemName: item.item_name,
// //                                 itemNameUrdu: item.item_name_urdu || '',
// //                                 totalQuantity: 0,
// //                                 totalAmount: 0,
// //                                 avgRate: 0
// //                             };
// //                         }
// //                         itemsSummary[itemKey].totalQuantity += item.quantity;
// //                         itemsSummary[itemKey].totalAmount += item.amount;
// //                     }
// //                 }
// //                 for (const item of Object.values(itemsSummary)) {
// //                     item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
// //                 }
// //                 customerItemsSummary[customerName] = Object.values(itemsSummary);
// //             }

// //             const formattedDate = formatDateForDisplay(selectedDate);

// //             const html = `
// //                 <!DOCTYPE html>
// //                 <html>
// //                 <head>
// //                     <meta charset="UTF-8">
// //                     <title>Sales Report ${formattedDate}</title>
// //                     <style>
// //                         * {
// //                             margin: 0;
// //                             padding: 0;
// //                             box-sizing: border-box;
// //                         }

// //                         body {
// //                             font-family: 'Segoe UI', 'Arial', sans-serif;
// //                             padding: 40px;
// //                             background: white;
// //                             color: #333;
// //                         }

// //                         .report-container {
// //                             max-width: 1200px;
// //                             margin: 0 auto;
// //                         }

// //                         .header {
// //                             text-align: center;
// //                             margin-bottom: 40px;
// //                             padding-bottom: 20px;
// //                             border-bottom: 3px solid #4CAF50;
// //                         }

// //                         .company-name {
// //                             font-size: 28px;
// //                             font-weight: bold;
// //                             color: #2c3e50;
// //                             margin-bottom: 10px;
// //                         }

// //                         .report-title {
// //                             font-size: 24px;
// //                             font-weight: bold;
// //                             color: #4CAF50;
// //                             margin: 10px 0;
// //                         }

// //                         .date-range {
// //                             font-size: 14px;
// //                             color: #666;
// //                             margin-top: 10px;
// //                         }

// //                         .customer-section {
// //                             margin-bottom: 50px;
// //                             page-break-after: always;
// //                         }

// //                         .customer-section:last-child {
// //                             page-break-after: auto;
// //                         }

// //                         .customer-header {
// //                             text-align: center;
// //                             margin-bottom: 20px;
// //                             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //                             border-radius: 12px;
// //                             overflow: hidden;
// //                             box-shadow: 0 4px 15px rgba(0,0,0,0.1);
// //                         }

// //                         .customer-name {
// //                             font-size: 32px;
// //                             font-weight: bold;
// //                             color: white;
// //                             padding: 20px;
// //                             margin: 0;
// //                             text-align: center;
// //                             font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;
// //                             text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
// //                         }

// //                         .customer-date {
// //                             font-size: 14px;
// //                             color: rgba(255,255,255,0.9);
// //                             padding: 10px 20px;
// //                             background: rgba(0,0,0,0.1);
// //                             text-align: center;
// //                         }

// //                         .items-table {
// //                             width: 100%;
// //                             border-collapse: collapse;
// //                             margin-top: 20px;
// //                             box-shadow: 0 2px 8px rgba(0,0,0,0.05);
// //                         }

// //                         .items-table th {
// //                             background: #4CAF50;
// //                             color: white;
// //                             border: 1px solid #ddd;
// //                             padding: 14px;
// //                             text-align: center;
// //                             font-size: 16px;
// //                             font-weight: bold;
// //                         }

// //                         .items-table td {
// //                             border: 1px solid #ddd;
// //                             padding: 12px;
// //                             text-align: center;
// //                             font-size: 14px;
// //                         }

// //                         .total-row {
// //                             background: #f9f9f9;
// //                             font-weight: bold;
// //                             border-top: 2px solid #4CAF50;
// //                         }

// //                         .total-row td {
// //                             font-weight: bold;
// //                             font-size: 16px;
// //                             padding: 14px;
// //                         }

// //                         .footer {
// //                             margin-top: 40px;
// //                             padding-top: 20px;
// //                             text-align: center;
// //                             border-top: 1px solid #e0e0e0;
// //                             font-size: 12px;
// //                             color: #999;
// //                         }

// //                         .footer-developer {
// //                             font-size: 14px;
// //                             color: #4CAF50;
// //                             margin-top: 10px;
// //                             font-weight: bold;
// //                         }

// //                         @media print {
// //                             body {
// //                                 padding: 20px;
// //                             }
// //                             .customer-section {
// //                                 page-break-after: always;
// //                             }
// //                         }
// //                     </style>
// //                 </head>
// //                 <body>
// //                     <div class="report-container">
// //                         <div class="header">
// //                             <div class="company-name">INVENTORY MANAGEMENT SYSTEM</div>
// //                             <div class="report-title">SALES REPORT</div>
// //                             <div class="date-range">Date: ${formattedDate}</div>
// //                         </div>

// //                         ${Object.entries(customerGroups).map(([customerName, customerData]) => {
// //                 const itemsSummary = customerItemsSummary[customerName] || [];
// //                 const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
// //                 const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);
// //                 const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
// //                 const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());
// //                 const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== ''
// //                     ? customerData.customerNameUrdu
// //                     : customerData.customerName;

// //                 return `
// //                             <div class="customer-section">
// //                                 <div class="customer-header">
// //                                     <div class="customer-name" style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// //                                         ${displayCustomerName}
// //                                     </div>
// //                                     <div class="customer-date">
// //                                         Date: ${invoiceDate}
// //                                     </div>
// //                                 </div>

// //                                 <table class="items-table">
// //                                     <thead>
// //                                         <tr>
// //                                             <th>#</th>
// //                                             <th>Item</th>
// //                                             <th>Quantity</th>
// //                                             <th>Rate</th>
// //                                             <th>Amount</th>
// //                                         </thead>
// //                                     <tbody>
// //                                         ${itemsSummary.map((item, idx) => {
// //                     const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
// //                         ? item.itemNameUrdu
// //                         : item.itemName;

// //                     return `
// //                                                 <tr>
// //                                                     <td>${idx + 1}</td>
// //                                                     <td style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
// //                                                         ${displayItemName}
// //                                                     </td>
// //                                                     <td>${item.totalQuantity.toLocaleString()}</td>
// //                                                     <td>${Math.round(item.avgRate).toLocaleString()}</td>
// //                                                     <td style="color: #4CAF50; font-weight: bold;">
// //                                                         ${item.totalAmount.toLocaleString()}
// //                                                     </td>
// //                                                 </tr>
// //                                             `;
// //                 }).join('')}
// //                                         <tr class="total-row">
// //                                             <td colspan="2"><strong>GRAND TOTAL</strong></td>
// //                                             <td><strong>${totalItems.toLocaleString()}</strong></td>
// //                                             <td>-</td>
// //                                             <td style="color: #4CAF50; font-size: 18px;">
// //                                                 <strong>${totalAmount.toLocaleString()}</strong>
// //                                             </td>
// //                                         </tr>
// //                                     </tbody>
// //                                 </table>
// //                             </div>
// //                         `;
// //             }).join('')}

// //                         <div class="footer">
// //                             <p>This report was generated by Inventory Management System</p>
// //                             <p class="footer-developer">Developed By Ultimate Solutions</p>
// //                             <p>${new Date().toLocaleString()}</p>
// //                         </div>
// //                     </div>
// //                 </body>
// //                 </html>
// //             `;

// //             return html;
// //         } catch (error) {
// //             console.error('Error generating report HTML:', error);
// //             toast.error('Failed to generate report');
// //             return null;
// //         }
// //     };

// //     const generateAllCustomersReport = async () => {
// //         setLoading(true);
// //         try {
// //             const html = await generateReportHTML();
// //             if (html) {
// //                 await openReportInBrowser(html, `Sales_Report_${formatDateForDisplay(selectedDate)}`);
// //             }
// //         } catch (error) {
// //             console.error('Error generating report:', error);
// //             toast.error('Failed to generate report');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const generateSingleCustomerReport = async (customer) => {
// //         setLoading(true);
// //         try {
// //             const html = await generateReportHTML(customer);
// //             if (html) {
// //                 await openReportInBrowser(html, `${customer.customer_name}_Report_${formatDateForDisplay(selectedDate)}`);
// //             }
// //         } catch (error) {
// //             console.error('Error generating report:', error);
// //             toast.error('Failed to generate report');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const DatePickerCalendar = ({ currentDate, onSelect }) => {
// //         const [displayDate, setDisplayDate] = useState(() => {
// //             // Initialize with currentDate or default to today
// //             if (currentDate && !isNaN(currentDate.getTime())) {
// //                 return new Date(currentDate);
// //             }
// //             return new Date();
// //         });

// //         // Update displayDate when currentDate prop changes
// //         useEffect(() => {
// //             if (currentDate && !isNaN(currentDate.getTime())) {
// //                 setDisplayDate(new Date(currentDate));
// //             }
// //         }, [currentDate]);

// //         const getDaysInMonth = (date) => {
// //             const year = date.getFullYear();
// //             const month = date.getMonth();
// //             const firstDay = new Date(year, month, 1);
// //             const lastDay = new Date(year, month + 1, 0);
// //             const days = [];
// //             const startOffset = firstDay.getDay();
// //             for (let i = 0; i < startOffset; i++) days.push(null);
// //             for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
// //             return days;
// //         };

// //         const isSameDay = (date1, date2) => {
// //             return date1 && date2 &&
// //                 date1.getFullYear() === date2.getFullYear() &&
// //                 date1.getMonth() === date2.getMonth() &&
// //                 date1.getDate() === date2.getDate();
// //         };

// //         const days = getDaysInMonth(displayDate);
// //         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// //         const handlePrevMonth = () => {
// //             setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
// //         };

// //         const handleNextMonth = () => {
// //             setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
// //         };

// //         return (
// //             <div ref={datePickerRef} style={calendarStyles.container}>
// //                 <div style={calendarStyles.header}>
// //                     <button
// //                         onClick={handlePrevMonth}
// //                         style={calendarStyles.navButton}
// //                         type="button"
// //                     >←</button>
// //                     <span style={calendarStyles.monthYear}>{monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}</span>
// //                     <button
// //                         onClick={handleNextMonth}
// //                         style={calendarStyles.navButton}
// //                         type="button"
// //                     >→</button>
// //                 </div>
// //                 <div style={calendarStyles.weekdays}>
// //                     {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} style={calendarStyles.weekday}>{day}</div>)}
// //                 </div>
// //                 <div style={calendarStyles.days}>
// //                     {days.map((date, idx) => (
// //                         <div
// //                             key={idx}
// //                             onClick={() => date && onSelect(date)}
// //                             style={{
// //                                 ...calendarStyles.day,
// //                                 ...(date ? calendarStyles.dayCell : {}),
// //                                 ...(date && currentDate && isSameDay(date, currentDate) ? calendarStyles.selected : {}),
// //                                 ...(date && isSameDay(date, new Date()) && (!currentDate || !isSameDay(date, currentDate)) ? calendarStyles.today : {})
// //                             }}
// //                         >
// //                             {date ? date.getDate() : ''}
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         );
// //     };

// //     const calendarStyles = {
// //         container: {
// //             position: 'absolute',
// //             top: '100%',
// //             left: 0,
// //             background: 'white',
// //             border: '1px solid #ddd',
// //             borderRadius: '8px',
// //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// //             padding: '12px',
// //             zIndex: 9999,
// //             marginTop: '4px',
// //             width: '280px',
// //             backgroundColor: 'white'
// //         },
// //         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
// //         navButton: {
// //             background: 'none',
// //             border: 'none',
// //             fontSize: '16px',
// //             cursor: 'pointer',
// //             padding: '4px 8px',
// //             borderRadius: '4px',
// //             color: '#666',
// //             transition: 'background 0.2s'
// //         },
// //         monthYear: { fontWeight: 'bold', fontSize: '14px' },
// //         weekdays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' },
// //         weekday: { textAlign: 'center', fontSize: '11px', color: '#666', padding: '4px' },
// //         days: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' },
// //         dayCell: {
// //             textAlign: 'center',
// //             padding: '6px',
// //             fontSize: '12px',
// //             cursor: 'pointer',
// //             borderRadius: '4px',
// //             transition: 'background 0.2s',
// //             backgroundColor: 'white',
// //             color: '#333',
// //             ':hover': {
// //                 backgroundColor: '#f0f0f0'
// //             }
// //         },
// //         day: { color: '#333' },
// //         selected: {
// //             backgroundColor: '#4CAF50',
// //             color: 'white',
// //             fontWeight: 'bold'
// //         },
// //         today: {
// //             border: '1px solid #4CAF50',
// //             fontWeight: 'bold',
// //             backgroundColor: '#e8f5e9'
// //         }
// //     };

// //     const styles = {
// //         container: { padding: '16px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' },
// //         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' },
// //         headerTitle: { margin: 0, fontSize: '20px', fontWeight: '600' },
// //         buttonGroup: { display: 'flex', gap: '8px' },
// //         buttonPrimary: { padding: '6px 14px', background: 'white', color: '#667eea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
// //         buttonSuccess: { padding: '6px 14px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
// //         card: { background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
// //         row: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
// //         formGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px' },
// //         formGroupSearch: { flex: 2, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '300px' },
// //         label: { fontSize: '11px', fontWeight: '500', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
// //         dateInputWrapper: { position: 'relative', width: '100%' },
// //         input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
// //         searchInput: { padding: '8px 12px 8px 36px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
// //         searchIcon: { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '16px' },
// //         calendarIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', cursor: 'pointer', fontSize: '16px' },
// //         table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
// //         tableHeader: { background: '#f5f5f5', borderBottom: '2px solid #e0e0e0', fontWeight: '600' },
// //         tableCell: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' },
// //         tableCellRight: { padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' },
// //         tableCellCenter: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' },
// //         actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', fontSize: '16px', color: '#2196F3', transition: 'all 0.2s' },
// //         tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' },
// //         tab: { padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', border: 'none', background: 'none', color: '#666', transition: 'all 0.2s' },
// //         activeTab: { color: '#4CAF50', borderBottom: '2px solid #4CAF50', marginBottom: '-2px' },
// //         loadingOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
// //         loadingSpinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #4CAF50', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' },
// //         searchWrapper: { position: 'relative', width: '100%' }
// //     };

// //     if (loading) {
// //         return (
// //             <div style={styles.loadingOverlay}>
// //                 <div style={styles.loadingSpinner}></div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div style={styles.container}>
// //             <div style={styles.header}>
// //                 <h1 style={styles.headerTitle}>📊 Sales Reports</h1>
// //                 <div style={styles.buttonGroup}>
// //                     <button onClick={generateAllCustomersReport} style={styles.buttonSuccess}>
// //                         <FiPrinter size={14} /> Print All Report
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* Tabs */}
// //             <div style={styles.tabContainer}>
// //                 <button
// //                     onClick={() => {
// //                         setActiveTab('customer');
// //                         setSearchTerm('');
// //                     }}
// //                     style={{ ...styles.tab, ...(activeTab === 'customer' ? styles.activeTab : {}) }}
// //                 >
// //                     <FiUser size={14} style={{ marginRight: '6px' }} /> Customer Summary
// //                 </button>
// //                 <button
// //                     onClick={() => {
// //                         setActiveTab('item');
// //                         setSearchTerm('');
// //                     }}
// //                     style={{ ...styles.tab, ...(activeTab === 'item' ? styles.activeTab : {}) }}
// //                 >
// //                     <FiPackage size={14} style={{ marginRight: '6px' }} /> Item Summary
// //                 </button>
// //             </div>

// //             {/* Date Picker and Search */}
// //             <div style={styles.card}>
// //                 <div style={styles.row}>
// //                     <div style={styles.formGroup}>
// //                         <label style={styles.label}>SELECT DATE</label>
// //                         <div style={styles.dateInputWrapper}>
// //                             <input
// //                                 ref={dateInputRef}
// //                                 type="text"
// //                                 placeholder="DD/MM/YYYY"
// //                                 value={tempDate}
// //                                 onChange={(e) => handleDateInputChange(e.target.value)}
// //                                 onFocus={() => setShowDatePicker(true)}
// //                                 onBlur={handleDateBlur}
// //                                 style={styles.input}
// //                             />
// //                             <FiCalendar
// //                                 style={styles.calendarIcon}
// //                                 onClick={(e) => {
// //                                     e.preventDefault();
// //                                     e.stopPropagation();
// //                                     setShowDatePicker(!showDatePicker);
// //                                 }}
// //                             />
// //                             {showDatePicker && (
// //                                 <DatePickerCalendar
// //                                     currentDate={new Date(selectedDate)}
// //                                     onSelect={handleDateSelect}
// //                                 />
// //                             )}
// //                         </div>
// //                     </div>
// //                     <div style={styles.formGroupSearch}>
// //                         <label style={styles.label}>
// //                             {activeTab === 'customer' ? 'SEARCH CUSTOMER' : 'SEARCH ITEM'}
// //                         </label>
// //                         <div style={styles.searchWrapper}>
// //                             <FiSearch style={styles.searchIcon} />
// //                             <input
// //                                 type="text"
// //                                 placeholder={activeTab === 'customer' ? "Search by customer name..." : "Search by item name..."}
// //                                 value={searchTerm}
// //                                 onChange={(e) => setSearchTerm(e.target.value)}
// //                                 style={styles.searchInput}
// //                             />
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Customer Summary Table */}
// //             {activeTab === 'customer' && (
// //                 <div style={styles.card}>
// //                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
// //                         📋 Customer Summary
// //                         {searchTerm && ` (Filtered: ${filteredCustomerSummary.length} of ${customerSummary.length})`}
// //                     </h3>
// //                     <div style={{ overflowX: 'auto' }}>
// //                         <table style={styles.table}>
// //                             <thead>
// //                                 <tr style={styles.tableHeader}>
// //                                     <th style={styles.tableCell}>#</th>
// //                                     <th style={styles.tableCell}>Customer Name</th>
// //                                     <th style={styles.tableCellRight}>Total Amount</th>
// //                                     <th style={styles.tableCell}>Date</th>
// //                                     <th style={styles.tableCellCenter}>Actions</th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody>
// //                                 {filteredCustomerSummary.length === 0 ? (
// //                                     <tr>
// //                                         <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
// //                                             {searchTerm ? 'No matching customers found' : 'No data found for selected date'}
// //                                         </td>
// //                                     </tr>
// //                                 ) : (
// //                                     filteredCustomerSummary.map((customer) => (
// //                                         <tr key={customer.sr_no}>
// //                                             <td style={styles.tableCell}>{customer.sr_no}</td>
// //                                             <td style={styles.tableCell}>
// //                                                 <strong>{customer.customer_name}</strong>
// //                                                 {customer.customer_name_urdu && (
// //                                                     <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif" }}>
// //                                                         {customer.customer_name_urdu}
// //                                                     </div>
// //                                                 )}
// //                                             </td>
// //                                             <td style={styles.tableCellRight}>
// //                                                 <strong style={{ color: '#4CAF50' }}>₨ {customer.total_amount.toLocaleString()}</strong>
// //                                             </td>
// //                                             <td style={styles.tableCell}>{formatDateForDisplay(customer.invoice_date)}</td>
// //                                             <td style={styles.tableCellCenter}>
// //                                                 <button
// //                                                     onClick={() => generateSingleCustomerReport(customer)}
// //                                                     style={styles.actionButton}
// //                                                     title="Print Report"
// //                                                 >
// //                                                     <FiFileText size={18} />
// //                                                 </button>
// //                                             </td>
// //                                         </tr>
// //                                     ))
// //                                 )}
// //                             </tbody>
// //                             {filteredCustomerSummary.length > 0 && (
// //                                 <tfoot>
// //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// //                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
// //                                         <td style={styles.tableCellRight}>
// //                                             <strong style={{ color: '#4CAF50' }}>
// //                                                 ₨ {filteredCustomerSummary.reduce((sum, c) => sum + c.total_amount, 0).toLocaleString()}
// //                                             </strong>
// //                                         </td>
// //                                         <td colSpan="2"></td>
// //                                     </tr>
// //                                 </tfoot>
// //                             )}
// //                         </table>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* Item Wise Summary Table */}
// //             {activeTab === 'item' && (
// //                 <div style={styles.card}>
// //                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
// //                         📦 Item Summary
// //                         {searchTerm && ` (Filtered: ${filteredItemSummary.length} of ${itemWiseSummary.length})`}
// //                     </h3>
// //                     <div style={{ overflowX: 'auto' }}>
// //                         <table style={styles.table}>
// //                             <thead>
// //                                 <tr style={styles.tableHeader}>
// //                                     <th style={styles.tableCell}>#</th>
// //                                     <th style={styles.tableCell}>Item Name</th>
// //                                     <th style={styles.tableCellRight}>Quantity</th>
// //                                     <th style={styles.tableCellRight}>Total Amount</th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody>
// //                                 {filteredItemSummary.length === 0 ? (
// //                                     <tr>
// //                                         <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
// //                                             {searchTerm ? 'No matching items found' : 'No items found for selected date'}
// //                                         </td>
// //                                     </tr>
// //                                 ) : (
// //                                     filteredItemSummary.map((item) => (
// //                                         <tr key={item.sr_no}>
// //                                             <td style={styles.tableCell}>{item.sr_no}</td>
// //                                             <td style={styles.tableCell}>
// //                                                 <div>{item.item_name}</div>
// //                                                 {item.item_name_urdu && (
// //                                                     <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif", marginTop: '4px' }}>
// //                                                         {item.item_name_urdu}
// //                                                     </div>
// //                                                 )}
// //                                             </td>
// //                                             <td style={styles.tableCellRight}>
// //                                                 <strong>{item.total_quantity.toLocaleString()}</strong>
// //                                             </td>
// //                                             <td style={styles.tableCellRight}>
// //                                                 <strong style={{ color: '#4CAF50' }}>₨ {item.total_amount.toLocaleString()}</strong>
// //                                             </td>
// //                                         </tr>
// //                                     ))
// //                                 )}
// //                             </tbody>
// //                             {filteredItemSummary.length > 0 && (
// //                                 <tfoot>
// //                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
// //                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
// //                                         <td style={styles.tableCellRight}>
// //                                             <strong>{filteredItemSummary.reduce((sum, i) => sum + (i.total_quantity || 0), 0).toLocaleString()}</strong>
// //                                         </td>
// //                                         <td style={styles.tableCellRight}>
// //                                             <strong style={{ color: '#4CAF50' }}>
// //                                                 ₨ {filteredItemSummary.reduce((sum, i) => sum + (i.total_amount || 0), 0).toLocaleString()}
// //                                             </strong>
// //                                         </td>
// //                                     </tr>
// //                                 </tfoot>
// //                             )}
// //                         </table>
// //                     </div>
// //                 </div>
// //             )}

// //             <style>{`
// //                 @keyframes spin {
// //                     0% { transform: rotate(0deg); }
// //                     100% { transform: rotate(360deg); }
// //                 }
// //             `}</style>
// //         </div>
// //     );
// // }

// // export default Reports;

// import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
// import { toast } from 'react-hot-toast';
// import { FiPrinter, FiCalendar, FiFileText, FiUser, FiPackage, FiSearch } from 'react-icons/fi';
// import { NavigationContext } from '../App';

// function Reports() {
//     const { goBack } = useContext(NavigationContext);
//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//     const [invoices, setInvoices] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [customerSummary, setCustomerSummary] = useState([]);
//     const [itemWiseSummary, setItemWiseSummary] = useState([]);
//     const [tempDate, setTempDate] = useState('');
//     const [showDatePicker, setShowDatePicker] = useState(false);
//     const [activeTab, setActiveTab] = useState('customer');
//     const [searchTerm, setSearchTerm] = useState('');

//     const dateInputRef = useRef(null);
//     const datePickerRef = useRef(null);
//     const isInitialMount = useRef(true);

//     useEffect(() => {
//         loadData();

//         // Handle click outside to close date picker
//         const handleClickOutside = (event) => {
//             if (datePickerRef.current && !datePickerRef.current.contains(event.target) &&
//                 dateInputRef.current && !dateInputRef.current.contains(event.target)) {
//                 setShowDatePicker(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     // Set initial temp date when selectedDate changes
//     useEffect(() => {
//         if (selectedDate) {
//             const displayDate = formatDateForDisplay(selectedDate);
//             setTempDate(displayDate);
//         }
//     }, [selectedDate]);

//     // Auto fetch when selectedDate changes (skip initial mount if needed)
//     useEffect(() => {
//         if (isInitialMount.current) {
//             isInitialMount.current = false;
//             // Load summaries after invoices are loaded
//             if (invoices.length > 0) {
//                 loadSummaries();
//             }
//         } else if (selectedDate && invoices.length > 0) {
//             loadSummaries();
//         }
//     }, [selectedDate, invoices]);

//     const loadData = async () => {
//         try {
//             const invoicesData = await window.electron.database.getInvoices();
//             setInvoices(invoicesData || []);
//         } catch (error) {
//             console.error('Failed to load data:', error);
//             toast.error('Failed to load data');
//         }
//     };

//     const loadSummaries = useCallback(async () => {
//         if (!selectedDate) return;

//         setLoading(true);
//         try {
//             const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();

//             // Filter invoices by selected date (exact match)
//             const filteredInvoices = allInvoices.filter(inv => {
//                 const invDate = inv.invoice_date;
//                 return invDate === selectedDate;
//             });

//             console.log('Selected Date:', selectedDate);
//             console.log('Filtered Invoices:', filteredInvoices.length);

//             // Group by customer for customer summary
//             const customerMap = new Map();
//             for (const invoice of filteredInvoices) {
//                 const customerName = invoice.customer_name;
//                 if (!customerMap.has(customerName)) {
//                     let customerUrduName = '';
//                     if (invoice.account_id) {
//                         try {
//                             const account = await window.electron.database.getAccountById(invoice.account_id);
//                             customerUrduName = account?.customer_name_urdu || '';
//                         } catch (err) {
//                             console.error('Error fetching account:', err);
//                         }
//                     }
//                     customerMap.set(customerName, {
//                         customer_name: customerName,
//                         customer_name_urdu: customerUrduName,
//                         total_amount: 0,
//                         invoice_date: invoice.invoice_date,
//                         invoice_id: invoice.invoice_id,
//                         voucher_id: invoice.voucher_id
//                     });
//                 }
//                 const customer = customerMap.get(customerName);
//                 customer.total_amount += invoice.net_amount || 0;
//                 if (invoice.invoice_date > customer.invoice_date) {
//                     customer.invoice_date = invoice.invoice_date;
//                     customer.invoice_id = invoice.invoice_id;
//                     customer.voucher_id = invoice.voucher_id;
//                 }
//             }

//             const customerList = Array.from(customerMap.values()).map((customer, index) => ({
//                 sr_no: index + 1,
//                 ...customer
//             }));
//             setCustomerSummary(customerList);

//             // Calculate item summary from invoice details
//             const itemsMap = new Map();

//             for (const invoice of filteredInvoices) {
//                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//                 console.log(`Invoice ${invoice.invoice_id} details:`, details.length);

//                 for (const item of details) {
//                     const itemId = item.item_id;
//                     const itemKey = itemId || item.item_name;

//                     if (!itemsMap.has(itemKey)) {
//                         let itemNameUrdu = item.item_name_urdu || '';
//                         if (itemId && !itemNameUrdu) {
//                             try {
//                                 const product = await window.electron.database.getProductById(itemId);
//                                 itemNameUrdu = product?.item_name_urdu || '';
//                             } catch (err) {
//                                 console.error('Error fetching product:', err);
//                             }
//                         }
//                         itemsMap.set(itemKey, {
//                             item_name: item.item_name,
//                             item_name_urdu: itemNameUrdu,
//                             total_quantity: 0,
//                             total_amount: 0
//                         });
//                     }
//                     const itemData = itemsMap.get(itemKey);
//                     itemData.total_quantity += parseFloat(item.quantity) || 0;
//                     itemData.total_amount += parseFloat(item.amount) || 0;
//                 }
//             }

//             const itemList = Array.from(itemsMap.values()).map((item, index) => ({
//                 sr_no: index + 1,
//                 item_name: item.item_name,
//                 item_name_urdu: item.item_name_urdu,
//                 total_quantity: item.total_quantity,
//                 total_amount: item.total_amount
//             }));

//             console.log('Calculated Item Summary:', itemList.length);
//             setItemWiseSummary(itemList);

//             if (filteredInvoices.length === 0 && !isInitialMount.current) {
//                 toast.error('No invoices found for selected date');
//             }

//         } catch (error) {
//             console.error('Failed to load summaries:', error);
//             toast.error('Failed to load summaries: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     }, [selectedDate, invoices]);

//     // Filtered data based on search term
//     const filteredCustomerSummary = useMemo(() => {
//         if (!searchTerm.trim()) return customerSummary;
//         const searchLower = searchTerm.toLowerCase();
//         return customerSummary.filter(customer =>
//             customer.customer_name.toLowerCase().includes(searchLower) ||
//             (customer.customer_name_urdu && customer.customer_name_urdu.includes(searchTerm))
//         );
//     }, [customerSummary, searchTerm]);

//     const filteredItemSummary = useMemo(() => {
//         if (!searchTerm.trim()) return itemWiseSummary;
//         const searchLower = searchTerm.toLowerCase();
//         return itemWiseSummary.filter(item =>
//             item.item_name.toLowerCase().includes(searchLower) ||
//             (item.item_name_urdu && item.item_name_urdu.includes(searchTerm))
//         );
//     }, [itemWiseSummary, searchTerm]);

//     const formatDateForDisplay = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) return '';
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//     };

//     const formatDateForStorage = (dateStr) => {
//         if (!dateStr) return null;
//         const parts = dateStr.split('/');
//         if (parts.length === 3) {
//             const day = parseInt(parts[0], 10);
//             const month = parseInt(parts[1], 10);
//             const year = parseInt(parts[2], 10);
//             if (!isNaN(day) && !isNaN(month) && !isNaN(year) &&
//                 day >= 1 && day <= 31 && month >= 1 && month <= 12 && year.toString().length === 4) {
//                 return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
//             }
//         }
//         return null;
//     };

//     const handleDateInputChange = (value) => {
//         setTempDate(value);
//         let formatted = value.replace(/[^0-9]/g, '');
//         if (formatted.length >= 2 && formatted.length < 4) {
//             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
//         } else if (formatted.length >= 4 && formatted.length < 6) {
//             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4);
//         } else if (formatted.length >= 6) {
//             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4, 8);
//         }
//         setTempDate(formatted);

//         if (formatted.length === 10) {
//             const storageDate = formatDateForStorage(formatted);
//             if (storageDate) {
//                 setSelectedDate(storageDate);
//             }
//         }
//     };

//     const handleDateBlur = () => {
//         if (tempDate.length === 10) {
//             const storageDate = formatDateForStorage(tempDate);
//             if (storageDate) {
//                 setSelectedDate(storageDate);
//             } else {
//                 const currentDate = new Date();
//                 const storageDate = currentDate.toISOString().split('T')[0];
//                 setSelectedDate(storageDate);
//                 toast.error('Invalid date format. Using current date.');
//             }
//         } else if (tempDate && tempDate.length > 0) {
//             const currentDate = new Date();
//             const storageDate = currentDate.toISOString().split('T')[0];
//             setSelectedDate(storageDate);
//             toast.error('Invalid date. Using current date.');
//         }
//         setShowDatePicker(false);
//     };

//     const handleDateSelect = useCallback((date) => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const storageDate = `${year}-${month}-${day}`;
//         console.log('Selected date from calendar:', storageDate);
//         setSelectedDate(storageDate);
//         setShowDatePicker(false);
//     }, []);

//     // Function to generate PDF and open in browser
//     const generateAndOpenPDF = async (html, title) => {
//         try {
//             if (window.electron && window.electron.printToPDFAndOpen) {
//                 const pdfPath = await window.electron.printToPDFAndOpen(html);
//                 if (pdfPath) {
//                     toast.success('PDF opened in your default browser');
//                 } else {
//                     toast.error('Failed to generate PDF');
//                 }
//             } else {
//                 // Fallback: Open HTML in new window
//                 const newWindow = window.open('', '_blank');
//                 if (newWindow) {
//                     newWindow.document.write(html);
//                     newWindow.document.close();
//                     newWindow.print();
//                     toast.success('Print dialog opened');
//                 } else {
//                     toast.error('Popup blocked. Please allow popups for this site.');
//                 }
//             }
//         } catch (error) {
//             console.error('Error generating PDF:', error);
//             toast.error('Failed to generate PDF');
//         }
//     };

//     // const generateReportHTML = async (singleCustomer = null) => {
//     //     try {
//     //         const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();
//     //         const filteredInvoices = allInvoices.filter(inv => {
//     //             const invDate = inv.invoice_date;
//     //             return invDate === selectedDate;
//     //         });

//     //         let customerGroups = {};

//     //         if (singleCustomer) {
//     //             const customerInvoices = filteredInvoices.filter(inv => inv.customer_name === singleCustomer.customer_name);

//     //             for (const invoice of customerInvoices) {
//     //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//     //                 const enrichedDetails = await Promise.all(details.map(async (item) => {
//     //                     if (item.item_id) {
//     //                         try {
//     //                             const product = await window.electron.database.getProductById(item.item_id);
//     //                             return {
//     //                                 ...item,
//     //                                 item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
//     //                             };
//     //                         } catch (err) {
//     //                             return item;
//     //                         }
//     //                     }
//     //                     return item;
//     //                 }));

//     //                 const customerKey = invoice.customer_name;
//     //                 if (!customerGroups[customerKey]) {
//     //                     customerGroups[customerKey] = {
//     //                         customerName: invoice.customer_name,
//     //                         customerNameUrdu: singleCustomer.customer_name_urdu || '',
//     //                         customerId: invoice.account_id,
//     //                         invoices: [],
//     //                         totalItems: 0,
//     //                         totalAmount: 0,
//     //                         discount: 0,
//     //                         netAmount: 0
//     //                     };
//     //                 }

//     //                 customerGroups[customerKey].invoices.push({
//     //                     ...invoice,
//     //                     details: enrichedDetails
//     //                 });
//     //                 customerGroups[customerKey].totalItems += invoice.total_weight || 0;
//     //                 customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
//     //                 customerGroups[customerKey].discount += invoice.discount || 0;
//     //                 customerGroups[customerKey].netAmount += invoice.net_amount || 0;
//     //             }
//     //         } else {
//     //             for (const invoice of filteredInvoices) {
//     //                 let customerUrduName = '';
//     //                 if (invoice.account_id) {
//     //                     try {
//     //                         const account = await window.electron.database.getAccountById(invoice.account_id);
//     //                         customerUrduName = account?.customer_name_urdu || '';
//     //                     } catch (err) {
//     //                         console.error('Error fetching account:', err);
//     //                     }
//     //                 }

//     //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//     //                 const enrichedDetails = await Promise.all(details.map(async (item) => {
//     //                     if (item.item_id) {
//     //                         try {
//     //                             const product = await window.electron.database.getProductById(item.item_id);
//     //                             return {
//     //                                 ...item,
//     //                                 item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
//     //                             };
//     //                         } catch (err) {
//     //                             return item;
//     //                         }
//     //                     }
//     //                     return item;
//     //                 }));

//     //                 const customerKey = invoice.customer_name;
//     //                 if (!customerGroups[customerKey]) {
//     //                     customerGroups[customerKey] = {
//     //                         customerName: invoice.customer_name,
//     //                         customerNameUrdu: customerUrduName,
//     //                         customerId: invoice.account_id,
//     //                         invoices: [],
//     //                         totalItems: 0,
//     //                         totalAmount: 0,
//     //                         discount: 0,
//     //                         netAmount: 0
//     //                     };
//     //                 } else if (customerUrduName && !customerGroups[customerKey].customerNameUrdu) {
//     //                     customerGroups[customerKey].customerNameUrdu = customerUrduName;
//     //                 }

//     //                 customerGroups[customerKey].invoices.push({
//     //                     ...invoice,
//     //                     details: enrichedDetails
//     //                 });
//     //                 customerGroups[customerKey].totalItems += invoice.total_weight || 0;
//     //                 customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
//     //                 customerGroups[customerKey].discount += invoice.discount || 0;
//     //                 customerGroups[customerKey].netAmount += invoice.net_amount || 0;
//     //             }
//     //         }

//     //         // Prepare items summary per customer
//     //         const customerItemsSummary = {};
//     //         for (const [customerName, customerData] of Object.entries(customerGroups)) {
//     //             const itemsSummary = {};
//     //             for (const invoice of customerData.invoices) {
//     //                 for (const item of invoice.details) {
//     //                     const itemKey = item.item_id || item.item_name;
//     //                     if (!itemsSummary[itemKey]) {
//     //                         itemsSummary[itemKey] = {
//     //                             itemName: item.item_name,
//     //                             itemNameUrdu: item.item_name_urdu || '',
//     //                             totalQuantity: 0,
//     //                             totalAmount: 0,
//     //                             avgRate: 0
//     //                         };
//     //                     }
//     //                     itemsSummary[itemKey].totalQuantity += item.quantity;
//     //                     itemsSummary[itemKey].totalAmount += item.amount;
//     //                 }
//     //             }
//     //             for (const item of Object.values(itemsSummary)) {
//     //                 item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
//     //             }
//     //             customerItemsSummary[customerName] = Object.values(itemsSummary);
//     //         }

//     //         const formattedDate = formatDateForDisplay(selectedDate);

//     //         const html = `
//     //             <!DOCTYPE html>
//     //             <html dir="rtl">
//     //             <head>
//     //                 <meta charset="UTF-8">
//     //                 <title>تقرير المبيعات ${formattedDate}</title>
//     //                 <style>
//     //                     * {
//     //                         margin: 0;
//     //                         padding: 0;
//     //                         box-sizing: border-box;
//     //                     }

//     //                     body {
//     //                         font-family: 'Segoe UI', 'Arial', 'Noto Nastaliq Urdu', 'Urdu Typesetting', 'Times New Roman', sans-serif;
//     //                         padding: 20px;
//     //                         background: white;
//     //                         color: #333;
//     //                     }

//     //                     .report-container {
//     //                         max-width: 1200px;
//     //                         margin: 0 auto;
//     //                     }

//     //                     /* Header Section */
//     //                     .header {
//     //                         text-align: center;
//     //                         margin-bottom: 30px;
//     //                         padding-bottom: 20px;
//     //                         border-bottom: 3px solid #4CAF50;
//     //                     }

//     //                     .company-name {
//     //                         font-size: 28px;
//     //                         font-weight: bold;
//     //                         color: #2c3e50;
//     //                         margin-bottom: 5px;
//     //                     }

//     //                     .report-title {
//     //                         font-size: 24px;
//     //                         font-weight: bold;
//     //                         color: #4CAF50;
//     //                         margin-top: 10px;
//     //                     }

//     //                     .date-range {
//     //                         font-size: 14px;
//     //                         color: #666;
//     //                         margin-top: 10px;
//     //                     }

//     //                     /* Customer Section */
//     //                     .customer-section {
//     //                         margin-bottom: 40px;
//     //                         page-break-after: always;
//     //                     }

//     //                     .customer-section:last-child {
//     //                         page-break-after: auto;
//     //                     }

//     //                     .customer-header {
//     //                         text-align: center;
//     //                         margin-bottom: 20px;
//     //                         background: #bbbcbb;
//     //                         border-radius: 12px;
//     //                         overflow: hidden;
//     //                         box-shadow: 0 4px 15px rgba(0,0,0,0.1);
//     //                         height: 100px;
//     //                     }

//     //                     .customer-name {
//     //                         font-size: 40px;
//     //                         color: black;
//     //                         font-weight: bold;
//     //                         color: white;
//     //                         padding: 20px;
//     //                         margin: 0;
//     //                         color:'#000' !important;
//     //                         text-align: center;
//     //                         font-family: 'Jameel Noori Nastaleeq' ;
//     //                         text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
//     //                     }

//     //                     .customer-date {
//     //                         font-size: 14px;
//     //                         color: rgba(255,255,255,0.9);
//     //                         padding: 10px 20px;
//     //                         background: rgba(0,0,0,0.1);
//     //                         text-align: center;
//     //                     }

//     //                     /* Items Table */
//     //                     .items-table {
//     //                         width: 100%;
//     //                         border-collapse: collapse;
//     //                         margin-top: 20px;
//     //                         margin-bottom: 20px;
//     //                         box-shadow: 0 2px 8px rgba(0,0,0,0.05);
//     //                     }

//     //                     .items-table th {
//     //                         background: #bbbcbb;
//     //                         color: white;
//     //                         border: 1px solid #ddd;
//     //                         padding: 12px;
//     //                         text-align: center;
//     //                         font-size: 18px;
//     //                         font-weight: bold;
//     //                     }

//     //                     .items-table td {
//     //                         border: 1px solid #ddd;
//     //                         padding: 10px 12px;
//     //                         text-align: center;
//     //                         font-size: 16px;
//     //                     }

//     //                     .items-table td:first-child,
//     //                     .items-table td:last-child {
//     //                         font-weight: bold;
//     //                     }

//     //                     .total-row {
//     //                         background: #bbbcbb;
//     //                         font-weight: bold;
//     //                         border-top: 2px solid #4CAF50;
//     //                     }

//     //                     .total-row td {
//     //                         font-weight: bold;
//     //                         font-size: 18px;
//     //                         padding: 12px;
//     //                     }

//     //                     /* Footer */
//     //                     .footer {
//     //                         margin-top: 40px;
//     //                         padding-top: 20px;
//     //                         text-align: center;
//     //                         border-top: 1px solid #e0e0e0;
//     //                         font-size: 12px;
//     //                         color: #999;
//     //                     }

//     //                     .footer-developer {
//     //                         font-size: 14px;
//     //                         color: #4CAF50;
//     //                         margin-top: 10px;
//     //                         font-weight: bold;
//     //                     }

//     //                     @media print {
//     //                         body {
//     //                             padding: 10px;
//     //                         }
//     //                         .customer-section {
//     //                             page-break-after: always;
//     //                         }
//     //                         .items-table th,
//     //                         .items-table td {
//     //                             border-color: #000;
//     //                         }
//     //                     }
//     //                 </style>
//     //             </head>
//     //             <body>
//     //                 <div class="report-container">

//     //                     ${Object.entries(customerGroups).map(([customerName, customerData]) => {
//     //             const itemsSummary = customerItemsSummary[customerName] || [];
//     //             const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
//     //             const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);

//     //             // Get the most recent invoice date for this customer
//     //             const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
//     //             const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());

//     //             // Display customer name in Urdu if available, otherwise English
//     //             const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== ''
//     //                 ? customerData.customerNameUrdu
//     //                 : customerData.customerName;

//     //             return `
//     //                         <div class="customer-section">
//     //                             <div class="customer-header">
//     //                                 <div class="customer-name" style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
//     //                                     ${displayCustomerName}
//     //                                 </div>

//     //                             </div>
//     //                             <div class="customer-date" style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif; font-size: 18px; float: right; color: #060606; font-weight: bold; margin-bottom: 10px;">
//     //                                     تاريخ: ${"  " + invoiceDate}
//     //                                 </div>

//     //                             <table class="items-table">
//     //                                 <thead>
//     //                                     <tr>
//     //                                         <th  style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;  color: #000; font-size:'20px'" >تعداد</th>
//     //                                         <th  style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif; color: #000;  font-size:'20px'"  >آئٹم</th>
//     //                                         <th  style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;  color: #000; font-size:'20px' " >ریٹ</th>
//     //                                         <th  style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif; color: #000;  font-size:'20px' "  >رقم</th>
//     //                                     </thead>
//     //                                 <tbody>
//     //                                     ${itemsSummary.map((item) => {
//     //                 const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
//     //                     ? item.itemNameUrdu
//     //                     : item.itemName;

//     //                 return `
//     //                                             <tr>
//     //                                                 <td style="font-size: 16px;">${item.totalQuantity.toLocaleString()}</td>
//     //                                                 <td style="font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif; font-size: 16px;">
//     //                                                     ${displayItemName}
//     //                                                 </td>
//     //                                                 <td style="font-size: 16px;">${Math.round(item.avgRate).toLocaleString()}</td>
//     //                                                 <td style="font-size: 16px; color: #4CAF50; font-weight: bold;">
//     //                                                     ${item.totalAmount.toLocaleString()}
//     //                                                 </td>
//     //                                             </tr>
//     //                                         `;
//     //             }).join('')}
//     //                                     <tr class="total-row">
//     //                                         <td style="font-size: 18px; font-weight: bold;">${totalItems.toLocaleString()}</td>
//     //                                         <td style="font-size: 18px; font-weight: bold; font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;">
//     //                                            -
//     //                                         </td>
//     //                                         <td style="font-size: 18px; font-weight: bold;">-</td>
//     //                                         <td style="font-size: 18px; font-weight: bold; color: #4CAF50;">
//     //                                             ${totalAmount.toLocaleString()}
//     //                                         </td>
//     //                                     </tr>
//     //                                 </tbody>
//     //                             </table>
//     //                         </div>
//     //                     `;
//     //         }).join('')}

//     //                 </div>
//     //             </body>
//     //             </html>
//     //         `;

//     //         return html;

//     //         // <div class="footer">
//     //         //                 <p>This report was generated by Inventory Management System</p>
//     //         //                 <p class="footer-developer">Developed By Ultimate Solutions</p>
//     //         //                 <p>${new Date().toLocaleString()}</p>
//     //         //             </div>
//     //     } catch (error) {
//     //         console.error('Error generating report HTML:', error);
//     //         toast.error('Failed to generate report');
//     //         return null;
//     //     }
//     // };

//     // const generateReportHTML = async (singleCustomer = null) => {
//     //     try {
//     //         const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();
//     //         const filteredInvoices = allInvoices.filter(inv => {
//     //             const invDate = inv.invoice_date;
//     //             return invDate === selectedDate;
//     //         });

//     //         let customerGroups = {};

//     //         if (singleCustomer) {
//     //             const customerInvoices = filteredInvoices.filter(inv => inv.customer_name === singleCustomer.customer_name);
//     //             console.log('customerInvoices', customerInvoices)
//     //             for (const invoice of customerInvoices) {
//     //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//     //                 const enrichedDetails = await Promise.all(details.map(async (item) => {
//     //                     if (item.item_id) {
//     //                         try {
//     //                             const product = await window.electron.database.getProductById(item.item_id);
//     //                             return {
//     //                                 ...item,
//     //                                 item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
//     //                             };
//     //                         } catch (err) {
//     //                             return item;
//     //                         }
//     //                     }
//     //                     return item;
//     //                 }));

//     //                 const customerKey = invoice.customer_name;
//     //                 if (!customerGroups[customerKey]) {
//     //                     let customerMobile = '';
//     //                     let customerUrduName = '';
//     //                     if (invoice.account_id) {
//     //                         try {
//     //                             const account = await window.electron.database.getAccountById(invoice.account_id);
//     //                             customerMobile = account?.mobile_number || '';
//     //                             customerUrduName = account?.customer_name_urdu || '';
//     //                         } catch (err) {
//     //                             console.error('Error fetching account:', err);
//     //                         }
//     //                     }

//     //                     customerGroups[customerKey] = {
//     //                         customerName: invoice.customer_name,
//     //                         customerNameUrdu: customerUrduName || singleCustomer.customer_name_urdu || '',
//     //                         customerId: invoice.account_id,
//     //                         customerMobile: customerMobile,
//     //                         invoices: [],
//     //                         totalItems: 0,
//     //                         totalAmount: 0,
//     //                         discount: 0,
//     //                         netAmount: 0
//     //                     };
//     //                 }

//     //                 customerGroups[customerKey].invoices.push({
//     //                     ...invoice,
//     //                     details: enrichedDetails
//     //                 });
//     //                 customerGroups[customerKey].totalItems += invoice.total_weight || 0;
//     //                 customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
//     //                 customerGroups[customerKey].discount += invoice.discount || 0;
//     //                 customerGroups[customerKey].netAmount += invoice.net_amount || 0;
//     //             }
//     //         } else {
//     //             for (const invoice of filteredInvoices) {
//     //                 let customerUrduName = '';
//     //                 let customerMobile = '';
//     //                 if (invoice.account_id) {
//     //                     try {
//     //                         const account = await window.electron.database.getAccountById(invoice.account_id);
//     //                         customerUrduName = account?.customer_name_urdu || '';
//     //                         customerMobile = account?.mobile_number || '';
//     //                     } catch (err) {
//     //                         console.error('Error fetching account:', err);
//     //                     }
//     //                 }

//     //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//     //                 const enrichedDetails = await Promise.all(details.map(async (item) => {
//     //                     if (item.item_id) {
//     //                         try {
//     //                             const product = await window.electron.database.getProductById(item.item_id);
//     //                             return {
//     //                                 ...item,
//     //                                 item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
//     //                             };
//     //                         } catch (err) {
//     //                             return item;
//     //                         }
//     //                     }
//     //                     return item;
//     //                 }));

//     //                 const customerKey = invoice.customer_name;
//     //                 if (!customerGroups[customerKey]) {
//     //                     customerGroups[customerKey] = {
//     //                         customerName: invoice.customer_name,
//     //                         customerNameUrdu: customerUrduName,
//     //                         customerId: invoice.account_id,
//     //                         customerMobile: customerMobile,
//     //                         invoices: [],
//     //                         totalItems: 0,
//     //                         totalAmount: 0,
//     //                         discount: 0,
//     //                         netAmount: 0
//     //                     };
//     //                 } else {
//     //                     if (customerUrduName && !customerGroups[customerKey].customerNameUrdu) {
//     //                         customerGroups[customerKey].customerNameUrdu = customerUrduName;
//     //                     }
//     //                     if (customerMobile && !customerGroups[customerKey].customerMobile) {
//     //                         customerGroups[customerKey].customerMobile = customerMobile;
//     //                     }
//     //                 }

//     //                 customerGroups[customerKey].invoices.push({
//     //                     ...invoice,
//     //                     details: enrichedDetails
//     //                 });
//     //                 customerGroups[customerKey].totalItems += invoice.total_weight || 0;
//     //                 customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
//     //                 customerGroups[customerKey].discount += invoice.discount || 0;
//     //                 customerGroups[customerKey].netAmount += invoice.net_amount || 0;
//     //             }
//     //         }

//     //         console.log('customerGroups', customerGroups);

//     //         // Prepare items summary per customer
//     //         const customerItemsSummary = {};
//     //         for (const [customerName, customerData] of Object.entries(customerGroups)) {
//     //             const itemsSummary = {};
//     //             for (const invoice of customerData.invoices) {
//     //                 for (const item of invoice.details) {
//     //                     const itemKey = item.item_id || item.item_name;
//     //                     if (!itemsSummary[itemKey]) {
//     //                         itemsSummary[itemKey] = {
//     //                             itemName: item.item_name,
//     //                             itemNameUrdu: item.item_name_urdu || '',
//     //                             totalQuantity: 0,
//     //                             totalAmount: 0,
//     //                             avgRate: 0
//     //                         };
//     //                     }
//     //                     itemsSummary[itemKey].totalQuantity += item.quantity;
//     //                     itemsSummary[itemKey].totalAmount += item.amount;
//     //                 }
//     //             }
//     //             for (const item of Object.values(itemsSummary)) {
//     //                 item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
//     //             }
//     //             customerItemsSummary[customerName] = Object.values(itemsSummary);
//     //         }

//     //         const formattedDate = formatDateForDisplay(selectedDate);

//     //         const html = `
//     //         <!DOCTYPE html>
//     //         <html dir="rtl">
//     //         <head>
//     //             <meta charset="UTF-8">
//     //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     //             <title>تقرير المبيعات ${formattedDate}</title>
//     //             <style>
//     //                 @page {
//     //                     size: 105mm 148mm;
//     //                     margin: 3mm;
//     //                 }

//     //                 * {
//     //                     margin: 0;
//     //                     padding: 0;
//     //                     box-sizing: border-box;
//     //                 }

//     //                 body {
//     //                     font-family: 'Segoe UI', 'Arial', 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Urdu Typesetting', 'Times New Roman', sans-serif;
//     //                     background: white;
//     //                     color: #333;
//     //                     width: 105mm;
//     //                     min-height: 148mm;
//     //                     margin: 0 auto;
//     //                     padding: 3mm;
//     //                 }

//     //                 .report-container {
//     //                     width: 100%;
//     //                     height: 100%;
//     //                 }

//     //                 /* Header Section */
//     //                 .header {
//     //                     text-align: center;
//     //                     margin-bottom: 8px;
//     //                     padding-bottom: 6px;
//     //                     border-bottom: 2px solid #4CAF50;
//     //                 }

//     //                 .company-name {
//     //                     font-size: 14px;
//     //                     font-weight: bold;
//     //                     color: #2c3e50;
//     //                 }

//     //                 .report-title {
//     //                     font-size: 12px;
//     //                     font-weight: bold;
//     //                     color: #4CAF50;
//     //                     margin-top: 2px;
//     //                 }

//     //                 .date-range {
//     //                     font-size: 9px;
//     //                     color: #666;
//     //                     margin-top: 2px;
//     //                 }

//     //                 /* Customer Section */
//     //                 .customer-section {
//     //                     margin-bottom: 10px;
//     //                     page-break-after: always;
//     //                     break-after: page;
//     //                     background: #f5f5f5;
//     //                     border-radius: 6px;
//     //                     padding: 6px;
//     //                     position: relative;
//     //                     min-height: 135mm;
//     //                 }

//     //                 .customer-section:last-child {
//     //                     page-break-after: auto;
//     //                     break-after: auto;
//     //                 }

//     //                 .customer-header {
//     //                     text-align: center;
//     //                     margin-bottom: 6px;
//     //                     background: #e0e0e0;
//     //                     border-radius: 6px;
//     //                     padding: 6px;
//     //                 }

//     //                 .customer-name {
//     //                     font-size: 18px;
//     //                     color: #000;
//     //                     font-weight: bold;
//     //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//     //                     line-height: 1.3;
//     //                 }

//     //                 .customer-mobile {
//     //                     font-size: 9px;
//     //                     color: #555;
//     //                     margin-top: 3px;
//     //                     direction: ltr;
//     //                 }

//     //                 .customer-date {
//     //                     font-size: 10px;
//     //                     color: #060606;
//     //                     font-weight: bold;
//     //                     margin-bottom: 5px;
//     //                     text-align: right;
//     //                 }

//     //                 /* Items Table */
//     //                 .items-table {
//     //                     width: 100%;
//     //                     border-collapse: collapse;
//     //                     margin: 6px 0;
//     //                     background: white;
//     //                     border-radius: 4px;
//     //                     overflow: hidden;
//     //                 }

//     //                 .items-table th {
//     //                     background: #d0d0d0;
//     //                     color: #000;
//     //                     border: 1px solid #c0c0c0;
//     //                     padding: 4px 2px;
//     //                     text-align: center;
//     //                     font-size: 9px;
//     //                     font-weight: bold;
//     //                 }

//     //                 .items-table td {
//     //                     border: 1px solid #e0e0e0;
//     //                     padding: 4px 2px;
//     //                     text-align: center;
//     //                     font-size: 9px;
//     //                     background: #fafafa;
//     //                 }

//     //                 .total-row {
//     //                     background: #e8e8e8;
//     //                     font-weight: bold;
//     //                     border-top: 2px solid #4CAF50;
//     //                 }

//     //                 .total-row td {
//     //                     font-weight: bold;
//     //                     font-size: 10px;
//     //                     padding: 5px 2px;
//     //                     background: #e8e8e8;
//     //                 }

//     //                 /* Footer - Single line */
//     //                 .footer {
//     //                     position: absolute;
//     //                     bottom: 3mm;
//     //                     left: 0;
//     //                     right: 0;
//     //                     text-align: center;
//     //                     font-size: 8px;
//     //                     color: #666;
//     //                     padding: 3px 0;
//     //                     border-top: 1px solid #d0d0d0;
//     //                     width: 100%;
//     //                 }

//     //                 .footer-text {
//     //                     font-size: 8px;
//     //                     color: #333;
//     //                     direction: ltr;
//     //                 }

//     //                 @media print {
//     //                     body {
//     //                         padding: 0;
//     //                         margin: 0;
//     //                         width: 105mm;
//     //                         min-height: 148mm;
//     //                     }
//     //                     .customer-section {
//     //                         page-break-after: always;
//     //                         break-after: page;
//     //                         page-break-inside: avoid;
//     //                     }
//     //                     .footer {
//     //                         position: fixed;
//     //                         bottom: 3mm;
//     //                     }
//     //                 }
//     //             </style>
//     //         </head>
//     //         <body>
//     //             <div class="report-container">
//     //                 ${Object.entries(customerGroups).map(([customerName, customerData]) => {
//     //             const itemsSummary = customerItemsSummary[customerName] || [];
//     //             const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
//     //             const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);

//     //             const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
//     //             const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());

//     //             const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== ''
//     //                 ? customerData.customerNameUrdu
//     //                 : customerData.customerName;

//     //             const displayCustomerMobile = customerData.customerMobile || '';

//     //             return `
//     //                     <div class="customer-section">
//     //                         <div class="customer-header">
//     //                             <div class="customer-name">
//     //                                 ${displayCustomerName}
//     //                             </div>
//     //                             ${displayCustomerMobile ? `<div class="customer-mobile">📞 ${displayCustomerMobile}</div>` : ''}
//     //                         </div>
//     //                         <div class="customer-date">
//     //                             تاريخ: ${invoiceDate}
//     //                         </div>

//     //                         <table class="items-table">
//     //                             <thead>
//     //                                 <tr>
//     //                                     <th>تعداد</th>
//     //                                     <th>آئٹم</th>
//     //                                     <th>ریٹ</th>
//     //                                     <th>رقم</th>
//     //                                 </tr>
//     //                             </thead>
//     //                             <tbody>
//     //                                 ${itemsSummary.map((item) => {
//     //                 const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
//     //                     ? item.itemNameUrdu
//     //                     : item.itemName;

//     //                 return `
//     //                                         <tr>
//     //                                             <td>${item.totalQuantity.toLocaleString()}</td>
//     //                                             <td style="font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">${displayItemName}</td>
//     //                                             <td>${Math.round(item.avgRate).toLocaleString()}</td>
//     //                                             <td style="color: #000; font-weight: bold;">${item.totalAmount.toLocaleString()}</td>
//     //                                         </tr>
//     //                                     `;
//     //             }).join('')}
//     //                                 <tr class="total-row">
//     //                                     <td style="font-weight: bold;">${totalItems.toLocaleString()}</td>
//     //                                     <td style="font-weight: bold;">ٹو ٹل</td>
//     //                                     <td style="font-weight: bold;">-</td>
//     //                                     <td style="font-weight: bold; color: #000;">${totalAmount.toLocaleString()}</td>
//     //                                 </tr>
//     //                             </tbody>
//     //                         </table>

//     //                         <div class="footer">
//     //                             <span class="footer-text">Ultimate Solution 03006468177</span>
//     //                         </div>
//     //                     </div>
//     //                 `;
//     //         }).join('')}
//     //             </div>
//     //         </body>
//     //         </html>
//     //     `;

//     //         return html;

//     //     } catch (error) {
//     //         console.error('Error generating report HTML:', error);
//     //         toast.error('Failed to generate report');
//     //         return null;
//     //     }
//     // };

//     // const generateReportHTML = async (singleCustomer = null) => {
//     //     try {
//     //         const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();
//     //         const filteredInvoices = allInvoices.filter(inv => {
//     //             const invDate = inv.invoice_date;
//     //             return invDate === selectedDate;
//     //         });

//     //         // Get all accounts for lookup by name
//     //         const allAccounts = await window.electron.database.getAccounts();
//     //         const accountByNameMap = new Map();
//     //         allAccounts.forEach(account => {
//     //             if (account.customer_name) {
//     //                 accountByNameMap.set(account.customer_name, account);
//     //             }
//     //         });

//     //         let customerGroups = {};

//     //         if (singleCustomer) {
//     //             const customerInvoices = filteredInvoices.filter(inv => inv.customer_name === singleCustomer.customer_name);

//     //             for (const invoice of customerInvoices) {
//     //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//     //                 const enrichedDetails = await Promise.all(details.map(async (item) => {
//     //                     if (item.item_id) {
//     //                         try {
//     //                             const product = await window.electron.database.getProductById(item.item_id);
//     //                             return {
//     //                                 ...item,
//     //                                 item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
//     //                             };
//     //                         } catch (err) {
//     //                             return item;
//     //                         }
//     //                     }
//     //                     return item;
//     //                 }));

//     //                 const customerKey = invoice.customer_name;
//     //                 if (!customerGroups[customerKey]) {
//     //                     let customerMobile = '';
//     //                     let customerUrduName = '';

//     //                     // Try to get account by name first
//     //                     const accountByName = accountByNameMap.get(invoice.customer_name);
//     //                     if (accountByName) {
//     //                         customerMobile = accountByName.mobile_number || '';
//     //                         customerUrduName = accountByName.customer_name_urdu || '';
//     //                     }

//     //                     // If not found by name, try by account_id
//     //                     if (!customerUrduName && invoice.account_id) {
//     //                         try {
//     //                             const account = await window.electron.database.getAccountById(invoice.account_id);
//     //                             customerMobile = account?.mobile_number || '';
//     //                             customerUrduName = account?.customer_name_urdu || '';
//     //                         } catch (err) {
//     //                             console.error('Error fetching account:', err);
//     //                         }
//     //                     }

//     //                     customerGroups[customerKey] = {
//     //                         customerName: invoice.customer_name,
//     //                         customerNameUrdu: customerUrduName || singleCustomer?.customer_name_urdu || '',
//     //                         customerId: invoice.account_id,
//     //                         customerMobile: customerMobile,
//     //                         invoices: [],
//     //                         totalItems: 0,
//     //                         totalAmount: 0,
//     //                         discount: 0,
//     //                         netAmount: 0
//     //                     };
//     //                 }

//     //                 customerGroups[customerKey].invoices.push({
//     //                     ...invoice,
//     //                     details: enrichedDetails
//     //                 });
//     //                 customerGroups[customerKey].totalItems += invoice.total_weight || 0;
//     //                 customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
//     //                 customerGroups[customerKey].discount += invoice.discount || 0;
//     //                 customerGroups[customerKey].netAmount += invoice.net_amount || 0;
//     //             }
//     //         } else {
//     //             for (const invoice of filteredInvoices) {
//     //                 let customerUrduName = '';
//     //                 let customerMobile = '';

//     //                 // Try to get account by name first
//     //                 const accountByName = accountByNameMap.get(invoice.customer_name);
//     //                 if (accountByName) {
//     //                     customerMobile = accountByName.mobile_number || '';
//     //                     customerUrduName = accountByName.customer_name_urdu || '';
//     //                 }

//     //                 // If not found by name, try by account_id
//     //                 if (!customerUrduName && invoice.account_id) {
//     //                     try {
//     //                         const account = await window.electron.database.getAccountById(invoice.account_id);
//     //                         customerMobile = account?.mobile_number || '';
//     //                         customerUrduName = account?.customer_name_urdu || '';
//     //                     } catch (err) {
//     //                         console.error('Error fetching account:', err);
//     //                     }
//     //                 }

//     //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//     //                 const enrichedDetails = await Promise.all(details.map(async (item) => {
//     //                     if (item.item_id) {
//     //                         try {
//     //                             const product = await window.electron.database.getProductById(item.item_id);
//     //                             return {
//     //                                 ...item,
//     //                                 item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
//     //                             };
//     //                         } catch (err) {
//     //                             return item;
//     //                         }
//     //                     }
//     //                     return item;
//     //                 }));

//     //                 const customerKey = invoice.customer_name;
//     //                 if (!customerGroups[customerKey]) {
//     //                     customerGroups[customerKey] = {
//     //                         customerName: invoice.customer_name,
//     //                         customerNameUrdu: customerUrduName,
//     //                         customerId: invoice.account_id,
//     //                         customerMobile: customerMobile,
//     //                         invoices: [],
//     //                         totalItems: 0,
//     //                         totalAmount: 0,
//     //                         discount: 0,
//     //                         netAmount: 0
//     //                     };
//     //                 } else {
//     //                     if (customerUrduName && !customerGroups[customerKey].customerNameUrdu) {
//     //                         customerGroups[customerKey].customerNameUrdu = customerUrduName;
//     //                     }
//     //                     if (customerMobile && !customerGroups[customerKey].customerMobile) {
//     //                         customerGroups[customerKey].customerMobile = customerMobile;
//     //                     }
//     //                 }

//     //                 customerGroups[customerKey].invoices.push({
//     //                     ...invoice,
//     //                     details: enrichedDetails
//     //                 });
//     //                 customerGroups[customerKey].totalItems += invoice.total_weight || 0;
//     //                 customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
//     //                 customerGroups[customerKey].discount += invoice.discount || 0;
//     //                 customerGroups[customerKey].netAmount += invoice.net_amount || 0;
//     //             }
//     //         }

//     //         console.log('customerGroups with Urdu names:', customerGroups);

//     //         // Prepare items summary per customer
//     //         const customerItemsSummary = {};
//     //         for (const [customerName, customerData] of Object.entries(customerGroups)) {
//     //             const itemsSummary = {};
//     //             for (const invoice of customerData.invoices) {
//     //                 for (const item of invoice.details) {
//     //                     const itemKey = item.item_id || item.item_name;
//     //                     if (!itemsSummary[itemKey]) {
//     //                         itemsSummary[itemKey] = {
//     //                             itemName: item.item_name,
//     //                             itemNameUrdu: item.item_name_urdu || '',
//     //                             totalQuantity: 0,
//     //                             totalAmount: 0,
//     //                             avgRate: 0
//     //                         };
//     //                     }
//     //                     itemsSummary[itemKey].totalQuantity += item.quantity;
//     //                     itemsSummary[itemKey].totalAmount += item.amount;
//     //                 }
//     //             }
//     //             for (const item of Object.values(itemsSummary)) {
//     //                 item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
//     //             }
//     //             customerItemsSummary[customerName] = Object.values(itemsSummary);
//     //         }

//     //         const formattedDate = formatDateForDisplay(selectedDate);
//     //         const totalPages = Object.keys(customerGroups).length;

//     //         const html = `
//     //         <!DOCTYPE html>
//     //         <html dir="rtl">
//     //         <head>
//     //             <meta charset="UTF-8">
//     //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     //             <title>تقرير المبيعات ${formattedDate}</title>
//     //             <style>
//     //                 /* Jameel Noori Nastaleeq Font - Primary Urdu Font */
//     //                 @font-face {
//     //                     font-family: 'Jameel Noori Nastaleeq';
//     //                     src: url('https://raw.githubusercontent.com/urdufonts/jameel-noori-nastaleeq/master/JameelNooriNastaleeq.ttf') format('truetype');
//     //                     font-weight: normal;
//     //                     font-style: normal;
//     //                     font-display: swap;
//     //                 }

//     //                 /* Alternative Urdu fonts if Jameel Noori is not available */
//     //                 @font-face {
//     //                     font-family: 'Noto Nastaliq Urdu';
//     //                     src: url('https://fonts.gstatic.com/s/notonastaliqurdu/v15/LhW4MUPbN-oZdNFcBy1bUZ9YpMkqWxWpT12S.ttf') format('truetype');
//     //                     font-weight: normal;
//     //                     font-style: normal;
//     //                     font-display: swap;
//     //                 }

//     //                 @page {
//     //                     size: 105mm 148mm;
//     //                     margin: 3mm;
//     //                 }

//     //                 * {
//     //                     margin: 0;
//     //                     padding: 0;
//     //                     box-sizing: border-box;
//     //                 }

//     //                 body {
//     //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif;
//     //                     background: white !important;
//     //                     color: #333;
//     //                     width: 105mm;
//     //                     min-height: 148mm;
//     //                     margin: 0 auto;
//     //                     padding: 3mm;
//     //                 }

//     //                 .report-container {
//     //                     width: 100%;
//     //                     height: 100%;
//     //                     background: white !important;
//     //                 }

//     //                 .customer-section {
//     //                     margin-bottom: 10px;
//     //                     page-break-after: always;
//     //                     break-after: page;
//     //                     background: #f5f5f5;
//     //                     border-radius: 6px;
//     //                     padding: 6px;
//     //                     position: relative;
//     //                     min-height: 135mm;
//     //                 }

//     //                 .customer-section:last-child {
//     //                     page-break-after: auto;
//     //                     break-after: auto;
//     //                 }

//     //                 .customer-header {
//     //                     text-align: center;
//     //                     margin-bottom: 6px;
//     //                     background: #e0e0e0;
//     //                     border-radius: 6px;
//     //                     padding: 6px;
//     //                 }

//     //                 .customer-name {
//     //                     font-size: 18px;
//     //                     color: #000;
//     //                     font-weight: bold;
//     //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', serif;
//     //                     line-height: 1.5;
//     //                     letter-spacing: 0.5px;
//     //                 }

//     //                 .customer-mobile {
//     //                     font-size: 9px;
//     //                     color: #555;
//     //                     margin-top: 3px;
//     //                     direction: ltr;
//     //                     font-family: 'Segoe UI', Arial, sans-serif;
//     //                 }

//     //                 .customer-date {
//     //                     font-size: 10px;
//     //                     color: #060606;
//     //                     font-weight: bold;
//     //                     margin-bottom: 5px;
//     //                     text-align: right;
//     //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//     //                 }

//     //                 .items-table {
//     //                     width: 100%;
//     //                     border-collapse: collapse;
//     //                     margin: 6px 0;
//     //                     background: white;
//     //                     border-radius: 4px;
//     //                     overflow: hidden;
//     //                 }

//     //                 .items-table th {
//     //                     background: #d0d0d0;
//     //                     color: #000;
//     //                     border: 1px solid #c0c0c0;
//     //                     padding: 4px 2px;
//     //                     text-align: center;
//     //                     font-size: 9px;
//     //                     font-weight: bold;
//     //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//     //                 }

//     //                 .items-table td {
//     //                     border: 1px solid #e0e0e0;
//     //                     padding: 4px 2px;
//     //                     text-align: center;
//     //                     font-size: 9px;
//     //                     background: #fafafa;
//     //                 }

//     //                 .items-table td:first-child,
//     //                 .items-table td:last-child {
//     //                     font-family: 'Segoe UI', Arial, sans-serif;
//     //                 }

//     //                 .items-table td:nth-child(2) {
//     //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', serif;
//     //                 }

//     //                 .total-row {
//     //                     background: #e8e8e8;
//     //                     font-weight: bold;
//     //                     border-top: 2px solid #4CAF50;
//     //                 }

//     //                 .total-row td {
//     //                     font-weight: bold;
//     //                     font-size: 10px;
//     //                     padding: 5px 2px;
//     //                     background: #e8e8e8;
//     //                 }

//     //                 .total-row td:first-child,
//     //                 .total-row td:last-child {
//     //                     font-family: 'Segoe UI', Arial, sans-serif;
//     //                 }

//     //                 .total-row td:nth-child(2) {
//     //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//     //                 }

//     //                 .footer {
//     //                     position: absolute;
//     //                     bottom: 3mm;
//     //                     left: 0;
//     //                     right: 0;
//     //                     text-align: center;
//     //                     font-size: 8px;
//     //                     color: #666;
//     //                     padding: 3px 0;
//     //                     border-top: 1px solid #d0d0d0;
//     //                     width: 100%;
//     //                     display: flex;
//     //                     justify-content: space-between;
//     //                     align-items: center;
//     //                     background: white;
//     //                 }

//     //                 .footer-left {
//     //                     text-align: left;
//     //                     font-size: 8px;
//     //                     color: #333;
//     //                     direction: ltr;
//     //                     font-family: 'Segoe UI', Arial, sans-serif;
//     //                 }

//     //                 .footer-right {
//     //                     text-align: right;
//     //                     font-size: 8px;
//     //                     color: #333;
//     //                     direction: rtl;
//     //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//     //                 }

//     //                 @media print {
//     //                     body {
//     //                         padding: 0;
//     //                         margin: 0;
//     //                         width: 105mm;
//     //                         min-height: 148mm;
//     //                     }
//     //                     .customer-section {
//     //                         page-break-after: always;
//     //                         break-after: page;
//     //                         page-break-inside: avoid;
//     //                     }
//     //                     .footer {
//     //                         position: fixed;
//     //                         bottom: 3mm;
//     //                         left: 0;
//     //                         right: 0;
//     //                     }
//     //                 }
//     //             </style>
//     //         </head>
//     //         <body>
//     //             <div class="report-container" style="background: white !important;">
//     //                 ${Object.entries(customerGroups).map(([customerName, customerData], index) => {
//     //             const itemsSummary = customerItemsSummary[customerName] || [];
//     //             const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
//     //             const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);

//     //             const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
//     //             const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());

//     //             // Use Urdu name if available, otherwise use English name
//     //             const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== '' && customerData.customerNameUrdu !== customerData.customerName
//     //                 ? customerData.customerNameUrdu
//     //                 : customerData.customerName;

//     //             const displayCustomerMobile = customerData.customerMobile || '';
//     //             const pageNumber = index + 1;

//     //             return `
//     //                     <div class="customer-section">
//     //                         <div class="customer-header">
//     //                             <div class="customer-name">
//     //                                 ${displayCustomerName}
//     //                             </div>
//     //                             ${displayCustomerMobile ? `<div class="customer-mobile">📞 ${displayCustomerMobile}</div>` : ''}
//     //                         </div>
//     //                         <div class="customer-date">
//     //                             تاریخ: ${invoiceDate}
//     //                         </div>

//     //                         <table class="items-table">
//     //                             <thead>
//     //                                 <tr>
//     //                                     <th>تعداد</th>
//     //                                     <th>آئٹم</th>
//     //                                     <th>ریٹ</th>
//     //                                     <th>رقم</th>
//     //                                 </tr>
//     //                             </thead>
//     //                             <tbody>
//     //                                 ${itemsSummary.map((item) => {
//     //                 const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
//     //                     ? item.itemNameUrdu
//     //                     : item.itemName;

//     //                 return `
//     //                                         <tr>
//     //                                             <td>${item.totalQuantity.toLocaleString()}</td>
//     //                                             <td>${displayItemName}</td>
//     //                                             <td>${Math.round(item.avgRate).toLocaleString()}</td>
//     //                                             <td style="font-weight: bold;">${item.totalAmount.toLocaleString()}</td>
//     //                                         </tr>
//     //                                     `;
//     //             }).join('')}
//     //                                 <tr class="total-row">
//     //                                     <td style="font-weight: bold;">${totalItems.toLocaleString()}</td>
//     //                                     <td>ٹوٹل</td>
//     //                                     <td style="font-weight: bold;">-</td>
//     //                                     <td style="font-weight: bold;">${totalAmount.toLocaleString()}</td>
//     //                                 </tr>
//     //                             </tbody>
//     //                         </table>

//     //                         <div class="footer">
//     //                             <div class="footer-right" style="font-weight: bold; text-align: right;">page ${pageNumber} / ${totalPages}</div>
//     //                             <div class="footer-left">Ultimate Solution 03006468177</div>
//     //                         </div>
//     //                     </div>
//     //                 `;
//     //         }).join('')}
//     //             </div>
//     //         </body>
//     //         </html>
//     //     `;

//     //         return html;

//     //     } catch (error) {
//     //         console.error('Error generating report HTML:', error);
//     //         toast.error('Failed to generate report');
//     //         return null;
//     //     }
//     // };

//     const generateReportHTML = async (singleCustomer = null) => {
//         try {
//             const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();
//             const filteredInvoices = allInvoices.filter(inv => {
//                 const invDate = inv.invoice_date;
//                 return invDate === selectedDate;
//             });

//             // Get all accounts for lookup by name
//             const allAccounts = await window.electron.database.getAccounts();
//             const accountByNameMap = new Map();
//             allAccounts.forEach(account => {
//                 if (account.customer_name) {
//                     accountByNameMap.set(account.customer_name, account);
//                 }
//             });

//             let customerGroups = {};

//             if (singleCustomer) {
//                 const customerInvoices = filteredInvoices.filter(inv => inv.customer_name === singleCustomer.customer_name);

//                 for (const invoice of customerInvoices) {
//                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//                     const enrichedDetails = await Promise.all(details.map(async (item) => {
//                         if (item.item_id) {
//                             try {
//                                 const product = await window.electron.database.getProductById(item.item_id);
//                                 return {
//                                     ...item,
//                                     item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
//                                 };
//                             } catch (err) {
//                                 return item;
//                             }
//                         }
//                         return item;
//                     }));

//                     const customerKey = invoice.customer_name;
//                     if (!customerGroups[customerKey]) {
//                         let customerMobile = '';
//                         let customerUrduName = '';

//                         const accountByName = accountByNameMap.get(invoice.customer_name);
//                         if (accountByName) {
//                             customerMobile = accountByName.mobile_number || '';
//                             customerUrduName = accountByName.customer_name_urdu || '';
//                         }

//                         if (!customerUrduName && invoice.account_id) {
//                             try {
//                                 const account = await window.electron.database.getAccountById(invoice.account_id);
//                                 customerMobile = account?.mobile_number || '';
//                                 customerUrduName = account?.customer_name_urdu || '';
//                             } catch (err) {
//                                 console.error('Error fetching account:', err);
//                             }
//                         }

//                         customerGroups[customerKey] = {
//                             customerName: invoice.customer_name,
//                             customerNameUrdu: customerUrduName || singleCustomer?.customer_name_urdu || '',
//                             customerId: invoice.account_id,
//                             customerMobile: customerMobile,
//                             invoices: [],
//                             totalItems: 0,
//                             totalAmount: 0,
//                             discount: 0,
//                             netAmount: 0
//                         };
//                     }

//                     customerGroups[customerKey].invoices.push({
//                         ...invoice,
//                         details: enrichedDetails
//                     });
//                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
//                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
//                     customerGroups[customerKey].discount += invoice.discount || 0;
//                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
//                 }
//             } else {
//                 for (const invoice of filteredInvoices) {
//                     let customerUrduName = '';
//                     let customerMobile = '';

//                     const accountByName = accountByNameMap.get(invoice.customer_name);
//                     if (accountByName) {
//                         customerMobile = accountByName.mobile_number || '';
//                         customerUrduName = accountByName.customer_name_urdu || '';
//                     }

//                     if (!customerUrduName && invoice.account_id) {
//                         try {
//                             const account = await window.electron.database.getAccountById(invoice.account_id);
//                             customerMobile = account?.mobile_number || '';
//                             customerUrduName = account?.customer_name_urdu || '';
//                         } catch (err) {
//                             console.error('Error fetching account:', err);
//                         }
//                     }

//                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//                     const enrichedDetails = await Promise.all(details.map(async (item) => {
//                         if (item.item_id) {
//                             try {
//                                 const product = await window.electron.database.getProductById(item.item_id);
//                                 return {
//                                     ...item,
//                                     item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
//                                 };
//                             } catch (err) {
//                                 return item;
//                             }
//                         }
//                         return item;
//                     }));

//                     const customerKey = invoice.customer_name;
//                     if (!customerGroups[customerKey]) {
//                         customerGroups[customerKey] = {
//                             customerName: invoice.customer_name,
//                             customerNameUrdu: customerUrduName,
//                             customerId: invoice.account_id,
//                             customerMobile: customerMobile,
//                             invoices: [],
//                             totalItems: 0,
//                             totalAmount: 0,
//                             discount: 0,
//                             netAmount: 0
//                         };
//                     } else {
//                         if (customerUrduName && !customerGroups[customerKey].customerNameUrdu) {
//                             customerGroups[customerKey].customerNameUrdu = customerUrduName;
//                         }
//                         if (customerMobile && !customerGroups[customerKey].customerMobile) {
//                             customerGroups[customerKey].customerMobile = customerMobile;
//                         }
//                     }

//                     customerGroups[customerKey].invoices.push({
//                         ...invoice,
//                         details: enrichedDetails
//                     });
//                     customerGroups[customerKey].totalItems += invoice.total_weight || 0;
//                     customerGroups[customerKey].totalAmount += invoice.total_amount || 0;
//                     customerGroups[customerKey].discount += invoice.discount || 0;
//                     customerGroups[customerKey].netAmount += invoice.net_amount || 0;
//                 }
//             }

//             // Prepare items summary per customer
//             const customerItemsSummary = {};
//             for (const [customerName, customerData] of Object.entries(customerGroups)) {
//                 const itemsSummary = {};
//                 for (const invoice of customerData.invoices) {
//                     for (const item of invoice.details) {
//                         const itemKey = item.item_id || item.item_name;
//                         if (!itemsSummary[itemKey]) {
//                             itemsSummary[itemKey] = {
//                                 itemName: item.item_name,
//                                 itemNameUrdu: item.item_name_urdu || '',
//                                 totalQuantity: 0,
//                                 totalAmount: 0,
//                                 avgRate: 0
//                             };
//                         }
//                         itemsSummary[itemKey].totalQuantity += item.quantity;
//                         itemsSummary[itemKey].totalAmount += item.amount;
//                     }
//                 }
//                 for (const item of Object.values(itemsSummary)) {
//                     item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
//                 }
//                 customerItemsSummary[customerName] = Object.values(itemsSummary);
//             }

//             const formattedDate = formatDateForDisplay(selectedDate);
//             const totalPages = Object.keys(customerGroups).length;

//             const html = `
//             <!DOCTYPE html>
//             <html dir="rtl">
//             <head>
//                 <meta charset="UTF-8">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <title>تقرير المبيعات ${formattedDate}</title>
//                 <style>
//                     /* Jameel Noori Nastaleeq Font - Primary Urdu Font */
//                     @font-face {
//                         font-family: 'Jameel Noori Nastaleeq';
//                         src: url('https://raw.githubusercontent.com/urdufonts/jameel-noori-nastaleeq/master/JameelNooriNastaleeq.ttf') format('truetype');
//                         font-weight: normal;
//                         font-style: normal;
//                         font-display: swap;
//                     }

//                     @page {
//                         size: 105mm 148mm;
//                         margin: 3mm;
//                     }

//                     * {
//                         margin: 0;
//                         padding: 0;
//                         box-sizing: border-box;
//                     }

//                     body {
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif;
//                         background: white;
//                         color: #333;
//                         width: 105mm;
//                         min-height: 148mm;
//                         margin: 0 auto;
//                         padding: 3mm;
//                     }

//                     .report-container {
//                         width: 100%;
//                         height: 100%;
//                         background: white;
//                     }

//                     .customer-section {
//                         margin-bottom: 10px;
//                         page-break-after: always;
//                         break-after: page;
//                         background: white;
//                         border-radius: 6px;
//                         padding: 6px;
//                         position: relative;
//                         min-height: 135mm;
//                     }

//                     .customer-section:last-child {
//                         page-break-after: auto;
//                         break-after: auto;
//                     }

//                     .customer-header {
//                         text-align: center;
//                         margin-bottom: 6px;
//                         background: #e0e0e0;
//                         border-radius: 6px;
//                         padding: 6px;
//                     }

//                     .customer-name {
//                         font-size: 18px;
//                         color: #000;
//                         font-weight: bold;
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                         line-height: 1.3;
//                     }

//                     .customer-mobile {
//                         font-size: 9px;
//                         color: #3c3c3c;
//                         margin-top: 3px;
//                         direction: ltr;
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                     }

//                     .customer-date {
//                         font-size: 10px;
//                         color: #060606;
//                         font-weight: bold;
//                         margin-bottom: 5px;
//                         text-align: right;
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     }

//                     .items-table {
//                         width: 100%;
//                         border-collapse: collapse;
//                         margin: 6px 0;
//                         background: white;
//                         border-radius: 4px;
//                         overflow: hidden;
//                     }

//                     .items-table th {
//                         background: #e0e0e0;
//                         color: #000;
//                         border: 1px solid #c0c0c0;
//                         padding: 4px 2px;
//                         text-align: center;
//                         font-size: 11px;
//                         font-weight: bold;
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     }

//                     .items-table td {
//                         border: 1px solid #e0e0e0;
//                         padding: 4px 2px;
//                         text-align: center;
//                         font-size: 10px;
//                         background: #fafafa;
//                     }

//                     .items-table td:first-child,
//                     .items-table td:last-child {
//                         font-weight: bold;
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                     }

//                     .items-table td:nth-child(2) {
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     }

//                     .total-row {
//                         background: #e0e0e0;
//                         font-weight: bold;
//                         border-top: 2px solid #4CAF50;
//                     }

//                     .total-row td {
//                         font-weight: bold;
//                         font-size: 11px;
//                         padding: 5px 2px;
//                         background: #e0e0e0;
//                     }

//                     .total-row td:first-child,
//                     .total-row td:last-child {
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                     }

//                     .total-row td:nth-child(2) {
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     }

//                     .footer {
//                         position: absolute;
//                         bottom: 3mm;
//                         left: 0;
//                         right: 0;
//                         text-align: center;
//                         font-size: 8px;
//                         color: #666;
//                         padding: 3px 0;
//                         border-top: 1px solid #d0d0d0;
//                         width: 100%;
//                         display: flex;
//                         justify-content: space-between;
//                         align-items: center;
//                         background: white;
//                     }

//                     .footer-left {
//                         text-align: left;
//                         font-size: 8px;
//                         color: #333;
//                         direction: ltr;
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                     }

//                     .footer-right {
//                         text-align: right;
//                         font-size: 8px;
//                         font-weight: bold;
//                         color: #333;
//                         direction: ltr;
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                         font-weight: bold;
//                     }

//                     @media print {
//                         body {
//                             padding: 0;
//                             margin: 0;
//                             width: 105mm;
//                             min-height: 148mm;
//                             background: white;
//                         }
//                         .customer-section {
//                             page-break-after: always;
//                             break-after: page;
//                             page-break-inside: avoid;
//                             background: white;
//                         }
//                         .footer {
//                             position: fixed;
//                             bottom: 3mm;
//                             left: 0;
//                             right: 0;
//                             background: white;
//                         }
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="report-container">
//                     ${Object.entries(customerGroups).map(([customerName, customerData], index) => {
//                 const itemsSummary = customerItemsSummary[customerName] || [];
//                 const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
//                 const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);

//                 const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
//                 const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());

//                 const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== '' && customerData.customerNameUrdu !== customerData.customerName
//                     ? customerData.customerNameUrdu
//                     : customerData.customerName;

//                 const displayCustomerMobile = customerData.customerMobile || '';
//                 const pageNumber = index + 1;

//                 return `
//                         <div class="customer-section">
//                             <div class="customer-header">
//                                 <div class="customer-name">
//                                     ${displayCustomerName}
//                                 </div>
//                                 ${displayCustomerMobile ? `<div class="customer-mobile">📞 ${displayCustomerMobile}</div>` : ''}
//                             </div>
//                             <div class="customer-date">
//                                 تاریخ: ${invoiceDate}
//                             </div>

//                             <table class="items-table">
//                                 <thead>
//                                     <tr>
//                                         <th>تعداد</th>
//                                         <th>آئٹم</th>
//                                         <th>ریٹ</th>
//                                         <th>رقم</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     ${itemsSummary.map((item) => {
//                     const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
//                         ? item.itemNameUrdu
//                         : item.itemName;

//                     return `
//                                             <tr>
//                                                 <td>${item.totalQuantity.toLocaleString()}</td>
//                                                 <td style="font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">${displayItemName}</td>
//                                                 <td>${Math.round(item.avgRate).toLocaleString()}</td>
//                                                 <td style="font-weight: bold;">${item.totalAmount.toLocaleString()}</td>
//                                             </tr>
//                                         `;
//                 }).join('')}
//                                     <tr class="total-row">
//                                         <td style="font-weight: bold;">${totalItems.toLocaleString()}</td>
//                                         <td style="font-weight: bold;">کل</td>
//                                         <td style="font-weight: bold;">-</td>
//                                         <td style="font-weight: bold;">${totalAmount.toLocaleString()}</td>
//                                     </tr>
//                                 </tbody>
//                             </table>

//                             <div class="footer">
//                                 <div class="footer-left">Ultimate Solution 03006468177</div>
//                                 <div class="footer-right">Page ${pageNumber} of ${totalPages}</div>
//                             </div>
//                         </div>
//                     `;
//             }).join('')}
//                 </div>
//             </body>
//             </html>
//         `;

//             return html;

//         } catch (error) {
//             console.error('Error generating report HTML:', error);
//             toast.error('Failed to generate report');
//             return null;
//         }
//     };
//     const generateAllCustomersReport = async () => {
//         setLoading(true);
//         try {
//             const html = await generateReportHTML();
//             if (html) {
//                 await generateAndOpenPDF(html, `Sales_Report_${formatDateForDisplay(selectedDate)}`);
//             }
//         } catch (error) {
//             console.error('Error generating report:', error);
//             toast.error('Failed to generate report');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const generateSingleCustomerReport = async (customer) => {
//         setLoading(true);
//         try {
//             const html = await generateReportHTML(customer);
//             if (html) {
//                 await generateAndOpenPDF(html, `${customer.customer_name}_Report_${formatDateForDisplay(selectedDate)}`);
//             }
//         } catch (error) {
//             console.error('Error generating report:', error);
//             toast.error('Failed to generate report');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const DatePickerCalendar = ({ currentDate, onSelect }) => {
//         const [displayDate, setDisplayDate] = useState(() => {
//             if (currentDate && !isNaN(currentDate.getTime())) {
//                 return new Date(currentDate);
//             }
//             return new Date();
//         });

//         useEffect(() => {
//             if (currentDate && !isNaN(currentDate.getTime())) {
//                 setDisplayDate(new Date(currentDate));
//             }
//         }, [currentDate]);

//         const getDaysInMonth = (date) => {
//             const year = date.getFullYear();
//             const month = date.getMonth();
//             const firstDay = new Date(year, month, 1);
//             const lastDay = new Date(year, month + 1, 0);
//             const days = [];
//             const startOffset = firstDay.getDay();
//             for (let i = 0; i < startOffset; i++) days.push(null);
//             for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
//             return days;
//         };

//         const isSameDay = (date1, date2) => {
//             return date1 && date2 &&
//                 date1.getFullYear() === date2.getFullYear() &&
//                 date1.getMonth() === date2.getMonth() &&
//                 date1.getDate() === date2.getDate();
//         };

//         const days = getDaysInMonth(displayDate);
//         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//         const handlePrevMonth = () => {
//             setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
//         };

//         const handleNextMonth = () => {
//             setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
//         };

//         return (
//             <div ref={datePickerRef} style={calendarStyles.container}>
//                 <div style={calendarStyles.header}>
//                     <button onClick={handlePrevMonth} style={calendarStyles.navButton} type="button">←</button>
//                     <span style={calendarStyles.monthYear}>{monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}</span>
//                     <button onClick={handleNextMonth} style={calendarStyles.navButton} type="button">→</button>
//                 </div>
//                 <div style={calendarStyles.weekdays}>
//                     {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} style={calendarStyles.weekday}>{day}</div>)}
//                 </div>
//                 <div style={calendarStyles.days}>
//                     {days.map((date, idx) => (
//                         <div
//                             key={idx}
//                             onClick={() => date && onSelect(date)}
//                             style={{
//                                 ...calendarStyles.day,
//                                 ...(date ? calendarStyles.dayCell : {}),
//                                 ...(date && currentDate && isSameDay(date, currentDate) ? calendarStyles.selected : {}),
//                                 ...(date && isSameDay(date, new Date()) && (!currentDate || !isSameDay(date, currentDate)) ? calendarStyles.today : {})
//                             }}
//                         >
//                             {date ? date.getDate() : ''}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     const calendarStyles = {
//         container: {
//             position: 'absolute',
//             top: '100%',
//             left: 0,
//             background: 'white',
//             border: '1px solid #ddd',
//             borderRadius: '8px',
//             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//             padding: '12px',
//             zIndex: 9999,
//             marginTop: '4px',
//             width: '280px',
//             backgroundColor: 'white'
//         },
//         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
//         navButton: {
//             background: 'none',
//             border: 'none',
//             fontSize: '16px',
//             cursor: 'pointer',
//             padding: '4px 8px',
//             borderRadius: '4px',
//             color: '#666',
//             transition: 'background 0.2s'
//         },
//         monthYear: { fontWeight: 'bold', fontSize: '14px' },
//         weekdays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' },
//         weekday: { textAlign: 'center', fontSize: '11px', color: '#666', padding: '4px' },
//         days: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' },
//         dayCell: {
//             textAlign: 'center',
//             padding: '6px',
//             fontSize: '12px',
//             cursor: 'pointer',
//             borderRadius: '4px',
//             transition: 'background 0.2s',
//             backgroundColor: 'white',
//             color: '#333',
//         },
//         day: { color: '#333' },
//         selected: {
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             fontWeight: 'bold'
//         },
//         today: {
//             border: '1px solid #4CAF50',
//             fontWeight: 'bold',
//             backgroundColor: '#e8f5e9'
//         }
//     };

//     const styles = {
//         container: { padding: '16px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' },
//         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' },
//         headerTitle: { margin: 0, fontSize: '20px', fontWeight: '600' },
//         buttonGroup: { display: 'flex', gap: '8px' },
//         buttonPrimary: { padding: '6px 14px', background: 'white', color: '#667eea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
//         buttonSuccess: { padding: '6px 14px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
//         card: { background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
//         row: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
//         formGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px' },
//         formGroupSearch: { flex: 2, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '300px' },
//         label: { fontSize: '11px', fontWeight: '500', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
//         dateInputWrapper: { position: 'relative', width: '100%' },
//         input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
//         searchInput: { padding: '8px 12px 8px 36px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
//         searchIcon: { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '16px' },
//         calendarIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', cursor: 'pointer', fontSize: '16px' },
//         table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
//         tableHeader: { background: '#f5f5f5', borderBottom: '2px solid #e0e0e0', fontWeight: '600' },
//         tableCell: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' },
//         tableCellRight: { padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' },
//         tableCellCenter: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' },
//         actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', fontSize: '16px', color: '#2196F3', transition: 'all 0.2s' },
//         tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' },
//         tab: { padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', border: 'none', background: 'none', color: '#666', transition: 'all 0.2s' },
//         activeTab: { color: '#4CAF50', borderBottom: '2px solid #4CAF50', marginBottom: '-2px' },
//         loadingOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
//         loadingSpinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #4CAF50', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' },
//         searchWrapper: { position: 'relative', width: '100%' }
//     };

//     if (loading) {
//         return (
//             <div style={styles.loadingOverlay}>
//                 <div style={styles.loadingSpinner}></div>
//             </div>
//         );
//     }

//     return (
//         <div style={styles.container}>
//             <div style={styles.header}>
//                 <h1 style={styles.headerTitle}>📊 Sales Reports</h1>
//                 <div style={styles.buttonGroup}>
//                     <button onClick={generateAllCustomersReport} style={styles.buttonSuccess}>
//                         <FiPrinter size={14} /> Print All Report
//                     </button>
//                 </div>
//             </div>

//             {/* Tabs */}
//             <div style={styles.tabContainer}>
//                 <button
//                     onClick={() => {
//                         setActiveTab('customer');
//                         setSearchTerm('');
//                     }}
//                     style={{ ...styles.tab, ...(activeTab === 'customer' ? styles.activeTab : {}) }}
//                 >
//                     <FiUser size={14} style={{ marginRight: '6px' }} /> Customer Summary
//                 </button>
//                 <button
//                     onClick={() => {
//                         setActiveTab('item');
//                         setSearchTerm('');
//                     }}
//                     style={{ ...styles.tab, ...(activeTab === 'item' ? styles.activeTab : {}) }}
//                 >
//                     <FiPackage size={14} style={{ marginRight: '6px' }} /> Item Summary
//                 </button>
//             </div>

//             {/* Date Picker and Search */}
//             <div style={styles.card}>
//                 <div style={styles.row}>
//                     <div style={styles.formGroup}>
//                         <label style={styles.label}>SELECT DATE</label>
//                         <div style={styles.dateInputWrapper}>
//                             <input
//                                 ref={dateInputRef}
//                                 type="text"
//                                 placeholder="DD/MM/YYYY"
//                                 value={tempDate}
//                                 onChange={(e) => handleDateInputChange(e.target.value)}
//                                 onFocus={() => setShowDatePicker(true)}
//                                 onBlur={handleDateBlur}
//                                 style={styles.input}
//                             />
//                             <FiCalendar
//                                 style={styles.calendarIcon}
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     e.stopPropagation();
//                                     setShowDatePicker(!showDatePicker);
//                                 }}
//                             />
//                             {showDatePicker && (
//                                 <DatePickerCalendar
//                                     currentDate={new Date(selectedDate)}
//                                     onSelect={handleDateSelect}
//                                 />
//                             )}
//                         </div>
//                     </div>
//                     <div style={styles.formGroupSearch}>
//                         <label style={styles.label}>
//                             {activeTab === 'customer' ? 'SEARCH CUSTOMER' : 'SEARCH ITEM'}
//                         </label>
//                         <div style={styles.searchWrapper}>
//                             <FiSearch style={styles.searchIcon} />
//                             <input
//                                 type="text"
//                                 placeholder={activeTab === 'customer' ? "Search by customer name..." : "Search by item name..."}
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 style={styles.searchInput}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Customer Summary Table */}
//             {activeTab === 'customer' && (
//                 <div style={styles.card}>
//                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
//                         📋 Customer Summary
//                         {searchTerm && ` (Filtered: ${filteredCustomerSummary.length} of ${customerSummary.length})`}
//                     </h3>
//                     <div style={{ overflowX: 'auto' }}>
//                         <table style={styles.table}>
//                             <thead>
//                                 <tr style={{ ...styles.tableHeader, background: '#4CAF50', color: 'white' }}>
//                                     <th style={styles.tableCell}>#</th>
//                                     <th style={styles.tableCell}>Customer Name</th>
//                                     <th style={styles.tableCellRight}>Total Amount</th>
//                                     <th style={styles.tableCell}>Date</th>
//                                     <th style={styles.tableCellCenter}>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filteredCustomerSummary.length === 0 ? (
//                                     <tr>
//                                         <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
//                                             {searchTerm ? 'No matching customers found' : 'No data found for selected date'}
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     filteredCustomerSummary.map((customer) => (
//                                         <tr key={customer.sr_no}>
//                                             <td style={styles.tableCell}>{customer.sr_no}</td>
//                                             <td style={styles.tableCell}>
//                                                 <strong>{customer.customer_name}</strong>
//                                                 {customer.customer_name_urdu && (
//                                                     <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif" }}>
//                                                         {customer.customer_name_urdu}
//                                                     </div>
//                                                 )}
//                                             </td>
//                                             <td style={styles.tableCellRight}>
//                                                 <strong style={{ color: '#4CAF50' }}>₨ {customer.total_amount.toLocaleString()}</strong>
//                                             </td>
//                                             <td style={styles.tableCell}>{formatDateForDisplay(customer.invoice_date)}</td>
//                                             <td style={styles.tableCellCenter}>
//                                                 <button
//                                                     onClick={() => generateSingleCustomerReport(customer)}
//                                                     style={styles.actionButton}
//                                                     title="Print Report"
//                                                 >
//                                                     <FiFileText size={18} />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                             {filteredCustomerSummary.length > 0 && (
//                                 <tfoot>
//                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
//                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
//                                         <td style={styles.tableCellRight}>
//                                             <strong style={{ color: '#4CAF50' }}>
//                                                 {filteredCustomerSummary.reduce((sum, c) => sum + c.total_amount, 0).toLocaleString()}
//                                             </strong>
//                                         </td>
//                                         <td colSpan="2"></td>
//                                     </tr>
//                                 </tfoot>
//                             )}
//                         </table>
//                     </div>
//                 </div>
//             )}

//             {/* Item Wise Summary Table */}
//             {activeTab === 'item' && (
//                 <div style={styles.card}>
//                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
//                         📦 Item Summary
//                         {searchTerm && ` (Filtered: ${filteredItemSummary.length} of ${itemWiseSummary.length})`}
//                     </h3>
//                     <div style={{ overflowX: 'auto' }}>
//                         <table style={styles.table}>
//                             <thead>
//                                 <tr style={{ ...styles.tableHeader, background: '#4CAF50', color: 'white' }}>
//                                     <th style={styles.tableCell}>#</th>
//                                     <th style={styles.tableCell}>Item Name</th>
//                                     <th style={styles.tableCellRight}>Quantity</th>
//                                     <th style={styles.tableCellRight}>Total Amount</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filteredItemSummary.length === 0 ? (
//                                     <tr>
//                                         <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
//                                             {searchTerm ? 'No matching items found' : 'No items found for selected date'}
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     filteredItemSummary.map((item) => (
//                                         <tr key={item.sr_no}>
//                                             <td style={styles.tableCell}>{item.sr_no}</td>
//                                             <td style={styles.tableCell}>
//                                                 <div>{item.item_name}</div>
//                                                 {item.item_name_urdu && (
//                                                     <div style={{ fontSize: '18px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif", marginTop: '4px', fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif" }}>
//                                                         {item.item_name_urdu}
//                                                     </div>
//                                                 )}
//                                             </td>
//                                             <td style={styles.tableCellRight}>
//                                                 <strong>{item.total_quantity.toLocaleString()}</strong>
//                                             </td>
//                                             <td style={styles.tableCellRight}>
//                                                 <strong style={{ color: '#4CAF50' }}>₨ {item.total_amount.toLocaleString()}</strong>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                             {filteredItemSummary.length > 0 && (
//                                 <tfoot>
//                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
//                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
//                                         <td style={styles.tableCellRight}>
//                                             <strong>{filteredItemSummary.reduce((sum, i) => sum + (i.total_quantity || 0), 0).toLocaleString()}</strong>
//                                         </td>
//                                         <td style={styles.tableCellRight}>
//                                             <strong style={{ color: '#4CAF50' }}>
//                                                 {filteredItemSummary.reduce((sum, i) => sum + (i.total_amount || 0), 0).toLocaleString()}
//                                             </strong>
//                                         </td>
//                                     </tr>
//                                 </tfoot>
//                             )}
//                         </table>
//                     </div>
//                 </div>
//             )}

//             <style>{`
//                 @keyframes spin {
//                     0% { transform: rotate(0deg); }
//                     100% { transform: rotate(360deg); }
//                 }
//             `}</style>
//         </div>
//     );
// }

// export default Reports;

// import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
// import { toast } from 'react-hot-toast';
// import { FiPrinter, FiCalendar, FiFileText, FiUser, FiPackage, FiSearch } from 'react-icons/fi';
// import { NavigationContext } from '../App';

// function Reports() {
//     const { goBack } = useContext(NavigationContext);
//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//     const [invoices, setInvoices] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [customerSummary, setCustomerSummary] = useState([]);
//     const [itemWiseSummary, setItemWiseSummary] = useState([]);
//     const [tempDate, setTempDate] = useState('');
//     const [showDatePicker, setShowDatePicker] = useState(false);
//     const [activeTab, setActiveTab] = useState('customer');
//     const [searchTerm, setSearchTerm] = useState('');

//     const dateInputRef = useRef(null);
//     const datePickerRef = useRef(null);
//     const isInitialMount = useRef(true);

//     useEffect(() => {
//         loadData();

//         const handleClickOutside = (event) => {
//             if (datePickerRef.current && !datePickerRef.current.contains(event.target) &&
//                 dateInputRef.current && !dateInputRef.current.contains(event.target)) {
//                 setShowDatePicker(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     useEffect(() => {
//         if (selectedDate) {
//             const displayDate = formatDateForDisplay(selectedDate);
//             setTempDate(displayDate);
//         }
//     }, [selectedDate]);

//     useEffect(() => {
//         if (isInitialMount.current) {
//             isInitialMount.current = false;
//             if (invoices.length > 0) {
//                 loadSummaries();
//             }
//         } else if (selectedDate && invoices.length > 0) {
//             loadSummaries();
//         }
//     }, [selectedDate, invoices]);

//     const loadData = async () => {
//         try {
//             const invoicesData = await window.electron.database.getInvoices();
//             setInvoices(invoicesData || []);
//         } catch (error) {
//             console.error('Failed to load data:', error);
//             toast.error('Failed to load data');
//         }
//     };

//     const loadSummaries = useCallback(async () => {
//         if (!selectedDate) return;

//         setLoading(true);
//         try {
//             const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();

//             const filteredInvoices = allInvoices.filter(inv => {
//                 const invDate = inv.invoice_date;
//                 return invDate === selectedDate;
//             });

//             console.log('Selected Date:', selectedDate);
//             console.log('Filtered Invoices:', filteredInvoices.length);

//             // For each filtered invoice, get its details to extract customer info
//             const customerMap = new Map();

//             for (const invoice of filteredInvoices) {
//                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);

//                 // Get unique customers from this invoice's details
//                 const customerKeys = new Set();
//                 for (const item of details) {
//                     const customerName = item.customer_name;
//                     if (customerName && !customerKeys.has(customerName)) {
//                         customerKeys.add(customerName);

//                         if (!customerMap.has(customerName)) {
//                             customerMap.set(customerName, {
//                                 customer_name: customerName,
//                                 customer_name_urdu: item.customer_name_urdu || '',
//                                 total_amount: 0,
//                                 invoice_date: invoice.invoice_date,
//                                 invoice_id: invoice.invoice_id,
//                                 voucher_id: invoice.voucher_id,
//                                 customer_id: item.customer_id
//                             });
//                         }
//                         const customer = customerMap.get(customerName);
//                         customer.total_amount += invoice.net_amount || 0;
//                         if (invoice.invoice_date > customer.invoice_date) {
//                             customer.invoice_date = invoice.invoice_date;
//                             customer.invoice_id = invoice.invoice_id;
//                             customer.voucher_id = invoice.voucher_id;
//                         }
//                     }
//                 }
//             }

//             const customerList = Array.from(customerMap.values()).map((customer, index) => ({
//                 sr_no: index + 1,
//                 ...customer
//             }));
//             setCustomerSummary(customerList);

//             // Calculate item summary from invoice details
//             const itemsMap = new Map();

//             for (const invoice of filteredInvoices) {
//                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//                 console.log(`Invoice ${invoice.invoice_id} details:`, details.length);

//                 for (const item of details) {
//                     const itemId = item.item_id;
//                     const itemKey = itemId || item.item_name;

//                     if (!itemsMap.has(itemKey)) {
//                         let itemNameUrdu = item.item_name_urdu || '';
//                         if (itemId && !itemNameUrdu) {
//                             try {
//                                 const product = await window.electron.database.getProductById(itemId);
//                                 itemNameUrdu = product?.item_name_urdu || '';
//                             } catch (err) {
//                                 console.error('Error fetching product:', err);
//                             }
//                         }
//                         itemsMap.set(itemKey, {
//                             item_name: item.item_name,
//                             item_name_urdu: itemNameUrdu,
//                             total_quantity: 0,
//                             total_amount: 0
//                         });
//                     }
//                     const itemData = itemsMap.get(itemKey);
//                     itemData.total_quantity += parseFloat(item.quantity) || 0;
//                     itemData.total_amount += parseFloat(item.amount) || 0;
//                 }
//             }

//             const itemList = Array.from(itemsMap.values()).map((item, index) => ({
//                 sr_no: index + 1,
//                 item_name: item.item_name,
//                 item_name_urdu: item.item_name_urdu,
//                 total_quantity: item.total_quantity,
//                 total_amount: item.total_amount
//             }));

//             console.log('Calculated Item Summary:', itemList.length);
//             setItemWiseSummary(itemList);

//             if (filteredInvoices.length === 0 && !isInitialMount.current) {
//                 toast.error('No invoices found for selected date');
//             }

//         } catch (error) {
//             console.error('Failed to load summaries:', error);
//             toast.error('Failed to load summaries: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     }, [selectedDate, invoices]);

//     const filteredCustomerSummary = useMemo(() => {
//         if (!searchTerm.trim()) return customerSummary;
//         const searchLower = searchTerm.toLowerCase();
//         return customerSummary.filter(customer =>
//             customer.customer_name.toLowerCase().includes(searchLower) ||
//             (customer.customer_name_urdu && customer.customer_name_urdu.includes(searchTerm))
//         );
//     }, [customerSummary, searchTerm]);

//     const filteredItemSummary = useMemo(() => {
//         if (!searchTerm.trim()) return itemWiseSummary;
//         const searchLower = searchTerm.toLowerCase();
//         return itemWiseSummary.filter(item =>
//             item.item_name.toLowerCase().includes(searchLower) ||
//             (item.item_name_urdu && item.item_name_urdu.includes(searchTerm))
//         );
//     }, [itemWiseSummary, searchTerm]);

//     const formatDateForDisplay = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) return '';
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//     };

//     const formatDateForStorage = (dateStr) => {
//         if (!dateStr) return null;
//         const parts = dateStr.split('/');
//         if (parts.length === 3) {
//             const day = parseInt(parts[0], 10);
//             const month = parseInt(parts[1], 10);
//             const year = parseInt(parts[2], 10);
//             if (!isNaN(day) && !isNaN(month) && !isNaN(year) &&
//                 day >= 1 && day <= 31 && month >= 1 && month <= 12 && year.toString().length === 4) {
//                 return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
//             }
//         }
//         return null;
//     };

//     const handleDateInputChange = (value) => {
//         setTempDate(value);
//         let formatted = value.replace(/[^0-9]/g, '');
//         if (formatted.length >= 2 && formatted.length < 4) {
//             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
//         } else if (formatted.length >= 4 && formatted.length < 6) {
//             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4);
//         } else if (formatted.length >= 6) {
//             formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4, 8);
//         }
//         setTempDate(formatted);

//         if (formatted.length === 10) {
//             const storageDate = formatDateForStorage(formatted);
//             if (storageDate) {
//                 setSelectedDate(storageDate);
//             }
//         }
//     };

//     const handleDateBlur = () => {
//         if (tempDate.length === 10) {
//             const storageDate = formatDateForStorage(tempDate);
//             if (storageDate) {
//                 setSelectedDate(storageDate);
//             } else {
//                 const currentDate = new Date();
//                 const storageDate = currentDate.toISOString().split('T')[0];
//                 setSelectedDate(storageDate);
//                 toast.error('Invalid date format. Using current date.');
//             }
//         } else if (tempDate && tempDate.length > 0) {
//             const currentDate = new Date();
//             const storageDate = currentDate.toISOString().split('T')[0];
//             setSelectedDate(storageDate);
//             toast.error('Invalid date. Using current date.');
//         }
//         setShowDatePicker(false);
//     };

//     const handleDateSelect = useCallback((date) => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const storageDate = `${year}-${month}-${day}`;
//         setSelectedDate(storageDate);
//         setShowDatePicker(false);
//     }, []);

//     const generateAndOpenPDF = async (html, title) => {
//         try {
//             if (window.electron && window.electron.printToPDFAndOpen) {
//                 const pdfPath = await window.electron.printToPDFAndOpen(html);
//                 if (pdfPath) {
//                     toast.success('PDF opened in your default browser');
//                 } else {
//                     toast.error('Failed to generate PDF');
//                 }
//             } else {
//                 const newWindow = window.open('', '_blank');
//                 if (newWindow) {
//                     newWindow.document.write(html);
//                     newWindow.document.close();
//                     newWindow.print();
//                     toast.success('Print dialog opened');
//                 } else {
//                     toast.error('Popup blocked. Please allow popups for this site.');
//                 }
//             }
//         } catch (error) {
//             console.error('Error generating PDF:', error);
//             toast.error('Failed to generate PDF');
//         }
//     };

//     const generateReportHTML = async (singleCustomer = null) => {
//         try {
//             const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();
//             const filteredInvoices = allInvoices.filter(inv => {
//                 const invDate = inv.invoice_date;
//                 return invDate === selectedDate;
//             });

//             // Get all accounts for lookup by name
//             const allAccounts = await window.electron.database.getAccounts();
//             const accountByNameMap = new Map();
//             allAccounts.forEach(account => {
//                 if (account.customer_name) {
//                     accountByNameMap.set(account.customer_name, account);
//                 }
//             });

//             let customerGroups = {};

//             if (singleCustomer) {
//                 // Get all invoice details for this customer
//                 for (const invoice of filteredInvoices) {
//                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);

//                     // Filter items for this specific customer
//                     const customerItems = details.filter(item => item.customer_name === singleCustomer.customer_name);

//                     if (customerItems.length === 0) continue;

//                     const enrichedDetails = await Promise.all(customerItems.map(async (item) => {
//                         if (item.item_id) {
//                             try {
//                                 const product = await window.electron.database.getProductById(item.item_id);
//                                 return {
//                                     ...item,
//                                     item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
//                                 };
//                             } catch (err) {
//                                 return item;
//                             }
//                         }
//                         return item;
//                     }));

//                     const customerKey = singleCustomer.customer_name;
//                     if (!customerGroups[customerKey]) {
//                         let customerMobile = '';
//                         let customerUrduName = singleCustomer.customer_name_urdu || '';

//                         const accountByName = accountByNameMap.get(singleCustomer.customer_name);
//                         if (accountByName) {
//                             customerMobile = accountByName.mobile_number || '';
//                             customerUrduName = accountByName.customer_name_urdu || customerUrduName;
//                         }

//                         customerGroups[customerKey] = {
//                             customerName: singleCustomer.customer_name,
//                             customerNameUrdu: customerUrduName,
//                             customerId: singleCustomer.customer_id,
//                             customerMobile: customerMobile,
//                             invoices: [],
//                             totalItems: 0,
//                             totalAmount: 0,
//                             discount: 0,
//                             netAmount: 0
//                         };
//                     }

//                     customerGroups[customerKey].invoices.push({
//                         ...invoice,
//                         details: enrichedDetails
//                     });

//                     const totalItemsForInvoice = enrichedDetails.reduce((sum, item) => sum + (item.quantity || 0), 0);
//                     const totalAmountForInvoice = enrichedDetails.reduce((sum, item) => sum + (item.amount || 0), 0);

//                     customerGroups[customerKey].totalItems += totalItemsForInvoice;
//                     customerGroups[customerKey].totalAmount += totalAmountForInvoice;
//                     customerGroups[customerKey].discount += invoice.discount || 0;
//                     customerGroups[customerKey].netAmount += totalAmountForInvoice - (invoice.discount || 0);
//                 }
//             } else {
//                 for (const invoice of filteredInvoices) {
//                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);

//                     // Group items by customer within this invoice
//                     const itemsByCustomer = new Map();
//                     for (const item of details) {
//                         const customerName = item.customer_name;
//                         if (!customerName) continue;

//                         if (!itemsByCustomer.has(customerName)) {
//                             let customerUrduName = item.customer_name_urdu || '';
//                             let customerMobile = '';

//                             const accountByName = accountByNameMap.get(customerName);
//                             if (accountByName) {
//                                 customerMobile = accountByName.mobile_number || '';
//                                 customerUrduName = accountByName.customer_name_urdu || customerUrduName;
//                             }

//                             itemsByCustomer.set(customerName, {
//                                 customerName: customerName,
//                                 customerNameUrdu: customerUrduName,
//                                 customerMobile: customerMobile,
//                                 customerId: item.customer_id,
//                                 items: []
//                             });
//                         }

//                         const enrichedItem = { ...item };
//                         if (item.item_id) {
//                             try {
//                                 const product = await window.electron.database.getProductById(item.item_id);
//                                 enrichedItem.item_name_urdu = product?.item_name_urdu || item.item_name_urdu || '';
//                             } catch (err) {
//                                 console.error('Error fetching product:', err);
//                             }
//                         }
//                         itemsByCustomer.get(customerName).items.push(enrichedItem);
//                     }

//                     // Add to customer groups
//                     for (const [customerName, customerData] of itemsByCustomer) {
//                         if (!customerGroups[customerName]) {
//                             customerGroups[customerName] = {
//                                 customerName: customerName,
//                                 customerNameUrdu: customerData.customerNameUrdu,
//                                 customerId: customerData.customerId,
//                                 customerMobile: customerData.customerMobile,
//                                 invoices: [],
//                                 totalItems: 0,
//                                 totalAmount: 0,
//                                 discount: 0,
//                                 netAmount: 0
//                             };
//                         }

//                         customerGroups[customerName].invoices.push({
//                             ...invoice,
//                             details: customerData.items
//                         });

//                         const totalItemsForInvoice = customerData.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
//                         const totalAmountForInvoice = customerData.items.reduce((sum, item) => sum + (item.amount || 0), 0);

//                         customerGroups[customerName].totalItems += totalItemsForInvoice;
//                         customerGroups[customerName].totalAmount += totalAmountForInvoice;
//                         customerGroups[customerName].discount += invoice.discount || 0;
//                         customerGroups[customerName].netAmount += totalAmountForInvoice - (invoice.discount || 0);
//                     }
//                 }
//             }

//             // Prepare items summary per customer
//             const customerItemsSummary = {};
//             for (const [customerName, customerData] of Object.entries(customerGroups)) {
//                 const itemsSummary = {};
//                 for (const invoice of customerData.invoices) {
//                     for (const item of invoice.details) {
//                         const itemKey = item.item_id || item.item_name;
//                         if (!itemsSummary[itemKey]) {
//                             itemsSummary[itemKey] = {
//                                 itemName: item.item_name,
//                                 itemNameUrdu: item.item_name_urdu || '',
//                                 totalQuantity: 0,
//                                 totalAmount: 0,
//                                 avgRate: 0
//                             };
//                         }
//                         itemsSummary[itemKey].totalQuantity += item.quantity;
//                         itemsSummary[itemKey].totalAmount += item.amount;
//                     }
//                 }
//                 for (const item of Object.values(itemsSummary)) {
//                     item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
//                 }
//                 customerItemsSummary[customerName] = Object.values(itemsSummary);
//             }

//             const formattedDate = formatDateForDisplay(selectedDate);
//             const totalPages = Object.keys(customerGroups).length;

//             const html = `
//             <!DOCTYPE html>
//             <html dir="rtl">
//             <head>
//                 <meta charset="UTF-8">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <title>تقرير المبيعات ${formattedDate}</title>
//                 <style>
//                     @font-face {
//                         font-family: 'Jameel Noori Nastaleeq';
//                         src: url('https://raw.githubusercontent.com/urdufonts/jameel-noori-nastaleeq/master/JameelNooriNastaleeq.ttf') format('truetype');
//                         font-weight: normal;
//                         font-style: normal;
//                         font-display: swap;
//                     }

//                     @page {
//                         size: 105mm 148mm;
//                         margin: 3mm;
//                     }

//                     * {
//                         margin: 0;
//                         padding: 0;
//                         box-sizing: border-box;
//                     }

//                     body {
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif;
//                         background: white;
//                         color: #333;
//                         width: 105mm;
//                         min-height: 148mm;
//                         margin: 0 auto;
//                         padding: 3mm;
//                     }

//                     .report-container {
//                         width: 100%;
//                         height: 100%;
//                         background: white;
//                     }

//                     .customer-section {
//                         margin-bottom: 10px;
//                         page-break-after: always;
//                         break-after: page;
//                         background: white;
//                         border-radius: 6px;
//                         padding: 6px;
//                         position: relative;
//                         min-height: 135mm;
//                     }

//                     .customer-section:last-child {
//                         page-break-after: auto;
//                         break-after: auto;
//                     }

//                     .customer-header {
//                         text-align: center;
//                         margin-bottom: 6px;
//                         background: #e0e0e0;
//                         border-radius: 6px;
//                         padding: 6px;
//                     }

//                     .customer-name {
//                         font-size: 18px;
//                         color: #000;
//                         font-weight: bold;
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                         line-height: 1.3;
//                     }

//                     .customer-mobile {
//                         font-size: 9px;
//                         color: #3c3c3c;
//                         margin-top: 3px;
//                         direction: ltr;
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                     }

//                     .customer-date {
//                         font-size: 10px;
//                         color: #060606;
//                         font-weight: bold;
//                         margin-bottom: 5px;
//                         text-align: right;
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     }

//                     .items-table {
//                         width: 100%;
//                         border-collapse: collapse;
//                         margin: 6px 0;
//                         background: white;
//                         border-radius: 4px;
//                         overflow: hidden;
//                     }

//                     .items-table th {
//                         background: #e0e0e0;
//                         color: #000;
//                         border: 1px solid #c0c0c0;
//                         padding: 4px 2px;
//                         text-align: center;
//                         font-size: 11px;
//                         font-weight: bold;
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     }

//                     .items-table td {
//                         border: 1px solid #e0e0e0;
//                         padding: 4px 2px;
//                         text-align: center;
//                         font-size: 10px;
//                         background: #fafafa;
//                     }

//                     .items-table td:first-child,
//                     .items-table td:last-child {
//                         font-weight: bold;
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                     }

//                     .items-table td:nth-child(2) {
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     }

//                     .total-row {
//                         background: #e0e0e0;
//                         font-weight: bold;
//                         border-top: 2px solid #4CAF50;
//                     }

//                     .total-row td {
//                         font-weight: bold;
//                         font-size: 11px;
//                         padding: 5px 2px;
//                         background: #e0e0e0;
//                     }

//                     .total-row td:first-child,
//                     .total-row td:last-child {
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                     }

//                     .total-row td:nth-child(2) {
//                         font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     }

//                     .footer {
//                         position: absolute;
//                         bottom: 3mm;
//                         left: 0;
//                         right: 0;
//                         text-align: center;
//                         font-size: 8px;
//                         color: #666;
//                         padding: 3px 0;
//                         border-top: 1px solid #d0d0d0;
//                         width: 100%;
//                         display: flex;
//                         justify-content: space-between;
//                         align-items: center;
//                         background: white;
//                     }

//                     .footer-left {
//                         text-align: left;
//                         font-size: 8px;
//                         color: #333;
//                         direction: ltr;
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                     }

//                     .footer-right {
//                         text-align: right;
//                         font-size: 8px;
//                         font-weight: bold;
//                         color: #333;
//                         direction: ltr;
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                     }

//                     @media print {
//                         body {
//                             padding: 0;
//                             margin: 0;
//                             width: 105mm;
//                             min-height: 148mm;
//                             background: white;
//                         }
//                         .customer-section {
//                             page-break-after: always;
//                             break-after: page;
//                             page-break-inside: avoid;
//                             background: white;
//                         }
//                         .footer {
//                             position: fixed;
//                             bottom: 3mm;
//                             left: 0;
//                             right: 0;
//                             background: white;
//                         }
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="report-container">
//                     ${Object.entries(customerGroups).map(([customerName, customerData], index) => {
//                 const itemsSummary = customerItemsSummary[customerName] || [];
//                 const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
//                 const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);

//                 const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
//                 const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());

//                 const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== '' && customerData.customerNameUrdu !== customerData.customerName
//                     ? customerData.customerNameUrdu
//                     : customerData.customerName;

//                 const displayCustomerMobile = customerData.customerMobile || '';
//                 const pageNumber = index + 1;

//                 return `
//                         <div class="customer-section">
//                             <div class="customer-header">
//                                 <div class="customer-name">
//                                     ${displayCustomerName}
//                                 </div>
//                                 ${displayCustomerMobile ? `<div class="customer-mobile">📞 ${displayCustomerMobile}</div>` : ''}
//                             </div>
//                             <div class="customer-date">
//                                 تاریخ: ${invoiceDate}
//                             </div>

//                             <table class="items-table">
//                                 <thead>
//                                     <tr>
//                                         <th>تعداد</th>
//                                         <th>آئٹم</th>
//                                         <th>ریٹ</th>
//                                         <th>رقم</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     ${itemsSummary.map((item) => {
//                     const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
//                         ? item.itemNameUrdu
//                         : item.itemName;

//                     return `
//                                             <tr>
//                                                 <td>${item.totalQuantity.toLocaleString()}</td>
//                                                 <td style="font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">${displayItemName}</td>
//                                                 <td>${Math.round(item.avgRate).toLocaleString()}</td>
//                                                 <td style="font-weight: bold;">${item.totalAmount.toLocaleString()}</td>
//                                             </tr>
//                                         `;
//                 }).join('')}
//                                     <tr class="total-row">
//                                         <td style="font-weight: bold;">${totalItems.toLocaleString()}</td>
//                                         <td style="font-weight: bold;">کل</td>
//                                         <td style="font-weight: bold;">-</td>
//                                         <td style="font-weight: bold;">${totalAmount.toLocaleString()}</td>
//                                     </tr>
//                                 </tbody>
//                             </table>

//                             <div class="footer">
//                                 <div class="footer-left">created by Ultimate Solution  (03006468177)</div>
//                                 <div class="footer-right">Page ${pageNumber} of ${totalPages}</div>
//                             </div>
//                         </div>
//                     `;
//             }).join('')}
//                 </div>
//             </body>
//             </html>
//         `;

//             return html;

//         } catch (error) {
//             console.error('Error generating report HTML:', error);
//             toast.error('Failed to generate report');
//             return null;
//         }
//     };

//     const generateAllCustomersReport = async () => {
//         setLoading(true);
//         try {
//             const html = await generateReportHTML();
//             if (html) {
//                 await generateAndOpenPDF(html, `Sales_Report_${formatDateForDisplay(selectedDate)}`);
//             }
//         } catch (error) {
//             console.error('Error generating report:', error);
//             toast.error('Failed to generate report');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const generateSingleCustomerReport = async (customer) => {
//         setLoading(true);
//         try {
//             const html = await generateReportHTML(customer);
//             if (html) {
//                 await generateAndOpenPDF(html, `${customer.customer_name}_Report_${formatDateForDisplay(selectedDate)}`);
//             }
//         } catch (error) {
//             console.error('Error generating report:', error);
//             toast.error('Failed to generate report');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const DatePickerCalendar = ({ currentDate, onSelect }) => {
//         const [displayDate, setDisplayDate] = useState(() => {
//             if (currentDate && !isNaN(currentDate.getTime())) {
//                 return new Date(currentDate);
//             }
//             return new Date();
//         });

//         useEffect(() => {
//             if (currentDate && !isNaN(currentDate.getTime())) {
//                 setDisplayDate(new Date(currentDate));
//             }
//         }, [currentDate]);

//         const getDaysInMonth = (date) => {
//             const year = date.getFullYear();
//             const month = date.getMonth();
//             const firstDay = new Date(year, month, 1);
//             const lastDay = new Date(year, month + 1, 0);
//             const days = [];
//             const startOffset = firstDay.getDay();
//             for (let i = 0; i < startOffset; i++) days.push(null);
//             for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
//             return days;
//         };

//         const isSameDay = (date1, date2) => {
//             return date1 && date2 &&
//                 date1.getFullYear() === date2.getFullYear() &&
//                 date1.getMonth() === date2.getMonth() &&
//                 date1.getDate() === date2.getDate();
//         };

//         const days = getDaysInMonth(displayDate);
//         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//         const handlePrevMonth = () => {
//             setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
//         };

//         const handleNextMonth = () => {
//             setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
//         };

//         return (
//             <div ref={datePickerRef} style={calendarStyles.container}>
//                 <div style={calendarStyles.header}>
//                     <button onClick={handlePrevMonth} style={calendarStyles.navButton} type="button">←</button>
//                     <span style={calendarStyles.monthYear}>{monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}</span>
//                     <button onClick={handleNextMonth} style={calendarStyles.navButton} type="button">→</button>
//                 </div>
//                 <div style={calendarStyles.weekdays}>
//                     {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} style={calendarStyles.weekday}>{day}</div>)}
//                 </div>
//                 <div style={calendarStyles.days}>
//                     {days.map((date, idx) => (
//                         <div
//                             key={idx}
//                             onClick={() => date && onSelect(date)}
//                             style={{
//                                 ...calendarStyles.day,
//                                 ...(date ? calendarStyles.dayCell : {}),
//                                 ...(date && currentDate && isSameDay(date, currentDate) ? calendarStyles.selected : {}),
//                                 ...(date && isSameDay(date, new Date()) && (!currentDate || !isSameDay(date, currentDate)) ? calendarStyles.today : {})
//                             }}
//                         >
//                             {date ? date.getDate() : ''}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     const calendarStyles = {
//         container: {
//             position: 'absolute',
//             top: '100%',
//             left: 0,
//             background: 'white',
//             border: '1px solid #ddd',
//             borderRadius: '8px',
//             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//             padding: '12px',
//             zIndex: 9999,
//             marginTop: '4px',
//             width: '280px',
//             backgroundColor: 'white'
//         },
//         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
//         navButton: {
//             background: 'none',
//             border: 'none',
//             fontSize: '16px',
//             cursor: 'pointer',
//             padding: '4px 8px',
//             borderRadius: '4px',
//             color: '#666',
//             transition: 'background 0.2s'
//         },
//         monthYear: { fontWeight: 'bold', fontSize: '14px' },
//         weekdays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' },
//         weekday: { textAlign: 'center', fontSize: '11px', color: '#666', padding: '4px' },
//         days: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' },
//         dayCell: {
//             textAlign: 'center',
//             padding: '6px',
//             fontSize: '12px',
//             cursor: 'pointer',
//             borderRadius: '4px',
//             transition: 'background 0.2s',
//             backgroundColor: 'white',
//             color: '#333',
//         },
//         day: { color: '#333' },
//         selected: {
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             fontWeight: 'bold'
//         },
//         today: {
//             border: '1px solid #4CAF50',
//             fontWeight: 'bold',
//             backgroundColor: '#e8f5e9'
//         }
//     };

//     const styles = {
//         container: { padding: '16px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' },
//         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' },
//         headerTitle: { margin: 0, fontSize: '20px', fontWeight: '600' },
//         buttonGroup: { display: 'flex', gap: '8px' },
//         buttonPrimary: { padding: '6px 14px', background: 'white', color: '#667eea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
//         buttonSuccess: { padding: '6px 14px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
//         card: { background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
//         row: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
//         formGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px' },
//         formGroupSearch: { flex: 2, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '300px' },
//         label: { fontSize: '11px', fontWeight: '500', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
//         dateInputWrapper: { position: 'relative', width: '100%' },
//         input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
//         searchInput: { padding: '8px 12px 8px 36px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
//         searchIcon: { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '16px' },
//         calendarIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', cursor: 'pointer', fontSize: '16px' },
//         table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
//         tableHeader: { background: '#f5f5f5', borderBottom: '2px solid #e0e0e0', fontWeight: '600' },
//         tableCell: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' },
//         tableCellRight: { padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' },
//         tableCellCenter: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' },
//         actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', fontSize: '16px', color: '#2196F3', transition: 'all 0.2s' },
//         tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' },
//         tab: { padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', border: 'none', background: 'none', color: '#666', transition: 'all 0.2s' },
//         activeTab: { color: '#4CAF50', borderBottom: '2px solid #4CAF50', marginBottom: '-2px' },
//         loadingOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
//         loadingSpinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #4CAF50', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' },
//         searchWrapper: { position: 'relative', width: '100%' }
//     };

//     if (loading) {
//         return (
//             <div style={styles.loadingOverlay}>
//                 <div style={styles.loadingSpinner}></div>
//             </div>
//         );
//     }

//     return (
//         <div style={styles.container}>
//             <div style={styles.header}>
//                 <h1 style={styles.headerTitle}>📊 Sales Reports</h1>
//                 <div style={styles.buttonGroup}>
//                     <button onClick={generateAllCustomersReport} style={styles.buttonSuccess}>
//                         <FiPrinter size={14} /> Print All Report
//                     </button>
//                 </div>
//             </div>

//             <div style={styles.tabContainer}>
//                 <button
//                     onClick={() => {
//                         setActiveTab('customer');
//                         setSearchTerm('');
//                     }}
//                     style={{ ...styles.tab, ...(activeTab === 'customer' ? styles.activeTab : {}) }}
//                 >
//                     <FiUser size={14} style={{ marginRight: '6px' }} /> Customer Summary
//                 </button>
//                 <button
//                     onClick={() => {
//                         setActiveTab('item');
//                         setSearchTerm('');
//                     }}
//                     style={{ ...styles.tab, ...(activeTab === 'item' ? styles.activeTab : {}) }}
//                 >
//                     <FiPackage size={14} style={{ marginRight: '6px' }} /> Item Summary
//                 </button>
//             </div>

//             <div style={styles.card}>
//                 <div style={styles.row}>
//                     <div style={styles.formGroup}>
//                         <label style={styles.label}>SELECT DATE</label>
//                         <div style={styles.dateInputWrapper}>
//                             <input
//                                 ref={dateInputRef}
//                                 type="text"
//                                 placeholder="DD/MM/YYYY"
//                                 value={tempDate}
//                                 onChange={(e) => handleDateInputChange(e.target.value)}
//                                 onFocus={() => setShowDatePicker(true)}
//                                 onBlur={handleDateBlur}
//                                 style={styles.input}
//                             />
//                             <FiCalendar
//                                 style={styles.calendarIcon}
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     e.stopPropagation();
//                                     setShowDatePicker(!showDatePicker);
//                                 }}
//                             />
//                             {showDatePicker && (
//                                 <DatePickerCalendar
//                                     currentDate={new Date(selectedDate)}
//                                     onSelect={handleDateSelect}
//                                 />
//                             )}
//                         </div>
//                     </div>
//                     <div style={styles.formGroupSearch}>
//                         <label style={styles.label}>
//                             {activeTab === 'customer' ? 'SEARCH CUSTOMER' : 'SEARCH ITEM'}
//                         </label>
//                         <div style={styles.searchWrapper}>
//                             <FiSearch style={styles.searchIcon} />
//                             <input
//                                 type="text"
//                                 placeholder={activeTab === 'customer' ? "Search by customer name..." : "Search by item name..."}
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 style={styles.searchInput}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {activeTab === 'customer' && (
//                 <div style={styles.card}>
//                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
//                         📋 Customer Summary
//                         {searchTerm && ` (Filtered: ${filteredCustomerSummary.length} of ${customerSummary.length})`}
//                     </h3>
//                     <div style={{ overflowX: 'auto' }}>
//                         <table style={styles.table}>
//                             <thead>
//                                 <tr style={{ ...styles.tableHeader, background: '#4CAF50', color: 'white' }}>
//                                     <th style={styles.tableCell}>#</th>
//                                     <th style={styles.tableCell}>Customer Name</th>
//                                     <th style={styles.tableCellRight}>Total Amount</th>
//                                     <th style={styles.tableCell}>Date</th>
//                                     <th style={styles.tableCellCenter}>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filteredCustomerSummary.length === 0 ? (
//                                     <tr>
//                                         <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
//                                             {searchTerm ? 'No matching customers found' : 'No data found for selected date'}
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     filteredCustomerSummary.map((customer) => (
//                                         <tr key={customer.sr_no}>
//                                             <td style={styles.tableCell}>{customer.sr_no}</td>
//                                             <td style={styles.tableCell}>
//                                                 <strong>{customer.customer_name}</strong>
//                                                 {customer.customer_name_urdu && (
//                                                     <div  style={{ fontSize: '18px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif", marginTop: '4px', fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif" }}>
//                                                         {customer.customer_name_urdu}
//                                                     </div>
//                                                 )}
//                                             </td>
//                                             <td style={styles.tableCellRight}>
//                                                 <strong style={{ color: '#4CAF50' }}>₨ {customer.total_amount.toLocaleString()}</strong>
//                                             </td>
//                                             <td style={styles.tableCell}>{formatDateForDisplay(customer.invoice_date)}</td>
//                                             <td style={styles.tableCellCenter}>
//                                                 <button
//                                                     onClick={() => generateSingleCustomerReport(customer)}
//                                                     style={styles.actionButton}
//                                                     title="Print Report"
//                                                 >
//                                                     <FiFileText size={18} />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                             {filteredCustomerSummary.length > 0 && (
//                                 <tfoot>
//                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
//                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
//                                         <td style={styles.tableCellRight}>
//                                             <strong style={{ color: '#4CAF50' }}>
//                                                 ₨ {filteredCustomerSummary.reduce((sum, c) => sum + c.total_amount, 0).toLocaleString()}
//                                             </strong>
//                                         </td>
//                                         <td colSpan="2"></td>
//                                     </tr>
//                                 </tfoot>
//                             )}
//                         </table>
//                     </div>
//                 </div>
//             )}

//             {activeTab === 'item' && (
//                 <div style={styles.card}>
//                     <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
//                         📦 Item Summary
//                         {searchTerm && ` (Filtered: ${filteredItemSummary.length} of ${itemWiseSummary.length})`}
//                     </h3>
//                     <div style={{ overflowX: 'auto' }}>
//                         <table style={styles.table}>
//                             <thead>
//                                 <tr style={{ ...styles.tableHeader, background: '#4CAF50', color: 'white' }}>
//                                     <th style={styles.tableCell}>#</th>
//                                     <th style={styles.tableCell}>Item Name</th>
//                                     <th style={styles.tableCellRight}>Quantity</th>
//                                     <th style={styles.tableCellRight}>Total Amount</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filteredItemSummary.length === 0 ? (
//                                     <tr>
//                                         <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
//                                             {searchTerm ? 'No matching items found' : 'No items found for selected date'}
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     filteredItemSummary.map((item) => (
//                                         <tr key={item.sr_no}>
//                                             <td style={styles.tableCell}>{item.sr_no}</td>
//                                             <td style={styles.tableCell}>
//                                                 <div>{item.item_name}</div>
//                                                 {item.item_name_urdu && (
//                                                     <div style={{ fontSize: '18px', color: '#666', fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif", marginTop: '4px', fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif" }}>
//                                                         {item.item_name_urdu}
//                                                     </div>
//                                                 )}
//                                             </td>
//                                             <td style={styles.tableCellRight}>
//                                                 <strong>{item.total_quantity.toLocaleString()}</strong>
//                                             </td>
//                                             <td style={styles.tableCellRight}>
//                                                 <strong style={{ color: '#4CAF50' }}>₨ {item.total_amount.toLocaleString()}</strong>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                             {filteredItemSummary.length > 0 && (
//                                 <tfoot>
//                                     <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
//                                         <td colSpan="2" style={styles.tableCellRight}><strong>GRAND TOTAL:</strong></td>
//                                         <td style={styles.tableCellRight}>
//                                             <strong>{filteredItemSummary.reduce((sum, i) => sum + (i.total_quantity || 0), 0).toLocaleString()}</strong>
//                                         </td>
//                                         <td style={styles.tableCellRight}>
//                                             <strong style={{ color: '#4CAF50' }}>
//                                                 ₨ {filteredItemSummary.reduce((sum, i) => sum + (i.total_amount || 0), 0).toLocaleString()}
//                                             </strong>
//                                         </td>
//                                     </tr>
//                                 </tfoot>
//                             )}
//                         </table>
//                     </div>
//                 </div>
//             )}

//             <style>{`
//                 @keyframes spin {
//                     0% { transform: rotate(0deg); }
//                     100% { transform: rotate(360deg); }
//                 }
//             `}</style>
//         </div>
//     );
// }

// export default Reports;

import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { toast } from "react-hot-toast";
import {
  FiPrinter,
  FiCalendar,
  FiFileText,
  FiUser,
  FiPackage,
  FiSearch,
} from "react-icons/fi";
import { NavigationContext } from "../App";

function Reports() {
  const { goBack } = useContext(NavigationContext);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerSummary, setCustomerSummary] = useState([]);
  const [itemWiseSummary, setItemWiseSummary] = useState([]);
  const [tempDate, setTempDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeTab, setActiveTab] = useState("customer");
  const [searchTerm, setSearchTerm] = useState("");

  const dateInputRef = useRef(null);
  const datePickerRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    loadData();

    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        dateInputRef.current &&
        !dateInputRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const displayDate = formatDateForDisplay(selectedDate);
      setTempDate(displayDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (invoices.length > 0) {
        loadSummaries();
      }
    } else if (selectedDate && invoices.length > 0) {
      loadSummaries();
    }
  }, [selectedDate, invoices]);

  const loadData = async () => {
    try {
      const invoicesData = await window.electron.database.getInvoices();
      setInvoices(invoicesData || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load data");
    }
  };

  const loadSummaries = useCallback(async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const allInvoices =
        invoices.length > 0
          ? invoices
          : await window.electron.database.getInvoices();

      const filteredInvoices = allInvoices.filter((inv) => {
        const invDate = inv.invoice_date;
        return invDate === selectedDate;
      });

      console.log("Selected Date:", selectedDate);
      console.log("Filtered Invoices:", filteredInvoices.length);

      // For each filtered invoice, get its details to extract customer info
      const customerMap = new Map();

      for (const invoice of filteredInvoices) {
        const details = await window.electron.database.getInvoiceDetails(
          invoice.invoice_id,
        );

        // Get unique customers from this invoice's details
        const customerKeys = new Set();
        for (const item of details) {
          const customerName = item.customer_name;
          if (customerName && !customerKeys.has(customerName)) {
            customerKeys.add(customerName);

            if (!customerMap.has(customerName)) {
              customerMap.set(customerName, {
                customer_name: customerName,
                customer_name_urdu: item.customer_name_urdu || "",
                total_amount: 0,
                invoice_date: invoice.invoice_date,
                invoice_id: invoice.invoice_id,
                voucher_id: invoice.voucher_id,
                customer_id: item.customer_id,
              });
            }
            const customer = customerMap.get(customerName);
            customer.total_amount += invoice.net_amount || 0;
            if (invoice.invoice_date > customer.invoice_date) {
              customer.invoice_date = invoice.invoice_date;
              customer.invoice_id = invoice.invoice_id;
              customer.voucher_id = invoice.voucher_id;
            }
          }
        }
      }

      const customerList = Array.from(customerMap.values()).map(
        (customer, index) => ({
          sr_no: index + 1,
          ...customer,
        }),
      );
      setCustomerSummary(customerList);

      // Calculate item summary from invoice details
      const itemsMap = new Map();

      for (const invoice of filteredInvoices) {
        const details = await window.electron.database.getInvoiceDetails(
          invoice.invoice_id,
        );
        console.log(`Invoice ${invoice.invoice_id} details:`, details.length);

        for (const item of details) {
          const itemId = item.item_id;
          const itemKey = itemId || item.item_name;

          if (!itemsMap.has(itemKey)) {
            let itemNameUrdu = item.item_name_urdu || "";
            if (itemId && !itemNameUrdu) {
              try {
                const product =
                  await window.electron.database.getProductById(itemId);
                itemNameUrdu = product?.item_name_urdu || "";
              } catch (err) {
                console.error("Error fetching product:", err);
              }
            }
            itemsMap.set(itemKey, {
              item_name: item.item_name,
              item_name_urdu: itemNameUrdu,
              total_quantity: 0,
              total_amount: 0,
            });
          }
          const itemData = itemsMap.get(itemKey);
          itemData.total_quantity += parseFloat(item.quantity) || 0;
          itemData.total_amount += parseFloat(item.amount) || 0;
        }
      }

      const itemList = Array.from(itemsMap.values()).map((item, index) => ({
        sr_no: index + 1,
        item_name: item.item_name,
        item_name_urdu: item.item_name_urdu,
        total_quantity: item.total_quantity,
        total_amount: item.total_amount,
      }));

      console.log("Calculated Item Summary:", itemList.length);
      setItemWiseSummary(itemList);

      if (filteredInvoices.length === 0 && !isInitialMount.current) {
        toast.error("No invoices found for selected date");
      }
    } catch (error) {
      console.error("Failed to load summaries:", error);
      toast.error("Failed to load summaries: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, invoices]);

  const filteredCustomerSummary = useMemo(() => {
    if (!searchTerm.trim()) return customerSummary;
    const searchLower = searchTerm.toLowerCase();
    return customerSummary.filter(
      (customer) =>
        customer.customer_name.toLowerCase().includes(searchLower) ||
        (customer.customer_name_urdu &&
          customer.customer_name_urdu.includes(searchTerm)),
    );
  }, [customerSummary, searchTerm]);

  const filteredItemSummary = useMemo(() => {
    if (!searchTerm.trim()) return itemWiseSummary;
    const searchLower = searchTerm.toLowerCase();
    return itemWiseSummary.filter(
      (item) =>
        item.item_name.toLowerCase().includes(searchLower) ||
        (item.item_name_urdu && item.item_name_urdu.includes(searchTerm)),
    );
  }, [itemWiseSummary, searchTerm]);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForStorage = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (
        !isNaN(day) &&
        !isNaN(month) &&
        !isNaN(year) &&
        day >= 1 &&
        day <= 31 &&
        month >= 1 &&
        month <= 12 &&
        year.toString().length === 4
      ) {
        return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      }
    }
    return null;
  };

  const handleDateInputChange = (value) => {
    setTempDate(value);
    let formatted = value.replace(/[^0-9]/g, "");
    if (formatted.length >= 2 && formatted.length < 4) {
      formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
    } else if (formatted.length >= 4 && formatted.length < 6) {
      formatted =
        formatted.slice(0, 2) +
        "/" +
        formatted.slice(2, 4) +
        "/" +
        formatted.slice(4);
    } else if (formatted.length >= 6) {
      formatted =
        formatted.slice(0, 2) +
        "/" +
        formatted.slice(2, 4) +
        "/" +
        formatted.slice(4, 8);
    }
    setTempDate(formatted);

    if (formatted.length === 10) {
      const storageDate = formatDateForStorage(formatted);
      if (storageDate) {
        setSelectedDate(storageDate);
      }
    }
  };

  const handleDateBlur = () => {
    if (tempDate.length === 10) {
      const storageDate = formatDateForStorage(tempDate);
      if (storageDate) {
        setSelectedDate(storageDate);
      } else {
        const currentDate = new Date();
        const storageDate = currentDate.toISOString().split("T")[0];
        setSelectedDate(storageDate);
        toast.error("Invalid date format. Using current date.");
      }
    } else if (tempDate && tempDate.length > 0) {
      const currentDate = new Date();
      const storageDate = currentDate.toISOString().split("T")[0];
      setSelectedDate(storageDate);
      toast.error("Invalid date. Using current date.");
    }
    setShowDatePicker(false);
  };

  const handleDateSelect = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const storageDate = `${year}-${month}-${day}`;
    setSelectedDate(storageDate);
    setShowDatePicker(false);
  }, []);

  const generateAndOpenPDF = async (html, title) => {
    try {
      if (window.electron && window.electron.printToPDFAndOpen) {
        const pdfPath = await window.electron.printToPDFAndOpen(html);
        if (pdfPath) {
          toast.success("PDF opened in your default browser");
        } else {
          toast.error("Failed to generate PDF");
        }
      } else {
        const newWindow = window.open("", "_blank");
        if (newWindow) {
          newWindow.document.write(html);
          newWindow.document.close();
          newWindow.print();
          toast.success("Print dialog opened");
        } else {
          toast.error("Popup blocked. Please allow popups for this site.");
        }
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  // const generateReportHTML = async (singleCustomer = null) => {
  //     try {
  //         const allInvoices = invoices.length > 0 ? invoices : await window.electron.database.getInvoices();
  //         const filteredInvoices = allInvoices.filter(inv => {
  //             const invDate = inv.invoice_date;
  //             return invDate === selectedDate;
  //         });

  //         // Get all accounts for lookup by name
  //         const allAccounts = await window.electron.database.getAccounts();
  //         const accountByNameMap = new Map();
  //         allAccounts.forEach(account => {
  //             if (account.customer_name) {
  //                 accountByNameMap.set(account.customer_name, account);
  //             }
  //         });

  //         let customerGroups = {};

  //         if (singleCustomer) {
  //             // Get all invoice details for this customer
  //             for (const invoice of filteredInvoices) {
  //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);

  //                 // Filter items for this specific customer
  //                 const customerItems = details.filter(item => item.customer_name === singleCustomer.customer_name);

  //                 if (customerItems.length === 0) continue;

  //                 const enrichedDetails = await Promise.all(customerItems.map(async (item) => {
  //                     if (item.item_id) {
  //                         try {
  //                             const product = await window.electron.database.getProductById(item.item_id);
  //                             return {
  //                                 ...item,
  //                                 item_name_urdu: product?.item_name_urdu || item.item_name_urdu || ''
  //                             };
  //                         } catch (err) {
  //                             return item;
  //                         }
  //                     }
  //                     return item;
  //                 }));

  //                 const customerKey = singleCustomer.customer_name;
  //                 if (!customerGroups[customerKey]) {
  //                     let customerMobile = '';
  //                     let customerUrduName = singleCustomer.customer_name_urdu || '';

  //                     const accountByName = accountByNameMap.get(singleCustomer.customer_name);
  //                     if (accountByName) {
  //                         customerMobile = accountByName.mobile_number || '';
  //                         customerUrduName = accountByName.customer_name_urdu || customerUrduName;
  //                     }

  //                     customerGroups[customerKey] = {
  //                         customerName: singleCustomer.customer_name,
  //                         customerNameUrdu: customerUrduName,
  //                         customerId: singleCustomer.customer_id,
  //                         customerMobile: customerMobile,
  //                         invoices: [],
  //                         totalItems: 0,
  //                         totalAmount: 0,
  //                         discount: 0,
  //                         netAmount: 0
  //                     };
  //                 }

  //                 customerGroups[customerKey].invoices.push({
  //                     ...invoice,
  //                     details: enrichedDetails
  //                 });

  //                 const totalItemsForInvoice = enrichedDetails.reduce((sum, item) => sum + (item.quantity || 0), 0);
  //                 const totalAmountForInvoice = enrichedDetails.reduce((sum, item) => sum + (item.amount || 0), 0);

  //                 customerGroups[customerKey].totalItems += totalItemsForInvoice;
  //                 customerGroups[customerKey].totalAmount += totalAmountForInvoice;
  //                 customerGroups[customerKey].discount += invoice.discount || 0;
  //                 customerGroups[customerKey].netAmount += totalAmountForInvoice - (invoice.discount || 0);
  //             }
  //         } else {
  //             for (const invoice of filteredInvoices) {
  //                 const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);

  //                 // Group items by customer within this invoice
  //                 const itemsByCustomer = new Map();
  //                 for (const item of details) {
  //                     const customerName = item.customer_name;
  //                     if (!customerName) continue;

  //                     if (!itemsByCustomer.has(customerName)) {
  //                         let customerUrduName = item.customer_name_urdu || '';
  //                         let customerMobile = '';

  //                         const accountByName = accountByNameMap.get(customerName);
  //                         if (accountByName) {
  //                             customerMobile = accountByName.mobile_number || '';
  //                             customerUrduName = accountByName.customer_name_urdu || customerUrduName;
  //                         }

  //                         itemsByCustomer.set(customerName, {
  //                             customerName: customerName,
  //                             customerNameUrdu: customerUrduName,
  //                             customerMobile: customerMobile,
  //                             customerId: item.customer_id,
  //                             items: []
  //                         });
  //                     }

  //                     const enrichedItem = { ...item };
  //                     if (item.item_id) {
  //                         try {
  //                             const product = await window.electron.database.getProductById(item.item_id);
  //                             enrichedItem.item_name_urdu = product?.item_name_urdu || item.item_name_urdu || '';
  //                         } catch (err) {
  //                             console.error('Error fetching product:', err);
  //                         }
  //                     }
  //                     itemsByCustomer.get(customerName).items.push(enrichedItem);
  //                 }

  //                 // Add to customer groups
  //                 for (const [customerName, customerData] of itemsByCustomer) {
  //                     if (!customerGroups[customerName]) {
  //                         customerGroups[customerName] = {
  //                             customerName: customerName,
  //                             customerNameUrdu: customerData.customerNameUrdu,
  //                             customerId: customerData.customerId,
  //                             customerMobile: customerData.customerMobile,
  //                             invoices: [],
  //                             totalItems: 0,
  //                             totalAmount: 0,
  //                             discount: 0,
  //                             netAmount: 0
  //                         };
  //                     }

  //                     customerGroups[customerName].invoices.push({
  //                         ...invoice,
  //                         details: customerData.items
  //                     });

  //                     const totalItemsForInvoice = customerData.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  //                     const totalAmountForInvoice = customerData.items.reduce((sum, item) => sum + (item.amount || 0), 0);

  //                     customerGroups[customerName].totalItems += totalItemsForInvoice;
  //                     customerGroups[customerName].totalAmount += totalAmountForInvoice;
  //                     customerGroups[customerName].discount += invoice.discount || 0;
  //                     customerGroups[customerName].netAmount += totalAmountForInvoice - (invoice.discount || 0);
  //                 }
  //             }
  //         }

  //         // Prepare items summary per customer
  //         const customerItemsSummary = {};
  //         for (const [customerName, customerData] of Object.entries(customerGroups)) {
  //             const itemsSummary = {};
  //             for (const invoice of customerData.invoices) {
  //                 for (const item of invoice.details) {
  //                     const itemKey = item.item_id || item.item_name;
  //                     if (!itemsSummary[itemKey]) {
  //                         itemsSummary[itemKey] = {
  //                             itemName: item.item_name,
  //                             itemNameUrdu: item.item_name_urdu || '',
  //                             totalQuantity: 0,
  //                             totalAmount: 0,
  //                             avgRate: 0
  //                         };
  //                     }
  //                     itemsSummary[itemKey].totalQuantity += item.quantity;
  //                     itemsSummary[itemKey].totalAmount += item.amount;
  //                 }
  //             }
  //             for (const item of Object.values(itemsSummary)) {
  //                 item.avgRate = item.totalQuantity > 0 ? item.totalAmount / item.totalQuantity : 0;
  //             }
  //             customerItemsSummary[customerName] = Object.values(itemsSummary);
  //         }

  //         const formattedDate = formatDateForDisplay(selectedDate);
  //         const totalPages = Object.keys(customerGroups).length;

  //         const html = `
  //         <!DOCTYPE html>
  //         <html dir="rtl">
  //         <head>
  //             <meta charset="UTF-8">
  //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //             <title>تقرير المبيعات ${formattedDate}</title>
  //             <style>
  //                 @font-face {
  //                     font-family: 'Jameel Noori Nastaleeq';
  //                     src: url('https://raw.githubusercontent.com/urdufonts/jameel-noori-nastaleeq/master/JameelNooriNastaleeq.ttf') format('truetype');
  //                     font-weight: normal;
  //                     font-style: normal;
  //                     font-display: swap;
  //                 }

  //                 @page {
  //                     size: 105mm 148mm;
  //                     margin: 3mm;
  //                 }

  //                 * {
  //                     margin: 0;
  //                     padding: 0;
  //                     box-sizing: border-box;
  //                 }

  //                 body {
  //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif;
  //                     background: white;
  //                     color: #333;
  //                     width: 105mm;
  //                     min-height: 148mm;
  //                     margin: 0 auto;
  //                     padding: 3mm;
  //                 }

  //                 .report-container {
  //                     width: 100%;
  //                     height: 100%;
  //                     background: white;
  //                 }

  //                 .customer-section {
  //                     margin-bottom: 10px;
  //                     page-break-after: always;
  //                     break-after: page;
  //                     background: white;
  //                     border-radius: 6px;
  //                     padding: 6px;
  //                     position: relative;
  //                     min-height: 135mm;
  //                 }

  //                 .customer-section:last-child {
  //                     page-break-after: auto;
  //                     break-after: auto;
  //                 }

  //                 .customer-header {
  //                     text-align: center;
  //                     margin-bottom: 6px;
  //                     background: #e0e0e0;
  //                     border-radius: 6px;
  //                     padding: 6px;
  //                 }

  //                 .customer-name {
  //                     font-size: 18px;
  //                     color: #000;
  //                     font-weight: bold;
  //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
  //                     line-height: 1.3;
  //                 }

  //                 .customer-mobile {
  //                     font-size: 9px;
  //                     color: #3c3c3c;
  //                     margin-top: 3px;
  //                     direction: ltr;
  //                     font-family: 'Segoe UI', Arial, sans-serif;
  //                 }

  //                 .customer-date {
  //                     font-size: 10px;
  //                     color: #060606;
  //                     font-weight: bold;
  //                     margin-bottom: 5px;
  //                     text-align: right;
  //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
  //                 }

  //                 .items-table {
  //                     width: 100%;
  //                     border-collapse: collapse;
  //                     margin: 6px 0;
  //                     background: white;
  //                     border-radius: 4px;
  //                     overflow: hidden;
  //                 }

  //                 .items-table th {
  //                     background: #e0e0e0;
  //                     color: #000;
  //                     border: 1px solid #c0c0c0;
  //                     padding: 4px 2px;
  //                     text-align: center;
  //                     font-size: 11px;
  //                     font-weight: bold;
  //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
  //                 }

  //                 .items-table td {
  //                     border: 1px solid #e0e0e0;
  //                     padding: 4px 2px;
  //                     text-align: center;
  //                     font-size: 10px;
  //                     background: #fafafa;
  //                 }

  //                 .items-table td:first-child,
  //                 .items-table td:last-child {
  //                     font-weight: bold;
  //                     font-family: 'Segoe UI', Arial, sans-serif;
  //                 }

  //                 .items-table td:nth-child(2) {
  //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
  //                 }

  //                 .total-row {
  //                     background: #e0e0e0;
  //                     font-weight: bold;
  //                     border-top: 2px solid #4CAF50;
  //                 }

  //                 .total-row td {
  //                     font-weight: bold;
  //                     font-size: 11px;
  //                     padding: 5px 2px;
  //                     background: #e0e0e0;
  //                 }

  //                 .total-row td:first-child,
  //                 .total-row td:last-child {
  //                     font-family: 'Segoe UI', Arial, sans-serif;
  //                 }

  //                 .total-row td:nth-child(2) {
  //                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
  //                 }

  //                 .footer {
  //                     position: absolute;
  //                     bottom: 3mm;
  //                     left: 0;
  //                     right: 0;
  //                     text-align: center;
  //                     font-size: 8px;
  //                     color: #666;
  //                     padding: 3px 0;
  //                     border-top: 1px solid #d0d0d0;
  //                     width: 100%;
  //                     display: flex;
  //                     justify-content: space-between;
  //                     align-items: center;
  //                     background: white;
  //                 }

  //                 .footer-left {
  //                     text-align: left;
  //                     font-size: 8px;
  //                     color: #333;
  //                     direction: ltr;
  //                     font-family: 'Segoe UI', Arial, sans-serif;
  //                 }

  //                 .footer-right {
  //                     text-align: right;
  //                     font-size: 8px;
  //                     font-weight: bold;
  //                     color: #333;
  //                     direction: ltr;
  //                     font-family: 'Segoe UI', Arial, sans-serif;
  //                 }

  //                 @media print {
  //                     body {
  //                         padding: 0;
  //                         margin: 0;
  //                         width: 105mm;
  //                         min-height: 148mm;
  //                         background: white;
  //                     }
  //                     .customer-section {
  //                         page-break-after: always;
  //                         break-after: page;
  //                         page-break-inside: avoid;
  //                         background: white;
  //                     }
  //                     .footer {
  //                         position: fixed;
  //                         bottom: 3mm;
  //                         left: 0;
  //                         right: 0;
  //                         background: white;
  //                     }
  //                 }
  //             </style>
  //         </head>
  //         <body>
  //             <div class="report-container">
  //                 ${Object.entries(customerGroups).map(([customerName, customerData], index) => {
  //             const itemsSummary = customerItemsSummary[customerName] || [];
  //             const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
  //             const totalAmount = itemsSummary.reduce((sum, item) => sum + item.totalAmount, 0);

  //             const latestInvoice = customerData.invoices[customerData.invoices.length - 1];
  //             const invoiceDate = formatDateForDisplay(latestInvoice?.invoice_date || new Date());

  //             const displayCustomerName = customerData.customerNameUrdu && customerData.customerNameUrdu.trim() !== '' && customerData.customerNameUrdu !== customerData.customerName
  //                 ? customerData.customerNameUrdu
  //                 : customerData.customerName;

  //             const displayCustomerMobile = customerData.customerMobile || '';
  //             const pageNumber = index + 1;

  //             return `
  //                     <div class="customer-section">
  //                         <div class="customer-header">
  //                             <div class="customer-name">
  //                                 ${displayCustomerName}
  //                             </div>
  //                             ${displayCustomerMobile ? `<div class="customer-mobile">📞 ${displayCustomerMobile}</div>` : ''}
  //                         </div>
  //                         <div class="customer-date">
  //                             تاریخ: ${invoiceDate}
  //                         </div>

  //                         <table class="items-table">
  //                             <thead>
  //                                 <tr>
  //                                     <th>تعداد</th>
  //                                     <th>آئٹم</th>
  //                                     <th>ریٹ</th>
  //                                     <th>رقم</th>
  //                                 </tr>
  //                             </thead>
  //                             <tbody>
  //                                 ${itemsSummary.map((item) => {
  //                 const displayItemName = item.itemNameUrdu && item.itemNameUrdu.trim() !== ''
  //                     ? item.itemNameUrdu
  //                     : item.itemName;

  //                 return `
  //                                         <tr>
  //                                             <td>${item.totalQuantity.toLocaleString()}</td>
  //                                             <td style="font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">${displayItemName}</td>
  //                                             <td>${Math.round(item.avgRate).toLocaleString()}</td>
  //                                             <td style="font-weight: bold;">${item.totalAmount.toLocaleString()}</td>
  //                                         </tr>
  //                                     `;
  //             }).join('')}
  //                                 <tr class="total-row">
  //                                     <td style="font-weight: bold;">${totalItems.toLocaleString()}</td>
  //                                     <td style="font-weight: bold;">کل</td>
  //                                     <td style="font-weight: bold;">-</td>
  //                                     <td style="font-weight: bold;">${totalAmount.toLocaleString()}</td>
  //                                 </tr>
  //                             </tbody>
  //                         </table>

  //                         <div class="footer">
  //                             <div class="footer-left">created by Ultimate Solution  (03006468177)</div>
  //                             <div class="footer-right">Page ${pageNumber} of ${totalPages}</div>
  //                         </div>
  //                     </div>
  //                 `;
  //         }).join('')}
  //             </div>
  //         </body>
  //         </html>
  //     `;

  //         return html;

  //     } catch (error) {
  //         console.error('Error generating report HTML:', error);
  //         toast.error('Failed to generate report');
  //         return null;
  //     }
  // };

//   const generateReportHTML = async (singleCustomer = null) => {
//     try {
//       const allInvoices =
//         invoices.length > 0
//           ? invoices
//           : await window.electron.database.getInvoices();
//       const filteredInvoices = allInvoices.filter((inv) => {
//         const invDate = inv.invoice_date;
//         return invDate === selectedDate;
//       });

//       // Get all accounts for lookup by name
//       const allAccounts = await window.electron.database.getAccounts();
//       const accountByNameMap = new Map();
//       allAccounts.forEach((account) => {
//         if (account.customer_name) {
//           accountByNameMap.set(account.customer_name, account);
//         }
//       });

//       let customerGroups = {};

//       if (singleCustomer) {
//         // Get all invoice details for this customer
//         for (const invoice of filteredInvoices) {
//           const details = await window.electron.database.getInvoiceDetails(
//             invoice.invoice_id,
//           );

//           // Filter items for this specific customer
//           const customerItems = details.filter(
//             (item) => item.customer_name === singleCustomer.customer_name,
//           );

//           if (customerItems.length === 0) continue;

//           const enrichedDetails = await Promise.all(
//             customerItems.map(async (item) => {
//               if (item.item_id) {
//                 try {
//                   const product = await window.electron.database.getProductById(
//                     item.item_id,
//                   );
//                   return {
//                     ...item,
//                     item_name_urdu:
//                       product?.item_name_urdu || item.item_name_urdu || "",
//                   };
//                 } catch (err) {
//                   return item;
//                 }
//               }
//               return item;
//             }),
//           );

//           const customerKey = singleCustomer.customer_name;
//           if (!customerGroups[customerKey]) {
//             let customerMobile = "";
//             let customerUrduName = singleCustomer.customer_name_urdu || "";

//             const accountByName = accountByNameMap.get(
//               singleCustomer.customer_name,
//             );
//             if (accountByName) {
//               customerMobile = accountByName.mobile_number || "";
//               customerUrduName =
//                 accountByName.customer_name_urdu || customerUrduName;
//             }

//             customerGroups[customerKey] = {
//               customerName: singleCustomer.customer_name,
//               customerNameUrdu: customerUrduName,
//               customerId: singleCustomer.customer_id,
//               customerMobile: customerMobile,
//               invoices: [],
//               totalItems: 0,
//               totalAmount: 0,
//               discount: 0,
//               netAmount: 0,
//             };
//           }

//           customerGroups[customerKey].invoices.push({
//             ...invoice,
//             details: enrichedDetails,
//           });

//           const totalItemsForInvoice = enrichedDetails.reduce(
//             (sum, item) => sum + (item.quantity || 0),
//             0,
//           );
//           const totalAmountForInvoice = enrichedDetails.reduce(
//             (sum, item) => sum + (item.amount || 0),
//             0,
//           );

//           customerGroups[customerKey].totalItems += totalItemsForInvoice;
//           customerGroups[customerKey].totalAmount += totalAmountForInvoice;
//           customerGroups[customerKey].discount += invoice.discount || 0;
//           customerGroups[customerKey].netAmount +=
//             totalAmountForInvoice - (invoice.discount || 0);
//         }
//       } else {
//         for (const invoice of filteredInvoices) {
//           const details = await window.electron.database.getInvoiceDetails(
//             invoice.invoice_id,
//           );

//           // Group items by customer within this invoice
//           const itemsByCustomer = new Map();
//           for (const item of details) {
//             const customerName = item.customer_name;
//             if (!customerName) continue;

//             if (!itemsByCustomer.has(customerName)) {
//               let customerUrduName = item.customer_name_urdu || "";
//               let customerMobile = "";

//               const accountByName = accountByNameMap.get(customerName);
//               if (accountByName) {
//                 customerMobile = accountByName.mobile_number || "";
//                 customerUrduName =
//                   accountByName.customer_name_urdu || customerUrduName;
//               }

//               itemsByCustomer.set(customerName, {
//                 customerName: customerName,
//                 customerNameUrdu: customerUrduName,
//                 customerMobile: customerMobile,
//                 customerId: item.customer_id,
//                 items: [],
//               });
//             }

//             const enrichedItem = { ...item };
//             if (item.item_id) {
//               try {
//                 const product = await window.electron.database.getProductById(
//                   item.item_id,
//                 );
//                 enrichedItem.item_name_urdu =
//                   product?.item_name_urdu || item.item_name_urdu || "";
//               } catch (err) {
//                 console.error("Error fetching product:", err);
//               }
//             }
//             itemsByCustomer.get(customerName).items.push(enrichedItem);
//           }

//           // Add to customer groups
//           for (const [customerName, customerData] of itemsByCustomer) {
//             if (!customerGroups[customerName]) {
//               customerGroups[customerName] = {
//                 customerName: customerName,
//                 customerNameUrdu: customerData.customerNameUrdu,
//                 customerId: customerData.customerId,
//                 customerMobile: customerData.customerMobile,
//                 invoices: [],
//                 totalItems: 0,
//                 totalAmount: 0,
//                 discount: 0,
//                 netAmount: 0,
//               };
//             }

//             customerGroups[customerName].invoices.push({
//               ...invoice,
//               details: customerData.items,
//             });

//             const totalItemsForInvoice = customerData.items.reduce(
//               (sum, item) => sum + (item.quantity || 0),
//               0,
//             );
//             const totalAmountForInvoice = customerData.items.reduce(
//               (sum, item) => sum + (item.amount || 0),
//               0,
//             );

//             customerGroups[customerName].totalItems += totalItemsForInvoice;
//             customerGroups[customerName].totalAmount += totalAmountForInvoice;
//             customerGroups[customerName].discount += invoice.discount || 0;
//             customerGroups[customerName].netAmount +=
//               totalAmountForInvoice - (invoice.discount || 0);
//           }
//         }
//       }

//       // Prepare items summary per customer with rate grouping (ONLY FOR PDF)
//       const customerItemsSummary = {};
//       for (const [customerName, customerData] of Object.entries(
//         customerGroups,
//       )) {
//         const itemsSummary = new Map(); // Use Map with key as "itemName_rate"

//         for (const invoice of customerData.invoices) {
//           for (const item of invoice.details) {
//             const rate = parseFloat(item.rate) || 0;
//             const itemKey = `${item.item_id || item.item_name}_${rate}`;

//             if (!itemsSummary.has(itemKey)) {
//               itemsSummary.set(itemKey, {
//                 itemName: item.item_name,
//                 itemNameUrdu: item.item_name_urdu || "",
//                 rate: rate,
//                 totalQuantity: 0,
//                 totalAmount: 0,
//               });
//             }
//             const itemData = itemsSummary.get(itemKey);
//             itemData.totalQuantity += parseFloat(item.quantity) || 0;
//             itemData.totalAmount += parseFloat(item.amount) || 0;
//           }
//         }

//         // Convert to array and sort by item name then rate
//         customerItemsSummary[customerName] = Array.from(
//           itemsSummary.values(),
//         ).sort((a, b) => {
//           if (a.itemName === b.itemName) {
//             return a.rate - b.rate;
//           }
//           return a.itemName.localeCompare(b.itemName);
//         });
//       }

//       const formattedDate = formatDateForDisplay(selectedDate);
//       const totalPages = Object.keys(customerGroups).length;

//       const html = `
//         <!DOCTYPE html>
//         <html dir="rtl">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>تقرير المبيعات ${formattedDate}</title>
//             <style>
//                 @font-face {
//                     font-family: 'Jameel Noori Nastaleeq';
//                     src: url('https://raw.githubusercontent.com/urdufonts/jameel-noori-nastaleeq/master/JameelNooriNastaleeq.ttf') format('truetype');
//                     font-weight: normal;
//                     font-style: normal;
//                     font-display: swap;
//                 }
                
//                 @page {
//                     size: 105mm 148mm;
//                     margin: 3mm;
//                 }
                
//                 * {
//                     margin: 0;
//                     padding: 0;
//                     box-sizing: border-box;
//                 }
                
//                 body {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif;
//                     background: white;
//                     color: #333;
//                     width: 105mm;
//                     min-height: 148mm;
//                     margin: 0 auto;
//                     padding: 3mm;
//                 }
                
//                 .report-container {
//                     width: 100%;
//                     height: 100%;
//                     background: white;
//                 }
                
//                 .customer-section {
//                     margin-bottom: 10px;
//                     page-break-after: always;
//                     break-after: page;
//                     background: white;
//                     border-radius: 6px;
//                     padding: 6px;
//                     position: relative;
//                     min-height: 135mm;
//                 }
                
//                 .customer-section:last-child {
//                     page-break-after: auto;
//                     break-after: auto;
//                 }
                
//                 .customer-header {
//                     text-align: center;
//                     margin-bottom: 6px;
//                     background: #e0e0e0;
//                     border-radius: 6px;
//                     padding: 6px;
//                 }
                
//                 .customer-name {
//                     font-size: 22px;
//                     color: #000;
//                     font-weight: bold;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     line-height: 1.3;
//                 }
                
//                 .customer-mobile {
//                     font-size: 14px;
//                     color: #3c3c3c;
//                     margin-top: 3px;
//                     direction: ltr;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .customer-date {
//                     font-size: 15px;
//                     color: #060606;
//                     font-weight: bold;
//                     margin-bottom: 5px;
//                     text-align: right;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .items-table {
//                     width: 100%;
//                     border-collapse: collapse;
//                     margin: 6px 0;
//                     background: white;
//                     border-radius: 4px;
//                     overflow: hidden;
//                 }
                
//                 .items-table th {
//                     background: #e0e0e0;
//                     color: #000;
//                     border: 1px solid #c0c0c0;
//                     padding: 4px 2px;
//                     text-align: center;
//                     font-size: 15px;
//                     font-weight: bold;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .items-table td {
//                     border: 1px solid #e0e0e0;
//                     padding: 4px 2px;
//                     text-align: center;
//                     font-size: 14px;
//                     background: #fafafa;
//                 }
                
//                 .items-table td:first-child,
//                 .items-table td:last-child {
//                     font-weight: bold;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .items-table td:nth-child(2) {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .total-row {
//                     background: #e0e0e0;
//                     font-weight: bold;
//                     border-top: 2px solid #4CAF50;
//                 }
                
//                 .total-row td {
//                     font-weight: bold;
//                     font-size: 14px;
//                     padding: 5px 2px;
//                     background: #e0e0e0;
//                 }
                
//                 .total-row td:first-child,
//                 .total-row td:last-child {
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .total-row td:nth-child(2) {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .footer {
//                     position: absolute;
//                     bottom: 3mm;
//                     left: 0;
//                     right: 0;
//                     text-align: center;
//                     font-size: 8px;
//                     color: #666;
//                     padding: 3px 0;
//                     border-top: 1px solid #d0d0d0;
//                     width: 100%;
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     background: white;
//                 }
                
//                 .footer-left {
//                     text-align: left;
//                     font-size: 8px;
//                     color: #333;
//                     direction: ltr;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .footer-right {
//                     text-align: right;
//                     font-size: 8px;
//                     font-weight: bold;
//                     color: #333;
//                     direction: ltr;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 @media print {
//                     body {
//                         padding: 0;
//                         margin: 0;
//                         width: 105mm;
//                         min-height: 148mm;
//                         background: white;
//                     }
//                     .customer-section {
//                         page-break-after: always;
//                         break-after: page;
//                         page-break-inside: avoid;
//                         background: white;
//                     }
//                     .footer {
//                         position: fixed;
//                         bottom: 3mm;
//                         left: 0;
//                         right: 0;
//                         background: white;
//                     }
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="report-container">
//                 ${Object.entries(customerGroups)
//                   .map(([customerName, customerData], index) => {
//                     const itemsSummary =
//                       customerItemsSummary[customerName] || [];
//                     const totalItems = itemsSummary.reduce(
//                       (sum, item) => sum + item.totalQuantity,
//                       0,
//                     );
//                     const totalAmount = itemsSummary.reduce(
//                       (sum, item) => sum + item.totalAmount,
//                       0,
//                     );

//                     const latestInvoice =
//                       customerData.invoices[customerData.invoices.length - 1];
//                     const invoiceDate = formatDateForDisplay(
//                       latestInvoice?.invoice_date || new Date(),
//                     );

//                     const displayCustomerName =
//                       customerData.customerNameUrdu &&
//                       customerData.customerNameUrdu.trim() !== "" &&
//                       customerData.customerNameUrdu !==
//                         customerData.customerName
//                         ? customerData.customerNameUrdu
//                         : customerData.customerName;

//                     const displayCustomerMobile =
//                       customerData.customerMobile || "";
//                     const pageNumber = index + 1;

//                     return `
//                     <div class="customer-section">
//                         <div class="customer-header">
//                             <div class="customer-name">
//                                 ${displayCustomerName}
//                             </div>
//                             ${displayCustomerMobile ? `<div class="customer-mobile"> ${displayCustomerMobile}</div>` : ""}
//                         </div>
//                         <div class="customer-date">
//                             تاریخ: ${invoiceDate}
//                         </div>
                        
//                         <table class="items-table">
//                             <thead>
//                                 <tr>
//                                     <th>تعداد</th>
//                                     <th>آئٹم</th>
//                                     <th>ریٹ</th>
//                                     <th>رقم</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 ${itemsSummary
//                                   .map((item) => {
//                                     const displayItemName =
//                                       item.itemNameUrdu &&
//                                       item.itemNameUrdu.trim() !== ""
//                                         ? item.itemNameUrdu
//                                         : item.itemName;

//                                     return `
//                                         <tr>
//                                             <td>${item.totalQuantity.toLocaleString()}</td>
//                                             <td style="font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">${displayItemName}</td>
//                                             <td>${item.rate.toLocaleString()}</td>
//                                             <td style="font-weight: bold;">${item.totalAmount.toLocaleString()}</td>
//                                         </tr>
//                                     `;
//                                   })
//                                   .join("")}
//                                 <tr class="total-row">
//                                     <td style="font-weight: bold;">${totalItems.toLocaleString()}</td>
//                                     <td style="font-weight: bold;">-</td>
//                                     <td style="font-weight: bold;">ٹو ٹل</td>
//                                     <td style="font-weight: bold;">${totalAmount.toLocaleString()}</td>
//                                 </tr>
//                             </tbody>
//                         </table>
                        
//                         <div class="footer">
//                            <div className="footer-left">


//                            <div className="copyright" style={{ width: '100%', overflow: 'auto' }}>
//   Software created by Ultimate Solutions     
//   <a href="tel:03006468177" className="contact-phone" style={{ float: 'right', textDecoration: 'none', marginLeft: '20px' }}> (0300) 6468177</a>
// </div>
  
// </div>
//                             <div class="footer-right">Page ${pageNumber} of ${totalPages}</div>
//                         </div>
//                     </div>
//                 `;
//                   })
//                   .join("")}
//             </div>
//         </body>
//         </html>
//     `;

//       return html;
//     } catch (error) {
//       console.error("Error generating report HTML:", error);
//       toast.error("Failed to generate report");
//       return null;
//     }
//   };


// const generateReportHTML = async (singleCustomer = null) => {
//     try {
//       const allInvoices =
//         invoices.length > 0
//           ? invoices
//           : await window.electron.database.getInvoices();
//       const filteredInvoices = allInvoices.filter((inv) => {
//         const invDate = inv.invoice_date;
//         return invDate === selectedDate;
//       });

//       // Get all accounts for lookup by name
//       const allAccounts = await window.electron.database.getAccounts();
//       const accountByNameMap = new Map();
//       allAccounts.forEach((account) => {
//         if (account.customer_name) {
//           accountByNameMap.set(account.customer_name, account);
//         }
//       });

//       let customerGroups = {};

//       if (singleCustomer) {
//         // Get all invoice details for this customer
//         for (const invoice of filteredInvoices) {
//           const details = await window.electron.database.getInvoiceDetails(
//             invoice.invoice_id,
//           );

//           // Filter items for this specific customer
//           const customerItems = details.filter(
//             (item) => item.customer_name === singleCustomer.customer_name,
//           );

//           if (customerItems.length === 0) continue;

//           const enrichedDetails = await Promise.all(
//             customerItems.map(async (item) => {
//               if (item.item_id) {
//                 try {
//                   const product = await window.electron.database.getProductById(
//                     item.item_id,
//                   );
//                   return {
//                     ...item,
//                     item_name_urdu:
//                       product?.item_name_urdu || item.item_name_urdu || "",
//                   };
//                 } catch (err) {
//                   return item;
//                 }
//               }
//               return item;
//             }),
//           );

//           const customerKey = singleCustomer.customer_name;
//           if (!customerGroups[customerKey]) {
//             let customerMobile = "";
//             let customerUrduName = singleCustomer.customer_name_urdu || "";

//             const accountByName = accountByNameMap.get(
//               singleCustomer.customer_name,
//             );
//             if (accountByName) {
//               customerMobile = accountByName.mobile_number || "";
//               customerUrduName =
//                 accountByName.customer_name_urdu || customerUrduName;
//             }

//             customerGroups[customerKey] = {
//               customerName: singleCustomer.customer_name,
//               customerNameUrdu: customerUrduName,
//               customerId: singleCustomer.customer_id,
//               customerMobile: customerMobile,
//               invoices: [],
//               totalItems: 0,
//               totalAmount: 0,
//               discount: 0,
//               netAmount: 0,
//             };
//           }

//           customerGroups[customerKey].invoices.push({
//             ...invoice,
//             details: enrichedDetails,
//           });

//           const totalItemsForInvoice = enrichedDetails.reduce(
//             (sum, item) => sum + (item.quantity || 0),
//             0,
//           );
//           const totalAmountForInvoice = enrichedDetails.reduce(
//             (sum, item) => sum + (item.amount || 0),
//             0,
//           );

//           customerGroups[customerKey].totalItems += totalItemsForInvoice;
//           customerGroups[customerKey].totalAmount += totalAmountForInvoice;
//           customerGroups[customerKey].discount += invoice.discount || 0;
//           customerGroups[customerKey].netAmount +=
//             totalAmountForInvoice - (invoice.discount || 0);
//         }
//       } else {
//         for (const invoice of filteredInvoices) {
//           const details = await window.electron.database.getInvoiceDetails(
//             invoice.invoice_id,
//           );

//           // Group items by customer within this invoice
//           const itemsByCustomer = new Map();
//           for (const item of details) {
//             const customerName = item.customer_name;
//             if (!customerName) continue;

//             if (!itemsByCustomer.has(customerName)) {
//               let customerUrduName = item.customer_name_urdu || "";
//               let customerMobile = "";

//               const accountByName = accountByNameMap.get(customerName);
//               if (accountByName) {
//                 customerMobile = accountByName.mobile_number || "";
//                 customerUrduName =
//                   accountByName.customer_name_urdu || customerUrduName;
//               }

//               itemsByCustomer.set(customerName, {
//                 customerName: customerName,
//                 customerNameUrdu: customerUrduName,
//                 customerMobile: customerMobile,
//                 customerId: item.customer_id,
//                 items: [],
//               });
//             }

//             const enrichedItem = { ...item };
//             if (item.item_id) {
//               try {
//                 const product = await window.electron.database.getProductById(
//                   item.item_id,
//                 );
//                 enrichedItem.item_name_urdu =
//                   product?.item_name_urdu || item.item_name_urdu || "";
//               } catch (err) {
//                 console.error("Error fetching product:", err);
//               }
//             }
//             itemsByCustomer.get(customerName).items.push(enrichedItem);
//           }

//           // Add to customer groups
//           for (const [customerName, customerData] of itemsByCustomer) {
//             if (!customerGroups[customerName]) {
//               customerGroups[customerName] = {
//                 customerName: customerName,
//                 customerNameUrdu: customerData.customerNameUrdu,
//                 customerId: customerData.customerId,
//                 customerMobile: customerData.customerMobile,
//                 invoices: [],
//                 totalItems: 0,
//                 totalAmount: 0,
//                 discount: 0,
//                 netAmount: 0,
//               };
//             }

//             customerGroups[customerName].invoices.push({
//               ...invoice,
//               details: customerData.items,
//             });

//             const totalItemsForInvoice = customerData.items.reduce(
//               (sum, item) => sum + (item.quantity || 0),
//               0,
//             );
//             const totalAmountForInvoice = customerData.items.reduce(
//               (sum, item) => sum + (item.amount || 0),
//               0,
//             );

//             customerGroups[customerName].totalItems += totalItemsForInvoice;
//             customerGroups[customerName].totalAmount += totalAmountForInvoice;
//             customerGroups[customerName].discount += invoice.discount || 0;
//             customerGroups[customerName].netAmount +=
//               totalAmountForInvoice - (invoice.discount || 0);
//           }
//         }
//       }

//       // Prepare items summary per customer with rate grouping (ONLY FOR PDF)
//       const customerItemsSummary = {};
//       for (const [customerName, customerData] of Object.entries(
//         customerGroups,
//       )) {
//         const itemsSummary = new Map(); // Use Map with key as "itemName_rate"

//         for (const invoice of customerData.invoices) {
//           for (const item of invoice.details) {
//             const rate = parseFloat(item.rate) || 0;
//             const itemKey = `${item.item_id || item.item_name}_${rate}`;

//             if (!itemsSummary.has(itemKey)) {
//               itemsSummary.set(itemKey, {
//                 itemName: item.item_name,
//                 itemNameUrdu: item.item_name_urdu || "",
//                 rate: rate,
//                 totalQuantity: 0,
//                 totalAmount: 0,
//               });
//             }
//             const itemData = itemsSummary.get(itemKey);
//             itemData.totalQuantity += parseFloat(item.quantity) || 0;
//             itemData.totalAmount += parseFloat(item.amount) || 0;
//           }
//         }

//         // Convert to array and sort by item name then rate
//         customerItemsSummary[customerName] = Array.from(
//           itemsSummary.values(),
//         ).sort((a, b) => {
//           if (a.itemName === b.itemName) {
//             return a.rate - b.rate;
//           }
//           return a.itemName.localeCompare(b.itemName);
//         });
//       }

//       const formattedDate = formatDateForDisplay(selectedDate);
//       const totalPages = Object.keys(customerGroups).length;

//       const html = `
//         <!DOCTYPE html>
//         <html dir="rtl">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>تقرير المبيعات ${formattedDate}</title>
//             <style>
//                 @font-face {
//                     font-family: 'Jameel Noori Nastaleeq';
//                     src: url('https://raw.githubusercontent.com/urdufonts/jameel-noori-nastaleeq/master/JameelNooriNastaleeq.ttf') format('truetype');
//                     font-weight: normal;
//                     font-style: normal;
//                     font-display: swap;
//                 }
                
//                 @page {
//                     size: 105mm 148mm;
//                     margin: 3mm;
//                 }
                
//                 * {
//                     margin: 0;
//                     padding: 0;
//                     box-sizing: border-box;
//                 }
                
//                 body {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif;
//                     background: white;
//                     color: #333;
//                     width: 105mm;
//                     min-height: 148mm;
//                     margin: 0 auto;
//                     padding: 3mm;
//                 }
                
//                 .report-container {
//                     width: 100%;
//                     height: 100%;
//                     background: white;
//                 }
                
//                 .customer-section {
//                     margin-bottom: 10px;
//                     page-break-after: always;
//                     break-after: page;
//                     background: white;
//                     border-radius: 6px;
//                     padding: 6px;
//                     position: relative;
//                     min-height: 135mm;
//                 }
                
//                 .customer-section:last-child {
//                     page-break-after: auto;
//                     break-after: auto;
//                 }
                
//                 .customer-header {
//                     text-align: center;
//                     margin-bottom: 6px;
//                     background: #e0e0e0;
//                     border-radius: 6px;
//                     padding: 6px;
//                 }
                
//                 .customer-name {
//                     font-size: 22px;
//                     color: #000;
//                     font-weight: bold;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     line-height: 1.3;
//                 }
                
//                 .customer-mobile {
//                     font-size: 14px;
//                     color: #3c3c3c;
//                     margin-top: 3px;
//                     direction: ltr;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .customer-date {
//                     font-size: 15px;
//                     color: #060606;
//                     font-weight: bold;
//                     margin-bottom: 5px;
//                     text-align: right;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .items-table {
//                     width: 100%;
//                     border-collapse: collapse;
//                     margin: 6px 0;
//                     background: white;
//                     border-radius: 4px;
//                     overflow: hidden;
//                 }
                
//                 .items-table th {
//                     background: #e0e0e0;
//                     color: #000;
//                     border: 1px solid #c0c0c0;
//                     padding: 4px 2px;
//                     text-align: center;
//                     font-size: 15px;
//                     font-weight: bold;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .items-table td {
//                     border: 1px solid #e0e0e0;
//                     padding: 4px 2px;
//                     text-align: center;
//                     font-size: 14px;
//                     background: #fafafa;
//                 }
                
//                 .items-table td:first-child,
//                 .items-table td:last-child {
//                     font-weight: bold;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .items-table td:nth-child(2) {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .total-row {
//                     background: #e0e0e0;
//                     font-weight: bold;
//                     border-top: 2px solid #4CAF50;
//                 }
                
//                 .total-row td {
//                     font-weight: bold;
//                     font-size: 14px;
//                     padding: 5px 2px;
//                     background: #e0e0e0;
//                 }
                
//                 .total-row td:first-child,
//                 .total-row td:last-child {
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .total-row td:nth-child(2) {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .footer {
//                     position: absolute;
//                     bottom: 3mm;
//                     left: 0;
//                     right: 0;
//                     text-align: center;
//                     font-size: 8px;
//                     color: #666;
//                     padding: 3px 0;
//                     border-top: 1px solid #d0d0d0;
//                     width: 100%;
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     background: white;
//                 }
                
//                 .footer-left {
//                     text-align: left;
//                     font-size: 8px;
//                     color: #333;
//                     direction: ltr;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .footer-right {
//                     text-align: right;
//                     font-size: 8px;
//                     font-weight: bold;
//                     color: #333;
//                     direction: ltr;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }

//                 .copyright {
//                     width: 100%;
//                     overflow: auto;
//                     font-size: 8px;
//                 }

//                 .contact-phone {
//                     float: right;
//                     text-decoration: none;
//                     margin-left: 20px;
//                     color: #333;
//                 }
                
//                 @media print {
//                     body {
//                         padding: 0;
//                         margin: 0;
//                         width: 105mm;
//                         min-height: 148mm;
//                         background: white;
//                     }
//                     .customer-section {
//                         page-break-after: always;
//                         break-after: page;
//                         page-break-inside: avoid;
//                         background: white;
//                     }
//                     .footer {
//                         position: fixed;
//                         bottom: 3mm;
//                         left: 0;
//                         right: 0;
//                         background: white;
//                     }
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="report-container">
//                 ${Object.entries(customerGroups)
//                   .map(([customerName, customerData], index) => {
//                     const itemsSummary =
//                       customerItemsSummary[customerName] || [];
//                     const totalItems = itemsSummary.reduce(
//                       (sum, item) => sum + item.totalQuantity,
//                       0,
//                     );
//                     const totalAmount = itemsSummary.reduce(
//                       (sum, item) => sum + item.totalAmount,
//                       0,
//                     );

//                     const latestInvoice =
//                       customerData.invoices[customerData.invoices.length - 1];
//                     const invoiceDate = formatDateForDisplay(
//                       latestInvoice?.invoice_date || new Date(),
//                     );

//                     const displayCustomerName =
//                       customerData.customerNameUrdu &&
//                       customerData.customerNameUrdu.trim() !== "" &&
//                       customerData.customerNameUrdu !==
//                         customerData.customerName
//                         ? customerData.customerNameUrdu
//                         : customerData.customerName;

//                     const displayCustomerMobile =
//                       customerData.customerMobile || "";
//                     const pageNumber = index + 1;

//                     return `
//                     <div class="customer-section">
//                         <div class="customer-header">
//                             <div class="customer-name">
//                                 ${displayCustomerName}
//                             </div>
//                             ${displayCustomerMobile ? `<div class="customer-mobile"> ${displayCustomerMobile}</div>` : ""}
//                         </div>
//                         <div class="customer-date">
//                             تاریخ: ${invoiceDate}
//                         </div>
                        
//                         <table class="items-table">
//                             <thead>
//                                 <tr>
//                                     <th>تعداد</th>
//                                     <th>آئٹم</th>
//                                     <th>ریٹ</th>
//                                     <th>رقم</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 ${itemsSummary
//                                   .map((item) => {
//                                     const displayItemName =
//                                       item.itemNameUrdu &&
//                                       item.itemNameUrdu.trim() !== ""
//                                         ? item.itemNameUrdu
//                                         : item.itemName;

//                                     return `
//                                         <tr>
//                                             <td>${item.totalQuantity.toLocaleString()}</td>
//                                             <td style="font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">${displayItemName}</td>
//                                             <td>${item.rate.toLocaleString()}</td>
//                                             <td style="font-weight: bold;">${item.totalAmount.toLocaleString()}</td>
//                                         </tr>
//                                     `;
//                                   })
//                                   .join("")}
//                                 <tr class="total-row">
//                                     <td style="font-weight: bold;">${totalItems.toLocaleString()}</td>
//                                     <td style="font-weight: bold;">-</td>
//                                     <td style="font-weight: bold;">ٹو ٹل</td>
//                                     <td style="font-weight: bold;">${totalAmount.toLocaleString()}</td>
//                                 </tr>
//                             </tbody>
//                         </table>
                        
//                         <div class="footer">
//                             <div class="footer-left">
//                                 <div class="copyright">
//                                     Software created by Ultimate Solutions     
//                                     <a href="tel:03006468177" class="contact-phone"> (0300) 6468177</a>
//                                 </div>
//                             </div>
//                             <div class="footer-right">Page ${pageNumber} of ${totalPages}</div>
//                         </div>
//                     </div>
//                 `;
//                   })
//                   .join("")}
//             </div>
//         </body>
//         </html>
//     `;

//       return html;
//     } catch (error) {
//       console.error("Error generating report HTML:", error);
//       toast.error("Failed to generate report");
//       return null;
//     }
//   };

// const generateReportHTML = async (singleCustomer = null) => {
//     try {
//       const allInvoices =
//         invoices.length > 0
//           ? invoices
//           : await window.electron.database.getInvoices();
//       const filteredInvoices = allInvoices.filter((inv) => {
//         const invDate = inv.invoice_date;
//         return invDate === selectedDate;
//       });

//       // Get all accounts for lookup by name
//       const allAccounts = await window.electron.database.getAccounts();
//       const accountByNameMap = new Map();
//       allAccounts.forEach((account) => {
//         if (account.customer_name) {
//           accountByNameMap.set(account.customer_name, account);
//         }
//       });

//       let customerGroups = {};

//       if (singleCustomer) {
//         // Get all invoice details for this customer
//         for (const invoice of filteredInvoices) {
//           const details = await window.electron.database.getInvoiceDetails(
//             invoice.invoice_id,
//           );

//           // Filter items for this specific customer
//           const customerItems = details.filter(
//             (item) => item.customer_name === singleCustomer.customer_name,
//           );

//           if (customerItems.length === 0) continue;

//           const enrichedDetails = await Promise.all(
//             customerItems.map(async (item) => {
//               if (item.item_id) {
//                 try {
//                   const product = await window.electron.database.getProductById(
//                     item.item_id,
//                   );
//                   return {
//                     ...item,
//                     item_name_urdu:
//                       product?.item_name_urdu || item.item_name_urdu || "",
//                   };
//                 } catch (err) {
//                   return item;
//                 }
//               }
//               return item;
//             }),
//           );

//           const customerKey = singleCustomer.customer_name;
//           if (!customerGroups[customerKey]) {
//             let customerMobile = "";
//             let customerUrduName = singleCustomer.customer_name_urdu || "";

//             const accountByName = accountByNameMap.get(
//               singleCustomer.customer_name,
//             );
//             if (accountByName) {
//               customerMobile = accountByName.mobile_number || "";
//               customerUrduName =
//                 accountByName.customer_name_urdu || customerUrduName;
//             }

//             customerGroups[customerKey] = {
//               customerName: singleCustomer.customer_name,
//               customerNameUrdu: customerUrduName,
//               customerId: singleCustomer.customer_id,
//               customerMobile: customerMobile,
//               invoices: [],
//               totalItems: 0,
//               totalAmount: 0,
//               discount: 0,
//               netAmount: 0,
//             };
//           }

//           customerGroups[customerKey].invoices.push({
//             ...invoice,
//             details: enrichedDetails,
//           });

//           const totalItemsForInvoice = enrichedDetails.reduce(
//             (sum, item) => sum + (item.quantity || 0),
//             0,
//           );
//           const totalAmountForInvoice = enrichedDetails.reduce(
//             (sum, item) => sum + (item.amount || 0),
//             0,
//           );

//           customerGroups[customerKey].totalItems += totalItemsForInvoice;
//           customerGroups[customerKey].totalAmount += totalAmountForInvoice;
//           customerGroups[customerKey].discount += invoice.discount || 0;
//           customerGroups[customerKey].netAmount +=
//             totalAmountForInvoice - (invoice.discount || 0);
//         }
//       } else {
//         for (const invoice of filteredInvoices) {
//           const details = await window.electron.database.getInvoiceDetails(
//             invoice.invoice_id,
//           );

//           // Group items by customer within this invoice
//           const itemsByCustomer = new Map();
//           for (const item of details) {
//             const customerName = item.customer_name;
//             if (!customerName) continue;

//             if (!itemsByCustomer.has(customerName)) {
//               let customerUrduName = item.customer_name_urdu || "";
//               let customerMobile = "";

//               const accountByName = accountByNameMap.get(customerName);
//               if (accountByName) {
//                 customerMobile = accountByName.mobile_number || "";
//                 customerUrduName =
//                   accountByName.customer_name_urdu || customerUrduName;
//               }

//               itemsByCustomer.set(customerName, {
//                 customerName: customerName,
//                 customerNameUrdu: customerUrduName,
//                 customerMobile: customerMobile,
//                 customerId: item.customer_id,
//                 items: [],
//               });
//             }

//             const enrichedItem = { ...item };
//             if (item.item_id) {
//               try {
//                 const product = await window.electron.database.getProductById(
//                   item.item_id,
//                 );
//                 enrichedItem.item_name_urdu =
//                   product?.item_name_urdu || item.item_name_urdu || "";
//               } catch (err) {
//                 console.error("Error fetching product:", err);
//               }
//             }
//             itemsByCustomer.get(customerName).items.push(enrichedItem);
//           }

//           // Add to customer groups
//           for (const [customerName, customerData] of itemsByCustomer) {
//             if (!customerGroups[customerName]) {
//               customerGroups[customerName] = {
//                 customerName: customerName,
//                 customerNameUrdu: customerData.customerNameUrdu,
//                 customerId: customerData.customerId,
//                 customerMobile: customerData.customerMobile,
//                 invoices: [],
//                 totalItems: 0,
//                 totalAmount: 0,
//                 discount: 0,
//                 netAmount: 0,
//               };
//             }

//             customerGroups[customerName].invoices.push({
//               ...invoice,
//               details: customerData.items,
//             });

//             const totalItemsForInvoice = customerData.items.reduce(
//               (sum, item) => sum + (item.quantity || 0),
//               0,
//             );
//             const totalAmountForInvoice = customerData.items.reduce(
//               (sum, item) => sum + (item.amount || 0),
//               0,
//             );

//             customerGroups[customerName].totalItems += totalItemsForInvoice;
//             customerGroups[customerName].totalAmount += totalAmountForInvoice;
//             customerGroups[customerName].discount += invoice.discount || 0;
//             customerGroups[customerName].netAmount +=
//               totalAmountForInvoice - (invoice.discount || 0);
//           }
//         }
//       }

//       // Prepare items summary per customer with rate grouping (ONLY FOR PDF)
//       const customerItemsSummary = {};
//       for (const [customerName, customerData] of Object.entries(
//         customerGroups,
//       )) {
//         const itemsSummary = new Map(); // Use Map with key as "itemName_rate"

//         for (const invoice of customerData.invoices) {
//           for (const item of invoice.details) {
//             const rate = parseFloat(item.rate) || 0;
//             const itemKey = `${item.item_id || item.item_name}_${rate}`;

//             if (!itemsSummary.has(itemKey)) {
//               itemsSummary.set(itemKey, {
//                 itemName: item.item_name,
//                 itemNameUrdu: item.item_name_urdu || "",
//                 rate: rate,
//                 totalQuantity: 0,
//                 totalAmount: 0,
//               });
//             }
//             const itemData = itemsSummary.get(itemKey);
//             itemData.totalQuantity += parseFloat(item.quantity) || 0;
//             itemData.totalAmount += parseFloat(item.amount) || 0;
//           }
//         }

//         // Convert to array and sort by item name then rate
//         customerItemsSummary[customerName] = Array.from(
//           itemsSummary.values(),
//         ).sort((a, b) => {
//           if (a.itemName === b.itemName) {
//             return a.rate - b.rate;
//           }
//           return a.itemName.localeCompare(b.itemName);
//         });
//       }

//       const formattedDate = formatDateForDisplay(selectedDate);
//       const totalCustomers = Object.keys(customerGroups).length;

//       const html = `
//         <!DOCTYPE html>
//         <html dir="rtl">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>${formattedDate} Customer wise Reports</title>
//             <style>
//                 @font-face {
//                     font-family: 'Jameel Noori Nastaleeq';
//                     src: url('https://raw.githubusercontent.com/urdufonts/jameel-noori-nastaleeq/master/JameelNooriNastaleeq.ttf') format('truetype');
//                     font-weight: normal;
//                     font-style: normal;
//                     font-display: swap;
//                 }
                
//                 @page {
//                     size: 105mm 148mm;
//                     margin: 3mm 3mm 4mm 3mm;
//                     @bottom-left {
//                         content: "Page " counter(page) " of " counter(pages);
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                         font-size: 8px;
//                         font-weight: bold;
//                         color: #333;
                        
//   margin-bottom: 8mm;
//    padding-bottom: 8mm;
  
//                     }
//                 }
                
//                 * {
//                     margin: 0;
//                     padding: 0;
//                     box-sizing: border-box;
//                 }
                
//                 body {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif;
//                     background: white;
//                     color: #333;
//                     width: 105mm;
//                     min-height: 148mm;
//                     margin: 0 auto;
//                     padding: 3mm;
//                 }
                
//                 .report-container {
//                     width: 100%;
//                     height: 100%;
//                     background: white;
//                 }
                
//                 .customer-section {
//                     margin-bottom: 10px;
//                     background: white;
//                     border-radius: 6px;
//                     padding: 6px;
//                     position: relative;
//                     min-height: 135mm;
//                     page-break-after: avoid;
//                     page-break-inside: avoid;
//                 }
                
//                 .customer-section:first-child {
//                     page-break-before: auto;
//                 }
                
//                 .customer-section:not(:first-child) {
//                     page-break-before: always;
//                 }
                
//                 .customer-header {
//                     text-align: center;
//                     margin-bottom: 6px;
//                     background: #e0e0e0;
//                     border-radius: 6px;
//                     padding: 6px;
//                 }
                
//                 .customer-name {
//                     font-size: 22px;
//                     color: #000;
//                     font-weight: bold;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     line-height: 1.3;
//                 }
                
//                 .customer-mobile {
//                     font-size: 14px;
//                     color: #3c3c3c;
//                     margin-top: 3px;
//                     direction: ltr;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .customer-date {
//                     font-size: 15px;
//                     color: #060606;
//                     font-weight: bold;
//                     margin-bottom: 5px;
//                     text-align: right;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .items-table {
//                     width: 100%;
//                     border-collapse: collapse;
//                     margin: 6px 0;
//                     background: white;
//                     border-radius: 4px;
//                     overflow: hidden;
//                     page-break-inside: avoid;
//                 }
                
//                 .items-table th {
//                     background: #e0e0e0;
//                     color: #000;
//                     border: 1px solid #c0c0c0;
//                     padding: 4px 2px;
//                     text-align: center;
//                     font-size: 15px;
//                     font-weight: bold;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .items-table td {
//                     border: 1px solid #e0e0e0;
//                     padding: 4px 2px;
//                     text-align: center;
//                     font-size: 14px;
//                     background: #fafafa;
//                 }
                
//                 .items-table td:first-child,
//                 .items-table td:last-child {
//                     font-weight: bold;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .items-table td:nth-child(2) {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .total-row {
//                     background: #e0e0e0;
//                     font-weight: bold;
//                     border-top: 2px solid #4CAF50;
//                 }
                
//                 .total-row td {
//                     font-weight: bold;
//                     font-size: 14px;
//                     padding: 5px 2px;
//                     background: #e0e0e0;
//                 }
                
//                 .total-row td:first-child,
//                 .total-row td:last-child {
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .total-row td:nth-child(2) {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .footer {
//                     position: absolute;
//                     bottom: 3mm;
//                     left: 0;
//                     right: 0;
//                     text-align: center;
//                     font-size: 8px;
//                     color: #666;
//                     padding: 3px 0;
//                     border-top: 1px solid #d0d0d0;
//                     width: 100%;
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     background: white;
//                 }
                
//                 .footer-left {
//                     text-align: left;
//                     font-size: 8px;
//                     color: #333;
//                     direction: ltr;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .copyright {
//                     width: 100%;
//                     overflow: auto;
//                     font-size: 8px;
//                 }

//                 .contact-phone {
//                     float: right;
//                     text-decoration: none;
//                     margin-left: 20px;
//                     color: #333;
//                 }
                
//                 /* Hide the manual page number in the footer */
//                 .footer-right {
//                     display: none;
//                 }
                
//                 @media print {
//                     body {
//                         padding: 0;
//                         margin: 0;
//                         width: 105mm;
//                         min-height: 148mm;
//                         background: white;
//                     }
//                     .customer-section {
//                         page-break-after: avoid;
//                         page-break-inside: avoid;
//                     }
//                     .customer-section:first-child {
//                         page-break-before: auto;
//                     }
//                     .customer-section:not(:first-child) {
//                         page-break-before: always;
//                     }
//                     .footer {
//                         position: fixed;
//                         bottom: 3mm;
//                         left: 0;
//                         right: 0;
//                         background: white;
//                     }
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="report-container">
//                 ${Object.entries(customerGroups)
//                   .map(([customerName, customerData]) => {
//                     const itemsSummary =
//                       customerItemsSummary[customerName] || [];
//                     const totalItems = itemsSummary.reduce(
//                       (sum, item) => sum + item.totalQuantity,
//                       0,
//                     );
//                     const totalAmount = itemsSummary.reduce(
//                       (sum, item) => sum + item.totalAmount,
//                       0,
//                     );

//                     const latestInvoice =
//                       customerData.invoices[customerData.invoices.length - 1];
//                     const invoiceDate = formatDateForDisplay(
//                       latestInvoice?.invoice_date || new Date(),
//                     );

//                     const displayCustomerName =
//                       customerData.customerNameUrdu &&
//                       customerData.customerNameUrdu.trim() !== "" &&
//                       customerData.customerNameUrdu !==
//                         customerData.customerName
//                         ? customerData.customerNameUrdu
//                         : customerData.customerName;

//                     const displayCustomerMobile =
//                       customerData.customerMobile || "";

//                     return `
//                     <div class="customer-section">
//                         <div class="customer-header">
//                             <div class="customer-name">
//                                 ${displayCustomerName}
//                             </div>
//                             ${displayCustomerMobile ? `<div class="customer-mobile"> ${displayCustomerMobile}</div>` : ""}
//                         </div>
//                         <div class="customer-date">
//                             تاریخ: ${invoiceDate}
//                         </div>
                        
//                         <table class="items-table">
//                             <thead>
//                                 <tr>
//                                     <th>تعداد</th>
//                                     <th>آئٹم</th>
//                                     <th>ریٹ</th>
//                                     <th>رقم</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 ${itemsSummary
//                                   .map((item) => {
//                                     const displayItemName =
//                                       item.itemNameUrdu &&
//                                       item.itemNameUrdu.trim() !== ""
//                                         ? item.itemNameUrdu
//                                         : item.itemName;

//                                     return `
//                                         <tr>
//                                             <td>${item.totalQuantity.toLocaleString()}</td>
//                                             <td style="font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">${displayItemName}</td>
//                                             <td>${item.rate.toLocaleString()}</td>
//                                             <td style="font-weight: bold;">${item.totalAmount.toLocaleString()}</td>
//                                         </tr>
//                                     `;
//                                   })
//                                   .join("")}
//                                 <tr class="total-row">
//                                     <td style="font-weight: bold;">${totalItems.toLocaleString()}</td>
//                                     <td style="font-weight: bold;">-</td>
//                                     <td style="font-weight: bold;">ٹو ٹل</td>
//                                     <td style="font-weight: bold;">${totalAmount.toLocaleString()}</td>
//                                 </tr>
//                             </tbody>
//                         </table>
                        
//                         <div class="footer">
//                             <div class="footer-left">
//                                 <div class="copyright">
//                                     Software created by Ultimate Solutions     
//                                     <a href="tel:03006468177" class="contact-phone"> (0300) 6468177</a>
//                                 </div>
//                             </div>
//                             <div class="footer-right">Page X of X</div>
//                         </div>
//                     </div>
//                 `;
//                   })
//                   .join("")}
//             </div>
//         </body>
//         </html>
//     `;

//       return html;
//     } catch (error) {
//       console.error("Error generating report HTML:", error);
//       toast.error("Failed to generate report");
//       return null;
//     }
//   };

// const generateReportHTML = async (singleCustomer = null) => {
//     try {
//       const allInvoices =
//         invoices.length > 0
//           ? invoices
//           : await window.electron.database.getInvoices();
//       const filteredInvoices = allInvoices.filter((inv) => {
//         const invDate = inv.invoice_date;
//         return invDate === selectedDate;
//       });

//       // Get all accounts for lookup by name
//       const allAccounts = await window.electron.database.getAccounts();
//       const accountByNameMap = new Map();
//       allAccounts.forEach((account) => {
//         if (account.customer_name) {
//           accountByNameMap.set(account.customer_name, account);
//         }
//       });

//       let customerGroups = {};

//       if (singleCustomer) {
//         // Get all invoice details for this customer
//         for (const invoice of filteredInvoices) {
//           const details = await window.electron.database.getInvoiceDetails(
//             invoice.invoice_id,
//           );

//           // Filter items for this specific customer
//           const customerItems = details.filter(
//             (item) => item.customer_name === singleCustomer.customer_name,
//           );

//           if (customerItems.length === 0) continue;

//           const enrichedDetails = await Promise.all(
//             customerItems.map(async (item) => {
//               if (item.item_id) {
//                 try {
//                   const product = await window.electron.database.getProductById(
//                     item.item_id,
//                   );
//                   return {
//                     ...item,
//                     item_name_urdu:
//                       product?.item_name_urdu || item.item_name_urdu || "",
//                   };
//                 } catch (err) {
//                   return item;
//                 }
//               }
//               return item;
//             }),
//           );

//           const customerKey = singleCustomer.customer_name;
//           if (!customerGroups[customerKey]) {
//             let customerMobile = "";
//             let customerUrduName = singleCustomer.customer_name_urdu || "";

//             const accountByName = accountByNameMap.get(
//               singleCustomer.customer_name,
//             );
//             if (accountByName) {
//               customerMobile = accountByName.mobile_number || "";
//               customerUrduName =
//                 accountByName.customer_name_urdu || customerUrduName;
//             }

//             customerGroups[customerKey] = {
//               customerName: singleCustomer.customer_name,
//               customerNameUrdu: customerUrduName,
//               customerId: singleCustomer.customer_id,
//               customerMobile: customerMobile,
//               invoices: [],
//               totalItems: 0,
//               totalAmount: 0,
//               discount: 0,
//               netAmount: 0,
//             };
//           }

//           customerGroups[customerKey].invoices.push({
//             ...invoice,
//             details: enrichedDetails,
//           });

//           const totalItemsForInvoice = enrichedDetails.reduce(
//             (sum, item) => sum + (item.quantity || 0),
//             0,
//           );
//           const totalAmountForInvoice = enrichedDetails.reduce(
//             (sum, item) => sum + (item.amount || 0),
//             0,
//           );

//           customerGroups[customerKey].totalItems += totalItemsForInvoice;
//           customerGroups[customerKey].totalAmount += totalAmountForInvoice;
//           customerGroups[customerKey].discount += invoice.discount || 0;
//           customerGroups[customerKey].netAmount +=
//             totalAmountForInvoice - (invoice.discount || 0);
//         }
//       } else {
//         for (const invoice of filteredInvoices) {
//           const details = await window.electron.database.getInvoiceDetails(
//             invoice.invoice_id,
//           );

//           // Group items by customer within this invoice
//           const itemsByCustomer = new Map();
//           for (const item of details) {
//             const customerName = item.customer_name;
//             if (!customerName) continue;

//             if (!itemsByCustomer.has(customerName)) {
//               let customerUrduName = item.customer_name_urdu || "";
//               let customerMobile = "";

//               const accountByName = accountByNameMap.get(customerName);
//               if (accountByName) {
//                 customerMobile = accountByName.mobile_number || "";
//                 customerUrduName =
//                   accountByName.customer_name_urdu || customerUrduName;
//               }

//               itemsByCustomer.set(customerName, {
//                 customerName: customerName,
//                 customerNameUrdu: customerUrduName,
//                 customerMobile: customerMobile,
//                 customerId: item.customer_id,
//                 items: [],
//               });
//             }

//             const enrichedItem = { ...item };
//             if (item.item_id) {
//               try {
//                 const product = await window.electron.database.getProductById(
//                   item.item_id,
//                 );
//                 enrichedItem.item_name_urdu =
//                   product?.item_name_urdu || item.item_name_urdu || "";
//               } catch (err) {
//                 console.error("Error fetching product:", err);
//               }
//             }
//             itemsByCustomer.get(customerName).items.push(enrichedItem);
//           }

//           // Add to customer groups
//           for (const [customerName, customerData] of itemsByCustomer) {
//             if (!customerGroups[customerName]) {
//               customerGroups[customerName] = {
//                 customerName: customerName,
//                 customerNameUrdu: customerData.customerNameUrdu,
//                 customerId: customerData.customerId,
//                 customerMobile: customerData.customerMobile,
//                 invoices: [],
//                 totalItems: 0,
//                 totalAmount: 0,
//                 discount: 0,
//                 netAmount: 0,
//               };
//             }

//             customerGroups[customerName].invoices.push({
//               ...invoice,
//               details: customerData.items,
//             });

//             const totalItemsForInvoice = customerData.items.reduce(
//               (sum, item) => sum + (item.quantity || 0),
//               0,
//             );
//             const totalAmountForInvoice = customerData.items.reduce(
//               (sum, item) => sum + (item.amount || 0),
//               0,
//             );

//             customerGroups[customerName].totalItems += totalItemsForInvoice;
//             customerGroups[customerName].totalAmount += totalAmountForInvoice;
//             customerGroups[customerName].discount += invoice.discount || 0;
//             customerGroups[customerName].netAmount +=
//               totalAmountForInvoice - (invoice.discount || 0);
//           }
//         }
//       }

//       // Prepare items summary per customer with rate grouping (ONLY FOR PDF)
//       const customerItemsSummary = {};
//       for (const [customerName, customerData] of Object.entries(
//         customerGroups,
//       )) {
//         const itemsSummary = new Map(); // Use Map with key as "itemName_rate"

//         for (const invoice of customerData.invoices) {
//           for (const item of invoice.details) {
//             const rate = parseFloat(item.rate) || 0;
//             const itemKey = `${item.item_id || item.item_name}_${rate}`;

//             if (!itemsSummary.has(itemKey)) {
//               itemsSummary.set(itemKey, {
//                 itemName: item.item_name,
//                 itemNameUrdu: item.item_name_urdu || "",
//                 rate: rate,
//                 totalQuantity: 0,
//                 totalAmount: 0,
//               });
//             }
//             const itemData = itemsSummary.get(itemKey);
//             itemData.totalQuantity += parseFloat(item.quantity) || 0;
//             itemData.totalAmount += parseFloat(item.amount) || 0;
//           }
//         }

//         // Convert to array and sort by item name then rate
//         customerItemsSummary[customerName] = Array.from(
//           itemsSummary.values(),
//         ).sort((a, b) => {
//           if (a.itemName === b.itemName) {
//             return a.rate - b.rate;
//           }
//           return a.itemName.localeCompare(b.itemName);
//         });
//       }

//       const formattedDate = formatDateForDisplay(selectedDate);

//       const html = `
//         <!DOCTYPE html>
//         <html dir="rtl">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>${formattedDate} Customer wise Reports</title>
//             <style>
//                 @font-face {
//                     font-family: 'Jameel Noori Nastaleeq';
//                     src: url('https://raw.githubusercontent.com/urdufonts/jameel-noori-nastaleeq/master/JameelNooriNastaleeq.ttf') format('truetype');
//                     font-weight: normal;
//                     font-style: normal;
//                     font-display: swap;
//                 }
                
//                 @page {
//                     size: 105mm 148mm;
//                     margin: 3mm 3mm 12mm 3mm;
                    
//                     @bottom-left {
//                         content: "Page " counter(page) " of " counter(pages);
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                         font-size: 7px;
//                         font-weight: bold;
//                         color: #333;
//                         direction: ltr;
//                     }
                    
//                     @bottom-right {
//                         content: "Software created by Ultimate Solutions     (0300) 6468177";
//                         font-family: 'Segoe UI', Arial, sans-serif;
//                         font-size: 7px;
//                         color: #666;
//                         direction: ltr;
//                     }
//                 }
                
//                 * {
//                     margin: 0;
//                     padding: 0;
//                     box-sizing: border-box;
//                 }
                
//                 body {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif;
//                     background: white;
//                     color: #333;
//                     width: 105mm;
//                     min-height: 148mm;
//                     margin: 0 auto;
//                     padding: 3mm;
//                 }

// body::before {
//     content: "";
//     position: fixed;
//     bottom: -10px;
//     left: 0.5mm;
//     right: 0.5mm;
//     border-top: 0.5px solid #d0d0d0;
//     z-index: 10000;
// }

                
//                 .report-container {
//                     width: 100%;
//                     height: 100%;
//                     background: white;
//                 }
                
//                 .customer-section {
//                     margin-bottom: 10px;
//                     background: white;
//                     border-radius: 6px;
//                     padding: 6px;
//                     padding-bottom: 8mm;
//                     page-break-after: avoid;
//                     page-break-inside: auto;
//                 }
                
//                 .customer-section:first-child {
//                     page-break-before: auto;
//                 }
                
//                 .customer-section:not(:first-child) {
//                     page-break-before: always;
//                 }
                
//                 .customer-header {
//                     text-align: center;
//                     margin-bottom: 6px;
//                     background: #e0e0e0;
//                     border-radius: 6px;
//                     padding: 6px;
//                 }
                
//                 .customer-name {
//                     font-size: 22px;
//                     color: #000;
//                     font-weight: bold;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                     line-height: 1.3;
//                 }
                
//                 .customer-mobile {
//                     font-size: 14px;
//                     color: #3c3c3c;
//                     margin-top: 3px;
//                     direction: ltr;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .customer-date {
//                     font-size: 15px;
//                     color: #060606;
//                     font-weight: bold;
//                     margin-bottom: 5px;
//                     text-align: right;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .items-table {
//                     width: 100%;
//                     border-collapse: collapse;
//                     margin: 6px 0;
//                     background: white;
//                     border-radius: 4px;
//                     overflow: visible;
//                 }
                
//                 .items-table thead {
//                     display: table-header-group;
//                 }
                
//                 .items-table th {
//                     background: #e0e0e0;
//                     color: #000;
//                     border: 1px solid #c0c0c0;
//                     padding: 2px 1px;
//                     text-align: center;
//                     font-size: 15px;
//                     font-weight: bold;
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .items-table td {
//                     border: 1px solid #e0e0e0;
//                     padding: 0.5px 1px;
//                     text-align: center;
//                     font-size: 14px;
//                     background: #fafafa;
//                 }
                
//                 .items-table tr {
//                     page-break-inside: avoid;
//                     page-break-after: auto;
//                 }
                
//                 .items-table td:first-child,
//                 .items-table td:last-child {
//                     font-weight: bold;
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .items-table td:nth-child(2) {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 .total-row {
//                     background: #e0e0e0;
//                     font-weight: bold;
//                     border-top: 2px solid #4CAF50;
//                     page-break-after: avoid;
//                 }
                
//                 .total-row td {
//                     font-weight: bold;
//                     font-size: 15px;
//                     padding: 1px 1px;
//                     background: #e0e0e0;
//                 }
                
//                 .total-row td:first-child,
//                 .total-row td:last-child {
//                     font-family: 'Segoe UI', Arial, sans-serif;
//                 }
                
//                 .total-row td:nth-child(2) {
//                     font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
//                 }
                
//                 @media print {
//                     body {
//                         padding: 0;
//                         margin: 0;
//                         width: 105mm;
//                         min-height: 148mm;
//                         background: white;
//                     }
//                     .customer-section {
//                         page-break-after: avoid;
//                         page-break-inside: auto;
//                         padding-bottom: 8mm;
//                     }
//                     .customer-section:first-child {
//                         page-break-before: auto;
//                     }
//                     .customer-section:not(:first-child) {
//                         page-break-before: always;
//                     }
//                     .items-table thead {
//                         display: table-header-group;
//                     }
//                     .items-table tr {
//                         page-break-inside: avoid;
//                     }
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="report-container">
//                 ${Object.entries(customerGroups)
//                   .map(([customerName, customerData]) => {
//                     const itemsSummary =
//                       customerItemsSummary[customerName] || [];
//                     const totalItems = itemsSummary.reduce(
//                       (sum, item) => sum + item.totalQuantity,
//                       0,
//                     );
//                     const totalAmount = itemsSummary.reduce(
//                       (sum, item) => sum + item.totalAmount,
//                       0,
//                     );

//                     const latestInvoice =
//                       customerData.invoices[customerData.invoices.length - 1];
//                     const invoiceDate = formatDateForDisplay(
//                       latestInvoice?.invoice_date || new Date(),
//                     );

//                     const displayCustomerName =
//                       customerData.customerNameUrdu &&
//                       customerData.customerNameUrdu.trim() !== "" &&
//                       customerData.customerNameUrdu !==
//                         customerData.customerName
//                         ? customerData.customerNameUrdu
//                         : customerData.customerName;

//                     const displayCustomerMobile =
//                       customerData.customerMobile || "";

//                     return `
//                     <div class="customer-section">
//                         <div class="customer-header">
//                             <div class="customer-name">
//                                 ${displayCustomerName}
//                             </div>
//                             ${displayCustomerMobile ? `<div class="customer-mobile"> ${displayCustomerMobile}</div>` : ""}
//                         </div>
//                         <div class="customer-date">
//                             تاریخ: ${invoiceDate}
//                         </div>
                        
//                         <table class="items-table">
//                             <thead>
//                                 <tr>
//                                     <th>تعداد</th>
//                                     <th>آئٹم</th>
//                                     <th>ریٹ</th>
//                                     <th>رقم</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 ${itemsSummary
//                                   .map((item) => {
//                                     const displayItemName =
//                                       item.itemNameUrdu &&
//                                       item.itemNameUrdu.trim() !== ""
//                                         ? item.itemNameUrdu
//                                         : item.itemName;

//                                     return `
//                                         <tr>
//                                             <td>${item.totalQuantity.toLocaleString()}</td>
//                                             <td style="font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">${displayItemName}</td>
//                                             <td>${item.rate.toLocaleString()}</td>
//                                             <td style="font-weight: bold;">${item.totalAmount.toLocaleString()}</td>
//                                         </tr>
//                                     `;
//                                   })
//                                   .join("")}
//                                 <tr class="total-row">
//                                     <td style="font-weight: bold;">${totalItems.toLocaleString()}</td>
//                                     <td style="font-weight: bold;">-</td>
//                                     <td style="font-weight: bold;">ٹو ٹل</td>
//                                     <td style="font-weight: bold;">${totalAmount.toLocaleString()}</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 `;
//                   })
//                   .join("")}
//             </div>
//         </body>
//         </html>
//     `;

//       return html;
//     } catch (error) {
//       console.error("Error generating report HTML:", error);
//       toast.error("Failed to generate report");
//       return null;
//     }
//   };


const generateReportHTML = async (singleCustomer = null) => {
    try {
      const allInvoices =
        invoices.length > 0
          ? invoices
          : await window.electron.database.getInvoices();
      const filteredInvoices = allInvoices.filter((inv) => {
        const invDate = inv.invoice_date;
        return invDate === selectedDate;
      });

      // Get all accounts for lookup by name
      const allAccounts = await window.electron.database.getAccounts();
      const accountByNameMap = new Map();
      allAccounts.forEach((account) => {
        if (account.customer_name) {
          accountByNameMap.set(account.customer_name, account);
        }
      });

      let customerGroups = {};

      if (singleCustomer) {
        // Get all invoice details for this customer
        for (const invoice of filteredInvoices) {
          const details = await window.electron.database.getInvoiceDetails(
            invoice.invoice_id,
          );

          // Filter items for this specific customer
          const customerItems = details.filter(
            (item) => item.customer_name === singleCustomer.customer_name,
          );

          if (customerItems.length === 0) continue;

          const enrichedDetails = await Promise.all(
            customerItems.map(async (item) => {
              if (item.item_id) {
                try {
                  const product = await window.electron.database.getProductById(
                    item.item_id,
                  );
                  return {
                    ...item,
                    item_name_urdu:
                      product?.item_name_urdu || item.item_name_urdu || "",
                  };
                } catch (err) {
                  return item;
                }
              }
              return item;
            }),
          );

          const customerKey = singleCustomer.customer_name;
          if (!customerGroups[customerKey]) {
            let customerMobile = "";
            let customerUrduName = singleCustomer.customer_name_urdu || "";

            const accountByName = accountByNameMap.get(
              singleCustomer.customer_name,
            );
            if (accountByName) {
              customerMobile = accountByName.mobile_number || "";
              customerUrduName =
                accountByName.customer_name_urdu || customerUrduName;
            }

            customerGroups[customerKey] = {
              customerName: singleCustomer.customer_name,
              customerNameUrdu: customerUrduName,
              customerId: singleCustomer.customer_id,
              customerMobile: customerMobile,
              invoices: [],
              totalItems: 0,
              totalAmount: 0,
              discount: 0,
              netAmount: 0,
            };
          }

          customerGroups[customerKey].invoices.push({
            ...invoice,
            details: enrichedDetails,
          });

          const totalItemsForInvoice = enrichedDetails.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0,
          );
          const totalAmountForInvoice = enrichedDetails.reduce(
            (sum, item) => sum + (item.amount || 0),
            0,
          );

          customerGroups[customerKey].totalItems += totalItemsForInvoice;
          customerGroups[customerKey].totalAmount += totalAmountForInvoice;
          customerGroups[customerKey].discount += invoice.discount || 0;
          customerGroups[customerKey].netAmount +=
            totalAmountForInvoice - (invoice.discount || 0);
        }
      } else {
        for (const invoice of filteredInvoices) {
          const details = await window.electron.database.getInvoiceDetails(
            invoice.invoice_id,
          );

          // Group items by customer within this invoice
          const itemsByCustomer = new Map();
          for (const item of details) {
            const customerName = item.customer_name;
            if (!customerName) continue;

            if (!itemsByCustomer.has(customerName)) {
              let customerUrduName = item.customer_name_urdu || "";
              let customerMobile = "";

              const accountByName = accountByNameMap.get(customerName);
              if (accountByName) {
                customerMobile = accountByName.mobile_number || "";
                customerUrduName =
                  accountByName.customer_name_urdu || customerUrduName;
              }

              itemsByCustomer.set(customerName, {
                customerName: customerName,
                customerNameUrdu: customerUrduName,
                customerMobile: customerMobile,
                customerId: item.customer_id,
                items: [],
              });
            }

            const enrichedItem = { ...item };
            if (item.item_id) {
              try {
                const product = await window.electron.database.getProductById(
                  item.item_id,
                );
                enrichedItem.item_name_urdu =
                  product?.item_name_urdu || item.item_name_urdu || "";
              } catch (err) {
                console.error("Error fetching product:", err);
              }
            }
            itemsByCustomer.get(customerName).items.push(enrichedItem);
          }

          // Add to customer groups
          for (const [customerName, customerData] of itemsByCustomer) {
            if (!customerGroups[customerName]) {
              customerGroups[customerName] = {
                customerName: customerName,
                customerNameUrdu: customerData.customerNameUrdu,
                customerId: customerData.customerId,
                customerMobile: customerData.customerMobile,
                invoices: [],
                totalItems: 0,
                totalAmount: 0,
                discount: 0,
                netAmount: 0,
              };
            }

            customerGroups[customerName].invoices.push({
              ...invoice,
              details: customerData.items,
            });

            const totalItemsForInvoice = customerData.items.reduce(
              (sum, item) => sum + (item.quantity || 0),
              0,
            );
            const totalAmountForInvoice = customerData.items.reduce(
              (sum, item) => sum + (item.amount || 0),
              0,
            );

            customerGroups[customerName].totalItems += totalItemsForInvoice;
            customerGroups[customerName].totalAmount += totalAmountForInvoice;
            customerGroups[customerName].discount += invoice.discount || 0;
            customerGroups[customerName].netAmount +=
              totalAmountForInvoice - (invoice.discount || 0);
          }
        }
      }

      // Prepare items summary per customer with grouping by item first, then by rate
      const customerItemsSummary = {};
      for (const [customerName, customerData] of Object.entries(
        customerGroups,
      )) {
        // First group by item name
        const itemsByNameMap = new Map();
        
        for (const invoice of customerData.invoices) {
          for (const item of invoice.details) {
            const itemName = item.item_name;
            const itemNameUrdu = item.item_name_urdu || "";
            
            if (!itemsByNameMap.has(itemName)) {
              itemsByNameMap.set(itemName, {
                itemName: itemName,
                itemNameUrdu: itemNameUrdu,
                rates: new Map() // Map of rate -> {totalQuantity, totalAmount}
              });
            }
            
            const itemData = itemsByNameMap.get(itemName);
            const rate = parseFloat(item.rate) || 0;
            
            if (!itemData.rates.has(rate)) {
              itemData.rates.set(rate, {
                rate: rate,
                totalQuantity: 0,
                totalAmount: 0
              });
            }
            
            const rateData = itemData.rates.get(rate);
            rateData.totalQuantity += parseFloat(item.quantity) || 0;
            rateData.totalAmount += parseFloat(item.amount) || 0;
          }
        }
        
        // Convert to array format: first by item, then by rate
        const summaryArray = [];
        for (const [itemName, itemData] of itemsByNameMap) {
          const rateArray = Array.from(itemData.rates.values()).sort((a, b) => a.rate - b.rate);
          for (const rateData of rateArray) {
            summaryArray.push({
              itemName: itemData.itemName,
              itemNameUrdu: itemData.itemNameUrdu,
              rate: rateData.rate,
              totalQuantity: rateData.totalQuantity,
              totalAmount: rateData.totalAmount
            });
          }
        }
        
        customerItemsSummary[customerName] = summaryArray;
      }

      const formattedDate = formatDateForDisplay(selectedDate);

      const html = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${formattedDate} Customer wise Reports</title>
            <style>
                @font-face {
                    font-family: 'Jameel Noori Nastaleeq';
                    src: url('https://raw.githubusercontent.com/urdufonts/jameel-noori-nastaleeq/master/JameelNooriNastaleeq.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap;
                }
                
                @page {
                    size: 105mm 148mm;
                    margin: 3mm 3mm 6mm 3mm;
                    
                    @bottom-left {
                        content: "Page " counter(page) " of " counter(pages);
                        font-family: 'Segoe UI', Arial, sans-serif;
                        font-size: 7px;
                        font-weight: bold;
                        color: #333;
                        direction: ltr;
                    }
                    
                    @bottom-center {
                        content: "Software created by Ultimate Solutions     (0300) 6468177";
                        font-family: 'Segoe UI', Arial, sans-serif;
                        font-size: 7px;
                        color: #666;
                        direction: ltr;
                    }
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif;
                    background: white;
                    color: #333;
                    width: 105mm;
                    min-height: 148mm;
                    margin: 0 auto;
                    padding: 3mm;
                }

                body::before {
                    content: "";
                    position: fixed;
                    bottom: 0mm;
                    left: 0.5mm;
                    right: 0.5mm;
                    border-top: 0.5px solid #d0d0d0;
                    z-index: 10000;
                }
                
                .report-container {
                    width: 100%;
                    height: 100%;
                    background: white;
                }
                
                .customer-section {
                    margin-bottom: 3px;
                    background: white;
                    border-radius: 6px;
                    padding: 2px;
                    padding-bottom: 4mm;
                    page-break-after: avoid;
                    page-break-inside: auto;
                }
                
                .customer-section:first-child {
                    page-break-before: auto;
                }
                
                .customer-section:not(:first-child) {
                    page-break-before: always;
                }
                
                .customer-header {
                    text-align: center;
                    margin-bottom: 4px;
                    background: #e0e0e0;
                    border-radius: 6px;
                    padding: 4px;
                }
                
                .customer-name {
                    font-size: 22px;
                    color: #000;
                    font-weight: bold;
                    font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
                    line-height: 1.2;
                }
                
                .customer-mobile {
                    font-size: 9px;
                    color: #3c3c3c;
                    margin-top: 1px;
                    direction: ltr;
                    font-family: 'Segoe UI', Arial, sans-serif;
                }
                
                .customer-date {
                    font-size: 15px;
                    color: #060606;
                    font-weight: bold;
                    margin-bottom: 2px;
                    text-align: right;
                    font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
                }
                
                .items-table {
    width: 100%;
    border-collapse: collapse;
    margin: 2px 0;
    margin-left:3px;
    background: white;
    border-radius: 4px;
    overflow: visible;
}

.items-table th,
.items-table td {
    border: 1px solid #c0c0c0;
}
                .items-table thead {
                    display: table-header-group;
                }
                
                .items-table th {
                    background: #e0e0e0;
                    color: #000;
                    border: 1px solid #c0c0c0;
                    padding: 1px 0.5px;
                    text-align: center;
                    font-size: 15px;
                    font-weight: bold;
                    font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
                }
                
                .items-table td {
                    border: 1px solid #e0e0e0;
                    padding: 0.5px 0.5px;
                    text-align: center;
                    font-size: 15px;
                    background: #fafafa;
                }
                
                .items-table tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }
                
                .items-table td:first-child,
                .items-table td:last-child {
                    font-weight: bold;
                    font-family: 'Segoe UI', Arial, sans-serif;
                }
                
                .items-table td:nth-child(2) {
                    font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
                }
                
                .total-row {
                    background: #e0e0e0;
                    font-weight: bold;
                    border-top: 2px solid #4CAF50;
                    page-break-after: avoid;
                }
                
                .total-row td {
                    font-weight: bold;
                    font-size: 15px;
                    padding: 1px 0.5px;
                    background: #e0e0e0;
                }
                
                .total-row td:first-child,
                .total-row td:last-child {
                    font-family: 'Segoe UI', Arial, sans-serif;
                }
                
                .total-row td:nth-child(2) {
                    font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
                }
                
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                        width: 105mm;
                        min-height: 148mm;
                        background: white;
                    }
                    .customer-section {
                        page-break-after: avoid;
                        page-break-inside: auto;
                        padding-bottom: 10mm;
                    }
                    .customer-section:first-child {
                        page-break-before: auto;
                    }
                    .customer-section:not(:first-child) {
                        page-break-before: always;
                    }
                    .items-table thead {
                        display: table-header-group;
                    }
                    .items-table tr {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="report-container">
                ${Object.entries(customerGroups)
                  .map(([customerName, customerData]) => {
                    const itemsSummary =
                      customerItemsSummary[customerName] || [];
                    const totalItems = itemsSummary.reduce(
                      (sum, item) => sum + item.totalQuantity,
                      0,
                    );
                    const totalAmount = itemsSummary.reduce(
                      (sum, item) => sum + item.totalAmount,
                      0,
                    );

                    const latestInvoice =
                      customerData.invoices[customerData.invoices.length - 1];
                    const invoiceDate = formatDateForDisplay(
                      latestInvoice?.invoice_date || new Date(),
                    );

                    const displayCustomerName =
                      customerData.customerNameUrdu &&
                      customerData.customerNameUrdu.trim() !== "" &&
                      customerData.customerNameUrdu !==
                        customerData.customerName
                        ? customerData.customerNameUrdu
                        : customerData.customerName;

                    const displayCustomerMobile =
                      customerData.customerMobile || "";

                    return `
                    <div class="customer-section">
                        <div class="customer-header">
                            <div class="customer-name">
                                ${displayCustomerName}
                            </div>
                            ${displayCustomerMobile ? `<div class="customer-mobile"> ${displayCustomerMobile}</div>` : ""}
                        </div>
                        <div class="customer-date">
                            تاریخ: ${invoiceDate}
                        </div>
                        
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>تعداد</th>
                                    <th>آئٹم</th>
                                    <th>ریٹ</th>
                                    <th>رقم</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsSummary
                                  .map((item) => {
                                    const displayItemName =
                                      item.itemNameUrdu &&
                                      item.itemNameUrdu.trim() !== ""
                                        ? item.itemNameUrdu
                                        : item.itemName;

                                    return `
                                        <tr>
                                            <td>${item.totalQuantity.toLocaleString()}</td>
                                            <td style="font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">${displayItemName}</td>
                                            <td>${item.rate.toLocaleString()}</td>
                                            <td style="font-weight: bold;">${item.totalAmount.toLocaleString()}</td>
                                        </tr>
                                    `;
                                  })
                                  .join("")}
                                <tr class="total-row">
                                    <td style="font-weight: bold;">${totalItems.toLocaleString()}</td>
                                    <td style="font-weight: bold;">-</td>
                                    <td style="font-weight: bold;">ٹو ٹل</td>
                                    <td style="font-weight: bold;">${totalAmount.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                  })
                  .join("")}
            </div>
        </body>
        </html>
    `;

      return html;
    } catch (error) {
      console.error("Error generating report HTML:", error);
      toast.error("Failed to generate report");
      return null;
    }
  };

  const generateAllCustomersReport = async () => {
    setLoading(true);
    try {
      const html = await generateReportHTML();
      if (html) {
        await generateAndOpenPDF(
          html,
          `Sales_Report_${formatDateForDisplay(selectedDate)}`,
        );
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const generateSingleCustomerReport = async (customer) => {
    setLoading(true);
    try {
      const html = await generateReportHTML(customer);
      if (html) {
        await generateAndOpenPDF(
          html,
          `${customer.customer_name}_Report_${formatDateForDisplay(selectedDate)}`,
        );
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const DatePickerCalendar = ({ currentDate, onSelect }) => {
    const [displayDate, setDisplayDate] = useState(() => {
      if (currentDate && !isNaN(currentDate.getTime())) {
        return new Date(currentDate);
      }
      return new Date();
    });

    useEffect(() => {
      if (currentDate && !isNaN(currentDate.getTime())) {
        setDisplayDate(new Date(currentDate));
      }
    }, [currentDate]);

    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const days = [];
      const startOffset = firstDay.getDay();
      for (let i = 0; i < startOffset; i++) days.push(null);
      for (let i = 1; i <= lastDay.getDate(); i++)
        days.push(new Date(year, month, i));
      return days;
    };

    const isSameDay = (date1, date2) => {
      return (
        date1 &&
        date2 &&
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    const days = getDaysInMonth(displayDate);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const handlePrevMonth = () => {
      setDisplayDate(
        new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1),
      );
    };

    const handleNextMonth = () => {
      setDisplayDate(
        new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1),
      );
    };

    return (
      <div ref={datePickerRef} style={calendarStyles.container}>
        <div style={calendarStyles.header}>
          <button
            onClick={handlePrevMonth}
            style={calendarStyles.navButton}
            type="button"
          >
            ←
          </button>
          <span style={calendarStyles.monthYear}>
            {monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}
          </span>
          <button
            onClick={handleNextMonth}
            style={calendarStyles.navButton}
            type="button"
          >
            →
          </button>
        </div>
        <div style={calendarStyles.weekdays}>
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} style={calendarStyles.weekday}>
              {day}
            </div>
          ))}
        </div>
        <div style={calendarStyles.days}>
          {days.map((date, idx) => (
            <div
              key={idx}
              onClick={() => date && onSelect(date)}
              style={{
                ...calendarStyles.day,
                ...(date ? calendarStyles.dayCell : {}),
                ...(date && currentDate && isSameDay(date, currentDate)
                  ? calendarStyles.selected
                  : {}),
                ...(date &&
                isSameDay(date, new Date()) &&
                (!currentDate || !isSameDay(date, currentDate))
                  ? calendarStyles.today
                  : {}),
              }}
            >
              {date ? date.getDate() : ""}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const calendarStyles = {
    container: {
      position: "absolute",
      top: "100%",
      left: 0,
      background: "white",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      padding: "12px",
      zIndex: 9999,
      marginTop: "4px",
      width: "280px",
      backgroundColor: "white",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    navButton: {
      background: "none",
      border: "none",
      fontSize: "16px",
      cursor: "pointer",
      padding: "4px 8px",
      borderRadius: "4px",
      color: "#666",
      transition: "background 0.2s",
    },
    monthYear: { fontWeight: "bold", fontSize: "14px" },
    weekdays: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      marginBottom: "8px",
    },
    weekday: {
      textAlign: "center",
      fontSize: "11px",
      color: "#666",
      padding: "4px",
    },
    days: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "2px",
    },
    dayCell: {
      textAlign: "center",
      padding: "6px",
      fontSize: "12px",
      cursor: "pointer",
      borderRadius: "4px",
      transition: "background 0.2s",
      backgroundColor: "white",
      color: "#333",
    },
    day: { color: "#333" },
    selected: {
      backgroundColor: "#4CAF50",
      color: "white",
      fontWeight: "bold",
    },
    today: {
      border: "1px solid #4CAF50",
      fontWeight: "bold",
      backgroundColor: "#e8f5e9",
    },
  };

  const styles = {
    container: {
      padding: "16px",
      maxWidth: "1400px",
      margin: "0 auto",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      padding: "12px 20px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "8px",
      color: "white",
    },
    headerTitle: { margin: 0, fontSize: "20px", fontWeight: "600" },
    buttonGroup: { display: "flex", gap: "8px" },
    buttonPrimary: {
      padding: "6px 14px",
      background: "white",
      color: "#667eea",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
    },
    buttonSuccess: {
      padding: "6px 14px",
      background: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
    },
    card: {
      background: "white",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    row: {
      display: "flex",
      gap: "16px",
      alignItems: "flex-end",
      flexWrap: "wrap",
    },
    formGroup: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      minWidth: "200px",
    },
    formGroupSearch: {
      flex: 2,
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      minWidth: "300px",
    },
    label: {
      fontSize: "11px",
      fontWeight: "500",
      color: "#666",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    dateInputWrapper: { position: "relative", width: "100%" },
    input: {
      padding: "8px 12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "13px",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    },
    searchInput: {
      padding: "8px 12px 8px 36px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "13px",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    },
    searchIcon: {
      position: "absolute",
      left: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#999",
      fontSize: "16px",
    },
    calendarIcon: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#999",
      cursor: "pointer",
      fontSize: "16px",
    },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
    tableHeader: {
      background: "#f5f5f5",
      borderBottom: "2px solid #e0e0e0",
      fontWeight: "600",
    },
    tableCell: {
      padding: "12px",
      textAlign: "left",
      borderBottom: "1px solid #e0e0e0",
    },
    tableCellRight: {
      padding: "12px",
      textAlign: "right",
      borderBottom: "1px solid #e0e0e0",
    },
    tableCellCenter: {
      padding: "12px",
      textAlign: "center",
      borderBottom: "1px solid #e0e0e0",
    },
    actionButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "6px",
      borderRadius: "4px",
      fontSize: "16px",
      color: "#2196F3",
      transition: "all 0.2s",
    },
    tabContainer: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
      borderBottom: "2px solid #e0e0e0",
    },
    tab: {
      padding: "10px 20px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      border: "none",
      background: "none",
      color: "#666",
      transition: "all 0.2s",
    },
    activeTab: {
      color: "#4CAF50",
      borderBottom: "2px solid #4CAF50",
      marginBottom: "-2px",
    },
    loadingOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    loadingSpinner: {
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #4CAF50",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite",
    },
    searchWrapper: { position: "relative", width: "100%" },
  };

  if (loading) {
    return (
      <div style={styles.loadingOverlay}>
        <div style={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>📊 Sales Reports</h1>
        <div style={styles.buttonGroup}>
          <button
            onClick={generateAllCustomersReport}
            style={styles.buttonSuccess}
          >
            <FiPrinter size={14} /> Print All Report
          </button>
        </div>
      </div>

      <div style={styles.tabContainer}>
        <button
          onClick={() => {
            setActiveTab("customer");
            setSearchTerm("");
          }}
          style={{
            ...styles.tab,
            ...(activeTab === "customer" ? styles.activeTab : {}),
          }}
        >
          <FiUser size={14} style={{ marginRight: "6px" }} /> Customer Summary
        </button>
        <button
          onClick={() => {
            setActiveTab("item");
            setSearchTerm("");
          }}
          style={{
            ...styles.tab,
            ...(activeTab === "item" ? styles.activeTab : {}),
          }}
        >
          <FiPackage size={14} style={{ marginRight: "6px" }} /> Item Summary
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>SELECT DATE</label>
            <div style={styles.dateInputWrapper}>
              <input
                ref={dateInputRef}
                type="text"
                placeholder="DD/MM/YYYY"
                value={tempDate}
                onChange={(e) => handleDateInputChange(e.target.value)}
                onFocus={() => setShowDatePicker(true)}
                onBlur={handleDateBlur}
                style={styles.input}
              />
              <FiCalendar
                style={styles.calendarIcon}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDatePicker(!showDatePicker);
                }}
              />
              {showDatePicker && (
                <DatePickerCalendar
                  currentDate={new Date(selectedDate)}
                  onSelect={handleDateSelect}
                />
              )}
            </div>
          </div>
          <div style={styles.formGroupSearch}>
            <label style={styles.label}>
              {activeTab === "customer" ? "SEARCH CUSTOMER" : "SEARCH ITEM"}
            </label>
            <div style={styles.searchWrapper}>
              <FiSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder={
                  activeTab === "customer"
                    ? "Search by customer name..."
                    : "Search by item name..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>
        </div>
      </div>

      {activeTab === "customer" && (
        <div style={styles.card}>
          <h3
            style={{
              margin: "0 0 16px 0",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            📋 Customer Summary
            {searchTerm &&
              ` (Filtered: ${filteredCustomerSummary.length} of ${customerSummary.length})`}
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr
                  style={{
                    ...styles.tableHeader,
                    background: "#4CAF50",
                    color: "white",
                  }}
                >
                  <th style={styles.tableCell}>#</th>
                  <th style={styles.tableCell}>Customer Name</th>
                  <th style={styles.tableCellRight}>Total Amount</th>
                  <th style={styles.tableCell}>Date</th>
                  <th style={styles.tableCellCenter}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomerSummary.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#999",
                      }}
                    >
                      {searchTerm
                        ? "No matching customers found"
                        : "No data found for selected date"}
                    </td>
                  </tr>
                ) : (
                  filteredCustomerSummary.map((customer) => (
                    <tr key={customer.sr_no}>
                      <td style={styles.tableCell}>{customer.sr_no}</td>
                      <td style={styles.tableCell}>
                        <strong>{customer.customer_name}</strong>
                        {customer.customer_name_urdu && (
                          <div
                            style={{
                              fontSize: "18px",
                              color: "#666",
                              fontFamily:
                                "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif",
                              marginTop: "4px",
                              fontFamily:
                                "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif",
                            }}
                          >
                            {customer.customer_name_urdu}
                          </div>
                        )}
                      </td>
                      <td style={styles.tableCellRight}>
                        <strong style={{ color: "#4CAF50" }}>
                          ₨ {customer.total_amount.toLocaleString()}
                        </strong>
                      </td>
                      <td style={styles.tableCell}>
                        {formatDateForDisplay(customer.invoice_date)}
                      </td>
                      <td style={styles.tableCellCenter}>
                        <button
                          onClick={() => generateSingleCustomerReport(customer)}
                          style={styles.actionButton}
                          title="Print Report"
                        >
                          <FiFileText size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredCustomerSummary.length > 0 && (
                <tfoot>
                  <tr style={{ background: "#f5f5f5", fontWeight: "bold" }}>
                    <td colSpan="2" style={styles.tableCellRight}>
                      <strong>GRAND TOTAL:</strong>
                    </td>
                    <td style={styles.tableCellRight}>
                      <strong style={{ color: "#4CAF50" }}>
                        ₨{" "}
                        {filteredCustomerSummary
                          .reduce((sum, c) => sum + c.total_amount, 0)
                          .toLocaleString()}
                      </strong>
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {activeTab === "item" && (
        <div style={styles.card}>
          <h3
            style={{
              margin: "0 0 16px 0",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            📦 Item Summary
            {searchTerm &&
              ` (Filtered: ${filteredItemSummary.length} of ${itemWiseSummary.length})`}
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr
                  style={{
                    ...styles.tableHeader,
                    background: "#4CAF50",
                    color: "white",
                  }}
                >
                  <th style={styles.tableCell}>#</th>
                  <th style={styles.tableCell}>Item Name</th>
                  <th style={styles.tableCellRight}>Quantity</th>
                  <th style={styles.tableCellRight}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredItemSummary.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#999",
                      }}
                    >
                      {searchTerm
                        ? "No matching items found"
                        : "No items found for selected date"}
                    </td>
                  </tr>
                ) : (
                  filteredItemSummary.map((item) => (
                    <tr key={item.sr_no}>
                      <td style={styles.tableCell}>{item.sr_no}</td>
                      <td style={styles.tableCell}>
                        <div>{item.item_name}</div>
                        {item.item_name_urdu && (
                          <div
                            style={{
                              fontSize: "18px",
                              color: "#666",
                              fontFamily:
                                "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif",
                              marginTop: "4px",
                              fontFamily:
                                "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif",
                            }}
                          >
                            {item.item_name_urdu}
                          </div>
                        )}
                      </td>
                      <td style={styles.tableCellRight}>
                        <strong>{item.total_quantity.toLocaleString()}</strong>
                      </td>
                      <td style={styles.tableCellRight}>
                        <strong style={{ color: "#4CAF50" }}>
                          ₨ {item.total_amount.toLocaleString()}
                        </strong>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredItemSummary.length > 0 && (
                <tfoot>
                  <tr style={{ background: "#f5f5f5", fontWeight: "bold" }}>
                    <td colSpan="2" style={styles.tableCellRight}>
                      <strong>GRAND TOTAL:</strong>
                    </td>
                    <td style={styles.tableCellRight}>
                      <strong>
                        {filteredItemSummary
                          .reduce((sum, i) => sum + (i.total_quantity || 0), 0)
                          .toLocaleString()}
                      </strong>
                    </td>
                    <td style={styles.tableCellRight}>
                      <strong style={{ color: "#4CAF50" }}>
                        ₨{" "}
                        {filteredItemSummary
                          .reduce((sum, i) => sum + (i.total_amount || 0), 0)
                          .toLocaleString()}
                      </strong>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
    </div>
  );
}

export default Reports;
