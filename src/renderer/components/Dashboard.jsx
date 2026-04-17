// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { Link, useLocation } from 'react-router-dom';
// // // // // import {
// // // // //     FiHome, FiPackage, FiUsers, FiFileText, FiBarChart2,
// // // // //     FiDatabase, FiLogOut, FiUser
// // // // // } from 'react-icons/fi';

// // // // // function Dashboard({ user, onLogout, children }) {
// // // // //     const location = useLocation();
// // // // //     const [stats, setStats] = useState({
// // // // //         products: 0,
// // // // //         accounts: 0,
// // // // //         invoices: 0,
// // // // //         totalSales: 0
// // // // //     });

// // // // //     useEffect(() => {
// // // // //         loadStats();
// // // // //     }, []);

// // // // //     const loadStats = async () => {
// // // // //         try {
// // // // //             const products = await window.electron.database.getProducts();
// // // // //             const accounts = await window.electron.database.getAccounts();
// // // // //             const invoices = await window.electron.database.getInvoices();

// // // // //             const totalSales = invoices.reduce((sum, inv) => sum + inv.net_amount, 0);

// // // // //             setStats({
// // // // //                 products: products.length,
// // // // //                 accounts: accounts.length,
// // // // //                 invoices: invoices.length,
// // // // //                 totalSales: totalSales
// // // // //             });
// // // // //         } catch (error) {
// // // // //             console.error('Failed to load stats', error);
// // // // //         }
// // // // //     };

// // // // //     const menuItems = [
// // // // //         { path: '/', icon: FiHome, label: 'Dashboard' },
// // // // //         { path: '/products', icon: FiPackage, label: 'Products' },
// // // // //         { path: '/accounts', icon: FiUsers, label: 'Accounts' },
// // // // //         { path: '/invoices', icon: FiFileText, label: 'Invoices' },
// // // // //         { path: '/invoices/new', icon: FiFileText, label: 'New Invoice' },
// // // // //         { path: '/reports', icon: FiBarChart2, label: 'Reports' },
// // // // //         { path: '/backup', icon: FiDatabase, label: 'Backup/Restore' }
// // // // //     ];

// // // // //     return (
// // // // //         <div className="dashboard">
// // // // //             <div className="sidebar">
// // // // //                 <h2>IMS</h2>
// // // // //                 <nav>
// // // // //                     <ul>
// // // // //                         {menuItems.map(item => (
// // // // //                             <li key={item.path}>
// // // // //                                 <Link to={item.path} className={location.pathname === item.path ? 'active' : ''}>
// // // // //                                     <item.icon /> {item.label}
// // // // //                                 </Link>
// // // // //                             </li>
// // // // //                         ))}
// // // // //                     </ul>
// // // // //                 </nav>
// // // // //             </div>

// // // // //             <div className="main-content">
// // // // //                 <div className="main-header">
// // // // //                     <h3>Welcome, {user.full_name || user.username}!</h3>
// // // // //                     <div className="user-info">
// // // // //                         <FiUser />
// // // // //                         <span>{user.role}</span>
// // // // //                         <button className="logout-btn" onClick={onLogout}>
// // // // //                             <FiLogOut /> Logout
// // // // //                         </button>
// // // // //                     </div>
// // // // //                 </div>

// // // // //                 {location.pathname === '/' && (
// // // // //                     <div className="stats-grid">
// // // // //                         <div className="stat-card">
// // // // //                             <h3>Total Products</h3>
// // // // //                             <div className="stat-value">{stats.products}</div>
// // // // //                         </div>
// // // // //                         <div className="stat-card">
// // // // //                             <h3>Total Accounts</h3>
// // // // //                             <div className="stat-value">{stats.accounts}</div>
// // // // //                         </div>
// // // // //                         <div className="stat-card">
// // // // //                             <h3>Total Invoices</h3>
// // // // //                             <div className="stat-value">{stats.invoices}</div>
// // // // //                         </div>
// // // // //                         <div className="stat-card">
// // // // //                             <h3>Total Sales</h3>
// // // // //                             <div className="stat-value">₨ {stats.totalSales.toLocaleString()}</div>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 )}

// // // // //                 {children || <div className="container">{location.pathname !== '/' && <div>Content will load here</div>}</div>}
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // // export default Dashboard;


// // // // import React, { useState, useEffect, useContext } from 'react';
// // // // import { Link, useLocation, useNavigate } from 'react-router-dom';
// // // // import { NavigationContext } from '../App';
// // // // import {
// // // //     FiHome, FiPackage, FiUsers, FiFileText, FiBarChart2,
// // // //     FiDatabase, FiLogOut, FiUser, FiMenu, FiChevronLeft,
// // // //     FiChevronRight, FiArrowLeft
// // // // } from 'react-icons/fi';

// // // // function Dashboard({ user, onLogout, children }) {
// // // //     const location = useLocation();
// // // //     const navigate = useNavigate();
// // // //     const { goBack, currentPath } = useContext(NavigationContext);
// // // //     const [stats, setStats] = useState({
// // // //         products: 0,
// // // //         accounts: 0,
// // // //         invoices: 0,
// // // //         totalSales: 0
// // // //     });
// // // //     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

// // // //     useEffect(() => {
// // // //         loadStats();

// // // //         // Listen for custom back navigation event
// // // //         const handleBackNavigation = () => {
// // // //             goBack();
// // // //         };

// // // //         window.addEventListener('navigateBack', handleBackNavigation);
// // // //         return () => window.removeEventListener('navigateBack', handleBackNavigation);
// // // //     }, []);

// // // //     const loadStats = async () => {
// // // //         try {
// // // //             const products = await window.electron.database.getProducts();
// // // //             const accounts = await window.electron.database.getAccounts();
// // // //             const invoices = await window.electron.database.getInvoices();

// // // //             const totalSales = invoices.reduce((sum, inv) => sum + inv.net_amount, 0);

// // // //             setStats({
// // // //                 products: products.length,
// // // //                 accounts: accounts.length,
// // // //                 invoices: invoices.length,
// // // //                 totalSales: totalSales
// // // //             });
// // // //         } catch (error) {
// // // //             console.error('Failed to load stats', error);
// // // //         }
// // // //     };

// // // //     const menuItems = [
// // // //         { path: '/', icon: FiHome, label: 'Dashboard' },
// // // //         { path: '/products', icon: FiPackage, label: 'Products' },
// // // //         { path: '/accounts', icon: FiUsers, label: 'Accounts' },
// // // //         { path: '/invoices', icon: FiFileText, label: 'Invoices' },
// // // //         { path: '/invoices/new', icon: FiFileText, label: 'New Invoice' },
// // // //         { path: '/reports', icon: FiBarChart2, label: 'Reports' },
// // // //         { path: '/backup', icon: FiDatabase, label: 'Backup/Restore' }
// // // //     ];

// // // //     const toggleSidebar = () => {
// // // //         setSidebarCollapsed(!sidebarCollapsed);
// // // //     };

// // // //     const isActive = (path) => {
// // // //         if (path === '/') {
// // // //             return location.pathname === '/';
// // // //         }
// // // //         return location.pathname.startsWith(path);
// // // //     };

