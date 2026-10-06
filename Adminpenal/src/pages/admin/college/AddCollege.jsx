
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddCollege = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Engineering",
    collegeType: "Private",
    establishedYear: "",
    status: "Active",
    isTopCollege: false,

    logo: "",
    coverImage: "",
    images: "",

    rating: "",
    accreditations: "",

    city: "",
    state: "",
    country: "India",
    address: "",

    website: "",
    email: "",
    phone: "",

    facultyStrength: "",
    campusSize: "",
    totalCourses: "",

    facilities: "",

    courseName: "",
    specialization: "",
    duration: "",
    fees: "",
    eligibility: "",

    admissionDetails: "",
    entranceExams: "",
    importantDates: "",

    placements: [
      {
        year: "",
        averagePackage: "",
        highestPackage: "",
        medianPackage: "",
        totalOffers: "",
        topRecruiters: "",
        description: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePlacementChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...form.placements];
    updated[index][name] = value;

    setForm({
      ...form,
      placements: updated,
    });
  };

  const addPlacement = () => {
    setForm({
      ...form,
      placements: [
        ...form.placements,
        {
          year: "",
          averagePackage: "",
          highestPackage: "",
          medianPackage: "",
          totalOffers: "",
          topRecruiters: "",
          description: "",
        },
      ],
    });
  };

  const removePlacement = (index) => {
    const updated = form.placements.filter((_, i) => i !== index);

    setForm({
      ...form,
      placements: updated,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      collegeType: form.collegeType,
      establishedYear: form.establishedYear,
      status: form.status,
      isTopCollege: form.isTopCollege,

      logo: form.logo,
      coverImage: form.coverImage,
      images: form.images
        ? form.images.split(",").map((item) => item.trim())
        : [],

      rating: form.rating,
      accreditations: form.accreditations
        ? form.accreditations.split(",").map((item) => item.trim())
        : [],

      location: {
        city: form.city,
        state: form.state,
        country: form.country,
        address: form.address,
      },

      website: form.website,
      email: form.email,
      phone: form.phone,

      highlights: {
        facultyStrength: form.facultyStrength,
        campusSize: form.campusSize,
        totalCourses: form.totalCourses,
      },

      facilities: form.facilities
        ? form.facilities.split(",").map((item) => item.trim())
        : [],

      courses: form.courseName
        ? [
            {
              courseName: form.courseName,
              specialization: form.specialization,
              duration: form.duration,
              fees: form.fees,
              eligibility: form.eligibility,
            },
          ]
        : [],

      admissions: {
        admissionDetails: form.admissionDetails,
        entranceExams: form.entranceExams
          ? form.entranceExams
              .split(",")
              .map((item) => item.trim())
          : [],
        importantDates: form.importantDates,
      },

      placements: form.placements.map((item) => ({
        year: item.year,
        averagePackage: item.averagePackage,
        highestPackage: item.highestPackage,
        medianPackage: item.medianPackage,
        totalOffers: item.totalOffers,
        topRecruiters: item.topRecruiters
          ? item.topRecruiters
              .split(",")
              .map((recruiter) => recruiter.trim())
          : [],
        description: item.description,
      })),
    };

    await axios.post(
      "http://localhost:5001/api/college",
      payload
    );

    navigate("/admin/college/list");
  };

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-600";

  const textareaClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-600 resize-none";

  const labelClass =
    "mb-1 block text-xs font-medium text-gray-600";

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-5">
      <div className="mx-auto max-w-4xl">

        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Add College
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Add college information and placement details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Basic Details */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-800">
              Basic Details
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

              <div>
                <label className={labelClass}>College Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="College name"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Engineering</option>
                  <option>MBA</option>
                  <option>Medical</option>
                  <option>Law</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>College Type</label>
                <select
                  name="collegeType"
                  value={form.collegeType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Government</option>
                  <option>Private</option>
                  <option>Autonomous</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Established Year</label>
                <input
                  name="establishedYear"
                  value={form.establishedYear}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="1995"
                />
              </div>

              <div>
                <label className={labelClass}>Rating</label>
                <input
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="4.5"
                />
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="2"
                  className={textareaClass}
                  placeholder="College description"
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  name="isTopCollege"
                  checked={form.isTopCollege}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label className="text-sm text-gray-700">
                  Mark as Top College
                </label>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-800">
              Media
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

              <div>
                <label className={labelClass}>Logo URL</label>
                <input
                  name="logo"
                  value={form.logo}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Logo URL"
                />
              </div>

              <div>
                <label className={labelClass}>Cover Image URL</label>
                <input
                  name="coverImage"
                  value={form.coverImage}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Cover image URL"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Images
                </label>
                <input
                  name="images"
                  value={form.images}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="URL 1, URL 2"
                />
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-800">
              Location & Contact
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

              <div>
                <label className={labelClass}>City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="City"
                />
              </div>

              <div>
                <label className={labelClass}>State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="State"
                />
              </div>

              <div>
                <label className={labelClass}>Country</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Country"
                />
              </div>

              <div>
                <label className={labelClass}>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Phone"
                />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Email"
                />
              </div>

              <div>
                <label className={labelClass}>Website</label>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Website"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Full address"
                />
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-800">
              Quick Highlights
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

              <div>
                <label className={labelClass}>
                  Faculty Strength
                </label>
                <input
                  name="facultyStrength"
                  value={form.facultyStrength}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="500+"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Campus Size
                </label>
                <input
                  name="campusSize"
                  value={form.campusSize}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="100 Acres"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Total Courses
                </label>
                <input
                  name="totalCourses"
                  value={form.totalCourses}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="50+"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Facilities
                </label>
                <input
                  name="facilities"
                  value={form.facilities}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Hostel, Library, Labs"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Accreditations
                </label>
                <input
                  name="accreditations"
                  value={form.accreditations}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="NAAC, NBA"
                />
              </div>
            </div>
          </div>

          {/* Course */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-800">
              Course & Fees
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

              <div>
                <label className={labelClass}>Course Name</label>
                <input
                  name="courseName"
                  value={form.courseName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="B.Tech"
                />
              </div>

              <div>
                <label className={labelClass}>Specialization</label>
                <input
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Computer Science"
                />
              </div>

              <div>
                <label className={labelClass}>Duration</label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="4 Years"
                />
              </div>

              <div>
                <label className={labelClass}>Fees</label>
                <input
                  name="fees"
                  value={form.fees}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="₹2,50,000"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Eligibility</label>
                <textarea
                  name="eligibility"
                  value={form.eligibility}
                  onChange={handleChange}
                  rows="2"
                  className={textareaClass}
                  placeholder="Eligibility criteria"
                />
              </div>
            </div>
          </div>

          {/* Admissions */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-800">
              Admissions
            </h2>

            <div className="space-y-3">

              <div>
                <label className={labelClass}>
                  Admission Details
                </label>
                <textarea
                  name="admissionDetails"
                  value={form.admissionDetails}
                  onChange={handleChange}
                  rows="2"
                  className={textareaClass}
                  placeholder="Admission details"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Entrance Exams
                </label>
                <input
                  name="entranceExams"
                  value={form.entranceExams}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="JEE Main, GUJCET"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Important Dates
                </label>
                <input
                  name="importantDates"
                  value={form.importantDates}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Application dates"
                />
              </div>
            </div>
          </div>

          {/* Placements */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">
                Placement Details
              </h2>

              <button
                type="button"
                onClick={addPlacement}
                className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
              >
                + Add Year
              </button>
            </div>

            <div className="space-y-3">
              {form.placements.map((placement, index) => (
                <div
                  key={index}
                  className="rounded-md border border-gray-200 p-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-gray-700">
                      Placement {index + 1}
                    </h3>

                    {form.placements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlacement(index)}
                        className="text-xs text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                    <div>
                      <label className={labelClass}>Year</label>
                      <input
                        name="year"
                        value={placement.year}
                        onChange={(e) =>
                          handlePlacementChange(index, e)
                        }
                        className={inputClass}
                        placeholder="2025"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Average Package
                      </label>
                      <input
                        name="averagePackage"
                        value={placement.averagePackage}
                        onChange={(e) =>
                          handlePlacementChange(index, e)
                        }
                        className={inputClass}
                        placeholder="₹8 LPA"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Highest Package
                      </label>
                      <input
                        name="highestPackage"
                        value={placement.highestPackage}
                        onChange={(e) =>
                          handlePlacementChange(index, e)
                        }
                        className={inputClass}
                        placeholder="₹25 LPA"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Median Package
                      </label>
                      <input
                        name="medianPackage"
                        value={placement.medianPackage}
                        onChange={(e) =>
                          handlePlacementChange(index, e)
                        }
                        className={inputClass}
                        placeholder="₹7 LPA"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Total Offers
                      </label>
                      <input
                        name="totalOffers"
                        value={placement.totalOffers}
                        onChange={(e) =>
                          handlePlacementChange(index, e)
                        }
                        className={inputClass}
                        placeholder="500"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Top Recruiters
                      </label>
                      <input
                        name="topRecruiters"
                        value={placement.topRecruiters}
                        onChange={(e) =>
                          handlePlacementChange(index, e)
                        }
                        className={inputClass}
                        placeholder="TCS, Infosys, Amazon"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className={labelClass}>
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={placement.description}
                        onChange={(e) =>
                          handlePlacementChange(index, e)
                        }
                        rows="2"
                        className={textareaClass}
                        placeholder="Placement description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pb-5">
            <button
              type="button"
              onClick={() => navigate("/admin/college/list")}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Add College
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCollege;

