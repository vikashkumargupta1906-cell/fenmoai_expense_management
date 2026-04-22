import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/expenses`;

// Axios Request Interceptor for Auth
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Configure axios-retry
axiosRetry(axios, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const isIdempotentPost = error.config?.method?.toLowerCase() === 'post' && error.config?.url?.includes('/expenses');
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500 || isIdempotentPost;
  }
});

function App() {
  const { logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, totalItems: 0 });
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('date_desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Response Interceptor for invalid tokens
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const categoryParam = filter !== 'All' ? `category=${filter}` : '';
      const sortParam = `sort=${sort}`;
      const pageParam = `page=${page}`;
      const query = [categoryParam, sortParam, pageParam].filter(Boolean).join('&');

      const response = await axios.get(`${API_BASE_URL}${query ? '?' + query : ''}`);
      setExpenses(response.data.expenses);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      const status = err.response?.status;
      const message = err.response?.data?.error || err.message;
      setError(`Failed to load expenses (${status || 'Network Error'}): ${message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filter, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [filter, sort]);

  const handleAddExpense = async (newExpense) => {
    try {
      await axios.post(API_BASE_URL, newExpense);
      await fetchExpenses();
    } catch (err) {
      console.error('Error adding expense:', err);
      throw err;
    }
  };

  return (
    <Router>
      <div className="w-full">
        <Navbar />
        <div className="glass-card mt-28 !mb-20">
          <header className="text-center mb-10">
            <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent italic tracking-tight">
              FENMO AI
            </h1>
            <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">Financial Intelligence Dashboard</p>
          </header>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={
              <ProtectedRoute>
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <ExpenseForm onAddExpense={handleAddExpense} />

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center mb-6">
                      <p className="mb-4 font-medium">{error}</p>
                      <button
                        onClick={fetchExpenses}
                        className="px-6 py-2 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Re-Synchronize Data
                      </button>
                    </div>
                  )}

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-medium animate-pulse">Fetching Records...</p>
                    </div>
                  ) : (
                    <ExpenseList
                      expenses={expenses}
                      filter={filter}
                      setFilter={setFilter}
                      sort={sort}
                      setSort={setSort}
                      pagination={pagination}
                      setPage={setPage}
                    />
                  )}
                </div>
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
