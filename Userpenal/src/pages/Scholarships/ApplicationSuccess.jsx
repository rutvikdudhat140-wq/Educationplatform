import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, FileText, Home, List } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ApplicationSuccess = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (applicationId) {
      const token = localStorage.getItem("userToken");
      if (token) {
        axios
          .get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/scholarships/applications/${applicationId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setApplication(res.data.data);
          });
      }
    }
  }, [applicationId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <CheckCircle className="h-16 w-16 text-brand mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-ink mb-2">
            Application Submitted Successfully
          </h1>
          <p className="text-gray-600 mb-6">
            Your scholarship application has been submitted. Keep track of your
            application status.
          </p>
          {application && (
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-500">Application ID</p>
              <p className="text-xl font-bold text-brand">
                {application.applicationId}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-brand hover:bg-brand/90">
            <Link to="/my-scholarships" className="flex items-center gap-2">
              <FileText size={16} />
              My Scholarships
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/scholarships" className="flex items-center gap-2">
              <List size={16} />
              Browse More Scholarships
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/" className="flex items-center gap-2">
              <Home size={16} />
              Home
            </Link>
          </Button>
        </div>

        {application && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Scholarship</p>
                  <p className="font-medium">
                    {application.scholarshipId?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-medium">
                    {application.scholarshipId?.provider || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-brand">
                    {application.scholarshipId?.amount || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant="secondary">Submitted</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">College</p>
                  <p className="font-medium">
                    {application.collegeId?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-medium">
                    {application.courseId?.name || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApplicationSuccess;
