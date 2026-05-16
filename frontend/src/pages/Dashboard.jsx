import {
  useEffect,
  useState,
} from 'react';

import ResumeUpload from '../components/ResumeUpload';

import {
  getApplications,
} from '../services/api';

const Dashboard = () => {
  const [applications, setApplications] =
    useState([]);
  const [parsedResume, setParsedResume] =
    useState(null);

  const fetchApplications =
    async () => {
      try {
        const response =
          await getApplications();

        setApplications(
          response.data.applications
        );
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

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent">
              Workday AI
            </h1>
            <p className="text-slate-400 text-lg mt-2">Next-gen multi-step automation dashboard</p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="bg-slate-900/80 border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-slate-300 tracking-wide uppercase">Extension Linked</span>
            </div>
          </div>
        </header>

        {/* STEP 1: UPLOAD & GUIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-3xl p-10 shadow-2xl">
            <ResumeUpload onUploadSuccess={handleUploadSuccess} />
            
            {parsedResume && (
              <div className="mt-10 pt-10 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-2xl font-bold text-violet-400 mb-6 flex items-center gap-2">
                  <span className="text-3xl">✨</span> AI Parsed Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Name</p>
                    <p className="font-semibold text-lg">{parsedResume.parsedData.name}</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Email</p>
                    <p className="font-semibold text-lg">{parsedResume.parsedData.email}</p>
                  </div>
                </div>
                <div className="mt-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Extracted Skills</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(Array.isArray(parsedResume.parsedData.skills) 
                      ? parsedResume.parsedData.skills 
                      : parsedResume.parsedData.skills?.split(',') || []
                    ).slice(0, 12).map((skill, i) => (
                      <span key={i} className="bg-violet-500/10 text-violet-300 border border-violet-500/20 px-3 py-1 rounded-full text-xs font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-900/20 to-violet-900/20 border border-violet-500/20 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-violet-400">🚀</span> How it Works
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-bold text-slate-200">Upload Resume</p>
                  <p className="text-sm text-slate-400 mt-1">Our AI extracts your details to create a master automation profile.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-bold text-slate-200">Go to Workday</p>
                  <p className="text-sm text-slate-400 mt-1">Open any Workday job application page in your browser.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="font-bold text-slate-200">Click Autofill</p>
                  <p className="text-sm text-slate-400 mt-1">Use the Workday AI Extension to automatically fill all steps.</p>
                </div>
              </li>
            </ul>
            <div className="mt-10 p-4 bg-violet-500/10 border border-violet-500/30 rounded-2xl">
              <p className="text-xs text-violet-300 font-medium leading-relaxed">
                Tip: The extension will automatically sync your application progress back to this dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* STEP 2: TRACKER */}
        <div className="max-w-6xl mx-auto bg-[#0f172a] border border-slate-800 rounded-3xl p-10 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold text-violet-400">
              Application Tracker
            </h2>
            <div className="text-slate-400 font-medium">
              Total: {applications.length}
            </div>
          </div>

          <div className="grid gap-6">
            {applications.length > 0 ? (
              applications.map((job) => (
                <div
                  key={job._id}
                  className="bg-[#020617] border border-slate-800 rounded-2xl p-6 hover:border-violet-500/50 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-3xl font-bold text-slate-100 group-hover:text-violet-400 transition-colors">
                          {job.company}
                        </h3>
                      </div>
                      <p className="text-lg text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                        {job.role}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className="bg-violet-500/20 text-violet-300 px-4 py-1.5 rounded-full text-sm font-bold border border-violet-500/30">
                        {job.status}
                      </span>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                        Applied {new Date(job.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                <p className="text-slate-500 text-lg">No applications synced yet. Start an automation via the extension to see results here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;