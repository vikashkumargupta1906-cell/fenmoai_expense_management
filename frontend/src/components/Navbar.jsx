import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiList, FiPieChart } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-8 shadow-2xl">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
              isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <FiList size={16} />
          Records
        </NavLink>
        
        <div className="w-[1px] h-4 bg-white/10"></div>
        
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
              isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <FiPieChart size={16} />
          Analytics
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
