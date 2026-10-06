import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CareerList() {
    const navigate = useNavigate();
    const [careers, setCareers] = useState([]);

    const load = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/career?isActive=all');
            const list = Array.isArray(res.data?.careers)
                ? res.data.careers
                : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];
            setCareers(list);
        } catch (error) {
            console.error('Failed to load careers:', error);
            setCareers([]);
        }
    };

    const remove = async (id) => {
        await axios.delete(`http://localhost:5001/api/career/${id}`);
        load();
    };

    useEffect(() => { load(); }, []);

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Careers</h2>
                <button onClick={() => navigate('/admin/career/add')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white">Add Career</button>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3">Career</th>
                            <th>Stream</th>
                            <th>Work Type</th>
                            <th>Salary</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {careers.map((career) => (
                            <tr key={career._id} className="border-b">
                                <td className="py-3">
                                    <div className="font-medium">{career.name}</div>
                                    <div className="text-xs text-slate-500">{career.relatedStream || career.stream || 'General'}</div>
                                </td>
                                <td>{career.stream || career.relatedStream || 'General'}</td>
                                <td>{career.workType || 'Full Time'}</td>
                                <td>{career.salaryMin || 0} - {career.salaryMax || 0} {career.salaryUnit || 'LPA'}</td>
                                <td>{career.isActive ? 'Active' : 'Inactive'}</td>
                                <td className="space-x-2 py-3">
                                    <button className="text-emerald-700" onClick={() => navigate(`/admin/career/edit/${career._id}`)}>Edit</button>
                                    <button className="text-red-600" onClick={() => remove(career._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
