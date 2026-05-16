import React from 'react';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-bg-deep text-white overflow-x-hidden relative">
      <div className="mesh-bg" />
      
      {/* Sidebar (Responsive) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto lg:h-screen pt-16 lg:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-4 md:p-8 lg:p-12"
          >
            <Dashboard />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
