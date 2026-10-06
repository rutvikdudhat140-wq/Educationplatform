import { useEffect, useState } from 'react';
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, GraduationCap, Users, TrendingUp, BookOpen, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [totalColleges, setTotalColleges] = useState(0);
  const [totalUniversities, setTotalUniversities] = useState(0);
  const [loading, setLoading] = useState(true);

  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [collegeRes, universityRes, counsellingRes] = await Promise.all([
          axios.get('http://localhost:5001/api/college'),
          axios.get('http://localhost:5001/api/university'),
          axios.get('http://localhost:5001/api/admin/counselling', config).catch(() => ({ data: { data: [] } }))
        ]);

        setTotalColleges(collegeRes.data?.data?.length || 0);
        setTotalUniversities(universityRes.data?.data?.length || 0);

        const apps = counsellingRes.data?.data || [];
        setRecentApplications(apps.slice(0, 5)); // Get latest 5

      } catch (error) {

      }
    };
    fetchCounts();
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
    <Card className="relative overflow-hidden border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 group">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500`}></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
        <CardTitle className="text-[0.875rem] font-medium text-ink-muted">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass} text-white shadow-sm`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="z-10 relative">

        <div className="mt-3 flex items-center text-xs">
          <span className="flex items-center text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trendValue}
          </span>
          <span className="text-ink-muted ml-2">{trend}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-ink">Overview</h2>
          <p className="mt-1.5 text-[0.9375rem] text-ink-muted font-medium">
            Welcome back, Admin! Here's what's happening today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Colleges"
          value={totalColleges}
          icon={Building2}
          trend="vs last month"
          trendValue="+12%"
          colorClass="from-brand to-emerald-400"
        />
        <StatCard
          title="Total Universities"
          value={totalUniversities}
          icon={GraduationCap}
          trend="vs last month"
          trendValue="+4%"
          colorClass="from-blue-600 to-cyan-400"
        />
      </div>
    </div>
  );
};

export default Dashboard;
