import { useEffect, useState } from "react";
import axios from "axios";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";

const NAVY = "#172554";
const API = "http://localhost:5001/api";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const QATab = ({ college }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answersLoading, setAnswersLoading] = useState(false);

  const token = localStorage.getItem("userToken");

  const fetchQuestions = async () => {
    if (!college?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/questions/college/${college._id}`);
      setQuestions(res.data.data || []);
    } catch {
      setQuestions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (college?._id) {
      fetchQuestions();
    }
  }, [college]);

  const handlePostQuestion = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (!questionText.trim()) return;
    try {
      await axios.post(
        `${API}/questions`,
        { collegeId: college._id, question: questionText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestionText("");
      fetchQuestions();
    } catch {
      // silent
    }
  };

  const openQuestionAnswers = async (q) => {
    setOpenQuestion(q);
    setAnswerText("");
    setAnswers([]);
    setAnswersLoading(true);
    try {
      const res = await axios.get(`${API}/questions/${q._id}`);
      setAnswers(res.data.data.answers || []);
    } catch {
      setAnswers([]);
    }
    setAnswersLoading(false);
  };

  const handlePostAnswer = async () => {
    if (!token) return;
    if (!answerText.trim() || !openQuestion) return;
    try {
      await axios.post(
        `${API}/questions/${openQuestion._id}/answers`,
        { answer: answerText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswerText("");
      const res = await axios.get(`${API}/questions/${openQuestion._id}`);
      setAnswers(res.data.data.answers || []);
    } catch {
      // silent
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`${API}/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(questions.filter((q) => q._id !== id));
      if (openQuestion?._id === id) {
        setOpenQuestion(null);
        setAnswers([]);
      }
    } catch {
      // silent
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!token) return;
    try {
      await axios.delete(`${API}/questions/answers/${answerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers(answers.filter((a) => a._id !== answerId));
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === openQuestion?._id
            ? { ...q, answerCount: q.answerCount - 1 }
            : q
        )
      );
    } catch {
      // silent
    }
  };

  const getUserName = (q) => q.userId?.name || "Anonymous";

  const loggedInName = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.name || "Student";
    } catch {
      return "Student";
    }
  })();

  return (
    <div className="space-y-5">
      {/* Ask a Question */}
      <Card className="rounded-lg border-slate-200 p-3.5">
        <div className="flex items-center gap-2.5 mb-3">
          <MessageCircle size={18} style={{ color: NAVY }} />
          <h2 className="text-[15px] font-semibold text-slate-900">
            Q&amp;A for {college?.name}
          </h2>
        </div>

        {token ? (
          <div className="space-y-3">
            <p className="text-[12px] text-slate-500">
              Posting as <span className="font-medium">{loggedInName}</span>
            </p>
            <Textarea
              placeholder="Ask a question about this college..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={3}
              className="text-[13px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuestionText("")}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handlePostQuestion}
                disabled={!questionText.trim()}
                className="text-white"
                style={{ backgroundColor: NAVY }}
              >
                Post Question
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-[12px] text-slate-500 mb-2">
              Log in to ask a question.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => (window.location.href = "/login")}
              style={{ borderColor: NAVY, color: NAVY }}
            >
              Login to Ask
            </Button>
          </div>
        )}
      </Card>

      {/* Questions List */}
      <div className="space-y-3">
        <h3 className="text-[13px] font-semibold text-slate-800">
          Questions ({questions.length})
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="rounded-lg border-slate-200 p-3.5"
              >
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 mb-2"></div>
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200"></div>
              </Card>
            ))}
          </div>
        ) : questions.length === 0 ? (
          <Card className="rounded-lg border-slate-200 p-6 text-center">
            <p className="text-[13px] text-slate-500">
              No questions yet. Be the first to ask!
            </p>
          </Card>
        ) : (
          questions.map((q) => (
            <Card
              key={q._id}
              className="rounded-lg border-slate-200 p-3.5 cursor-pointer transition-shadow hover:shadow-sm"
              onClick={() => openQuestionAnswers(q)}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                    {getUserName(q).charAt(0).toUpperCase() || "A"}
                  </div>
                  <div>
                    <span className="text-[12px] font-medium text-slate-800">
                      {getUserName(q)}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400">
                  {formatDate(q.createdAt)}
                </span>
              </div>

              <p className="text-[13px] text-slate-700 mb-2 leading-5">
                {q.question}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {q.answerCount || 0}{" "}
                  {q.answerCount === 1 ? "Answer" : "Answers"}
                </span>

                {token && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(q._id);
                    }}
                    className="h-6 px-2 text-[10px] text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>


      {openQuestion && (
        <Card className="rounded-lg border-slate-200 p-3.5">
          <div className="border-t-2 border-slate-100 pt-3.5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                  {getUserName(openQuestion).charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <span className="text-[12px] font-medium text-slate-800">
                    {getUserName(openQuestion)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {" "}
                    · {formatDate(openQuestion.createdAt)}
                  </span>
                </div>
              </div>

              <span className="text-[12px] text-slate-400">
                Asked {formatDate(openQuestion.createdAt)}
              </span>
            </div>

            <p className="text-[13px] text-slate-700 mb-3 leading-5">
              {openQuestion.question}
            </p>

            <button
              onClick={() => setOpenQuestion(null)}
              className="text-[11px] text-slate-500 underline hover:text-slate-800 mb-3"
            >
              ← Back to all questions
            </button>

            <div className="space-y-3 mt-3">
              <h4 className="text-[12px] font-medium text-slate-700">
                Answers ({answers.length})
              </h4>

              {answersLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-3 w-full animate-pulse rounded bg-slate-200"
                    ></div>
                  ))}
                </div>
              ) : answers.length === 0 ? (
                <p className="text-[12px] text-slate-400">
                  No answers yet. Be the first to answer!
                </p>
              ) : (
                answers.map((a) => (
                  <div
                    key={a._id}
                    className="rounded-md border border-slate-100 bg-slate-50/50 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                          {a.userId?.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div>
                          <span className="text-[12px] font-medium text-slate-800">
                            {a.userId?.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {" "}
                            · {formatDate(a.createdAt)}
                          </span>
                        </div>
                      </div>

                      {token && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAnswer(a._id)}
                          className="h-5 px-1.5 text-[10px] text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      )}
                    </div>

                    <p className="text-[12.5px] text-slate-600 mt-2 leading-5">
                      {a.answer}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Answer Form */}
            {token ? (
              <div className="mt-4 space-y-3">
                <Textarea
                  placeholder="Write your answer..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows={3}
                  className="text-[13px]"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handlePostAnswer}
                    disabled={!answerText.trim()}
                    className="text-white"
                    style={{ backgroundColor: NAVY }}
                  >
                    Post Answer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <p className="text-[11px] text-slate-500 mb-2">
                  Log in to post an answer.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => (window.location.href = "/login")}
                  style={{ borderColor: NAVY, color: NAVY }}
              >
                  Login to Answer
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
