import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { FiTrendingUp, FiPieChart, FiDollarSign } from 'react-icons/fi';

const COLORS = ['#818cf8', '#c084fc', '#f472b6', '#fb7185', '#38bdf8', '#4ade80', '#fbbf24'];

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/expenses`;

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // Fetch a large number or add a specific "all" flag if needed
        // For now, let's fetch with a high limit to get dashboard data
        const response = await axios.get(`${API_BASE_URL}?limit=1000`);
        setExpenses(response.data.expenses);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Process data for Area Chart (Daily Spending)
  const dailyData = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const areaData = Object.entries(dailyData)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Process data for Pie Chart (Category Breakdown)
  const categoryData = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const avgExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;
  const topCategory = pieData.length > 0 ? pieData.sort((a, b) => b.value - a.value)[0].name : 'N/A';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Analyzing Financial Patterns...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card !mb-0 p-6 flex items-center gap-6 group hover:border-indigo-500/30 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <FiDollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">Total Expenses</p>
            <p className="text-2xl font-black text-white">₹{totalSpent.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card !mb-0 p-6 flex items-center gap-6 group hover:border-purple-500/30 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <FiTrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">Avg. Per Transaction</p>
            <p className="text-2xl font-black text-white">₹{avgExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        <div className="glass-card !mb-0 p-6 flex items-center gap-6 group hover:border-pink-500/30 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
            <FiPieChart size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">Top Category</p>
            <p className="text-2xl font-black text-white">{topCategory}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Trends */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden">
          <h3 className="text-lg font-bold mb-8 text-indigo-300">Spending Trends</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff14', borderRadius: '12px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#818cf8" 
                  fillOpacity={1} 
                  fill="url(#colorAmt)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
          <h3 className="text-lg font-bold mb-8 text-purple-300">Category Breakdown</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff14', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
