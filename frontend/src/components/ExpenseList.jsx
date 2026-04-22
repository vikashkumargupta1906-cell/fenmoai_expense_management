import React from 'react';
import { FiFilter, FiArrowDown, FiArrowUp } from 'react-icons/fi';

const ExpenseList = ({ expenses, filter, setFilter, sort, setSort, pagination, setPage }) => {
  const CATEGORIES = [
    'All', 'Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Utilities', 'Other'
  ];

  const total = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all">
      {/* Category Summary */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          {Object.entries(categoryTotals).map(([cat, amt]) => (
            <div key={cat} className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
              <span className="text-[9px] uppercase tracking-tighter text-slate-500 font-bold mb-1">{cat}</span>
              <span className="text-sm font-black text-indigo-300">₹{amt.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <FiFilter className="text-slate-400" />
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Filter Category</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer font-medium hover:text-indigo-400 transition-colors"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {sort === 'date_desc' ? <FiArrowDown className="text-indigo-400" /> : <FiArrowUp className="text-indigo-400" />}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Sort By Date</label>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer font-medium hover:text-indigo-400 transition-colors"
            >
              <option value="date_desc" className="bg-slate-900">Newest First</option>
              <option value="date_asc" className="bg-slate-900">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 italic">No expenses found matching the criteria.</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="group flex justify-between items-center p-4 rounded-xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">{expense.category}</span>
                <span className="text-slate-100 font-medium">{expense.description || 'No description'}</span>
                <span className="text-[11px] text-slate-500 mt-1">{new Date(expense.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="text-lg font-bold text-emerald-400 group-hover:scale-110 transition-transform">
                ₹{parseFloat(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
        <span className="text-slate-400 font-medium">Total Expenses</span>
        <span className="text-2xl font-black text-indigo-400">
          ₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <button 
            disabled={pagination.currentPage === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.1em] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          
          <div className="flex flex-col items-center">
            <p className="text-sm font-black text-indigo-400/80">
              <span className="text-slate-500 text-[10px] uppercase tracking-widest mr-2">Page</span>
              {pagination.currentPage} <span className="text-slate-600 px-1">/</span> {pagination.totalPages}
            </p>
          </div>

          <button 
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.1em] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
