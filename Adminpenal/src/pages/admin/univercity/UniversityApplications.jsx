import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const UniversityApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const getApplications = async () => {

      const response = await axios.get(
        `/api/university-applications/university/${id}`
      );

      setApplications(response.data.applications || []);
    };

    getApplications();
  }, [id]);

  return (
    <div className="space-y-5">
      <Button
        variant="outline"
        onClick={() => navigate('/admin/univercity/list')}
      >
        Back
      </Button>

      <Card className="py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan="7"
                    className="py-8 text-center text-gray-500"
                  >
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">

<span className="font-medium">{application.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>{application.phone }</TableCell>

                    <TableCell>{application.email }</TableCell>

                    <TableCell>{application.universityId?.name }</TableCell>

                    <TableCell className="max-w-[320px] whitespace-normal">{application.message }</TableCell>

                    <TableCell>
                      {application.createdAt
                        ? new Date(
                            application.createdAt
                          ).toLocaleDateString()
                        : '-'}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {application.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversityApplications;