// // // //     return (
// // // //         <div className="dashboard">
// // // //             <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
// // // //                 <div className="sidebar-header">
// // // //                     {!sidebarCollapsed && <h2>IMS</h2>}
// // // //                     <button className="toggle-btn" onClick={toggleSidebar}>
// // // //                         {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
// // // //                     </button>
// // // //                 </div>
// // // //                 <nav>
// // // //                     <ul>
// // // //                         {menuItems.map(item => (
// // // //                             <li key={item.path}>
// // // //                                 <Link
// // // //                                     to={item.path}
// // // //                                     className={isActive(item.path) ? 'active' : ''}
// // // //                                     title={sidebarCollapsed ? item.label : ''}
// // // //                                 >
// // // //                                     <item.icon />
// // // //                                     {!sidebarCollapsed && <span>{item.label}</span>}
// // // //                                 </Link>
// // // //                             </li>
// // // //                         ))}
// // // //                     </ul>
// // // //                 </nav>
// // // //                 {!sidebarCollapsed && (
// // // //                     <div className="sidebar-footer">
// // // //                         <div className="user-info-sidebar">
// // // //                             <FiUser />
// // // //                             <span>{user.full_name || user.username}</span>
// // // //                         </div>
// // // //                         <button className="logout-btn-sidebar" onClick={onLogout}>
// // // //                             <FiLogOut /> Logout
// // // //                         </button>
// // // //                     </div>
// // // //                 )}
// // // //                 {sidebarCollapsed && (
// // // //                     <div className="sidebar-footer-collapsed">
// // // //                         <button className="logout-icon-btn" onClick={onLogout} title="Logout">
// // // //                             <FiLogOut />
// // // //                         </button>
// // // //                     </div>
// // // //                 )}
// // // //             </div>

// // // //             <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
// // // //                 <div className="main-header">
// // // //                     <div className="header-left">
// // // //                         <button className="back-btn" onClick={goBack} title="Go Back (Backspace)">
// // // //                             <FiArrowLeft /> Back
// // // //                         </button>
// // // //                         <span className="back-hint">(Press Backspace)</span>
// // // //                     </div>
// // // //                     <div className="user-info">
// // // //                         <FiUser />
// // // //                         <span>{user.full_name || user.username}</span>
// // // //                         <span className="user-role">({user.role})</span>
// // // //                         <button className="logout-btn" onClick={onLogout}>
// // // //                             <FiLogOut /> Logout
// // // //                         </button>
// // // //                     </div>
// // // //                 </div>

// // // //                 {location.pathname === '/' && (
// // // //                     <div className="stats-grid">
// // // //                         <div className="stat-card">
// // // //                             <h3>Total Products</h3>
// // // //                             <div className="stat-value">{stats.products}</div>
// // // //                         </div>
// // // //                         <div className="stat-card">
// // // //                             <h3>Total Accounts</h3>
// // // //                             <div className="stat-value">{stats.accounts}</div>
// // // //                         </div>
// // // //                         <div className="stat-card">
// // // //                             <h3>Total Invoices</h3>
// // // //                             <div className="stat-value">{stats.invoices}</div>
// // // //                         </div>
// // // //                         <div className="stat-card">
// // // //                             <h3>Total Sales</h3>
// // // //                             <div className="stat-value">₨ {stats.totalSales.toLocaleString()}</div>
// // // //                         </div>
// // // //                     </div>
// // // //                 )}

// // // //                 {children || <div className="content-area">{location.pathname !== '/' && <div>Content will load here</div>}</div>}
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }

// // // // export default Dashboard;

// // // import React, { useState, useEffect, useContext } from 'react';
// // // import { Link, useLocation, useNavigate } from 'react-router-dom';
// // // import { NavigationContext } from '../App';
// // // import {
// // //     FiHome, FiPackage, FiUsers, FiFileText, FiBarChart2,
// // //     FiDatabase, FiLogOut, FiUser, FiMenu, FiChevronLeft,
// // //     FiChevronRight, FiArrowLeft
// // // } from 'react-icons/fi';

// // // function Dashboard({ user, onLogout, children }) {
// // //     const location = useLocation();
// // //     const navigate = useNavigate();
// // //     const { goBack, currentPath } = useContext(NavigationContext);
// // //     const [stats, setStats] = useState({
// // //         products: 0,
// // //         accounts: 0,
// // //         invoices: 0,
// // //         totalSales: 0
// // //     });
// // //     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

// // //     useEffect(() => {
// // //         loadStats();

// // //         // Listen for custom back navigation event
// // //         const handleBackNavigation = () => {
// // //             goBack();
// // //         };

// // //         window.addEventListener('navigateBack', handleBackNavigation);
// // //         return () => window.removeEventListener('navigateBack', handleBackNavigation);
// // //     }, []);

// // //     const loadStats = async () => {
// // //         try {
// // //             if (window.electron && window.electron.database) {
// // //                 const products = await window.electron.database.getProducts();
// // //                 const accounts = await window.electron.database.getAccounts();
// // //                 const invoices = await window.electron.database.getInvoices();

// // //                 const totalSales = invoices.reduce((sum, inv) => sum + (inv.net_amount || 0), 0);

// // //                 setStats({
// // //                     products: products ? products.length : 0,
// // //                     accounts: accounts ? accounts.length : 0,
// // //                     invoices: invoices ? invoices.length : 0,
// // //                     totalSales: totalSales
// // //                 });
// // //             }
// // //         } catch (error) {
// // //             console.error('Failed to load stats', error);
// // //         }
// // //     };

// // //     const menuItems = [
// // //         { path: '/', icon: FiHome, label: 'Dashboard' },
// // //         { path: '/products', icon: FiPackage, label: 'Products' },
// // //         { path: '/accounts', icon: FiUsers, label: 'Accounts' },
// // //         { path: '/invoices', icon: FiFileText, label: 'Invoices' },
// // //         { path: '/invoices/new', icon: FiFileText, label: 'New Invoice' },
// // //         { path: '/reports', icon: FiBarChart2, label: 'Reports' },
// // //         { path: '/backup', icon: FiDatabase, label: 'Backup/Restore' }
// // //     ];

// // //     const toggleSidebar = () => {
// // //         setSidebarCollapsed(!sidebarCollapsed);
// // //     };

// // //     const isActive = (path) => {
// // //         if (path === '/') {
// // //             return location.pathname === '/';
// // //         }
// // //         return location.pathname.startsWith(path);
// // //     };

// // //     return (
// // //         <div className="dashboard">
// // //             <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
// // //                 <div className="sidebar-header">
// // //                     {!sidebarCollapsed && <h2>IMS</h2>}
// // //                     <button className="toggle-btn" onClick={toggleSidebar}>
// // //                         {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
// // //                     </button>
// // //                 </div>
// // //                 <nav>
// // //                     <ul>
// // //                         {menuItems.map(item => (
// // //                             <li key={item.path}>
// // //                                 <Link
// // //                                     to={item.path}
// // //                                     className={isActive(item.path) ? 'active' : ''}
// // //                                     title={sidebarCollapsed ? item.label : ''}
// // //                                 >
// // //                                     <item.icon />
// // //                                     {!sidebarCollapsed && <span>{item.label}</span>}
// // //                                 </Link>
// // //                             </li>
// // //                         ))}
// // //                     </ul>
// // //                 </nav>
// // //                 {!sidebarCollapsed && (
// // //                     <div className="sidebar-footer">
// // //                         <div className="user-info-sidebar">
// // //                             <FiUser />
// // //                             <span>{user?.full_name || user?.username || 'User'}</span>
// // //                         </div>
// // //                         <button className="logout-btn-sidebar" onClick={onLogout}>
// // //                             <FiLogOut /> Logout
// // //                         </button>
// // //                     </div>
// // //                 )}
// // //                 {sidebarCollapsed && (
// // //                     <div className="sidebar-footer-collapsed">
// // //                         <button className="logout-icon-btn" onClick={onLogout} title="Logout">
// // //                             <FiLogOut />
// // //                         </button>
// // //                     </div>
// // //                 )}
// // //             </div>

