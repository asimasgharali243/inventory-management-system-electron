import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiSearch } from 'react-icons/fi';
import { NavigationContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

function ProductManagement() {
    const navigate = useNavigate();
    const { goBack } = useContext(NavigationContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        item_id: null,
        item_code: '',
        item_name: '',
        item_name_urdu: '',
        price: 0,
    });

    const itemCodeRef = useRef(null);

    useEffect(() => {
        loadProducts();
        setupKeyboardShortcuts();
        return () => cleanupKeyboardShortcuts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, products]);

    const setupKeyboardShortcuts = () => {
        const handleKeyDown = (e) => {
            // Ctrl+N for new product
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                handleNew();
            }
            // Ctrl+S for save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            // Ctrl+D for delete
            if (e.ctrlKey && e.key === 'd' && currentProduct.item_id) {
                e.preventDefault();
                handleDelete(currentProduct.item_id);
            }
            // Escape to cancel edit
            if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    };

    const cleanupKeyboardShortcuts = () => {
        window.removeEventListener('keydown', setupKeyboardShortcuts);
    };

    const loadProducts = async () => {
        try {
            const data = await window.electron.database.getProducts();
            setProducts(data || []);
        } catch (error) {
            console.error('Failed to load products:', error);
            toast.error('Failed to load products');
        }
    };

    const filterProducts = () => {
        if (!searchTerm.trim()) {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.item_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.item_name_urdu && product.item_name_urdu.includes(searchTerm))
            );
            setFilteredProducts(filtered);
        }
    };

    const handleNew = () => {
        setIsEditing(true);
        setCurrentProduct({
            item_id: null,
            item_code: '',
            item_name: '',
            item_name_urdu: '',
            price: 0,
        });
        setTimeout(() => itemCodeRef.current?.focus(), 100);
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setCurrentProduct({ ...product });
        setTimeout(() => itemCodeRef.current?.focus(), 100);
    };

    const handleSave = async () => {
        if (!currentProduct.item_code || !currentProduct.item_name) {
            toast.error('Item Code and Item Name are required');
            return;
        }

        try {
            if (currentProduct.item_id) {
                // Update existing product
                await window.electron.database.updateProduct(currentProduct);
                toast.success('Product updated successfully');
            } else {
                // Create new product
                await window.electron.database.createProduct(currentProduct);
                toast.success('Product created successfully');
            }
            await loadProducts();
            handleCancel();
        } catch (error) {
            console.error('Failed to save product:', error);
            toast.error(error.message || 'Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await window.electron.database.deleteProduct(id);
                toast.success('Product deleted successfully');
                await loadProducts();
                if (currentProduct.item_id === id) {
                    handleCancel();
                }
            } catch (error) {
                console.error('Failed to delete product:', error);
                toast.error('Failed to delete product');
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentProduct({
            item_id: null,
            item_code: '',
            item_name: '',
            item_name_urdu: '',
            price: 0,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Product Management</h1>
                <div className="header-actions">
                    <div className="search-box">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary" onClick={handleNew}>
                        <FiPlus /> New Product (Ctrl+N)
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="form-panel">
                    <h2>{currentProduct.item_id ? 'Edit Product' : 'New Product'}</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Item Code *</label>
                            <input
                                ref={itemCodeRef}
                                type="text"
                                name="item_code"
                                value={currentProduct.item_code}
                                onChange={handleInputChange}
                                placeholder="Enter item code"
                            />
                        </div>
                        <div className="form-group">
                            <label>Item Name *</label>
                            <input
                                type="text"
                                name="item_name"
                                value={currentProduct.item_name}
                                onChange={handleInputChange}
                                placeholder="Enter item name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Item Name (Urdu)</label>
                            <input
                                type="text"
                                name="item_name_urdu"
                                value={currentProduct.item_name_urdu || ''}
                                onChange={handleInputChange}
                                placeholder="Enter item name in Urdu"
                                dir="rtl"
                            />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={currentProduct.price}
                                onChange={handleInputChange}
                                placeholder="Enter price"
                                step="0.01"
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="btn-success" onClick={handleSave}>
                            <FiSave /> Save (Ctrl+S)
                        </button>
                        <button className="btn-danger" onClick={handleCancel}>
                            <FiX /> Cancel (Esc)
                        </button>
                    </div>
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr style={{ background: '#4CAF50', color: 'white' }}>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Sr.</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Item Code</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Item Name</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Item Name (Urdu)</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Price</th>
                            <th style={{ background: '#4CAF50', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product, index) => (
                                <tr key={product.item_id}>
                                    <td>{index + 1}</td>
                                    <td>{product.item_code}</td>
                                    <td>{product.item_name}</td>
                                    <td dir="rtl" style={{ fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Urdu Typesetting', 'Segoe UI', 'Arial', serif" }}>
                                        {product.item_name_urdu || '-'}
                                    </td>
                                    <td>Rs. {product.price?.toLocaleString() || '0'}</td>
                                    <td className="actions">
                                        <button
                                            className="icon-btn"
                                            onClick={() => handleEdit(product)}
                                            title="Edit"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            className="icon-btn danger"
                                            onClick={() => handleDelete(product.item_id)}
                                            title="Delete"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="status-bar">
                <span>Total Products: {products.length}</span>
                <span className="shortcuts-hint">
                    Shortcuts: Ctrl+N New | Ctrl+S Save | Ctrl+D Delete | Esc Cancel
                </span>
            </div>
        </div>
    );
}

export default ProductManagement;