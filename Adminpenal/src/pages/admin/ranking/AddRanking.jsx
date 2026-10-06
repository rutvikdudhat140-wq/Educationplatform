import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const emptyForm = {
  collegeId: '',
  rankingBody: '',
  rankingName: '',
  year: '',
  category: '',
  rankType: 'Numeric',
  rank: '',
  rankFrom: '',
  rankTo: '',
  score: '',
  scoreOutOf: '',
  description: '',
  status: 'Active',
  indicators: [],
  trend: [],
  parameters: []
};

const AddRanking = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [colleges, setColleges] = useState([]);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    axios.get('http://localhost:5001/api/college').then(res => setColleges(res.data.colleges || []));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Indicators
  const addIndicator = () => setForm({ ...form, indicators: [...form.indicators, { name: '', score: '' }] });
  const removeIndicator = (i) => setForm({ ...form, indicators: form.indicators.filter((_, idx) => idx !== i) });
  const updateIndicator = (i, field, val) => {
    const updated = form.indicators.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
    setForm({ ...form, indicators: updated });
  };

  // Trend
  const addTrend = () => setForm({ ...form, trend: [...form.trend, { year: '', indiaRank: '', globalRank: '' }] });
  const removeTrend = (i) => setForm({ ...form, trend: form.trend.filter((_, idx) => idx !== i) });
  const updateTrend = (i, field, val) => {
    const updated = form.trend.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
    setForm({ ...form, trend: updated });
  };

  // Parameters
  const addParameter = () => setForm({ ...form, parameters: [...form.parameters, { name: '', score: '' }] });
  const removeParameter = (i) => setForm({ ...form, parameters: form.parameters.filter((_, idx) => idx !== i) });
  const updateParameter = (i, field, val) => {
    const updated = form.parameters.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
    setForm({ ...form, parameters: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (payload.year) payload.year = Number(payload.year);
    if (payload.rank) payload.rank = Number(payload.rank);
    if (payload.rankFrom) payload.rankFrom = Number(payload.rankFrom);
    if (payload.rankTo) payload.rankTo = Number(payload.rankTo);
    if (payload.score) payload.score = Number(payload.score);
    if (payload.scoreOutOf) payload.scoreOutOf = Number(payload.scoreOutOf);
    if (payload.rankType === 'Numeric') { delete payload.rankFrom; delete payload.rankTo; }
    if (payload.rankType === 'Range') { delete payload.rank; }
    payload.indicators = payload.indicators.map(item => ({ name: item.name, score: Number(item.score) || 0 }));
    payload.trend = payload.trend.map(item => ({ year: Number(item.year) || 0, indiaRank: item.indiaRank, globalRank: item.globalRank }));
    payload.parameters = payload.parameters.map(item => ({ name: item.name, score: Number(item.score) || 0 }));

    await axios.post('http://localhost:5001/api/rankings/admin/create', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/admin/ranking/list');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Add Ranking</h2>
        <Button variant="outline" onClick={() => navigate('/admin/ranking/list')}>Back</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-slate-700">Basic Info</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>College *</Label>
              <select name="collegeId" value={form.collegeId} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 text-sm">
                <option value="">Select College</option>
                {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Ranking Body *</Label>
              <input name="rankingBody" value={form.rankingBody} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. NIRF, QS, India Today" />
            </div>
            <div>
              <Label>Ranking Name *</Label>
              <input name="rankingName" value={form.rankingName} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. QS World University Rankings" />
            </div>
            <div>
              <Label>Year *</Label>
              <input name="year" type="number" value={form.year} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. 2025" />
            </div>
            <div>
              <Label>Category</Label>
              <input name="category" value={form.category} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. Global, Engineering, Overall" />
            </div>
            <div>
              <Label>Status</Label>
              <select name="status" value={form.status} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-sm">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Rank Type</Label>
              <select name="rankType" value={form.rankType} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-sm">
                <option value="Numeric">Numeric (e.g. 526)</option>
                <option value="Range">Range (e.g. 691-700)</option>
              </select>
            </div>
            {form.rankType === 'Numeric' ? (
              <div>
                <Label>Rank</Label>
                <input name="rank" type="number" value={form.rank} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. 526" />
              </div>
            ) : (
              <>
                <div>
                  <Label>Rank From</Label>
                  <input name="rankFrom" type="number" value={form.rankFrom} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. 691" />
                </div>
                <div>
                  <Label>Rank To</Label>
                  <input name="rankTo" type="number" value={form.rankTo} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. 700" />
                </div>
              </>
            )}
            <div>
              <Label>Score</Label>
              <input name="score" type="number" step="0.01" value={form.score} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. 31.1" />
            </div>
            <div>
              <Label>Score Out Of</Label>
              <input name="scoreOutOf" type="number" value={form.scoreOutOf} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. 100" />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="Write about this ranking..." />
          </div>
        </Card>

        {/* Indicators */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-700">Indicator Scores</h3>
            <Button type="button" variant="outline" size="sm" onClick={addIndicator}>+ Add Indicator</Button>
          </div>
          {form.indicators.map((item, i) => (
            <div key={i} className="flex gap-3 items-end">
              <div className="flex-1">
                <Label>Indicator Name</Label>
                <input value={item.name} onChange={e => updateIndicator(i, 'name', e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. Academic Reputation" />
              </div>
              <div className="w-32">
                <Label>Score</Label>
                <input type="number" step="0.01" value={item.score} onChange={e => updateIndicator(i, 'score', e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
              </div>
              <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => removeIndicator(i)}>✕</Button>
            </div>
          ))}
          {form.indicators.length === 0 && <p className="text-sm text-slate-400">No indicators added yet.</p>}
        </Card>

        {/* Trend */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-700">Ranking Trend (Historical)</h3>
            <Button type="button" variant="outline" size="sm" onClick={addTrend}>+ Add Trend</Button>
          </div>
          {form.trend.map((item, i) => (
            <div key={i} className="flex gap-3 items-end">
              <div className="w-24">
                <Label>Year</Label>
                <input type="number" value={item.year} onChange={e => updateTrend(i, 'year', e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
              </div>
              <div className="flex-1">
                <Label>India Rank</Label>
                <input value={item.indiaRank} onChange={e => updateTrend(i, 'indiaRank', e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. 13" />
              </div>
              <div className="flex-1">
                <Label>Global Rank</Label>
                <input value={item.globalRank} onChange={e => updateTrend(i, 'globalRank', e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. 526 or 691-700" />
              </div>
              <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => removeTrend(i)}>✕</Button>
            </div>
          ))}
          {form.trend.length === 0 && <p className="text-sm text-slate-400">No trend entries added yet.</p>}
        </Card>

        {/* Parameters */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-700">Ranking Parameters / Scores (NIRF etc.)</h3>
            <Button type="button" variant="outline" size="sm" onClick={addParameter}>+ Add Parameter</Button>
          </div>
          {form.parameters.map((item, i) => (
            <div key={i} className="flex gap-3 items-end">
              <div className="flex-1">
                <Label>Parameter Name</Label>
                <input value={item.name} onChange={e => updateParameter(i, 'name', e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="e.g. TLR, RP, GO" />
              </div>
              <div className="w-32">
                <Label>Score</Label>
                <input type="number" step="0.01" value={item.score} onChange={e => updateParameter(i, 'score', e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
              </div>
              <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => removeParameter(i)}>✕</Button>
            </div>
          ))}
          {form.parameters.length === 0 && <p className="text-sm text-slate-400">No parameters added yet.</p>}
        </Card>

        <div className="flex gap-3">
          <Button type="submit">Save Ranking</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/ranking/list')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AddRanking;
