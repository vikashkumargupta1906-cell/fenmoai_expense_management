import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FiAlertCircle } from 'react-icons/fi';

const CATEGORIES = [
  'Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Utilities', 'Other'
];

const ExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(formData.amount);
    const inputDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); 
    
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(today.getFullYear() - 100);

    if (!formData.amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount greater than 0 (minimum ₹0.01).');
      return;
    }

    if (!formData.date) {
      setError('Please select a valid date for the expense.');
      return;
    }

    if (inputDate > today) {
      setError('Expense date cannot be in the future.');
      return;
    }

    if (inputDate < hundredYearsAgo) {
      setError('Expense date cannot be more than 100 years in the past.');
      return;
    }

    const descriptionWords = formData.description.trim().split(/\s+/).filter(Boolean).length;
    if (descriptionWords > 200) {
      setError('Description cannot exceed 200 words.');
      return;
    }

    setLoading(true);
    
    const newExpense = {
      ...formData,
      id: uuidv4(),
      amount: amountNum
    };

    try {
      await onAddExpense(newExpense);
      setFormData({
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setError('');
    } catch (err) {
      console.error('Failed to add expense:', err);
      setError('Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 transition-all hover:border-white/20">
      <h2 className="text-xl font-bold mb-6 text-indigo-400">Add New Expense</h2>
      
      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-100 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-left-4">
          <FiAlertCircle className="text-red-400 shrink-0" size={20} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="glass-input"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Category</label>
            <select
              className="glass-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Date</label>
            <input
              type="date"
              className="glass-input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-400">Description</label>
          <textarea
            placeholder="What was this for?"
            rows="2"
            className="glass-input"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full shadow-lg shadow-indigo-500/20">
          {loading ? 'Adding Expense...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
