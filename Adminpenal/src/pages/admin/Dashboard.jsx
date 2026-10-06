import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  // const [totalColleges, setTotalColleges] = useState(0);
  // const [totalUniversities, setTotalUniversities] = useState(0);

  // useEffect(() => {
  //   const fetchCounts = async () => {
  //     try {
  //       const college = await axios.get('http://localhost:5001/api/college');
  //       const university = await axios.get('http://localhost:5001/api/university');

  //       setTotalColleges(college.data.data.length);
  //       setTotalUniversities(university.data.data.length);
  //     } catch (error) {
  //     }
  //   };

  //   fetchCounts();
  // }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Colleges</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <h3 className="text-3xl font-semibold">{totalColleges}</h3> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Universities</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <h3 className="text-3xl font-semibold">{totalUniversities}</h3> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
