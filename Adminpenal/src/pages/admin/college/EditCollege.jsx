import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditCollege = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

    admissionDetails: "",
    entranceExams: "",
    importantDates: "",

    rankings: [
      {
        rankingBody: "",
        year: "",
        rank: "",
        description: "",
      },
    ],

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

    courseName: "",
    specialization: "",
    duration: "",
    fees: "",
    eligibility: "",
  });

  useEffect(() => {
    axios
      .get(`/api/college/${id}`)
      .then((res) => {
        const college = res.data.college;

        setForm({
          name: college.name ,
          description: college.description,
          category: college.category || "Engineering",
          collegeType: college.collegeType || "Private",
          establishedYear: college.establishedYear ,
          status: college.status || "Active",
          isTopCollege: college.isTopCollege || false,

          logo: college.logo ,
          coverImage: college.coverImage,
          images: college.images?.join(", ") ,
          rating: college.rating ,
          accreditations: college.accreditations?.join(", ") ,

          city: college.location?.city ,
          state: college.location?.state ,
          country: college.location?.country || "India",
          address: college.address,
          website: college.website,
          email: college.email ,
          phone: college.phone ,

          facultyStrength: college.highlights?.facultyStrength ,
          campusSize: college.highlights?.campusSize ,
          totalCourses: college.highlights?.totalCourses ,
          facilities: college.facilities?.join(", "),

          admissionDetails:
            college.admissions?.admissionDetails,
          entranceExams:
            college.admissions?.entranceExams?.join(", ") ,
          importantDates:
            college.admissions?.importantDates,

          rankings:
            college.ranking?.length
              ? college.ranking.map((item) => ({
                  rankingBody: item.rankingBody ,
                  year: item.year ,
                  rank: item.rank ,
                  description: item.description ,
                }))
              : [
                  {
                    rankingBody: "",
                    year: "",
                    rank: "",
                    description: "",
                  },
                ],

          placements:
            college.placements?.length
              ? college.placements.map((item) => ({
                  year: item.year || "",
                  averagePackage: item.averagePackage,
                  highestPackage: item.highestPackage,
                  medianPackage: item.medianPackage,
                  totalOffers: item.totalOffers ,
                  topRecruiters:
                    item.topRecruiters?.join(", ") ,
                  description: item.description ,
                }))
              : [
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

          courseName: college.courses?.[0]?.courseName ,
          specialization: college.courses?.[0]?.specialization ,
          duration: college.courses?.[0]?.duration ,
          fees: college.courses?.[0]?.fees ,
          eligibility: college.courses?.[0]?.eligibility ,
        });
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value,
    });
  };

  const updateList = (list, index, field, value) => {
    const updated = [...form[list]];
    updated[index][field] = value;

    setForm({
      ...form,
      [list]: updated,
    });
  };

  const addList = (list, item) => {
    setForm({
      ...form,
      [list]: [...form[list], item],
    });
  };

  const removeList = (list, index) => {
    setForm({
      ...form,
      [list]: form[list].filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(`/api/college/${id}`, {
      name: form.name,
      description: form.description,
      category: form.category,
      collegeType: form.collegeType,
      establishedYear: form.establishedYear,
      status: form.status,
      isTopCollege: form.isTopCollege,

      logo: form.logo,
      coverImage: form.coverImage,
      images: form.images,
      rating: form.rating,
      accreditations: form.accreditations,

      location: {
        city: form.city,
        state: form.state,
        country: form.country,
      },

      address: form.address,
      website: form.website,
      email: form.email,
      phone: form.phone,

      highlights: {
        facultyStrength: form.facultyStrength,
        campusSize: form.campusSize,
        totalCourses: form.totalCourses,
      },

      facilities: form.facilities,

      admissions: {
        admissionDetails: form.admissionDetails,
        entranceExams: form.entranceExams,
        importantDates: form.importantDates,
      },

      ranking: form.rankings
        .filter(
          (item) =>
            item.rankingBody ||
            item.year ||
            item.rank ||
            item.description
        )
        .map((item) => ({
          rankingBody: item.rankingBody,
          year: item.year ? Number(item.year) : undefined,
          rank: item.rank ? Number(item.rank) : undefined,
          description: item.description,
        })),

      placements: form.placements
        .filter(
          (item) =>
            item.year ||
            item.averagePackage ||
            item.highestPackage ||
            item.medianPackage ||
            item.totalOffers ||
            item.topRecruiters ||
            item.description
        )
        .map((item) => ({
          year: item.year ? Number(item.year) : undefined,
          averagePackage: item.averagePackage,
          highestPackage: item.highestPackage,
          medianPackage: item.medianPackage,
          totalOffers: item.totalOffers
            ? Number(item.totalOffers)
            : undefined,
          topRecruiters: item.topRecruiters
            ? item.topRecruiters
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
          description: item.description,
        })),

      courses: [
        {
          courseName: form.courseName,
          specialization: form.specialization,
          duration: form.duration,
          fees: form.fees,
          eligibility: form.eligibility,
        },
      ],
    });

    navigate("/admin/college/list");
  };

  return (
    <div className="min-h-screen bg-surface px-4 py-8">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">Edit College</h1>

            <p className="mt-1 text-sm text-ink-muted">Update college details</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/college/list")}
            className="rounded-lg border bg-white px-5 py-2.5 text-sm font-semibold text-ink-muted">Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-ink">Basic Details</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">College Name</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">Category</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
                >
                  <option>Engineering</option>
                  <option>MBA</option>
                  <option>Medical</option>
                  <option>Law</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">College Type</label>

                <select
                  name="collegeType"
                  value={form.collegeType}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm">
                  <option>Government</option>
                  <option>Private</option>
                  <option>Autonomous</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">Established Year</label>
                <input
                  type="number"
                  name="establishedYear"
                  value={form.establishedYear}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isTopCollege"
                  checked={form.isTopCollege}
                  onChange={handleChange}
                />
                Show as Top College on Home Page
              </label>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold">Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
                />
              </div>

            </div>
          </div>

<div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-ink">Media</h2>

            <div className="grid gap-5 md:grid-cols-2">

              <input
                name="logo"
                placeholder="Logo URL"
                value={form.logo}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="coverImage"
                placeholder="Cover Image URL"
                value={form.coverImage}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="images"
                placeholder="Gallery Images"
                value={form.images}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="rating"
                type="number"
                placeholder="Rating"
                value={form.rating}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="accreditations"
                placeholder="Accreditations"
                value={form.accreditations}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm md:col-span-2"
              />

            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-ink">Location & Contact</h2>

            <div className="grid gap-5 md:grid-cols-3">
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <textarea
                name="address"
                placeholder="Full Address"
                value={form.address}
                onChange={handleChange}
                rows="2"
                className="rounded-lg border px-3.5 py-2.5 text-sm md:col-span-3"
              />

              <input
                name="website"
                placeholder="Website"
                value={form.website}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-ink">Quick Highlights</h2>

            <div className="grid gap-5 md:grid-cols-3">
              <input
                name="facultyStrength"
                placeholder="Faculty Strength"
                value={form.facultyStrength}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="campusSize"
                placeholder="Campus Size"
                value={form.campusSize}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="totalCourses"
                placeholder="Total Courses"
                value={form.totalCourses}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="facilities"
                placeholder="Facilities"
                value={form.facilities}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm md:col-span-3"
              />

            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-ink">Courses & Fees</h2>
            <div className="grid gap-5 md:grid-cols-2">

              <input
                name="courseName"
                placeholder="Course Name"
                value={form.courseName}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="specialization"
                placeholder="Specialization"
                value={form.specialization}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="duration"
                placeholder="Duration"
                value={form.duration}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="fees"
                placeholder="Fees"
                value={form.fees}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="eligibility"
                placeholder="Eligibility"
                value={form.eligibility}
                onChange={handleChange}
                className="rounded-lg border px-3.5 py-2.5 text-sm md:col-span-2"
              />

            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-ink">Admissions</h2>

            <div className="space-y-5">
              <textarea
                name="admissionDetails"
                placeholder="Admission Details"
                value={form.admissionDetails}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <input
                  name="entranceExams"
                  placeholder="Entrance Exams"
                  value={form.entranceExams}
                  onChange={handleChange}
                  className="rounded-lg border px-3.5 py-2.5 text-sm"
                />

                <input
                  name="importantDates"
                  placeholder="Important Dates"
                  value={form.importantDates}
                  onChange={handleChange}
                  className="rounded-lg border px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

<div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-ink">Ranking Details</h2>

            {form.rankings.map((ranking, index) => (
              <div
                key={index}
                className="mb-4 rounded-lg border p-4"
              >
                <div className="grid gap-4 md:grid-cols-2">

                  <input
                    placeholder="Ranking Body"
                    value={ranking.rankingBody}
                    onChange={(e) =>
                      updateList(
                        "rankings",
                        index,
                        "rankingBody",
                        e.target.value
                      )
                    }
                    className="rounded-lg border px-3.5 py-2.5 text-sm"
                  />

                  <input
                    type="number"
                    placeholder="Year"
                    value={ranking.year}
                    onChange={(e) =>
                      updateList(
                        "rankings",
                        index,
                        "year",
                        e.target.value
                      )
                    }
                    className="rounded-lg border px-3.5 py-2.5 text-sm"
                  />

                  <input
                    type="number"
                    placeholder="Rank"
                    value={ranking.rank}
                    onChange={(e) =>
                      updateList(
                        "rankings",
                        index,
                        "rank",
                        e.target.value
                      )
                    }
                    className="rounded-lg border px-3.5 py-2.5 text-sm"
                  />

                  <textarea
                    placeholder="Ranking Description"
                    value={ranking.description}
                    onChange={(e) =>
                      updateList(
                        "rankings",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows="2"
                    className="rounded-lg border px-3.5 py-2.5 text-sm"
                  />
                </div>

                {form.rankings.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeList("rankings", index)}
                    className="mt-2 text-xs text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                addList("rankings", {
                  rankingBody: "",
                  year: "",
                  rank: "",
                  description: "",
                })
              }
              className="rounded-lg border border-brand px-4 py-2 text-sm text-brand"
            >
               Add Ranking
            </button>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-ink">Placement Details
        </h2>

            {form.placements.map((placement, index) => (
              <div
                key={index}
                className="mb-4 rounded-lg border p-4"
              >
                <div className="grid gap-4 md:grid-cols-2">

                  <input
                    type="number"
                    placeholder="Placement Year"
                    value={placement.year}
                    onChange={(e) =>
                      updateList(
                        "placements",
                        index,
                        "year",
                        e.target.value
                      )
                    }
                    className="rounded-lg border px-3.5 py-2.5 text-sm"
                  />

                  <input
                    placeholder="Average Package"
                    value={placement.averagePackage}
                    onChange={(e) =>
                      updateList(
                        "placements",
                        index,
                        "averagePackage",
                        e.target.value
                      )
                    }
                    className="rounded-lg border px-3.5 py-2.5 text-sm"
                  />

                  <input
                    placeholder="Highest Package"
                    value={placement.highestPackage}
                    onChange={(e) =>
                      updateList(
                        "placements",
                        index,
                        "highestPackage",
                        e.target.value
                      )
                    }
                    className="rounded-lg border px-3.5 py-2.5 text-sm"
                  />

                  <input
                    placeholder="Median Package"
                    value={placement.medianPackage}
                    onChange={(e) =>
                      updateList(
                        "placements",
                        index,
                        "medianPackage",
                        e.target.value
                      )
                    }
                    className="rounded-lg border px-3.5 py-2.5 text-sm"
                  />

                  <input
                    type="number"
                    placeholder="Total Offers"
                    value={placement.totalOffers}
                    onChange={(e) =>
                      updateList(
                        "placements",
                        index,
                        "totalOffers",
                        e.target.value
                      )
                    }
                    className="rounded-lg border px-3.5 py-2.5 text-sm"
                  />

                  <input
                    placeholder="Top Recruiters"
                    value={placement.topRecruiters}
                    onChange={(e) =>
                      updateList(
                        "placements",
                        index,
                        "topRecruiters",
                        e.target.value
                      )
                    }
                    className="rounded-lg border px-3.5 py-2.5 text-sm md:col-span-2"
                  />

                  <textarea
                    placeholder="Placement Description"
                    value={placement.description}
                    onChange={(e) =>
                      updateList(
                        "placements",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows="3"
                    className="rounded-lg border px-3.5 py-2.5 text-sm md:col-span-2"
                  />

                </div>

                {form.placements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeList("placements", index)}
                    className="mt-2 text-xs text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                addList("placements", {
                  year: "",
                  averagePackage: "",
                  highestPackage: "",
                  medianPackage: "",
                  totalOffers: "",
                  topRecruiters: "",
                  description: "",
                })
              }
              className="rounded-lg border border-brand px-4 py-2 text-sm text-brand"
            >
              Add Placement
            </button>
          </div>

          <div className="flex justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate("/admin/college/list")}
              className="rounded-lg border bg-white px-5 py-2.5 text-sm font-semibold text-ink-muted"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white">
              Update College
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditCollege;
