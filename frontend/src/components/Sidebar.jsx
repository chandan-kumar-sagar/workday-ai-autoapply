import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: '📊', label: 'Dashboard', active: true },
    { icon: '📝', label: 'Applications', active: false },
    { icon: '👤', label: 'Profile', active: false },
    { icon: '⚙️', label: 'Settings', active: false },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`flex flex-col h-full ${isMobile ? 'p-6' : 'p-8'}`}>
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
          <img src="/logo.svg" alt="Workday AI Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Workday <span className="text-primary">AI</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 5 }}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
              item.active 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-semibold">{item.label}</span>
            {item.active && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
          </motion.div>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-white/5">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">System Status</p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <span className="text-xs font-bold text-slate-200">Extension Linked</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header / Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-bg-deep/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img src="/logo.svg" alt="W" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-sm tracking-tight uppercase">Workday AI</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10"
        >
          <span className="text-xl">☰</span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-72 bg-bg-sidebar/50 border-r border-white/5 backdrop-blur-2xl hidden lg:flex flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-bg-sidebar z-[70] lg:hidden border-r border-white/10"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-slate-400"
              >
                ✕
              </button>
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