// // //             <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
// // //                 <div className="main-header">
// // //                     <div className="header-left">
// // //                         <button className="back-btn" onClick={goBack} title="Go Back (Backspace)">
// // //                             <FiArrowLeft /> Back
// // //                         </button>
// // //                         <span className="back-hint">(Press Backspace)</span>
// // //                     </div>
// // //                     <div className="user-info">
// // //                         <FiUser />
// // //                         <span>{user?.full_name || user?.username || 'User'}</span>
// // //                         <span className="user-role">({user?.role || 'Admin'})</span>
// // //                         <button className="logout-btn" onClick={onLogout}>
// // //                             <FiLogOut /> Logout
// // //                         </button>
// // //                     </div>
// // //                 </div>

// // //                 {location.pathname === '/' && (
// // //                     <div className="dashboard-content">
// // //                         <div className="stats-grid">
// // //                             <div className="stat-card">
// // //                                 <h3>Total Products</h3>
// // //                                 <div className="stat-value">{stats.products}</div>
// // //                             </div>
// // //                             <div className="stat-card">
// // //                                 <h3>Total Accounts</h3>
// // //                                 <div className="stat-value">{stats.accounts}</div>
// // //                             </div>
// // //                             <div className="stat-card">
// // //                                 <h3>Total Invoices</h3>
// // //                                 <div className="stat-value">{stats.invoices}</div>
// // //                             </div>
// // //                             <div className="stat-card">
// // //                                 <h3>Total Sales</h3>
// // //                                 <div className="stat-value">₨ {stats.totalSales.toLocaleString()}</div>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 )}

// // //                 <div className="content-area">
// // //                     {children}
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // export default Dashboard;

// // import React, { useState, useEffect, useContext } from 'react';
// // import { Link, useLocation, useNavigate } from 'react-router-dom';
// // import { NavigationContext } from '../App';
// // import {
// //     FiHome, FiPackage, FiUsers, FiFileText, FiBarChart2,
// //     FiDatabase, FiLogOut, FiUser, FiMenu, FiChevronLeft,
// //     FiChevronRight, FiArrowLeft, FiTrendingUp, FiPieChart
// // } from 'react-icons/fi';
// // import {
// //     Chart as ChartJS,
// //     CategoryScale,
// //     LinearScale,
// //     BarElement,
// //     Title,
// //     Tooltip,
// //     Legend,
// //     ArcElement,
// //     PointElement,
// //     LineElement,
// //     Filler
// // } from 'chart.js';
// // import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// // // Register ChartJS components
// // ChartJS.register(
// //     CategoryScale,
// //     LinearScale,
// //     BarElement,
// //     Title,
// //     Tooltip,
// //     Legend,
// //     ArcElement,
// //     PointElement,
// //     LineElement,
// //     Filler
// // );

// // function Dashboard({ user, onLogout, children }) {
// //     const location = useLocation();
// //     const navigate = useNavigate();
// //     const { goBack, currentPath } = useContext(NavigationContext);
// //     const [stats, setStats] = useState({
// //         products: 0,
// //         accounts: 0,
// //         invoices: 0,
// //         totalSales: 0
// //     });
// //     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
// //     const [salesData, setSalesData] = useState([]);
// //     const [topProducts, setTopProducts] = useState([]);
// //     const [monthlyTrend, setMonthlyTrend] = useState([]);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         loadStats();
// //         loadChartData();

// //         // Listen for custom back navigation event
// //         const handleBackNavigation = () => {
// //             goBack();
// //         };

// //         window.addEventListener('navigateBack', handleBackNavigation);
// //         return () => window.removeEventListener('navigateBack', handleBackNavigation);
// //     }, []);

// //     const loadStats = async () => {
// //         try {
// //             if (window.electron && window.electron.database) {
// //                 const products = await window.electron.database.getProducts();
// //                 const accounts = await window.electron.database.getAccounts();
// //                 const invoices = await window.electron.database.getInvoices();

// //                 const totalSales = invoices.reduce((sum, inv) => sum + (inv.net_amount || 0), 0);

// //                 setStats({
// //                     products: products ? products.length : 0,
// //                     accounts: accounts ? accounts.length : 0,
// //                     invoices: invoices ? invoices.length : 0,
// //                     totalSales: totalSales
// //                 });
// //             }
// //         } catch (error) {
// //             console.error('Failed to load stats', error);
// //         }
// //     };

// //     const loadChartData = async () => {
// //         setLoading(true);
// //         try {
// //             if (window.electron && window.electron.database) {
// //                 // Get last 6 months of data
// //                 const endDate = new Date();
// //                 const startDate = new Date();
// //                 startDate.setMonth(startDate.getMonth() - 5);
// //                 startDate.setDate(1);

// //                 const startDateStr = startDate.toISOString().split('T')[0];
// //                 const endDateStr = endDate.toISOString().split('T')[0];

// //                 // Get sales report
// //                 const sales = await window.electron.database.getSalesReport(startDateStr, endDateStr);

// //                 // Process monthly sales data
// //                 const monthlySales = processMonthlySales(sales, startDate, endDate);
// //                 setMonthlyTrend(monthlySales);

// //                 // Get top products
// //                 const itemSummary = await window.electron.database.getItemWiseSummary(startDateStr, endDateStr);
// //                 const top5Products = itemSummary.slice(0, 5);
// //                 setTopProducts(top5Products);

// //                 // Get daily sales for last 7 days
// //                 const dailySales = processDailySales(sales);
// //                 setSalesData(dailySales);
// //             }
// //         } catch (error) {
// //             console.error('Failed to load chart data', error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const processMonthlySales = (sales, startDate, endDate) => {
// //         const months = {};
// //         const currentDate = new Date(startDate);

// //         while (currentDate <= endDate) {
// //             const monthKey = currentDate.toLocaleString('default', { month: 'short' });
// //             months[monthKey] = 0;
// //             currentDate.setMonth(currentDate.getMonth() + 1);
// //         }

// //         sales.forEach(sale => {
// //             const saleDate = new Date(sale.invoice_date);
// //             const monthKey = saleDate.toLocaleString('default', { month: 'short' });
// //             if (months[monthKey] !== undefined) {
// //                 months[monthKey] += sale.net_amount || 0;
// //             }
// //         });

// //         return {
// //             labels: Object.keys(months),
// //             values: Object.values(months)
// //         };
// //     };

// //     const processDailySales = (sales) => {
// //         const last7Days = {};
// //         for (let i = 6; i >= 0; i--) {
// //             const date = new Date();
// //             date.setDate(date.getDate() - i);
// //             const dateKey = date.toISOString().split('T')[0];
// //             const dayName = date.toLocaleString('default', { weekday: 'short' });
// //             last7Days[dayName] = 0;
// //         }

// //         sales.forEach(sale => {
// //             const saleDate = new Date(sale.invoice_date);
// //             const dayName = saleDate.toLocaleString('default', { weekday: 'short' });
// //             if (last7Days[dayName] !== undefined) {
// //                 last7Days[dayName] += sale.net_amount || 0;
// //             }
// //         });

// //         return {
// //             labels: Object.keys(last7Days),
// //             values: Object.values(last7Days)
// //         };
// //     };

// //     // Chart configurations
// //     const salesTrendConfig = {
// //         labels: monthlyTrend.labels || [],
// //         datasets: [
// //             {
// //                 label: 'Monthly Sales (₨)',
// //                 data: monthlyTrend.values || [],
// //                 fill: true,
// //                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
// //                 borderColor: 'rgba(75, 192, 192, 1)',
// //                 borderWidth: 2,
// //                 tension: 0.4,
// //                 pointBackgroundColor: 'rgba(75, 192, 192, 1)',
// //                 pointBorderColor: '#fff',
// //                 pointHoverRadius: 8,
// //                 pointRadius: 4
// //             }
// //         ]
// //     };

