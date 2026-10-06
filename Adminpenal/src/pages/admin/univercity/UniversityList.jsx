import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const UniversityList = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const getUniversities = async (pageNum) => {
    const response = await axios.get(`/api/university?page=${pageNum}&limit=${limit}`);

    setUniversities(response.data.data || []);
    setTotalPages(response.data.totalPages || 1);
  };

  const deleteUniversity = async (id) => {
    await axios.delete(`/api/university/${id}`);

    getUniversities(page);
  };

  useEffect(() => {
    getUniversities(page);
  }, [page]);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          University List
        </h2>

        <Button
          onClick={() => navigate('/admin/univercity/add')}
        >
          Add University
        </Button>
      </div>

      {/* University Table */}
      <Card className="py-0">
        <CardContent className="p-0">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {universities.map((university) => (
                <TableRow key={university._id}>

                  <TableCell className="font-medium">
                    {university.name}
                  </TableCell>

                  <TableCell>
                    {university.category}
                  </TableCell>

                  <TableCell>
                    {university.universityType}
                  </TableCell>

                  <TableCell>
                    {university.city}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        university.status === 'Active'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {university.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/admin/univercity/edit/${university._id}`
                          )
                        }
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/admin/univercity/${university._id}/applications`
                          )
                        }
                      >
                        View Applications
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          deleteUniversity(university._id)
                        }
                      >
                        Delete
                      </Button>

                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
          <Button
            key={pNum}
            size="sm"
            variant={pNum === page ? "default" : "outline"}
            onClick={() => setPage(pNum)}
          >
            {pNum}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>

    </div>
  );
};

export default UniversityList;
