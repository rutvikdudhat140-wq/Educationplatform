import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const RankingList = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [filters, setFilters] = useState({ collegeId: '', rankingBody: '', category: '', year: '', status: '' });
  const token = localStorage.getItem('adminToken');

  const fetchRankings = async () => {
    const params = {};
    if (filters.collegeId) params.collegeId = filters.collegeId;
    if (filters.rankingBody) params.rankingBody = filters.rankingBody;
    if (filters.category) params.category = filters.category;
    if (filters.year) params.year = filters.year;
    if (filters.status) params.status = filters.status;
    const res = await axios.get('http://localhost:5001/api/rankings/admin/list', {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    setRankings(res.data.rankings || []);
  };

  const fetchColleges = async () => {
    const res = await axios.get('http://localhost:5001/api/college');
    setColleges(res.data.colleges || []);
  };

  const deleteRanking = async (id) => {
    await axios.delete(`http://localhost:5001/api/rankings/admin/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchRankings();
  };

  useEffect(() => { fetchColleges(); }, []);
  useEffect(() => { fetchRankings(); }, [filters]);

  const displayRank = (r) => {
    if (r.rankType === 'Range') return `${r.rankFrom || ''}-${r.rankTo || ''}`;
    return r.rank !== undefined && r.rank !== null ? `#${r.rank}` : '—';
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Ranking List</h2>
        <Button onClick={() => navigate('/admin/ranking/add')}>Add Ranking</Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <select className="rounded border px-3 py-2 text-sm" value={filters.collegeId} onChange={e => setFilters({ ...filters, collegeId: e.target.value })}>
            <option value="">All Colleges</option>
            {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input className="rounded border px-3 py-2 text-sm" placeholder="Ranking Body" value={filters.rankingBody} onChange={e => setFilters({ ...filters, rankingBody: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Category" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Year" value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })} />
          <select className="rounded border px-3 py-2 text-sm" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </Card>

      <Card className="py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College</TableHead>
                <TableHead>Ranking Body</TableHead>
                <TableHead>Ranking Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map(r => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium">{r.collegeId?.name || '—'}</TableCell>
                  <TableCell>{r.rankingBody}</TableCell>
                  <TableCell>{r.rankingName}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.year}</TableCell>
                  <TableCell>{displayRank(r)}</TableCell>
                  <TableCell>{r.score !== undefined && r.score !== null ? r.score : '—'}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === 'Active' ? 'default' : 'secondary'}>{r.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/ranking/edit/${r._id}`)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteRanking(r._id)}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rankings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-slate-400">No rankings found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingList;