// //     const dailySalesConfig = {
// //         labels: salesData.labels || [],
// //         datasets: [
// //             {
// //                 label: 'Daily Sales (₨)',
// //                 data: salesData.values || [],
// //                 backgroundColor: 'rgba(54, 162, 235, 0.6)',
// //                 borderColor: 'rgba(54, 162, 235, 1)',
// //                 borderWidth: 1,
// //                 borderRadius: 8,
// //                 hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)'
// //             }
// //         ]
// //     };

// //     const topProductsConfig = {
// //         labels: topProducts.map(p => p.item_name || p.item_name_urdu),
// //         datasets: [
// //             {
// //                 label: 'Sales Amount (₨)',
// //                 data: topProducts.map(p => p.total_amount || 0),
// //                 backgroundColor: [
// //                     'rgba(255, 99, 132, 0.7)',
// //                     'rgba(54, 162, 235, 0.7)',
// //                     'rgba(255, 206, 86, 0.7)',
// //                     'rgba(75, 192, 192, 0.7)',
// //                     'rgba(153, 102, 255, 0.7)'
// //                 ],
// //                 borderWidth: 1,
// //                 borderColor: '#fff'
// //             }
// //         ]
// //     };

// //     const salesDistributionConfig = {
// //         labels: ['Products', 'Services', 'Other'],
// //         datasets: [
// //             {
// //                 data: [85, 10, 5],
// //                 backgroundColor: [
// //                     'rgba(255, 99, 132, 0.8)',
// //                     'rgba(54, 162, 235, 0.8)',
// //                     'rgba(255, 206, 86, 0.8)'
// //                 ],
// //                 borderWidth: 2,
// //                 borderColor: '#fff',
// //                 hoverOffset: 10
// //             }
// //         ]
// //     };

// //     const chartOptions = {
// //         responsive: true,
// //         maintainAspectRatio: false,
// //         plugins: {
// //             legend: {
// //                 position: 'bottom',
// //                 labels: {
// //                     usePointStyle: true,
// //                     boxWidth: 10,
// //                     font: {
// //                         size: 12
// //                     }
// //                 }
// //             },
// //             tooltip: {
// //                 callbacks: {
// //                     label: function (context) {
// //                         let label = context.dataset.label || '';
// //                         if (label) {
// //                             label += ': ';
// //                         }
// //                         if (context.parsed.y !== undefined) {
// //                             label += '₨ ' + context.parsed.y.toLocaleString();
// //                         } else if (context.parsed !== undefined) {
// //                             label += '₨ ' + context.parsed.toLocaleString();
// //                         }
// //                         return label;
// //                     }
// //                 }
// //             }
// //         }
// //     };

// //     const menuItems = [
// //         { path: '/', icon: FiHome, label: 'Dashboard' },
// //         { path: '/products', icon: FiPackage, label: 'Products' },
// //         { path: '/accounts', icon: FiUsers, label: 'Customers' },
// //         { path: '/invoices', icon: FiFileText, label: 'Sale Invoice' },
// //         { path: '/reports', icon: FiBarChart2, label: 'Report' },
// //         { path: '/backup', icon: FiDatabase, label: 'Backup/Restore' },
// //         { path: '/user-management', icon: FiUsers, label: 'User Management' }
// //     ];

// //     const toggleSidebar = () => {
// //         setSidebarCollapsed(!sidebarCollapsed);
// //     };

// //     const isActive = (path) => {
// //         if (path === '/') {
// //             return location.pathname === '/';
// //         }
// //         return location.pathname.startsWith(path);
// //     };

// //     return (
// //         <div className="dashboard">
// //             <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
// //                 <div className="sidebar-header">
// //                     {!sidebarCollapsed && <h2>IMS</h2>}
// //                     <button className="toggle-btn" onClick={toggleSidebar}>
// //                         {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
// //                     </button>
// //                 </div>
// //                 <nav>
// //                     <ul>
// //                         {menuItems.map(item => (
// //                             <li key={item.path}>
// //                                 <Link
// //                                     to={item.path}
// //                                     className={isActive(item.path) ? 'active' : ''}
// //                                     title={sidebarCollapsed ? item.label : ''}
// //                                 >
// //                                     <item.icon />
// //                                     {!sidebarCollapsed && <span>{item.label}</span>}
// //                                 </Link>
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>
// //                 {!sidebarCollapsed && (
// //                     <div className="sidebar-footer">
// //                         <div className="user-info-sidebar">
// //                             <FiUser />
// //                             <span>{user?.full_name || user?.username || 'User'}</span>
// //                         </div>
// //                         <button className="logout-btn-sidebar" onClick={onLogout}>
// //                             <FiLogOut /> Logout
// //                         </button>
// //                     </div>
// //                 )}
// //                 {sidebarCollapsed && (
// //                     <div className="sidebar-footer-collapsed">
// //                         <button className="logout-icon-btn" onClick={onLogout} title="Logout">
// //                             <FiLogOut />
// //                         </button>
// //                     </div>
// //                 )}
// //             </div>

// //             <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
// //                 <div className="main-header">
// //                     <div className="header-left">
// //                         <button className="back-btn" onClick={goBack} title="Go Back (Backspace)">
// //                             <FiArrowLeft /> Back
// //                         </button>
// //                         <span className="back-hint">(Press Backspace)</span>
// //                     </div>
// //                     <div className="user-info">
// //                         <FiUser />
// //                         <span>{user?.full_name || user?.username || 'User'}</span>
// //                         <span className="user-role">({user?.role || 'Admin'})</span>
// //                         <button className="logout-btn" onClick={onLogout}>
// //                             <FiLogOut /> Logout
// //                         </button>
// //                     </div>
// //                 </div>

// //                 {location.pathname === '/' && (
// //                     <div className="dashboard-content">
// //                         {/* Stats Grid */}
// //                         <div className="stats-grid">
// //                             <div className="stat-card">
// //                                 <FiPackage className="stat-icon" />
// //                                 <div className="stat-info">
// //                                     <h3>Total Products</h3>
// //                                     <div className="stat-value">{stats.products}</div>
// //                                 </div>
// //                             </div>
// //                             <div className="stat-card">
// //                                 <FiUsers className="stat-icon" />
// //                                 <div className="stat-info">
// //                                     <h3>Total Accounts</h3>
// //                                     <div className="stat-value">{stats.accounts}</div>
// //                                 </div>
// //                             </div>
// //                             <div className="stat-card">
// //                                 <FiFileText className="stat-icon" />
// //                                 <div className="stat-info">
// //                                     <h3>Total Invoices</h3>
// //                                     <div className="stat-value">{stats.invoices}</div>
// //                                 </div>
// //                             </div>
// //                             <div className="stat-card">
// //                                 <FiTrendingUp className="stat-icon" />
// //                                 <div className="stat-info">
// //                                     <h3>Total Sales</h3>
// //                                     <div className="stat-value">₨ {stats.totalSales.toLocaleString()}</div>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* Charts Grid */}
// //                         <div className="charts-grid">
// //                             {/* Sales Trend Chart */}
// //                             <div className="chart-card large">
// //                                 <div className="chart-header">
// //                                     <h3>
// //                                         <FiTrendingUp />
// //                                         Sales Trend (Last 6 Months)
// //                                     </h3>
// //                                     <button
// //                                         className="refresh-btn"
// //                                         onClick={loadChartData}
// //                                         title="Refresh Data"
// //                                     >
// //                                         🔄
// //                                     </button>
// //                                 </div>
// //                                 <div className="chart-container">
// //                                     {loading ? (
// //                                         <div className="chart-loading">Loading chart data...</div>
// //                                     ) : (
// //                                         <Line data={salesTrendConfig} options={chartOptions} />
// //                                     )}
// //                                 </div>
// //                             </div>

