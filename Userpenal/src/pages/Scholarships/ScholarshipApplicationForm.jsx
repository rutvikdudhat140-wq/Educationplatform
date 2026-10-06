import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronRight, ChevronLeft, Upload, X, CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const STEPS = [
  { id: 1, title: "Personal Details", description: "Basic information about you" },
  { id: 2, title: "Academic Details", description: "Your education information" },
  { id: 3, title: "Eligibility Details", description: "Category and income details" },
  { id: 4, title: "Documents", description: "Upload required documents" },
  { id: 5, title: "Review", description: "Review and submit application" }
];

const GENDERS = ['Male', 'Female', 'Other'];
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];

const ScholarshipApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [scholarship, setScholarship] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({

    personalDetails: {
      fullName: '',
      email: '',
      mobile: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      state: '',
      city: ''
    },

    academicDetails: {
      college: '',
      course: '',
      currentYear: '',
      admissionYear: '',
      tenthPercentage: '',
      twelfthPercentage: '',
      currentCGPA: ''
    },

    eligibilityDetails: {
      category: '',
      annualFamilyIncome: '',
      domicileState: '',
      disabilityStatus: 'None',
      otherDetails: ''
    },

    collegeId: '',
    courseId: '',
    documents: []
  });

  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const [scholarshipRes, collegesRes, coursesRes] = await Promise.all([
      axios.get(`http://localhost:5001/api/scholarships/${id}`),
      axios.get('http://localhost:5001/api/colleges'),
      axios.get('http://localhost:5001/api/courses')
    ]);

    setScholarship(scholarshipRes.data.data);
    setColleges(collegesRes.data.colleges || collegesRes.data.data || []);
    setCourses(coursesRes.data.courses || coursesRes.data.data || []);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleDirectChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFileUpload = async (documentType, file) => {
    const mockUrl = URL.createObjectURL(file);

    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: {
        name: file.name,
        url: mockUrl,
        file: file
      }
    }));
  };

  const removeFile = (documentType) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[documentType];
      return newFiles;
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
      navigate('/login');
      return;
    }

    const documents = Object.entries(uploadedFiles).map(([docType, fileData]) => ({
      documentType: docType,
      documentUrl: fileData.url,
      documentName: fileData.name
    }));

    const applicationData = {
      ...formData,
      documents
    };

    const response = await axios.post(
      `http://localhost:5001/api/scholarships/${id}/apply`,
      applicationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    navigate(`/scholarships/application-success?applicationId=${response.data.data.applicationId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-ink">Apply for Scholarship</h1>
            <p className="text-gray-600">{scholarship?.name}</p>
          </div>

          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${currentStep >= step.id
                    ? 'bg-brand text-white'
                    : 'bg-gray-200 text-gray-600'
                  }`}>
                  {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                </div>
                <div className="ml-2 hidden md:block">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-brand' : 'text-gray-600'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="mx-4 text-gray-300" size={16} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
                  <p className="text-gray-600 mb-6">Please provide your personal information</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.personalDetails.fullName}
                      onChange={(e) => handleInputChange('personalDetails', 'fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.personalDetails.email}
                      onChange={(e) => handleInputChange('personalDetails', 'email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={formData.personalDetails.mobile}
                      onChange={(e) => handleInputChange('personalDetails', 'mobile', e.target.value)}
                      placeholder="Enter your mobile number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.personalDetails.dateOfBirth}
                      onChange={(e) => handleInputChange('personalDetails', 'dateOfBirth', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.personalDetails.gender}
                      onValueChange={(value) => handleInputChange('personalDetails', 'gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDERS.map((gender) => (
                          <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={formData.personalDetails.state}
                      onValueChange={(value) => handleInputChange('personalDetails', 'state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="city">City </Label>
                    <Input
                      id="city"
                      value={formData.personalDetails.city}
                      onChange={(e) => handleInputChange('personalDetails', 'city', e.target.value)}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address </Label>
                  <Textarea
                    id="address"
                    value={formData.personalDetails.address}
                    onChange={(e) => handleInputChange('personalDetails', 'address', e.target.value)}
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>
              </div>
            )}


            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Academic Details</h3>
                  <p className="text-gray-600 mb-6">Please provide your education information</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="college">College </Label>
                    <Select
                      value={formData.collegeId}
                      onValueChange={(value) => {
                        handleDirectChange('collegeId', value);
                        const selectedCollege = colleges.find(c => c._id === value);
                        handleInputChange('academicDetails', 'college', selectedCollege?.name || '');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your college" />
                      </SelectTrigger>
                      <SelectContent>
                        {colleges.map((college) => (
                          <SelectItem key={college._id} value={college._id}>
                            {college.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="course">Course *</Label>
                    <Select
                      value={formData.courseId}
                      onValueChange={(value) => {
                        handleDirectChange('courseId', value);
                        const selectedCourse = courses.find(c => c._id === value);
                        handleInputChange('academicDetails', 'course', selectedCourse?.name || '');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.name} ({course.level})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currentYear">Current Year/Semester *</Label>
                    <Select
                      value={formData.academicDetails.currentYear}
                      onValueChange={(value) => handleInputChange('academicDetails', 'currentYear', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select current year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                        <SelectItem value="5th Year">5th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="admissionYear">Admission Year *</Label>
                    <Input
                      id="admissionYear"
                      type="number"
                      value={formData.academicDetails.admissionYear}
                      onChange={(e) => handleInputChange('academicDetails', 'admissionYear', e.target.value)}
                      placeholder="e.g., 2023"
                      min="2015"
                      max="2030"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tenthPercentage">10th Percentage *</Label>
                    <Input
                      id="tenthPercentage"
                      value={formData.academicDetails.tenthPercentage}
                      onChange={(e) => handleInputChange('academicDetails', 'tenthPercentage', e.target.value)}
                      placeholder="e.g., 85.5%"
                    />
                  </div>

                  <div>
                    <Label htmlFor="twelfthPercentage">12th Percentage *</Label>
                    <Input
                      id="twelfthPercentage"
                      value={formData.academicDetails.twelfthPercentage}
                      onChange={(e) => handleInputChange('academicDetails', 'twelfthPercentage', e.target.value)}
                      placeholder="e.g., 90.2%"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="currentCGPA">Current CGPA/Percentage *</Label>
                    <Input
                      id="currentCGPA"
                      value={formData.academicDetails.currentCGPA}
                      onChange={(e) => handleInputChange('academicDetails', 'currentCGPA', e.target.value)}
                      placeholder="e.g., 8.5 CGPA or 85%"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Eligibility Details</h3>
                  <p className="text-gray-600 mb-6">Please provide eligibility information</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {scholarship?.eligibility?.category?.length > 0 && (
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.eligibilityDetails.category}
                        onValueChange={(value) => handleInputChange('eligibilityDetails', 'category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {scholarship.eligibility.category.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {scholarship?.eligibility?.maximumFamilyIncome && (
                    <div>
                      <Label htmlFor="annualFamilyIncome">Annual Family Income</Label>
                      <Input
                        id="annualFamilyIncome"
                        value={formData.eligibilityDetails.annualFamilyIncome}
                        onChange={(e) => handleInputChange('eligibilityDetails', 'annualFamilyIncome', e.target.value)}
                        placeholder="Enter annual family income"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum allowed: {scholarship.eligibility.maximumFamilyIncome}
                      </p>
                    </div>
                  )}

                  {scholarship?.eligibility?.state?.length > 0 && (
                    <div>
                      <Label htmlFor="domicileState">Domicile State</Label>
                      <Select
                        value={formData.eligibilityDetails.domicileState}
                        onValueChange={(value) => handleInputChange('eligibilityDetails', 'domicileState', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select domicile state" />
                        </SelectTrigger>
                        <SelectContent>
                          {scholarship.eligibility.state.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="disabilityStatus">Disability Status</Label>
                    <Select
                      value={formData.eligibilityDetails.disabilityStatus}
                      onValueChange={(value) => handleInputChange('eligibilityDetails', 'disabilityStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select disability status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="otherDetails">Other Details</Label>
                  <Textarea
                    id="otherDetails"
                    value={formData.eligibilityDetails.otherDetails}
                    onChange={(e) => handleInputChange('eligibilityDetails', 'otherDetails', e.target.value)}
                    placeholder="Any additional information relevant to this scholarship"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Required Documents</h3>
                  <p className="text-gray-600 mb-6">Please upload the required documents</p>
                </div>

                {scholarship?.requiredDocuments?.length > 0 ? (
                  <div className="space-y-4">
                    {scholarship.requiredDocuments.map((docType) => (
                      <div key={docType} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{docType}</h4>
                          {uploadedFiles[docType] ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle size={14} className="mr-1" />
                              Uploaded
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600">
                              Required
                            </Badge>
                          )}
                        </div>

                        {uploadedFiles[docType] ? (
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                            <span className="text-sm text-green-800">
                              {uploadedFiles[docType].name}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile(docType)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PDF, JPG, PNG up to 10MB
                            </p>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  handleFileUpload(docType, file);
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <CheckCircle className="mx-auto h-12 w-12 text-brand mb-4" />
                    <h4 className="font-medium text-gray-900 mb-2">No Documents Required</h4>
                    <p className="text-gray-600">
                      This scholarship does not require document uploads
                    </p>
                  </div>
                )}
              </div>
            )}


            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Review Application</h3>
                  <p className="text-gray-600 mb-6">Please review your information before submitting</p>
                </div>

                <div className="space-y-6">

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Scholarship Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Scholarship Name</p>
                          <p className="font-medium">{scholarship?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Provider</p>
                          <p className="font-medium">{scholarship?.provider}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-medium text-brand">{scholarship?.amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Type</p>
                          <p className="font-medium">{scholarship?.type}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>


                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                        Edit
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium">{formData.personalDetails.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{formData.personalDetails.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Mobile</p>
                          <p className="font-medium">{formData.personalDetails.mobile}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date of Birth</p>
                          <p className="font-medium">{formData.personalDetails.dateOfBirth}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Gender</p>
                          <p className="font-medium">{formData.personalDetails.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">State</p>
                          <p className="font-medium">{formData.personalDetails.state}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium">{formData.personalDetails.address}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>


                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Academic Information</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                        Edit
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">College</p>
                          <p className="font-medium">{formData.academicDetails.college}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Course</p>
                          <p className="font-medium">{formData.academicDetails.course}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Current Year</p>
                          <p className="font-medium">{formData.academicDetails.currentYear}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Admission Year</p>
                          <p className="font-medium">{formData.academicDetails.admissionYear}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">10th Percentage</p>
                          <p className="font-medium">{formData.academicDetails.tenthPercentage}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">12th Percentage</p>
                          <p className="font-medium">{formData.academicDetails.twelfthPercentage}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Current CGPA</p>
                          <p className="font-medium">{formData.academicDetails.currentCGPA}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>


                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Eligibility Information</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)}>
                        Edit
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.eligibilityDetails.category && (
                          <div>
                            <p className="text-sm text-gray-600">Category</p>
                            <p className="font-medium">{formData.eligibilityDetails.category}</p>
                          </div>
                        )}
                        {formData.eligibilityDetails.annualFamilyIncome && (
                          <div>
                            <p className="text-sm text-gray-600">Annual Family Income</p>
                            <p className="font-medium">{formData.eligibilityDetails.annualFamilyIncome}</p>
                          </div>
                        )}
                        {formData.eligibilityDetails.domicileState && (
                          <div>
                            <p className="text-sm text-gray-600">Domicile State</p>
                            <p className="font-medium">{formData.eligibilityDetails.domicileState}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-600">Disability Status</p>
                          <p className="font-medium">{formData.eligibilityDetails.disabilityStatus}</p>
                        </div>
                      </div>
                      {formData.eligibilityDetails.otherDetails && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">Other Details</p>
                          <p className="font-medium">{formData.eligibilityDetails.otherDetails}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>


                  {scholarship?.requiredDocuments?.length > 0 && (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Documents</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(4)}>
                          Edit
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {scholarship.requiredDocuments.map((docType) => (
                            <div key={docType} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <span className="font-medium">{docType}</span>
                              {uploadedFiles[docType] ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle size={16} className="text-brand" />
                                  <span className="text-sm text-brand">
                                    {uploadedFiles[docType].name}
                                  </span>
                                </div>
                              ) : (
                                <Badge variant="destructive">Missing</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            <Separator className="my-6" />
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={nextStep}
                  className="bg-brand hover:bg-brand/90 flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-brand hover:bg-brand/90"
                >
                  Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScholarshipApplicationForm;
