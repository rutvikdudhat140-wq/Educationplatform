import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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
  { id: 1, title: "Basic Info", description: "Name, provider, type" },
  { id: 2, title: "Colleges", description: "Select colleges" },
  { id: 3, title: "Courses", description: "Select courses" },
  { id: 4, title: "Benefits", description: "Amount and duration" },
  { id: 5, title: "Eligibility", description: "Eligibility criteria" },
  { id: 6, title: "Dates", description: "Application dates" },
  { id: 7, title: "Documents", description: "Required documents" },
  { id: 8, title: "Application", description: "Process and URL" },
];

const SCHOLARSHIP_TYPES = [
  "College Specific",
  "Government",
  "Private",
  "Merit Based",
  "Need Based",
  "State Based",
  "Course Based",
  "Other",
];

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];
const GENDERS = ["All", "Male", "Female", "Other"];
const STUDY_LEVELS = ["UG", "PG", "Diploma", "PhD"];
const AMOUNT_TYPES = [
  "One Time",
  "Per Year",
  "Per Semester",
  "Full Course",
];

const DOCUMENT_TYPES = [
  "10th Marksheet",
  "12th Marksheet",
  "College Admission Proof",
  "Income Certificate",
  "Caste Certificate",
  "Domicile Certificate",
  "ID Proof",
  "Bank Details",
];

const emptyFormData = {
  name: "",
  provider: "",
  type: "",
  description: "",
  collegeIds: [],
  courseIds: [],
  amount: "",
  amountType: "One Time",
  duration: "",
  renewalAvailable: false,
  benefitsDescription: "",
  eligibility: {
    minimumMarks: "",
    maximumFamilyIncome: "",
    category: [],
    gender: "All",
    state: [],
    studyLevel: [],
    otherCriteria: "",
  },
  applicationStartDate: "",
  applicationDeadline: "",
  requiredDocuments: [],
  applicationProcess: "",
  applicationUrl: "",
  status: "Active",
};

const ScholarshipForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {

    const fetchData = async () => {
      const [collegesRes, coursesRes] = await Promise.all([
        axios.get("/api/colleges"),
        axios.get("/api/courses"),
      ]);

      setColleges(
        collegesRes.data.colleges || collegesRes.data.data || []
      );

      setCourses(
        coursesRes.data.courses || coursesRes.data.data || []
      );
    };

    fetchData();

    if (isEdit) {
      const fetchScholarship = async () => {
        const response = await axios.get(
          `/api/admin/scholarships/${id}`
        );

        const data = response.data.data;

        setFormData({
          name: data.name,
          provider: data.provider ,
          type: data.type ,
          description: data.description,

          collegeIds:
            data.collegeIds
              ?.map((college) =>
                typeof college === "object" && college !== null
                  ? college._id?.toString()
                  : String(college)
              )
              .filter(Boolean) || [],

          courseIds:
            data.courseIds
              ?.map((course) =>
                typeof course === "object" && course !== null
                  ? course._id?.toString()
                  : String(course)
              )
              .filter(Boolean) || [],

          amount: data.amount || "",
          amountType: data.amountType || "One Time",
          duration: data.duration || "",
          renewalAvailable: data.renewalAvailable || false,
          benefitsDescription: data.benefitsDescription || "",

          eligibility: {
            minimumMarks:
              data.eligibility?.minimumMarks,

            maximumFamilyIncome:
              data.eligibility?.maximumFamilyIncome ,

            category:
              data.eligibility?.category || [],

            gender:
              data.eligibility?.gender || "All",

            state:
              data.eligibility?.state || [],

            studyLevel:
              data.eligibility?.studyLevel || [],

            otherCriteria:
              data.eligibility?.otherCriteria || "",
          },

          applicationStartDate: data.applicationStartDate
            ? data.applicationStartDate.slice(0, 10)
            : "",

          applicationDeadline: data.applicationDeadline
            ? data.applicationDeadline.slice(0, 10)
            : "",

          requiredDocuments:
            data.requiredDocuments || [],

          applicationProcess:
            data.applicationProcess || "",

          applicationUrl:
            data.applicationUrl || "",

          status:
            data.status || "Active",
        });
      };

      fetchScholarship();
    }
  }, [id, isEdit]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEligibilityChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        [field]: value,
      },
    }));
  };

  const handleToggleArray = (parent, field, value) => {
    const strValue = value?.toString?.() || String(value);

    setFormData((prev) => {
      const current =
        parent === "eligibility"
          ? prev.eligibility[field]
          : prev[field];

      const updated = current?.includes(strValue)
        ? current.filter((item) => item !== strValue)
        : [...(current || []), strValue];

      if (parent === "eligibility") {
        return {
          ...prev,
          eligibility: {
            ...prev.eligibility,
            [field]: updated,
          },
        };
      }

      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 8));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {

    const url = isEdit
      ? `/api/admin/scholarships/${id}`
      : "/api/admin/scholarships";

    const method = isEdit ? "PUT" : "POST";

    await axios({
      method,
      url,
      data: formData,
    });

    navigate("/admin/scholarships");
  };

  return (
    <div className="space-y-4">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">
            {isEdit ? "Edit Scholarship" : "Add New Scholarship"}
          </h2>

          <p className="text-xs text-ink-muted mt-1">
            Manage scholarship information and eligibility details
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/admin/scholarships")}
          className="h-8"
        >
          Back to List
        </Button>
      </div>

      <Card className="border-line shadow-sm">
        <CardContent className="p-4 sm:p-5">

          {/* Steps */}
          <div className="flex items-center overflow-x-auto pb-3 mb-5 border-b border-line">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep >= step.id
                        ? "bg-brand text-white"
                        : "bg-brand-softest text-ink-muted"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle size={14} />
                    ) : (
                      step.id
                    )}
                  </div>

                  <div className="hidden lg:block text-left">
                    <p
                      className={`text-xs font-medium ${
                        currentStep >= step.id
                          ? "text-brand"
                          : "text-ink-muted"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </button>

                {index < STEPS.length - 1 && (
                  <ChevronRight
                    size={14}
                    className="mx-3 text-ink-muted"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <Label htmlFor="name" className="text-xs">
                    Scholarship Name *
                  </Label>

                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
                    placeholder="Enter scholarship name"
                    className="h-9 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="provider" className="text-xs">
                    Provider *
                  </Label>

                  <Input
                    id="provider"
                    value={formData.provider}
                    onChange={(e) =>
                      handleInputChange("provider", e.target.value)
                    }
                    placeholder="Enter provider name"
                    className="h-9 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">
                    Scholarship Type *
                  </Label>

                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      handleInputChange("type", value)
                    }
                  >
                    <SelectTrigger className="h-9 mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>

                    <SelectContent>
                      {SCHOLARSHIP_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">
                    Status
                  </Label>

                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="h-9 mt-1">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Active">
                        Active
                      </SelectItem>

                      <SelectItem value="Inactive">
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <div>
                <Label htmlFor="description" className="text-xs">
                  Description *
                </Label>

                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Describe this scholarship"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  College Mapping
                </h3>

                <p className="text-xs text-ink-muted mt-1">
                  Select one or more colleges for this scholarship
                </p>
              </div>

              {colleges.length === 0 ? (
                <p className="text-xs text-ink-muted">
                  No colleges available.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {colleges.map((college) => {
                    const isSelected =
                      formData.collegeIds.includes(
                        college._id?.toString()
                      );

                    return (
                      <button
                        type="button"
                        key={college._id}
                        onClick={() =>
                          handleToggleArray(
                            null,
                            "collegeIds",
                            college._id
                          )
                        }
                        className={`text-left p-3 border rounded-lg transition-colors ${
                          isSelected
                            ? "border-brand bg-brand-softest"
                            : "border-line hover:border-brand-border"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-xs text-ink">
                            {college.name}
                          </span>

                          {isSelected && (
                            <CheckCircle
                              size={15}
                              className="text-brand shrink-0"
                            />
                          )}
                        </div>

                        <p className="text-[11px] text-ink-muted mt-1">
                          {college.location?.city},{" "}
                          {college.location?.state}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  Course Mapping
                </h3>

                <p className="text-xs text-ink-muted mt-1">
                  Optionally select one or more courses
                </p>
              </div>

              {courses.length === 0 ? (
                <p className="text-xs text-ink-muted">
                  No courses available.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {courses.map((course) => {
                    const isSelected =
                      formData.courseIds.includes(
                        course._id?.toString()
                      );

                    return (
                      <button
                        type="button"
                        key={course._id}
                        onClick={() =>
                          handleToggleArray(
                            null,
                            "courseIds",
                            course._id
                          )
                        }
                        className={`text-left p-3 border rounded-lg transition-colors ${
                          isSelected
                            ? "border-brand bg-brand-softest"
                            : "border-line hover:border-brand-border"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-xs text-ink">
                            {course.name}
                          </span>

                          {isSelected && (
                            <CheckCircle
                              size={15}
                              className="text-brand shrink-0"
                            />
                          )}
                        </div>

                        <p className="text-[11px] text-ink-muted mt-1">
                          {course.fullName} ({course.level})
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-ink">
                Benefits
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <Label htmlFor="amount" className="text-xs">
                    Scholarship Amount *
                  </Label>

                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    placeholder="e.g., ₹50,000"
                    className="h-9 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">
                    Amount Type
                  </Label>

                  <Select
                    value={formData.amountType}
                    onValueChange={(value) =>
                      handleInputChange("amountType", value)
                    }
                  >
                    <SelectTrigger className="h-9 mt-1">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {AMOUNT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-xs">
                    Duration
                  </Label>

                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange(
                        "duration",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 4 years"
                    className="h-9 mt-1"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="renewalAvailable"
                    checked={formData.renewalAvailable}
                    onChange={(e) =>
                      handleInputChange(
                        "renewalAvailable",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />

                  <Label
                    htmlFor="renewalAvailable"
                    className="text-xs"
                  >
                    Renewal Available
                  </Label>
                </div>

              </div>

              <div>
                <Label
                  htmlFor="benefitsDescription"
                  className="text-xs"
                >
                  Benefits Description
                </Label>

                <Textarea
                  id="benefitsDescription"
                  value={formData.benefitsDescription}
                  onChange={(e) =>
                    handleInputChange(
                      "benefitsDescription",
                      e.target.value
                    )
                  }
                  placeholder="Describe additional benefits"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-ink">
                Eligibility Criteria
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <Label
                    htmlFor="minimumMarks"
                    className="text-xs"
                  >
                    Minimum Marks
                  </Label>

                  <Input
                    id="minimumMarks"
                    value={formData.eligibility.minimumMarks}
                    onChange={(e) =>
                      handleEligibilityChange(
                        "minimumMarks",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 85%"
                    className="h-9 mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="maximumFamilyIncome"
                    className="text-xs"
                  >
                    Maximum Family Income
                  </Label>

                  <Input
                    id="maximumFamilyIncome"
                    value={
                      formData.eligibility.maximumFamilyIncome
                    }
                    onChange={(e) =>
                      handleEligibilityChange(
                        "maximumFamilyIncome",
                        e.target.value
                      )
                    }
                    placeholder="e.g., ₹8,00,000"
                    className="h-9 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">
                    Gender
                  </Label>

                  <Select
                    value={formData.eligibility.gender}
                    onValueChange={(value) =>
                      handleEligibilityChange(
                        "gender",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="h-9 mt-1">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {GENDERS.map((gender) => (
                        <SelectItem
                          key={gender}
                          value={gender}
                        >
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="otherCriteria"
                    className="text-xs"
                  >
                    Other Criteria
                  </Label>

                  <Textarea
                    id="otherCriteria"
                    value={
                      formData.eligibility.otherCriteria
                    }
                    onChange={(e) =>
                      handleEligibilityChange(
                        "otherCriteria",
                        e.target.value
                      )
                    }
                    placeholder="Any other eligibility rules"
                    rows={2}
                    className="mt-1"
                  />
                </div>

              </div>

              <div>
                <Label className="text-xs">
                  Category
                </Label>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        handleToggleArray(
                          "eligibility",
                          "category",
                          category
                        )
                      }
                      className={`px-3 py-1 rounded-md text-xs border ${
                        formData.eligibility.category?.includes(
                          category
                        )
                          ? "bg-brand text-white border-brand"
                          : "bg-white text-ink border-line hover:border-teal-400"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs">
                  Study Level
                </Label>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {STUDY_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        handleToggleArray(
                          "eligibility",
                          "studyLevel",
                          level
                        )
                      }
                      className={`px-3 py-1 rounded-md text-xs border ${
                        formData.eligibility.studyLevel?.includes(
                          level
                        )
                          ? "bg-brand text-white border-brand"
                          : "bg-white text-ink border-line hover:border-teal-400"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs">
                  State / Domicile
                </Label>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(formData.eligibility.state || []).map(
                    (state) => (
                      <Badge
                        key={state}
                        variant="outline"
                        className="text-[11px]"
                      >
                        {state}
                      </Badge>
                    )
                  )}
                </div>

                <Input
                  placeholder="Add state and press Enter"
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      e.target.value.trim()
                    ) {
                      const state =
                        e.target.value.trim();

                      if (
                        !formData.eligibility.state?.includes(
                          state
                        )
                      ) {
                        handleEligibilityChange(
                          "state",
                          [
                            ...(formData.eligibility.state ||
                              []),
                            state,
                          ]
                        );
                      }

                      e.target.value = "";
                    }
                  }}
                  className="mt-2 h-9 max-w-xs"
                />
              </div>
            </div>
          )}

          {/* Step 6 */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-ink">
                Important Dates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <Label
                    htmlFor="applicationStartDate"
                    className="text-xs"
                  >
                    Application Start Date *
                  </Label>

                  <Input
                    id="applicationStartDate"
                    type="date"
                    value={formData.applicationStartDate}
                    onChange={(e) =>
                      handleInputChange(
                        "applicationStartDate",
                        e.target.value
                      )
                    }
                    className="h-9 mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="applicationDeadline"
                    className="text-xs"
                  >
                    Application Deadline *
                  </Label>

                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) =>
                      handleInputChange(
                        "applicationDeadline",
                        e.target.value
                      )
                    }
                    className="h-9 mt-1"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Step 7 */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  Required Documents
                </h3>

                <p className="text-xs text-ink-muted mt-1">
                  Select required documents
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {DOCUMENT_TYPES.map((docType) => {
                  const isSelected =
                    formData.requiredDocuments?.includes(
                      docType
                    );

                  return (
                    <button
                      type="button"
                      key={docType}
                      onClick={() =>
                        handleToggleArray(
                          null,
                          "requiredDocuments",
                          docType
                        )
                      }
                      className={`flex items-center justify-between text-left p-3 border rounded-lg ${
                        isSelected
                          ? "border-brand bg-brand-softest"
                          : "border-line hover:border-brand-border"
                      }`}
                    >
                      <span className="text-xs font-medium text-ink">
                        {docType}
                      </span>

                      {isSelected && (
                        <CheckCircle
                          size={15}
                          className="text-brand"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 8 */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-ink">
                Application Information
              </h3>

              <div>
                <Label
                  htmlFor="applicationProcess"
                  className="text-xs"
                >
                  Application Process
                </Label>

                <Textarea
                  id="applicationProcess"
                  value={formData.applicationProcess}
                  onChange={(e) =>
                    handleInputChange(
                      "applicationProcess",
                      e.target.value
                    )
                  }
                  placeholder="Describe the application process"
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="applicationUrl"
                  className="text-xs"
                >
                  Official Application URL
                </Label>

                <Input
                  id="applicationUrl"
                  value={formData.applicationUrl}
                  onChange={(e) =>
                    handleInputChange(
                      "applicationUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                  className="h-9 mt-1"
                />
              </div>
            </div>
          )}

          <Separator className="my-5" />

          {/* Navigation */}
          <div className="flex items-center justify-between">

            <Button
              size="sm"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="h-8 gap-1"
            >
              <ChevronLeft size={14} />
              Previous
            </Button>

            {currentStep < 8 ? (
              <Button
                size="sm"
                onClick={nextStep}
                className="h-8 bg-brand hover:bg-brand-dark gap-1"
              >
                Next
                <ChevronRight size={14} />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSubmit}
                className="h-8 bg-brand hover:bg-brand-dark"
              >
                {isEdit
                  ? "Update Scholarship"
                  : "Create Scholarship"}
              </Button>
            )}

          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default ScholarshipForm;
