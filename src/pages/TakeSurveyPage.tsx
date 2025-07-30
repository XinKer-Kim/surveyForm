import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { ClipboardX } from "lucide-react";

const TakeSurveyPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState("");
  const [formEndTime, setFormEndTime] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!formId) return;

    const fetchForm = async () => {
      const { data: form } = await supabase
        .from("forms")
        .select("title, end_time")
        .eq("id", formId)
        .single();

      setFormTitle(form?.title ?? "");
      setFormEndTime(form?.end_time ?? null);

      const { data: qs } = await supabase
        .from("questions")
        .select("id, text, type, required, options(id, label)")
        .eq("form_id", formId)
        .order("order_number", { ascending: true });

      setQuestions(qs || []);
    };

    fetchForm();
  }, [formId]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const user_id = "1dd927e3-2b9d-4d7a-a23d-578e1934bac3"; // 추후 auth로 교체

    const { data: responseRow, error } = await supabase
      .from("responses")
      .insert({ user_id, form_id: formId })
      .select()
      .single();

    if (error || !responseRow) {
      alert("응답 저장 실패");
      return;
    }

    const answersToInsert = questions.map((q) => {
      const value = answers[q.id];

      const isOptionType = ["radio", "dropdown"].includes(q.type);
      const isTextType = ["text_short", "text_long"].includes(q.type);
      const isNumericType = ["star", "score"].includes(q.type);

      return {
        response_id: responseRow.id,
        question_id: q.id,
        text_answer:
          isTextType || isNumericType ? value?.toString() ?? null : null,
        option_id: isOptionType ? value ?? null : null,
      };
    });

    await supabase.from("answers").insert(answersToInsert);

    alert("응답이 제출되었습니다!");
    navigate("/bookmarks");
  };

  // ✅ 설문 종료 여부 체크
  if (formEndTime && new Date(formEndTime) < new Date()) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-500">
        <ClipboardX className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold">설문이 종료되었습니다.</h2>
        <p className="text-sm mt-2">더 이상 응답할 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{formTitle}</h1>

      {questions.map((q, i) => (
        <div key={q.id} className="mb-6">
          <p className="mb-2 font-medium">
            Q{i + 1}. {q.text} {q.required && "*"}
          </p>
          {q.type === "text_short" && (
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
          )}
          {q.type === "radio" && (
            <div className="space-y-2">
              {q.options.map((opt: any) => (
                <label key={opt.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.id}
                    checked={answers[q.id] === opt.id}
                    onChange={() => handleAnswerChange(q.id, opt.id)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          )}
          {q.type === "text_long" && (
            <textarea
              className="w-full border p-2 rounded resize-none h-32"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
          )}
          {q.type === "dropdown" && (
            <select
              className="w-full border p-2 rounded"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            >
              <option value="" disabled>
                선택하세요
              </option>
              {q.options.map((opt: any) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          {q.type === "star" && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`cursor-pointer text-2xl ${
                    (answers[q.id] || 0) >= n
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleAnswerChange(q.id, n)}
                >
                  ★
                </span>
              ))}
            </div>
          )}
          {q.type === "score" && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-2">
                {[...Array((q.max ?? 5) - (q.min ?? 0) + 1)].map((_, idx) => {
                  const score = (q.min ?? 0) + idx;
                  return (
                    <button
                      key={score}
                      className={`w-8 h-8 rounded-full border ${
                        answers[q.id] === score ? "bg-blue-500 text-white" : ""
                      }`}
                      onClick={() => handleAnswerChange(q.id, score)}
                    >
                      {score}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-sm text-gray-500 px-2">
                <span>{q.leftLabel}</span>
                <span>{q.rightLabel}</span>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button onClick={handleSubmit}>제출하기</Button>
    </div>
  );
};

export default TakeSurveyPage;
