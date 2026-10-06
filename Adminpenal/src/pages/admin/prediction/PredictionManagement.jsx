import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const emptyCutoff = {
  examId: "",
  examSessionId: "",
  collegeId: "",
  courseId: "",
  category: "OPEN",
  gender: "ALL",
  quota: "HOME_STATE",
  round: 1,
  year: new Date().getFullYear(),
  openingRank: "",
  closingRank: "",
};

const emptyRule = {
  examId: "",
  examSessionId: "",
  predictionMethod: "percentile",
  category: "ALL",
  inputFrom: "",
  inputTo: "",
  expectedRankFrom: "",
  expectedRankTo: "",
};

const inputCls = "rounded-md border px-2 py-1.5 text-xs";

export default function PredictionManagement() {
  const [exams, setExams] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [ruleSessions, setRuleSessions] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  const [cutoffs, setCutoffs] = useState([]);
  const [rules, setRules] = useState([]);

  const [cutoff, setCutoff] = useState(emptyCutoff);
  const [rule, setRule] = useState(emptyRule);

  const [activeSection, setActiveSection] = useState("cutoff");

  const [editingCutoffId, setEditingCutoffId] = useState("");
  const [editingRuleId, setEditingRuleId] = useState("");

  const [showCutoffForm, setShowCutoffForm] = useState(false);
  const [showRuleForm, setShowRuleForm] = useState(false);

  const adminToken = localStorage.getItem("adminToken");

  const headers = {
    Authorization: `Bearer ${adminToken}`,
  };

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/exam")
      .then((res) => setExams(res.data.exams || []));

    axios
      .get("http://localhost:5001/api/college")
      .then((res) => setColleges(res.data.colleges || []));

    axios
      .get("http://localhost:5001/api/course")
      .then((res) => setCourses(res.data.courses || []));

    loadCutoffs();
    loadRules();
  }, []);

  useEffect(() => {
    if (cutoff.examId) {
      axios
        .get(
          `http://localhost:5001/api/exam-session?exam=${cutoff.examId}`,
          { headers }
        )
        .then((res) => {
          setSessions(res.data.examSessions || []);
        });
    } else {
      setSessions([]);
    }
  }, [cutoff.examId]);

  useEffect(() => {
    if (rule.examId) {
      axios
        .get(
          `http://localhost:5001/api/exam-session?exam=${rule.examId}`,
          { headers }
        )
        .then((res) => {
          setRuleSessions(res.data.examSessions || []);
        });
    } else {
      setRuleSessions([]);
    }
  }, [rule.examId]);

  const loadCutoffs = () => {
    axios
      .get("http://localhost:5001/api/admin/cutoffs", { headers })
      .then((res) => {
        setCutoffs(res.data.cutoffs || []);
      });
  };

  const loadRules = () => {
    axios
      .get("http://localhost:5001/api/admin/rank-prediction-rules", {
        headers,
      })
      .then((res) => {
        setRules(res.data.rules || []);
      });
  };

  // Get Exam Name
  const getExamName = (id) => {
    const examId = id?._id || id;

    const exam = exams.find((item) => item._id === examId);

    return exam?.name || "";
  };

  // Get College Name
  const getCollegeName = (id) => {
    const collegeId = id?._id || id;

    const college = colleges.find((item) => item._id === collegeId);

    return college?.name || "";
  };

  // Get Course Name
  const getCourseName = (id) => {
    const courseId = id?._id || id;

    const course = courses.find((item) => item._id === courseId);

    return course?.name || course?.fullName || "";
  };

  // Get Session Name
  const getSessionName = (id, sessionList = []) => {
    const sessionId = id?._id || id;

    const session = sessionList.find(
      (item) => item._id === sessionId
    );

    if (!session) {
      return "";
    }

    return `${session.academicYear || ""} ${
      session.sessionName || ""
    }`;
  };

  const changeCutoff = (e) => {
    setCutoff({
      ...cutoff,
      [e.target.name]: e.target.value,
    });
  };

  const changeRule = (e) => {
    setRule({
      ...rule,
      [e.target.name]: e.target.value,
    });
  };

  const resetCutoff = () => {
    setCutoff(emptyCutoff);
    setEditingCutoffId("");
    setShowCutoffForm(false);
  };

  const resetRule = () => {
    setRule(emptyRule);
    setEditingRuleId("");
    setShowRuleForm(false);
  };

  const addCutoff = () => {
    resetRule();

    setActiveSection("cutoff");
    setCutoff(emptyCutoff);
    setShowCutoffForm(true);
  };

  const addRule = () => {
    resetCutoff();

    setActiveSection("rank");
    setRule(emptyRule);
    setShowRuleForm(true);
  };

  const saveCutoff = async (e) => {
    e.preventDefault();

    const data = {
      ...cutoff,
      round: Number(cutoff.round),
      year: Number(cutoff.year),
      openingRank: Number(cutoff.openingRank),
      closingRank: Number(cutoff.closingRank),
      category: cutoff.category.toUpperCase(),
      gender: cutoff.gender.toUpperCase(),
      quota: cutoff.quota.toUpperCase(),
    };

    if (editingCutoffId) {
      await axios.put(
        `http://localhost:5001/api/admin/cutoffs/${editingCutoffId}`,
        data,
        { headers }
      );
    } else {
      await axios.post(
        "http://localhost:5001/api/admin/cutoffs",
        data,
        { headers }
      );
    }

    loadCutoffs();
    resetCutoff();
  };

  const saveRule = async (e) => {
    e.preventDefault();

    const data = {
      ...rule,
      inputFrom: Number(rule.inputFrom),
      inputTo: Number(rule.inputTo),
      expectedRankFrom: Number(rule.expectedRankFrom),
      expectedRankTo: Number(rule.expectedRankTo),
      category: rule.category.toUpperCase(),
    };

    if (editingRuleId) {
      await axios.put(
        `http://localhost:5001/api/admin/rank-prediction-rules/${editingRuleId}`,
        data,
        { headers }
      );
    } else {
      await axios.post(
        "http://localhost:5001/api/admin/rank-prediction-rules",
        data,
        { headers }
      );
    }

    loadRules();
    resetRule();
  };

  const editCutoff = (item) => {
    setActiveSection("cutoff");
    setEditingCutoffId(item._id);

    setCutoff({
      examId: item.examId?._id || item.examId,
      examSessionId:
        item.examSessionId?._id || item.examSessionId,
      collegeId: item.collegeId?._id || item.collegeId,
      courseId: item.courseId?._id || item.courseId,
      category: item.category,
      gender: item.gender,
      quota: item.quota,
      round: item.round,
      year: item.year,
      openingRank: item.openingRank,
      closingRank: item.closingRank,
    });

    setShowCutoffForm(true);
  };

  const editRule = (item) => {
    setActiveSection("rank");
    setEditingRuleId(item._id);

    setRule({
      examId: item.examId?._id || item.examId,
      examSessionId:
        item.examSessionId?._id || item.examSessionId,
      predictionMethod: item.predictionMethod,
      category: item.category || "ALL",
      inputFrom: item.inputFrom,
      inputTo: item.inputTo,
      expectedRankFrom: item.expectedRankFrom,
      expectedRankTo: item.expectedRankTo,
    });

    setShowRuleForm(true);
  };

  const removeCutoff = async (id) => {
    await axios.delete(
      `http://localhost:5001/api/admin/cutoffs/${id}`,
      { headers }
    );

    setCutoffs(
      cutoffs.filter((item) => item._id !== id)
    );
  };

  const removeRule = async (id) => {
    await axios.delete(
      `http://localhost:5001/api/admin/rank-prediction-rules/${id}`,
      { headers }
    );

    setRules(
      rules.filter((item) => item._id !== id)
    );
  };

  return (
    <div className="space-y-6 text-sm">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Cutoffs & Predictors
          </h2>

          <p className="text-xs text-muted-foreground">
            Manage historical cutoffs and rank prediction rules.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={
              activeSection === "cutoff"
                ? "default"
                : "outline"
            }
            onClick={addCutoff}
          >
            Add Cutoff
          </Button>

          <Button
            size="sm"
            variant={
              activeSection === "rank"
                ? "default"
                : "outline"
            }
            onClick={addRule}
          >
            Add Rank
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b text-xs">
        <button
          type="button"
          onClick={() => setActiveSection("cutoff")}
          className={`px-3 py-2 ${
            activeSection === "cutoff"
              ? "border-b-2 border-black font-semibold"
              : "text-muted-foreground"
          }`}
        >
          Cutoffs
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("rank")}
          className={`px-3 py-2 ${
            activeSection === "rank"
              ? "border-b-2 border-black font-semibold"
              : "text-muted-foreground"
          }`}
        >
          Rank Predictors
        </button>
      </div>

      {/* ================= CUT OFF ================= */}

      {activeSection === "cutoff" && (
        <>
          {showCutoffForm && (
            <form
              onSubmit={saveCutoff}
              className="space-y-3 rounded-lg border bg-white p-4 shadow-sm"
            >
              <h3 className="text-sm font-semibold">
                {editingCutoffId
                  ? "Edit Cutoff"
                  : "Add Cutoff"}
              </h3>

              <div className="grid gap-2 md:grid-cols-5">

                {/* Exam */}
                <select
                  name="examId"
                  value={cutoff.examId}
                  onChange={changeCutoff}
                  className={inputCls}
                >
                  <option value="">
                    Select exam
                  </option>

                  {exams.map((exam) => (
                    <option
                      key={exam._id}
                      value={exam._id}
                    >
                      {exam.name}
                    </option>
                  ))}
                </select>

                {/* Session */}
                <select
                  name="examSessionId"
                  value={cutoff.examSessionId}
                  onChange={changeCutoff}
                  className={inputCls}
                >
                  <option value="">
                    Select session
                  </option>

                  {sessions.map((session) => (
                    <option
                      key={session._id}
                      value={session._id}
                    >
                      {session.academicYear} -{" "}
                      {session.sessionName}
                    </option>
                  ))}
                </select>

                {/* College */}
                <select
                  name="collegeId"
                  value={cutoff.collegeId}
                  onChange={changeCutoff}
                  className={inputCls}
                >
                  <option value="">
                    Select college
                  </option>

                  {colleges.map((college) => (
                    <option
                      key={college._id}
                      value={college._id}
                    >
                      {college.name}
                    </option>
                  ))}
                </select>

                {/* Course */}
                <select
                  name="courseId"
                  value={cutoff.courseId}
                  onChange={changeCutoff}
                  className={inputCls}
                >
                  <option value="">
                    Select course
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course._id}
                      value={course._id}
                    >
                      {course.name || course.fullName}
                    </option>
                  ))}
                </select>

                {/* Category */}
                <input
                  name="category"
                  value={cutoff.category}
                  onChange={changeCutoff}
                  placeholder="Category"
                  className={inputCls}
                />

                {/* Gender */}
                <input
                  name="gender"
                  value={cutoff.gender}
                  onChange={changeCutoff}
                  placeholder="Gender"
                  className={inputCls}
                />

                {/* Quota */}
                <input
                  name="quota"
                  value={cutoff.quota}
                  onChange={changeCutoff}
                  placeholder="Quota"
                  className={inputCls}
                />

                {/* Round */}
                <input
                  name="round"
                  type="number"
                  value={cutoff.round}
                  onChange={changeCutoff}
                  placeholder="Round"
                  className={inputCls}
                />

                {/* Year */}
                <input
                  name="year"
                  type="number"
                  value={cutoff.year}
                  onChange={changeCutoff}
                  placeholder="Year"
                  className={inputCls}
                />

                {/* Opening Rank */}
                <input
                  name="openingRank"
                  type="number"
                  value={cutoff.openingRank}
                  onChange={changeCutoff}
                  placeholder="Opening rank"
                  className={inputCls}
                />

                {/* Closing Rank */}
                <input
                  name="closingRank"
                  type="number"
                  value={cutoff.closingRank}
                  onChange={changeCutoff}
                  placeholder="Closing rank"
                  className={inputCls}
                />
              </div>

              <div className="flex gap-2">
                <Button size="sm" type="submit">
                  {editingCutoffId
                    ? "Update"
                    : "Save"}
                </Button>

                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={resetCutoff}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Cutoff Table */}
          <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
            <table className="w-full min-w-[1000px] text-left text-xs">

              <thead>
                <tr className="border-b bg-muted/30">

                  <th className="px-3 py-2">
                    Exam
                  </th>

                  <th>
                    College
                  </th>

                  <th>
                    Course
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Gender
                  </th>

                  <th>
                    Quota
                  </th>

                  <th>
                    Year
                  </th>

                  <th>
                    Round
                  </th>

                  <th>
                    Opening
                  </th>

                  <th>
                    Closing
                  </th>

                  <th className="px-3">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {cutoffs.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b last:border-0"
                  >

                    {/* Exam */}
                    <td className="px-3 py-2">
                      {getExamName(item.examId)}
                    </td>

                    {/* College */}
                    <td>
                      {getCollegeName(item.collegeId)}
                    </td>

                    {/* Course */}
                    <td>
                      {getCourseName(item.courseId)}
                    </td>

                    {/* Category */}
                    <td>
                      {item.category}
                    </td>

                    {/* Gender */}
                    <td>
                      {item.gender}
                    </td>

                    {/* Quota */}
                    <td>
                      {item.quota}
                    </td>

                    {/* Year */}
                    <td>
                      {item.year}
                    </td>

                    {/* Round */}
                    <td>
                      {item.round}
                    </td>

                    {/* Opening */}
                    <td>
                      {item.openingRank}
                    </td>

                    {/* Closing */}
                    <td>
                      {item.closingRank}
                    </td>

                    {/* Actions */}
                    <td className="px-3">
                      <div className="flex gap-1">

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            editCutoff(item)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            removeCutoff(item._id)
                          }
                        >
                          Delete
                        </Button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ================= RANK PREDICTOR ================= */}

      {activeSection === "rank" && (
        <>
          {showRuleForm && (
            <form
              onSubmit={saveRule}
              className="space-y-3 rounded-lg border bg-white p-4 shadow-sm"
            >
              <h3 className="text-sm font-semibold">
                {editingRuleId
                  ? "Edit Rank Prediction Rule"
                  : "Add Rank Prediction Rule"}
              </h3>

              <div className="grid gap-2 md:grid-cols-4">

                {/* Exam */}
                <select
                  name="examId"
                  value={rule.examId}
                  onChange={changeRule}
                  className={inputCls}
                >
                  <option value="">
                    Select exam
                  </option>

                  {exams.map((exam) => (
                    <option
                      key={exam._id}
                      value={exam._id}
                    >
                      {exam.name}
                    </option>
                  ))}
                </select>

                {/* Session */}
                <select
                  name="examSessionId"
                  value={rule.examSessionId}
                  onChange={changeRule}
                  className={inputCls}
                >
                  <option value="">
                    Select session
                  </option>

                  {ruleSessions.map((session) => (
                    <option
                      key={session._id}
                      value={session._id}
                    >
                      {session.academicYear} -{" "}
                      {session.sessionName}
                    </option>
                  ))}
                </select>

                {/* Prediction Method */}
                <select
                  name="predictionMethod"
                  value={rule.predictionMethod}
                  onChange={changeRule}
                  className={inputCls}
                >
                  <option value="percentile">
                    Percentile
                  </option>

                  <option value="marks">
                    Marks
                  </option>
                </select>

                {/* Category */}
                <input
                  name="category"
                  value={rule.category}
                  onChange={changeRule}
                  placeholder="Category"
                  className={inputCls}
                />

                {/* Input From */}
                <input
                  name="inputFrom"
                  type="number"
                  step="any"
                  value={rule.inputFrom}
                  onChange={changeRule}
                  placeholder="Input From"
                  className={inputCls}
                />

                {/* Input To */}
                <input
                  name="inputTo"
                  type="number"
                  step="any"
                  value={rule.inputTo}
                  onChange={changeRule}
                  placeholder="Input To"
                  className={inputCls}
                />

                {/* Expected Rank From */}
                <input
                  name="expectedRankFrom"
                  type="number"
                  value={rule.expectedRankFrom}
                  onChange={changeRule}
                  placeholder="Expected Rank From"
                  className={inputCls}
                />

                {/* Expected Rank To */}
                <input
                  name="expectedRankTo"
                  type="number"
                  value={rule.expectedRankTo}
                  onChange={changeRule}
                  placeholder="Expected Rank To"
                  className={inputCls}
                />

              </div>

              <div className="flex gap-2">

                <Button
                  size="sm"
                  type="submit"
                >
                  {editingRuleId
                    ? "Update"
                    : "Save"}
                </Button>

                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={resetRule}
                >
                  Cancel
                </Button>

              </div>
            </form>
          )}

          {/* Rank Rules Table */}
          <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">

            <table className="w-full min-w-[900px] text-left text-xs">

              <thead>
                <tr className="border-b bg-muted/30">

                  <th className="px-3 py-2">
                    Exam
                  </th>

                  <th>
                    Session
                  </th>

                  <th>
                    Method
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Input Range
                  </th>

                  <th>
                    Expected Rank
                  </th>

                  <th className="px-3">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {rules.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b last:border-0"
                  >

                    {/* Exam */}
                    <td className="px-3 py-2">
                      {getExamName(item.examId)}
                    </td>

                    {/* Session */}
                    <td>
                      {getSessionName(
                        item.examSessionId,
                        ruleSessions
                      )}
                    </td>

                    {/* Method */}
                    <td>
                      {item.predictionMethod}
                    </td>

                    {/* Category */}
                    <td>
                      {item.category}
                    </td>

                    {/* Input Range */}
                    <td>
                      {item.inputFrom} -{" "}
                      {item.inputTo}
                    </td>

                    {/* Expected Rank */}
                    <td>
                      {item.expectedRankFrom} -{" "}
                      {item.expectedRankTo}
                    </td>

                    {/* Actions */}
                    <td className="px-3">
                      <div className="flex gap-1">

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            editRule(item)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            removeRule(item._id)
                          }
                        >
                          Delete
                        </Button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
}
