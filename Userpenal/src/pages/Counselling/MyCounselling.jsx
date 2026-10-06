import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  User,
  GraduationCap,
  Building2,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';

const MyCounselling = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          'http://localhost:5001/api/counselling/my',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error('Error fetching counselling requests', err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Requested':
        return <span className="rounded bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs font-semibold">Requested</span>;
      case 'Under Review':
        return <span className="rounded bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-xs font-semibold">Under Review</span>;
      case 'Scheduled':
        return <span className="rounded bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-xs font-semibold">Scheduled</span>;
      case 'In Progress':
        return <span className="rounded bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-0.5 text-xs font-semibold">In Progress</span>;
      case 'Completed':
        return <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-semibold">Completed</span>;
      case 'Closed':
        return <span className="rounded bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-xs font-semibold">Closed</span>;
      default:
        return <span className="rounded bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-xs font-semibold">{status || 'Submitted'}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-surface pb-16 text-ink">
      {/* Header */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-3">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <Link to="/counselling" className="hover:text-ink">Counselling</Link>
            <span>/</span>
            <span className="font-semibold text-ink">My Requests</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-ink">My Counselling Requests</h1>
              <p className="text-xs sm:text-sm text-ink-muted mt-1">
                Monitor status, scheduled sessions, and advisor recommendations.
              </p>
            </div>

            <Link to="/counselling/wizard">
              <Button className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 px-4 shadow-none">
                + Request New Counselling
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-md border border-line bg-white p-5 animate-pulse space-y-3">
                <div className="h-5 bg-slate-100 rounded w-1/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-md border border-line bg-white p-12 text-center shadow-none max-w-lg mx-auto">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-blue-50 text-brand">
              <Calendar size={28} />
            </div>
            <h2 className="text-lg font-bold text-ink mb-1">No Counselling Requests Yet</h2>
            <p className="text-xs sm:text-sm text-ink-muted mb-6">
              Connect with our expert counsellors to get personalized course, college, and career guidance.
            </p>
            <Link to="/counselling/wizard">
              <Button className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 px-5 shadow-none">
                Book First Session
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="rounded-md border border-line bg-white p-5 shadow-none flex flex-col justify-between"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-line pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-ink">
                        Application #{req._id?.slice(-6).toUpperCase()}
                      </span>
                      {getStatusBadge(req.status || 'Requested')}
                    </div>
                    <h3 className="text-base font-bold text-ink">
                      {req.preferredStream || req.courseId?.name || 'General Admission Guidance'}
                    </h3>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Requested on {formatDate(req.createdAt)}
                    </p>
                  </div>

                  {req.counsellorId && (
                    <div className="rounded border border-line bg-surface p-2.5 text-xs sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-ink-muted block">Assigned Counsellor</span>
                      <span className="font-semibold text-ink">{req.counsellorId.name || 'Admissions Advisor'}</span>
                      {req.sessionDate && (
                        <p className="text-[11px] text-brand font-medium mt-0.5 flex items-center sm:justify-end gap-1">
                          <Clock size={11} /> {formatDate(req.sessionDate)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-ink-muted block">Qualification:</span>
                    <span className="font-semibold text-ink">{req.qualification || '12th Pass'}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block">Preferred State:</span>
                    <span className="font-semibold text-ink">{req.preferredState || 'All India'}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block">Budget Range:</span>
                    <span className="font-semibold text-ink">{req.budgetRange || 'Flexible'}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block">Career Interest:</span>
                    <span className="font-semibold text-ink">{req.careerInterest?.name || req.preferredStream || 'Engineering / Mgmt'}</span>
                  </div>
                </div>

                {req.studentMessage && (
                  <div className="rounded bg-surface p-3 border border-line text-xs text-ink-muted mb-3">
                    <strong className="text-ink block mb-0.5">Your Note:</strong>
                    {req.studentMessage}
                  </div>
                )}

                {/* Recommendations if provided */}
                {req.recommendedColleges && req.recommendedColleges.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-line">
                    <span className="text-xs font-bold text-ink block mb-2">Recommended Institutions:</span>
                    <div className="flex flex-wrap gap-2">
                      {req.recommendedColleges.map((col, idx) => (
                        <span key={idx} className="rounded bg-blue-50 text-brand text-xs font-medium px-2 py-0.5 border border-blue-100">
                          {col.name || col}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCounselling;
