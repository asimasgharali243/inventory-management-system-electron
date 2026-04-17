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
