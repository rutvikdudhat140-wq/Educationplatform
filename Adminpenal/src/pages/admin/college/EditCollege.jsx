import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditCollege = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Engineering',
    collegeType: 'Private',
    establishedYear: '',
    status: 'Active',
    isTopCollege: false,

    logo: '',
    coverImage: '',
    images: '',
    rating: '',

    accreditations: '',

    city: '',
    state: '',
    country: 'India',
    address: '',
    website: '',
    email: '',
    phone: '',

    facultyStrength: '',
    campusSize: '',
    totalCourses: '',
    facilities: '',

    admissionDetails: '',
    entranceExams: '',
    importantDates: '',

    rankings: [
      { rankingBody: '', year: '', rank: '', description: '' },
    ],
    placements: [
      { year: '', averagePackage: '', highestPackage: '', medianPackage: '', totalOffers: '', topRecruiters: '', description: '' },
    ],

    courseName: '',
    specialization: '',
    duration: '',
    fees: '',
    eligibility: '',
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/college/${id}`)
      .then((res) => {
        const college = res.data.college;

        setForm({
          name: college.name || '',
          description: college.description || '',
          category: college.category || 'Engineering',
          collegeType: college.collegeType || 'Private',
          establishedYear: college.establishedYear || '',
          status: college.status || 'Active',
          isTopCollege: college.isTopCollege || false,

          logo: college.logo || '',
          coverImage: college.coverImage || '',
          images: college.images?.join(', ') || '',
          rating: college.rating || '',

          accreditations: college.accreditations?.join(', ') || '',

          city: college.location?.city || '',
          state: college.location?.state || '',
          country: college.location?.country || 'India',
          address: college.address || '',
          website: college.website || '',
          email: college.email || '',
          phone: college.phone || '',

          facultyStrength: college.highlights?.facultyStrength || '',
          campusSize: college.highlights?.campusSize || '',
          totalCourses: college.highlights?.totalCourses || '',
          facilities: college.facilities?.join(', ') || '',

          admissionDetails: college.admissions?.admissionDetails || '',
          entranceExams: college.admissions?.entranceExams?.join(', ') || '',
          importantDates: college.admissions?.importantDates || '',

          rankings:
            Array.isArray(college.ranking) && college.ranking.length
              ? college.ranking.map((r) => ({
                  rankingBody: r.rankingBody || '',
                  year: r.year !== undefined && r.year !== null ? String(r.year) : '',
                  rank: r.rank !== undefined && r.rank !== null ? String(r.rank) : '',
                  description: r.description || '',
                }))
              : [{ rankingBody: '', year: '', rank: '', description: '' }],
          placements:
            Array.isArray(college.placements) && college.placements.length
              ? college.placements.map((p) => ({
                  year: p.year !== undefined && p.year !== null ? String(p.year) : '',
                  averagePackage: p.averagePackage || '',
                  highestPackage: p.highestPackage || '',
                  medianPackage: p.medianPackage || '',
                  totalOffers: p.totalOffers !== undefined && p.totalOffers !== null ? String(p.totalOffers) : '',
                  topRecruiters: Array.isArray(p.topRecruiters) ? p.topRecruiters.join(', ') : '',
                  description: p.description || '',
                }))
              : [{ year: '', averagePackage: '', highestPackage: '', medianPackage: '', totalOffers: '', topRecruiters: '', description: '' }],

          courseName: college.courses?.[0]?.courseName || '',
          specialization: college.courses?.[0]?.specialization || '',
          duration: college.courses?.[0]?.duration || '',
          fees: college.courses?.[0]?.fees || '',
          eligibility: college.courses?.[0]?.eligibility || '',
        });
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value,
    });
  };

  const handleRankingChange = (index, field, value) => {
    const updated = [...form.rankings];
    updated[index][field] = value;
    setForm({ ...form, rankings: updated });
  };

  const addRanking = () =>
    setForm({
      ...form,
      rankings: [...form.rankings, { rankingBody: '', year: '', rank: '', description: '' }],
    });

  const removeRanking = (index) => {
    const updated = form.rankings.filter((_, i) => i !== index);
    setForm({ ...form, rankings: updated });
  };

  const handlePlacementChange = (index, field, value) => {
    const updated = [...form.placements];
    updated[index][field] = value;
    setForm({ ...form, placements: updated });
  };

  const addPlacement = () =>
    setForm({
      ...form,
      placements: [...form.placements, { year: '', averagePackage: '', highestPackage: '', medianPackage: '', totalOffers: '', topRecruiters: '', description: '' }],
    });

  const removePlacement = (index) => {
    const updated = form.placements.filter((_, i) => i !== index);
    setForm({ ...form, placements: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5001/api/college/${id}`, {
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
          .filter((r) => r.rankingBody || r.year || r.rank || r.description)
          .map((r) => ({
            rankingBody: r.rankingBody,
            year: r.year ? Number(r.year) : undefined,
            rank: r.rank ? Number(r.rank) : undefined,
            description: r.description,
          })),
        placements: form.placements
          .filter(
            (p) =>
              p.year ||
              p.averagePackage ||
              p.highestPackage ||
              p.medianPackage ||
              p.totalOffers ||
              p.topRecruiters ||
              p.description
          )
          .map((p) => ({
            year: p.year ? Number(p.year) : undefined,
            averagePackage: p.averagePackage,
            highestPackage: p.highestPackage,
            medianPackage: p.medianPackage,
            totalOffers: p.totalOffers ? Number(p.totalOffers) : undefined,
            topRecruiters: p.topRecruiters
              ? p.topRecruiters
                  .split(',')
                  .map((r) => r.trim())
                  .filter(Boolean)
              : [],
            description: p.description,
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
      })
      .then(() => {
        navigate('/admin/college/list');
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Edit College
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update college details
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/college/list')}
            className="rounded-lg border bg-white px-5 py-2.5 text-sm font-semibold text-slate-600"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Details */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-slate-800">
              Basic Details
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  College Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Category
                </label>

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
                <label className="mb-1.5 block text-sm font-semibold">
                  College Type
                </label>

                <select
                  name="collegeType"
                  value={form.collegeType}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
                >
                  <option>Government</option>
                  <option>Private</option>
                  <option>Autonomous</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Established Year
                </label>

                <input
                  type="number"
                  name="establishedYear"
                  value={form.establishedYear}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    name="isTopCollege"
                    checked={form.isTopCollege}
                    onChange={handleChange}
                    className="size-4 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  Show as Top College on Home Page
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold">
                  Description
                </label>

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

          {/* Media */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-slate-800">
              Media
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <input
                name="logo"
                placeholder="Logo URL"
                value={form.logo}
                onChange={handleChange}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="coverImage"
                placeholder="Cover Image URL"
                value={form.coverImage}
                onChange={handleChange}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="images"
                placeholder="Gallery Images"
                value={form.images}
                onChange={handleChange}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="rating"
                type="number"
                placeholder="Rating"
                value={form.rating}
                onChange={handleChange}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm"
              />

              <input
                name="accreditations"
                placeholder="Accreditations"
                value={form.accreditations}
                onChange={handleChange}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm md:col-span-2"
              />

            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-slate-800">
              Location & Contact
            </h2>

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

          {/* Highlights */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-slate-800">
              Quick Highlights
            </h2>

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

          {/* Course */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-slate-800">
              Courses & Fees
            </h2>

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

          {/* Admissions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-slate-800">
              Admissions
            </h2>

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

           {/* Ranking Details */}
           <div className="rounded-2xl bg-white p-6 shadow-sm">
             <h2 className="mb-5 text-lg font-bold text-slate-800">
               Ranking Details
             </h2>

             {form.rankings.map((ranking, index) => (
               <div
                 key={index}
                 className="mb-4 rounded-lg border border-slate-200 p-4 last:mb-0"
               >
                 <div className="grid gap-4 md:grid-cols-2">
                   <div>
                     <label className="mb-1.5 block text-sm font-semibold">
                       Ranking Body
                     </label>

                     <input
                       name="rankingBody"
                       value={ranking.rankingBody}
                       onChange={(e) =>
                         handleRankingChange(
                           index,
                           'rankingBody',
                           e.target.value
                         )
                       }
                       placeholder="NIRF, India Today, ..."
                       className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                     />
                   </div>

                   <div>
                     <label className="mb-1.5 block text-sm font-semibold">
                       Year
                     </label>

                     <input
                       type="number"
                       name="year"
                       value={ranking.year}
                       onChange={(e) =>
                         handleRankingChange(
                           index,
                           'year',
                           e.target.value
                         )
                       }
                       placeholder="2026"
                       className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                     />
                   </div>

                   <div>
                     <label className="mb-1.5 block text-sm font-semibold">
                       Rank
                     </label>

                     <input
                       type="number"
                       name="rank"
                       value={ranking.rank}
                       onChange={(e) =>
                         handleRankingChange(
                           index,
                           'rank',
                           e.target.value
                         )
                       }
                       placeholder="9"
                       className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                     />
                   </div>

                   <div className="md:col-span-2">
                     <label className="mb-1.5 block text-sm font-semibold">
                       Ranking Description
                     </label>

                     <textarea
                       name="description"
                       value={ranking.description}
                       onChange={(e) =>
                         handleRankingChange(
                           index,
                           'description',
                           e.target.value
                         )
                       }
                       placeholder="Ranking description"
                       rows="2"
                       className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                     />
                   </div>
                 </div>

                 {form.rankings.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeRanking(index)}
                     className="mt-2 text-xs text-red-600"
                   >
                     Remove
                   </button>
                 )}
               </div>
             ))}

             <button
               type="button"
               onClick={addRanking}
               className="rounded-lg border border-[#0F766E] px-4 py-2 text-sm font-medium text-[#0F766E]"
             >
               + Add Ranking
             </button>
           </div>

           {/* Placement Details */}
           <div className="rounded-2xl bg-white p-6 shadow-sm">
             <h2 className="mb-5 text-lg font-bold text-slate-800">
               Placement Details
             </h2>

             {form.placements.map((placement, index) => (
               <div
                 key={index}
                 className="mb-4 rounded-lg border border-slate-200 p-4 last:mb-0"
               >
                 <div className="grid gap-4 md:grid-cols-2">
                   <div>
                     <label className="mb-1.5 block text-sm font-semibold">
                       Placement Year
                     </label>

                     <input
                       type="number"
                       name="year"
                       value={placement.year}
                       onChange={(e) =>
                         handlePlacementChange(
                           index,
                           'year',
                           e.target.value
                         )
                       }
                       placeholder="2025"
                       className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                     />
                   </div>

                   <div>
                     <label className="mb-1.5 block text-sm font-semibold">
                       Average Package
                     </label>

                     <input
                       name="averagePackage"
                       value={placement.averagePackage}
                       onChange={(e) =>
                         handlePlacementChange(
                           index,
                           'averagePackage',
                           e.target.value
                         )
                       }
                       placeholder="₹14 LPA"
                       className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                     />
                   </div>

                   <div>
                     <label className="mb-1.5 block text-sm font-semibold">
                       Highest Package
                     </label>

                     <input
                       name="highestPackage"
                       value={placement.highestPackage}
                       onChange={(e) =>
                         handlePlacementChange(
                           index,
                           'highestPackage',
                           e.target.value
                         )
                       }
                       placeholder="₹42 LPA"
                       className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                     />
                   </div>

                   <div>
                     <label className="mb-1.5 block text-sm font-semibold">
                       Median Package
                     </label>

                     <input
                       name="medianPackage"
                       value={placement.medianPackage}
                       onChange={(e) =>
                         handlePlacementChange(
                           index,
                           'medianPackage',
                           e.target.value
                         )
                       }
                       placeholder="₹12 LPA"
                       className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                     />
                   </div>

                   <div>
                     <label className="mb-1.5 block text-sm font-semibold">
                       Total Offers
                     </label>

                     <input
                       type="number"
                       name="totalOffers"
                       value={placement.totalOffers}
                       onChange={(e) =>
                         handlePlacementChange(
                           index,
                           'totalOffers',
                           e.target.value
                         )
                       }
                       placeholder="850"
                       className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                     />
                   </div>

                   <div className="md:col-span-2">
                     <label className="mb-1.5 block text-sm font-semibold">
                       Top Recruiters
                     </label>

                     <input
                       name="topRecruiters"
                       value={placement.topRecruiters}
                       onChange={(e) =>
                         handlePlacementChange(
                           index,
                           'topRecruiters',
                           e.target.value
                         )
                       }
                       placeholder="Google, Microsoft, Amazon"
                       className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                     />
                   </div>

                   <div className="md:col-span-2">
                     <label className="mb-1.5 block text-sm font-semibold">
                       Placement Description
                     </label>

                     <textarea
                       name="description"
                       value={placement.description}
                       onChange={(e) =>
                         handlePlacementChange(
                           index,
                           'description',
                           e.target.value
                         )
                       }
                       placeholder="Placement description"
                       rows="3"
                       className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                     />
                   </div>
                 </div>

                 {form.placements.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removePlacement(index)}
                     className="mt-2 text-xs text-red-600"
                   >
                     Remove
                   </button>
                 )}
               </div>
             ))}

             <button
               type="button"
               onClick={addPlacement}
               className="rounded-lg border border-[#0F766E] px-4 py-2 text-sm font-medium text-[#0F766E]"
             >
               + Add Placement
             </button>
           </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pb-8">

            <button
              type="button"
              onClick={() => navigate('/admin/college/list')}
              className="rounded-lg border bg-white px-5 py-2.5 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Update College
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditCollege;
