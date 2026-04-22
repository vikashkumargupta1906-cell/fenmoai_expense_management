import { NavLink, useNavigate } from 'react-router-dom';
import { FiList, FiPieChart, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

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

        <div className="w-[1px] h-4 bg-white/10"></div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <FiUser size={12} className="text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-300 truncate max-w-[100px]">{user.email}</span>
          </div>

          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
          >
            <FiLogOut size={16} />
            Exit
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
