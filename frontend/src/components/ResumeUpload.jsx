import { useState } from 'react';

import API from '../services/api';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const handleUpload =
    async () => {
      if (!file) {
        alert(
          'Please select resume'
        );

        return;
      }

      try {
        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          'resume',
          file
        );

        const response =
          await API.post(
            '/resume/upload',
            formData,
            {
              headers: {
                'Content-Type':
                  'multipart/form-data',
              },
            }
          );

        console.log(
          response.data
        );

        if (onUploadSuccess) {
          onUploadSuccess(response.data.resume);
        }

        setMessage(
          'Resume uploaded successfully'
        );
      } catch (error) {
        console.log(error);

        setMessage(
          'Upload failed'
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div>
      <h2 className='text-4xl font-bold text-center text-violet-400 mb-8'>
        Upload Resume
      </h2>

      <input
        type='file'
        accept='.pdf,.doc,.docx'
        className='w-full bg-slate-950 border border-slate-700 p-4 rounded-xl mb-6'
        onChange={(e) =>
          setFile(
            e.target.files[0]
          )
        }
      />

      <button
        onClick={handleUpload}
        className='block mx-auto bg-violet-500 hover:bg-violet-600 transition px-8 py-4 rounded-xl font-bold text-lg'
      >
        {loading
          ? 'Uploading...'
          : 'Upload Resume'}
      </button>

      <p className='text-center mt-5 text-lg text-slate-300'>
        {message}
      </p>
    </div>
  );
};

export default ResumeUpload;