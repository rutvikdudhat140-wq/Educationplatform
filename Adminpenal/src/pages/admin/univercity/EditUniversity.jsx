import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditUniversity = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    shortName: "",
    description: "",
    category: "Central University",
    universityType: "Public",
    establishedYear: "",
    status: "Active",

    logo: "",
    coverImage: "",
    officialWebsite: "",
    accreditation: "",
    recognition: "",

    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",

    campusArea: "",
    campusType: "Urban",
    numberOfDepartments: "",
    numberOfFaculties: "",
    numberOfStudents: "",
    numberOfPrograms: "",

    faculties: "",
    departments: "",
    programTypes: "",
    facilities: "",

    nirfRanking: "",
    nirfCategory: "",
    naacGrade: "",
    naacScore: "",

    email: "",
    phone: "",
    admissionEmail: "",
    admissionPhone: "",

    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  });

  useEffect(() => {
    const getUniversity = async () => {
      const response = await axios.get(`/api/university/${id}`);

      const university = response.data.data;

      setForm({
        name: university.name || "",
        shortName: university.shortName || "",
        description: university.description || "",
        category: university.category || "Central University",
        universityType: university.universityType || "Public",
        establishedYear: university.establishedYear || "",
        status: university.status || "Active",

        logo: university.logo || "",
        coverImage: university.coverImage || "",
        officialWebsite: university.officialWebsite || "",
        accreditation: university.accreditation || "",
        recognition: university.recognition || "",

        address: university.address || "",
        city: university.city || "",
        state: university.state || "",
        country: university.country || "India",
        pincode: university.pincode || "",

        campusArea: university.campusArea || "",
        campusType: university.campusType || "Urban",
        numberOfDepartments: university.numberOfDepartments || "",
        numberOfFaculties: university.numberOfFaculties || "",
        numberOfStudents: university.numberOfStudents || "",
        numberOfPrograms: university.numberOfPrograms || "",

        faculties: university.faculties || "",
        departments: university.departments || "",
        programTypes: university.programTypes || "",
        facilities: university.facilities || "",

        nirfRanking: university.nirfRanking || "",
        nirfCategory: university.nirfCategory || "",
        naacGrade: university.naacGrade || "",
        naacScore: university.naacScore || "",

        email: university.email || "",
        phone: university.phone || "",
        admissionEmail: university.admissionEmail || "",
        admissionPhone: university.admissionPhone || "",

      });
    };

    getUniversity();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(`/api/university/${id}`, form);

    navigate("/admin/univercity/list");
  };

  return (
    <div className="min-h-screen bg-surface px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">Edit University</h1>
            <p className="mt-1 text-sm text-ink-muted">Update university information</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/univercity/list")}
            className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink-muted">Back</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">Basic Details</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">University Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Short Name</label>
                <input
                  type="text"
                  name="shortName"
                  value={form.shortName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none">
                  <option value="Central University">Central University</option>
                  <option value="State University">State University</option>
                  <option value="Private University">Private University</option>
                  <option value="Deemed University">Deemed University</option>
                  <option value="Open University">Open University</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Univercity Type</label>

                <select
                  name="universityType"
                  value={form.universityType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none">
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Established Year</label>
                <input
                  type="number"
                  name="establishedYear"
                  value={form.establishedYear}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">Identity & Media</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="logo"
                value={form.logo}
                onChange={handleChange}
                placeholder="Logo URL"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="Cover Image URL"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                name="officialWebsite"
                value={form.officialWebsite}
                onChange={handleChange}
                placeholder="Official Website"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                name="accreditation"
                value={form.accreditation}
                onChange={handleChange}
                placeholder="Accreditation"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                name="recognition"
                value={form.recognition}
                onChange={handleChange}
                placeholder="Recognition"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none md:col-span-2"
              />

            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">Location & Contact</h2>
            <div className="grid gap-5 md:grid-cols-3">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full Address"
                rows="2"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none md:col-span-3"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                type="email"
                name="admissionEmail"
                value={form.admissionEmail}
                onChange={handleChange}
                placeholder="Admission Email"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                name="admissionPhone"
                value={form.admissionPhone}
                onChange={handleChange}
                placeholder="Admission Phone"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none md:col-span-2"
              />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">campus detlish</h2>

            <div className="grid gap-5 md:grid-cols-3">

              <input
                name="campusArea"
                value={form.campusArea}
                onChange={handleChange}
                placeholder="Campus Area"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <select
                name="campusType"
                value={form.campusType}
                onChange={handleChange}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none">
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
                <option value="Semi-Urban">Semi-Urban</option>
                <option value="Residential">Residential</option>
              </select>

              <input
                type="number"
                name="numberOfDepartments"
                value={form.numberOfDepartments}
                onChange={handleChange}
                placeholder="No. of Departments"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                type="number"
                name="numberOfFaculties"
                value={form.numberOfFaculties}
                onChange={handleChange}
                placeholder="No. of Faculties"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                type="number"
                name="numberOfStudents"
                value={form.numberOfStudents}
                onChange={handleChange}
                placeholder="No. of Students"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none" />
              <input
                type="number"
                name="numberOfPrograms"
                value={form.numberOfPrograms}
                onChange={handleChange}
                placeholder="No. of Programs"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">Academic & Facilities</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="faculties"
                value={form.faculties}
                onChange={handleChange}
                placeholder="Faculties"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none" />

              <input
                name="departments"
                value={form.departments}
                onChange={handleChange}
                placeholder="Departments"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none" />

              <input
                name="programTypes"
                value={form.programTypes}
                onChange={handleChange}
                placeholder="Program Types"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none" />

              <input
                name="facilities"
                value={form.facilities}
                onChange={handleChange}
                placeholder="Facilities"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">Ranking & Accreditions</h2>
            <div className="grid gap-5 md:grid-cols-4">

              <input
                type="number"
                name="nirfRanking"
                value={form.nirfRanking}
                onChange={handleChange}
                placeholder="NIRF Ranking"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                name="nirfCategory"
                value={form.nirfCategory}
                onChange={handleChange}
                placeholder="NIRF Category"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                name="naacGrade"
                value={form.naacGrade}
                onChange={handleChange}
                placeholder="NAAC Grade"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none"
              />

              <input
                type="number"
                step="0.01"
                name="naacScore"
                value={form.naacScore}
                onChange={handleChange}
                placeholder="NAAC Score"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate("/admin/univercity/list")}
              className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink-muted">Cancel</button>
            <button type="submit" className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white">Update University</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUniversity;
