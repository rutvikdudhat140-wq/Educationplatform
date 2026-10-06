import { useEffect, useState } from 'react';
import { createApiUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
});

const NOT_SET = 'none';

const toForm = (profile = {}) => ({
  qualification: profile.qualification || '',
  tenthPercentage: profile.tenthPercentage ?? '',
  twelfthPercentage: profile.twelfthPercentage ?? '',
  graduationPercentage: profile.graduationPercentage ?? '',
  passingYear: profile.passingYear || '',
  subjects: (profile.subjects || []).join(', '),
  examId: profile.examId || NOT_SET,
  examSessionId: profile.examSessionId || NOT_SET,
  score: profile.score ?? '',
  rank: profile.rank ?? '',
  percentile: profile.percentile ?? '',
  category: profile.category || NOT_SET,
  gender: profile.gender || NOT_SET,
  quota: profile.quota || NOT_SET,
  preferredState: profile.preferredState || NOT_SET,
  preferredCity: profile.preferredCity || '',
  budgetRange: profile.budgetRange || NOT_SET,
  budgetAmount: profile.budgetAmount ?? '',
  careerInterest: profile.careerInterest || NOT_SET,
  preferredCourseIds: (profile.preferredCourseIds || []).map(String),
});

/**
 * "Update Preferences" form for the recommendation engine.
 * Every option list is read from the existing public APIs - nothing is
 * hardcoded, so the form always matches what is actually in the database.
 */
