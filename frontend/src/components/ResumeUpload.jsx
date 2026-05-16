import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', file);

      const response = await API.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.data.resume);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.includes('msword') || droppedFile.type.includes('officedocument'))) {
      setFile(droppedFile);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="text-left">
        <h2 className="text-2xl md:text-3xl font-black text-white">Upload Resume</h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1 md:mt-2">PDF, DOCX supported. Max 5MB.</p>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl md:rounded-3xl p-8 md:p-12 transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
          isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          hidden 
          onChange={(e) => setFile(e.target.files[0])}
          accept=".pdf,.doc,.docx"
        />
        
        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-500">
          {file ? '📄' : '☁️'}
        </div>
        
        <div className="text-center">
          <p className="text-base md:text-lg font-bold text-slate-200">
            {file ? file.name : 'Click to upload or drag'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Master profile for automation'}
          </p>
        </div>

        {file && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 bg-primary/90 flex flex-col items-center justify-center rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md px-4 text-center"
          >
            <p className="text-white font-black text-lg md:text-xl mb-2 md:mb-4">Replace File?</p>
            <span className="text-white/80 text-[10px] md:text-sm font-medium">Choose a different resume</span>
          </motion.div>
        )}
      </motion.div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleUpload();
        }}
        disabled={!file || loading}
        className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg transition-all duration-300 shadow-xl ${
          !file 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-primary text-white hover:bg-primary/90 hover:shadow-primary/20 active:scale-[0.98]'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-sm md:text-base">Analyzing...</span>
          </div>
        ) : (
          'Sync Profile to Cloud'
        )}
      </button>
    </div>
  );
};

export default ResumeUpload;