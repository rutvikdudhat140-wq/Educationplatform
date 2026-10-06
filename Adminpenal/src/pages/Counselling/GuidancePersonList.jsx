import { useState, useEffect } from 'react';
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import GuidancePersonForm from './GuidancePersonForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

const API = '/api/admin/counselling';

const GuidancePersonList = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCounsellors = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API}/counsellors/all`);
      setCounsellors(res.data.counsellors || []);
    } catch {
      setCounsellors([]);
      setError('Failed to load Guidance Persons');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.put(`${API}/counsellors/${id}/toggle`, null);
      setError('');
      fetchCounsellors();
    } catch {
      setError('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await axios.delete(`${API}/counsellors/${deleteConfirm}`);
      setError('');
      fetchCounsellors();
    } catch {
      setError('Failed to delete Guidance Person');
    }
    setDeleteConfirm(null);
  };

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    fetchCounsellors();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Guidance Persons</h1>
          <p className="text-sm text-ink-muted mt-1">Manage counsellors who handle student guidance requests</p>
        </div>
        <Button
          className="bg-brand hover:bg-brand-dark"
          onClick={() => { setEditing(null); setShowForm(true); }}
        >
          + Add Guidance Person
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-ink-muted">
                  Loading…
                </TableCell>
              </TableRow>
            ) : counsellors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-ink-muted">
                  No Guidance Persons found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              counsellors.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-10 h-10 rounded-full object-cover border"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand font-bold text-sm">
                        {c.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-sm">{c.email}</TableCell>
                  <TableCell className="text-sm">{c.phone || '-'}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">
                    {c.expertise?.join(', ') || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={c.isActive
                        ? 'bg-green-50 text-brand border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                      }
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setEditing(c); setShowForm(true); }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={c.isActive ? 'destructive' : 'outline'}
                        onClick={() => handleToggle(c._id)}
                      >
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setDeleteConfirm(c._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showForm && (
        <GuidancePersonForm
          counsellor={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}

      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Are you sure?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-ink-muted">
            This will permanently delete the Guidance Person and unassign them from any counselling requests.
          </p>
          <div className="flex justify-end gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuidancePersonList;
