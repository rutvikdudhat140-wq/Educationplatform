import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const CollegeList = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);

  const getColleges = async () => {
    const response = await axios.get(
      'http://localhost:5001/api/college'
    );

    setColleges(response.data.colleges || []);
  };

  const deleteCollege = async (id) => {
    await axios.delete(
      `http://localhost:5001/api/college/${id}`
    );

    getColleges();
  };

  useEffect(() => {
    getColleges();
  }, []);

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          College List
        </h2>

        <Button onClick={() => navigate('/admin/college/add')}>
          Add College
        </Button>
      </div>

      <Card className="py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Top College</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {colleges.map((college) => (
                <TableRow key={college._id}>

                  <TableCell className="font-medium">
                    {college.name}
                  </TableCell>

                  <TableCell>
                    {college.category}
                  </TableCell>

                  <TableCell>
                    {college.collegeType}
                  </TableCell>

                  <TableCell>
                    {college.location?.city}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={college.isTopCollege ? 'default' : 'outline'}
                    >
                      {college.isTopCollege ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        college.status === 'Active'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {college.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/admin/college/edit/${college._id}`
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
                            `/admin/college/${college._id}/applications`
                          )
                        }
                      >
                        View Applications
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCollege(college._id)}
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

    </div>
  );
};

export default CollegeList;