// //                             {/* Daily Sales Chart */}
// //                             <div className="chart-card">
// //                                 <div className="chart-header">
// //                                     <h3>Daily Sales (Last 7 Days)</h3>
// //                                 </div>
// //                                 <div className="chart-container">
// //                                     {loading ? (
// //                                         <div className="chart-loading">Loading chart data...</div>
// //                                     ) : (
// //                                         <Bar data={dailySalesConfig} options={chartOptions} />
// //                                     )}
// //                                 </div>
// //                             </div>

// //                             {/* Top Products Chart */}
// //                             <div className="chart-card">
// //                                 <div className="chart-header">
// //                                     <h3>Top 5 Products by Sales</h3>
// //                                 </div>
// //                                 <div className="chart-container">
// //                                     {loading ? (
// //                                         <div className="chart-loading">Loading chart data...</div>
// //                                     ) : (
// //                                         <Bar data={topProductsConfig} options={chartOptions} />
// //                                     )}
// //                                 </div>
// //                             </div>

// //                             {/* Sales Distribution */}
// //                             {/* <div className="chart-card">
// //                                 <div className="chart-header">
// //                                     <h3>
// //                                         <FiPieChart />
// //                                         Sales Distribution
// //                                     </h3>
// //                                 </div>
// //                                 <div className="chart-container">
// //                                     <Doughnut data={salesDistributionConfig} options={chartOptions} />
// //                                 </div>
// //                             </div> */}
// //                         </div>

// //                         {/* Recent Invoices Table */}
// //                         <div className="recent-section">
// //                             <div className="section-header">
// //                                 <h3>Recent Invoices</h3>
// //                                 <Link to="/invoices" className="view-all-btn">View All</Link>
// //                             </div>
// //                             <div className="recent-table-container">
// //                                 <RecentInvoicesTable />
// //                             </div>
// //                         </div>
// //                     </div>
// //                 )}

// //                 <div className="content-area">
// //                     {children}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // // Recent Invoices Component
// // function RecentInvoicesTable() {
// //     const [invoices, setInvoices] = useState([]);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         loadRecentInvoices();
// //     }, []);

// //     const loadRecentInvoices = async () => {
// //         try {
// //             if (window.electron && window.electron.database) {
// //                 const allInvoices = await window.electron.database.getInvoices();
// //                 const recent = allInvoices.slice(0, 5);
// //                 setInvoices(recent);
// //             }
// //         } catch (error) {
// //             console.error('Failed to load recent invoices', error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     if (loading) {
// //         return <div className="loading">Loading recent invoices...</div>;
// //     }

// //     if (invoices.length === 0) {
// //         return <div className="no-data">No invoices found</div>;
// //     }

// //     return (
// //         <table className="recent-table">
// //             <thead>
// //                 <tr>
// //                     <th>Invoice #</th>
// //                     <th>Date</th>
// //                     <th>Customer</th>
// //                     <th>Amount</th>
// //                     <th>Status</th>
// //                 </tr>
// //             </thead>
// //             <tbody>
// //                 {invoices.map(invoice => (
// //                     <tr key={invoice.invoice_id}>
// //                         <td>{invoice.voucher_id}</td>
// //                         <td>{new Date(invoice.invoice_date).toLocaleDateString()}</td>
// //                         <td>{invoice.customer_name || 'Walk-in Customer'}</td>
// //                         <td>₨ {invoice.net_amount?.toLocaleString()}</td>
// //                         <td><span className="status-badge paid">Paid</span></td>
// //                     </tr>
// //                 ))}
// //             </tbody>
// //         </table>
// //     );
// // }

// // export default Dashboard;
// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { NavigationContext } from '../App';
// import {
//     FiHome, FiPackage, FiUsers, FiFileText, FiBarChart2,
//     FiDatabase, FiLogOut, FiUser, FiMenu, FiChevronLeft,
//     FiChevronRight, FiArrowLeft, FiTrendingUp, FiPieChart
// } from 'react-icons/fi';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
//     PointElement,
//     LineElement,
//     Filler
// } from 'chart.js';
// import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// // Register ChartJS components
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
//     PointElement,
//     LineElement,
//     Filler
// );

// function Dashboard({ user, onLogout, children }) {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { goBack, currentPath } = useContext(NavigationContext);
//     const [stats, setStats] = useState({
//         products: 0,
//         accounts: 0,
//         invoices: 0,
//         totalSales: 0
//     });
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//     const [salesData, setSalesData] = useState([]);
//     const [topProducts, setTopProducts] = useState([]);
//     const [monthlyTrend, setMonthlyTrend] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [recentInvoices, setRecentInvoices] = useState([]);

//     useEffect(() => {
//         loadStats();
//         loadChartData();
//         loadRecentInvoices();

//         // Listen for custom back navigation event
//         const handleBackNavigation = () => {
//             goBack();
//         };

//         window.addEventListener('navigateBack', handleBackNavigation);
//         return () => window.removeEventListener('navigateBack', handleBackNavigation);
//     }, []);

//     const loadStats = async () => {
//         try {
//             if (window.electron && window.electron.database) {
//                 const products = await window.electron.database.getProducts();
//                 const accounts = await window.electron.database.getAccounts();
//                 const invoices = await window.electron.database.getInvoices();

//                 // Calculate total sales from invoices
//                 const totalSales = invoices.reduce((sum, inv) => sum + (inv.net_amount || 0), 0);

//                 setStats({
//                     products: products ? products.length : 0,
//                     accounts: accounts ? accounts.length : 0,
//                     invoices: invoices ? invoices.length : 0,
//                     totalSales: totalSales
//                 });
//             }
//         } catch (error) {
//             console.error('Failed to load stats', error);
//         }
//     };

//     const loadRecentInvoices = async () => {
//         try {
//             if (window.electron && window.electron.database) {
//                 const allInvoices = await window.electron.database.getInvoices();
//                 const recent = allInvoices.slice(0, 5);
                
//                 // Load details for each invoice to get customer information
//                 const invoicesWithCustomers = await Promise.all(recent.map(async (invoice) => {
//                     const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
//                     // Get unique customers from details
//                     const uniqueCustomers = [...new Set(details.map(d => d.customer_name).filter(Boolean))];
//                     const customerNames = uniqueCustomers.join(', ');
//                     return {
//                         ...invoice,
//                         customer_names: customerNames || 'Walk-in Customer',
//                         customer_count: uniqueCustomers.length
//                     };
//                 }));
                
//                 setRecentInvoices(invoicesWithCustomers);
//             }
//         } catch (error) {
//             console.error('Failed to load recent invoices', error);
//         }
//     };

//     const loadChartData = async () => {
//         setLoading(true);
//         try {
//             if (window.electron && window.electron.database) {
//                 // Get last 6 months of data
//                 const endDate = new Date();
//                 const startDate = new Date();
//                 startDate.setMonth(startDate.getMonth() - 5);
//                 startDate.setDate(1);

//                 const startDateStr = startDate.toISOString().split('T')[0];
//                 const endDateStr = endDate.toISOString().split('T')[0];

//                 // Get sales report
//                 const sales = await window.electron.database.getSalesReport(startDateStr, endDateStr);

//                 // Process monthly sales data
//                 const monthlySales = processMonthlySales(sales, startDate, endDate);
//                 setMonthlyTrend(monthlySales);

