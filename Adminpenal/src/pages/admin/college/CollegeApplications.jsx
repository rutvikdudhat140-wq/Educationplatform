import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CollegeApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const getApplications = async () => {
      const token = localStorage.getItem('adminToken');

      const response = await axios.get(
        `http://localhost:5001/api/applications/college/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(response.data.applications || []);
    };

    getApplications();
  }, [id]);

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate('/admin/college/list')}
        className="rounded-lg border bg-white px-4 py-2 text-sm"
      >
        Back
      </button>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className='border-b bg-slate-50'>
            <tr>
               <th className='px-4 py-3 text-left'>Applicant</th>
               <th className='px-4 py-3 text-left'>contect</th>
               <th className='px-4 py-3 text-left'>email</th>
               <th className='px-4 py-3 text-left'>message</th>
               <th className='px-4 py-3 text-left'>date</th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No applications found
                </td>
              </tr>
            ) : (
              applications.map((application) => (
                <tr key={application._id} className="border-b align-top">
                  <td className="px-4 py-3">
                    {application.name}
                  </td>

                  <td className="px-4 py-3">
                    {application.phone}
                  </td>

                  <td className="px-4 py-3">
                    {application.email}
                  </td>

                  <td className="max-w-[260px] px-4 py-3">
                    {application.message}
                  </td>

                  <td className="px-4 py-3">
                    {application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollegeApplications;
