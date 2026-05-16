import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeUpload from '../components/ResumeUpload';
import { getApplications } from '../services/api';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [parsedResume, setParsedResume] = useState(null);

  const fetchApplications = async () => {
    try {
      const response = await getApplications();
      setApplications(response.data.applications);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadSuccess = (resume) => {
    setParsedResume(resume);
    fetchApplications();
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 md:space-y-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent tracking-tight">
            Automation Center
          </h1>
          <p className="text-slate-400 text-sm md:text-lg mt-1 md:mt-2 font-medium">Control and monitor your AI application journey</p>
        </div>
        <div className="hidden sm:flex gap-4">
          <div className="glass px-4 md:px-6 py-2 md:py-3 rounded-2xl flex items-center gap-3">
            <span className="text-[10px] md:text-sm font-bold text-slate-300 uppercase tracking-widest">v1.2.0 Stable</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Resume & Profile Section */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <ResumeUpload onUploadSuccess={handleUploadSuccess} />
            
            <AnimatePresence>
              {parsedResume && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 md:mt-10 pt-8 md:pt-10 border-t border-white/5"
                >
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl">✨</div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">AI Profile</h3>
                      <p className="text-slate-500 text-xs md:text-sm">Verified and ready for automation</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-widest">Full Name</p>
                      <p className="font-bold text-base md:text-lg text-slate-200 truncate">{parsedResume.parsedData.name}</p>
                    </div>
                    <div className="bg-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-widest">Contact Email</p>
                      <p className="font-bold text-base md:text-lg text-slate-200 truncate">{parsedResume.parsedData.email}</p>
                    </div>
                  </div>

                  <div className="mt-4 bg-white/5 p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">Top Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(parsedResume.parsedData.skills) 
                        ? parsedResume.parsedData.skills 
                        : parsedResume.parsedData.skills?.split(',') || []
                      ).slice(0, 8).map((skill, i) => (
                        <span key={i} className="bg-primary/10 text-primary border border-primary/20 px-3 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Application Tracker Section */}
          <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white">Application Tracker</h2>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Live sync with Workday Extension</p>
              </div>
              <div className="bg-white/5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-white/10">
                <span className="text-primary font-bold text-sm md:text-base">{applications.length}</span> <span className="text-slate-500 text-xs">Total</span>
              </div>
            </div>

            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4"
            >
              {applications.length > 0 ? (
                applications.map((job) => (
                  <motion.div
                    key={job._id}
                    variants={item}
                    className="group relative bg-white/5 border border-white/5 rounded-xl md:rounded-2xl p-5 md:p-6 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex gap-4 md:gap-5 items-center">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">
                          {job.company?.[0] || '💼'}
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-primary transition-colors">
                            {job.company}
                          </h3>
                          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                            {job.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto justify-between sm:justify-center border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                        <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          job.status?.toLowerCase() === 'applied' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {job.status}
                        </span>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                          {new Date(job.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 md:py-20 bg-white/5 rounded-2xl md:rounded-3xl border-2 border-dashed border-white/5">
                  <div className="text-4xl md:text-5xl mb-4 opacity-20">📥</div>
                  <p className="text-slate-500 text-sm md:text-base font-bold">No applications detected yet.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Sidebar / Guide Section */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <h3 className="text-lg md:text-xl font-black mb-6 md:mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-xs md:text-sm">💡</span>
              System Guide
            </h3>
            
            <div className="space-y-6 md:space-y-8">
              {[
                { step: '01', title: 'Upload Profile', desc: 'Sync your resume to the AI backend.' },
                { step: '02', title: 'Active Link', desc: 'Ensure extension shows green status.' },
                { step: '03', title: 'Auto Fill', desc: 'One-click apply on any Workday site.' }
              ].map((guide, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="text-xl md:text-2xl font-black text-white/10 group-hover:text-primary/40 transition-colors duration-500 leading-none">
                    {guide.step}
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold text-slate-200 group-hover:text-primary transition-colors duration-300">{guide.title}</p>
                    <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">{guide.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 md:mt-10 p-4 md:p-6 bg-primary/10 rounded-xl md:rounded-2xl border border-primary/20 relative group cursor-pointer">
              <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                Pro Tip <span className="animate-bounce">⚡</span>
              </p>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                The extension works in the background even if you close this dashboard.
              </p>
            </div>
          </div>

          <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 overflow-hidden relative group">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -mb-24 -mr-24" />
            <h3 className="text-lg md:text-xl font-black mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 md:py-4 glass glass-hover rounded-xl md:rounded-2xl font-bold text-xs md:text-sm text-slate-300 transition-all active:scale-95">
                Download Extension
              </button>
              <button className="w-full py-3 md:py-4 glass glass-hover rounded-xl md:rounded-2xl font-bold text-xs md:text-sm text-slate-300 transition-all active:scale-95">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;