//                 // Get top products
//                 const itemSummary = await window.electron.database.getItemWiseSummary(startDateStr, endDateStr);
//                 const top5Products = itemSummary.slice(0, 5);
//                 setTopProducts(top5Products);

//                 // Get daily sales for last 7 days
//                 const dailySales = processDailySales(sales);
//                 setSalesData(dailySales);
//             }
//         } catch (error) {
//             console.error('Failed to load chart data', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const processMonthlySales = (sales, startDate, endDate) => {
//         const months = {};
//         const currentDate = new Date(startDate);

//         while (currentDate <= endDate) {
//             const monthKey = currentDate.toLocaleString('default', { month: 'short' });
//             months[monthKey] = 0;
//             currentDate.setMonth(currentDate.getMonth() + 1);
//         }

//         sales.forEach(sale => {
//             const saleDate = new Date(sale.invoice_date);
//             const monthKey = saleDate.toLocaleString('default', { month: 'short' });
//             if (months[monthKey] !== undefined) {
//                 months[monthKey] += sale.net_amount || 0;
//             }
//         });

//         return {
//             labels: Object.keys(months),
//             values: Object.values(months)
//         };
//     };

//     const processDailySales = (sales) => {
//         const last7Days = {};
//         for (let i = 6; i >= 0; i--) {
//             const date = new Date();
//             date.setDate(date.getDate() - i);
//             const dateKey = date.toISOString().split('T')[0];
//             const dayName = date.toLocaleString('default', { weekday: 'short' });
//             last7Days[dayName] = 0;
//         }

//         sales.forEach(sale => {
//             const saleDate = new Date(sale.invoice_date);
//             const dayName = saleDate.toLocaleString('default', { weekday: 'short' });
//             if (last7Days[dayName] !== undefined) {
//                 last7Days[dayName] += sale.net_amount || 0;
//             }
//         });

//         return {
//             labels: Object.keys(last7Days),
//             values: Object.values(last7Days)
//         };
//     };

//     // Chart configurations
//     const salesTrendConfig = {
//         labels: monthlyTrend.labels || [],
//         datasets: [
//             {
//                 label: 'Monthly Sales (₨)',
//                 data: monthlyTrend.values || [],
//                 fill: true,
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 2,
//                 tension: 0.4,
//                 pointBackgroundColor: 'rgba(75, 192, 192, 1)',
//                 pointBorderColor: '#fff',
//                 pointHoverRadius: 8,
//                 pointRadius: 4
//             }
//         ]
//     };

//     const dailySalesConfig = {
//         labels: salesData.labels || [],
//         datasets: [
//             {
//                 label: 'Daily Sales (₨)',
//                 data: salesData.values || [],
//                 backgroundColor: 'rgba(54, 162, 235, 0.6)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1,
//                 borderRadius: 8,
//                 hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)'
//             }
//         ]
//     };

//     const topProductsConfig = {
//         labels: topProducts.map(p => p.item_name_urdu || p.item_name),
//         datasets: [
//             {
//                 label: 'Sales Amount (₨)',
//                 data: topProducts.map(p => p.total_amount || 0),
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.7)',
//                     'rgba(54, 162, 235, 0.7)',
//                     'rgba(255, 206, 86, 0.7)',
//                     'rgba(75, 192, 192, 0.7)',
//                     'rgba(153, 102, 255, 0.7)'
//                 ],
//                 borderWidth: 1,
//                 borderColor: '#fff'
//             }
//         ]
//     };

//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'bottom',
//                 labels: {
//                     usePointStyle: true,
//                     boxWidth: 10,
//                     font: {
//                         size: 12
//                     }
//                 }
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function (context) {
//                         let label = context.dataset.label || '';
//                         if (label) {
//                             label += ': ';
//                         }
//                         if (context.parsed.y !== undefined) {
//                             label += '₨ ' + context.parsed.y.toLocaleString();
//                         } else if (context.parsed !== undefined) {
//                             label += '₨ ' + context.parsed.toLocaleString();
//                         }
//                         return label;
//                     }
//                 }
//             }
//         }
//     };

//     const menuItems = [
//         { path: '/', icon: FiHome, label: 'Dashboard' },
//         { path: '/products', icon: FiPackage, label: 'Products' },
//         { path: '/accounts', icon: FiUsers, label: 'Customers' },
//         { path: '/invoices', icon: FiFileText, label: 'Sale Invoice' },
//         { path: '/reports', icon: FiBarChart2, label: 'Report' },
//         { path: '/backup', icon: FiDatabase, label: 'Backup/Restore' },
//         { path: '/user-management', icon: FiUsers, label: 'User Management' }
//     ];

//     const toggleSidebar = () => {
//         setSidebarCollapsed(!sidebarCollapsed);
//     };

//     const isActive = (path) => {
//         if (path === '/') {
//             return location.pathname === '/';
//         }
//         return location.pathname.startsWith(path);
//     };

//     const formatDateForDisplay = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) return '';
//         return date.toLocaleDateString();
//     };

//     return (
//         <div className="dashboard">
//             <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
//                 <div className="sidebar-header">
//                     {!sidebarCollapsed && <h2>IMS</h2>}
//                     <button className="toggle-btn" onClick={toggleSidebar}>
//                         {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
//                     </button>
//                 </div>
//                 <nav>
//                     <ul>
//                         {menuItems.map(item => (
//                             <li key={item.path}>
//                                 <Link
//                                     to={item.path}
//                                     className={isActive(item.path) ? 'active' : ''}
//                                     title={sidebarCollapsed ? item.label : ''}
//                                 >
//                                     <item.icon />
//                                     {!sidebarCollapsed && <span>{item.label}</span>}
//                                 </Link>
//                             </li>
//                         ))}
//                     </ul>
//                 </nav>
//                 {!sidebarCollapsed && (
//                     <div className="sidebar-footer">
//                         <div className="user-info-sidebar">
//                             <FiUser />
//                             <span>{user?.full_name || user?.username || 'User'}</span>
//                         </div>
//                         <button className="logout-btn-sidebar" onClick={onLogout}>
//                             <FiLogOut /> Logout
//                         </button>
//                     </div>
//                 )}
//                 {sidebarCollapsed && (
//                     <div className="sidebar-footer-collapsed">
//                         <button className="logout-icon-btn" onClick={onLogout} title="Logout">
//                             <FiLogOut />
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
//                 <div className="main-header">
//                     <div className="header-left">
//                         <button className="back-btn" onClick={goBack} title="Go Back (Backspace)">
//                             <FiArrowLeft /> Back
//                         </button>
//                         <span className="back-hint">(Press Backspace)</span>
//                     </div>
//                     <div className="user-info">
//                         <FiUser />
//                         <span>{user?.full_name || user?.username || 'User'}</span>
//                         <span className="user-role">({user?.role || 'Admin'})</span>
//                         <button className="logout-btn" onClick={onLogout}>
//                             <FiLogOut /> Logout
//                         </button>
//                     </div>
//                 </div>

//                 {location.pathname === '/' && (
//                     <div className="dashboard-content">
//                         {/* Stats Grid */}
//                         <div className="stats-grid">
//                             <div className="stat-card">
//                                 <FiPackage className="stat-icon" />
//                                 <div className="stat-info">
//                                     <h3>Total Products</h3>
//                                     <div className="stat-value">{stats.products}</div>
//                                 </div>
//                             </div>
//                             <div className="stat-card">
//                                 <FiUsers className="stat-icon" />
//                                 <div className="stat-info">
//                                     <h3>Total Customers</h3>
//                                     <div className="stat-value">{stats.accounts}</div>
//                                 </div>
//                             </div>
//                             <div className="stat-card">
//                                 <FiFileText className="stat-icon" />
//                                 <div className="stat-info">
//                                     <h3>Total Invoices</h3>
//                                     <div className="stat-value">{stats.invoices}</div>
//                                 </div>
//                             </div>
//                             <div className="stat-card">
//                                 <FiTrendingUp className="stat-icon" />
//                                 <div className="stat-info">
//                                     <h3>Total Sales</h3>
//                                     <div className="stat-value">₨ {stats.totalSales.toLocaleString()}</div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Charts Grid */}
//                         <div className="charts-grid">
//                             {/* Sales Trend Chart */}
//                             <div className="chart-card large">
//                                 <div className="chart-header">
//                                     <h3>
//                                         <FiTrendingUp />
//                                         Sales Trend (Last 6 Months)
//                                     </h3>
//                                     <button
//                                         className="refresh-btn"
//                                         onClick={loadChartData}
//                                         title="Refresh Data"
//                                     >
//                                         🔄
//                                     </button>
//                                 </div>
//                                 <div className="chart-container">
//                                     {loading ? (
//                                         <div className="chart-loading">Loading chart data...</div>
//                                     ) : (
//                                         <Line data={salesTrendConfig} options={chartOptions} />
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Daily Sales Chart */}
//                             <div className="chart-card">
//                                 <div className="chart-header">
//                                     <h3>Daily Sales (Last 7 Days)</h3>
//                                 </div>
//                                 <div className="chart-container">
//                                     {loading ? (
//                                         <div className="chart-loading">Loading chart data...</div>
//                                     ) : (
//                                         <Bar data={dailySalesConfig} options={chartOptions} />
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Top Products Chart */}
//                             <div className="chart-card">
//                                 <div className="chart-header">
//                                     <h3>Top 5 Products by Sales</h3>
//                                 </div>
//                                 <div className="chart-container">
//                                     {loading ? (
//                                         <div className="chart-loading">Loading chart data...</div>
//                                     ) : (
//                                         <Bar data={topProductsConfig} options={chartOptions} />
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Recent Invoices Table */}
//                         <div className="recent-section">
//                             <div className="section-header">
//                                 <h3>Recent Invoices</h3>
//                                 <Link to="/invoices" className="view-all-btn">View All</Link>
//                             </div>
//                             <div className="recent-table-container">
//                                 <table className="recent-table">
//                                     <thead>
//                                         <tr>
//                                             <th>Invoice #</th>
//                                             <th>Date</th>
//                                             <th>Customer(s)</th>
//                                             <th>Amount</th>
//                                             <th>Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {recentInvoices.length === 0 ? (
//                                             <tr>
//                                                 <td colSpan="5" className="no-data">No invoices found</td>
//                                             </tr>
//                                         ) : (
//                                             recentInvoices.map(invoice => (
//                                                 <tr key={invoice.invoice_id}>
//                                                     <td>{invoice.voucher_id}</td>
//                                                     <td>{formatDateForDisplay(invoice.invoice_date)}</td>
//                                                     <td>
//                                                         <div><strong>{invoice.customer_names}</strong></div>
//                                                         {invoice.customer_count > 1 && (
//                                                             <div style={{ fontSize: '11px', color: '#666' }}>
//                                                                 ({invoice.customer_count} customers)
//                                                             </div>
//                                                         )}
//                                                     </td>
//                                                     <td>₨ {invoice.net_amount?.toLocaleString()}</td>
//                                                     <td><span className="status-badge paid">Completed</span></td>
//                                                 </tr>
//                                             ))
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <div className="content-area">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Dashboard;
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationContext } from '../App';
import {
    FiHome, FiPackage, FiUsers, FiFileText, FiBarChart2,
    FiDatabase, FiLogOut, FiUser, FiMenu, FiChevronLeft,
    FiChevronRight, FiArrowLeft, FiTrendingUp, FiPieChart
} from 'react-icons/fi';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

