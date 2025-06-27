import React from 'react';
import { IoMdClose } from "react-icons/io";
import { BsPlusCircle } from "react-icons/bs";

const ExpenseForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  isEditing, 
  onClose,
  categories 
}) => {
  return (
    <div className="bg-[#2a2a2a] rounded-lg shadow-md p-6 border border-[#3a3a3a]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <IoMdClose size={24} className='cursor-pointer' />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-1">Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Dinner with friends"
            className="w-full px-4 py-2 bg-[#333333] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#5a5a5a]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-1">Amount*</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 pl-8 bg-[#333333] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#5a5a5a]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#333333] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#5a5a5a]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#333333] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#5a5a5a]"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-1">Notes (optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any additional details..."
            rows="3"
            className="w-full px-4 py-2 bg-[#333333] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#5a5a5a]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#3a3a3a] text-white font-medium rounded-lg hover:bg-[#4a4a4a] transition-all mt-4 border border-[#4a4a4a]"
        >
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export const EmptyFormState = ({ setIsFormOpen }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-[#333333] rounded-full flex items-center justify-center border-2 border-dashed border-[#4a4a4a]">
          <BsPlusCircle size={36} className="text-gray-400 cursor-pointer hover:text-[#4a4a4a]" onClick={() => setIsFormOpen(true)}/>
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2 ">Add New Expense</h3>
      <p className="text-gray-400 mb-6">Track your spending by adding expenses with details like amount, category, and date.</p>
      <button
        onClick={() => setIsFormOpen(true)}
        className="px-6 py-3 bg-[#3a3a3a] text-white rounded-lg font-medium flex items-center gap-2 hover:bg-[#4a4a4a] transition-all border border-[#4a4a4a]"
      >
        <BsPlusCircle size={18} />
        <span>Create Expense</span>
      </button>
    </div>
  );
};

export default ExpenseForm;