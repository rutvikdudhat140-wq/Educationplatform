import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function CareerList() {
    const navigate = useNavigate();
    const [careers, setCareers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 12;

    const load = async (pageNum) => {
        try {
            const res = await axios.get(`/api/career?isActive=all&page=${pageNum}&limit=${limit}`);
            const list = Array.isArray(res.data?.careers)
                ? res.data.careers
                : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];
            setCareers(list);
            setTotalPages(res.data.totalPages || 1);
        } catch (error) {
           
            setCareers([]);
        }
    };

    const remove = async (id) => {
        await axios.delete(`/api/career/${id}`);
        load(page);
    };

    useEffect(() => { load(page); }, [page]);

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Careers</h2>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/admin/mentorship-requests')} className="rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2 text-sm font-medium transition-colors">View Requests</button>
                    <button onClick={() => navigate('/admin/career/add')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 transition-colors">Add Career</button>
                </div>
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
                                    <div className="text-xs text-ink-muted">{career.relatedStream || career.stream || 'General'}</div>
                                </td>
                                <td>{career.stream || career.relatedStream || 'General'}</td>
                                <td>{career.workType || 'Full Time'}</td>
                                <td>{career.salaryMin || 0} - {career.salaryMax || 0} {career.salaryUnit || 'LPA'}</td>
                                <td>{career.isActive ? 'Active' : 'Inactive'}</td>
                                <td className="space-x-2 py-3">
                                    <button className="text-brand" onClick={() => navigate(`/admin/career/edit/${career._id}`)}>Edit</button>
                                    <button className="text-red-600" onClick={() => remove(career._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-4">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border border-line rounded disabled:opacity-50"
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button
                        key={pNum}
                        onClick={() => setPage(pNum)}
                        className={`px-3 py-1 text-sm border border-line rounded ${
                            pNum === page
                                ? "bg-brand text-white"
                                : "hover:bg-brand-softest"
                        }`}
                    >
                        {pNum}
                    </button>
                ))}

                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-sm border border-line rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
