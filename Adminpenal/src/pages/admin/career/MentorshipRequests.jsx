import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Briefcase, GraduationCap, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function MentorshipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
    axios.get('/api/career/admin/mentorship-requests')
      .then(res => {
        setRequests(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/career/admin/mentorship-requests/${id}`, { status });
      fetchRequests(); // reload list
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Scheduled': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Mentorship Requests</h2>
          <p className="text-sm text-slate-500 mt-1">Manage all student requests to alumni mentors</p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No requests yet</h3>
            <p className="text-sm text-slate-500">Students haven't submitted any mentorship requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 px-4 font-semibold text-slate-600">Student Details</th>
                  <th className="py-3 px-4 font-semibold text-slate-600">Mentor & Career</th>
                  <th className="py-3 px-4 font-semibold text-slate-600">Topic & Message</th>
                  <th className="py-3 px-4 font-semibold text-slate-600">Status</th>
                  <th className="py-3 px-4 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map(r => (
                  <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="py-4 px-4 align-top">
                      <div className="font-semibold text-slate-900">{r.studentName}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Mail className="w-3.5 h-3.5" /> {r.studentEmail}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="font-semibold text-indigo-700 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" /> {r.mentorName}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Briefcase className="w-3.5 h-3.5" /> {r.careerId?.name || 'Unknown Career'}
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top max-w-xs">
                      <div className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700 mb-2">
                        {r.topic}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        "{r.message}"
                      </p>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border ${getStatusColor(r.status)}`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-top text-right">
                      {r.status === 'Pending' && (
                        <div className="flex flex-col gap-2 justify-end items-end">
                          <button 
                            onClick={() => updateStatus(r._id, 'Accepted')}
                            className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded hover:bg-indigo-100 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button 
                            onClick={() => updateStatus(r._id, 'Cancelled')}
                            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Decline
                          </button>
                        </div>
                      )}
                      
                      {r.status === 'Accepted' && (
                        <button 
                          onClick={() => updateStatus(r._id, 'Completed')}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Completed
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
