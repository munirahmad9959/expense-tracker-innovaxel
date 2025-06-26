import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IoMdArrowDropdown, IoMdRefresh } from "react-icons/io";
import { BsCart2, BsPencil, BsTrash, BsBarChart, BsPlusCircle, BsFilter } from "react-icons/bs";
import { FiCalendar, FiDollarSign, FiTag } from "react-icons/fi";
import ExpenseForm, { EmptyFormState } from './ExpenseForm';
import ChartSection from './ChartSection';

const HeroSection = () => {
    const [items, setItems] = useState(() => {
        const storedItems = localStorage.getItem('expenseItems');
        return storedItems ? JSON.parse(storedItems) : [];
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });
    const filterPanelRef = useRef(null);
    const filterBtnRef = useRef(null);

    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [chartData, setChartData] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Other'];

    // Enhanced click-outside handler for mobile and desktop
    useEffect(() => {
        if (!filterPanelOpen) return;

        const handleClickOutside = (e) => {
            if (
                filterPanelRef.current &&
                !filterPanelRef.current.contains(e.target) &&
                filterBtnRef.current &&
                !filterBtnRef.current.contains(e.target)
            ) {
                setFilterPanelOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside); // 🔁 updated
        return () => document.removeEventListener('click', handleClickOutside); // 🔁 updated
    }, [filterPanelOpen]);


    const calculateChartData = useCallback(() => {
        const categoryMap = {};
        items.forEach(item => {
            if (!categoryMap[item.category]) categoryMap[item.category] = 0;
            categoryMap[item.category] += parseFloat(item.amount);
        });

        setChartData(Object.keys(categoryMap).map(category => ({
            name: category,
            value: parseFloat(categoryMap[category].toFixed(2))
        })));

        setTotalExpenses(items.reduce((sum, item) => sum + parseFloat(item.amount), 0));
    }, [items]);

    useEffect(() => {
        localStorage.setItem('expenseItems', JSON.stringify(items));
        calculateChartData();
    }, [items, calculateChartData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.amount) return;

        const amount = parseFloat(formData.amount);
        if (isNaN(amount)) return;

        const updatedItem = {
            ...formData,
            amount,
            id: editItem ? editItem.id : Date.now().toString()
        };

        setItems(prev => (
            editItem
                ? prev.map(item => item.id === editItem.id ? updatedItem : item)
                : [updatedItem, ...prev]
        ).sort((a, b) => new Date(b.date) - new Date(a.date)));

        setFormData({
            title: '',
            amount: '',
            category: 'Food',
            date: new Date().toISOString().split('T')[0],
            notes: ''
        });
        setIsFormOpen(false);
        setEditItem(null);
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setFormData({
            title: item.title,
            amount: item.amount,
            category: item.category,
            date: item.date,
            notes: item.notes || ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleRefresh = () => setRefreshKey(prev => prev + 1);
    const handleClearFilters = () => {
        setCategoryFilter('All');
        setDateFilter('');
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        const matchesDate = !dateFilter || item.date === dateFilter;
        return matchesCategory && matchesDate;
    });

    return (
        <div className='bg-[#1e1e1e] min-h-[calc(100vh-90px)] w-full p-4 md:p-8'>
            <div className="flex flex-col lg:flex-row gap-6 justify-center max-w-7xl mx-auto font-bricolage">
                {/* Expense List Section */}
                <div className="w-full lg:w-[55%] bg-[#2a2a2a] rounded-lg shadow-md p-6 flex flex-col border border-[#3a3a3a]">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-[#ffe600]">Expense Tracker</h2>

                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Filter Button */}
                            <div className="relative">
                                <button
                                    ref={filterBtnRef}
                                    className="filter-btn px-4 py-2 flex items-center gap-2 bg-[#3a3a3a] text-white rounded-lg border border-[#4a4a4a] hover:bg-[#4a4a4a] transition"
                                    onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                                >
                                    <BsFilter size={16} />
                                    Filter
                                </button>

                                {filterPanelOpen && (
                                    <div
                                        className="filter-panel fixed inset-0 z-40 flex items-start justify-end pt-[230px] md:absolute md:inset-auto md:right-0 md:mt-2 md:pt-0"
                                        onClick={() => setFilterPanelOpen(false)} // Click outside to close
                                    >
                                        <div
                                            ref={filterPanelRef}
                                            className="bg-[#2e2e2e] rounded-lg shadow-lg border border-[#444] p-4 space-y-4 w-full max-w-xs mx-4 md:mx-0 md:w-64"
                                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the panel
                                        >
                                            <div>
                                                <label className="text-white text-sm block mb-1">Category</label>
                                                <select
                                                    value={categoryFilter}
                                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                                    className="w-full px-4 py-2 bg-[#3a3a3a] text-white rounded-lg border border-[#ffe600] focus:outline-none"
                                                >
                                                    <option value="All">All Categories</option>
                                                    {categories.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-white text-sm block mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    value={dateFilter}
                                                    onChange={(e) => setDateFilter(e.target.value)}
                                                    className="w-full px-4 py-2 bg-[#3a3a3a] text-white rounded-lg border border-[#ffe600] focus:outline-none"
                                                />
                                            </div>

                                            <button
                                                onClick={handleClearFilters}
                                                className="text-sm text-yellow-400 underline"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    </div>
                                )}


                            </div>

                            <button
                                onClick={() => setShowSummary(!showSummary)}
                                className="px-4 py-2 bg-[#3a3a3a] text-white rounded-lg font-medium flex items-center gap-2 hover:bg-[#4a4a4a] transition-all border border-[#4a4a4a]"
                            >
                                <BsBarChart size={18} />
                                <span>{showSummary ? 'Hide Summary' : 'Show Summary'}</span>
                            </button>

                            {showSummary && (
                                <button
                                    onClick={handleRefresh}
                                    className="px-3 py-2 bg-[#3a3a3a] text-white rounded-lg font-medium flex items-center gap-2 hover:bg-[#4a4a4a] transition-all border border-[#4a4a4a]"
                                    title="Refresh chart"
                                >
                                    <IoMdRefresh size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {showSummary ? (
                        <ChartSection chartData={chartData} totalExpenses={totalExpenses} key={refreshKey} />
                    ) : (
                        <div className="overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
                            {filteredItems.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredItems.map(item => (
                                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#333333] rounded-lg border border-[#3a3a3a] hover:border-[#4a4a4a] transition-all">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <div className="w-3 h-3 rounded-full bg-[#5a5a5a] flex-shrink-0"></div>
                                                    <h3 className="font-medium text-white truncate">{item.title}</h3>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 ml-6">
                                                    <span className="flex items-center gap-1"><FiDollarSign size={14} />{item.amount.toLocaleString()}</span>
                                                    <span className="flex items-center gap-1"><FiTag size={14} />{item.category}</span>
                                                    <span className="flex items-center gap-1"><FiCalendar size={14} />{new Date(item.date).toLocaleDateString()}</span>
                                                </div>
                                                {item.notes && (
                                                    <p className="text-sm text-gray-500 mt-2 ml-6 italic">"{item.notes}"</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 mt-3 sm:mt-0 ml-6 sm:ml-0">
                                                <button onClick={() => handleEdit(item)} className="p-2 bg-[#3a3a3a] text-gray-300 rounded-lg hover:bg-[#4a4a4a] transition-colors">
                                                    <BsPencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-[#3a3a3a] text-gray-300 rounded-lg hover:bg-[#4a4a4a] transition-colors">
                                                    <BsTrash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-white text-center py-12'>No expenses found.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Form Section */}
                {(isFormOpen || editItem) && (
                    <div className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 ${isFormOpen ? 'lg:hidden' : ''}`}>
                        <ExpenseForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            isEditing={!!editItem}
                            onClose={() => {
                                setIsFormOpen(false);
                                setEditItem(null);
                            }}
                            categories={categories}
                        />
                    </div>
                )}

                <div className={`bg-[#2a2a2a] rounded-lg shadow-md p-6 border border-[#3a3a3a] ${isFormOpen ? 'sticky top-6 h-fit' : ''}`}>
                    {isFormOpen || editItem ? (
                        <ExpenseForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            isEditing={!!editItem}
                            onClose={() => {
                                setIsFormOpen(false);
                                setEditItem(null);
                            }}
                            categories={categories}
                        />
                    ) : (
                        <EmptyFormState setIsFormOpen={setIsFormOpen} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;