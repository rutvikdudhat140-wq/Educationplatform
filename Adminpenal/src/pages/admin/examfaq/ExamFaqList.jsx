import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ExamFaqList() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const route = 'exam-faq';

    const fetchData = async () => {
        const res = await axios.get(`http://localhost:5001/api/${route}`);
        setData(res.data.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5001/api/${route}/${id}`);
        fetchData();
    };

    const handleToggleStatus = async (item) => {
        await axios.put(`http://localhost:5001/api/${route}/${item._id}`, {
            status: item.status === 'Active' ? 'Inactive' : 'Active'
        });

        fetchData();
    };

    const filteredData = data.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.exam?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                    Exam FAQ Management
                </h1>

                <Link to={`/admin/${route}/add`}>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="mr-2 size-4" />
                        Add New
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 rounded-lg border bg-white p-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-gray-500" />

                    <Input
                        placeholder="Search by title or exam..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Exam</th>
                                <th className="px-4 py-3">Session</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-4 py-8 text-center text-slate-500"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => {
                                    const examName =
                                        item.exam?.name ||
                                        item.exam?.shortName ||
                                        '';

                                    const sessionName =
                                        item.examSession?.sessionName ||
                                        '';

                                    const academicYear =
                                        item.examSession?.academicYear ||
                                        '';

                                    return (
                                        <tr
                                            key={item._id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                {item.title}
                                            </td>

                                            <td className="px-4 py-3 text-slate-600">
                                                {examName}
                                            </td>

                                            <td className="px-4 py-3 text-slate-600">
                                                {academicYear && sessionName
                                                    ? `${academicYear} - ${sessionName}`
                                                    : sessionName || academicYear}
                                            </td>

                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(item)
                                                    }
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        item.status === 'Active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {item.status}
                                                </button>
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        to={`/admin/${route}/edit/${item._id}`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="size-8"
                                                        >
                                                            <Edit className="size-4" />
                                                        </Button>
                                                    </Link>

                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="size-8"
                                                        onClick={() =>
                                                            handleDelete(item._id)
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
