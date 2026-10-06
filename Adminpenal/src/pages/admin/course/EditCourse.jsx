import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

const STREAM_OPTIONS = [
  'Engineering',
  'Technology',
  'Management',
  'Science',
  'Commerce',
  'Arts',
  'Education',
  'Agriculture',
  'Design',
  'Pharmacy',
  'Medical',
  'Law',
  'Hotel Management',
  'Computer Applications',
];

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    fullName: '',
    stream: '',
    level: 'UG',
    duration: '',
    description: '',
    eligibilityCriteria: '',
    entranceExams: '',
    careerOptions: '',
    fees: '',
    collegeCount: '',
    image: '',
    isPopular: false,
    status: 'Active',
  });

  useEffect(() => {
    const getCourse = async () => {
      const response = await axios.get(`/api/course/id/${id}`);

      const course = response.data.data || response.data.course || {};

      setForm({
        name: course.name || '',
        fullName: course.fullName || '',
        stream: course.stream || '',
        level: course.level || 'UG',
        duration: course.duration || '',
        description: course.description || '',
        eligibilityCriteria: course.eligibilityCriteria?.join(', ') || '',
        entranceExams: course.entranceExams?.join(', ') || '',
        careerOptions: course.careerOptions?.join(', ') || '',
        fees: course.fees || '',
        collegeCount: course.collegeCount || '',
        image: course.image || '',
        isPopular: course.isPopular || false,
        status: course.status || 'Active',
      });
    };

    getCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`/api/course/${id}`, {
        name: form.name,
        fullName: form.fullName,
        stream: form.stream,
        level: form.level,
        duration: form.duration,
        description: form.description,
        eligibilityCriteria: form.eligibilityCriteria,
        entranceExams: form.entranceExams,
        careerOptions: form.careerOptions,
        fees: Number(form.fees),
        collegeCount: Number(form.collegeCount),
        image: form.image,
        isPopular: form.isPopular,
        isActive: form.status === 'Active',
        status: form.status,
      })
      .then(() => {
        navigate('/admin/course/list');
      });
  };

  return (
    <div className="min-h-screen bg-surface px-4 py-8">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">
              Edit Course
            </h1>

            <p className="mt-1 text-sm text-ink-muted">
              Update course information
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/course/list')}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-ink-muted"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">
              Basic Details
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Course Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Course Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Stream
                </label>

                <select
                  name="stream"
                  value={form.stream}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                >
                  <option value="">Select stream</option>

                  {STREAM_OPTIONS.map((stream) => (
                    <option key={stream} value={stream}>
                      {stream}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Level
                </label>

                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                >
                  <option value="UG">UG</option>
                  <option value="PG">PG</option>
                  <option value="Diploma">Diploma</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Duration
                </label>

                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                >
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
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                />
              </div>

            </div>
          </div>

          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">Fees & Colleges</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium"> Fees</label>
                <input
                  type="number"
                  name="fees"
                  value={form.fees}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-600"/>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">College Count</label>
                <input
                  type="number"
                  name="collegeCount"
                  value={form.collegeCount}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                />
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">Eligibility & Exams</h2>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Eligibility Criteria</label>

                <input
                  name="eligibilityCriteria"
                  value={form.eligibilityCriteria}
                  onChange={handleChange}
                  placeholder="12th Science, Minimum 50% marks"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Entrance Exams</label>

                <input
                  name="entranceExams"
                  value={form.entranceExams}
                  onChange={handleChange}
                  placeholder="JEE Main, JEE Advanced"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Career Options</label>

                <input
                  name="careerOptions"
                  value={form.careerOptions}
                  onChange={handleChange}
                  placeholder="Software Engineer, Developer"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                />
              </div>

            </div>
          </div>

          {/* Image */}
          {/* <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">
              Image
            </h2>

            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-600"
            />
          </div> */}

          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">Visibility
            </h2>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isPopular"
                checked={form.isPopular}
                onChange={handleChange}
                className="h-4 w-4"
              />

              <span className="text-sm font-medium">
                Show as Popular Course
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate('/admin/course/list')}
              className="rounded-lg border bg-white px-5 py-2.5 text-sm font-medium text-slate-60">Cancle </button>

            <button
              type="submit"
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white">Update Course</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