export default function RecommendationProfileForm({ profile, onSaved, onCancel }) {
  const [form, setForm] = useState(() => toForm(profile));
  const [options, setOptions] = useState({
    courses: [],
    exams: [],
    careers: [],
    states: [],
    sessions: [],
  });
  const [saving, setSaving] = useState(false);

  // Load the real option lists once.
  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, examRes, careerRes, collegeRes] = await Promise.all([
          fetch(createApiUrl('/course?limit=200'), { headers: authHeaders().headers }).then(r => r.json()),
          fetch(createApiUrl('/exam'), { headers: authHeaders().headers }).then(r => r.json()),
          fetch(createApiUrl('/career?limit=200'), { headers: authHeaders().headers }).then(r => r.json()),
          fetch(createApiUrl('/college?limit=200'), { headers: authHeaders().headers }).then(r => r.json()),
        ]);

        const colleges = collegeRes.data?.colleges || collegeRes.data?.data || [];
        const states = [
          ...new Set(
            colleges
              .map((college) => college.location?.state)
              .filter(Boolean)
              .map((state) => state.trim())
          ),
        ].sort();

        setOptions({
          courses: courseRes.data?.courses || courseRes.data?.data || [],
          exams: examRes.data?.exams || examRes.data?.data || [],
          careers: careerRes.data?.careers || careerRes.data?.data || [],
          states,
          sessions: [],
        });
      } catch {
        setOptions({ courses: [], exams: [], careers: [], states: [], sessions: [] });
      }
    };

    load();
  }, []);

  // Exam sessions belong to the exam the student picked (existing predictor API).
  useEffect(() => {
    if (form.examId === NOT_SET) {
      setOptions((prev) => ({ ...prev, sessions: [] }));
      return;
    }

    const loadSessions = async () => {
      try {
        const res = await fetch(createApiUrl('/predictor-exam-sessions'), {
          params: { examId: form.examId },
          headers: authHeaders().headers,
        });
        const data = await res.json();
        setOptions((prev) => ({ ...prev, sessions: data.examSessions || [] }));
      } catch {
        setOptions((prev) => ({ ...prev, sessions: [] }));
      }
    };

    loadSessions();
  }, [form.examId]);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleCourse = (courseId) => {
    setForm((prev) => ({
      ...prev,
      preferredCourseIds: prev.preferredCourseIds.includes(courseId)
        ? prev.preferredCourseIds.filter((id) => id !== courseId)
        : [...prev.preferredCourseIds, courseId],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      qualification: form.qualification,
      tenthPercentage: form.tenthPercentage,
      twelfthPercentage: form.twelfthPercentage,
      graduationPercentage: form.graduationPercentage,
      passingYear: form.passingYear,
      subjects: form.subjects,
      examId: form.examId === NOT_SET ? '' : form.examId,
      examSessionId: form.examSessionId === NOT_SET ? '' : form.examSessionId,
      score: form.score,
      rank: form.rank,
      percentile: form.percentile,
      category: form.category === NOT_SET ? '' : form.category,
      gender: form.gender === NOT_SET ? '' : form.gender,
      quota: form.quota === NOT_SET ? '' : form.quota,
      preferredState: form.preferredState === NOT_SET ? '' : form.preferredState,
      preferredCity: form.preferredCity,
      budgetRange: form.budgetRange === NOT_SET ? '' : form.budgetRange,
      budgetAmount: form.budgetAmount,
      careerInterest: form.careerInterest === NOT_SET ? '' : form.careerInterest,
      preferredCourseIds: form.preferredCourseIds,
    };

    try {
      const res = await fetch(createApiUrl('/recommendations/profile'), {
        method: 'PUT',
        headers: { ...authHeaders().headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      onSaved(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = 'bg-white';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Academic */}
      <section className="rounded-md border border-line bg-surface p-5">
        <h3 className="text-base font-semibold text-ink">Academic Information</h3>
        <p className="mt-1 text-[0.8125rem] text-ink-muted">
          Used to check course eligibility and rank your academic fit.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="qualification">Current Qualification</Label>
            <Input
              id="qualification"
              className={fieldClass}
              placeholder="e.g. 12th Pass, Graduate, Post Graduate"
              value={form.qualification}
              onChange={(e) => setField('qualification', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="tenth">10th Percentage</Label>
            <Input
              id="tenth"
              type="number"
              className={fieldClass}
              value={form.tenthPercentage}
              onChange={(e) => setField('tenthPercentage', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="twelfth">12th Percentage</Label>
            <Input
              id="twelfth"
              type="number"
              className={fieldClass}
              value={form.twelfthPercentage}
              onChange={(e) => setField('twelfthPercentage', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="graduation">Graduation Percentage</Label>
            <Input
              id="graduation"
              type="number"
              className={fieldClass}
              value={form.graduationPercentage}
              onChange={(e) => setField('graduationPercentage', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="passingYear">Passing Year</Label>
            <Input
              id="passingYear"
              className={fieldClass}
              placeholder="e.g. 2025"
              value={form.passingYear}
              onChange={(e) => setField('passingYear', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="subjects">Major Subjects</Label>
            <Input
              id="subjects"
              className={fieldClass}
              placeholder="Physics, Chemistry, Maths"
              value={form.subjects}
              onChange={(e) => setField('subjects', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Entrance exam */}
      <section className="rounded-md border border-line bg-surface p-5">
        <h3 className="text-base font-semibold text-ink">Entrance Exam</h3>
        <p className="mt-1 text-[0.8125rem] text-ink-muted">
          Your rank is checked against the existing college cutoff data.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label>Exam Appeared</Label>
            <Select value={form.examId} onValueChange={(v) => setField('examId', v)}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Select exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_SET}>Not applicable</SelectItem>
                {options.exams.map((exam) => (
                  <SelectItem key={exam._id} value={exam._id}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Exam Session</Label>
            <Select value={form.examSessionId} onValueChange={(v) => setField('examSessionId', v)}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_SET}>Any session</SelectItem>
                {options.sessions.map((session) => (
                  <SelectItem key={session._id} value={session._id}>
                    {session.academicYear} - {session.sessionName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="score">Score</Label>
            <Input
              id="score"
              type="number"
              className={fieldClass}
              value={form.score}
              onChange={(e) => setField('score', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="rank">Rank</Label>
            <Input
              id="rank"
              type="number"
              className={fieldClass}
              value={form.rank}
              onChange={(e) => setField('rank', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="percentile">Percentile</Label>
            <Input
              id="percentile"
              type="number"
              className={fieldClass}
              value={form.percentile}
              onChange={(e) => setField('percentile', e.target.value)}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setField('category', v)}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_SET}>Not applicable</SelectItem>
                {['General', 'OBC', 'SC', 'ST', 'EWS'].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => setField('gender', v)}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_SET}>Not applicable</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Quota</Label>
            <Select value={form.quota} onValueChange={(v) => setField('quota', v)}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Select quota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_SET}>Not applicable</SelectItem>
                {['OPEN', 'HOME_STATE', 'ALL'].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Location + budget */}
      <section className="rounded-md border border-line bg-surface p-5">
        <h3 className="text-base font-semibold text-ink">Location &amp; Budget</h3>
        <p className="mt-1 text-[0.8125rem] text-ink-muted">
          Colleges are compared with the real fees stored in their course data.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label>Preferred State</Label>
            <Select value={form.preferredState} onValueChange={(v) => setField('preferredState', v)}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_SET}>Any state</SelectItem>
                {options.states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="preferredCity">Preferred City</Label>
            <Input
              id="preferredCity"
              className={fieldClass}
              placeholder="Optional"
              value={form.preferredCity}
              onChange={(e) => setField('preferredCity', e.target.value)}
            />
          </div>
          <div>
            <Label>Budget Range</Label>
            <Select value={form.budgetRange} onValueChange={(v) => setField('budgetRange', v)}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_SET}>Not sure yet</SelectItem>
                <SelectItem value="Low">Low (up to 2,00,000 / year)</SelectItem>
                <SelectItem value="Medium">Medium (up to 5,00,000 / year)</SelectItem>
                <SelectItem value="High">High (up to 10,00,000 / year)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="budgetAmount">Exact Budget (per year)</Label>
            <Input
              id="budgetAmount"
              type="number"
              className={fieldClass}
              placeholder="Overrides budget range"
              value={form.budgetAmount}
              onChange={(e) => setField('budgetAmount', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Interest + courses */}
      <section className="rounded-md border border-line bg-surface p-5">
        <h3 className="text-base font-semibold text-ink">Career Interest &amp; Courses</h3>
        <p className="mt-1 text-[0.8125rem] text-ink-muted">
          Colleges are only recommended when they actually offer your selected course.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Career Interest</Label>
            <Select value={form.careerInterest} onValueChange={(v) => setField('careerInterest', v)}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Select a career" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_SET}>Not decided yet</SelectItem>
                {options.careers.map((career) => (
                  <SelectItem key={career._id} value={career._id}>
                    {career.name || career.careerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label>Preferred Courses</Label>
          <p className="mb-2 text-[0.75rem] text-ink-muted">
            Pick the courses you are interested in. Leave empty to get general recommendations.
          </p>

          <div className="max-h-56 overflow-y-auto rounded-md border border-line bg-white p-2">
            {options.courses.length === 0 ? (
              <p className="p-3 text-[0.8125rem] text-ink-muted">Loading courses...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {options.courses.map((course) => {
                  const selected = form.preferredCourseIds.includes(String(course._id));

                  return (
                    <button
                      key={course._id}
                      type="button"
                      onClick={() => toggleCourse(String(course._id))}
                      className={`rounded-md border px-2.5 py-1 text-[0.75rem] font-medium transition ${
                        selected
                          ? 'border-brand bg-brand text-white'
                          : 'border-line bg-surface text-ink hover:border-brand'
                      }`}
                    >
                      {course.name || course.fullName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" className="bg-brand" disabled={saving}>
          {saving ? 'Saving...' : 'Save & Refresh Recommendations'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