function Dashboard({ user, onLogout, children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { goBack, currentPath } = useContext(NavigationContext);
    const [stats, setStats] = useState({
        products: 0,
        accounts: 0,
        invoices: 0,
        totalSales: 0
    });
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [monthlyTrend, setMonthlyTrend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recentInvoices, setRecentInvoices] = useState([]);

    useEffect(() => {
        loadStats();
        loadChartData();
        loadRecentInvoices();

        // Listen for custom back navigation event
        const handleBackNavigation = () => {
            goBack();
        };

        window.addEventListener('navigateBack', handleBackNavigation);
        return () => window.removeEventListener('navigateBack', handleBackNavigation);
    }, []);

    // Auto-collapse sidebar when navigating to Sale Invoice page
    useEffect(() => {
        // Check if current path is /invoices (Sale Invoice page)
        if (location.pathname === '/invoices') {
            setSidebarCollapsed(true);
        }
    }, [location.pathname]);

    const loadStats = async () => {
        try {
            if (window.electron && window.electron.database) {
                const products = await window.electron.database.getProducts();
                const accounts = await window.electron.database.getAccounts();
                const invoices = await window.electron.database.getInvoices();

                // Calculate total sales from invoices
                const totalSales = invoices.reduce((sum, inv) => sum + (inv.net_amount || 0), 0);

                setStats({
                    products: products ? products.length : 0,
                    accounts: accounts ? accounts.length : 0,
                    invoices: invoices ? invoices.length : 0,
                    totalSales: totalSales
                });
            }
        } catch (error) {
            console.error('Failed to load stats', error);
        }
    };

    const loadRecentInvoices = async () => {
        try {
            if (window.electron && window.electron.database) {
                const allInvoices = await window.electron.database.getInvoices();
                const recent = allInvoices.slice(0, 5);
                
                // Load details for each invoice to get customer information
                const invoicesWithCustomers = await Promise.all(recent.map(async (invoice) => {
                    const details = await window.electron.database.getInvoiceDetails(invoice.invoice_id);
                    // Get unique customers from details
                    const uniqueCustomers = [...new Set(details.map(d => d.customer_name).filter(Boolean))];
                    const customerNames = uniqueCustomers.join(', ');
                    return {
                        ...invoice,
                        customer_names: customerNames || 'Walk-in Customer',
                        customer_count: uniqueCustomers.length
                    };
                }));
                
                setRecentInvoices(invoicesWithCustomers);
            }
        } catch (error) {
            console.error('Failed to load recent invoices', error);
        }
    };

    const loadChartData = async () => {
        setLoading(true);
        try {
            if (window.electron && window.electron.database) {
                // Get last 6 months of data
                const endDate = new Date();
                const startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 5);
                startDate.setDate(1);

                const startDateStr = startDate.toISOString().split('T')[0];
                const endDateStr = endDate.toISOString().split('T')[0];

                // Get sales report
                const sales = await window.electron.database.getSalesReport(startDateStr, endDateStr);

                // Process monthly sales data
                const monthlySales = processMonthlySales(sales, startDate, endDate);
                setMonthlyTrend(monthlySales);

                // Get top products
                const itemSummary = await window.electron.database.getItemWiseSummary(startDateStr, endDateStr);
                const top5Products = itemSummary.slice(0, 5);
                setTopProducts(top5Products);

                // Get daily sales for last 7 days
                const dailySales = processDailySales(sales);
                setSalesData(dailySales);
            }
        } catch (error) {
            console.error('Failed to load chart data', error);
        } finally {
            setLoading(false);
        }
    };

    const processMonthlySales = (sales, startDate, endDate) => {
        const months = {};
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const monthKey = currentDate.toLocaleString('default', { month: 'short' });
            months[monthKey] = 0;
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        sales.forEach(sale => {
            const saleDate = new Date(sale.invoice_date);
            const monthKey = saleDate.toLocaleString('default', { month: 'short' });
            if (months[monthKey] !== undefined) {
                months[monthKey] += sale.net_amount || 0;
            }
        });

        return {
            labels: Object.keys(months),
            values: Object.values(months)
        };
    };

    const processDailySales = (sales) => {
        const last7Days = {};
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            const dayName = date.toLocaleString('default', { weekday: 'short' });
            last7Days[dayName] = 0;
        }

        sales.forEach(sale => {
            const saleDate = new Date(sale.invoice_date);
            const dayName = saleDate.toLocaleString('default', { weekday: 'short' });
            if (last7Days[dayName] !== undefined) {
                last7Days[dayName] += sale.net_amount || 0;
            }
        });

        return {
            labels: Object.keys(last7Days),
            values: Object.values(last7Days)
        };
    };

    // Chart configurations
    const salesTrendConfig = {
        labels: monthlyTrend.labels || [],
        datasets: [
            {
                label: 'Monthly Sales (₨)',
                data: monthlyTrend.values || [],
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointHoverRadius: 8,
                pointRadius: 4
            }
        ]
    };

    const dailySalesConfig = {
        labels: salesData.labels || [],
        datasets: [
            {
                label: 'Daily Sales (₨)',
                data: salesData.values || [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)'
            }
        ]
    };

    const topProductsConfig = {
        labels: topProducts.map(p => p.item_name_urdu || p.item_name),
        datasets: [
            {
                label: 'Sales Amount (₨)',
                data: topProducts.map(p => p.total_amount || 0),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderWidth: 1,
                borderColor: '#fff'
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== undefined) {
                            label += '₨ ' + context.parsed.y.toLocaleString();
                        } else if (context.parsed !== undefined) {
                            label += '₨ ' + context.parsed.toLocaleString();
                        }
                        return label;
                    }
                }
            }
        }
    };

    const menuItems = [
        { path: '/', icon: FiHome, label: 'Dashboard' },
        { path: '/products', icon: FiPackage, label: 'Products' },
        { path: '/accounts', icon: FiUsers, label: 'Customers' },
        { path: '/invoices', icon: FiFileText, label: 'Sale Invoice' },
        { path: '/reports', icon: FiBarChart2, label: 'Report' },
        { path: '/backup', icon: FiDatabase, label: 'Backup/Restore' },
        { path: '/user-management', icon: FiUsers, label: 'User Management' }
    ];

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const handleMenuItemClick = (path) => {
        // Only auto-collapse for Sale Invoice page
        if (path === '/invoices') {
            setSidebarCollapsed(true);
        }
        // Navigate to the path
        navigate(path);
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString();
    };

    return (
        <div className="dashboard">
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    {!sidebarCollapsed && <h2>IMS</h2>}
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
                    </button>
                </div>
                <nav>
                    <ul>
                        {menuItems.map(item => (
                            <li key={item.path}>
                                <button
                                    onClick={() => handleMenuItemClick(item.path)}
                                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                    title={sidebarCollapsed ? item.label : ''}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 20px',
                                        fontSize: '16px',
                                        color: '#fff',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    <item.icon />
                                    {!sidebarCollapsed && <span>{item.label}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                {!sidebarCollapsed && (
                    <div className="sidebar-footer">
                        <div className="user-info-sidebar">
                            <FiUser />
                            <span>{user?.full_name || user?.username || 'User'}</span>
                        </div>
                        <button className="logout-btn-sidebar" onClick={onLogout}>
                            <FiLogOut /> Logout
                        </button>
                    </div>
                )}
                {sidebarCollapsed && (
                    <div className="sidebar-footer-collapsed">
                        <button className="logout-icon-btn" onClick={onLogout} title="Logout">
                            <FiLogOut />
                        </button>
                    </div>
                )}
            </div>

            <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <div className="main-header">
                    <div className="header-left">
                        <button className="back-btn" onClick={goBack} title="Go Back (Backspace)">
                            <FiArrowLeft /> Back
                        </button>
                        <span className="back-hint">(Press Backspace)</span>
                    </div>
                    <div className="user-info">
                        <FiUser />
                        <span>{user?.full_name || user?.username || 'User'}</span>
                        <span className="user-role">({user?.role || 'Admin'})</span>
                        <button className="logout-btn" onClick={onLogout}>
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </div>

                {location.pathname === '/' && (
                    <div className="dashboard-content">
                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <FiPackage className="stat-icon" />
                                <div className="stat-info">
                                    <h3>Total Products</h3>
                                    <div className="stat-value">{stats.products}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <FiUsers className="stat-icon" />
                                <div className="stat-info">
                                    <h3>Total Customers</h3>
                                    <div className="stat-value">{stats.accounts}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <FiFileText className="stat-icon" />
                                <div className="stat-info">
                                    <h3>Total Invoices</h3>
                                    <div className="stat-value">{stats.invoices}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <FiTrendingUp className="stat-icon" />
                                <div className="stat-info">
                                    <h3>Total Sales</h3>
                                    <div className="stat-value">₨ {stats.totalSales.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="charts-grid">
                            {/* Sales Trend Chart */}
                            <div className="chart-card large">
                                <div className="chart-header">
                                    <h3>
                                        <FiTrendingUp />
                                        Sales Trend (Last 6 Months)
                                    </h3>
                                    <button
                                        className="refresh-btn"
                                        onClick={loadChartData}
                                        title="Refresh Data"
                                    >
                                        🔄
                                    </button>
                                </div>
                                <div className="chart-container">
                                    {loading ? (
                                        <div className="chart-loading">Loading chart data...</div>
                                    ) : (
                                        <Line data={salesTrendConfig} options={chartOptions} />
                                    )}
                                </div>
                            </div>

                            {/* Daily Sales Chart */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>Daily Sales (Last 7 Days)</h3>
                                </div>
                                <div className="chart-container">
                                    {loading ? (
                                        <div className="chart-loading">Loading chart data...</div>
                                    ) : (
                                        <Bar data={dailySalesConfig} options={chartOptions} />
                                    )}
                                </div>
                            </div>

                            {/* Top Products Chart */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>Top 5 Products by Sales</h3>
                                </div>
                                <div className="chart-container">
                                    {loading ? (
                                        <div className="chart-loading">Loading chart data...</div>
                                    ) : (
                                        <Bar data={topProductsConfig} options={chartOptions} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Invoices Table */}
                        <div className="recent-section">
                            <div className="section-header">
                                <h3>Recent Invoices</h3>
                                <Link to="/invoices" className="view-all-btn">View All</Link>
                            </div>
                            <div className="recent-table-container">
                                <table className="recent-table">
                                    <thead>
                                        <tr>
                                            <th>Invoice #</th>
                                            <th>Date</th>
                                            <th>Customer(s)</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentInvoices.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="no-data">No invoices found</td>
                                            </tr>
                                        ) : (
                                            recentInvoices.map(invoice => (
                                                <tr key={invoice.invoice_id}>
                                                    <td>{invoice.voucher_id}</td>
                                                    <td>{formatDateForDisplay(invoice.invoice_date)}</td>
                                                    <td>
                                                        <div><strong>{invoice.customer_names}</strong></div>
                                                        {invoice.customer_count > 1 && (
                                                            <div style={{ fontSize: '11px', color: '#666' }}>
                                                                ({invoice.customer_count} customers)
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>₨ {invoice.net_amount?.toLocaleString()}</td>
                                                    <td><span className="status-badge paid">Completed</span></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                <div className="content-area">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;