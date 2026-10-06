import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Plus, Edit2, Trash2 } from 'lucide-react';

import {
  AdminCard,
  PageHeader,
  StatusBadge,
  EmptyRow,
} from '@/components/layout/AdminUI';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';

const formatDate = (value) => {
  if (!value) return '—';

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
};

export default function AdminEducationLoanList() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          '/api/education-loan/articles',
          {
            headers: { 'x-admin-request': 'true' },
            signal: controller.signal,
          }
        );

        setArticles(res.data || []);
      } catch {
        setArticles([]);
      }
    };

    fetchArticles();

    return () => controller.abort();
  }, []);

  const handleDelete = async (article) => {

    await axios.delete(`/api/education-loan/articles/${article._id}`);

    setArticles((prev) => prev.filter((item) => item._id !== article._id));
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Education Loan Guides">
        <Button
          size="sm"
          onClick={() => navigate('/admin/education-loans/add')}
          className="h-9 bg-brand hover:bg-brand-dark flex items-center gap-2"
        >
          <Plus size={15} />
          Add New Guide
        </Button>
      </PageHeader>

      <AdminCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TITLE</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>COUNTRY</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>UPDATED</TableHead>
              <TableHead className="text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {articles.length === 0 ? (
              <EmptyRow
                colSpan={6}
                message="No guides yet. Add your first education loan guide."
              />
            ) : (
              articles.map((article) => (
                <TableRow key={article._id}>
                  <TableCell>
                    <span className="block text-sm font-medium text-ink">
                      {article.title}
                    </span>

                    <span className="block text-[11px] text-ink-muted">
                      /{article.slug}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-ink-muted">
                    {article.category}
                  </TableCell>

                  <TableCell className="text-sm text-ink-muted">
                    {article.country }
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={article.status} />
                  </TableCell>

                  <TableCell className="text-sm text-ink-muted">
                    {formatDate(article.updatedAt)}
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/admin/education-loans/edit/${article._id}`
                          )
                        }
                        className="h-7 w-7 p-0"
                      >
                        <Edit2 size={13} />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(article)}
                        className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminCard>
    </div>
  );
}
