import { useEffect, useState } from 'react';

import API from '../services/api';

const ApplicationList = () => {
  const [applications, setApplications] =
    useState([]);

  const fetchApplications =
    async () => {
      try {
        const response =
          await API.get(
            '/applications'
          );

        setApplications(
          response.data
            .applications
        );
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div>
      <h2 className='text-4xl font-bold text-center text-violet-400 mb-8'>
        Applied Jobs
      </h2>

      <div className='space-y-5'>
        {applications.map(
          (application) => (
            <div
              key={
                application._id
              }
              className='bg-slate-950 border border-slate-700 p-6 rounded-2xl'
            >
              <h3 className='text-3xl font-bold mb-4 text-slate-200'>
                {
                  application.company
                }
              </h3>

              <p className='text-lg text-slate-300 mb-2'>
                Role:{' '}
                {application.role}
              </p>

              <p className='text-lg text-slate-300 mb-2'>
                Status:{' '}
                {
                  application.status
                }
              </p>

              <p className='text-lg text-slate-300'>
                Applied:{' '}
                {new Date(
                  application.appliedDate
                ).toLocaleDateString()}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ApplicationList;